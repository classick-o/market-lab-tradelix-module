import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, Question, TaskData, UnitContent } from "../../types";

/** Unit 2.10 · News and the economic calendar (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */

/** One candle, in price units with 2 decimals. */
const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

/** A card for the sorting widget; wrong picks are explained by the option's rule plus the card's clue. */
interface SortCard {
  id: string;
  text: string;
  answer: string;
  correct: string;
  clue: string;
  override?: Record<string, string>;
}

function cardSort(options: { id: string; label: string; what: string }[], cards: SortCard[]): TaskData {
  return {
    options: options.map(({ id, label }) => ({ id, label })),
    cards: cards.map((c) => ({
      id: c.id,
      text: c.text,
      answer: c.answer,
      correct: c.correct,
      rationales: Object.fromEntries(options.filter((o) => o.id !== c.answer).map((o) => [o.id, c.override?.[o.id] ?? `${o.what} ${c.clue}`])),
    })),
  };
}

// ─── Chart data ─────────────────────────────────────────────────────────────

/** 2.10.1 B3: one-minute mids drifting from 100.00 to 100.28 before the release (index 9), then a jump to 101.30. */
const SURPRISE_PATH: CandleData[] = [
  k(100.0, 100.06, 99.96, 100.04),
  k(100.04, 100.1, 100.0, 100.06),
  k(100.06, 100.12, 100.02, 100.1),
  k(100.1, 100.14, 100.04, 100.08),
  k(100.08, 100.16, 100.06, 100.14),
  k(100.14, 100.2, 100.1, 100.18),
  k(100.18, 100.22, 100.12, 100.16),
  k(100.16, 100.26, 100.14, 100.24),
  k(100.24, 100.3, 100.2, 100.28),
  k(100.28, 101.3, 100.24, 101.1),
  k(101.1, 101.26, 100.96, 101.04),
  k(101.04, 101.2, 100.98, 101.16),
  k(101.16, 101.24, 101.06, 101.12),
  k(101.12, 101.22, 101.04, 101.18),
];

/**
 * 2.10.3 B4: one-minute mids around a release at index 8. The lowest mid is 98.40, never 98.00. Spreads per minute
 * are below; the lowest bid (low − spread ÷ 2) reaches 97.90 only at index 8, under a 98.00 stop.
 */
const STOP_MIDS: CandleData[] = [
  k(98.9, 99.0, 98.84, 98.96),
  k(98.96, 99.04, 98.9, 98.94),
  k(98.94, 99.0, 98.86, 98.92),
  k(98.92, 98.98, 98.84, 98.88),
  k(98.88, 98.96, 98.82, 98.94),
  k(98.94, 99.02, 98.9, 98.98),
  k(98.98, 99.02, 98.88, 98.92),
  k(98.92, 98.96, 98.76, 98.8),
  k(98.8, 98.86, 98.4, 98.62),
  k(98.62, 98.84, 98.56, 98.78),
  k(98.78, 98.94, 98.72, 98.9),
  k(98.9, 99.0, 98.86, 98.96),
];
const STOP_SPREADS = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.4, 1.0, 0.6, 0.3, 0.1];
const STOP_LOWEST_BID = STOP_MIDS.map((c, i) => Math.round((c.l - STOP_SPREADS[i] / 2) * 100) / 100);

/** Six quiet one-minute candles around 100.00 before a release (2.10.4 and 2.10.5). */
const PRE_RELEASE: CandleData[] = [
  k(100.0, 100.06, 99.94, 100.02),
  k(100.02, 100.08, 99.96, 99.98),
  k(99.98, 100.04, 99.92, 100.0),
  k(100.0, 100.06, 99.96, 100.04),
  k(100.04, 100.08, 99.98, 100.0),
  k(100.0, 100.06, 99.94, 100.02),
];

/** 2.10.4 B5, under the veil: a mixed jobs report. The headline lifts LABX to 100.90 at T0; the details pull it to 99.30. */
const NFP_WAVES: CandleData[] = [
  ...PRE_RELEASE,
  k(100.02, 100.9, 99.98, 100.7),
  k(100.7, 100.8, 100.2, 100.3),
  k(100.3, 100.4, 99.7, 99.8),
  k(99.8, 99.9, 99.4, 99.5),
  k(99.5, 99.7, 99.36, 99.6),
  k(99.6, 99.66, 99.3, 99.4),
];

/** 2.10.5 B4, under the veil: hot headline, cool core. Down to 99.20 at T0, then back up to close at 100.70. */
const CPI_WAVES: CandleData[] = [
  ...PRE_RELEASE,
  k(100.02, 100.06, 99.2, 99.3),
  k(99.3, 99.7, 99.24, 99.6),
  k(99.6, 100.1, 99.5, 100.0),
  k(100.0, 100.5, 99.9, 100.4),
  k(100.4, 100.7, 100.3, 100.6),
  k(100.6, 100.76, 100.44, 100.7),
];

/**
 * 2.10.6 B5: five-minute candles. The statement (index 6) moves LABX 0.30 at most; the press conference starts
 * 30 minutes later (index 12). From 99.98 (close of index 11) to 98.90 (close of index 14): −1.08 in 15 minutes.
 */
const CB_DAY: CandleData[] = [
  k(100.0, 100.08, 99.94, 100.04),
  k(100.04, 100.1, 99.98, 100.02),
  k(100.02, 100.06, 99.96, 99.98),
  k(99.98, 100.04, 99.92, 100.0),
  k(100.0, 100.06, 99.94, 100.02),
  k(100.02, 100.08, 99.98, 100.0),
  k(100.0, 100.3, 99.8, 100.1),
  k(100.1, 100.2, 99.96, 100.04),
  k(100.04, 100.14, 99.94, 100.08),
  k(100.08, 100.16, 99.98, 100.06),
  k(100.06, 100.12, 99.96, 100.0),
  k(100.0, 100.1, 99.92, 99.98),
  k(99.98, 100.04, 99.1, 99.2),
  k(99.2, 99.4, 98.9, 99.0),
  k(99.0, 99.24, 98.8, 98.9),
];

/** 2.10.7 B4: five-second bars. Index 0 is just before the release; the first minute (indices 1–12) closes at 101.00. */
const FIRST_MINUTE: CandleData[] = [
  k(100.0, 100.02, 99.98, 100.0),
  k(100.0, 100.8, 100.0, 100.7),
  k(100.7, 100.9, 100.66, 100.86),
  k(100.86, 100.94, 100.8, 100.9),
  k(100.9, 100.96, 100.84, 100.88),
  k(100.88, 100.98, 100.86, 100.94),
  k(100.94, 101.02, 100.9, 100.96),
  k(100.96, 101.0, 100.9, 100.94),
  k(100.94, 101.04, 100.92, 101.0),
  k(101.0, 101.06, 100.96, 100.98),
  k(100.98, 101.04, 100.94, 101.02),
  k(101.02, 101.06, 100.98, 101.0),
  k(101.0, 101.04, 100.96, 101.0),
];

/**
 * 2.10.8: one-minute mids. The release opens index 5 with a jump from 100.40 to 101.30. The first five minutes
 * (indices 5–9) span 101.00–102.00. Spreads from index 5: 1.00, 0.60, 0.40, 0.25, 0.18, 0.12, 0.10: first under
 * 0.20 at index 9. Index 10 stays inside the range; index 11 breaks above 102.00 (ask 102.05).
 */
const SECOND_MOVE: CandleData[] = [
  k(100.4, 100.48, 100.34, 100.42),
  k(100.42, 100.5, 100.36, 100.38),
  k(100.38, 100.46, 100.32, 100.44),
  k(100.44, 100.5, 100.38, 100.4),
  k(100.4, 100.46, 100.34, 100.4),
  k(101.3, 101.95, 101.0, 101.7),
  k(101.7, 101.8, 101.05, 101.15),
  k(101.15, 101.6, 101.1, 101.5),
  k(101.5, 102.0, 101.4, 101.8),
  k(101.8, 101.9, 101.35, 101.45),
  k(101.45, 101.85, 101.3, 101.75),
  k(101.75, 102.35, 101.7, 102.25),
  k(102.25, 102.7, 102.15, 102.6),
  k(102.6, 102.8, 102.4, 102.7),
];
const SECOND_RANGE: ChartLayer = { kind: "zone", from: 101.0, to: 102.0, role: "neutral", label: "POST-RELEASE RANGE" };
const SECOND_SPREADS: ChartLayer[] = [
  { kind: "marker", index: 5, at: "high", label: "1.00", role: "down" },
  { kind: "marker", index: 6, at: "high", label: "0.60", role: "down" },
  { kind: "marker", index: 7, at: "high", label: "0.40", role: "neutral" },
  { kind: "marker", index: 8, at: "high", label: "0.25", role: "neutral" },
  { kind: "marker", index: 9, at: "high", label: "0.18", role: "neutral" },
  { kind: "marker", index: 10, at: "high", label: "0.12", role: "neutral" },
];

/** 2.10.9 B2: sixteen calm four-hour candles around 100.00, then, under the veil, a reopening at 85.00 (bid 84.95). */
const GAP_SHOCK: CandleData[] = [
  k(99.9, 100.08, 99.84, 100.02),
  k(100.02, 100.14, 99.94, 100.1),
  k(100.1, 100.18, 100.0, 100.04),
  k(100.04, 100.1, 99.9, 99.96),
  k(99.96, 100.06, 99.88, 100.0),
  k(100.0, 100.12, 99.94, 100.08),
  k(100.08, 100.16, 100.0, 100.06),
  k(100.06, 100.1, 99.96, 99.98),
  k(99.98, 100.04, 99.86, 99.92),
  k(99.92, 100.02, 99.84, 99.98),
  k(99.98, 100.1, 99.92, 100.06),
  k(100.06, 100.14, 99.98, 100.02),
  k(100.02, 100.08, 99.92, 99.96),
  k(99.96, 100.06, 99.9, 100.04),
  k(100.04, 100.12, 99.98, 100.0),
  k(100.0, 100.06, 99.92, 99.98),
  k(85.0, 85.6, 84.4, 85.2),
  k(85.2, 86.0, 84.8, 85.7),
  k(85.7, 86.1, 85.3, 85.5),
];

// ─── Card sets for the sorting tasks ────────────────────────────────────────

/** 2.10.1 Try: five synthetic releases; size from z, direction from the market's focus (LABX is a risk asset). */
const ARROW_CARDS = cardSort(
  [
    { id: "none", label: "No clear move (|z| under 0.5)", what: "No clear move fits |z| under 0.5." },
    { id: "up-med", label: "LABX up, medium (|z| 0.5–1.5)", what: "Up, medium fits |z| from 0.5 to 1.5, on news LABX likes." },
    { id: "up-big", label: "LABX up, large (|z| over 1.5)", what: "Up, large fits |z| over 1.5, on news LABX likes." },
    { id: "down-med", label: "LABX down, medium (|z| 0.5–1.5)", what: "Down, medium fits |z| from 0.5 to 1.5, on news LABX fears." },
    { id: "down-big", label: "LABX down, large (|z| over 1.5)", what: "Down, large fits |z| over 1.5, on news LABX fears." },
  ],
  [
    {
      id: "a",
      text: "**Payrolls** · consensus 150,000 · actual 230,000 · usual surprise σ 60,000 · market focus: growth, after weak data",
      answer: "up-med",
      correct: "Right. z = 80,000 ÷ 60,000 = +1.33: medium. With growth the worry, strong jobs are good news for LABX.",
      clue: "Here z = 80,000 ÷ 60,000 = +1.33, and with growth the worry, strong jobs are good news for LABX.",
    },
    {
      id: "b",
      text: "**Payrolls** · consensus 180,000 · actual 200,000 · σ 60,000 · market focus: growth",
      answer: "none",
      correct: "Right. z = 20,000 ÷ 60,000 = +0.33: inside the noise band. Any wiggle is unlikely to mean much.",
      clue: "Here z = 20,000 ÷ 60,000 = +0.33, inside the noise band.",
    },
    {
      id: "c",
      text: "**Core CPI**, month on month · consensus 0.3% · actual 0.5% · σ 0.1 · market focus: inflation",
      answer: "down-big",
      correct: "Right. z = 0.2 ÷ 0.1 = +2.0: large. With inflation the fear, hot CPI means higher rates, and LABX falls.",
      clue: "Here z = 0.2 ÷ 0.1 = +2.0, and with inflation the fear, hot CPI is bad news for LABX.",
    },
    {
      id: "d",
      text: "**Core CPI**, month on month · consensus 0.3% · actual 0.1% · σ 0.1 · market focus: inflation",
      answer: "up-big",
      correct: "Right. z = −0.2 ÷ 0.1 = −2.0: large and cool. With inflation the fear, cooler prices mean lower rates, and LABX rises.",
      clue: "Here z = −0.2 ÷ 0.1 = −2.0, and with inflation the fear, cool CPI is good news for LABX.",
    },
    {
      id: "e",
      text: "**Payrolls** · consensus 150,000 · actual 220,000 · σ 60,000 · market focus: inflation",
      answer: "down-med",
      correct: "Right. z = 70,000 ÷ 60,000 = +1.17: medium. With inflation the fear, strong jobs mean higher rates: good news is bad news.",
      clue: "Here z = 70,000 ÷ 60,000 = +1.17, and with inflation the fear, strong jobs are bad news for LABX.",
    },
  ],
);

/** 2.10.2 Try: a week of nine LABX events, times in Bucharest: three red, three orange, three yellow. */
const TRIAGE_CARDS = cardSort(
  [
    { id: "flat", label: "Flat by T−15", what: "Flat by T−15 is for red events." },
    { id: "half", label: "Half size", what: "Half size is for orange events." },
    { id: "ignore", label: "Ignore", what: "Ignore is for yellow events." },
  ],
  [
    { id: "mon", text: "**Mon 16:45** · Manufacturing survey · orange", answer: "half", correct: "Half size. A survey like this can move LABX, but less than the red events.", clue: "This one is orange: half size." },
    { id: "tue", text: "**Tue 17:00** · Consumer confidence · yellow", answer: "ignore", correct: "Ignore. A yellow event gets no action in this plan.", clue: "This one is yellow: no action." },
    { id: "wed1", text: "**Wed 15:30** · CPI · red", answer: "flat", correct: "Flat by 15:15. No new orders from then until after the release.", clue: "CPI is red here: flat by 15:15." },
    { id: "wed2", text: "**Wed 21:00** · Central bank rate decision · red", answer: "flat", correct: "Flat by 20:45. The decision, and the press conference after it, are red.", clue: "The rate decision is red: flat by 20:45." },
    { id: "thu1", text: "**Thu 14:00** · Regional business survey · yellow", answer: "ignore", correct: "Ignore. Yellow events stay out of your way.", clue: "This one is yellow: no action." },
    { id: "thu2", text: "**Thu 15:30** · Weekly jobless claims · orange", answer: "half", correct: "Half size before 15:30.", clue: "This one is orange: half size." },
    {
      id: "thu3",
      text: "**Thu 17:00** · Housing sales · yellow · plus, at the same minute, a speech by the central bank chair · orange",
      answer: "half",
      correct: "Half size. When two events share a minute, the higher tier sets the policy: orange.",
      clue: "Two events share 17:00, and the higher tier, orange, sets the policy.",
      override: { ignore: "The housing report alone is yellow, but an orange speech lands at the same minute. The higher tier sets the policy." },
    },
    { id: "fri1", text: "**Fri 15:30** · Payrolls · red", answer: "flat", correct: "Flat by 15:15. Payrolls is one of the month's biggest events.", clue: "Payrolls is red: flat by 15:15." },
    { id: "fri2", text: "**Fri 17:00** · Consumer sentiment · yellow", answer: "ignore", correct: "Ignore. Yellow, and the payrolls dust has had 90 minutes to settle.", clue: "This one is yellow: no action." },
  ],
);

/** 2.10.4 Try: five synthetic jobs reports. Clear only when payrolls, unemployment, wages and revisions all agree. */
const NFP_CARDS = cardSort(
  [
    { id: "hot", label: "Clearly hot", what: "Clearly hot needs every reading pointing hot." },
    { id: "cold", label: "Clearly cold", what: "Clearly cold needs every reading pointing cold." },
    { id: "mixed", label: "Mixed", what: "Mixed is for readings that disagree." },
  ],
  [
    {
      id: "a",
      text: "Payrolls **+120,000** vs consensus · unemployment rate **0.2 points below** · hourly earnings **0.2% above** · revisions **+40,000**",
      answer: "hot",
      correct: "Clearly hot: more jobs, lower unemployment, faster wages and upward revisions.",
      clue: "Here all four point hot: more jobs, lower unemployment, faster wages and upward revisions.",
    },
    {
      id: "b",
      text: "Payrolls **−80,000** vs consensus · unemployment rate **0.1 points above** · hourly earnings **0.1% below** · revisions **−30,000**",
      answer: "cold",
      correct: "Clearly cold: fewer jobs, higher unemployment, softer wages and downward revisions.",
      clue: "Here all four point cold.",
    },
    {
      id: "c",
      text: "Payrolls **+90,000** vs consensus · unemployment rate **0.1 points above** · hourly earnings **0.1% below** · revisions **−50,000**",
      answer: "mixed",
      correct: "Mixed. Only the headline is hot; the other three point cold.",
      clue: "Here only payrolls point hot; the other three point cold.",
    },
    {
      id: "d",
      text: "Payrolls **−40,000** vs consensus · unemployment rate **0.1 points below** · hourly earnings **0.2% above** · revisions **+20,000**",
      answer: "mixed",
      correct: "Mixed. The headline is cold, but the other three point hot.",
      clue: "Here the headline is cold but the other three point hot.",
    },
    {
      id: "e",
      text: "Payrolls **+60,000** vs consensus · unemployment rate **0.1 points below** · hourly earnings **0.1% above** · revisions **−70,000**",
      answer: "mixed",
      correct: "Mixed. Three readings are hot, but the revisions take back more jobs than the headline added.",
      clue: "Here three readings point hot, but the revisions take back more jobs than the headline added.",
    },
  ],
);

/** 2.10.5 Try: five synthetic CPI releases, three with headline and core pointing opposite ways. */
const CPI_CARDS = cardSort(
  [
    { id: "flat5", label: "They disagree: flat until T+5", what: "Flat until T+5 is for releases where headline and core point opposite ways." },
    { id: "agree", label: "They agree: skip the first minute, then follow your plan", what: "Following the plan after the first minute is for releases where both point the same way." },
    { id: "now", label: "Trade the first spike now", what: "Trading the first spike breaks the rule at every release: the first minute has the widest spreads." },
  ],
  [
    { id: "a", text: "Headline **0.2 above** consensus · core **0.1 below**", answer: "flat5", correct: "They disagree: flat until T+5. The second wave will likely follow core.", clue: "Here headline is hot and core is cool: they disagree." },
    { id: "b", text: "Headline **0.1 above** consensus · core **0.2 above**", answer: "agree", correct: "They agree, both hot. Skip the first minute, then follow your plan.", clue: "Here both are hot: they agree." },
    {
      id: "c",
      text: "Headline **0.2 below** consensus, on falling energy prices · core **0.1 above**",
      answer: "flat5",
      correct: "They disagree: cheap energy pulled the headline down while core ran hot. Flat until T+5.",
      clue: "Here headline is cool and core is hot: they disagree.",
    },
    { id: "d", text: "Headline **0.1 below** consensus · core **0.1 below**", answer: "agree", correct: "They agree, both cool. Skip the first minute, then follow your plan.", clue: "Here both are cool: they agree." },
    { id: "e", text: "Headline **0.1 above** consensus · core **0.2 below**", answer: "flat5", correct: "They disagree: flat until T+5.", clue: "Here headline is hot and core is cool: they disagree." },
  ],
);

/** 2.10.6 Try: six decisions read against what the market had priced. */
const HAWK_CARDS = cardSort(
  [
    { id: "hawk", label: "More hawkish than priced", what: "More hawkish means tighter than the market expected." },
    { id: "asis", label: "As priced", what: "As priced means it matches what the market expected." },
    { id: "dove", label: "More dovish than priced", what: "More dovish means looser than the market expected." },
  ],
  [
    {
      id: "a",
      text: "**Priced:** one more hike, then a pause. **Statement:** 'We will raise rates further and keep them high for longer.'",
      answer: "hawk",
      correct: "More hawkish. 'Further' and 'for longer' go beyond one hike and a pause.",
      clue: "Here 'further and for longer' goes beyond one hike and a pause.",
    },
    {
      id: "b",
      text: "**Priced:** a cut at this meeting, 90%. **Decision:** a cut, and 'further easing is likely.'",
      answer: "dove",
      correct: "More dovish. The cut was priced; the promise of more cuts wasn't.",
      clue: "Here the cut was priced, but 'further easing' adds cuts the market hadn't priced.",
    },
    {
      id: "c",
      text: "**Priced:** no change. **Decision:** no change, and 'policy is well positioned.'",
      answer: "asis",
      correct: "As priced. Nothing new, so little to move price.",
      clue: "Here both the decision and the tone match what was priced.",
    },
    {
      id: "d",
      text: "**Priced:** three cuts this year. **Statement:** 'We see little need to cut further this year.'",
      answer: "hawk",
      correct: "More hawkish: fewer cuts than the three priced.",
      clue: "Here the bank signals fewer cuts than the three priced.",
    },
    {
      id: "e",
      text: "**Priced:** a hike, 80%. **Decision:** no change; 'we need more data.'",
      answer: "dove",
      correct: "More dovish. The likely hike didn't come.",
      clue: "Here an 80% likely hike didn't come.",
    },
    {
      id: "f",
      text: "**Priced:** no change now, cuts later in the year. **Statement:** 'Progress on inflation has stalled; cuts are not on the table.'",
      answer: "hawk",
      correct: "More hawkish. The decision matched, but the cuts priced for later were taken away.",
      clue: "Here the cuts priced for later are taken off the table.",
    },
  ],
);

/** 2.10.9 Try: six order tickets near red events, each failing one checklist item. */
const GATE_CARDS = cardSort(
  [
    { id: "policy", label: "Policy decided in advance", what: "The policy item fails when the decision is left until the event is close." },
    { id: "gap", label: "Gap within max loss", what: "The gap item fails when a k × ATR gap would cost more than 1R." },
    { id: "wider", label: "Wider stop only with smaller size", what: "The wider-stop item fails when the stop widens but the size stays." },
    { id: "spreads", label: "Wait for normal spreads", what: "The spreads item fails when an order goes in while spreads are still wide." },
    { id: "weekend", label: "Reduce before weekends and holidays", what: "The weekend item fails when full size rides into a long market close." },
    { id: "broker", label: "Know your broker's news rules", what: "The broker item fails when you don't know its margin and stop rules for news." },
  ],
  [
    {
      id: "a",
      text: "**Monday.** Wednesday's CPI is red. 'I'll see how I feel on the day,' you decide.",
      answer: "policy",
      correct: "Policy. Decided on the day means decided under pressure, at the worst time.",
      clue: "Here the decision is pushed to the day itself.",
    },
    {
      id: "b",
      text: "**Holding 47 LABX** long, stop 98.00, into payrolls. ATR 0.80: a 4 × ATR gap would cost 155.03.",
      answer: "gap",
      correct: "Gap. 155.03 is over 1R. Cut to 30 units, or go flat.",
      clue: "Here a 4 × ATR gap costs 155.03, over 1R.",
    },
    {
      id: "c",
      text: "**Before the rate decision** you move your stop from 98.00 to 96.00 to dodge the spike, and keep all 47 units.",
      answer: "wider",
      correct: "Wider stop, same size. A stop-out now costs 192.61 instead of 98.66.",
      clue: "Here the stop doubles in distance while the size stays: a stop-out now costs 192.61.",
    },
    {
      id: "d",
      text: "**Payrolls came out 40 seconds ago.** The spread is 0.80, and you send a market buy.",
      answer: "spreads",
      correct: "Spreads. At 0.80, eight times normal, you pay the news spread. Wait for 0.20 or less.",
      clue: "Here the spread is still eight times normal.",
    },
    {
      id: "e",
      text: "**Friday evening** before a three-day holiday. You hold your full swing size with a 2.00 stop.",
      answer: "weekend",
      correct: "Weekend. Three closed days give news three days to build a gap.",
      clue: "Here full size rides into a long market close.",
    },
    {
      id: "f",
      text: "**Your broker** raises margin before big releases. You've never checked by how much, or whether its stops are guaranteed.",
      answer: "broker",
      correct: "Broker rules. Check margin changes, order restrictions, guaranteed stops and negative balance protection before you need them.",
      clue: "Here you don't know your broker's news rules.",
    },
  ],
);

// ─── Lessons ────────────────────────────────────────────────────────────────

const L2101: Lesson = {
  id: "2.10.1",
  title: "Expectations versus surprise",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Prices move on the surprise, actual minus consensus, measured against the usual size of surprises; small surprises are mostly noise.",
  objectives: [
    "Explain why prices move on the surprise, not on whether the news is good or bad.",
    "Compute a surprise and a standardised surprise from consensus, actual and the usual size of surprises.",
    "Recognise small surprises that are usually noise.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: unexpected event" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "2.10",
    courseId: "2.10.1",
    bridge: "In 2.9.8 a weekend gap skipped your stop. Scheduled releases can do the same, at a minute you can now convert (2.9.1). First, why price jumps at all: on the surprise against what was expected, sized against normal noise, as 0.2 taught.",
    hook: {
      prompt: "A synthetic jobs report beats consensus by 60,000 jobs. Another beats it by 10,000. Both are 'better than expected'. Which one usually moves price more?",
      control: {
        kind: "choice",
        choices: [
          { id: "first", label: "The first, by 60,000", feedback: "Right. Measured against the usual size of surprises, the first is six times bigger." },
          { id: "second", label: "The second, by 10,000", feedback: "A smaller beat is, if anything, more likely to be noise. The first is six times bigger." },
          { id: "same", label: "The same: both beat", feedback: "Both beat, but by very different amounts. Price reacts to how big the surprise is." },
          { id: "cant", label: "Can't tell", feedback: "You can, roughly: compare each beat with the usual size of surprises. The first is six times bigger." },
        ],
        answer: "first",
      },
      compare: "You chose {yours}. If surprises in this report usually vary by about 60,000, the first is z = 1.0 and the second z = 0.17: inside the noise.",
      concept: "news-surprise",
    },
    learn: [
      {
        kind: "callout",
        tone: "warning",
        text: "Risk first: every scheduled release is a volatility event before it is information. Spreads widen and price can jump past your stop, whatever the number says (2.10.3). Understanding the surprise doesn't make the jump any safer.",
      },
      {
        kind: "explain",
        title: "Priced in",
        text: "Before a release, economists publish forecasts; their middle is the [[consensus]]. Traders position for it in advance, so the expected number is largely [[priced-in]]. What's new on the day is the [[surprise]]: actual minus consensus. Good news that everyone expected moves price little. Better-than-expected news can.",
      },
      {
        kind: "worked",
        title: "Sizing a surprise",
        lines: [
          "Consensus: 150,000 jobs. Actual: 210,000.",
          "Surprise = actual − consensus = +60,000.",
          "In this report, surprises usually vary by about 60,000: that's σ, their standard deviation.",
          "Standardised surprise z = surprise ÷ σ = 60,000 ÷ 60,000 = +1.0.",
          "Another month: actual 160,000. z = 10,000 ÷ 60,000 = ?",
        ],
        ask: {
          answer: 0.17,
          tolerance: 0.01,
          feedback: [
            { value: 10000, text: "That's the surprise. Divide it by σ, 60,000, to compare it with the usual size." },
            { value: 6, text: "That's 60,000 ÷ 10,000. It's the surprise that's divided by σ." },
          ],
          correct: "Right: z = 0.17, a sixth of a usual surprise.",
        },
        after: "z puts every surprise on one scale: how many usual surprises it is. A z of 1.0 is a real miss for the forecasters. A z of 0.17 is the kind of gap that happens most months.",
        concept: "news-surprise",
      },
      {
        kind: "figure",
        title: "The jump scales with the surprise",
        figure: {
          kind: "chart",
          chart: { candles: SURPRISE_PATH },
          steps: [
            { text: "Before the release, price drifts as traders position for the expected number." },
            { text: "At T0 the actual beats consensus by one usual surprise, z = +1.0. Price jumps.", layers: [{ kind: "marker", index: 9, at: "high", label: "T0 · z +1.0", role: "accent" }] },
            {
              text: "Had it been z = 0.17, inside the noise band, the move would likely drown in ordinary wiggles.",
              layers: [
                {
                  kind: "path",
                  role: "neutral",
                  dashed: true,
                  label: "IF z = 0.17",
                  points: [
                    { index: 9, price: 100.28 },
                    { index: 10, price: 100.36 },
                    { index: 11, price: 100.24 },
                    { index: 12, price: 100.32 },
                    { index: 13, price: 100.28 },
                  ],
                },
              ],
            },
          ],
        },
        text: "An illustration. At major releases the first move tends to follow the sign of the surprise, but its size is noisy. In this course, |z| under 0.5 counts as noise.",
        concept: "news-surprise",
      },
      {
        kind: "match",
        title: "Hot or cold?",
        prompt: "'Hot' means a stronger economy or higher inflation than expected. Sort each reading. Careful: for some series, the lower number is the hot one.",
        pairs: [
          { left: "CPI 0.4% vs 0.3% expected", right: "Hot", wrong: "Inflation above consensus is hot: it makes higher rates more likely." },
          { left: "Unemployment rate 3.9% vs 4.1% expected", right: "Hot", wrong: "Lower unemployment than expected means a tighter job market: hot, although the number is lower." },
          { left: "Jobless claims 250,000 vs 220,000 expected", right: "Cold", wrong: "More benefit claims than expected means more layoffs: cold, although the number is higher." },
          { left: "Payrolls 90,000 vs 150,000 expected", right: "Cold", wrong: "Fewer jobs added than expected: a colder labour market." },
        ],
        columns: ["Reading", "Hot or cold"],
        correct: "Right. Read which way each series counts before you read the sign of the surprise.",
        concept: "news-surprise",
      },
      {
        kind: "predict",
        title: "Good news is bad news",
        prompt: "LABX trades like a stock index. Payrolls beat consensus by a wide margin. The market's main fear is inflation: strong jobs mean higher rates for longer. What does LABX usually do?",
        control: {
          kind: "choice",
          choices: [
            { id: "up", label: "Rises: strong jobs are good news", feedback: "That's the textbook reading. With inflation the main fear, strong jobs mean higher rates, and that weighs on stocks." },
            { id: "down", label: "Falls: strong jobs mean higher rates", feedback: "Right. Seen through the market's main fear, good news for jobs is bad news for rates." },
            { id: "flat", label: "Doesn't move: jobs don't affect stocks", feedback: "A wide beat on a top release usually moves risk assets. The question is which way." },
          ],
          answer: "down",
        },
        reveal: "Usually down. When inflation is the main fear, strong jobs mean higher rates for longer, which weighs on stock prices. In a recession scare, the same beat calms nerves and stocks tend to rise. Same surprise, different fear, opposite move.",
        concept: "news-surprise",
      },
      { kind: "callout", tone: "key", text: "The calendar tells you when. The surprise tells you how much. What the market fears decides which way." },
    ],
    task: {
      widget: "bias-spotter",
      data: ARROW_CARDS,
      goal: "Five synthetic releases. For each, compute z, read the market's focus, and pick LABX's likely first move.",
      success: { field: "solved", eq: 5 },
      correct: "Five for five. Size comes from z, direction from what the market fears. These are tendencies, not promises: a first move can still fail.",
      hints: [
        "z = (actual − consensus) ÷ σ. Under 0.5 is noise, 0.5 to 1.5 medium, over 1.5 large.",
        "If inflation is the fear, hot data is bad for LABX. If growth is the fear, strong data is good.",
      ],
      showMe: { solved: 5 },
      concept: "news-surprise",
    },
    check: ["q-2.10.1-1", "q-2.10.1-2", "q-2.10.1-3"],
    recap: {
      takeaways: [
        "Prices move on the surprise, actual minus consensus, because the consensus is already in the price.",
        "Standardise it: z = surprise ÷ the usual surprise size. 60,000 against a σ of 60,000 is z = 1.0.",
        "Surprises under half the usual size are mostly noise. Don't read a trend into them.",
      ],
      next: "Next, 2.10.2: the economic calendar, where the time, the consensus and the actual sit on one row.",
    },
  },
};

const L2102: Lesson = {
  id: "2.10.2",
  title: "Reading the economic calendar",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A calendar row gives the time, impact, previous, revised, consensus and actual values; convert the time with care and triage the week before it starts.",
  objectives: [
    "Read each field of a calendar row: time, impact, previous, revised, consensus, actual.",
    "Convert release times to your own time zone without the DST trap.",
    "Triage a week of events into flat, reduce or ignore, before the week starts.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "2.10",
    courseId: "2.10.2",
    bridge: "In 2.10.1 you measured a surprise as actual minus consensus. The economic calendar is where both numbers appear, with the release time and an impact rating. Here you read a row, convert its time with the DST trap from 2.9.1, and triage a week.",
    hook: {
      prompt: "A synthetic jobs release is at 08:30 New York time. Europe's clocks went back last Sunday; the US clocks change next Sunday. What time is it in Bucharest?",
      control: {
        kind: "choice",
        choices: [
          { id: "t1330", label: "13:30", feedback: "That's a 5-hour gap. New York is usually 7 hours behind Bucharest, and 6 this week." },
          { id: "t1430", label: "14:30", feedback: "Right. This week the gap is 6 hours, not the usual 7." },
          { id: "t1530", label: "15:30", feedback: "That's the usual time, with a 7-hour gap. This week Europe has changed its clocks and the US hasn't: 6 hours." },
          { id: "t1630", label: "16:30", feedback: "That's an 8-hour gap. New York is usually 7 hours behind Bucharest, and 6 this week." },
        ],
        answer: "t1430",
      },
      compare: "You chose {yours}. Usually 08:30 in New York is 15:30 in Bucharest. In the weeks when only one side has changed its clocks, it's 14:30.",
      concept: "economic-calendar",
    },
    learn: [
      {
        kind: "callout",
        tone: "warning",
        text: "Risk first: the calendar reliably tells you **when** volatility, spreads and gap risk will rise. It doesn't tell you which way price goes, and unscheduled events never appear on it (2.10.9).",
      },
      {
        kind: "explain",
        text: "An [[economic-calendar]] lists each upcoming release on one row: the time, an [[impact-tier]], the previous value, any [[revision]] to it, the [[consensus]] and, once published, the actual. Read a row as a volatility forecast: it says when the market will jump, and which number it expects.",
      },
      {
        kind: "explain",
        title: "The DST trap",
        text: "US releases are set in New York time, usually 7 hours behind Bucharest: 08:30 there is 15:30 here. But the US and Europe change clocks on different Sundays. For two to three weeks in March, and one week at the turn of October and November, the gap is 6 hours: 08:30 becomes 14:30.",
      },
      {
        kind: "predict",
        title: "Read the row",
        prompt: "Fri · 15:30 · Payrolls · Impact: red · Previous 140K · Revised 120K · Consensus 150K · Actual: not out yet. When the number lands, which field is it measured against?",
        control: {
          kind: "choice",
          choices: [
            { id: "previous", label: "Previous, 140K", feedback: "Previous is last month's number, and the market has already traded it. What it expects now is the consensus." },
            { id: "revised", label: "Revised, 120K", feedback: "The revision corrects last month. It matters, but the surprise is measured against the consensus." },
            { id: "consensus", label: "Consensus, 150K", feedback: "Right." },
            { id: "impact", label: "Impact, red", feedback: "Impact rates how much the event usually moves markets. It isn't a number to compare with." },
          ],
          answer: "consensus",
        },
        reveal: "The consensus. The surprise is actual minus consensus, because the consensus is what's priced in. Previous and revised describe last month. The revision still counts: here last month was cut by 20K, and that changes what the new number means.",
        concept: "economic-calendar",
      },
      {
        kind: "match",
        title: "The fields",
        prompt: "Match each field of a calendar row to what it holds.",
        pairs: [
          { left: "Previous", right: "Last period's number, as first published", wrong: "Previous is last period's figure as it was first released, before any correction." },
          { left: "Revised", right: "Last period's number, corrected with fuller data", wrong: "Revised replaces the previous figure once more data has come in." },
          { left: "Consensus", right: "The middle of the forecasts: roughly what's priced in", wrong: "Consensus is the forecasters' middle estimate, the number the actual is compared with." },
          { left: "Actual", right: "The new number, filled in at release time", wrong: "Actual stays empty until the release, then shows the published number." },
          { left: "Impact", right: "The calendar's rating of how much it usually moves markets", wrong: "Impact is the calendar's own rating, often red, orange or yellow." },
        ],
        columns: ["Field", "What it holds"],
        correct: "Right. Five fields, one question: what's new against what was expected.",
        concept: "economic-calendar",
      },
      {
        kind: "worked",
        title: "Revisions can flip the headline",
        lines: [
          "Payrolls: consensus 150,000, actual 210,000. Headline surprise: +60,000.",
          "The two prior months are revised down by 120,000 in total.",
          "Net surprise, counting revisions: +60,000 − 120,000 = ?",
        ],
        ask: {
          answer: -60000,
          tolerance: 0,
          unit: "jobs",
          feedback: [
            { value: 60000, text: "That's the headline alone. Take off the 120,000 of downward revisions." },
            { value: 180000, text: "Downward revisions subtract from the news: +60,000 − 120,000." },
          ],
          correct: "Right: −60,000. Counting the revisions, the report is weaker than expected.",
        },
        after: "The first spike usually follows the headline. As traders read the revisions, it can reverse. Read the whole row before you read the chart.",
        concept: "economic-calendar",
      },
      {
        kind: "explain",
        title: "Tiers are opinions",
        text: "[[impact-tier|Impact tiers]] are editorial: each calendar rates events its own way, and what matters shifts with the regime. When inflation is the fear, CPI is the main event. Calendars also list speeches, holidays and bond auctions. And dates can move: a government shutdown, for example, can delay or cancel releases.",
      },
      {
        kind: "order",
        title: "Triage the week",
        prompt: "Put your weekly calendar routine in order.",
        items: [
          "List this week's red events for your instruments.",
          "Convert each time to your own time zone.",
          "Decide the policy for each: flat, reduce or ignore.",
          "Write the policies into your trading plan.",
          "Set an alarm 15 minutes before each red event.",
        ],
        explain: "Right. Decisions first, while you're calm, then the plan and the alarms. At T−15 minutes you act; you don't decide.",
        concept: "economic-calendar",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: TRIAGE_CARDS,
      goal: "Your plan: flat by T−15 before red events, half size before orange, ignore yellow. Triage nine LABX events, times in Bucharest.",
      success: { field: "solved", eq: 9 },
      correct: "All nine triaged, before the week starts. At T−15 the plan decides, so you don't have to.",
      hints: ["Match each event's tier to the plan: red, flat; orange, half size; yellow, ignore.", "Two events at the same minute: the higher tier sets the policy."],
      showMe: { solved: 9 },
      concept: "economic-calendar",
    },
    check: ["q-2.10.2-1", "q-2.10.2-2", "q-2.10.2-3"],
    recap: {
      takeaways: [
        "Read the whole row: time, impact, previous, revised, consensus, actual. Revisions can flip the headline.",
        "Convert from New York time every week. In the clock-change gap weeks, 08:30 is 14:30, not 15:30.",
        "Triage the week before it starts: flat for red, half size for orange, ignore yellow.",
      ],
      next: "Next, 2.10.3: what spreads, slippage and stops do in the minute around a release.",
    },
  },
};

const L2103: Lesson = {
  id: "2.10.3",
  title: "Spreads, slippage and stops at news time",
  topic: "stop_loss",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Around a release spreads widen, depth thins and stops fill at the first price after the jump; a widened spread can even trigger a stop the mid price never reached.",
  objectives: [
    "Describe what happens to spreads, depth and fills in the minute around a release.",
    "Compute the loss when a stop fills after a jump, and the slippage in vUSD and in R.",
    "Explain how a spread-triggered stop happens.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: unexpected event" },
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
  ],
  script: {
    unit: "2.10",
    courseId: "2.10.3",
    bridge: "In 2.10.2 the calendar told you when volatility would rise. Here you see that minute up close: spreads widen, depth thins, and a triggered stop becomes a market order that fills after the jump, the slippage of 1.3.7 at news size.",
    hook: {
      prompt: "Long 47 LABX at 100.00, stop 98.00, planned loss 98.66. At the release, the first bid after the jump is 96.80. What do you lose?",
      control: {
        kind: "slider",
        min: 80,
        max: 200,
        step: 1,
        unit: "vUSD",
        start: 100,
        answer: 155,
        tolerance: 3,
        feedback: [
          { from: 80, to: 104, text: "That's about the plan. But the stop didn't sell at 98.00: the first bid was 96.80." },
          { from: 105, to: 151, text: "More than the plan, but not enough: 47 units lost 3.20 each, plus commissions." },
          { from: 152, to: 158, text: "About right: 155.03, 1.57 times the plan." },
          { from: 159, to: 200, text: "Too much: 47 × 3.20 = 150.40, plus 4.63 of commissions." },
        ],
      },
      compare: "You said {yours}. The stop sold at the first bid, 96.80: a loss of 155.03, 1.57 times the 98.66 you planned.",
      concept: "news-liquidity",
    },
    learn: [
      {
        kind: "explain",
        title: "Risk first: the minute around a release",
        text: "In the last minute before a big release, dealers widen their quotes and pull resting orders: [[spread-widening]] to several times normal is routine on retail platforms. At the number, price can jump through levels where nobody is bidding. A triggered stop becomes a market order and fills at the first price there is.",
      },
      {
        kind: "figure",
        title: "Illustration: LABX's spread around a release",
        figure: {
          kind: "bars",
          bars: [
            { label: "T−60s", value: 1, role: "neutral" },
            { label: "T−30s", value: 2, role: "neutral" },
            { label: "T−10s", value: 4, role: "down" },
            { label: "T0", value: 10, role: "down" },
            { label: "T+30s", value: 6, role: "down" },
            { label: "T+60s", value: 3, role: "neutral" },
            { label: "T+90s", value: 1.5, role: "neutral" },
            { label: "T+120s", value: 1, role: "neutral" },
          ],
          unit: "×",
          steps: [
            "Spread in multiples of normal, 0.10. In the last minute, dealers widen quotes and pull orders.",
            "At T0 the spread hits 1.00, ten times normal. Depth is thinnest now.",
            "Within about two minutes it's back to 0.10. The worst fills come before that.",
          ],
        },
        text: "Liquidity usually returns within a minute or two. Until then, every fill pays a news-sized spread. Some brokers also raise margin requirements before big events.",
        concept: "news-liquidity",
      },
      {
        kind: "worked",
        title: "The stop after the jump",
        lines: [
          "Long 47 LABX at 100.00, stop 98.00. Planned loss with costs: 98.66, your 1R.",
          "At the release the bid jumps from above 98.00 straight to 96.80. Your stop sells there.",
          "Price loss: 47 × (100.00 − 96.80) = 150.40.",
          "Commissions: 2.35 in, 2.28 out.",
          "Actual loss: 150.40 + 2.35 + 2.28 = ?",
        ],
        ask: {
          answer: 155.03,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 150.4, text: "That's price alone. Add both commissions, 2.35 and 2.28." },
            { value: 98.66, text: "That's the plan, at 98.00. The stop filled at 96.80." },
          ],
          correct: "Right: 155.03.",
        },
        after: "That's 56.37 over plan, about 0.57R of [[slippage]]: a −1.57R trade. Nothing traded between 98.00 and 96.80, so the stop took the first price there was.",
        concept: "news-liquidity",
      },
      {
        kind: "hotspot",
        title: "A stop the mid never touched",
        prompt: "Long, stop 98.00. The candles are mid prices; the dashed line is each minute's lowest bid. Tap the minute your stop was triggered.",
        chart: {
          candles: STOP_MIDS,
          layers: [
            { kind: "level", price: 98.0, role: "stop", label: "STOP 98.00" },
            { kind: "line", values: STOP_LOWEST_BID, role: "down", dashed: true, label: "LOWEST BID" },
          ],
        },
        zones: [
          { id: "tm1", label: "T−1", index: 7, feedback: "Spread 0.40 here: the lowest bid was 98.56, above your stop." },
          { id: "t0", label: "T0", index: 8 },
          { id: "tp1", label: "T+1", index: 9, feedback: "Spread 0.60, lowest bid 98.26: still above 98.00. The trigger came a minute earlier." },
          { id: "tp2", label: "T+2", index: 10, feedback: "Lowest bid 98.57. By then the stop had already sold." },
        ],
        answer: "t0",
        correct: "Right. At T0 the mid fell only to 98.40, but the spread hit 1.00, so the bid reached 97.90, under your stop. The mid never touched 98.00: a [[spread-triggered-stop]].",
        concept: "news-liquidity",
      },
      {
        kind: "predict",
        prompt: "So, at news time, does a stop cap your loss at its price?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes: that's what a stop is for", feedback: "A stop picks the moment your order becomes a market sell. It doesn't pick the price." },
            { id: "no", label: "No: it fills at the first bid it can get", feedback: "Right." },
            { id: "limit", label: "Only if it's a stop-limit", feedback: "A stop-limit caps the price but may not fill at all in a jump, leaving you unprotected (1.3.3)." },
          ],
          answer: "no",
        },
        reveal: "No. At news time the first price can sit far beyond your stop. Some brokers sell a [[guaranteed-stop]] for a premium; without one, size as if the gap will happen.",
        concept: "news-liquidity",
      },
      { kind: "callout", tone: "key", text: "A stop is an instruction, not a price." },
      {
        kind: "worked",
        title: "Your turn: the news receipt",
        lines: [
          "Plan: long 62 LABX at 100.50, stop 99.00. Loss at the stop with costs: 99.19, your 1R.",
          "Receipt: stop triggered at T0, filled at a bid of 97.40, with the spread at 0.80.",
          "Actual loss: 62 × 3.10 + 3.12 + 3.02 = 198.34.",
          "Slippage beyond the plan: 198.34 − 99.19 = 99.15.",
          "In R: 99.15 ÷ 99.19 = ?",
        ],
        ask: {
          answer: 1,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 2, text: "That's the whole loss, 2.00R. The question is the part beyond the plan: 99.15." },
            { value: 99.15, text: "That's in vUSD. Divide by your 1R, 99.19." },
          ],
          correct: "Right: 1.00R of slippage. A 1R plan became a 2R loss.",
        },
        after: "Journal both numbers for each event type: the slippage in vUSD and in R. Over a few months they show what news really costs you.",
        concept: "news-liquidity",
      },
    ],
    check: ["q-2.10.3-1", "q-2.10.3-2", "q-2.10.3-3"],
    recap: {
      takeaways: [
        "Around a release, spreads widen, depth thins and price jumps; liquidity usually returns within minutes.",
        "A stop fills at the first bid after a jump: 96.80 instead of 98.00 cost 0.57R extra.",
        "A widened spread can trigger your stop even though the mid price never reached it.",
      ],
      next: "Next, 2.10.4: the US jobs report, the first of three big releases you'll learn to read.",
    },
  },
};

const L2104: Lesson = {
  id: "2.10.4",
  title: "Nonfarm payrolls",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "The US jobs report has three headline numbers and revisions; judge a surprise against the report's own noise, and call it hot, cold or mixed before reacting.",
  objectives: [
    "Name the three numbers in the US jobs report and the revisions that come with them.",
    "Judge whether a surprise is larger than the report's own sampling noise.",
    "Classify a report as clearly hot, clearly cold or mixed before reacting.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "2.10",
    courseId: "2.10.4",
    bridge: "With the surprise from 2.10.1 and the release-minute risks from 2.10.3, you can read a real report. Here it's the US jobs report: three headline numbers, revisions, and sampling noise big enough to swallow a beat.",
    hook: {
      prompt: "Payrolls come in 90,000 above consensus. The report's own margin of error on a monthly change is typically over 100,000 jobs. What is this surprise?",
      control: {
        kind: "choice",
        choices: [
          { id: "strong", label: "A strong, reliable signal", feedback: "It looks strong, but it's smaller than the report's own margin of error. Statistically, it could be zero." },
          { id: "noise", label: "Inside the noise, but the market will still react", feedback: "Right. Statistically weak, yet price still trades the headline." },
          { id: "nothing", label: "Nothing will happen", feedback: "Markets trade the headline even when it's noisy. Price will likely jump, then reassess." },
        ],
        answer: "noise",
      },
      compare: "You chose {yours}. A 90,000 beat sits inside the report's sampling noise, yet the market trades the headline, then reassesses as the details and revisions sink in.",
      concept: "nonfarm-payrolls",
    },
    learn: [
      {
        kind: "callout",
        tone: "warning",
        text: "Risk first: payrolls is one of the month's biggest volatility events, with wide spreads and fast jumps. Its numbers often disagree with each other, so price can whipsaw both ways. Default policy: read it, don't trade it.",
      },
      {
        kind: "explain",
        title: "The report",
        text: "The US jobs report, [[nfp|NFP]], usually comes out on the first Friday of the month at 08:30 New York time: 15:30 in Bucharest. It has three headline numbers: payrolls, from a survey of firms; the unemployment rate, from a survey of households; and average hourly earnings. Each month's payrolls are revised in the next two reports.",
      },
      {
        kind: "match",
        title: "Three numbers and the revisions",
        prompt: "Match each part of the jobs report to what it tells you.",
        pairs: [
          { left: "Payrolls", right: "Jobs added by firms last month", wrong: "Payrolls count jobs on firms' books: the headline number." },
          { left: "Unemployment rate", right: "Share of the labour force without a job", wrong: "The unemployment rate comes from the household survey, not from firms." },
          { left: "Average hourly earnings", right: "Wage growth, a link to inflation", wrong: "Earnings track pay per hour. Fast wage growth can feed inflation." },
          { left: "Revisions", right: "Corrections to the two previous months", wrong: "Revisions update earlier months as more survey answers come in." },
        ],
        columns: ["Part", "What it tells you"],
        correct: "Right. Four pieces, and they often point different ways.",
        concept: "nonfarm-payrolls",
      },
      {
        kind: "explain",
        title: "Sampling noise",
        text: "Payrolls come from a survey, so they carry sampling error. The margin of error on the monthly change is typically over 100,000 jobs; for the household survey it's several hundred thousand. A 90,000 beat can't be told apart from no beat at all. The market trades it anyway, then reassesses as revisions arrive.",
      },
      {
        kind: "worked",
        title: "Hot, cold or mixed?",
        lines: [
          "Payrolls: 90,000 above consensus. Hot.",
          "Unemployment rate: 0.1 points above consensus. Cold.",
          "Hourly earnings: 0.1% below consensus. Cool.",
          "Revisions to the two prior months: −50,000. Cold.",
          "How many of the four readings point hot?",
        ],
        ask: {
          answer: 1,
          tolerance: 0,
          feedback: [
            { value: 4, text: "Only the headline beats. A higher unemployment rate, softer wages and negative revisions all point cold." },
            { value: 2, text: "Check the unemployment rate: higher than expected is cold. Only payrolls point hot." },
          ],
          correct: "Right: one of four.",
        },
        after: "One hot, three cold or cool: the report is **mixed**. The headline says strong; the details say soft. Expect two waves, not one clean move.",
        concept: "nonfarm-payrolls",
      },
      {
        kind: "reveal",
        title: "Two waves",
        prompt: "LABX, market focus on growth. This mixed report lands at T0. What happens over the next five minutes?",
        chart: { candles: NFP_WAVES, visible: 6 },
        choices: [
          { id: "rise", label: "Keeps rising with the headline", feedback: "The headline did lift LABX first. Then the details pulled it back." },
          { id: "fade", label: "Spikes up, then falls below the start", feedback: "Right." },
          { id: "none", label: "No reaction: it's mixed", feedback: "Mixed doesn't mean quiet. It usually means two moves, in opposite directions." },
        ],
        answer: "fade",
        after: "The headline lifted LABX to 100.90 at T0. As traders read the unemployment rate, wages and revisions, it fell to 99.30, below where it started. Stops on both sides were hit within minutes.",
        concept: "nonfarm-payrolls",
      },
      {
        kind: "match",
        title: "Typical reactions to a hot report",
        prompt: "Sort the typical first reaction to a clearly hot jobs report. Typical, not guaranteed.",
        pairs: [
          { left: "2-year government bond yield", right: "Up", wrong: "Strong jobs make higher rates more likely, and short-term yields track expected rates." },
          { left: "US dollar", right: "Up", wrong: "Higher expected rates tend to draw money into the currency." },
          { left: "Gold", right: "Down", wrong: "Gold pays no interest, so higher expected rates tend to weigh on it." },
          { left: "Stocks", right: "It depends", wrong: "Strong jobs help earnings but raise rates. Which wins depends on the market's main fear." },
        ],
        columns: ["Market", "Typical move"],
        correct: "Right. Typical moves, not promises: the regime decides how strong they are.",
        concept: "nonfarm-payrolls",
      },
      { kind: "callout", tone: "key", text: "Read it. Don't trade it yet." },
    ],
    task: {
      widget: "bias-spotter",
      data: NFP_CARDS,
      goal: "Five synthetic jobs reports. Classify each as clearly hot, clearly cold or mixed. Clear only when all three numbers and the revisions point the same way.",
      success: { field: "solved", eq: 5 },
      correct: "All five classified. Two were clear, three mixed: mixed is common, and it's when whipsaws are most likely.",
      hints: ["Lower unemployment is hot. Downward revisions are cold.", "One reading against the rest makes the report mixed."],
      showMe: { solved: 5 },
      concept: "nonfarm-payrolls",
    },
    check: ["q-2.10.4-1", "q-2.10.4-2", "q-2.10.4-3"],
    recap: {
      takeaways: [
        "The jobs report: payrolls, the unemployment rate and hourly earnings, from two surveys, plus revisions.",
        "A beat smaller than the report's margin of error is noise, even when price still jumps.",
        "Clearly hot or cold only when all three numbers and revisions agree; otherwise it's mixed.",
      ],
      next: "Next, 2.10.5: CPI, the inflation report, where headline and core can pull price two ways.",
    },
  },
};

const L2105: Lesson = {
  id: "2.10.5",
  title: "Inflation: CPI",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Headline CPI includes everything, core leaves out food and energy; markets trade core month-on-month, and when the two disagree the reaction often comes in two waves.",
  objectives: [
    "Explain headline and core CPI and why markets focus on core month-on-month.",
    "Size a CPI surprise against the usual spread of CPI surprises.",
    "Wait for the details when headline and core disagree.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M06", label: "The FOMO Trap" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "2.10",
    courseId: "2.10.5",
    bridge: "In 2.10.4 a mixed jobs report moved in two waves. Inflation data does the same when headline and core disagree. Here you size a CPI surprise as z, as in 2.10.1, and wait for core before you decide.",
    hook: {
      prompt: "Headline CPI comes in 0.2 above consensus on energy prices. Core comes in 0.1 below. LABX's first spike is down. What next?",
      control: {
        kind: "choice",
        choices: [
          { id: "fall", label: "Keeps falling" },
          { id: "reverse", label: "Reverses as core is digested" },
          { id: "nothing", label: "Nothing more happens" },
          { id: "cant", label: "Can't tell" },
        ],
        answer: "reverse",
      },
      compare: "You chose {yours}. When headline and core disagree, the second wave usually follows core, so a reversal is the likely path. Likely, not certain.",
      concept: "cpi-inflation",
    },
    learn: [
      {
        kind: "callout",
        tone: "warning",
        text: "Risk first: index futures can gap at the CPI minute, and the reaction often comes in two waves. The first follows the headline, the second follows core. A stop hit in the first wave can miss the turn in the second.",
      },
      {
        kind: "explain",
        title: "What CPI measures",
        text: "The [[cpi]] tracks prices paid by consumers, from tens of thousands of price quotes each month. It typically comes out at 08:30 New York time. Headline CPI covers all items. [[core-inflation|Core]] leaves out food and energy, the most volatile parts. Markets focus on core's month-on-month change, quoted to one decimal.",
      },
      {
        kind: "figure",
        title: "Same release, two stories",
        figure: {
          kind: "bars",
          bars: [
            { label: "Headline, consensus", value: 0.3, role: "neutral" },
            { label: "Headline, actual", value: 0.5, role: "down" },
            { label: "Core, consensus", value: 0.3, role: "neutral" },
            { label: "Core, actual", value: 0.2, role: "up" },
          ],
          unit: "%",
          steps: [
            "Headline, all items: 0.5% against 0.3% expected. Energy did most of it.",
            "Core, without food and energy: 0.2% against 0.3%. Underlying prices cooled.",
          ],
        },
        text: "Energy swings from month to month; core shows the underlying trend that interest rates respond to. That's why the second wave usually follows core.",
        concept: "cpi-inflation",
      },
      {
        kind: "worked",
        title: "Sizing a CPI surprise",
        lines: [
          "Core CPI, month on month: consensus 0.3%, actual 0.2%.",
          "Surprise: 0.2 − 0.3 = −0.1 points.",
          "Core surprises usually vary by about 0.1 points: σ = 0.1.",
          "z = −0.1 ÷ 0.1 = ?",
        ],
        ask: {
          answer: -1,
          tolerance: 0.01,
          feedback: [
            { value: 1, text: "Check the sign: core came in below consensus." },
            { value: -0.1, text: "That's the surprise in points. Divide by σ, 0.1." },
          ],
          correct: "Right: z = −1.0.",
        },
        after: "A full standard deviation. For a number quoted to one decimal, a 0.1 miss in core is typically already a large surprise.",
        concept: "cpi-inflation",
      },
      {
        kind: "reveal",
        title: "Two waves",
        prompt: "Market focus: inflation. The hot headline hits LABX first. What happens over the next five minutes?",
        chart: { candles: CPI_WAVES, visible: 6 },
        choices: [
          { id: "fall", label: "Keeps falling with the headline", feedback: "The first wave did follow the headline. Then core took over." },
          { id: "reverse", label: "Falls, then climbs back above the start", feedback: "Right." },
          { id: "none", label: "No more movement", feedback: "Contradictory details rarely leave price still. Expect a second wave." },
        ],
        answer: "reverse",
        after: "First wave, the headline: down to 99.20. Second wave, core: back above the pre-release price within minutes, closing at 100.70. A tight stop under the first spike's start filled near the low, just before the turn.",
        concept: "cpi-inflation",
      },
      {
        kind: "match",
        title: "Typical reactions",
        prompt: "Sort the typical first reaction to each CPI reading. Typical, and dependent on the regime.",
        pairs: [
          { left: "Hot CPI: bond yields", right: "Up", wrong: "Hotter inflation makes higher rates more likely, so yields tend to rise." },
          { left: "Hot CPI: the dollar", right: "Up", wrong: "Higher expected rates tend to support the currency." },
          { left: "Hot CPI: growth stocks", right: "Down", wrong: "Growth stocks are valued on distant profits, which higher rates discount more." },
          { left: "Cool CPI: bond yields", right: "Down", wrong: "Cooler inflation makes cuts more likely, so yields tend to fall." },
          { left: "Cool CPI: gold", right: "Up", wrong: "Lower expected rates make a metal that pays no interest more attractive." },
        ],
        columns: ["Reading", "Typical move"],
        correct: "Right. Typical first moves; the regime decides how strong they are.",
        concept: "cpi-inflation",
      },
      { kind: "callout", tone: "key", text: "Core first, then decide." },
    ],
    task: {
      widget: "bias-spotter",
      data: CPI_CARDS,
      goal: "Your rule: if headline and core disagree, stay flat until 5 minutes after the release; never act in the first minute. Apply it to five synthetic CPI releases.",
      success: { field: "solved", eq: 5 },
      correct: "Rule kept at all five. Three releases disagreed: the second wave decides those, and waiting costs only the first, most expensive minutes.",
      hints: ["Above consensus is hot, below is cool. Compare the two signs.", "Opposite signs mean flat until T+5. No release gets traded in its first minute."],
      showMe: { solved: 5 },
      concept: "cpi-inflation",
    },
    check: ["q-2.10.5-1", "q-2.10.5-2", "q-2.10.5-3"],
    recap: {
      takeaways: [
        "Core CPI leaves out food and energy; markets watch core month-on-month because it shows the trend.",
        "Size the surprise by the usual spread: a 0.1 core miss with σ 0.1 is z = −1.0.",
        "When headline and core disagree, stay flat until the second wave shows which one wins.",
      ],
      next: "Next, 2.10.6: central banks, whose rate decisions respond to the inflation you just learned to read.",
    },
  },
};

const L2106: Lesson = {
  id: "2.10.6",
  title: "Central banks: the basics",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Central banks move prices by how far a decision and its guidance differ from what was priced; weigh the outcomes by their probabilities to size the surprise.",
  objectives: [
    "Explain what a central bank decides, when, and what the market has already priced.",
    "Compute the surprise of a decision from market-implied probabilities.",
    "Tell hawkish from dovish language, relative to what was expected.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: unexpected event" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "2.10",
    courseId: "2.10.6",
    bridge: "In 2.10.5 inflation data moved prices through what it implied for interest rates. Here are the banks that set those rates. Their decisions surprise like any release (2.10.1), with the spreads and slippage of 2.10.3, at the statement and again at the press conference.",
    hook: {
      prompt: "The market prices a 70% chance of a 25 bp rate cut. Which outcome is the bigger surprise: the cut, or no change?",
      control: {
        kind: "choice",
        choices: [
          { id: "cut", label: "The cut", feedback: "The cut is the likely outcome, so most of it is already in the price. A hold surprises more." },
          { id: "hold", label: "No change", feedback: "Right. A hold is far from what's priced: 17.5 bp hawkish, against 7.5 bp dovish for the cut." },
        ],
        answer: "hold",
      },
      compare: "You chose {yours}. The market expected a 17.5 bp cut on average. A cut is a 7.5 bp dovish surprise; no change is a 17.5 bp hawkish one.",
      concept: "central-bank-decisions",
    },
    learn: [
      {
        kind: "callout",
        tone: "warning",
        text: "Risk first: price can gap at the decision minute. A second move often comes with the press conference, with 30 to 60 minutes of high volatility, and the whipsaw can run from statement to conference to later speeches.",
      },
      {
        kind: "explain",
        title: "What a central bank decides",
        text: "A [[central-bank]] sets its policy rate at scheduled meetings: the [[rate-decision]]. Most aim at stable prices, typically a 2% inflation target; the Fed also aims at maximum employment. Long before the meeting, futures prices show what the market expects. As with any release, the decision moves price by how far it differs from that.",
      },
      {
        kind: "explain",
        title: "When they decide",
        text: "Typical schedules: the Fed, the ECB, the Bank of England and the Bank of Japan each meet eight times a year. The Fed's statement lands at 14:00 New York time, usually 21:00 in Bucharest, with a press conference 30 minutes later. The ECB decides at 14:15 Frankfurt time, 15:15 here; the Bank of England at 12:00 London, 14:00 here.",
      },
      {
        kind: "worked",
        title: "A surprise from probabilities",
        lines: [
          "Futures price a 70% chance of a 25 bp cut, and 30% of no change.",
          "Expected change: 0.70 × 25 = 17.5 bp lower.",
          "If they cut 25: 25 − 17.5 = 7.5 bp more [[dovish]] than priced.",
          "If they hold: 0 against an expected 17.5 bp cut. Size of the [[hawkish]] surprise, in bp = ?",
        ],
        ask: {
          answer: 17.5,
          tolerance: 0.01,
          unit: "bp",
          feedback: [
            { value: 7.5, text: "That's the surprise if they cut. A hold delivers 0 against 17.5 expected." },
            { value: 25, text: "The market didn't expect a full 25 bp: only 70% of it, 17.5." },
          ],
          correct: "Right: 17.5 bp, more than twice the cut's surprise.",
        },
        after: "'No change' sounds like no news, yet here it's the big surprise. Compare a decision with what was priced, not with the current rate. A [[basis-point]] is 0.01 percentage points.",
        concept: "central-bank-decisions",
      },
      {
        kind: "match",
        title: "Hawk or dove?",
        prompt: "Sort each line from a policy statement.",
        pairs: [
          { left: "'Further policy firming may be appropriate.'", right: "Hawkish", wrong: "'Firming' means tightening: higher rates." },
          { left: "'The Committee will be patient.'", right: "Dovish", wrong: "Patience means no hurry to raise rates." },
          { left: "'Risks to inflation remain tilted to the upside.'", right: "Hawkish", wrong: "Worry about inflation points to tighter policy." },
          { left: "'Policy will stay supportive until the recovery is secure.'", right: "Dovish", wrong: "'Supportive' means low rates, kept for longer." },
        ],
        columns: ["Statement line", "Tone"],
        correct: "Right. But tone moves price only against what was expected: a hawkish line that's already priced is no surprise.",
        concept: "central-bank-decisions",
      },
      {
        kind: "reveal",
        title: "Statement, then conference",
        prompt: "Five-minute candles. The decision matches expectations exactly and LABX barely moves. The press conference starts 30 minutes later. What next?",
        chart: { candles: CB_DAY, visible: 9, layers: [{ kind: "marker", index: 6, at: "high", label: "STATEMENT", role: "neutral" }] },
        choices: [
          { id: "quiet", label: "Quiet: the decision was as expected", feedback: "The decision was. The press conference added news of its own." },
          { id: "conf", label: "A bigger move at the press conference", feedback: "Right." },
          { id: "rally", label: "A rally once the statement is digested", feedback: "The statement held no surprise to digest. The news came from the press conference." },
        ],
        answer: "conf",
        after: "The statement moved LABX 0.30 at most. At the press conference the chair hinted at fewer cuts than priced: a hawkish surprise. LABX fell 1.08 in the next 15 minutes.",
        concept: "central-bank-decisions",
      },
      {
        kind: "predict",
        title: "A hike, and the currency falls?",
        prompt: "A central bank raises rates for the first time in years. The hike was fully priced, and the bank says further hikes will be slow. What does its currency do?",
        control: {
          kind: "choice",
          choices: [
            { id: "up", label: "Rises: rates went up", feedback: "Rates did rise, but that was priced. The news was the slow path ahead, dovish against expectations." },
            { id: "down", label: "Falls: the guidance was more dovish than priced", feedback: "Right." },
            { id: "flat", label: "Nothing: the hike was expected", feedback: "The hike alone might have done little. The slow-path guidance added a dovish surprise." },
          ],
          answer: "down",
        },
        reveal: "It can fall. The hike was in the price; the news was a slower path than expected. Something like this happened to the yen in 2024: the Bank of Japan's first hike in 17 years, and the yen still weakened past 150 per dollar.",
        concept: "central-bank-decisions",
      },
      { kind: "callout", tone: "key", text: "To lift its currency, a central bank must be more hawkish than priced." },
    ],
    task: {
      widget: "bias-spotter",
      data: HAWK_CARDS,
      goal: "Six decisions, each read against what the market priced. Is each one more hawkish than priced, as priced, or more dovish?",
      success: { field: "solved", eq: 6 },
      correct: "All six placed. Tone is relative: a cut can read hawkish and no change dovish, depending on what was priced.",
      hints: ["First read what was priced. Then ask: is the decision or the guidance tighter or looser than that?", "A priced move is no surprise. Count only what's new."],
      showMe: { solved: 6 },
      concept: "central-bank-decisions",
    },
    check: ["q-2.10.6-1", "q-2.10.6-2", "q-2.10.6-3"],
    recap: {
      takeaways: [
        "Central banks set rates at scheduled meetings; prices move on the gap between decision and what was priced.",
        "Expected move = probability × size: 70% of 25 bp is 17.5 bp, so a hold surprises more.",
        "Hawkish and dovish only mean something against expectations. Watch the press conference as well as the decision.",
      ],
      next: "Next, 2.10.7: your news policy, stand aside, reduce or trade the surprise, decided before the event.",
    },
  },
};

const L2107: Lesson = {
  id: "2.10.7",
  title: "Stand aside, reduce or trade the surprise",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Decide the news policy before the event: stand aside by default, reduce to a size that survives a gap, or trade only the reaction; the first seconds are no retail edge.",
  objectives: [
    "Choose a news policy before the event: stand aside, reduce, or trade the reaction.",
    "Size a position you keep through an event so a gap of several ATRs stays within 1R.",
    "Explain why trading the first seconds of a release is not a retail edge.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
  ],
  script: {
    unit: "2.10",
    courseId: "2.10.7",
    bridge: "In 2.10.4 to 2.10.6 you read three big releases and saw how they jump. Here you decide in advance what to do about them: stand aside, reduce to a size that survives a gap, as you did for weekends in 2.9.8, or trade the reaction.",
    hook: {
      prompt: "You hold 47 LABX long, risking 98.66. A red event is 20 minutes away. Hold, reduce, or go flat?",
      control: {
        kind: "choice",
        choices: [
          { id: "hold", label: "Hold" },
          { id: "reduce", label: "Reduce" },
          { id: "flat", label: "Go flat" },
        ],
      },
      compare: "You chose {yours}. A written policy decides this before the week starts. Flat by T−15 is the default; reducing works only down to a size a gap can't push past 1R. Holding 47 is neither.",
      concept: "news-policy",
    },
    learn: [
      {
        kind: "callout",
        tone: "warning",
        text: "Risk first, recapped: spreads widen many times over, stops fill after the jump, and a gap can skip your stop entirely. And no timing rule protects you from an unscheduled shock.",
      },
      {
        kind: "explain",
        title: "Three policies",
        text: "A **news policy** picks one of three, before the event. **Stand aside**: no new orders from T−15, and flat, or as the plan says. **Reduce**: keep a smaller position, sized so a gap stays within 1R. **Trade the reaction**: act only after the number. The default is to [[stand-aside|stand aside]].",
      },
      {
        kind: "match",
        title: "Which policy when?",
        prompt: "Match each policy to the situation it fits.",
        pairs: [
          { left: "Stand aside", right: "Any red event on your instrument: the default", wrong: "Standing aside is the default for red events. It costs nothing but a missed move." },
          { left: "Reduce", right: "A swing position you want to keep through the event", wrong: "Reducing is for a position you mean to keep: cut it to a size a gap can't push past 1R." },
          { left: "Trade the reaction", right: "After the number only: a top release, |z| over 2, details agreeing", wrong: "Trading the reaction waits for the number and needs a big, clean surprise." },
        ],
        columns: ["Policy", "When it fits"],
        correct: "Right. Three policies, each chosen before the event, never at T−1 minute.",
        concept: "news-policy",
      },
      {
        kind: "worked",
        title: "Reduce: size for the gap",
        lines: [
          "Long from 100.00, stop 98.00. ATR 0.80.",
          "Plan for a gap of 4 × ATR = 3.20: an exit at 96.80, past your stop.",
          "Each unit loses 3.20 there, plus about 0.10 of commissions.",
          "Most whole units that keep the gap loss within 100.00, commissions included = ?",
        ],
        ask: {
          answer: 30,
          tolerance: 0,
          unit: "units",
          feedback: [
            { value: 31, text: "31 units lose 102.26 in the gap, commissions included: over 100.00." },
            { value: 47, text: "That's your current size. In the gap it would lose 155.03." },
            { value: 50, text: "100.00 ÷ 2.00 = 50 sizes for the stop, not for the gap." },
          ],
          correct: "Right: 30 units lose 98.96 in the gap; 31 would lose 102.26.",
        },
        after: "Keep the stop at 98.00: there, 30 units lose only 62.97. The gap you fear sets the size, not the stop you hope fills. Gaps beyond 4 × ATR still happen: the tails are fat.",
        concept: "news-policy",
      },
      {
        kind: "figure",
        title: "Illustration: the first minute, in 5-second bars",
        figure: {
          kind: "chart",
          chart: { candles: FIRST_MINUTE },
          steps: [
            { text: "T0: the number lands. Algorithms reprice LABX within the first second or two.", layers: [{ kind: "marker", index: 1, at: "high", label: "T0", role: "neutral" }] },
            { text: "A person needs seconds to read, decide and click. Here the order lands at 100.85.", layers: [{ kind: "marker", index: 2, price: 100.85, label: "YOUR CLICK 100.85", role: "accent" }] },
            {
              text: "That's 85% of the first minute's move, 0.85 of 1.00, already gone, at the widest spread.",
              layers: [{ kind: "level", price: 101.0, role: "neutral", label: "1-MIN CLOSE 101.00" }],
            },
          ],
        },
        concept: "news-policy",
      },
      {
        kind: "explain",
        title: "Trading the surprise",
        text: "The first move does tend to follow the surprise at top releases: [[evidence-grade|evidence grade]] B. But most of the repricing happens within seconds, before a person can act, and at the widest spreads. Retail news scalping rates D. Straddles, orders on both sides of the price, can fill twice in a whipsaw.",
      },
      {
        kind: "figure",
        title: "The same gap, three policies",
        figure: {
          kind: "bars",
          bars: [
            { label: "Hold 47 units", value: 155.03, role: "down" },
            { label: "Reduce to 30", value: 98.96, role: "neutral" },
            { label: "Stand aside", value: 0, role: "up" },
          ],
          unit: " vUSD",
          steps: [
            "Hold 47 units: a 4 × ATR gap costs 155.03, over your 100.00 budget.",
            "Reduce to 30: the same gap costs 98.96, within 1R.",
            "Stand aside: the gap costs nothing. A missed move is the only price.",
          ],
        },
        text: "Loss if LABX gaps 3.20 below your 100.00 entry, commissions included.",
        concept: "news-policy",
      },
      { kind: "callout", tone: "key", text: "Standing aside is a strategy. It is the default." },
    ],
    task: {
      widget: "position-size",
      goal: "Keep a LABX long from 100.00 through a red event. ATR is 1.00; plan for a 4 × ATR gap, so the widget's stop is 96.00. Type the most units that lose no more than 100.00 there.",
      start: { account: 10000, riskPct: 1, entry: 100, stop: 96, units: 25 },
      locked: ["account", "riskPct", "entry", "stop"],
      hidden: ["simpleQty", "qty"],
      success: { all: [{ field: "units", eq: 24 }, { field: "stop", eq: 96 }] },
      feedback: [
        { when: { field: "units", eq: 25 }, text: "25 units lose 100.00 on price alone. The commissions add 2.45: 102.45, over budget." },
        { when: { field: "units", gt: 25 }, text: "{units} units would lose {lossAtStop:2} in that gap, over 100.00." },
        { when: { field: "units", lt: 24 }, text: "{units} units fit, but one more would too. Find the most that does." },
      ],
      correct: "Right. 24 units lose 98.36 in a 4 × ATR gap. At a normal stop of 98.00, they'd lose just 50.38.",
      hints: [
        "The gap loss is units × 4.00, plus both commissions.",
        "Without commissions, 25 units lose exactly 100.00. The commissions push that over.",
        "Step down one unit and check the loss.",
      ],
      showMe: { units: 24 },
      concept: "news-policy",
    },
    check: ["q-2.10.7-1", "q-2.10.7-2", "q-2.10.7-3"],
    recap: {
      takeaways: [
        "Pick the news policy before the week starts: stand aside by default, reduce, or trade only the reaction.",
        "To hold through an event, size so a k × ATR gap stays within 1R: 30 units, not 47.",
        "The first seconds belong to algorithms. You'd enter late, at the widest spread: no retail edge.",
      ],
      next: "Next, 2.10.8: the second move, how to trade the reaction once spreads have normalised.",
    },
  },
};

const L2108: Lesson = {
  id: "2.10.8",
  title: "The second move",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Wait for spreads to normalise, mark the post-release range, and trade its break in the surprise's direction with a stop at its other side, or pass.",
  objectives: [
    "Wait for spreads to normalise before acting on a release.",
    "Trade a break of the post-release range with a stop at its other side.",
    "Name the cases where the second move fails: conflicting details, small surprises, the press conference.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: unexpected event" },
    { kind: "mission", ref: "M06", label: "The FOMO Trap" },
  ],
  script: {
    unit: "2.10",
    courseId: "2.10.8",
    bridge: "In 2.10.7 trading the reaction was the third policy. Here is how: wait for spreads to normalise, mark the post-release range and trade its break like the range breakout of 2.8.4, or pass when details disagree, as in CPI's two waves (2.10.5).",
    hook: {
      prompt: "Two news policies: enter at the release, or wait for a break of the 5-minute post-release range. Over many events, which has the smaller worst trade?",
      control: {
        kind: "choice",
        choices: [
          { id: "now", label: "Enter at the release", feedback: "Entering at the release meets the widest spreads and the jumps. Its worst trade can blow far past 1R." },
          { id: "wait", label: "Wait for the range break", feedback: "Right." },
        ],
        answer: "wait",
      },
      compare: "You chose {yours}. Waiting has the smaller worst trade by design: its stop is set after spreads normalise, at a known distance, sized to 1R.",
      concept: "second-move",
    },
    learn: [
      {
        kind: "callout",
        tone: "warning",
        text: "Risk first: in the first 1 to 15 minutes, spreads stay wide, the reaction can come in two waves, and price whipsaws. A press conference can bring a bigger move later. After the news, prefer limit orders.",
      },
      {
        kind: "explain",
        title: "The setup",
        text: "The [[second-move]] waits out the chaos. After the release, wait until the spread is back to at most 2 × normal: 0.20 on LABX. Mark the [[post-release-range]]: the high and low of the first 5 or 15 minutes. Enter on a break of it in the surprise's direction, details agreeing. Stop: the range's other side.",
      },
      {
        kind: "figure",
        title: "Two waves, then a range",
        figure: {
          kind: "chart",
          chart: { candles: SECOND_MOVE },
          steps: [
            { text: "T0: price jumps through an empty book. Spread 1.00, ten times normal.", layers: [{ kind: "marker", index: 5, at: "high", label: "SPREAD 1.00", role: "down" }] },
            { text: "T+1: the second wave runs back down. Stops on both sides get hit.", layers: [{ kind: "marker", index: 6, at: "low", label: "0.60", role: "down" }] },
            { text: "As spreads settle, the first five minutes define the range: 101.00 to 102.00.", layers: [SECOND_RANGE] },
            { text: "T+6: price breaks the range high, in the surprise's direction.", layers: [{ kind: "marker", index: 11, at: "high", label: "BREAK", role: "accent" }] },
          ],
        },
        concept: "second-move",
      },
      {
        kind: "hotspot",
        title: "When can you act?",
        prompt: "Normal spread is 0.10. Each label shows that minute's spread. Tap the first candle where the spread is back under 2 × normal.",
        chart: { candles: SECOND_MOVE.slice(0, 11), layers: SECOND_SPREADS },
        zones: [
          { id: "tp2", label: "T+2", index: 7, feedback: "0.40 is four times normal. Wait." },
          { id: "tp3", label: "T+3", index: 8, feedback: "0.25 is still over 0.20. One more minute." },
          { id: "tp4", label: "T+4", index: 9 },
          { id: "tp5", label: "T+5", index: 10, feedback: "0.12 is fine, but the spread was already under 0.20 a minute earlier." },
        ],
        answer: "tp4",
        correct: "Right: T+4, spread 0.18, under 0.20. Before that, every order paid a news-sized spread.",
        concept: "second-move",
      },
      {
        kind: "worked",
        title: "Size the break",
        lines: [
          "Range: 101.00–102.00. The spread is back to 0.10.",
          "Buy the break at 102.05; stop 100.95, below the range: 1.10 a unit.",
          "Round-trip cost ≈ 0.20 a unit: 0.20 ÷ 1.10 = 0.18R. Acceptable.",
          "Most whole units with the loss at the stop, commissions included, within 100.00 = ?",
        ],
        ask: {
          answer: 83,
          tolerance: 0,
          unit: "units",
          feedback: [
            { value: 90, text: "100.00 ÷ 1.10 = 90 leaves out the commissions. 90 units would lose 108.15." },
            { value: 84, text: "84 units lose 100.93 with commissions: just over." },
          ],
          correct: "Right: 83 units lose 99.73 at the stop.",
        },
        after: "Target at 2R: 102.05 + 2 × 1.10 = 104.25. A false break costs 1R at a normal spread, not a gap at a news spread.",
        concept: "second-move",
      },
      {
        kind: "match",
        title: "Where it fails",
        prompt: "Match each way the second move fails to the sign that warns you.",
        pairs: [
          { left: "Conflicting details", right: "Headline and core, or payrolls and wages, point opposite ways", wrong: "Conflicting details show up inside the report itself, as numbers pointing opposite ways." },
          { left: "A small surprise", right: "|z| under 1: breaks of the range tend to fall back in", wrong: "A small surprise gives the break no fuel, so it often falls back into the range." },
          { left: "The press conference", right: "A scheduled conference 30 minutes after a rate decision", wrong: "A conference after a decision can bring a bigger move the other way." },
          { left: "Spreads still wide", right: "The break comes while the spread is over 2 × normal", wrong: "If the break comes before spreads normalise, the rule says wait." },
        ],
        columns: ["Failure", "Warning sign"],
        correct: "Right. Any one of these, and the plan says pass.",
        concept: "second-move",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Evidence: waiting for normal spreads is a sound way to cut risk (grade B). As a source of edge, the continuation is plausible but less documented (grade C). Test it in your own journal before you trust it.",
      },
    ],
    task: {
      widget: "bracket-builder",
      data: { chart: { candles: SECOND_MOVE.slice(0, 11), layers: [SECOND_RANGE] }, entry: 102.05, units: 83 },
      goal: "The spread is back to 0.10 and price breaks the range high: your buy fills at 102.05, 83 units. Drag the stop below the range and the target to 2R.",
      start: { stop: 101.5, target: 103, units: 83 },
      locked: ["units"],
      success: { all: [{ field: "stop", lt: 101 }, { field: "lossAfter", lte: 100 }, { field: "rr", gte: 2 }] },
      feedback: [
        { when: { field: "stop", gte: 101 }, text: "At {stop:2} the stop sits inside the post-release range, where a normal wobble can hit it. Put it below 101.00." },
        { when: { field: "lossAfter", gt: 100 }, text: "At {stop:2}, 83 units lose {lossAfter:2} with commissions: over 1R. Bring the stop up to just below the range." },
        { when: { field: "rr", lt: 2 }, text: "Stop right. The target sits at {rr:2}R; 2R is 2 × {stopDistance:2} above 102.05." },
      ],
      correct: "Stop {stop:2}, just below the range: 83 units lose {lossAfter:2} there. Target {target:2} is {rr:2}R. Taken only once spreads normalised.",
      hints: ["The range low is 101.00. The stop goes just below it.", "Stop 100.95 risks 1.10 a unit. 2R sits 2.20 above 102.05."],
      showMe: { stop: 100.95, target: 104.25 },
      concept: "second-move",
    },
    check: ["q-2.10.8-1", "q-2.10.8-2", "q-2.10.8-3"],
    recap: {
      takeaways: [
        "Act only once the spread is back under 2 × normal: 0.20 on LABX.",
        "Buy a break of the post-release range, stop at its other side, sized to 1R: 83 units.",
        "Pass on conflicting details, small surprises and pending press conferences: that's where the second move fails.",
      ],
      next: "Next, 2.10.9: one checklist for every order near news, and the shocks no calendar shows.",
    },
  },
};

const L2109: Lesson = {
  id: "2.10.9",
  title: "Your news risk checklist",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Run a short checklist before any order near a scheduled release; against unscheduled shocks only size and leverage help; journal the slippage you actually paid.",
  objectives: [
    "Apply a pre-event checklist before every order near a scheduled release.",
    "Explain why only size and leverage protect you from unscheduled shocks.",
    "Record the slippage you actually paid, per event type.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: unexpected event" },
    { kind: "mission", ref: "M05", label: "Size Matters" },
  ],
  script: {
    unit: "2.10",
    courseId: "2.10.9",
    bridge: "From 2.10.1 to 2.10.8 you built the pieces: surprise, calendar, slippage, policies and the second move. Here you join them into one checklist, and face the shock no calendar shows, where, as with the weekend gap in 2.9.8, only size protects you.",
    hook: {
      prompt: "Which of these protects you from an unscheduled shock?",
      control: {
        kind: "choice",
        choices: [
          { id: "flat", label: "Being flat before the CPI release", feedback: "That handles CPI. An unscheduled shock comes at an hour nobody knew." },
          { id: "stop", label: "A stop-loss", feedback: "In a gap, a stop fills at the first price after the jump, which can be far beyond it." },
          { id: "size", label: "A position small enough to survive a gap", feedback: "Right." },
        ],
        answer: "size",
      },
      compare: "You chose {yours}. An unscheduled shock comes at an hour nobody knew, and a stop can fill far beyond its price. Only size and leverage cap the damage.",
      concept: "news-risk-checklist",
    },
    learn: [
      {
        kind: "callout",
        tone: "warning",
        text: "Risk first: an [[unscheduled-event]], such as a war, an emergency rate move, a dropped currency peg or a flash crash, can't be dodged by being flat at a known hour. Stops fill into empty books. Your defence is size, leverage and holding nothing that can't survive a gap.",
      },
      {
        kind: "explain",
        title: "Two real shocks",
        text: "In 2015 the Swiss central bank dropped its cap on the franc without warning. EUR/CHF fell from 1.20 to well below 1.00 within minutes, stops filled far from their prices, and some brokers failed. In 2010 US stocks fell about 9% within minutes in a flash crash, then recovered much of it the same afternoon.",
      },
      {
        kind: "reveal",
        title: "Nothing on the calendar",
        prompt: "LABX has been calm for days, as in the Arena's Unexpected event. You're long with a stop at 98.00, and nothing is on the calendar. Where does your stop fill?",
        chart: { candles: GAP_SHOCK, visible: 16, layers: [{ kind: "level", price: 98.0, role: "stop", label: "STOP 98.00" }] },
        choices: [
          { id: "at", label: "At 98.00", feedback: "Nothing traded at 98.00: the market reopened far below it." },
          { id: "near", label: "A few cents below 98.00", feedback: "That's ordinary slippage. Here price jumped 15% in one step." },
          { id: "first", label: "At the first bid after the gap, far below", feedback: "Right." },
        ],
        answer: "first",
        after: "The next price was 85.00, so the stop sold at a bid of 84.95: 13.05 below its level. The calendar, your timing and your stop all failed. Only the position's size decided the damage.",
        concept: "news-risk-checklist",
      },
      {
        kind: "worked",
        title: "Leverage decides the damage",
        lines: [
          "Account 10,000. Effective leverage 10:1: an exposure of 100,000.",
          "A 15% gap against you: 0.15 × 100,000 = 15,000 lost.",
          "Balance after the gap: 10,000 − 15,000 = ?",
        ],
        ask: {
          answer: -5000,
          tolerance: 0,
          unit: "vUSD",
          feedback: [
            { value: 5000, text: "Check the sign: you lost more than the account held." },
            { value: 0, text: "That's with negative balance protection. The arithmetic first: 10,000 − 15,000." },
            { value: 8500, text: "That's the result at 1:1. At 10:1 the exposure, and the loss, are ten times bigger." },
          ],
          correct: "Right: −5,000.",
        },
        after: "With [[negative-balance-protection]], which EU retail CFD clients have, the balance stops at 0; without it, you owe the 5,000. At 1:1 the same gap costs 1,500: 15% of the account. Painful, but survivable. More in 2.14.6.",
        concept: "news-risk-checklist",
      },
      {
        kind: "order",
        title: "The checklist, in order",
        prompt: "Put these checklist steps in the order you meet them during an event week.",
        items: [
          "I know every red event for my instruments this week, in my time zone.",
          "My policy for each one is decided now, not at T−1 minute.",
          "If I hold, a gap of k × ATR stays within my maximum loss.",
          "After the release, I wait for normal spreads and prefer limit orders.",
          "I journal the slippage I paid, per event type.",
        ],
        explain: "Right: from the start of the week to the journal. The rest of the list applies throughout: a wider stop only with a smaller size, less size before weekends and holidays, and knowing your broker's news rules.",
        concept: "news-risk-checklist",
      },
      {
        kind: "fields",
        title: "Your news rules",
        prompt: "Set your own news rules. They're saved with this lesson; copy them into your trading plan.",
        fields: [
          { id: "window", label: "Flat __ minutes before a red event", kind: "choice", options: [5, 15, 30], unit: "min", default: 15 },
          { id: "k", label: "When holding, survive a gap of __ × ATR", kind: "stepper", min: 2, max: 6, step: 1, default: 4 },
          { id: "spread", label: "After a release, act once the spread is at most __ × normal", kind: "choice", options: [1.5, 2, 3], default: 2 },
          { id: "journal", label: "Your journal line for each event", kind: "text", default: "", placeholder: "CPI: stop 98.00 filled at 97.40, slippage 0.30R", required: false },
        ],
        valid: { all: [{ field: "window", gte: 15 }, { field: "k", gte: 3 }] },
        feedback: [
          { when: { field: "window", lt: 15 }, text: "5 minutes is too tight: spreads start widening a minute or two before, and you need time to act calmly." },
          { when: { field: "k", lt: 3 }, text: "A 2 × ATR gap is a small one for a big release. Plan for 3 to 5 × ATR." },
        ],
        correct: "Saved. These rules decide at T−15, so you don't have to.",
        concept: "news-risk-checklist",
      },
      { kind: "callout", tone: "key", text: "When the calendar is silent, size is the only protection that works." },
    ],
    task: {
      widget: "bias-spotter",
      data: GATE_CARDS,
      goal: "Six order tickets near red events. Each breaks one item of the news checklist. Name the item it fails.",
      success: { field: "solved", eq: 6 },
      correct: "All six caught. Run the same list before every order near a red event: it takes a minute.",
      hints: [
        "Ask what's wrong: the timing of the decision, the size, the stop, the spread or what you know about your broker.",
        "A gap costing over 1R fails the gap item; a wider stop with the same size fails the stop item.",
      ],
      showMe: { solved: 6 },
      concept: "news-risk-checklist",
    },
    check: ["q-2.10.9-1", "q-2.10.9-2", "q-2.10.9-3"],
    recap: {
      takeaways: [
        "Before any order near a red event, run the checklist: events, policy, gap size, spreads, journal.",
        "No timing dodges an unscheduled shock. Only small size and low leverage cap the damage.",
        "Journal the slippage you paid per event type: it's the real price of trading news.",
      ],
      next: "Next: the 2.10 checkpoint. Then unit 2.11, Portfolio risk and performance, because one event can hit all your positions at once.",
    },
  },
};

// ─── Questions ──────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 2.10.1 · Expectations versus surprise
  {
    id: "q-2.10.1-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does it mean that an expected number is 'priced in'?",
    options: [
      { id: "a", label: "The release has been delayed, so price can't react yet", rationale: "Priced in is about expectations, not timing. A delayed release simply isn't out yet." },
      { id: "b", label: "The number is good for the economy, so price has to rise", rationale: "Good news alone doesn't move price. If it was expected, traders already bought on it." },
      { id: "c", label: "Traders have already positioned for it, so its arrival adds little new" },
      { id: "d", label: "Brokers have widened spreads, so the move is already paid for", rationale: "Wider spreads raise your costs; they don't absorb the news. Priced in means expectations are already in the price." },
    ],
    correct: "c",
    explanation:
      "Prices reflect what traders expect. When the actual matches the consensus, nothing new arrives, so there's little to trade on. The move comes from the surprise: actual minus consensus.",
    lesson: "2.10.1",
    concepts: ["news-surprise"],
  },
  {
    id: "q-2.10.1-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "A synthetic payrolls report: consensus 170,000 jobs, actual 125,000. Surprises in this report usually vary by 50,000. What is the standardised surprise z?",
    numeric: { answer: -0.9, tolerance: 0.01, unit: "z" },
    explanation: "Surprise = 125,000 − 170,000 = −45,000. z = −45,000 ÷ 50,000 = −0.9: a sizeable miss, close to one usual surprise, and on the cold side.",
    lesson: "2.10.1",
    concepts: ["news-surprise"],
    hints: ["Surprise = actual − consensus. Keep the sign.", "z = surprise ÷ the usual size of surprises, σ.", "−45,000 ÷ 50,000 = ?"],
    vary: {
      fields: { cons: [100, 250, 10], diff: [-120, 120, 5], sigma: [40, 80, 10] },
      constraints: ["abs(diff) >= 10", "cons + diff >= 20"],
      answer: "round(diff / sigma, 2)",
      prompt: "A synthetic payrolls report: consensus {cons * 1000} jobs, actual {(cons + diff) * 1000}. Surprises in this report usually vary by {sigma * 1000}. What is the standardised surprise z?",
      explanation: "Surprise = {(cons + diff) * 1000} − {cons * 1000} = {diff * 1000}. z = {diff * 1000} ÷ {sigma * 1000} = {answer:2}.",
      hint: "{diff * 1000} ÷ {sigma * 1000} = ?",
    },
  },
  {
    id: "q-2.10.1-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Payrolls surprises usually vary by 60,000. Today's report beats consensus by 15,000. LABX ticks up 0.10, then drifts back. A trader buys anyway, calling it 'a strong beat'.",
    prompt: "What is the best reading of this release?",
    options: [
      { id: "a", label: "A strong beat: any number above consensus is a buy signal", rationale: "Above consensus isn't enough. 15,000 is a quarter of the usual surprise: z = 0.25." },
      { id: "b", label: "A miss, because the move faded", rationale: "The number did beat consensus. The fading shows the surprise was too small to matter, not that it was a miss." },
      { id: "c", label: "Impossible to judge without last month's number", rationale: "Revisions matter, but you have what you need here: the surprise is a quarter of the usual size." },
      { id: "d", label: "Mostly noise: z = 0.25, where reactions are unreliable" },
    ],
    correct: "d",
    explanation:
      "z = 15,000 ÷ 60,000 = 0.25. Surprises that small happen all the time and give no reliable direction; a small tick that fades is what noise looks like.",
    lesson: "2.10.1",
    concepts: ["news-surprise"],
    hints: ["Standardise the surprise before reading anything into it.", "z = 15,000 ÷ 60,000. Under 0.5 is usually noise."],
  },

  // 2.10.2 · Reading the economic calendar
  {
    id: "q-2.10.2-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "On a calendar row, which value is the actual compared with to measure the surprise?",
    options: [
      { id: "a", label: "Previous", rationale: "Previous is last period's number, already traded. What the market expects now is the consensus." },
      { id: "b", label: "Consensus" },
      { id: "c", label: "Revised", rationale: "The revision corrects last period's number. It matters, but the surprise is measured against the consensus." },
      { id: "d", label: "Impact", rationale: "Impact is the calendar's rating of how much an event usually moves markets, not a number to compare with." },
    ],
    correct: "b",
    explanation: "The consensus is the middle of the forecasts, roughly what's priced in. The surprise is actual minus consensus; the previous and revised values describe last period.",
    lesson: "2.10.2",
    concepts: ["economic-calendar", "news-surprise"],
  },
  {
    id: "q-2.10.2-2",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "A synthetic US release is at 08:30 New York time. It's the week after Europe's clocks went back in late October; the US clocks change next Sunday.",
    prompt: "What time is the release in Bucharest?",
    options: [
      { id: "a", label: "13:30", rationale: "That would need a 5-hour gap. New York is usually 7 hours behind Bucharest, and 6 this week." },
      { id: "b", label: "15:30", rationale: "15:30 is the usual time, with a 7-hour gap. This week Europe has changed its clocks and the US hasn't: 6 hours." },
      { id: "c", label: "14:30" },
      { id: "d", label: "16:30", rationale: "That adds 8 hours. New York is usually 7 hours behind Bucharest, and 6 this week." },
    ],
    correct: "c",
    explanation:
      "Normally 08:30 in New York is 15:30 in Bucharest. Europe ends summer time on the last Sunday of October, the US on the first Sunday of November. In between, the gap is 6 hours: 14:30.",
    lesson: "2.10.2",
    concepts: ["economic-calendar"],
    hints: ["New York is usually 7 hours behind Bucharest.", "Europe has moved its clocks back but the US hasn't yet: the gap shrinks by one hour."],
  },
  {
    id: "q-2.10.2-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Your plan: flat 15 minutes before red events, half size before orange ones, ignore yellow. Thursday has a yellow housing report at 15:30 and an orange jobless-claims report at the same minute. You hold a full-size LABX swing long.",
    prompt: "What does your plan say to do before 15:30?",
    options: [
      { id: "a", label: "Nothing: the housing report is yellow", rationale: "Two events land at the same minute. The higher tier, orange, sets the policy." },
      { id: "b", label: "Go flat: two events at once count as red", rationale: "Your plan has no such rule. Stacked events raise volatility, but by your rules orange means half size." },
      { id: "c", label: "Decide at 15:29, from the price action", rationale: "Triage happens before the week starts. Deciding at T−1 minute is exactly what the plan prevents." },
      { id: "d", label: "Cut to half size before 15:30" },
    ],
    correct: "d",
    explanation: "When events share a minute, the higher impact tier decides. Orange means half size, decided before the week and carried out at the planned time.",
    lesson: "2.10.2",
    concepts: ["economic-calendar", "news-policy"],
    hints: ["When events share a minute, the higher tier sets the policy.", "In this plan, orange means half size."],
  },

  // 2.10.3 · Spreads, slippage and stops at news time
  {
    id: "q-2.10.3-1",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 1,
    prompt: "What typically happens to LABX's market in the minute around a big scheduled release?",
    options: [
      { id: "a", label: "Spreads narrow, because more traders are watching", rationale: "Attention rises, but dealers widen quotes and pull orders before the number. Liquidity is thinnest exactly then." },
      { id: "b", label: "Spreads widen several times over, resting orders thin out, and price can jump across levels" },
      { id: "c", label: "Trading pauses until the number is confirmed", rationale: "Markets keep trading. The problem isn't a pause; it's that price jumps with few orders in between." },
      { id: "d", label: "Nothing changes for stops: they still fill at their price", rationale: "A triggered stop becomes a market order. In a thin, jumping market it fills at the first price available." },
    ],
    correct: "b",
    explanation: "Before a big number, dealers widen quotes and pull resting orders. At the release, price can jump through empty levels, and liquidity usually returns within a minute or two.",
    lesson: "2.10.3",
    concepts: ["news-liquidity"],
  },
  {
    id: "q-2.10.3-2",
    topic: "stop_loss",
    kind: "numeric",
    difficulty: 2,
    prompt: "You're long 40 LABX with a stop at 98.50. At the release, the first bid after the jump is 97.70. Ignoring commission, how much slippage did you pay, in vUSD?",
    numeric: { answer: 32, tolerance: 0.01, unit: "vUSD" },
    explanation: "The stop sold at 97.70, 0.80 below its 98.50 level. 40 × 0.80 = 32.00 of slippage on top of the planned loss.",
    lesson: "2.10.3",
    concepts: ["news-liquidity", "slippage"],
    hints: ["Slippage is the gap between the stop price and the fill.", "98.50 − 97.70 = 0.80 a unit. Multiply by 40."],
    vary: {
      fields: { units: [20, 60, 1], stop: [96, 99, 0.1], slip: [0.2, 2, 0.1] },
      answer: "round(units * slip, 2)",
      prompt: "You're long {units} LABX with a stop at {stop:2}. At the release, the first bid after the jump is {stop - slip:2}. Ignoring commission, how much slippage did you pay, in vUSD?",
      explanation: "The stop sold at {stop - slip:2}, {slip:2} below its {stop:2} level. {units} × {slip:2} = {answer:2} of slippage on top of the planned loss.",
      hint: "{stop:2} − {stop - slip:2} = {slip:2} a unit. Multiply by {units}.",
    },
  },
  {
    id: "q-2.10.3-3",
    topic: "stop_loss",
    kind: "scenario",
    difficulty: 2,
    scenario: "You're long LABX with a stop at 99.00. At the release the mid price dips to 99.30, then recovers. For a few seconds the spread was 0.80. Your stop was filled.",
    prompt: "Why did the stop fill when the mid never reached 99.00?",
    options: [
      { id: "a", label: "The broker hunted your stop", rationale: "No intent is needed. A long stop triggers on the bid, and with a 0.80 spread the bid sat 0.40 under the mid." },
      { id: "b", label: "Stops trigger on the mid with a 0.50 buffer", rationale: "There's no buffer rule. A long stop triggers when the bid reaches it, and the bid is the mid minus half the spread." },
      { id: "c", label: "The bid, 99.30 − 0.40 = 98.90, fell below your stop" },
      { id: "d", label: "It couldn't have: the fill must be an error", rationale: "It's normal at news time. 99.30 minus half of 0.80 puts the bid at 98.90, under 99.00." },
    ],
    correct: "c",
    explanation: "A long stop sells, so it watches the bid. With the spread at 0.80, the bid was 0.40 below the mid: 98.90, under the 99.00 stop. That's a spread-triggered stop.",
    lesson: "2.10.3",
    concepts: ["news-liquidity", "bid-ask-spread"],
    hints: ["A long stop sells, so it watches the bid.", "Bid = mid − half the spread."],
  },

  // 2.10.4 · Nonfarm payrolls
  {
    id: "q-2.10.4-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which numbers make up the headline of the US jobs report?",
    options: [
      { id: "a", label: "Payrolls, CPI and the policy rate", rationale: "CPI is the inflation report and the rate is set by the central bank. The jobs report covers jobs, unemployment and wages." },
      { id: "b", label: "The unemployment rate only, revised once a year", rationale: "Payrolls lead the report, and each month is revised in the next two reports, plus a yearly benchmark." },
      { id: "c", label: "Weekly jobless claims and payrolls, never revised", rationale: "Claims are a separate weekly release, and payroll figures are revised, sometimes by a lot." },
      { id: "d", label: "Payrolls, the unemployment rate and average hourly earnings, with revisions to the two prior months" },
    ],
    correct: "d",
    explanation: "Payrolls come from a survey of firms, the unemployment rate from a survey of households, and hourly earnings track wages. Each report also revises the two previous months.",
    lesson: "2.10.4",
    concepts: ["nonfarm-payrolls"],
  },
  {
    id: "q-2.10.4-2",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "A synthetic payrolls report beats consensus by 70,000. In this report, the margin of error on the monthly change is about 120,000.",
    prompt: "How should you read the beat?",
    options: [
      { id: "a", label: "A reliable sign the economy is accelerating", rationale: "The beat is smaller than the report's own margin of error. Statistically, it can't be told apart from no surprise." },
      { id: "b", label: "Inside the noise, though price may still react to it" },
      { id: "c", label: "Meaningless, so price won't move", rationale: "Markets trade the headline even when it's noisy. It's statistically weak, but price can still jump." },
      { id: "d", label: "A miss, because 70,000 is less than 120,000", rationale: "It's still above consensus. The margin of error tells you how reliable the beat is, not its sign." },
    ],
    correct: "b",
    explanation: "A 70,000 beat inside a 120,000 margin of error is statistically noise. Markets still trade the headline, then reassess as revisions and details arrive.",
    lesson: "2.10.4",
    concepts: ["nonfarm-payrolls", "news-surprise"],
    hints: ["Compare the surprise with the report's own margin of error.", "A beat inside the margin of error is statistically noise; markets may still trade it."],
  },
  {
    id: "q-2.10.4-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "Payrolls 80,000 above consensus. Unemployment rate 0.1 points below consensus. Hourly earnings 0.2% above. Revisions to the prior two months: −60,000.",
    prompt: "How do you classify the report?",
    options: [
      { id: "a", label: "Clearly hot", rationale: "Three readings are hot, but the revisions cut 60,000 jobs. Clear needs every reading to agree." },
      { id: "b", label: "Clearly cold", rationale: "Only the revisions point cold. Payrolls, unemployment and wages all point hot." },
      { id: "c", label: "Mixed" },
      { id: "d", label: "Can't classify it without the price reaction", rationale: "Classify from the numbers before reacting. The first minutes of price action can mislead." },
    ],
    correct: "c",
    explanation: "Payrolls, the unemployment rate and wages point hot, but the revisions point cold. Not every reading agrees, so the report is mixed, and two waves are likely.",
    lesson: "2.10.4",
    concepts: ["nonfarm-payrolls"],
    hints: ["Mark each reading hot or cold. Lower unemployment is hot.", "Clear only when all four readings agree."],
  },

  // 2.10.5 · Inflation: CPI
  {
    id: "q-2.10.5-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "Why do markets focus on core CPI month-on-month rather than the headline?",
    options: [
      { id: "a", label: "Core leaves out volatile food and energy, so it shows the trend that rates respond to" },
      { id: "b", label: "Core includes more prices than the headline", rationale: "It's the opposite: core is the headline without food and energy." },
      { id: "c", label: "Core is the index the Fed's 2% target is defined on", rationale: "The Fed's 2% target uses a different index, PCE. Core CPI matters because it strips out volatile prices." },
      { id: "d", label: "Core comes out a day before the headline", rationale: "Both come out together, in the same release. Core matters because it removes the most volatile prices." },
    ],
    correct: "a",
    explanation: "Food and energy prices swing from month to month. Without them, core shows the underlying trend, and that's what central banks, and so rates, respond to.",
    lesson: "2.10.5",
    concepts: ["cpi-inflation"],
  },
  {
    id: "q-2.10.5-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "Core CPI month-on-month: consensus 0.3%, actual 0.5%. Core surprises usually vary by 0.1 points. What is the standardised surprise z?",
    numeric: { answer: 2, tolerance: 0.01, unit: "z" },
    explanation: "Surprise = 0.5 − 0.3 = +0.2 points. z = 0.2 ÷ 0.1 = +2.0: a large hot surprise.",
    lesson: "2.10.5",
    concepts: ["cpi-inflation", "news-surprise"],
    hints: ["Surprise = actual − consensus, in points.", "z = surprise ÷ the usual spread of surprises.", "0.2 ÷ 0.1 = ?"],
    vary: {
      fields: { cons: [0.1, 0.5, 0.1], diff: [-0.3, 0.3, 0.1], sigma: [0.1, 0.2, 0.05] },
      constraints: ["abs(diff) >= 0.1", "cons + diff >= -0.2"],
      answer: "round(diff / sigma, 2)",
      prompt: "Core CPI month-on-month: consensus {cons:1}%, actual {cons + diff:1}%. Core surprises usually vary by {sigma:2} points. What is the standardised surprise z?",
      explanation: "Surprise = {cons + diff:1} − {cons:1} = {diff:1} points. z = {diff:1} ÷ {sigma:2} = {answer:2}.",
      hint: "{diff:1} ÷ {sigma:2} = ?",
    },
  },
  {
    id: "q-2.10.5-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Your plan: if headline and core CPI disagree, stay flat until 5 minutes after the release. Headline comes in 0.2 above consensus; core 0.1 below. One minute after the release, LABX has fallen 0.80 and looks like it's breaking down.",
    prompt: "What does your plan say?",
    options: [
      { id: "a", label: "Sell now: the first wave shows the direction", rationale: "The first wave follows the headline. With core disagreeing, a second wave the other way is common." },
      { id: "b", label: "Buy now, betting on the reversal", rationale: "Fading the first wave is a different strategy, not your plan. The rule is to stay flat and let the details settle." },
      { id: "c", label: "Stay flat until at least 5 minutes after the release" },
      { id: "d", label: "Sell half: a compromise", rationale: "Half a position still breaks a rule written to keep you flat. Waiting costs nothing but a missed move." },
    ],
    correct: "c",
    explanation: "Headline and core disagree, so the plan says flat until T+5. The first wave follows the headline; the second often follows core, and stops placed in the first can miss the turn.",
    lesson: "2.10.5",
    concepts: ["cpi-inflation", "news-policy"],
    hints: ["Do headline and core point the same way?", "If they disagree, the plan's answer doesn't depend on the chart."],
  },

  // 2.10.6 · Central banks: the basics
  {
    id: "q-2.10.6-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "Markets price a 100% chance of a 25 bp hike. The bank hikes 25 bp, with the guidance everyone expected. What is the likely reaction?",
    options: [
      { id: "a", label: "A big rally in the currency: rates went up", rationale: "The hike was fully expected and already in the price. Without a surprise, there's little left to move it." },
      { id: "b", label: "The currency falls, because hikes hurt growth", rationale: "That's a story, not a surprise. With everything as priced, the likeliest result is little net move." },
      { id: "c", label: "A big move one way or the other: decisions always move markets", rationale: "Decisions move markets by their surprise. A fully priced, as-expected decision usually moves them little." },
      { id: "d", label: "Little reaction: the hike was already priced in" },
    ],
    correct: "d",
    explanation: "Price moves on the gap between the decision and what was priced. A 100% priced hike delivered with the expected guidance adds nothing new.",
    lesson: "2.10.6",
    concepts: ["central-bank-decisions"],
  },
  {
    id: "q-2.10.6-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "Markets price a 40% chance of a 25 bp hike, otherwise no change. The bank holds. How large is the dovish surprise, in basis points?",
    numeric: { answer: 10, tolerance: 0.01, unit: "bp" },
    explanation: "Expected change = 40% × 25 = 10 bp. A hold delivers 0, so it's 10 bp more dovish than priced.",
    lesson: "2.10.6",
    concepts: ["central-bank-decisions", "news-surprise"],
    hints: ["Expected change = probability × size of the move.", "The surprise is what happened minus what was expected."],
    vary: {
      fields: { p: [10, 90, 5], move: [25, 50, 25] },
      answer: "round(p / 100 * move, 2)",
      prompt: "Markets price a {p}% chance of a {move} bp hike, otherwise no change. The bank holds. How large is the dovish surprise, in basis points?",
      explanation: "Expected change = {p}% × {move} = {answer} bp. A hold delivers 0, so it's {answer} bp more dovish than priced.",
      hint: "{p}% of {move} bp = ?",
    },
  },
  {
    id: "q-2.10.6-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "Markets price three rate cuts this year. The bank cuts once, as expected, and says 'one more cut may follow'.",
    prompt: "Relative to expectations, how does the market read this?",
    options: [
      { id: "a", label: "Dovish: the bank cut rates", rationale: "It did cut, but the market expected three cuts in all. Signalling two is tighter than that." },
      { id: "b", label: "Hawkish: fewer cuts than priced" },
      { id: "c", label: "Neutral: the cut was expected", rationale: "The cut was expected; the guidance wasn't. Two cuts in all is fewer than the three priced." },
      { id: "d", label: "Unknowable until the next meeting", rationale: "Guidance moves prices on the day, against what's priced now." },
    ],
    correct: "b",
    explanation: "Hawkish and dovish are relative. The market priced three cuts; the bank signals two. Fewer cuts than priced is a hawkish surprise, even on a day rates went down.",
    lesson: "2.10.6",
    concepts: ["central-bank-decisions"],
    hints: ["Count the cuts priced, then the cuts signalled.", "Tighter than priced is hawkish, whatever the rate did today."],
  },

  // 2.10.7 · Stand aside, reduce or trade the surprise
  {
    id: "q-2.10.7-1",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "On Monday you wrote: 'CPI Wednesday 15:30: flat by 15:15.' At 15:10 on Wednesday your LABX long is up 1.5R and the chart looks strong.",
    prompt: "What do you do?",
    options: [
      { id: "a", label: "Close the position by 15:15, as written" },
      { id: "b", label: "Keep it: a winning trade can absorb a gap", rationale: "Open profit doesn't cap a gap. A large gap can erase it and more; the policy was set for exactly this moment." },
      { id: "c", label: "Keep it, and widen the stop so the spike can't hit it", rationale: "A wider stop at the same size raises the money at risk, and a gap can skip it anyway." },
      { id: "d", label: "Decide at 15:29, depending on the price", rationale: "The point of the policy is not deciding under pressure at T−1 minute." },
    ],
    correct: "a",
    explanation: "The policy was decided calmly, before the week. A strong chart and open profit don't change the gap risk at 15:30, so you follow the plan and go flat by 15:15.",
    lesson: "2.10.7",
    concepts: ["news-policy"],
    hints: ["Who decided the policy, and when?", "Open profit doesn't make a gap smaller."],
  },
  {
    id: "q-2.10.7-2",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 3,
    prompt: "You want to keep a LABX long from 100.00 through a red event. ATR is 0.90, and you plan for a gap of 4 × ATR. With 0.05% commission on each side, how many whole units keep the gap loss within 100.00?",
    numeric: { answer: 27, tolerance: 0, unit: "units" },
    explanation: "The gap exit is 100.00 − 3.60 = 96.40. 27 units lose 97.20, plus 1.35 and 1.31 of commissions: 99.86. 28 units would lose 103.55.",
    lesson: "2.10.7",
    concepts: ["news-policy", "position-sizing"],
    hints: ["The gap is 4 × 0.90 = 3.60 below entry: an exit at 96.40.", "Each unit loses 3.60 plus about 0.10 of commissions.", "100.00 ÷ 3.70 ≈ 27. Check 27 and 28 with both commissions."],
  },
  {
    id: "q-2.10.7-3",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why is trading the first seconds after a release not an edge for a retail trader?",
    options: [
      { id: "a", label: "The direction of the first move is random", rationale: "Not quite: the first move does tend to follow the surprise. The problem is that you can't get there first." },
      { id: "b", label: "Brokers forbid trading during releases", rationale: "Some brokers restrict orders or raise margin around news, but the core problem is speed and cost." },
      { id: "c", label: "Most of the repricing happens within seconds, before you can act, at the widest spreads" },
      { id: "d", label: "The move always happens before the number is published", rationale: "The big move comes after the number. The problem is speed: algorithms reprice in seconds, before you can click." },
    ],
    correct: "c",
    explanation: "Algorithms reprice within a second or two. A person who reads, decides and clicks arrives late, after most of the move, and pays the widest spread. Retail news scalping rates D.",
    lesson: "2.10.7",
    concepts: ["news-policy", "news-liquidity"],
    hints: ["Compare how fast the price adjusts with how fast you can click.", "Think about what the spread is at that moment."],
  },

  // 2.10.8 · The second move
  {
    id: "q-2.10.8-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "LABX's normal spread is 0.10. After a release, when does the second-move plan let you act?",
    options: [
      { id: "a", label: "As soon as the number is out", rationale: "That's trading the first seconds: the widest spreads and the jumps. The second move waits." },
      { id: "b", label: "After exactly one minute, whatever the spread", rationale: "Time alone doesn't make fills fair. The rule watches the spread: at most 2 × normal." },
      { id: "c", label: "Only the next day", rationale: "That misses the setup. The rule asks only for normal spreads and a break of the range." },
      { id: "d", label: "Once the spread is back to 0.20 or less, on a break of the post-release range" },
    ],
    correct: "d",
    explanation: "The second move waits until the spread is at most twice normal, 0.20 on LABX, then trades a break of the post-release range with a stop at its other side.",
    lesson: "2.10.8",
    concepts: ["second-move"],
  },
  {
    id: "q-2.10.8-2",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "Post-release range: 98.80–100.00. You buy the break at 100.05 with a stop at 98.75, below the range. With 0.05% commission on each side, how many whole units keep the loss at the stop within 100.00?",
    numeric: { answer: 71, tolerance: 0, unit: "units" },
    explanation: "Risk per unit: 100.05 − 98.75 = 1.30. 71 units lose 92.30, plus 3.56 and 3.51 of commissions: 99.37. 72 units would lose 100.77.",
    lesson: "2.10.8",
    concepts: ["second-move", "position-sizing"],
    hints: ["Risk per unit = 100.05 − 98.75 = 1.30, plus commissions.", "Without commissions, 100.00 ÷ 1.30 ≈ 76. Commissions cut that.", "Check 71 and 72 with both commissions."],
  },
  {
    id: "q-2.10.8-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "A release beats consensus slightly: z = 0.4. Ten minutes later, spreads are normal and price pokes above the post-release range high. Your plan trades the second move only when |z| is over 1 and the details agree.",
    prompt: "What do you do?",
    options: [
      { id: "a", label: "Buy the break: spreads are normal", rationale: "Normal spreads are needed, but not enough. With z = 0.4, breaks of the range often fail and fall back in." },
      { id: "b", label: "Pass: the surprise is too small, so a false break is likely" },
      { id: "c", label: "Sell: small surprises always reverse", rationale: "They don't always reverse; they just give no reliable direction. Your plan says pass." },
      { id: "d", label: "Buy at half size as a test", rationale: "Half size still breaks the plan's rule. With |z| under 1, the plan says pass." },
    ],
    correct: "b",
    explanation: "A z of 0.4 is close to noise, so the break has little behind it and often falls back into the range. The plan requires |z| over 1 with details agreeing: pass.",
    lesson: "2.10.8",
    concepts: ["second-move"],
    hints: ["Check the surprise against your plan's threshold.", "Small surprises are a known failure case for range breaks."],
  },

  // 2.10.9 · Your news risk checklist
  {
    id: "q-2.10.9-1",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "Friday, 15:20. Payrolls at 15:30 is on your calendar with the policy 'flat'. You spot a clean breakout on LABX and want to buy 40 units now with a 1.50 stop.",
    prompt: "What does the checklist say?",
    options: [
      { id: "a", label: "Take it: the setup is valid and the stop is set", rationale: "A valid setup doesn't change the policy. In the last 15 minutes before a red event, no new orders." },
      { id: "b", label: "Take it at half size", rationale: "Half size is for orange events. For a red one, the policy is flat, with no new orders from T−15." },
      { id: "c", label: "Skip it: no new orders in the last 15 minutes before a red event" },
      { id: "d", label: "Take it and move the stop to break-even before 15:30", rationale: "A gap can skip any stop. The checklist keeps you out, rather than hoping a stop holds." },
    ],
    correct: "c",
    explanation: "The policy for payrolls was decided in advance: flat, with no new orders from 15:15. A good-looking setup ten minutes before a red event is exactly what the checklist screens out.",
    lesson: "2.10.9",
    concepts: ["news-risk-checklist", "news-policy"],
    hints: ["How far away is the red event?", "What did you decide for it before the week started?"],
  },
  {
    id: "q-2.10.9-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which of these limits the damage from an unscheduled shock, such as a sudden currency de-peg?",
    options: [
      { id: "a", label: "Being flat before scheduled releases", rationale: "That handles scheduled events. An unscheduled shock arrives at an hour nobody knew." },
      { id: "b", label: "Small position size and low leverage" },
      { id: "c", label: "A stop-loss order", rationale: "In a gap, the stop fills at the first price after the jump, which can be far beyond its level." },
      { id: "d", label: "Checking the calendar every morning", rationale: "Unscheduled events never appear on the calendar. That's what makes them unscheduled." },
    ],
    correct: "b",
    explanation: "No timing rule dodges an event nobody scheduled, and a stop can fill far beyond its price. Only how much you hold, and how much leverage you use, decide how much a gap can take.",
    lesson: "2.10.9",
    concepts: ["news-risk-checklist", "gap-risk"],
    hints: ["Which of these still works when nobody knew the shock was coming?", "Think about what a gap does to a stop."],
  },
  {
    id: "q-2.10.9-3",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "You journal slippage per event type. At a CPI release, your stop on 50 LABX at 98.00 filled at 97.40. Your 1R is 100.00. How much slippage do you log, in R?",
    numeric: { answer: 0.3, tolerance: 0.01, unit: "R" },
    explanation: "Slippage: 50 × (98.00 − 97.40) = 30.00. In R: 30.00 ÷ 100.00 = 0.30R. Logged per event type, these numbers show what news really costs you.",
    lesson: "2.10.9",
    concepts: ["news-risk-checklist", "journaling"],
    hints: ["Slippage = (stop price − fill) × units.", "Divide by your 1R, 100.00."],
    vary: {
      fields: { units: [20, 70, 1], slip: [0.1, 2, 0.1] },
      answer: "round(units * slip / 100, 2)",
      prompt: "You journal slippage per event type. At a CPI release, your stop on {units} LABX at 98.00 filled at {98 - slip:2}. Your 1R is 100.00. How much slippage do you log, in R?",
      explanation: "Slippage: {units} × (98.00 − {98 - slip:2}) = {units * slip:2}. In R: {units * slip:2} ÷ 100.00 = {answer:2}R.",
      hint: "{units} × {slip:2} = {units * slip:2}. Divide by 100.00.",
    },
  },
];

// ─── Glossary terms ─────────────────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "consensus",
    term: "Consensus",
    definition: "The middle of economists' forecasts for an economic release, published before it; it approximates what the market already expects.",
    plain: "The middle of economists' forecasts for a release; roughly what the market already expects.",
    related: ["surprise", "priced-in", "economic-calendar"],
    lesson: "2.10.1",
    aka: ["Forecast"],
  },
  {
    id: "surprise",
    term: "Surprise",
    definition: "The released value minus its consensus. Divided by the usual size of past surprises, it becomes a standardised surprise, z, comparable across releases.",
    plain: "The released number minus the consensus. Prices react mostly to this.",
    related: ["consensus", "priced-in", "volatility"],
    lesson: "2.10.1",
    aka: ["News surprise", "Standardised surprise"],
  },
  {
    id: "priced-in",
    term: "Priced in",
    definition: "Already reflected in the price, because traders positioned for it in advance, so its arrival moves price little.",
    plain: "Already in the price, so it moves little when it happens.",
    related: ["consensus", "surprise"],
    lesson: "2.10.1",
  },
  {
    id: "economic-calendar",
    term: "Economic calendar",
    definition: "A schedule of upcoming economic releases, central bank decisions and other events, showing the time, impact tier, previous and revised values, consensus and, once published, the actual.",
    plain: "The schedule of upcoming data releases, central bank decisions and other market events.",
    related: ["impact-tier", "consensus", "revision"],
    lesson: "2.10.2",
  },
  {
    id: "impact-tier",
    term: "Impact tier",
    definition: "A calendar's rating of how much an event usually moves markets, often red, orange and yellow; the ratings are editorial and shift with the market regime.",
    plain: "A calendar's rough rating of how much an event usually moves markets.",
    related: ["economic-calendar", "volatility"],
    lesson: "2.10.2",
    aka: ["Impact level"],
  },
  {
    id: "revision",
    term: "Revision",
    definition: "A change to a previously published figure, released with later data; US payrolls, for example, are revised in the two following reports.",
    plain: "A change to a number published earlier, released alongside the new one.",
    related: ["economic-calendar", "nfp", "surprise"],
    lesson: "2.10.2",
  },
  {
    id: "spread-widening",
    term: "Spread widening",
    definition: "An increase in the bid-ask spread, often several times over, as dealers widen their quotes and pull orders around news or in thin markets.",
    plain: "The gap between bid and ask growing, often sharply, around news or in thin markets.",
    related: ["spread", "liquidity", "spread-triggered-stop", "slippage"],
    lesson: "2.10.3",
  },
  {
    id: "spread-triggered-stop",
    term: "Spread-triggered stop",
    definition: "A stop triggered because a widened spread pushed the bid (for a long) or the ask (for a short) through it, although the mid price never reached the stop.",
    plain: "A stop hit because the spread widened, although the mid price never reached it.",
    related: ["spread-widening", "stop-loss", "bid", "mid-price"],
    lesson: "2.10.3",
  },
  {
    id: "nfp",
    term: "NFP",
    definition:
      "Nonfarm payrolls: the monthly US employment report, with payrolls from a survey of firms, the unemployment rate from a survey of households, and average hourly earnings; usually released on the first Friday of the month at 08:30 New York time.",
    plain: "Nonfarm payrolls: the monthly US jobs report, usually released on a Friday at 08:30 New York time.",
    related: ["revision", "consensus", "economic-calendar"],
    lesson: "2.10.4",
    aka: ["Nonfarm payrolls", "Jobs report"],
  },
  {
    id: "cpi",
    term: "CPI",
    definition: "Consumer price index: a monthly measure of the change in prices consumers pay for a basket of goods and services. The headline figure covers all items.",
    plain: "Consumer price index: the main monthly measure of inflation in consumer prices.",
    related: ["core-inflation", "consensus", "hawkish"],
    lesson: "2.10.5",
    aka: ["Consumer price index", "Headline CPI"],
  },
  {
    id: "core-inflation",
    term: "Core inflation",
    definition: "Inflation excluding food and energy, the most volatile prices, used to judge the underlying trend; for CPI, markets focus on its month-on-month change.",
    plain: "Inflation without food and energy prices, which markets watch more closely.",
    related: ["cpi"],
    lesson: "2.10.5",
    aka: ["Core CPI"],
  },
  {
    id: "central-bank",
    term: "Central bank",
    definition: "The institution that sets a currency's policy interest rate and manages its money supply, such as the Federal Reserve, the ECB, the Bank of England or the Bank of Japan.",
    plain: "The institution that sets a currency's interest rates, such as the Fed or the ECB.",
    related: ["rate-decision", "hawkish", "dovish"],
    lesson: "2.10.6",
  },
  {
    id: "rate-decision",
    term: "Rate decision",
    definition: "A central bank's scheduled announcement of its policy interest rate, usually with a statement and often a press conference; it moves prices by how far it differs from what was priced.",
    plain: "A central bank's announcement of its policy interest rate.",
    related: ["central-bank", "basis-point", "priced-in"],
    lesson: "2.10.6",
    aka: ["Policy decision"],
  },
  {
    id: "hawkish",
    term: "Hawkish",
    definition: "Leaning toward higher interest rates or tighter policy; for prices, what counts is being more hawkish than the market expected.",
    plain: "Leaning toward higher interest rates or tighter policy.",
    related: ["dovish", "central-bank", "rate-decision"],
    lesson: "2.10.6",
  },
  {
    id: "dovish",
    term: "Dovish",
    definition: "Leaning toward lower interest rates or easier policy; for prices, what counts is being more dovish than the market expected.",
    plain: "Leaning toward lower interest rates or easier policy.",
    related: ["hawkish", "central-bank", "rate-decision"],
    lesson: "2.10.6",
  },
  {
    id: "stand-aside",
    term: "Stand aside",
    definition: "A news policy of placing no new orders, and holding no position or only what the plan allows, from a set time before an event until after it.",
    plain: "Choosing to hold no new trades or positions around an event. A valid strategy.",
    related: ["flat", "economic-calendar", "second-move"],
    lesson: "2.10.7",
  },
  {
    id: "second-move",
    term: "Second move",
    definition: "The price move after a release once spreads have normalised and the details are digested; traded on a break of the post-release range, with a stop at its other side.",
    plain: "The price move after spreads normalise, once the details of a release are digested.",
    related: ["post-release-range", "stand-aside", "breakout"],
    lesson: "2.10.8",
  },
  {
    id: "post-release-range",
    term: "Post-release range",
    definition: "The high and low of the first minutes after a release, often the first 5 or 15, used to set a second-move entry and its stop.",
    plain: "The high and low of the first minutes after a news release.",
    related: ["second-move", "range", "breakout"],
    lesson: "2.10.8",
  },
  {
    id: "unscheduled-event",
    term: "Unscheduled event",
    definition:
      "News that arrives without warning, such as a geopolitical shock, an emergency policy move, a dropped currency peg or a flash crash. No calendar or timing rule avoids it; only position size and leverage limit the damage.",
    plain: "News that arrives without warning, so no calendar or timing can protect you.",
    related: ["gap", "leverage", "economic-calendar"],
    lesson: "2.10.9",
    aka: ["Unscheduled shock"],
  },
];

// ─── Concepts ───────────────────────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "news-surprise",
    name: "Expectations versus surprise",
    category: "market_fundamentals",
    summary: "Prices react to the difference between a release and its consensus, often measured as a standardised surprise.",
    body: [
      "Before a release, the consensus forecast is largely in the price. What moves price on the day is the surprise: the actual minus the consensus. Dividing it by the usual size of surprises gives a standardised surprise, z, which puts different releases on one scale.",
      "At major releases the first move tends to follow the sign of the surprise, but its size is noisy, and small surprises (in this course, |z| under 0.5) give no reliable direction. Which way a surprise pushes a risk asset depends on what the market fears most: inflation or a slowdown.",
    ],
    example: "Consensus 150,000 jobs, actual 210,000: a surprise of +60,000. If surprises usually vary by 60,000, z = +1.0. An actual of 160,000 gives z = 0.17: noise.",
    related: ["volatility", "base-rates", "expected-value", "economic-calendar"],
    missions: [],
    lessons: ["2.10.1"],
  },
  {
    id: "economic-calendar",
    name: "Economic calendar",
    category: "market_fundamentals",
    summary: "The schedule of releases with time, impact, previous, consensus and actual values; it predicts volatility, not direction.",
    body: [
      "Each row of an economic calendar gives an event's time, an impact tier, the previous value and any revision to it, the consensus and, once published, the actual. It tells you reliably when volatility, spreads and gap risk will rise, but not which way price will go.",
      "Times need converting: US releases are set in New York time, and the US and Europe change their clocks on different dates. Impact tiers are editorial and shift with the regime, and unscheduled events never appear on the calendar.",
    ],
    example: "Payrolls at 08:30 New York time: 15:30 in Bucharest, or 14:30 in the weeks when only one side has changed its clocks. A +60,000 headline with −120,000 of revisions nets to −60,000.",
    related: ["news-surprise", "news-policy", "volatility"],
    missions: [],
    lessons: ["2.10.2"],
  },
  {
    id: "news-liquidity",
    name: "Liquidity at news time",
    category: "stop_loss",
    summary: "Around releases spreads widen, depth falls and stops fill at the first available price after the jump.",
    body: [
      "In the minute before a major release, dealers widen their quotes and pull resting orders. At the number, price can jump across levels where nobody is trading. Liquidity usually returns within a minute or two.",
      "A triggered stop becomes a market order and fills at the first price available, so the loss can exceed the plan. A widened spread can also trigger a long's stop through the bid while the mid price stays above it.",
    ],
    example: "Long 47 LABX at 100.00, stop 98.00, planned loss 98.66. The first bid after the jump is 96.80: the loss is 155.03, 56.37 over plan, about 0.57R of slippage.",
    related: ["bid-ask-spread", "slippage", "stop-loss-order", "gap-risk"],
    missions: [],
    lessons: ["2.10.3"],
  },
  {
    id: "nonfarm-payrolls",
    name: "Nonfarm payrolls",
    category: "market_fundamentals",
    summary: "The monthly US jobs report (payrolls, unemployment rate, wages), with revisions and large sampling noise.",
    body: [
      "The US jobs report usually comes out on the first Friday of the month at 08:30 New York time. Payrolls come from a survey of firms, the unemployment rate from a survey of households, and average hourly earnings show wage growth. Each month's payrolls are revised in the next two reports.",
      "The surveys carry sampling error: the margin of error on the monthly payrolls change is typically over 100,000 jobs. A report is clearly hot or cold only when all three numbers and the revisions agree; otherwise it's mixed, and the reaction often comes in two waves.",
    ],
    example: "Payrolls 90,000 above consensus, unemployment 0.1 points higher, wages 0.1% softer and revisions of −50,000: one hot reading against three cold ones, so the report is mixed.",
    related: ["news-surprise", "economic-calendar", "cpi-inflation"],
    missions: [],
    lessons: ["2.10.4"],
  },
  {
    id: "cpi-inflation",
    name: "Consumer price index",
    category: "market_fundamentals",
    summary: "The monthly US inflation report; markets focus on core month-on-month, and headline and core can disagree.",
    body: [
      "The consumer price index tracks prices paid by consumers. Headline CPI covers all items; core leaves out food and energy, the most volatile parts. Markets focus on core's month-on-month change, quoted to one decimal, so a miss of 0.1 is typically already large.",
      "When headline and core disagree, the reaction often comes in two waves: the first follows the headline, the second follows core. Waiting a few minutes avoids being stopped out by the first wave.",
    ],
    example: "Core consensus 0.3%, actual 0.2%, with core surprises usually varying by 0.1: z = −0.1 ÷ 0.1 = −1.0, a large cool surprise.",
    related: ["news-surprise", "nonfarm-payrolls", "central-bank-decisions"],
    missions: [],
    lessons: ["2.10.5"],
  },
  {
    id: "central-bank-decisions",
    name: "Central bank decisions",
    category: "market_fundamentals",
    summary: "Rate decisions and guidance move prices by how far they differ from what markets had already priced.",
    body: [
      "Central banks set their policy rates at scheduled meetings, typically eight a year for the Fed, the ECB, the Bank of England and the Bank of Japan. Well before each meeting, futures prices show what the market expects.",
      "The surprise is the decision minus the probability-weighted expectation. Guidance counts too: a press conference can bring a second, larger move. Hawkish and dovish only matter relative to what was priced.",
    ],
    example: "Markets price a 70% chance of a 25 bp cut: an expected 17.5 bp. A cut surprises by 7.5 bp, dovish; no change surprises by 17.5 bp, hawkish.",
    related: ["news-surprise", "economic-calendar", "cpi-inflation"],
    missions: [],
    lessons: ["2.10.6"],
  },
  {
    id: "news-policy",
    name: "News policy",
    category: "risk_management",
    summary: "A rule decided in advance for each event: stand aside, reduce to a gap-safe size, or trade the reaction.",
    body: [
      "Standing aside is the default: no new orders from a set time before a red event, and flat or within the plan's rule. Reducing keeps a smaller position, sized so that a gap of several ATRs still costs no more than 1R.",
      "Trading the reaction means acting only after the number. The first move tends to follow the surprise, but most of the repricing happens within seconds, before a person can act and at the widest spreads, so the first seconds are no retail edge.",
    ],
    example: "Long from 100.00 with ATR 0.80: a 4 × ATR gap exits at 96.80. 30 units lose 98.96 there, within 1R; 31 would lose 102.26.",
    related: ["position-sizing", "gap-risk", "news-liquidity", "when-not-to-trade"],
    missions: ["M10"],
    lessons: ["2.10.7"],
  },
  {
    id: "second-move",
    name: "Second move",
    category: "decision_making",
    summary: "Entering after a release only once spreads normalise, on a break of the post-release range.",
    body: [
      "Wait until the spread is back to at most twice normal, mark the high and low of the first 5 or 15 minutes after the release, and enter on a break of that range in the surprise's direction, with a stop at its other side.",
      "It fails on conflicting details, on small surprises and around press conferences. As a way to cut risk it rates B; as a source of edge, C.",
    ],
    example: "Range 101.00–102.00. Buy the break at 102.05, stop 100.95: 1.10 a unit. 83 units lose 99.73 at the stop; the 2R target is 104.25.",
    related: ["news-policy", "breakout", "limit-order", "news-liquidity"],
    missions: [],
    lessons: ["2.10.8"],
  },
  {
    id: "news-risk-checklist",
    name: "News risk checklist",
    category: "risk_management",
    summary: "A short go/no-go list applied before any order near a scheduled event.",
    body: [
      "Before any order near a red event: know the week's events in your time zone, decide each policy in advance, check that a gap of several ATRs stays within your maximum loss, widen a stop only with a smaller size, wait for normal spreads after the release, reduce before weekends and holidays, know your broker's news rules, and journal the slippage you paid.",
      "No checklist protects you from an unscheduled event. There, only position size and leverage decide the damage.",
    ],
    example: "At 10:1 leverage on a 10,000 account, a 15% gap costs 15,000 and leaves −5,000. At 1:1, it costs 1,500.",
    related: ["pre-trade-checklist", "gap-risk", "leverage", "journaling"],
    missions: ["M05"],
    lessons: ["2.10.9"],
  },
];

export const UNIT_2_10: UnitContent = {
  intro: {
    summary:
      "A scheduled release is a volatility event before it is information. This unit measures the surprise against consensus, reads the calendar, shows what spreads, slippage and stops do at release time, reads three big releases, and sets your policy: stand aside, reduce, or trade the second move. It follows 2.9, where you learned release times and gap risk.",
    outcomes: [
      "Measure a release's surprise against consensus as z, and tell a real surprise from noise.",
      "Read a calendar row, convert its time to yours, and triage the week before it starts.",
      "Calculate what a stop really costs when price jumps at a release, in vUSD and in R.",
      "Read jobs and inflation reports as hot, cold or mixed, and rate decisions against what was priced.",
      "Choose a news policy in advance, size holds for the gap, and run the checklist before each order.",
    ],
    buildsOn:
      "Builds on 2.9.1 (release times and the DST weeks), 2.9.8 (gaps a stop can't cap), 1.3.7 (slippage and gaps), 1.4.4 (sizing from the stop), 2.4.6 (ATR) and 0.2.2 (expected value, used to price a rate decision).",
  },
  lessons: [L2101, L2102, L2103, L2104, L2105, L2106, L2107, L2108, L2109],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
