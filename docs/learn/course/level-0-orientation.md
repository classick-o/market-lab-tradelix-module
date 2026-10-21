# Nivelul 0 · Orientation

**The trailhead.** Primul nivel al cursului: 2 unități, 12 lecții, în jur de 70 de minute. Harta urmează arhitectura și formatul din [README.md](README.md) (§2–§10). Titlurile, obiectivele și textele de UI sunt în engleză, ca în aplicație; restul e în română.

---

## Introducerea nivelului

**Pentru cine:** cine n-a tranzacționat niciodată și n-a citit nimic despre piețe. Nivelul nu cere nimic de dinainte: niciun termen și niciun calcul în afară de procente, înmulțiri și împărțiri.

**Ce poate face utilizatorul la final:**
- explică o piață ca pe o licitație între cumpărători și vânzători și spune cine poate fi de cealaltă parte a unui trade;
- numește clasele de active și prin ce diferă (ore, levier, costuri, gap-uri, contraparte);
- deosebește investiția de trading și compară orice rezultat cu benchmark-ul pasiv („the benchmark ghost”), după costuri;
- citează cifrele oneste (74–89% din conturile CFD retail din UE pierd bani; 97% din day traderii persistenți din Brazilia au pierdut; sub 1% din cei din Taiwan câștigă în mod previzibil) și explică de ce și decizia de a nu tranzacționa cu bani reali e un rezultat valid al cursului;
- judecă o decizie separat de rezultatul ei și recunoaște outcome bias;
- calculează valoarea așteptată a unui joc simplu și arată de ce un joc care câștigă des poate pierde în medie;
- se așteaptă la serii lungi de pierderi și la eșantioane înșelătoare: 20 de trade-uri nu dovedesc o metodă;
- recunoaște că hazardul desenează trenduri, range-uri și „niveluri” și pune întrebarea corectă: „mai des decât pe date aleatoare, după costuri?”;
- știe ce notează simulatorul (Decision Quality, Risk Discipline, Simulated Outcome) și ce înseamnă notele de dovezi.

**Etapa de trecere 0 → 1** (README §5). Acordă nivelul și insigna, nu blochează nimic:
- **Quiz-ul „process vs outcome”:** 5 itemi din banca 0.2.1 și 0.2.6 (carduri de decizie cu rezultatul ascuns până după notă), trecut la ≥ 4/5;
- **Quiz-ul de valoare așteptată:** 5 itemi din banca 0.2.2–0.2.3 (2 numerici, 2 grilă, 1 scenariu), trecut la ≥ 4/5;
- ambele se pot relua, cu itemi nefolosiți. Nimic din etapă nu depinde de un rezultat simulat.

**Firele din spirală la Nivelul 0** (README §4):

| Fir | Ce apare aici | Unde |
|---|---|---|
| **Risc** | ce înseamnă să pierzi: cifrele retail, seriile de pierderi, un joc care câștigă des și pierde în medie | 0.1.5, 0.2.2, 0.2.3 |
| **Statistică** | valoarea așteptată, varianța, seriile, mărimea eșantionului | 0.2.2–0.2.4 |
| **Psihologie** | proces vs rezultat; noroc vs abilitate | 0.2.1, 0.2.6 |
| **Proces** | cum se învață aici: cele trei scoruri, fazele lecției, notele de dovezi | 0.1.6 |
| **Dovezi** | hazardul face pattern-uri; supraviețuitorii arată ca experți | 0.2.5, 0.2.6 |
| **Costuri** | există și se scad mereu: benchmark-ul după costuri, ratele retail | 0.1.4, 0.1.5 |

**Convenții pentru acest nivel:**
- Graficele din 0.1 sunt `Line` (fără lumânări). Primele lumânări apar în 0.2.5, cu o singură propoziție: "Each candle is one hour of LABX; you'll learn to read them in 1.2.1."
- Termenul **R** nu se folosește la Nivelul 0. Rezultatele sunt în vUSD sau în mize („win 2, lose 1”); 1.4.2 le dă numele R.
- Cifrele de probabilitate din lecții sunt calculate exact (binomial sau programare dinamică), nu din simulări. Laboratoarele arată simulări, dar sarcinile verifică valori exacte.
- Lumea simulată e cea din [../README.md](../README.md): LABX, vUSD, cont 10,000.00, spread 0.10, comision 0.05% pe fiecare execuție, rotunjit în sus la cent, fără levier.

---

## Unitatea 0.1 · Welcome to the markets

- **Scop:** ce e o piață și cine e în ea; prin ce diferă clasele de active; ce înseamnă să investești și să tranzacționezi și cu ce se compară orice rezultat; cifrele oneste despre traderii retail; cum funcționează cursul și simulatorul.
- **De ce aici:**
  - mecanica vine înaintea analizei (R1 §3.2, principiul 1), iar onestitatea înaintea primului trade (README §1.8; R5 §10 Nivelul 0: RR-07 → RR-01 → RR-04; R6 §7 Stage 0);
  - ordinea internă: piața (0.1.1) și oamenii din ea (0.1.2) înaintea produselor (0.1.3); produsele înaintea benchmark-ului, pentru că benchmark-ul e un indice (0.1.4); benchmark-ul înaintea cifrelor oneste, pentru că cifrele arată că majoritatea nu-l bat (0.1.5); la final, cum se învață aici, ca răspuns la cifre (0.1.6), lecție care pregătește 0.2.1;
  - față de lista „Despre” din README §3, turul claselor de active vine înaintea benchmark-ului, iar lecția despre curs și simulator vine la final. Subiectele sunt aceleași.
- **Cere de dinainte:** nimic.
- **Checkpoint:** bancă nouă `test-orientation_markets`, 10 itemi (pool de check: 2 × d1, 2 × d2, 1 × d3): licitația, contrapartea, clasele de active, benchmark-ul după costuri, ratele retail, cele trei scoruri, notele de dovezi. La ≥ 80%, cele 6 lecții se marchează „Tested out”.
- **Laboratorul unității:** „Market tour”: o sesiune scurtă în Arena: bullish, cu benchmark ghost-ul vizibil și fără obiectiv de profit. La final utilizatorul citește cele trei scoruri, comparația cu ghost-ul și costurile plătite.
- **Firele din spirală:** Costuri (există, se scad mereu), Dovezi (notele, ratele de bază), Proces (cum se învață aici), Risc (ce înseamnă să pierzi, la nivel de populație).
- **Surse:** R1 §1.7, §2.1 (MB-01 … MB-08), §3.2, §4 (punctele 6, 8, 9, 17); R3 §1.2–§1.4, §1.9, §1.11; R5 RR-01, RR-02, RR-04, RR-07; R6 §0.4, §1.1, §1.6, §2.16, §3.0.
- **Widget-uri și laboratoare noi:** `auction-book`, `card-sort` (sortare de carduri pe categorii, refolosit în tot cursul), `benchmark-ghost`, `trade-tagger` (refolosit în 1.6.6), `score-preview`.

#### 0.1.1 · What a market is: an auction
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Explain a market price as the price at which a buyer and a seller last agreed.
  2. Find the price at which the most units change hands in a simple auction.
  3. Predict which way price moves when buyers are more eager than sellers.
- **Concepte:** market-as-auction (nou)
- **Se sprijină pe:** —
- **Hook:** predict · alegere: "LABX last traded at 100.00. A buyer arrives who wants 200 units right now, and only a few sellers are offering. Where will the next trades print?" — "Below 100.00" / "Around 100.00" / "Above 100.00". Răspunsul așteptat e „Above 100.00”: cumpărătorul grăbit urcă la prețurile cerute de vânzători. Nu se notează; recap-ul îl compară cu B5.
- **Interacțiunea centrală:**
  - B1 explain: o piață e locul unde se întâlnesc ordinele de cumpărare și de vânzare. Prețul de pe grafic e ultimul preț la care un cumpărător și un vânzător au căzut de acord. Nimeni nu „setează” prețul.
  - B2 figure: două cozi de ordine, câte o unitate fiecare. Cumpărători (cel mult): 100.30, 100.20, 100.00, 99.95, 99.80. Vânzători (cel puțin): 99.70, 99.85, 100.00, 100.05, 100.25.
  - B3 predict cu slider de preț (99.70–100.30, pas 0.05): "Where do the most units change hands?" Răspuns: 100.00, cu 3 unități; la 99.95 și la 100.05 se schimbă doar câte 2. Reveal-ul numără, la fiecare preț, cumpărătorii dispuși și vânzătorii dispuși.
  - B4 figure: după licitație rămân cea mai bună cerere, 99.95, și cea mai bună ofertă, 100.05. Distanța de 0.10 e previzualizarea spread-ului (1.1.1); mijlocul lor, 100.00, e ce desenează graficul LABX.
  - B5 reveal: sosește un cumpărător care vrea 2 unități și plătește cel mult 100.20. Ia o unitate de la 100.05, deci ultimul preț urcă la 100.05. Următorul vânzător cere 100.25, peste limita lui, așa că a doua unitate rămâne în așteptare, ca cerere la 100.20.
  - B6 callout: "Price moves when one side is in more of a hurry than the other. Nobody sets it; orders do."
- **Try:** `auction-book` (widget nou): două cozi de ordine și un preț de licitație care se trage pe axă; rândurile „Buyers willing”, „Sellers willing” și „Units traded” se actualizează live.
  - Sarcina: "Set the price where the most units change hands." Cartea: cumpărători 50.40, 50.30, 50.20, 50.10; vânzători 50.00, 50.10, 50.20, 50.50.
  - Reușită: 50.20, cu 3 unități (la 50.10 și la 50.30 doar 2).
  - Indicii: 1. "Count the buyers who'd pay at least this price." 2. "Count the sellers who'd accept at most this price." 3. "Units traded = the smaller of the two counts."
- **Practică:** laboratorul `auction-book` cu 3 cărți de ordine noi, generate.
- **Check:** Q1 (mcq, d1) ce înseamnă prețul afișat: ultimul acord dintre un cumpărător și un vânzător; Q2 (numeric, d2) prețul de licitație pe o carte nouă de 4 + 4 ordine; Q3 (scenario, d2) de ce urcă prețul când cumpărătorii acceptă prețurile vânzătorilor.
- **Dovezi:** Mechanic: licitația, cartea de ordine și formarea prețului (R3 §1.2, §1.3, §1.4; R1 MB-01).
- **Necesită:** — (licitația se calculează în widget, fără motorul de simulare).
- **Termeni noi de glosar:** `market`, `auction`, `order`

#### 0.1.2 · Who trades, and why
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Name the main market participants and the reason each one trades.
  2. Explain that every trade has a counterparty with its own horizon and information.
  3. Describe why retail traders usually face better-equipped counterparties.
- **Concepte:** market-participants (nou)
- **Se sprijină pe:** 0.1.1
- **Hook:** predict · alegere: "Every time you buy 50 LABX, someone sells you 50. Who is most likely on the other side?" — "Someone who thinks price will fall" / "A dealer or market maker who earns the spread" / "Can't tell from the chart". Oricare poate fi; în multe piețe retail (FX, CFD) contrapartea e un dealer sau chiar brokerul, iar graficul nu arată cine. Nu se notează; recap-ul spune că „Can't tell from the chart” e citirea onestă.
- **Interacțiunea centrală:**
  - B1 explain: fiecare trade are două părți. Cine îți vinde nu „greșește” neapărat: are alt orizont, altă nevoie sau altă informație.
  - B2 figure: harta participanților, construită card cu card: hedgeri (reduc un risc pe care îl au deja), investitori (randament pe ani), instituții (sume mari, execuție cu algoritmi, grijă la impact), market makers (cotează ambele părți, câștigă spread-ul, poartă stocul), speculatori și traderi (profit din mișcarea prețului), bănci centrale, retail.
  - B3 match, 5 perechi motiv ↔ participant: "Locks in next year's fuel cost" ↔ Hedger; "Earns the spread, ends the day flat" ↔ Market maker; "Holds for decades for dividends and growth" ↔ Investor; "Buys because it expects a rise this week" ↔ Speculator; "Splits a huge order over the day to avoid moving the price" ↔ Institution.
  - B4 explain: instituțiile se tem de impactul propriilor ordine, retail-ul de costuri și de propriul comportament (R3 §1.9, „Institutions vs retail”).
  - B5 predict: "'They hunted my stop.' Who is 'they'?" — "A big trader watching my account" / "Nobody in particular: stops gather at obvious levels" / "The app". Piața nu e o persoană. Stop-urile adunate la niveluri evidente există (1.5.5), dar intenția cuiva nu se poate citi din grafic.
  - B6 callout: "When you trade, you trade against people and firms who do this full time, often with better tools and lower costs. Plan with that in mind."
- **Try:** `card-sort` (widget nou), 6 carduri ↔ participant. Reușită: toate 6 corecte.
  - "An airline buys oil futures to fix next year's fuel cost" → Hedger
  - "A pension fund buys 2 million shares over the day with a VWAP algorithm" → Institution
  - "A firm quotes a bid and an ask all day and ends flat" → Market maker
  - "You buy LABX because you expect a rise this week" → Speculator
  - "A saver adds 200.00 to an index fund every month" → Investor
  - "A central bank sells its own currency to slow a rise" → Central bank
- **Practică:** laboratorul `card-sort` cu alte 6 carduri; recapitulare în Practice.
- **Check:** Q1 (mcq, d1) ce e contrapartea; Q2 (scenario, d2) de ce tranzacționează un hedger chiar dacă se așteaptă la o pierdere pe contract; Q3 (mcq, d2) de ce „they hunted my stop” nu e o explicație.
- **Dovezi:** Mechanic pentru tipologia participanților (Harris; R3 §1.9 [BK]; R1 MB-08). În FX, dealerii internalizează peste 80% din tranzacțiile clienților (BIS 2025; R3 §1.2, §1.11; EMP+, de reverificat cifra la publicare). Stop-urile adunate la niveluri evidente: B (Osler; R3 §5.1).
- **Necesită:** — (mai târziu, opțional: generator cu agenți etichetați și raportul „who traded with you”, R3 §1.9 și Anexa A3).
- **Termeni noi de glosar:** `counterparty`, `hedger`, `speculator`, `retail-trader`

#### 0.1.3 · A tour of the asset classes
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Name the main asset classes and one feature that sets each apart.
  2. Compare asset classes by trading hours, typical leverage, costs and gap risk.
  3. Explain which habits transfer from LABX to any instrument and which numbers don't.
- **Concepte:** asset-classes (nou)
- **Se sprijină pe:** 0.1.2
- **Hook:** predict · alegere: "It's Saturday. Which of these can you trade right now?" — "Shares on a stock exchange" / "A futures contract" / "EUR/USD" / "Bitcoin". Răspuns: Bitcoin. Crypto spot e 24/7; FX merge 24 de ore de duminică seara până vineri; futures aproape 24 de ore în aceleași zile; acțiunile, doar în sesiunea bursei (R6 §3.0). Nu se notează.
- **Interacțiunea centrală:**
  - B1 explain: o clasă de active e un tip de instrument cu reguli, ore și costuri proprii.
  - B2 figure: 8 carduri după tabelul din R6 §3.0 (stocks and ETFs, indices, forex, futures, commodities, crypto, bonds, CFDs); pe fiecare: ore, levier retail tipic, costuri principale, risc de gap, contraparte. Opțiunile apar ca previzualizare, cu trimitere la 4.1.
  - B3 match, 6 perechi trăsătură ↔ clasă: "Expires and must be rolled" ↔ Futures; "Quoted as a pair, one currency against another" ↔ Forex; "Trades 24/7" ↔ Crypto; "Shorting needs borrowed shares" ↔ Stocks; "You never own the asset; the provider is your counterparty" ↔ CFDs; "Price falls when interest rates rise" ↔ Bonds.
  - B4 explain: ce se transferă de la LABX la orice instrument (bid și ask, costuri, risc pe trade, stop, dimensionare) și ce nu (ore, levier, costuri specifice, expirare). Specificul vine în 2.14 și 3.14.
  - B5 callout: "LABX is synthetic: one liquid instrument, a fixed 0.10 spread, no expiry and no leverage. The habits transfer; the numbers change."
- **Try:** `card-sort`, 8 descrieri de produs ↔ clasă. Reușită: 8/8.
  - "100 shares of a listed company" → Stocks; "A fund that tracks 500 large companies" → ETFs and indices; "EUR/USD" → Forex; "One gold futures contract" → Futures; "A CFD on a stock index" → CFDs; "A government bond paying a coupon" → Bonds; "Bitcoin on an exchange" → Crypto; "The right to buy a share at a fixed price before a date" → Derivatives.
- **Practică:** laboratorul `card-sort` cu alte 8 produse; recapitulare.
- **Check:** Q1 (mcq, d1) ce piață e deschisă 24/7; Q2 (mcq, d2) ce înseamnă expirarea și roll-ul unui contract futures; Q3 (scenario, d2) cine e contrapartea la un CFD și de ce contează.
- **Dovezi:** Mechanic (R6 §3.0; R1 MB-03, DL-02). Plafoanele de levier ESMA (30:1 … 2:1) sunt reglementare datată (R1 §1.7; R6 §0.2): se verifică la publicare și se afișează cu dată.
- **Necesită:** — (S10, specificațiile pe clase de active, intră abia la practica din 2.14 și 3.14).
- **Termeni noi de glosar:** `asset-class`, `stock`, `etf`, `index`, `forex`, `futures`, `commodity`, `cfd`, `cryptocurrency`, `bond`, `derivative`

#### 0.1.4 · Investing, trading and the benchmark
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Distinguish investing from trading by holding period, turnover and source of return.
  2. Compare an active result with the buy-and-hold benchmark on the same market, after costs.
  3. Explain why frequent trading needs a larger edge to beat the benchmark.
- **Concepte:** passive-benchmark (nou), trading-styles (nou)
- **Se sprijină pe:** 0.1.3
- **Hook:** predict · alegere: "Over one year, Dana traded LABX 40 times and finished +6.0% after costs. Buying on day one and holding finished +9.0%. Who did better?" — "Dana: she was active and profitable" / "Buy-and-hold" / "The same". Răspuns: buy-and-hold, cu 3 puncte mai mult și fără efort. O comparație completă ar ține cont și de risc (previzualizare 2.11). Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: investiția înseamnă să deții active pentru randamentul lor pe ani (dividende, cupoane, prima de risc), cu puține tranzacții. Tradingul caută profit din schimbările de preț, pe orizonturi scurte, pe baza unui avantaj anume.
  - B2 figure `Bars` orizontale: spectrul stilurilor (R6 §1.1): scalping (secunde–minute, zeci–sute de trade-uri pe săptămână), day trading (închis în aceeași zi), swing (zile–săptămâni), position (săptămâni–luni), investing (ani). Pe fiecare: timpul la ecran și sensibilitatea la costuri. Previzualizare pentru 2.9.
  - B3 explain: înainte de costuri, tradingul e aproape sumă nulă față de piață; după costuri, e sumă negativă pentru participantul median (R6 §1.6; R1 MB-02).
  - B4 figure „the benchmark ghost”: curba unui trader activ și, pe aceeași piață sintetică, curba buy-and-hold, ambele după costuri. Pașii arată cum costurile coboară curba activă la fiecare trade.
  - B5 worked „The most active fifth”: "66,465 households, 1991–96.", "The most active fifth earned 11.4% a year.", "The market earned 17.9%.", "Gap = 17.9 − 11.4 = ?" Răspuns: 6.5 puncte (toleranță 0). După răspuns: "Costs and frequency explained the gap, not the choice of stocks." (Barber & Odean; R5 RR-02).
  - B6 callout: "Every result in this course is shown after costs, next to the benchmark ghost. Beating it is the real test, and most active traders don't."
- **Try:** `benchmark-ghost` (widget nou): rezultat brut +10.0%, ghost +6.0%, cost ≈ 0.2% din cont pe round trip (o poziție cât contul, 99 de unități la 100.00, plătește în jur de 19.80 în spread și comision; vezi 1.1.1); slider „Number of trades” 0–60.
  - Sarcina: "Each round trip costs about 0.2% of the account. Find how many trades pull this +10.0% result down to the ghost's +6.0%."
  - Reușită: 20 de trade-uri (10.0 − 20 × 0.2 = 6.0). Eticheta din widget: "About, ignoring compounding."
  - Indicii: 1. "Costs add up per trade." 2. "The gap to close is 10.0 − 6.0 = 4.0 points." 3. "4.0 ÷ 0.2 per trade = ?"
- **Practică:** Arena: bullish, cu ghost-ul pe ecranul de final (piață în trend, unde buy-and-hold e greu de bătut).
- **Check:** Q1 (mcq, d1) investing vs trading; Q2 (numeric, d2) un rezultat activ după costuri comparat cu ghost-ul; Q3 (scenario, d2) de ce un stil cu multe trade-uri are nevoie de un avantaj mai mare.
- **Dovezi:** Barber & Odean 2000 (R5 RR-02, PSY-06; R1 §4.6): nota A pentru „frecvența mare scade randamentul net al investitorilor retail” (eșantion mare; e despre acțiuni, nu despre CFD-uri). Buy-and-hold ca benchmark: A (R6 §2.16). Sumă negativă după costuri: Mechanic (R6 §1.6).
- **Necesită:** curba „benchmark ghost” în Arena și în Analytics. README §4 o cere peste tot, dar nu are cod S; propun s-o adăugăm la S15.
- **Termeni noi de glosar:** `benchmark`, `buy-and-hold`, `scalping`, `day-trading`, `swing-trading`, `position-trading`

#### 0.1.5 · The honest numbers
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. State the share of retail CFD accounts that lose money and where the figure comes from.
  2. Match the most common reasons retail traders fail to the parts of this course that address them.
  3. Explain why deciding not to trade with real money is a valid outcome of the course.
- **Concepte:** retail-loss-rates (nou), when-not-to-trade (nou), base-rates ✓
- **Se sprijină pe:** 0.1.4
- **Hook:** predict · slider 0–100, pas 1: "Out of every 100 retail CFD accounts in the EU, how many lose money?" Răspuns: între 74 și 89 (analizele regulatorilor naționali, citate de ESMA în 2018). Recap: "You guessed {yours}. Regulators found 74 to 89."
- **Interacțiunea centrală:**
  - B1 explain: în UE și UK, furnizorii de CFD-uri trebuie să afișeze procentul de conturi retail care pierd. E o rată de bază, nu o opinie.
  - B2 figure `Bars`, pe rând: ESMA, 74–89% (pierderi medii de €1,600 – €29,000 pe client); FCA, 82% (eșantion din 2016); AMF Franța, ≈ 89% din 14,799 de clienți activi (2009–2012); Brazilia, 97% din cei care au făcut day trading peste 300 de zile au pierdut; Taiwan, sub 1% din day traderi câștigă în mod previzibil după comisioane.
  - B3 match, cauză ↔ unde o tratează cursul (R5 RR-04): "No stop, too big a size" ↔ 1.4 Risk comes first; "Costs on many small trades" ↔ 1.1 și 1.7; "Doubling after losses" ↔ 1.8 Danger zone; "No plan, no review" ↔ 1.6; "Revenge after a loss" ↔ 1.7; "Judging a method on a few trades" ↔ 0.2.
  - B4 predict: "You finish this course with great results in the simulator. What does that tell you about trading real money?" — "That I'm ready" / "Very little on its own" / "That I've found an edge". Răspuns: „Very little on its own”: piață sintetică, fără frică reală, eșantion mic (R5 RR-07).
  - B5 explain: un rezultat valid al cursului e și decizia de a nu face day trading cu bani reali, sau de a investi pasiv. Cursul urmărește competența în risc și în decizie, care se transferă și în afara tradingului (R5 RR-07; README §1, principiul 8).
  - B6 callout: "If you ever trade real money: only money you can afford to lose (1.6.2), only with a regulated broker (1.8.4)."
- **Try:** `trade-tagger` (widget nou): luna unui trader sintetic, 10 trade-uri cu toate datele (stop, mărime, timpul față de pierderea anterioară, setup). Utilizatorul marchează tiparele de eșec cu etichetele aplicației: `no_stop`, `oversized`, `revenge_size_up`, `chased_entry`, `overtrading` (exercițiul „failure-mode bingo” din R5 RR-04).
  - Reușită: toate cele 5 tipare marcate pe trade-urile corecte, fără etichete puse greșit.
  - Indicii: 1. "Start with the easy one: which trades had no stop?" 2. "Compare each size with the one before a loss." 3. "Count the trades per day."
- **Practică:** laboratorul `trade-tagger` cu o altă lună; recapitulare.
- **Check:** Q1 (numeric, d1) intervalul ESMA; Q2 (mcq, d2) ce arată și ce nu arată studiul din Brazilia (cei persistenți, nu toți cei care au încercat); Q3 (scenario, d2) ce spune un rezultat bun în simulator despre banii reali.
- **Dovezi:** date de regulator și studii pe populații întregi: ESMA, FCA, AMF (R5 RR-01; R1 §1.7), Brazilia și Taiwan (R5 RR-02; R1 §4.9). Nota A pentru „majoritatea traderilor retail pierd”. Cifrele exacte se afișează cu sursa și anul.
- **Necesită:** — (widget nou; etichetele există deja în `packages/evaluation/src/tags.ts`).
- **Termeni noi de glosar:** `risk-warning`, `regulator`

#### 0.1.6 · How this course and the simulator work
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Describe the simulated world: LABX, vUSD, the 10,000.00 account, the spread and the commission.
  2. Tell the three scores apart and name the actions that move each one.
  3. Read an evidence grade and say what it does and doesn't promise.
- **Concepte:** process-scores (nou), evidence-grades (nou), decision-quality ✓
- **Se sprijină pe:** 0.1.5
- **Hook:** predict · alegere: "Your Arena account grows from 10,000.00 to 12,000.00 vUSD in one week. Which score does that raise?" — "Decision Quality" / "Risk Discipline" / "Only Simulated Outcome". Răspuns: doar Simulated Outcome. Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: lumea simulată: LABX sintetic, prețuri în vUSD, cont de 10,000.00, lumânări de 1 oră, spread 0.10 (bid = mid − 0.05, ask = mid + 0.05), comision 0.05% la fiecare execuție, rotunjit în sus la cent, risc de 1% în misiuni și 2% în Arena, fără levier.
  - B2 figure: cele trei scoruri, pe rând. Decision Quality: raționamentul, cu informația pe care o aveai atunci. Risk Discipline: stop la fiecare intrare, risc în limită, stop nelărgit, mărime care nu crește după o pierdere. Simulated Outcome: profitul simulat, afișat, dar nefolosit la notare.
  - B3 match, 4 perechi acțiune ↔ scor: "Write the reason for the trade before entering" ↔ Decision Quality; "Place a stop with every entry" ↔ Risk Discipline; "Price happens to rise after you buy" ↔ Simulated Outcome; "Skip a setup that breaks your rules" ↔ Decision Quality.
  - B4 explain: cum merge o lecție (Hook → Learn → Try → Check → Recap), coada de recapitulare, „Tested out” la ≥ 80% în checkpoint, nimic blocat.
  - B5 figure: notele de dovezi Mechanic, A, B, C, D, F, cu câte un exemplu din README §6. Lângă nota A: "Even robust edges shrink after they are published: 26% less out of sample, 58% less after publication (McLean & Pontiff)."
  - B6 match, 5 perechi afirmație ↔ notă: "A round trip pays the spread" ↔ Mechanic; "Diversified trend following over decades" ↔ A; "Stops cluster just beyond round numbers" ↔ B; "Elliott waves predict turning points" ↔ D; "Doubling your size after each loss" ↔ F.
  - B7 callout: "Results here are always after costs and next to the benchmark ghost. A grade tells you how well an idea has held up when tested, not that it will work for you."
- **Try:** `score-preview` (widget nou): un bilet simplificat (entry 100.00, 40 de unități, stop on/off la 98.00, câmpul „Reason”) și cele trei bare de scor, care reacționează live.
  - Sarcina: "Make this trade earn full Risk Discipline and give Decision Quality something to grade."
  - Reușită: stop activ la 98.00 (pierdere la stop 80.00 + comision 2.00 + 1.96 = 83.96, sub 100.00) și câmpul „Reason” completat. Rezultatul simulat nu intră în condiție.
  - Indicii: 1. "Risk Discipline starts with a stop." 2. "Decision Quality needs your reason, written before entry."
- **Practică:** Arena: bullish, o primă sesiune de acomodare; pe ecranul de final, cele trei scoruri separate.
- **Check:** Q1 (mcq, d1) ce scor crește un profit simulat; Q2 (scenario, d2) o intrare fără stop care a câștigat; Q3 (mcq, d2) ce înseamnă nota D.
- **Dovezi:** — (lecție despre aplicație). Notele urmează R6 §0.4 și README §6; regula de prudență McLean & Pontiff vine din R6 §0.4.
- **Necesită:** — (scorurile există în `packages/evaluation`); ghost-ul, ca la 0.1.4.
- **Termeni noi de glosar:** `decision-quality`, `risk-discipline`, `simulated-outcome`, `evidence-grade` (propun și `lesson: "0.1.6"` pentru termenii existenți `simulation`, `synthetic-data`, `paper-trading`)

---

## Unitatea 0.2 · Thinking in probabilities

- **Scop:** proces vs rezultat; valoarea așteptată; varianța și seriile; mărimea eșantionului; hazardul care desenează pattern-uri; noroc vs abilitate.
- **De ce aici:**
  - „probabilități înainte de pattern-uri” (README §1, principiul 2); R1 §3.4, punctul 2: statistica de bază înaintea primului pattern sau indicator; R1 §4.3: lipsa statisticii duce la obsesia ratei de câștig și la judecăți pe eșantioane mici; R5 §10 Nivelul 0: PSY-14/PSY-30 → ST-14 → ST-01;
  - ordinea: întâi cum judeci o decizie (0.2.1), apoi unealta de bază (valoarea așteptată, 0.2.2), apoi de ce rezultatele se abat de la ea (varianța, 0.2.3) și cât de mult (eșantionul, 0.2.4), apoi cum te păcălesc graficele (0.2.5) și oamenii (0.2.6).
- **Cere de dinainte:** 0.1.6 (cele trei scoruri); restul unității 0.1, recomandat.
- **Checkpoint:** bancă nouă `test-probability_basics`, 12 itemi: clasificarea în cele 4 cutii, valoarea așteptată, seriile, eșantionul, random walk, survivorship. La ≥ 80%, cele 6 lecții se marchează „Tested out”. Quiz-urile etapei 0 → 1 se iau din aceeași bancă.
- **Laboratorul unității:** „Coin-flip trader”: 100 de jocuri cu aceeași regulă (câștig 2, pierdere 1, 40% șanse de câștig, valoare așteptată +0.20 pe joc). Utilizatorul aplică regula de fiecare dată, iar aplicația arată rezultatele pe blocuri de 20: un bloc de 20 se termină pe minus în 25% din cazuri, iar toate cele 100 de jocuri în 9% din cazuri (calcul binomial exact), în timp ce scorul de proces rămâne 100% (R5 ST-14, PSY-31).
- **Firele din spirală:** Statistică (EV, varianță, serii, eșantion), Psihologie (proces vs rezultat, noroc vs abilitate), Dovezi (hazardul face pattern-uri; supraviețuitorii), Risc (seriile de pierderi).
- **Surse:** R5 PSY-09, PSY-10 (previzualizare), PSY-14, PSY-30, PSY-31, ST-01, ST-05, ST-06, ST-11, ST-14; R3 §5.2, §7.2; R6 §0.5 (R0); R1 BT-02, PS-07, §3.3, §3.4, §4.3, §4.4.
- **Widget-uri și laboratoare noi:** `blind-grade` (refolosit în 1.7.4), `ev-machine`, `streak-sim` (refolosit în 1.7.3), `sample-lab`, `random-walk-lab` (S7), `guru-generator` (S7, refolosit în 1.8.3).

#### 0.2.1 · Process versus outcome
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Judge a decision by the information and reasoning available at the time, not by its result.
  2. Place any decision in one of four boxes: good or poor decision, good or bad outcome.
  3. Explain why people still grade decisions by their outcomes, even when told not to.
- **Concepte:** outcome-bias (nou), decision-quality ✓
- **Se sprijină pe:** 0.1.6
- **Hook:** predict · alegere: "A dice game: you win 10.00 if a 6 comes up and lose 10.00 on anything else. Ana plays once and wins. Bogdan declines. Who made the better decision?" — "Ana: she won" / "Bogdan" / "Can't tell". Răspuns: Bogdan: o șansă din șase să câștigi aceeași sumă pe care o pierzi în cinci cazuri din șase. Nu se notează.
- **Interacțiunea centrală:**
  - B1 explain: rezultatul vine din decizie și din noroc. Un singur rezultat nu spune cât de bună a fost decizia.
  - B2 figure: matricea 2 × 2 (decizie bună sau slabă × rezultat bun sau prost), construită cutie cu cutie: "Deserved success", "Bad luck", "Dumb luck", "Poetic justice" (R5 PSY-14).
  - B3 predict, „grade before reveal”: 4 decizii din afara tradingului (umbrela luată la 70% șanse de ploaie, într-o zi în care n-a plouat; un drum făcut cu viteză prea mare, ajuns la timp; pariul pe zar din hook, câștigat; o ofertă refuzată din motive bune, care a crescut apoi). Utilizatorul notează fiecare decizie 1–5 înainte de rezultat, vede rezultatul, apoi poate nota din nou. Aplicația arată dacă nota s-a mutat după rezultat.
  - B4 explain: Baron & Hershey (1988): aceleași decizii sunt notate mai bine când rezultatul e bun. O replicare preînregistrată din 2023 (n = 692) a găsit același efect, chiar și la cei care spuneau că rezultatul n-ar trebui să conteze.
  - B5 callout: "In MARKET//LAB the process grade comes first and the outcome second. A good decision that lost is still a good decision."
- **Try:** `blind-grade` (widget nou): 5 carduri de decizie (2 din trading simplu, cu stop și fără, și 3 din viața de zi cu zi). Utilizatorul alege „Good decision” sau „Poor decision” cu rezultatul ascuns, apoi, după reveal, pune cardul în una din cele 4 cutii.
  - Reușită: 5/5 în cutia corectă.
  - Același widget e baza quiz-ului „process vs outcome” din etapa 0 → 1.
- **Practică:** quiz-ul „process vs outcome” (etapa 0 → 1); recapitulare.
- **Check:** Q1 (scenario, d1) cutia potrivită pentru o decizie; Q2 (mcq, d2) de ce un singur rezultat nu judecă o decizie; Q3 (scenario, d2) recunoașterea lui „dumb luck” după un rezultat bun.
- **Dovezi:** A pentru existența efectului de outcome bias (Baron & Hershey 1988; replicare preînregistrată din 2023, n = 692; R5 PSY-14, PSY-30).
- **Necesită:** —
- **Termeni noi de glosar:** `outcome-bias`

#### 0.2.2 · Expected value
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Calculate the expected value of a simple game from its probabilities and payoffs.
  2. Show that a game that wins most of the time can still lose on average.
  3. Explain why expected value describes many plays, not the next one.
- **Concepte:** expected-value (nou)
- **Se sprijină pe:** 0.2.1
- **Hook:** predict · alegere: "Game A: a coin flip, win 15.00 or lose 10.00. Game B: win 1.00 nine times in ten, lose 12.00 once in ten. Which would you rather play 100 times?" — "Game A" / "Game B" / "The same". Răspuns: A, cu +2.50 pe joc (+250.00 la 100 de jocuri); B pierde 0.30 pe joc (−30.00 la 100). Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: valoarea așteptată (EV) e media rezultatelor, ponderată cu probabilitățile: cât aduce, în medie, un joc, după foarte multe jocuri.
  - B2 figure `Formula`: [0.5 × 15.00] − [0.5 × 10.00] = [+2.50]; cutiile se aprind pe rând.
  - B3 worked „Game B”: "Wins: 0.9 × 1.00 = 0.90.", "Losses: 0.1 × 12.00 = 1.20.", "EV = 0.90 − 1.20 = ?" Răspuns: −0.30 (toleranță 0). Feedback la +0.30: "Check the sign: the loss side is bigger."; la 0.90: "That's only the wins. Subtract the losses."
  - B4 explain: „probabil” nu înseamnă „așteptat”. B câștigă de nouă ori din zece și pierde în medie. Tiparul revine în 1.4.5 (L11) și în 1.8.1 (martingale).
  - B5 predict + reveal, cu `ev-machine` în modul de rulare: "Play game A 10 times. Will you be ahead?" — "Yes" / "No" / "Not necessarily". Se joacă 10 jocuri, apoi 1,000: media se apropie de +2.50. Text: "Over 10 plays, game A still ends behind about one time in six (17.2%)."
  - B6 callout: "An edge is a positive expected value after costs. It tells you nothing about the next play."
- **Try:** `ev-machine` (widget nou): controale pentru probabilitatea de câștig, câștig și pierdere; afișează EV-ul pe joc și la 100 de jocuri.
  - Sarcina: "This game wins 70% of the time and pays 1.00. Find the smallest loss (step 0.10) that makes its expected value negative."
  - Reușită: 2.40 (0.70 − 0.30 × 2.40 = −0.02; la 2.30, EV-ul e +0.01).
  - Indicii: 1. "EV = 0.70 × 1.00 − 0.30 × loss." 2. "Find where 0.30 × loss passes 0.70." 3. "0.70 ÷ 0.30 ≈ 2.33, so the next step up is the answer."
- **Practică:** quiz-ul de valoare așteptată (etapa 0 → 1); laboratorul `ev-machine` cu 3 jocuri noi.
- **Check:** Q1 (numeric, d1) EV-ul unui joc nou; Q2 (mcq, d2) un joc cu rată mare de câștig și EV negativ; Q3 (scenario, d2) EV-ul față de rezultatul unui singur joc.
- **Dovezi:** Mechanic (R5 ST-01; R1 BT-02).
- **Necesită:** —
- **Termeni noi de glosar:** `expected-value`, `probability`

#### 0.2.3 · Variance and streaks
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Explain variance as the spread of results around the expected value.
  2. Estimate how long losing streaks get over 100 independent trials.
  3. Recognise that a streak on its own is not evidence that something has changed.
- **Concepte:** variance (nou), streaks-and-runs (nou)
- **Se sprijină pe:** 0.2.2
- **Hook:** predict · slider 2–15, pas 1: "You flip a fair coin 100 times. What's the longest run of tails you expect to see?" Răspuns: în jur de 6–7 (≈ 6.6). O serie de 5 sau mai multe apare în 81.0% din secvențe, una de 6 sau mai multe în 54.6% (R5 ST-06). Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: varianța arată cât de împrăștiate sunt rezultatele în jurul valorii așteptate.
  - B2 figure `Line`: 5 drumuri ale jocului A din 0.2.2 (EV +2.50), câte 20 de jocuri; două se termină pe minus. Text: "A positive game still ends behind about 13% of the time after 20 plays, and about 2% after 100." (13.2% și 1.8%, binomial exact).
  - B3 predict „Human or coin?”: două secvențe de câte 30 de aruncări. Una e scrisă de un om (alternează des, cea mai lungă serie are 3), cealaltă e reală (are o serie de 5). "Which one came from a real coin?" Explicație: oamenii alternează prea des; seriile lungi sunt normale.
  - B4 worked: "Chance of 5 tails in a row from one given flip: 0.5 × 0.5 × 0.5 × 0.5 × 0.5 = ?" Răspuns: 3.1% (toleranță 0.1). După răspuns: "But a run can start almost anywhere in 100 flips, so a run of 5 shows up somewhere 81% of the time."
  - B5 figure `Bars`: probabilitatea a cel puțin unei serii de ≥ k pierderi în 100 de încercări, la 50% și la 40% șanse de câștig: k = 5: 81.0% / 97.6%; k = 6: 54.6% / 87.3%; k = 8: 17.0% / 49.0%; k = 10: 4.4% / 20.5% (R5 ST-06).
  - B6 callout: "A losing streak is what randomness looks like. On its own it doesn't prove a method stopped working (1.6.6), and it doesn't make a win 'due' (1.7.3)."
- **Try:** `streak-sim` (widget nou): rata de câștig (30–70%) și lungimea seriei k; afișează probabilitatea exactă și o histogramă a celei mai lungi serii din 1,000 de secvențe simulate.
  - Sarcina: "At a 40% win rate, find the longest losing run that still shows up in at least half of all 100-trade sequences."
  - Reușită: 7 (68.9%; la 8, 49.0%).
  - Indicii: 1. "Set the win rate to 40% first." 2. "Raise k until the chance drops below 50%." 3. "The answer is the last k at or above 50%."
- **Practică:** laboratorul `streak-sim`; itemul de scenariu din quiz-ul de valoare așteptată.
- **Check:** Q1 (mcq, d1) cât de probabilă e o serie de 5 la 50%, în 100 de încercări; Q2 (numeric, d2) probabilitatea unei serii care începe la o anumită încercare; Q3 (scenario, d2) ce spune și ce nu spune o serie de 6 pierderi.
- **Dovezi:** Mechanic (calcul exact; R5 ST-06, ST-14).
- **Necesită:** —
- **Termeni noi de glosar:** `variance`, `losing-streak`

#### 0.2.4 · How many trades before you know?
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Explain why a win rate measured on 20 trades is a wide range, not a single number.
  2. Estimate how the plausible range narrows as the number of trades grows.
  3. Judge methods on large samples and single trades on their process.
- **Concepte:** sample-size (nou)
- **Se sprijină pe:** 0.2.3
- **Hook:** predict · alegere: "A method won 12 of its first 20 trades: 60%. What is its true win rate?" — "60%" / "Somewhere between about 40% and 80%" / "At least 55%". Răspuns: intervalul plauzibil e cam 38.5% – 81.5% (R5 ST-05). Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: eșantionul înseamnă trade-urile pe care le ai. Eșantioanele mici se mișcă mult de la un set la altul.
  - B2 figure: banda plauzibilă pentru un rezultat de 60%, care se strânge: 20 de trade-uri, 38.5–81.5%; 100, 50.4–69.6%; 400, 55.2–64.8% (aproximare normală, 95%). În UI se numește "plausible range"; termenul „confidence interval” vine în 2.11.
  - B3 predict + reveal „Guess the edge”: două metode ascunse, câte 20 de trade-uri: A a câștigat 13, B 10. "Which one has the real edge?" Reveal la 1,000 de trade-uri: A nu are avantaj (≈ 50%), B câștigă 55%. Text: "At 20 trades, luck made the wrong one look better."
  - B4 predict: "Roughly how often does a coin-flip method reach 60% or better over 20 trades?" — "1 in 100" / "1 in 20" / "1 in 4". Răspuns: 1 din 4 (25.2%, binomial exact).
  - B5 explain: legea numerelor mici: oamenii se așteaptă ca eșantioanele mici să semene cu întregul. Tversky & Kahneman (1971): cercetătorii se așteptau la ~85% replicări reușite când șansa reală era de ~48% (R5 PSY-09).
  - B6 callout: "Judge a method on hundreds of trades. Judge each trade on whether it followed the plan. The 30 trades in Level 1 measure your process, not your edge."
- **Try:** `sample-lab` (widget nou): slider „Number of trades” 10–400 (pas 1), rata observată fixată la 60%; banda plauzibilă și linia de 50% se redesenează live.
  - Sarcina: "Find the smallest number of trades at which a 60% result no longer fits a coin-flip method (50%)."
  - Reușită: 93 (marginea de jos a benzii e 50.04%; la 92 e 49.99%).
  - Indicii: 1. "Watch the bottom edge of the band." 2. "It must climb above the 50% line." 3. "It crosses between 90 and 100 trades."
- **Practică:** laboratorul `sample-lab`; „Guess the edge” cu 3 perechi noi de metode.
- **Check:** Q1 (mcq, d1) cât de lată e banda la 20 de trade-uri; Q2 (scenario, d2) „metoda a câștigat 7 din 10; o folosesc cu risc dublu?”; Q3 (mcq, d2) ce se judecă pe un eșantion mic (procesul).
- **Dovezi:** Mechanic (eroarea standard a unei proporții; R5 ST-05, PM-01). Legea numerelor mici: B (Tversky & Kahneman 1971; R5 PSY-09).
- **Necesită:** —
- **Termeni noi de glosar:** `sample-size`, `law-of-large-numbers`

#### 0.2.5 · Randomness draws patterns
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Describe a random walk and why it produces trends, ranges and turning points.
  2. Admit when a chart can't be told apart from a random one.
  3. Ask how often a pattern works compared with random data before trusting it.
- **Concepte:** random-walk (nou)
- **Se sprijină pe:** 0.2.4
- **Hook:** predict · alegere, pe 4 grafice LABX de câte 60 de lumânări (A–D): "One of these was made by flipping coins. Which one?" — "A" / "B" / "C" / "D" / "Can't tell". Reveal: toate patru sunt mers aleator (R0), cu seed-uri diferite. Nu se notează; recap-ul spune că „Can't tell” era citirea onestă.
- **Interacțiunea centrală:**
  - B1 explain: într-un random walk, fiecare pas în sus sau în jos e decis de hazard. Mersul n-are memorie (ideea revine în 1.7.3).
  - B2 figure `Line`: un mers aleator construit din aruncări de monedă, întâi 20 de pași, apoi 200; apar „trenduri”, „range-uri”, „vârfuri duble”.
  - B3 hotspot: "Tap a price where this chart keeps turning." Orice nivel ales arată 2–3 întoarceri; reveal: graficul e R0. Text: "Turns at a level happen by chance too. A level is useful only if it works more often than on random data."
  - B4 explain: rata de bază. O regulă populară spune că anumite goluri din grafic se „umplu”; ele au fost revizitate în 83.4% din cazuri, iar niveluri alese la întâmplare, la aceeași distanță, în 83.5% (R3 §7.2). Pe piețe reale, nivelurile de suport și rezistență publicate au avut un efect mic, dar real: 60.8% față de 56.2% (Osler; revine în 1.5.5).
  - B5 order, pașii unui test onest: "Write the pattern as a rule" → "Count how often it works" → "Count how often it 'works' on random charts" → "Keep it only if the difference survives costs".
  - B6 callout: "Before you trust a pattern, ask: more often than chance, after costs?"
- **Try:** `random-walk-lab` (S7): generează mersuri aleatoare din seed-uri, cu lumânări de 1 oră.
  - Sarcina: "Generate 10 charts and tag each one: Trend, Range or Noise."
  - Reușită: 10 etichete puse (sarcină de proces, fără răspuns corect). După, aplicația arată distribuția: "You saw 4 trends and 3 ranges in pure chance."
- **Practică:** R0, laboratorul `random-walk-lab`.
- **Check:** Q1 (mcq, d1) ce e un random walk; Q2 (scenario, d2) „am văzut de 3 ori un pattern care a mers”; Q3 (mcq, d2) întrebarea corectă înaintea încrederii într-un pattern.
- **Dovezi:** Mechanic: mersul aleator produce astfel de forme prin construcție (R6 §0.5, R0). Afirmația că golurile „se umplu”: D (testul pe date nule, R3 §7.2). Nivelurile S/R: B (Osler 2000; R3 §5.2, §4.20).
- **Necesită:** S7 (modulul random walk și laboratorul de statistici pe pattern-uri).
- **Termeni noi de glosar:** `random-walk`

#### 0.2.6 · Luck or skill?
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Calculate how many people in a large group get impressive results by luck alone.
  2. Explain how showing only the winners makes luck look like skill.
  3. List the evidence that separates skill from luck: process, sample size, results after costs.
- **Concepte:** luck-vs-skill (nou), survivorship-bias (nou)
- **Se sprijină pe:** 0.2.5
- **Hook:** predict · slider 0–200, pas 1: "1,000 people 'predict' LABX for 10 days by flipping a coin. How many get at least 8 days right by luck alone?" Răspuns: în jur de 55 (5.47%). Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: pe serii scurte, norocul domină rezultatele. Abilitatea se vede în proces, pe eșantioane mari.
  - B2 figure `Bars`: cei 1,000, după numărul de zile ghicite: 0: 1; 1: 10; 2: 44; 3: 117; 4: 205; 5: 246; 6: 205; 7: 117; 8: 44; 9: 10; 10: 1. Barele de 8, 9 și 10 se evidențiază: ≈ 55 de „vedete”.
  - B3 reveal: „vedetele” mai joacă 10 zile, iar media lor coboară la ≈ 5 din 10. Text: "Their next 10 days look like everyone else's. That's what luck does." (Numele fenomenului, „regression to the mean”, vine în 3.10.)
  - B4 explain: survivorship bias. Dacă vezi doar cei 55 (în reclame, pe rețele sociale), niște aruncări de monedă arată ca talent (R5 ST-11).
  - B5 match, 4 perechi indiciu ↔ ce sugerează: "Hundreds of trades with the same rules" ↔ "Could be skill"; "One great month, shown in an ad" ↔ "Could be luck"; "Results after costs, next to the benchmark" ↔ "A fair comparison"; "Only the winning trades shown" ↔ "Survivorship".
  - B6 callout: "You control your process, not your luck. That's why your scores here grade the process."
- **Try:** `guru-generator` (laborator nou, S7; R5 ST-11): 1,000 de traderi aleatori pe 12 luni; se afișează top 10.
  - Sarcina: "Predict how many of this year's top 10 will be in next year's top 100. Then run next year and pick the explanation."
  - Reușită: explicația aleasă e "Their results were luck; the ranking reshuffles." Predicția nu se notează; pentru traderi pur aleatori, valoarea așteptată e 1 din 10.
- **Practică:** laboratorul `guru-generator`; itemii din 0.2.6 ai quiz-ului „process vs outcome”.
- **Check:** Q1 (numeric, d1) câți ar câștiga din noroc într-un alt grup (de exemplu 500 de oameni, 10 din 10: ≈ 0.5); Q2 (mcq, d2) ce e survivorship bias; Q3 (scenario, d2) ce dovezi ai cere unui „guru” înainte să-l crezi.
- **Dovezi:** Mechanic (calcul binomial; survivorship prin construcție; R5 ST-11; R1 §4.4).
- **Necesită:** S7 (generatorul de traderi aleatori folosește modulul random walk).
- **Termeni noi de glosar:** `survivorship-bias`

---

## Registru de concepte noi

| id | Nume (EN) | Definiție (EN) | Unitate |
|---|---|---|---|
| market-as-auction | Market as an auction | A market price is where the latest buyer and seller agreed; it moves when one side is more eager than the other. | 0.1 |
| market-participants | Market participants | Hedgers, investors, institutions, market makers, speculators and central banks trade for different reasons, horizons and information. | 0.1 |
| asset-classes | Asset classes | Families of instruments, such as stocks, forex, futures, crypto, bonds and CFDs, each with its own hours, costs, leverage and risks. | 0.1 |
| passive-benchmark | Passive benchmark | The buy-and-hold result on the same market, after costs, that any trading result has to beat. | 0.1 |
| trading-styles | Trading styles | Scalping, day, swing and position trading differ in holding period, screen time and sensitivity to costs. | 0.1 |
| retail-loss-rates | Retail loss rates | Regulator and academic base rates showing that most retail CFD accounts and almost all persistent day traders lose money. | 0.1 |
| when-not-to-trade | When not to trade | Choosing not to trade, or not to trade with real money, is a valid and often rational decision. | 0.1 |
| process-scores | Process scores | MARKET//LAB keeps Decision Quality, Risk Discipline and Simulated Outcome apart and grades only the first two. | 0.1 |
| evidence-grades | Evidence grades | Mechanic and A to F labels showing how well a method, pattern or claim has held up when tested. | 0.1 |
| outcome-bias | Outcome bias | Judging the quality of a decision by its result instead of by the information and reasoning available at the time. | 0.2 |
| expected-value | Expected value | The probability-weighted average result of a bet: what it returns per play over many plays. | 0.2 |
| variance | Variance | How widely results spread around their expected value; short runs can differ a lot from it. | 0.2 |
| streaks-and-runs | Streaks and runs | In independent trials, long runs of wins or losses are normal and longer than intuition expects. | 0.2 |
| sample-size | Sample size | The number of observations behind a statistic; small samples give wide, unreliable estimates. | 0.2 |
| random-walk | Random walk | A price path in which each step is random; it still draws trends, ranges and levels by chance. | 0.2 |
| luck-vs-skill | Luck versus skill | In short runs luck dominates results; skill shows as a consistent process over large samples. | 0.2 |
| survivorship-bias | Survivorship bias | Seeing only the winners that remain, which makes chance results look like skill. | 0.2 |

## Termeni noi de glosar

| id | Termen | Definiție (EN, ≤ 20 de cuvinte) |
|---|---|---|
| market | Market | A place or system where buyers and sellers trade an instrument. The price is where they agree. |
| auction | Auction | A way of matching buyers and sellers at the price where the most units can change hands. |
| order | Order | An instruction to buy or sell a quantity of an instrument, at the market price or a chosen price. |
| counterparty | Counterparty | The person or firm on the other side of your trade: the seller when you buy, the buyer when you sell. |
| hedger | Hedger | Someone who trades to reduce a risk they already have, such as a future cost or income. |
| speculator | Speculator | Someone who trades to profit from price changes and accepts the risk of losing. |
| retail-trader | Retail trader | An individual trading their own money, usually in small amounts, through a broker. |
| asset-class | Asset class | A group of instruments with similar features, such as stocks, bonds, currencies, commodities or crypto. |
| stock | Stock | A share of ownership in a company, usually traded on an exchange. |
| etf | ETF | Exchange-traded fund: a fund holding a basket of assets, traded like a single share. |
| index | Index | A number that tracks the value of a group of assets, such as 500 large companies. |
| forex | Forex | The market for exchanging currencies, quoted in pairs such as EUR/USD. |
| futures | Futures | Exchange-traded contracts to buy or sell an asset at a set price on a future date. |
| commodity | Commodity | A raw material traded in bulk, such as oil, gold or wheat, usually through futures. |
| cfd | CFD | Contract for difference: a contract with a provider that pays the price change of an asset you don't own. |
| cryptocurrency | Cryptocurrency | A digital asset recorded on a blockchain and traded on exchanges around the clock. |
| bond | Bond | A loan to a government or company that pays interest. Its price falls when interest rates rise. |
| derivative | Derivative | An instrument whose value comes from another asset, such as a futures contract, an option or a CFD. |
| benchmark | Benchmark | A reference result to compare against, such as buying and holding the same market. |
| buy-and-hold | Buy-and-hold | Buying an asset and keeping it for a long time, whatever it does in the short term. |
| scalping | Scalping | Trading tiny moves held for seconds or minutes, many times a day. Costs weigh most here. |
| day-trading | Day trading | Opening and closing positions within the same day, with nothing held overnight. |
| swing-trading | Swing trading | Holding positions for days to a few weeks to capture one swing in price. |
| position-trading | Position trading | Holding positions for weeks to months, usually to follow longer trends. |
| risk-warning | Risk warning | A broker's required notice stating what share of its retail clients lose money. |
| regulator | Regulator | A public authority that licenses and supervises brokers and markets, such as ESMA, the FCA or the ASF. |
| decision-quality | Decision Quality | The MARKET//LAB score for how sound your reasoning was, given what you knew when you decided. |
| risk-discipline | Risk Discipline | The MARKET//LAB score for following risk rules: a stop on every entry, risk within limits, no widened stops. |
| simulated-outcome | Simulated Outcome | The simulated profit or loss of your trades. It is shown, but never used to grade decisions. |
| evidence-grade | Evidence grade | A label, from Mechanic and A to F, showing how well a method has held up when tested. |
| outcome-bias | Outcome bias | Judging a decision by how it turned out rather than by how it was made. |
| expected-value | Expected value | The average result of a bet over many plays: each outcome times its probability, added up. |
| probability | Probability | How likely something is, from 0 (never) to 1 (certain), often written as a percentage. |
| variance | Variance | How spread out results are around their average. High variance means big swings both ways. |
| losing-streak | Losing streak | Several losses in a row. In random sequences they are normal and often longer than expected. |
| sample-size | Sample size | How many trades or observations a figure is based on. Small samples can mislead. |
| law-of-large-numbers | Law of large numbers | As the number of trials grows, the average result moves closer to the expected value. |
| random-walk | Random walk | A price path in which each move is random. It still produces trends and levels by chance. |
| survivorship-bias | Survivorship bias | Looking only at the winners that remain and forgetting the many that failed or disappeared. |
