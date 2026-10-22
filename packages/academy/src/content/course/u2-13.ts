import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, Question, TaskData, UnitContent } from "../../types";

/**
 * Unit 2.13 · Playbook, routine and review (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce.
 * 2.13.1 is L15 (content/scripts/u4.ts). Every figure below was checked with a script: ATR(14) is the simple average of the true range.
 */

const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

type Cards = NonNullable<TaskData["cards"]>;
type Options = NonNullable<TaskData["options"]>;

/**
 * The LABX pullback card's chart, 1H. Swing highs 56.60 (c5) and 59.60 (c14), swing lows 55.40 (c7) and the pullback low
 * 56.80 (c19, high 57.20); ATR(14) at c19 = 0.80, so the stop is 56.80 − 0.40 = 56.40. Target 59.60: (59.60 − 57.20) ÷ 0.80 = 3.0R.
 * The future (c20–c26): the 57.20 buy stop fills on c20 (open ask 57.15), and the 56.40 stop fills on c24 (open bid 56.65): −1R.
 */
const PULLBACK: CandleData[] = [
  k(54.0, 54.45, 53.8, 54.3),
  k(54.3, 55.05, 54.2, 54.9),
  k(54.9, 55.6, 54.75, 55.45),
  k(55.45, 56.15, 55.3, 56.0),
  k(56.0, 56.6, 55.85, 56.2),
  k(56.2, 56.35, 55.55, 55.7),
  k(55.7, 56.1, 55.4, 55.6),
  k(55.6, 56.35, 55.5, 56.15),
  k(56.15, 56.9, 56.05, 56.8),
  k(56.8, 57.55, 56.7, 57.45),
  k(57.45, 58.2, 57.3, 58.05),
  k(58.05, 58.75, 57.9, 58.6),
  k(58.6, 59.3, 58.3, 59.15),
  k(59.15, 59.6, 58.8, 59.3),
  k(59.3, 59.4, 58.6, 58.7),
  k(58.7, 58.85, 58.05, 58.15),
  k(58.15, 58.3, 57.5, 57.6),
  k(57.6, 57.75, 56.95, 57.15),
  k(57.15, 57.2, 56.8, 57.1),
  k(57.1, 57.55, 57.0, 57.45),
  k(57.45, 57.7, 57.25, 57.35),
  k(57.35, 57.4, 56.85, 56.95),
  k(56.95, 57.1, 56.6, 56.7),
  k(56.7, 56.75, 56.2, 56.3),
  k(56.3, 56.55, 56.05, 56.45),
  k(56.45, 56.9, 56.4, 56.8),
];
/** Candles up to the pullback's lowest candle (c19), where the card's order is placed. */
const PULLBACK_DECISION = 19;

const CARD_ENTRY: ChartLayer = { kind: "level", price: 57.2, role: "entry", label: "Buy stop 57.20" };
const CARD_TARGET: ChartLayer = { kind: "level", price: 59.6, role: "target", label: "Target 59.60" };
const CARD_STOP: ChartLayer = { kind: "level", price: 56.4, role: "stop", label: "Stop 56.40" };

/**
 * 2.13.3: today's 30-minute LABX candles from 10:00 Bucharest time (c1) to 16:30 (c14); 10 visible, up to the 14:30 candle.
 * Inside yesterday's range, 59.80–60.40; last price 60.10. US CPI at 08:30 New York is 15:30 in Bucharest in July (c12).
 */
const SESSION: CandleData[] = [
  k(60.05, 60.2, 59.95, 60.15),
  k(60.15, 60.3, 60.1, 60.25),
  k(60.25, 60.35, 60.15, 60.2),
  k(60.2, 60.25, 60.05, 60.1),
  k(60.1, 60.15, 59.95, 60.0),
  k(60.0, 60.1, 59.9, 60.05),
  k(60.05, 60.15, 59.95, 60.1),
  k(60.1, 60.2, 60.0, 60.15),
  k(60.15, 60.25, 60.05, 60.1),
  k(60.1, 60.2, 60.05, 60.1),
  k(60.1, 60.15, 60.0, 60.05),
  k(60.05, 60.7, 59.55, 59.7),
  k(59.7, 59.95, 59.5, 59.85),
  k(59.85, 60.0, 59.7, 59.9),
];

// ─── 2.13.4 Try: rewrites of vague rules ─────────────────────────────────

const RULE_OPTIONS: Options = [
  { id: "ok", label: "Valid: one trigger, one action" },
  { id: "trigger", label: "Trigger you can't observe" },
  { id: "action", label: "No action you can check" },
  { id: "open", label: "Leaves the choice open" },
];

const RULE_CARDS: Cards = [
  {
    id: "r1",
    text: "'Don't overtrade' became: If I've taken three trades today, then I place no more orders until tomorrow.",
    answer: "ok",
    correct: "Valid. A count anyone can check, and one action: no more orders today.",
    rationales: {
      trigger: "Three trades is a count on your ticket history. Two people would always agree on it.",
      action: "'No more orders until tomorrow' is easy to check afterwards: the log shows any fourth order.",
      open: "Nothing is left to decide: after the third trade, there is only one thing to do.",
    },
  },
  {
    id: "r2",
    text: "'Avoid bad days' became: If I feel off, then I trade at half size.",
    answer: "trigger",
    correct: "Trigger you can't observe. 'Feel off' needs a test, such as less than six hours' sleep or a check-in of 4 of 5.",
    rationales: {
      ok: "Half size is a clear action, but 'feel off' can be argued either way, exactly when it matters.",
      action: "The action is fine: half size can be checked on every ticket. The trigger is the vague part.",
      open: "The action is a single one. The problem is knowing when the rule fires.",
    },
  },
  {
    id: "r3",
    text: "'Handle news' became: If a red event is within 15 minutes, then I'll be extra careful.",
    answer: "action",
    correct: "No action you can check. 'Extra careful' could mean anything. Try: 'then I place no new orders until the spread is back to normal.'",
    rationales: {
      ok: "The trigger is a time on the calendar, but nobody could check afterwards whether you were 'careful'.",
      trigger: "A red event within 15 minutes is on the calendar for anyone to see. The trigger is fine.",
      open: "There's no choice between actions here. There's no real action at all.",
    },
  },
  {
    id: "r4",
    text: "'Manage winners' became: If price reaches 2R, then I either take profit or trail the stop.",
    answer: "open",
    correct: "Leaves the choice open. Both actions are fine on their own, but 'either … or' hands the decision back to the moment. Pick one.",
    rationales: {
      ok: "The trigger is clear, but the rule doesn't say which action. You'd decide at 2R, under pressure.",
      trigger: "Reaching 2R is a price anyone can see. The trigger isn't the problem.",
      action: "Each action can be checked. The problem is that there are two, and the choice is made later.",
    },
  },
  {
    id: "r5",
    text: "'Respect my stop' became: If price comes within 0.10 of my stop, then I leave the stop where it is.",
    answer: "ok",
    correct: "Valid. A distance anyone can measure, and one action: leave the stop. The log shows whether it moved.",
    rationales: {
      trigger: "0.10 from the stop is a measured distance. Two people watching the same chart would agree.",
      action: "Leaving the stop in place can be checked from the order log: it either moved or it didn't.",
      open: "There's only one action, so nothing is left to decide when price comes close.",
    },
  },
];

// ─── 2.13.5 Try: one week to tag ─────────────────────────────────────────

const TAG_OPTIONS: Options = [
  { id: "clean", label: "Clean" },
  { id: "widen", label: "E-STOP-WIDEN" },
  { id: "chase", label: "E-CHASE" },
  { id: "size", label: "E-SIZE" },
  { id: "event", label: "E-EVENT" },
  { id: "early", label: "E-EXIT-EARLY" },
];

const TAG_CARDS: Cards = [
  {
    id: "t1",
    text: "Pullback card, every condition met, stop kept at 56.40. Stopped out: −1.0R.",
    answer: "clean",
    correct: "Clean. A valid trade that lost: variance, error cost 0.",
    rationales: {
      widen: "The stop stayed at 56.40, where the card put it.",
      chase: "The entry came from the card's trigger, not from a run.",
      size: "Nothing says the size was off. A −1.0R loss is exactly the planned risk.",
      event: "No release is mentioned, and every condition was met.",
      early: "The trade was stopped out, not closed by hand.",
    },
  },
  {
    id: "t2",
    text: "Stop moved from 56.40 to 55.60 as price came close. Stopped at 55.60: −2.0R.",
    answer: "widen",
    correct: "E-STOP-WIDEN. By the rules: −1.0R. Error cost: −1.0R.",
    rationales: {
      clean: "The card put the stop at 56.40. Moving it away doubled the loss, so a rule broke.",
      chase: "The entry isn't the problem here. Look at what happened to the stop.",
      size: "The size didn't change; the distance to the stop did.",
      event: "No release is involved. The stop was moved by hand.",
      early: "Nothing was closed early. The loss grew because the stop moved away.",
    },
  },
  {
    id: "t3",
    text: "Bought after a three-candle run, 2.5 ATR above the 20 EMA. No card allows it. Stopped: −1.0R.",
    answer: "chase",
    correct: "E-CHASE. By the rules: no trade, 0R. Error cost: −1.0R.",
    rationales: {
      clean: "No card allows this entry, so the whole loss comes from the process.",
      widen: "The stop wasn't moved. The problem was buying after the run.",
      size: "The size was normal. The entry itself broke the plan.",
      event: "No release is mentioned. The entry came after a fast run.",
      early: "It was stopped, not closed early. Look at where it was bought.",
    },
  },
  {
    id: "t4",
    text: "Valid card, but sized at 1.4% of equity instead of 1%. Stopped: −1.4R.",
    answer: "size",
    correct: "E-SIZE: 40% over plan, past the 10% tolerance. By the rules: −1.0R. Error cost: −0.4R.",
    rationales: {
      clean: "The card was valid, but 1.4% is 40% more risk than planned. That's a process error.",
      widen: "The stop was kept. The extra loss came from the size.",
      chase: "The setup was valid. Only the size broke the plan.",
      event: "No release is involved. Compare the risk with the plan's 1%.",
      early: "Nothing was closed early. The loss is bigger because the position was.",
    },
  },
  {
    id: "t5",
    text: "Entered 5 minutes before a red release. The spread jumped and the stop filled at −1.6R.",
    answer: "event",
    correct: "E-EVENT. The card says no trade within 15 minutes of a red event: 0R. Error cost: −1.6R.",
    rationales: {
      clean: "The card's no-trade condition covers a red event within 15 minutes. Entering broke it.",
      widen: "The stop wasn't moved: it filled past its price because the spread jumped at the release.",
      chase: "The problem isn't a run before entry, it's the timing: five minutes before a release.",
      size: "Sized normally. The loss grew because the stop filled past its price at the release.",
      early: "It wasn't closed by hand. The release did the damage.",
    },
  },
  {
    id: "t6",
    text: "Closed at +0.5R on one red candle. The plan's 2R target was hit two hours later.",
    answer: "early",
    correct: "E-EXIT-EARLY. By the rules: +2.0R. Error cost: −1.5R.",
    rationales: {
      clean: "It made money, but the plan held to 2R. A profitable trade can still break a rule.",
      widen: "The stop wasn't touched. Look at how the trade ended.",
      chase: "The entry was fine. The exit broke the plan.",
      size: "The size was normal. The plan was broken on the way out.",
      event: "No release is mentioned. A single red candle ended the trade.",
    },
  },
  {
    id: "t7",
    text: "Price gapped through the stop overnight, with nothing on the calendar. Sized at 1%: −1.3R.",
    answer: "clean",
    correct: "Clean. Right size, right stop, no event due: the gap is the market. Variance, error cost 0.",
    rationales: {
      widen: "The stop stayed put; price jumped past it while the market was shut.",
      chase: "Nothing says the entry chased a run.",
      size: "Sized at 1%, as planned. The extra 0.3R came from the gap, not the size.",
      event: "Nothing was on the calendar, so no no-trade condition was broken.",
      early: "The trade wasn't closed by hand. The gap filled the stop.",
    },
  },
  {
    id: "t8",
    text: "Valid card, target hit: +2.0R.",
    answer: "clean",
    correct: "Clean. A winner by the rules: error cost 0.",
    rationales: {
      widen: "The stop was never touched.",
      chase: "The entry came from a valid card.",
      size: "Nothing says the size was off.",
      event: "No release is mentioned.",
      early: "It ran to the plan's target, not closed early.",
    },
  },
];

// ─── 2.13.2 · Building a playbook ────────────────────────────────────────

const L_2_13_2: Lesson = {
  id: "2.13.2",
  title: "Building a playbook",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Write each setup as a checkable card, from regime to no-trade conditions, and judge it only on its own statistics and sample size.",
  objectives: [
    "Write a setup card with regime, trigger, invalidation, management, re-entry and no-trade conditions",
    "Make every field checkable, so two people would agree on it",
    "Keep statistics per setup, with their sample size, before trusting or dropping a setup",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "2.13",
    courseId: "2.13.2",
    hook: {
      prompt: "Your journal has 60 trades tagged with 9 different setup names. On average, how many trades does each setup have to be judged on?",
      control: {
        kind: "slider",
        min: 0,
        max: 60,
        step: 0.1,
        unit: "trades",
        start: 30,
        answer: 6.7,
        tolerance: 1,
        feedback: [
          { from: 0, to: 5.6, text: "A few more than that: 60 ÷ 9 = 6.7 trades a setup. Still far too few." },
          { from: 7.8, to: 60, text: "Fewer than that: 60 ÷ 9 = 6.7 trades a setup. Too few to judge any of them." },
        ],
      },
      compare: "You said {yours}. 60 ÷ 9 = 6.7 trades a setup: too few to judge any of them. Fewer setups, more trades each.",
      concept: "sample-size",
    },
    learn: [
      {
        kind: "explain",
        title: "One card per setup",
        text: "Your [[playbook]] is a set of [[setup-card|setup cards]], one per setup. A card turns 'I trade pullbacks' into rules anyone could check: when the setup is allowed, what triggers the entry, where it's wrong, how it's managed, and when you don't take it. Each card also keeps its own statistics, so you can see which setups earn their place.",
      },
      {
        kind: "figure",
        title: "A complete card",
        text: "The LABX pullback card, field by field. Yours will say different things; the fields stay the same.",
        figure: {
          kind: "flow",
          start: "name",
          nodes: [
            { id: "name", text: "Name: LABX trend pullback, 1H chart", kind: "end" },
            { id: "regime", text: "Regime: uptrend, the last two swing highs and lows each higher", kind: "end" },
            { id: "trigger", text: "Trigger: the pullback holds above the last swing low", kind: "end" },
            { id: "order", text: "Order: buy stop at the high of the pullback's lowest candle", kind: "end" },
            { id: "stop", text: "Stop: the pullback low minus half an ATR", kind: "end" },
            { id: "manage", text: "Targets: the previous swing high, at least 2R; then trail under new swing lows", kind: "end" },
            { id: "reentry", text: "Re-entry: once, on a new trigger, while the last swing low holds", kind: "end" },
            { id: "notrade", text: "No trade: a red event within 15 minutes, or the regime unclear", kind: "end" },
            { id: "quality", text: "Quality: A at 3R or more to target, B at 2R to 3R, under 2R no trade", kind: "end" },
            { id: "evidence", text: "Evidence: sim-tested; course grade C", kind: "end" },
            { id: "stats", text: "Statistics: n, win rate, average R, MAE and MFE, and the interval", kind: "end" },
          ],
          steps: [
            "When: the regime and the trigger, each a yes or no on the chart.",
            "Risk: order type, stop rule, targets and re-entry, all fixed before entry.",
            "When not: no-trade conditions, and a quality grade from the distance to target.",
            "Evidence and statistics: what's been tested, and the numbers so far.",
          ],
        },
        concept: "setup-card",
      },
      {
        kind: "hotspot",
        title: "The missing field",
        prompt: "This card has a regime, a trigger and a target, but no invalidation. The pullback low is 56.80 and the ATR is 0.80. Tap where the card's stop belongs.",
        chart: { candles: PULLBACK.slice(0, PULLBACK_DECISION), layers: [CARD_ENTRY, CARD_TARGET, { kind: "marker", index: 18, at: "low", label: "56.80" }] },
        zones: [
          { id: "inside", label: "Just under the entry, 57.00", from: 56.95, to: 57.05, feedback: "That's inside the pullback candle's own range. Normal noise would stop you out before the idea is wrong." },
          { id: "stop", label: "Under the pullback low, 56.40", from: 56.35, to: 56.45 },
          {
            id: "trend",
            label: "Under the earlier swing low, 55.30",
            from: 55.25,
            to: 55.35,
            feedback: "That's where the whole uptrend fails, not this entry. The pullback idea is already wrong under 56.80, and this stop more than doubles the risk.",
          },
          { id: "target", label: "The target, 59.60", from: 59.55, to: 59.65, feedback: "That's the target, where the idea pays. The missing line is where it fails." },
        ],
        answer: "stop",
        correct: "Right: 56.80 − 0.5 × 0.80 = 56.40. Under the pullback low, the idea that the pullback holds is wrong. Without that line, every exit is decided in the moment.",
        concept: "invalidation-level",
      },
      {
        kind: "match",
        title: "Vague or checkable?",
        prompt: "A card field is useful only if two people would agree on it. Match each vague field to its checkable version.",
        columns: ["Vague", "Checkable"],
        pairs: [
          { left: "Strong trend", right: "Price above the rising 50 MA, with two higher lows", wrong: "'Strong' needs a test: where price sits against a rising average, and the swing lows." },
          { left: "Good pullback", right: "The pullback holds above the last swing low", wrong: "'Good' needs a level the pullback must not break." },
          { left: "Enter when it turns", right: "Buy stop at the high of the pullback's lowest candle", wrong: "'When it turns' needs an order at a price: the turn is proven when that high is taken out." },
          { left: "Avoid news", right: "No entry with a red event within 15 minutes", wrong: "'Avoid news' needs a time window and an impact level from the calendar." },
          { left: "Give it room", right: "Stop at the pullback low minus half an ATR", wrong: "'Room' needs a distance: structure plus a share of the normal range." },
        ],
        correct: "Each checkable field names a level, a count or a time. The card is done when no field needs your mood to read it.",
        concept: "setup-card",
      },
      {
        kind: "worked",
        title: "Statistics per setup",
        lines: [
          "Setup A: 32 trades, average +0.35R. Setup B: 28 trades, average −0.10R.",
          "Both spread about 1.7R a trade (standard deviation).",
          "95% interval = average ± 1.96 × 1.7 ÷ √n: ±0.59R for A, ±0.63R for B.",
          "Lowest plausible average for A: 0.35 − 0.59 = ?",
        ],
        ask: {
          answer: -0.24,
          tolerance: 0.005,
          unit: "R",
          feedback: [
            { value: 0.94, text: "That's the top of the interval. The lowest is the average minus the half-width." },
            { value: -0.59, text: "That's only the half-width. Start from A's average, +0.35R." },
          ],
          correct: "Right: −0.24R. A's interval runs from −0.24R to +0.94R, and B's from −0.73R to +0.53R. Both include zero.",
        },
        after: "Neither setup can be judged yet: A may have no edge, B may be fine. If A kept its average and spread, its interval would clear zero only after 91 trades.",
        concept: "sample-size",
      },
      {
        kind: "callout",
        tone: "key",
        text: "**No card, no trade.** Specialise: one or two setups, until each has about 100 trades. Nine setups over 60 trades tell you very little about any of them.",
      },
      {
        kind: "fields",
        title: "Your card: when to trade",
        prompt: "Write a card for a setup you'd trade, from the unit 2.8 strategies or your plan v1. Make each line checkable: a level, a count, a time or a yes or no.",
        fields: [
          { id: "name", label: "Name, market and timeframe", kind: "text", default: "", placeholder: "e.g. Trend pullback, LABX, 1H", required: true },
          { id: "regime", label: "Regime: when the card is allowed", kind: "text", default: "", placeholder: "e.g. The last two swing highs and lows are each higher", required: true },
          { id: "trigger", label: "Trigger and order type", kind: "text", default: "", placeholder: "e.g. Buy stop at the high of the pullback's lowest candle", required: true },
          { id: "noTrade", label: "No-trade conditions", kind: "text", default: "", placeholder: "e.g. A red event within 15 minutes; regime unclear", required: true },
        ],
        correct: "Saved: the 'when' half of your card. Next, the risk half.",
        concept: "setup-card",
      },
      {
        kind: "fields",
        title: "Your card: risk and records",
        prompt: "Now the risk half. The stop comes from structure or from the ATR, never from how much you'd like to lose. Every card needs an evidence line, even if it says 'untested'.",
        fields: [
          { id: "stop", label: "Stop rule", kind: "text", default: "", placeholder: "e.g. The pullback low minus half an ATR", required: true },
          { id: "manage", label: "Targets and management", kind: "text", default: "", placeholder: "e.g. Previous swing high, at least 2R; then trail under new swing lows", required: true },
          { id: "reentry", label: "Re-entry rule (optional)", kind: "text", default: "", placeholder: "e.g. Once, on a new trigger, while the last swing low holds" },
          { id: "evidence", label: "Evidence: status and course grade", kind: "text", default: "", placeholder: "e.g. Untested; course grade C", required: true },
        ],
        correct: "Saved. Your card's statistics start with its first tagged trade: tag every trade with the card's name, and the numbers build themselves.",
        concept: "setup-card",
      },
    ],
    check: ["q-2.13.2-1", "q-2.13.2-2", "q-2.13.2-3"],
    recap: {
      takeaways: [
        "A setup card fixes regime, trigger, stop, management, re-entry and no-trade conditions before any trade.",
        "Write every field as a level, count, time or yes-or-no, so two people would agree.",
        "Judge each setup on its own trades and interval; at 30 trades, most intervals still include zero.",
      ],
    },
  },
};

// ─── 2.13.3 · The pre-market routine ─────────────────────────────────────

const L_2_13_3: Lesson = {
  id: "2.13.3",
  title: "The pre-market routine",
  topic: "scenario_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Run the same short routine before every session, so the event, limit or regime that changes today's plan is caught before the first order.",
  objectives: [
    "Run a fixed routine before each session: readiness, calendar, regime, levels, scenarios, risk for the day",
    "Catch the event or limit that changes today's plan before the first order",
    "Write two or three if-then scenarios for the session",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
  ],
  script: {
    unit: "2.13",
    courseId: "2.13.3",
    hook: {
      prompt: "It's 14:50 in Bucharest, in July. US CPI comes out at 15:30 Bucharest time. You plan to open a LABX swing trade at 15:00 with a stop 0.80 away. What does a routine catch?",
      control: {
        kind: "choice",
        choices: [
          { id: "now", label: "Enter at 15:00", feedback: "The release lands 30 minutes into the trade. Spreads can widen and price can jump past a 0.80 stop." },
          { id: "wait", label: "Wait until after the release and normal spreads", feedback: "Right. The routine reads the calendar first, so the release is known before the order." },
          { id: "half", label: "Enter at half size", feedback: "Acceptable if your plan's news rule says so. Without a written rule, it's a decision made in the moment." },
        ],
        answer: "wait",
      },
      compare: "You chose “{yours}”. A routine reads the calendar before any order: CPI at 15:30 is 30 minutes after your entry. Wait, or follow your written news rule.",
      concept: "pre-market-routine",
    },
    learn: [
      {
        kind: "explain",
        title: "Same steps, every session",
        text: "A [[pre-market-routine|pre-market routine]] is the same short sequence before every session, about ten minutes. It doesn't find trades. It finds what's different today: an event on the calendar, a limit half used, a regime that no longer fits your card, or a trader who slept four hours. It does this before the first order, while changing the plan costs nothing.",
      },
      {
        kind: "order",
        title: "The routine",
        prompt: "Put the eight steps in order: first you, then the market, then your plan for it, and your risk last.",
        items: [
          "Readiness check: sleep, stress, health",
          "What happened overnight",
          "The calendar: today's events and their times",
          "A regime label for each market you trade",
          "Key levels",
          "Two or three if-then scenarios",
          "Watchlist: which cards could trigger today",
          "Maximum risk for the day, and the open risk you already carry",
        ],
        wrong: "Start with yourself: a failed readiness check changes everything after it. Then the facts, then the plan, and the risk limit last.",
        explain: "You first, because a failed readiness check lowers the risk for everything after it. Then the facts, then your plan for them, and the day's risk last, sized to what you found.",
        concept: "pre-market-routine",
      },
      {
        kind: "hotspot",
        title: "Session start",
        prompt: "14:50, your session-start screen: today's 30-minute LABX candles from 10:00, yesterday's high and low, and the calendar. Tap the item that changes today's plan.",
        chart: {
          candles: SESSION,
          visible: 10,
          range: [59.4, 60.8],
          layers: [
            { kind: "level", price: 60.4, role: "resistance", label: "Yesterday's high 60.40" },
            { kind: "level", price: 59.8, role: "support", label: "Yesterday's low 59.80" },
            { kind: "marker", index: 11, price: 60.6, label: "15:30 US CPI", role: "down" },
          ],
        },
        zones: [
          { id: "high", label: "Yesterday's high, 60.40", index: 3, price: 60.4, feedback: "A key level for your scenarios, but it was there yesterday too. Look for what's new today." },
          { id: "low", label: "Yesterday's low, 59.80", index: 4, price: 59.8, feedback: "A key level for your scenarios, but it was there yesterday too. Look for what's new today." },
          { id: "now", label: "Price now, 60.10", index: 9, price: 60.1, feedback: "That's where price is. The plan changes because of what's scheduled, not where price sits." },
          { id: "cpi", label: "US CPI at 15:30", index: 11, price: 60.6 },
        ],
        answer: "cpi",
        correct: "Right. A high-impact release 30 minutes after your planned entry changes the plan: no new orders until it's out and the spread is back to 0.10.",
        concept: "pre-market-routine",
      },
      {
        kind: "explain",
        title: "Readiness first",
        text: "The first step is your plan's [[fit-to-trade]] line: sleep, stress, illness. If it fails, the routine still runs, but at the risk your plan sets for those days: half, zero, or the simulator only. Tired traders rarely feel tired at the moment of decision. The check is there because the feeling isn't.",
      },
      {
        kind: "match",
        title: "What each step prevents",
        prompt: "Each step exists to catch one mistake before it happens. Match them.",
        columns: ["Step", "Mistake it prevents"],
        pairs: [
          { left: "The calendar", right: "Trading into a scheduled release", wrong: "The calendar is where scheduled releases show up, with their times." },
          { left: "Maximum risk for the day", right: "Breaking the daily loss limit", wrong: "Setting today's maximum loss in advance is what keeps the daily limit intact." },
          { left: "The regime label", right: "Using a range card in a trend", wrong: "The regime label decides which cards are allowed today." },
          { left: "Key levels", right: "Chasing an entry far from any level", wrong: "Levels marked in advance tell you where entries belong, so you don't buy in the middle of a run." },
          { left: "Readiness check", right: "Trading full size on four hours' sleep", wrong: "Readiness is about you: sleep, stress, health." },
        ],
        correct: "Five steps, five mistakes caught before the first order. That's the whole job of the routine.",
        concept: "pre-market-routine",
      },
      {
        kind: "callout",
        tone: "key",
        text: "The routine ends in writing: the regime, two levels, your if-then scenarios and today's maximum risk. The evidence is grade B to C (research on planning, one qualitative study of traders), so judge it by the errors it catches in your own journal.",
      },
      {
        kind: "fields",
        title: "Today's session start",
        prompt: "Run it for this session: LABX at 60.10, yesterday's range 59.80–60.40, US CPI at 15:30. Your plan's daily limit is −3R. Write what the routine produces.",
        fields: [
          { id: "regime", label: "Regime label", kind: "text", default: "", placeholder: "e.g. Range: inside yesterday's 59.80–60.40, no clear trend", required: true },
          { id: "levels", label: "Two key levels", kind: "text", default: "", placeholder: "e.g. 60.40 yesterday's high; 59.80 yesterday's low", required: true },
          {
            id: "scenarios",
            label: "Two or three if-then scenarios, one for the 15:30 release",
            kind: "text",
            default: "",
            placeholder: "e.g. If CPI is within 15 minutes, then no new orders until the spread is back to 0.10",
            required: true,
          },
          { id: "fit", label: "Readiness checks passed: __ of 3", kind: "stepper", min: 0, max: 3, step: 1, default: 3 },
          { id: "dayRisk", label: "Maximum loss today: __R", kind: "stepper", min: 0.5, max: 5, step: 0.5, unit: "R", default: 4 },
        ],
        valid: { all: [{ field: "dayRisk", lte: 3 }, { any: [{ field: "fit", eq: 3 }, { field: "dayRisk", lte: 1.5 }] }] },
        feedback: [
          { when: { field: "dayRisk", gt: 3 }, text: "{dayRisk:1}R is past your plan's daily limit of −3R. Today's maximum can be lower than the limit, never higher." },
          { when: { all: [{ field: "fit", lt: 3 }, { field: "dayRisk", gt: 1.5 }] }, text: "A readiness check failed, so the plan cuts risk: at most half the daily limit, 1.5R, or the simulator only." },
        ],
        correct: "Saved as today's session start. The CPI scenario matters most: it decides what you do from 15:15 until the spread is normal again.",
        concept: "pre-market-routine",
      },
    ],
    check: ["q-2.13.3-1", "q-2.13.3-2", "q-2.13.3-3"],
    recap: {
      takeaways: [
        "Run the same routine every session: readiness, overnight, calendar, regime, levels, scenarios, watchlist, risk.",
        "The routine's job is to catch today's event or limit before the first order.",
        "End it in writing, with two or three if-then scenarios, one for every scheduled release.",
      ],
    },
  },
};

// ─── 2.13.4 · If-then plans ──────────────────────────────────────────────

const L_2_13_4: Lesson = {
  id: "2.13.4",
  title: "If-then plans",
  topic: "psychology",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Turn intentions into if-then rules with one observable trigger and one action, for market events and your own states, and check adherence after each session.",
  objectives: [
    "Turn a vague intention into an if-then rule with an observable trigger and one action",
    "Write if-then rules for market events and for your own emotional triggers",
    "Check after the session which rules fired and whether you followed them",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M06", label: "The FOMO Trap" },
    { kind: "check", ref: "psychology", label: "Psychology check" },
  ],
  script: {
    unit: "2.13",
    courseId: "2.13.4",
    hook: {
      prompt: "Which plan is easier to follow under pressure? A: 'Be careful around news.' B: 'If a red event is within 15 minutes, then I place no new orders.'",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "A", feedback: "'Careful' leaves every decision to the moment, which is exactly when judgement is weakest." },
          { id: "b", label: "B", feedback: "Right: a time you can see on the calendar and an action you can check. Nothing is left to decide." },
        ],
        answer: "b",
      },
      compare: "You chose “{yours}”. B holds under pressure: the trigger is on the calendar and the action is already decided. 'Careful' gets decided in the moment.",
      concept: "if-then-rules",
    },
    learn: [
      {
        kind: "explain",
        title: "Decide before, act on cue",
        text: "In 1.7 you wrote [[if-then-rule|if-then rules]] for urges. Here they cover the whole session: **market triggers**, such as a price, a time, an event or a count, and **state triggers**, such as two losses in a row or a check-in of 4 of 5. Studies outside trading find these plans help people act as intended. Evidence grade B.",
      },
      {
        kind: "match",
        title: "Vague to if-then",
        prompt: "Each vague intention needs one observable trigger and one action. Match it to its if-then version.",
        columns: ["Vague", "If-then"],
        pairs: [
          { left: "Don't chase", right: "If price is more than 2 ATR above the 20 EMA, then I wait for a pullback", wrong: "Chasing is buying far from value: the trigger measures that distance." },
          { left: "Control your losses", right: "If I lose two trades in a row, then I pause for 15 minutes", wrong: "Losses in a row are a count you can see. The action is a timed pause." },
          {
            left: "Respect the range",
            right: "If a candle closes outside the range, then I stop range trading and switch to the breakout card",
            wrong: "A range is respected until a close outside it. That close is the trigger.",
          },
          { left: "Stay out of messy markets", right: "If my regime label is 'unclear', then I trade no card that needs a trend", wrong: "'Messy' needs the routine's regime label to become observable." },
        ],
        correct: "Each rule has a trigger anyone could see and one action you can check afterwards.",
        concept: "if-then-rules",
      },
      {
        kind: "worked",
        title: "From scenarios to rules",
        lines: [
          "Bullish: if two candles close above 60.50, then I buy near 60.80, stop 59.90, target 62.60.",
          "False breakout: if one candle closes above 60.50 and the next closes back inside, then no entry.",
          "Bearish: if a candle closes below 59.00, then I drop the long idea.",
          "Sideways: if price stays between 59.00 and 60.50, then I wait.",
          "Rules that end in no new order: ?",
        ],
        ask: {
          answer: 3,
          tolerance: 0,
          feedback: [
            { value: 1, text: "That's the rule that places an order. Count the others: no entry, drop the idea, wait." },
            { value: 4, text: "The bullish rule does place an order. The other three don't." },
          ],
          correct: "Right: three of four. Most if-then rules stop you acting; few tell you to act.",
        },
        after: "Written this way, the scenario plan from 2.13.1 becomes four rules you can mark after the session: fired or not, followed or not.",
        concept: "scenario-planning",
      },
      {
        kind: "figure",
        title: "After the session",
        text: "Tuesday's five rules, marked after the session. Adherence counts only the rules that fired.",
        figure: {
          kind: "flow",
          start: "r1",
          nodes: [
            { id: "r1", text: "If a red event is within 15 minutes, no new orders: fired, followed", kind: "end" },
            { id: "r2", text: "If two candles close above 60.50, buy near 60.80: didn't fire", kind: "end" },
            { id: "r3", text: "If I lose two in a row, pause 15 minutes: fired, not followed", kind: "end" },
            { id: "r4", text: "If price is 2 ATR above the 20 EMA, wait: fired, followed", kind: "end" },
            { id: "r5", text: "If my check-in is 4 of 5, half size: fired, followed", kind: "end" },
          ],
          steps: [
            "Five rules written before the session. One never fired.",
            "Four fired. Three were followed; the pause after two losses wasn't.",
            "Adherence = followed ÷ fired = 3 ÷ 4 = 75%.",
          ],
        },
        concept: "if-then-rules",
      },
      {
        kind: "predict",
        title: "Fired, not followed",
        prompt: "The pause rule fired after two losses, and you traded again five minutes later. What goes in the journal?",
        control: {
          kind: "choice",
          choices: [
            { id: "nothing", label: "Nothing: the next trade won", feedback: "The outcome doesn't erase the break. A rule broken on a winning trade is still broken." },
            { id: "tag", label: "The error tag, and the rule that fired", feedback: "Right. Tag the break and name the rule, so both can be counted." },
            { id: "delete", label: "Delete the rule: it doesn't suit you", feedback: "One break isn't evidence against a rule. Rules change only through your plan's rule for changes." },
          ],
          answer: "tag",
        },
        reveal: "Log the [[error-tag|error tag]] and the rule that fired. Over a month, adherence by rule shows which rules you keep and which need a [[guard-rail]], such as a pause timer the app enforces.",
        concept: "if-then-rules",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A rule that never fires costs nothing. A rule that fires and isn't followed is your next process goal. Track adherence: followed ÷ fired.",
      },
      {
        kind: "fields",
        title: "Your if-then rules",
        prompt: "Write two rules for your next session: one for a market event and one for your own state. One observable trigger and one action each.",
        fields: [
          { id: "market", label: "If [market trigger], then [one action]", kind: "text", default: "", placeholder: "e.g. If a red event is within 15 minutes, then I place no new orders", required: true },
          { id: "state", label: "If [your state], then [one action]", kind: "text", default: "", placeholder: "e.g. If I lose two trades in a row, then I pause for 15 minutes", required: true },
        ],
        correct: "Saved for your next session. Afterwards, mark each one: fired or not, followed or not.",
        concept: "if-then-rules",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: { cards: RULE_CARDS, options: RULE_OPTIONS },
      goal: "Five vague rules, each rewritten by a trader. Check each rewrite: one observable trigger and one action, with nothing left to decide in the moment.",
      success: { field: "solved", eq: 5 },
      correct: "Five rewrites checked, two valid. The others leave a feeling, a vague action or a choice to the moment, which is what the rule was meant to remove.",
      hints: [
        "Trigger test: could two people watching the same screen agree it happened?",
        "Action test: is there exactly one thing to do, and could you check later that you did it?",
        "'Either … or' means the decision is still waiting for the moment.",
      ],
      showMe: { solved: 5 },
      concept: "if-then-rules",
    },
    check: ["q-2.13.4-1", "q-2.13.4-2", "q-2.13.4-3"],
    recap: {
      takeaways: [
        "An if-then rule has one observable trigger and one action, so nothing is left to decide.",
        "Write rules for market events and for your own states, such as two losses in a row.",
        "After each session, mark rules fired and followed. Adherence = followed ÷ fired.",
      ],
    },
  },
};

// ─── 2.13.5 · The error taxonomy ─────────────────────────────────────────

const L_2_13_5: Lesson = {
  id: "2.13.5",
  title: "The error taxonomy",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Tag process errors from a fixed list, price each one in R against the same trade done by the rules, and fix the costliest one first.",
  objectives: [
    "Tag process errors from a fixed list instead of free text",
    "Compute the cost of each error in R against the same trade done by the rules",
    "Separate mistakes, which you fix, from variance, which you accept",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "2.13",
    courseId: "2.13.5",
    hook: {
      prompt: "This month: 40 trades, net −3.0R. Trades tagged 'stop widened' cost −6.4R compared with the same trades done by the rules. What would the month have been without that one error?",
      control: {
        kind: "slider",
        min: -5,
        max: 5,
        step: 0.1,
        unit: "R",
        start: 0,
        answer: 3.4,
        tolerance: 0.2,
        feedback: [
          { from: -5, to: 3.1, text: "Higher than that. Remove the error's cost: −3.0 − (−6.4) = +3.4R." },
          { from: 3.7, to: 5, text: "A little lower: −3.0 + 6.4 = +3.4R." },
        ],
      },
      compare: "You said {yours}. Without the stop widening: −3.0 − (−6.4) = +3.4R. One error turned a winning month into a losing one.",
      concept: "error-taxonomy",
    },
    learn: [
      {
        kind: "explain",
        title: "A fixed list",
        text: "In 1.6 you named mistakes with the app's [[error-tag|error tags]]. Level 2 uses a fixed list of codes, so a month can be counted, not just remembered: E-SETUP, E-SIZE, E-STOP-NONE, E-STOP-WIDEN, E-EXIT-EARLY, E-EXIT-LATE, E-AVG-DOWN, E-REVENGE, E-LIMIT, E-EVENT, E-HEAT, E-CHASE, E-JOURNAL. Free text like 'bad trade' can't be added up.",
      },
      {
        kind: "match",
        title: "Journal line to tag",
        prompt: "Each journal line gets one code. Match them.",
        columns: ["Journal line", "Tag"],
        pairs: [
          { left: "Bought a breakout that isn't on any card", right: "E-SETUP", wrong: "No card allows the trade at all: the setup itself is the error." },
          { left: "Risked 1.3% where the plan says 1%", right: "E-SIZE", wrong: "1.3% is 30% over plan, past the 10% tolerance: a size error." },
          { left: "Moved the stop from 56.40 to 55.60 as price came close", right: "E-STOP-WIDEN", wrong: "The stop moved away from price, raising the risk." },
          { left: "Closed at +0.5R on one red candle; the plan held to 2R", right: "E-EXIT-EARLY", wrong: "The exit came before the plan's target, on a single candle." },
          { left: "Entered three minutes before a red release", right: "E-EVENT", wrong: "The timing broke a no-trade condition around a scheduled event." },
          { left: "Bought 2.5 ATR above the 20 EMA after a fast run", right: "E-CHASE", wrong: "Buying far from value after a run is chasing." },
        ],
        correct: "Six lines, six codes. Some already exist in your debrief under long names: E-STOP-WIDEN is 'Moving the stop further away', E-CHASE is 'Chasing extended moves'.",
        concept: "error-taxonomy",
      },
      {
        kind: "worked",
        title: "Price one error",
        lines: [
          "Entry 57.20, planned stop 56.40: 1R is 0.80 a unit.",
          "The stop was moved to 55.60 and hit: 1.60 a unit, or −2.0R.",
          "By the rules, the stop at 56.40 would have cost −1.0R.",
          "Error cost = −2.0 − (−1.0) = ?",
        ],
        ask: {
          answer: -1,
          tolerance: 0,
          unit: "R",
          feedback: [
            { value: -2, text: "That's the whole loss. Take away what the rules would have lost anyway: −1.0R." },
            { value: 1, text: "Right size, but it's a cost: write it as −1.0." },
          ],
          correct: "Right: −1.0R. [[error-cost|Error cost]] compares a trade with the same trade done by the rules, not with a perfect trade.",
        },
        after: "Add up a month of these and you get the hook: −6.4R of stop widening, against a month of −3.0R. A stop hit at −1R by the rules costs nothing: that's variance.",
        concept: "error-taxonomy",
      },
      {
        kind: "figure",
        title: "The month's Pareto",
        text: "The same month: every error cost added up by tag and sorted, biggest first.",
        figure: {
          kind: "bars",
          unit: "R",
          bars: [
            { label: "E-STOP-WIDEN", value: -6.4 },
            { label: "E-CHASE", value: -2.1 },
            { label: "E-EXIT-EARLY", value: -1.3 },
            { label: "E-SIZE", value: -0.8 },
            { label: "E-EVENT", value: -0.6 },
          ],
          steps: ["Five tags cost −11.2R in total this month.", "E-STOP-WIDEN alone is −6.4R, more than half of it."],
        },
        concept: "error-taxonomy",
      },
      {
        kind: "match",
        title: "Mistake or variance?",
        prompt: "Six losing trades. Sort each into Mistake, which gets a tag, or Variance, which you accept.",
        pairs: [
          { left: "Every rule followed; stopped at −1.0R, then price ran to the target", right: "Variance", wrong: "Every rule was followed. What price did after the exit doesn't make it a mistake." },
          { left: "Entered 5 minutes before a red release; the spread jumped; −1.6R", right: "Mistake", wrong: "The card's no-trade window around red events was broken. That's E-EVENT." },
          { left: "Gap through the stop overnight, no event due, sized at 1%: −1.3R", right: "Variance", wrong: "Size and stop were right, and nothing was due. The gap is the market." },
          { left: "Stop moved down as price came close; −2.0R", right: "Mistake", wrong: "Moving the stop away broke the plan: E-STOP-WIDEN." },
          { left: "Fourth stop-out in a row on a valid card, −1.0R each", right: "Variance", wrong: "A streak with every rule followed is variance, however it feels." },
          { left: "Risked 1.5% after two losses 'to get it back'; −1.5R", right: "Mistake", wrong: "Sizing up after losses breaks the risk rule: E-REVENGE." },
        ],
        correct: "Three each. The test is the plan, not the result: a −1.3R gap at the right size is variance; a −1.6R release trade is a mistake.",
        concept: "mistake-vs-variance",
      },
      {
        kind: "predict",
        title: "One drill",
        prompt: "From the month's Pareto, which drill do you start with?",
        control: {
          kind: "choice",
          choices: [
            { id: "widen", label: "Stops are placed with the order and never edited after entry", feedback: "Right. It targets −6.4R, more than half of the month's error cost." },
            { id: "chase", label: "Enter only at the card's level, never after a run", feedback: "A good drill, but it targets −2.1R. The biggest bar is the stop widening." },
            { id: "all", label: "All five at once", feedback: "Five drills at once means none gets your full attention. Start with the biggest bar." },
          ],
          answer: "widen",
        },
        reveal: "One drill, aimed at the biggest bar. Next month's Pareto shows whether it worked: the E-STOP-WIDEN bar should shrink, whatever the month's profit.",
        concept: "error-taxonomy",
      },
      {
        kind: "callout",
        tone: "key",
        text: "**Fix the biggest bar first.** Mistakes get a tag, a cost and a drill. Variance gets nothing: no tag, no drill, no rule change.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: { cards: TAG_CARDS, options: TAG_OPTIONS },
      goal: "Eight trades from one week. Tag each with its error code, or mark it Clean if every rule was followed. Each trade's error cost appears when you answer.",
      success: { field: "solved", eq: 8 },
      correct: "All eight tagged: five errors, three clean. Total error cost: −5.5R, with E-EVENT the biggest at −1.6R. That's this week's drill.",
      hints: [
        "First ask: was every rule followed? If yes, it's Clean, whatever the result.",
        "If not, name the one rule that broke: entry, size, stop, timing or exit.",
        "Error cost = result as traded − result by the rules.",
      ],
      showMe: { solved: 8 },
      concept: "error-taxonomy",
    },
    check: ["q-2.13.5-1", "q-2.13.5-2", "q-2.13.5-3"],
    recap: {
      takeaways: [
        "Tag every process error from the same fixed list, so a month of errors can be counted.",
        "Error cost = result as traded minus the same trade done by the rules, in R.",
        "Mistakes get a tag and a drill; variance gets nothing. Fix the biggest bar first.",
      ],
    },
  },
};

// ─── 2.13.6 · Daily and weekly reviews ───────────────────────────────────

const L_2_13_6: Lesson = {
  id: "2.13.6",
  title: "Daily and weekly reviews",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Review each day in minutes by grading decisions, review each week by setup, time and error tag to set one process goal, and replay trades blind.",
  objectives: [
    "Run a five-to-ten-minute daily review that grades decisions, not profit",
    "Run a weekly review by setup, time of day and error tag, ending with one process goal",
    "Review in blind replay so hindsight doesn't rewrite your decisions",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "2.13",
    courseId: "2.13.6",
    hook: {
      prompt: "Monday's best trade made +2.6R. The best decision of the day was skipping a trade that would have broken your rules. Which goes in the review as 'best'?",
      control: {
        kind: "choice",
        choices: [
          { id: "trade", label: "The +2.6R trade", feedback: "It made the most, but a profit says little about the decision behind it. The review grades decisions." },
          { id: "skip", label: "The skipped trade", feedback: "Right. Skipping a trade that broke your rules was the day's best decision, even though it paid nothing." },
        ],
        answer: "skip",
      },
      compare: "You chose “{yours}”. The review's 'best' is a decision: the skipped trade kept a rule. A +2.6R result can come from a sound decision or a lucky one.",
      concept: "trading-reviews",
    },
    learn: [
      {
        kind: "explain",
        title: "The daily report",
        text: "The simulator writes most of your [[daily-review|daily review]]: trades, rules followed, error tags, risk used. Your part takes five to ten minutes and grades **decisions**, not profit: the best and the worst of the day, each loss sorted as mistake or variance, and one lesson for tomorrow.",
      },
      {
        kind: "order",
        title: "The daily review",
        prompt: "Put the daily review in order. Then write the lesson from your last session, real or simulated.",
        items: [
          "Read the day's process KPIs",
          "Name the best and the worst decision",
          "Sort each loss: mistake or variance",
          "Write one lesson",
          "Prepare tomorrow: put the lesson into the routine",
        ],
        wrong: "Start from the facts the simulator logged, and end with tomorrow. The lesson comes after the losses are sorted.",
        explain: "Facts, then decisions, then losses, then one lesson, then tomorrow. Grading decisions before you dwell on the profit keeps the result from grading them for you.",
        note: { key: "2.13.6:lesson", label: "The lesson from your last session (optional)", placeholder: "e.g. I skipped the routine on Tuesday and entered 5 minutes before a release." },
        concept: "trading-reviews",
      },
      {
        kind: "explain",
        title: "The weekly review",
        text: "Once a week, the [[weekly-review|weekly review]] slices your trades by setup, time of day, instrument and error tag, and sets your equity curve against the range your [[expectancy]] predicts. It ends with **one process goal**, taken from the costliest error, and a short note of what went well, so good habits get written down too.",
      },
      {
        kind: "figure",
        title: "The week by error",
        text: "A synthetic week of 25 trades: error cost by tag and time of day, biggest first.",
        figure: {
          kind: "bars",
          unit: "R",
          bars: [
            { label: "E-CHASE, first 30 min", value: -2.4 },
            { label: "E-EXIT-EARLY", value: -0.9 },
            { label: "E-STOP-WIDEN", value: -0.5 },
            { label: "E-CHASE, later", value: -0.3 },
            { label: "E-SIZE", value: -0.2 },
          ],
          steps: ["Total error cost this week: −4.3R.", "Chasing in the first 30 minutes alone: −2.4R, more than half."],
        },
        concept: "trading-reviews",
      },
      {
        kind: "reveal",
        title: "Blind replay",
        prompt: "In a [[blind-replay|blind replay]], the chart stops at the decision point. Monday's pullback card: buy stop 57.20, stop 56.40, target 59.60. Place the order?",
        chart: { candles: PULLBACK, visible: PULLBACK_DECISION, layers: [CARD_ENTRY, CARD_STOP, CARD_TARGET] },
        choices: [
          { id: "place", label: "Place it: every condition is met" },
          {
            id: "skip",
            label: "Skip it",
            feedback: "Check the card: higher swing highs and lows, the pullback held above 55.40, and 3.0R to the target. Every condition is met.",
          },
        ],
        answer: "place",
        after: "Filled at 57.20, then stopped at 56.40: −1R. Blind, the decision met every condition: a good decision with a bad outcome. Shown the loss first, it's easy to find a flaw that was never on the screen.",
        concept: "hindsight-bias",
      },
      {
        kind: "predict",
        title: "One goal",
        prompt: "From the week's error costs, pick next week's single process goal.",
        control: {
          kind: "choice",
          choices: [
            { id: "profit", label: "Make +5R next week", feedback: "An outcome goal: luck decides much of one week, and chasing it pushes size up." },
            { id: "open", label: "In the first 30 minutes, enter only at the card's level, never after a run", feedback: "Right. It targets the biggest cost, −2.4R, and it's fully in your control." },
            { id: "hold", label: "Hold every winner to its target", feedback: "A process goal, but it targets −0.9R. The biggest cost this week is chasing at the open." },
            { id: "stops", label: "Never widen a stop", feedback: "A good rule, but it cost −0.5R this week. Start with the biggest bar." },
            { id: "winrate", label: "Win 60% of trades", feedback: "An outcome you don't control. A process goal names an action you can check." },
          ],
          answer: "open",
        },
        reveal: "One goal, from the biggest bar, worded as an action you can check every day. Next week's review then shows whether it worked.",
        concept: "trading-reviews",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Four weekly reviews in a row are part of the Level 2 gate. Review blind and grade decisions: [[hindsight-bias|hindsight bias]] is well documented (grade B), and it's how a valid loss becomes a 'mistake'.",
      },
    ],
    check: ["q-2.13.6-1", "q-2.13.6-2", "q-2.13.6-3"],
    recap: {
      takeaways: [
        "Daily: five to ten minutes grading decisions, sorting losses, writing one lesson, preparing tomorrow.",
        "Weekly: slice by setup, time and error tag; end with one process goal from the biggest cost.",
        "Replay blind: grade the decision on what you could see, not on the outcome.",
      ],
    },
  },
};

// ─── 2.13.7 · KPIs and goals ─────────────────────────────────────────────

const L_2_13_7: Lesson = {
  id: "2.13.7",
  title: "KPIs and goals",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Grade yourself on process KPIs, read outcome KPIs as diagnostics with their sample size, set weekly goals you control, and change rules only through a written process.",
  objectives: [
    "Build a balanced KPI set: process KPIs as the grade, outcome KPIs as diagnostics with their sample size",
    "Set weekly goals you fully control",
    "Change a rule only through a written process, not after a few losses",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M04", label: "Define Your Risk" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "2.13",
    courseId: "2.13.7",
    hook: {
      prompt: "Which goal can you fully control this week?",
      control: {
        kind: "choice",
        choices: [
          { id: "r", label: "Make +3R", feedback: "The market decides much of one week's result. You can do everything right and miss it." },
          { id: "win", label: "Win 60% of trades", feedback: "Over a week's trades, the win rate swings with luck. You can't choose which trades win." },
          { id: "stop", label: "Place every stop before entry", feedback: "Right. It depends only on what you do, and every ticket shows whether you did it." },
        ],
        answer: "stop",
      },
      compare: "You picked “{yours}”. Only 'Place every stop before entry' is fully yours. +3R and a 60% win rate depend on what the market does.",
      concept: "process-goals",
    },
    learn: [
      {
        kind: "explain",
        title: "A balanced set",
        text: "Your dashboard has three kinds of [[kpi|KPIs]]. **Process** KPIs are the grade: plan adherence, risk accuracy, [[stop-integrity|stop integrity]], limits kept, routine done, journal complete, error cost. **Outcome** KPIs are diagnostics: expectancy, win rate, payoff, drawdown, shown with their interval and greyed out below 30 trades. **Behaviour** KPIs flag patterns: risk after a loss, revenge trades, tilt.",
      },
      {
        kind: "match",
        title: "Which kind?",
        prompt: "Sort each KPI into its kind.",
        columns: ["KPI", "Kind"],
        pairs: [
          { left: "Stop integrity", right: "Process", wrong: "A stop at entry, never widened, depends only on you: process." },
          { left: "Error cost in R", right: "Process", wrong: "Error cost counts rule breaks, priced in R. The breaks are yours: process." },
          { left: "Routine done, days of 5", right: "Process", wrong: "Running the routine is fully in your hands: process." },
          { left: "Win rate", right: "Outcome", wrong: "Which trades win is up to the market: outcome." },
          { left: "Maximum drawdown", right: "Outcome", wrong: "Drawdown is a result of many trades: outcome, read with its sample." },
          { left: "Expectancy", right: "Outcome", wrong: "Average R per trade is a result: outcome, with an interval." },
          { left: "Risk taken right after a loss", right: "Behaviour", wrong: "This watches a pattern in how you react: behaviour." },
          { left: "Revenge trades a month", right: "Behaviour", wrong: "Counting revenge trades flags a pattern before it grows: behaviour." },
        ],
        correct: "Process KPIs grade you. Outcome KPIs need a sample before they mean much. Behaviour KPIs flag a pattern before it grows.",
        concept: "process-kpis",
      },
      {
        kind: "worked",
        title: "Risk accuracy, finer",
        lines: [
          "Level 1 counted trades within the limit. Level 2 scores how far each trade missed its planned risk.",
          "Planned risk 100.00. Actual: 92.00, 108.00 and 100.00.",
          "Misses: 8%, 8% and 0%. Average miss: 5.33%.",
          "Risk accuracy = 100% − 5.33% = ?",
        ],
        ask: {
          answer: 94.7,
          tolerance: 0.05,
          unit: "%",
          feedback: [
            { value: 66.7, text: "That's the Level 1 count: two of three within the limit. Level 2 scores the size of each miss." },
            { value: 5.33, text: "That's the average miss. Accuracy is what's left: 100% minus it." },
          ],
          correct: "Right: 94.7%. Under-risking counts as a miss too: 92.00 isn't the plan either.",
        },
        after: "The discipline score works the same way: 3 rule breaks in 60 decisions is 57 ÷ 60 = 95%.",
        concept: "process-kpis",
      },
      {
        kind: "explain",
        title: "Goals you control",
        text: "A [[process-goal|process goal]] names an action you fully control: 'a stop before entry on 100% of trades'. An outcome goal, 'make 5% this month', depends on luck, and near the end of the month it pushes you toward bigger positions to catch up. Set goals on process; read outcomes over hundreds of trades.",
      },
      {
        kind: "order",
        title: "Changing a rule",
        prompt: "A rule changes only through a written process. Put the steps in order. Then write one change you'd like to test.",
        items: [
          "Write the idea down; don't act on it",
          "Turn it into a hypothesis you can test",
          "Set the evidence bar: 30 to 50 trades, or a test",
          "Test it in the simulator",
          "Adopt it as a new plan version",
        ],
        wrong: "Start by writing it down, not by changing anything. The evidence bar is set before the test.",
        explain: "Idea, hypothesis, evidence bar, test, new version. The bar is set before the test, so the result can't move it.",
        note: {
          key: "2.13.7:rule",
          label: "A rule you'd like to change, as a hypothesis (optional)",
          placeholder: "e.g. A stop 0.75 ATR under the pullback low loses less to noise than 0.5 ATR.",
        },
        concept: "rule-change-governance",
      },
      {
        kind: "predict",
        title: "After three losses",
        prompt: "Your pullback card has lost three in a row, every rule followed. You want to widen its stop rule from 0.5 to 1 ATR. What now?",
        control: {
          kind: "choice",
          choices: [
            { id: "now", label: "Change it now: three losses show it's too tight", feedback: "Three trades can't show that: a valid card often loses three in a row. Changing now tests nothing." },
            { id: "log", label: "Log the idea, and test it once the evidence bar is set", feedback: "Right. The idea is kept, and the rule changes only if a test supports it." },
            { id: "today", label: "Widen it for today only", feedback: "A change mid-session, after losses, is exactly what the process forbids. Today's trades would test nothing." },
          ],
          answer: "log",
        },
        reveal: "Write it as a hypothesis, 'a wider stop loses less to noise', set the bar (30 to 50 trades, or a simulator test), then decide. If it passes, it becomes a new plan version, with a fresh count.",
        concept: "rule-change-governance",
      },
      {
        kind: "fields",
        title: "Next week's goals",
        prompt: "Set three process goals for next week, each with a target the app can measure. Outcome targets don't belong here.",
        fields: [
          { id: "stops", label: "Stop placed before entry on __% of trades", kind: "choice", options: [80, 90, 95, 100], unit: "%", default: 90 },
          { id: "accuracy", label: "Risk accuracy at least __%", kind: "stepper", min: 80, max: 100, step: 1, unit: "%", default: 85 },
          { id: "routine", label: "Pre-market routine on __ of 5 sessions", kind: "stepper", min: 0, max: 5, step: 1, default: 3 },
          { id: "own", label: "Your own process goal (optional)", kind: "text", default: "", placeholder: "e.g. Journal every trade within 10 minutes" },
        ],
        valid: { all: [{ field: "stops", eq: 100 }, { field: "accuracy", gte: 95 }, { field: "routine", eq: 5 }] },
        feedback: [
          { when: { field: "stops", ne: 100 }, text: "A goal of {stops}% plans for trades without a stop. The rule is every trade, so the goal is 100%." },
          { when: { field: "accuracy", lt: 95 }, text: "{accuracy}% allows an average miss of over 5%. With the sizing tool, 95% or more is fully in your hands." },
          { when: { field: "routine", lt: 5 }, text: "The routine takes ten minutes and is fully yours. Planning {routine} of 5 is planning to skip it." },
        ],
        correct: "Saved as next week's goals. Each one is a number the app measures, and each depends only on what you do.",
        concept: "process-goals",
      },
    ],
    check: ["q-2.13.7-1", "q-2.13.7-2", "q-2.13.7-3"],
    recap: {
      takeaways: [
        "Process KPIs are the grade; outcome KPIs are diagnostics, read with their interval and sample size.",
        "Set weekly goals you fully control, each with a number the app can measure.",
        "Change a rule only through idea, hypothesis, evidence bar, test and a new plan version.",
      ],
    },
  },
};

// ─── Questions ───────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // ─── 2.13.2 ───
  {
    id: "q-2.13.2-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "A trader's setup card lists the regime, the trigger, the stop rule and the target. Which field is still missing?",
    options: [
      { id: "a", label: "Last week's profit on the setup", rationale: "Results feed the card's statistics, but they aren't a rule. The card still doesn't say when not to trade." },
      { id: "b", label: "A forecast for where price goes next", rationale: "A card doesn't predict. It says what you do if its conditions are met, and when you stand aside." },
      { id: "c", label: "The no-trade conditions" },
      { id: "d", label: "A list of indicators to add later", rationale: "Ideas for later go to the rule-change log. The missing field is when the card says no trade." },
    ],
    correct: "c",
    explanation: "A complete card says when the setup is allowed, what triggers it, where it's wrong, how it's managed and re-entered, and when you don't take it at all. The no-trade conditions, such as a red event within 15 minutes, are missing here.",
    lesson: "2.13.2",
    concepts: ["setup-card"],
  },
  {
    id: "q-2.13.2-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which card line could two traders check on the same chart and always agree on?",
    options: [
      { id: "a", label: "Enter when momentum looks strong", rationale: "'Looks strong' is a judgement two people can argue about. A checkable line names a level, a count or a time." },
      { id: "b", label: "Trigger: a 1H close above the high of the pullback's lowest candle" },
      { id: "c", label: "Skip it if the market feels choppy", rationale: "'Feels choppy' depends on the reader's mood. A regime rule needs a test, such as the swing highs and lows." },
      { id: "d", label: "Stop somewhere safe under support", rationale: "'Somewhere safe' isn't a price. A stop rule names a level, such as the pullback low minus half an ATR." },
    ],
    correct: "b",
    explanation: "A checkable field gives the same answer to anyone who looks. A 1H close above a named candle's high is either there or not; 'strong', 'choppy' and 'safe' leave the decision to the moment.",
    lesson: "2.13.2",
    concepts: ["setup-card", "trading-plan"],
    hints: ["Ask of each line: could two people disagree about whether it happened?", "Look for a level, a count or a time."],
  },
  {
    id: "q-2.13.2-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "Setup A: 24 trades, average +0.60R, 95% interval −0.08R to +1.28R. Setup B: 150 trades, average +0.35R, interval +0.08R to +0.62R. Both spread about 1.7R a trade.",
    prompt: "Which setup's record can you rely on more, and why?",
    options: [
      { id: "a", label: "A: its average is higher", rationale: "On 24 trades A's interval still includes zero. A higher average on a small sample can be luck." },
      { id: "b", label: "B: its whole interval is above zero" },
      { id: "c", label: "Both equally: both averages are positive", rationale: "The averages are, but only B's interval stays above zero. The sample size decides how much an average means." },
      { id: "d", label: "Neither: no setup can be judged before 1,000 trades", rationale: "Too strict. B's 150 trades already put its interval above zero; A needs more trades, not B." },
    ],
    correct: "b",
    explanation: "An average means little without its sample size. A's 24 trades give an interval from −0.08R to +1.28R, which still includes no edge at all. B's 150 trades narrow the interval to +0.08R to +0.62R, entirely above zero.",
    lesson: "2.13.2",
    concepts: ["sample-size", "setup-card"],
    hints: ["Look at the intervals, not the averages.", "Does each interval include zero?"],
  },

  // ─── 2.13.3 ───
  {
    id: "q-2.13.3-1",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which step comes first in the pre-market routine, and why?",
    options: [
      { id: "a", label: "Key levels, because price is what you trade", rationale: "Levels matter, but if you aren't fit to trade, everything after runs at reduced risk. You come first." },
      { id: "b", label: "The watchlist, so you find the trades early", rationale: "The routine doesn't hunt for trades first. It checks you, then the facts, then which cards could trigger." },
      { id: "c", label: "The readiness check, because a failure lowers the risk for everything after it" },
      { id: "d", label: "The day's maximum risk, so the limit is set before you look", rationale: "The day's risk comes last, sized to what the routine finds, including a failed readiness check." },
    ],
    correct: "c",
    explanation: "The routine runs from you to the market to your plan: readiness, overnight, calendar, regime, levels, scenarios, watchlist, and the day's risk last. A failed readiness check cuts the risk for the whole session, so it goes first.",
    lesson: "2.13.3",
    concepts: ["pre-market-routine"],
  },
  {
    id: "q-2.13.3-2",
    topic: "scenario_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "At 14:50 your routine finds: fit to trade, regime range, levels 59.80 and 60.40, and a high-impact release at 15:30. You wrote: 'If a red event is within 15 minutes, then no new orders until the spread is normal.' At 15:05 your range card triggers, with a 0.40 stop.",
    prompt: "What do you do?",
    options: [
      { id: "a", label: "Take it: the card triggered", rationale: "The trade would still be open at 15:30. The routine found the release so this decision wouldn't be made in the moment." },
      { id: "b", label: "Follow your scenario: no new order until the release is out and the spread is normal" },
      { id: "c", label: "Take it with a wider stop to survive the release", rationale: "A wider stop raises the risk, and at a release the stop can still fill past its price." },
      { id: "d", label: "Take it, and close by hand if price moves fast at 15:30", rationale: "A jump at a release is faster than a hand. That's why the routine plans the event before any order." },
    ],
    correct: "b",
    explanation: "The routine's job was to catch the 15:30 release before the first order, and you wrote what to do about it. A trade from 15:05 with a 0.40 stop would sit through the release, so the plan says wait until it's out and the spread is back to normal.",
    lesson: "2.13.3",
    concepts: ["pre-market-routine", "scenario-planning"],
    hints: ["Would the trade still be open at 15:30?", "What did your written scenario say?"],
  },
  {
    id: "q-2.13.3-3",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "US CPI is out at 15:30 today. Which if-then scenario belongs in your routine?",
    options: [
      { id: "a", label: "If CPI is good, then I buy", rationale: "'Good' isn't observable before the details are read, and it bets on a direction. Plan the risk first." },
      { id: "b", label: "Be careful around CPI", rationale: "No trigger and no action. Under pressure, 'careful' gets decided in the moment." },
      { id: "c", label: "If I feel confident, then I trade the release", rationale: "A feeling isn't an observable trigger, and confidence at a release is exactly what the plan should not rely on." },
      { id: "d", label: "If CPI is within 15 minutes, then no new orders until the spread is back to 0.10" },
    ],
    correct: "d",
    explanation: "A routine's scenarios name an observable trigger and one action. A time on the calendar and a spread you can read are both observable, and 'no new orders' leaves nothing to decide when the release arrives.",
    lesson: "2.13.3",
    concepts: ["scenario-planning", "if-then-rules"],
    hints: ["Look for a trigger anyone could see and one action you could check."],
  },

  // ─── 2.13.4 ───
  {
    id: "q-2.13.4-1",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which of these is a complete if-then rule?",
    options: [
      { id: "a", label: "If the market looks heavy, then I sell", rationale: "'Looks heavy' isn't observable: two traders could disagree. The trigger needs a price, time, count or event." },
      { id: "b", label: "If my check-in is 4 of 5 or higher, then I trade at half size" },
      { id: "c", label: "I will stay disciplined when trading gets hard", rationale: "No trigger you can see and no action you can check. It's an intention, not a rule." },
      { id: "d", label: "If price breaks 60.50, then I buy or wait, depending on the candle", rationale: "The trigger is fine, but 'buy or wait' leaves the choice to the moment. A rule has one action." },
    ],
    correct: "b",
    explanation: "A complete if-then rule has one observable trigger, here a check-in number, and one action you can check afterwards, here half size. Vague triggers and open choices leave the decision to the moment the rule was meant to cover.",
    lesson: "2.13.4",
    concepts: ["if-then-rules"],
  },
  {
    id: "q-2.13.4-2",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Your if-then rules cover CPI releases, range breaks and the daily limit. Last month the journal shows four revenge trades, each within ten minutes of a stop-out.",
    prompt: "Which rule is missing?",
    options: [
      { id: "a", label: "A market trigger for another release", rationale: "The revenge trades followed stop-outs, not releases. The missing trigger is about your state." },
      { id: "b", label: "A higher daily limit, so revenge trades fit inside it", rationale: "That makes room for the pattern instead of stopping it." },
      { id: "c", label: "If a trade hits its stop, then I pause 15 minutes before the next order" },
      { id: "d", label: "A rule to trade only when calm", rationale: "'Calm' isn't observable. The stop-out is: use it as the trigger." },
    ],
    correct: "c",
    explanation: "The journal shows a pattern after losses, so the missing rule has a state trigger: the stop-out itself. A pause decided in advance breaks the chain between a loss and the next order.",
    lesson: "2.13.4",
    concepts: ["if-then-rules", "revenge-trading"],
    hints: ["What happened just before each revenge trade?", "Turn that event into the trigger."],
  },
  {
    id: "q-2.13.4-3",
    topic: "psychology",
    kind: "numeric",
    difficulty: 2,
    prompt: "After a week, your if-then log shows 12 rules that fired and 5 that never fired. You followed 9 of the 12. What is your adherence, in %?",
    numeric: { answer: 75, tolerance: 0.1, unit: "%" },
    explanation: "Adherence = rules followed ÷ rules fired = 9 ÷ 12 = 75%. Rules that never fired don't count either way: they cost nothing and tested nothing.",
    lesson: "2.13.4",
    concepts: ["if-then-rules"],
    hints: ["Count only the rules that fired.", "Divide the rules followed by the rules fired, then multiply by 100.", "9 ÷ 12 × 100."],
    vary: {
      fields: { fired: [6, 30, 1], missed: [1, 6, 1], idle: [1, 8, 1] },
      constraints: ["missed < fired"],
      answer: "round((fired - missed) / fired * 100, 1)",
      prompt: "After a week, your if-then log shows {fired} rules that fired and {idle} that never fired. You followed {fired - missed} of the {fired}. What is your adherence, in %?",
      explanation: "Adherence = rules followed ÷ rules fired = {fired - missed} ÷ {fired} = {answer:1}%. Rules that never fired don't count either way: they cost nothing and tested nothing.",
      hint: "{fired - missed} ÷ {fired} × 100.",
    },
  },

  // ─── 2.13.5 ───
  {
    id: "q-2.13.5-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "You closed a trade at +0.4R because one candle went red; the plan held to a 2R target. Which tag does it get?",
    options: [
      { id: "a", label: "E-EXIT-LATE", rationale: "Late is holding past the plan's exit. This trade ended before the plan's target." },
      { id: "b", label: "E-SETUP", rationale: "The setup was valid; nothing says otherwise. The rule broke on the way out." },
      { id: "c", label: "Clean: it made money", rationale: "A profit doesn't make a trade clean. The plan held to 2R, and the exit broke it." },
      { id: "d", label: "E-EXIT-EARLY" },
    ],
    correct: "d",
    explanation: "The plan's exit was the 2R target, and the trade was closed at +0.4R on a single candle. That's E-EXIT-EARLY, whatever the result: tags describe the process, not the profit.",
    lesson: "2.13.5",
    concepts: ["error-taxonomy"],
  },
  {
    id: "q-2.13.5-2",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "A month: 35 trades, net −1.2R. Trades tagged E-CHASE cost −2.6R against the same trades done by the rules. What would the month have been without E-CHASE, in R?",
    numeric: { answer: 1.4, tolerance: 0.01, unit: "R" },
    explanation: "Remove the error's cost: −1.2 − (−2.6) = +1.4R. Error cost compares each trade with the same trade done by the rules, so taking it away shows the month the plan would have produced: a winning one.",
    lesson: "2.13.5",
    concepts: ["error-taxonomy"],
    hints: ["The error made the month worse, so removing it helps.", "Subtract the error cost from the month: a negative minus a negative.", "−1.2 + 2.6."],
    vary: {
      fields: { loss: [0.5, 4, 0.1], cost: [0.5, 6, 0.1] },
      constraints: ["cost >= loss + 0.2"],
      answer: "round(cost - loss, 1)",
      prompt: "A month: 35 trades, net −{loss:1}R. Trades tagged E-CHASE cost −{cost:1}R against the same trades done by the rules. What would the month have been without E-CHASE, in R?",
      explanation: "Remove the error's cost: −{loss:1} − (−{cost:1}) = +{answer:1}R. Error cost compares each trade with the same trade done by the rules, so taking it away shows the month the plan would have produced: a winning one.",
      hint: "−{loss:1} + {cost:1}.",
    },
  },
  {
    id: "q-2.13.5-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Two losses this week, both sized at 1%. Trade 1, −1.4R: price gapped through the stop overnight, with nothing on the calendar. Trade 2, −1.2R: entered 10 minutes before a red release, which your card forbids.",
    prompt: "Which loss is a mistake?",
    options: [
      { id: "a", label: "Trade 1 only: it lost more", rationale: "The size of a loss isn't the test. Trade 1 followed every rule; the gap is the market." },
      { id: "b", label: "Both: both lost more than 1R", rationale: "Losing past 1R can be variance. The question is whether a rule was broken." },
      { id: "c", label: "Trade 2 only" },
      { id: "d", label: "Neither: both were sized at 1%", rationale: "The size was right in both, but Trade 2 broke the card's no-trade window around red events." },
    ],
    correct: "c",
    explanation: "The test is the plan, not the result. Trade 1 had the right size and stop, and nothing was due: the gap is variance. Trade 2 broke a no-trade condition, so it's a mistake, tagged E-EVENT, even though it lost less.",
    lesson: "2.13.5",
    concepts: ["mistake-vs-variance", "error-taxonomy"],
    hints: ["Ignore the size of each loss.", "Which trade broke a rule written on the card?"],
  },

  // ─── 2.13.6 ───
  {
    id: "q-2.13.6-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does a daily review grade?",
    options: [
      { id: "a", label: "The day's profit against a target", rationale: "One day's profit is mostly noise. The review grades what you control: your decisions." },
      { id: "b", label: "The decisions: the best and the worst, and each loss as mistake or variance" },
      { id: "c", label: "How price moved after you closed", rationale: "That's hindsight: you couldn't see it when you decided. It can't grade the decision." },
      { id: "d", label: "Which indicator would have worked best today", rationale: "Fitting an indicator to one day teaches nothing about the next. The review grades decisions." },
    ],
    correct: "b",
    explanation: "A daily review takes five to ten minutes and grades decisions: the day's process KPIs, the best and worst decision, each loss sorted as mistake or variance, and one lesson for tomorrow. Profit over a single day says little.",
    lesson: "2.13.6",
    concepts: ["trading-reviews", "decision-quality"],
  },
  {
    id: "q-2.13.6-2",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your weekly review shows error costs of E-CHASE −1.9R, E-EXIT-EARLY −1.1R and E-SIZE −0.3R. The win rate was 38% and the week ended at −0.8R.",
    prompt: "Which goal should next week's review end with?",
    options: [
      { id: "a", label: "Raise the win rate to 50%", rationale: "An outcome goal: which trades win is up to the market. A process goal names an action you control." },
      { id: "b", label: "Fix all three tags next week", rationale: "Three goals split your attention. The review ends with one goal, from the biggest cost." },
      { id: "c", label: "Make back the −0.8R", rationale: "An outcome goal that invites bigger positions. The review's goal targets the costliest error." },
      { id: "d", label: "Enter only at the card's level, never after a run" },
    ],
    correct: "d",
    explanation: "The weekly review ends with one process goal, taken from the costliest error. Chasing cost the most, −1.9R, and 'enter only at the card's level' is an action you fully control and can check every day.",
    lesson: "2.13.6",
    concepts: ["trading-reviews"],
    hints: ["Which tag cost the most?", "Pick the goal that is one action you control."],
  },
  {
    id: "q-2.13.6-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why replay a trade blind, with the chart stopped at the decision point?",
    options: [
      { id: "a", label: "To practise predicting the next candles", rationale: "Prediction isn't the point. The replay judges the decision on what you could see then." },
      { id: "b", label: "To check whether the outcome was good", rationale: "The outcome is graded separately. Blind replay hides it, so it can't colour the decision." },
      { id: "c", label: "So hindsight can't turn what you know now into what you 'should have seen'" },
      { id: "d", label: "To make losing trades feel better", rationale: "It may do that, but its job is fairness: a valid loss stays valid, and a lucky win gets caught." },
    ],
    correct: "c",
    explanation: "Once the outcome is known, it feels as if it was predictable: hindsight bias. A blind replay shows only what you could see at the decision point, so a valid loss isn't turned into a 'mistake' and a lucky win isn't turned into skill.",
    lesson: "2.13.6",
    concepts: ["hindsight-bias", "trading-reviews"],
    hints: ["What changes once you know how the trade ended?"],
  },

  // ─── 2.13.7 ───
  {
    id: "q-2.13.7-1",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "After 18 trades with a new card, your dashboard shows stop integrity 100% and a win rate of 33%, greyed out.",
    prompt: "How should you read it?",
    options: [
      { id: "a", label: "Stop integrity is the grade; the win rate is greyed out because 18 trades say little" },
      { id: "b", label: "The card is failing: 33% is too low", rationale: "On 18 trades a win rate is mostly noise, which is why it's greyed out below 30 trades." },
      { id: "c", label: "Ignore stop integrity: only results count", rationale: "Process KPIs are the grade because they depend only on you and mean something even on small samples." },
      { id: "d", label: "Move the target closer to lift the win rate", rationale: "That changes a rule because of 18 trades, outside the rule-change process." },
    ],
    correct: "a",
    explanation: "Process KPIs are the grade: a stop on every trade is fully in your hands, and 18 trades already measure it. Outcome KPIs are diagnostics, read with their sample size; below 30 trades the dashboard greys them out.",
    lesson: "2.13.7",
    concepts: ["process-kpis", "sample-size"],
    hints: ["Which of the two numbers depends only on you?", "What does the grey colour say about 18 trades?"],
  },
  {
    id: "q-2.13.7-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which weekly goal is a process goal?",
    options: [
      { id: "a", label: "Make +3R", rationale: "An outcome: the market decides much of one week's result." },
      { id: "b", label: "Finish the week in profit", rationale: "An outcome you can miss while doing everything right." },
      { id: "c", label: "Run the pre-market routine before all 5 sessions" },
      { id: "d", label: "Beat last week's win rate", rationale: "Win rate swings with luck over a week. You can't choose which trades win." },
    ],
    correct: "c",
    explanation: "A process goal names an action you fully control, with a number the app can measure: 5 routines in 5 sessions. Profit and win rate are outcomes; chasing them near the end of a week pushes size up.",
    lesson: "2.13.7",
    concepts: ["process-goals"],
  },
  {
    id: "q-2.13.7-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your breakout card has lost 4 of its last 5 trades, every rule followed. A friend says to add an RSI filter now.",
    prompt: "What does the rule-change process say?",
    options: [
      { id: "a", label: "Add it now: four losses are enough evidence", rationale: "Five trades can't show that. A valid card loses four of five often enough." },
      { id: "b", label: "Drop the breakout card and trade another", rationale: "Switching after a short run resets your evidence to zero. Every card has losing runs." },
      { id: "c", label: "Add it for this week only, and see", rationale: "A week of trades sets no evidence bar, and it mixes two versions of the card in one record." },
      { id: "d", label: "Log the idea as a hypothesis, set an evidence bar, and test it before any new plan version" },
    ],
    correct: "d",
    explanation: "Rules change through a written process: the idea is logged, turned into a hypothesis, given an evidence bar of 30 to 50 trades or a test, tested in the simulator, and only then adopted as a new plan version.",
    lesson: "2.13.7",
    concepts: ["rule-change-governance"],
    hints: ["Were any rules broken in those five trades?", "What has to happen before a new plan version?"],
  },
];

// ─── Terms ───────────────────────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "setup-card",
    term: "Setup card",
    definition: "A playbook entry for one setup: its regime, trigger, order type, stop rule, management, re-entry and no-trade conditions, evidence status and its own statistics.",
    plain: "A playbook entry describing one setup's conditions, stop, management and statistics.",
    related: ["playbook", "trading-plan", "invalidation"],
    lesson: "2.13.2",
  },
  {
    id: "pre-market-routine",
    term: "Pre-market routine",
    definition: "A fixed sequence run before each session: readiness, overnight news, the calendar, the regime, key levels, if-then scenarios, the watchlist and the day's maximum risk.",
    plain: "The fixed checks you run before each session, from the calendar to your risk for the day.",
    related: ["fit-to-trade", "if-then-rule", "trading-plan"],
    lesson: "2.13.3",
  },
  {
    id: "error-cost",
    term: "Error cost",
    definition: "The difference, in R, between a trade's result as traded and the same trade done by the rules. Variance has no error cost.",
    plain: "How many R a mistake cost compared with the same trade done by the rules.",
    related: ["error-tag", "r", "variance"],
    lesson: "2.13.5",
  },
  {
    id: "daily-review",
    term: "Daily review",
    definition: "A five-to-ten-minute review at the end of a session that grades decisions: the day's process KPIs, the best and worst decision, each loss as mistake or variance, and one lesson.",
    plain: "A short end-of-day check of your decisions, not your profit.",
    related: ["weekly-review", "journal", "decision-quality"],
    lesson: "2.13.6",
  },
  {
    id: "weekly-review",
    term: "Weekly review",
    definition: "A weekly look at results by setup, time of day, instrument and error tag, set against the range expectancy predicts, ending with one process goal.",
    plain: "A weekly look at results by setup, time and error, ending with one process goal.",
    related: ["daily-review", "process-goal", "error-tag"],
    lesson: "2.13.6",
  },
  {
    id: "blind-replay",
    term: "Blind replay",
    definition: "Replaying a past trade with every candle after the decision point hidden, so the decision is judged on what could be seen at the time.",
    plain: "Reviewing a trade with the future hidden, as you saw it when deciding.",
    related: ["hindsight-bias", "daily-review", "decision-quality"],
    lesson: "2.13.6",
  },
  {
    id: "process-goal",
    term: "Process goal",
    definition: "A goal set on an action you fully control, with a target that can be measured, such as a stop before entry on 100% of trades.",
    plain: "A goal you fully control, such as placing every stop before entry.",
    related: ["process-kpi", "kpi", "outcome-bias"],
    lesson: "2.13.7",
  },
  {
    id: "kpi",
    term: "KPI",
    definition: "Key performance indicator: a number tracked over time to judge progress, such as stop integrity or expectancy.",
    plain: "A number you track to judge progress, such as stop integrity.",
    related: ["process-kpi", "process-goal", "expectancy"],
    lesson: "2.13.7",
    aka: ["Key performance indicator"],
  },
];

// ─── Concepts ────────────────────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "setup-card",
    name: "Setup card",
    category: "decision_making",
    summary: "A playbook entry defining one setup's regime, trigger, stop, management, no-trade conditions and statistics.",
    body: [
      "A card turns a setup into rules anyone could check: name, market and timeframe; the regime it's allowed in; the trigger and order type; the stop rule, from structure or the ATR; targets and management; re-entry; no-trade conditions; a quality grade; the evidence status; and its own statistics.",
      "Each field is a level, a count, a time or a yes or no, so two people would agree on it. Statistics are kept per card, with the sample size and an interval: at 30 trades most intervals still include zero, so specialise in one or two cards until each has about 100 trades.",
    ],
    example:
      "LABX pullback card: pullback low 56.80, ATR 0.80, so the stop is 56.80 − 0.40 = 56.40. Buy stop 57.20, target the previous swing high 59.60: 2.40 ÷ 0.80 = 3.0R, an A-grade trade. Over 32 trades at +0.35R with a 1.7R spread, the interval runs from −0.24R to +0.94R.",
    related: ["trading-plan", "invalidation-level", "sample-size"],
    missions: ["M10"],
    lessons: ["2.13.2"],
  },
  {
    id: "pre-market-routine",
    name: "Pre-market routine",
    category: "decision_making",
    summary: "A fixed preparation sequence before each session: readiness, calendar, regime, levels, scenarios and risk for the day.",
    body: [
      "The routine runs in the same order every session, in about ten minutes: readiness check, overnight news, the calendar, a regime label, key levels, two or three if-then scenarios, the watchlist, and the day's maximum risk. It doesn't find trades; it finds what's different today, before the first order.",
      "Each step prevents one mistake: the calendar catches releases, the day's risk protects the daily limit, the regime label keeps the wrong card off the chart, levels stop chasing, readiness cuts risk on bad days. The evidence is grade B to C, from planning research and one qualitative study of traders.",
    ],
    example:
      "14:50 in Bucharest in July: US CPI at 15:30, which is 08:30 in New York. A swing entry at 15:00 with a 0.80 stop would sit through the release, so the routine's scenario says no new orders until it's out and the spread is back to 0.10.",
    related: ["scenario-planning", "if-then-rules", "daily-loss-limit"],
    missions: ["M10"],
    lessons: ["2.13.3"],
  },
  {
    id: "trading-reviews",
    name: "Daily and weekly reviews",
    category: "decision_making",
    summary: "Short scheduled reviews that grade decisions, find the costliest error and set one process goal.",
    body: [
      "The daily review takes five to ten minutes: the day's process KPIs, the best and worst decision, each loss sorted as mistake or variance, one lesson, and tomorrow's preparation. It grades decisions, so a skipped trade that kept a rule can be the day's best.",
      "The weekly review slices trades by setup, time of day, instrument and error tag, sets the equity curve against the range expectancy predicts, and ends with one process goal from the costliest error. Trades are replayed blind, stopped at the decision point, so hindsight can't rewrite them.",
    ],
    example:
      "A week of 25 trades with −4.3R of error cost: chasing in the first 30 minutes −2.4R, early exits −0.9R, a widened stop −0.5R, later chasing −0.3R, size −0.2R. Next week's single goal: in the first 30 minutes, enter only at the card's level.",
    related: ["journaling", "decision-quality", "hindsight-bias"],
    missions: ["M10"],
    lessons: ["2.13.6"],
  },
  {
    id: "process-goals",
    name: "Process goals",
    category: "decision_making",
    summary: "Goals you fully control, such as stop integrity, set instead of profit targets.",
    body: [
      "A process goal names an action and a number the app can measure: a stop before entry on 100% of trades, risk accuracy of at least 95%, the routine in 5 of 5 sessions. You can meet it every week, win or lose.",
      "Outcome goals, such as making 5% a month, depend largely on luck over short periods, and near the end of the period they push toward bigger positions to catch up. Outcomes are read as diagnostics, with their sample size, over many trades.",
    ],
    example:
      "Risk accuracy over three trades planned at 100.00 and taken at 92.00, 108.00 and 100.00: misses of 8%, 8% and 0%, an average of 5.33%, so 94.7%. A goal of 95% next week is fully in your hands with the sizing tool.",
    related: ["process-kpis", "outcome-bias", "decision-quality"],
    missions: ["M04"],
    lessons: ["2.13.7"],
  },
  {
    id: "rule-change-governance",
    name: "Rule-change governance",
    category: "decision_making",
    summary: "Changing a rule only through a logged hypothesis, an evidence threshold, a test and a new plan version.",
    body: [
      "A rule changes in five steps: write the idea down without acting on it, turn it into a hypothesis, set an evidence bar such as 30 to 50 trades or a simulator test, run the test, and adopt the change as a new plan version with a fresh count.",
      "The bar is set before the test, so the result can't move it. Losing streaks with every rule followed are variance, not evidence, and changes made mid-session or after a few losses never get tested.",
    ],
    example:
      "A pullback card loses three in a row, every rule followed. The idea 'a stop at 1 ATR loses less to noise than 0.5 ATR' goes in the log, the bar is set at 40 trades in the simulator, and only if the test supports it does the card become a new version.",
    related: ["trading-plan", "sample-size", "mistake-vs-variance"],
    missions: [],
    lessons: ["2.13.7", "3.11.10"],
  },
];

/** Unit 2.13 · Playbook, routine and review (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_2_13: UnitContent = {
  lessons: [L_2_13_2, L_2_13_3, L_2_13_4, L_2_13_5, L_2_13_6, L_2_13_7],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
