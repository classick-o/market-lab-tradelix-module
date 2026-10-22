import type { CandleData, ChartSpec, Concept, GlossaryTerm, Lesson, Question, TaskData, UnitContent } from "../../types";

/**
 * Unit 4.6 · Your trading approach (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce.
 * The unit assembles the learner's written approach in `fields` beats: charter (style, market, window), playbook and edge
 * hypothesis, kill criteria and premortem, risk policy and capital stages, review cadence and the yearly decision.
 * Numbers were checked with a node script:
 * - Reference system (40 trades at +2.5R, 60 at −1R), 10,000 reshuffles: worst drawdown median 8.5R, 95th percentile 13.5R,
 *   99th 16.5R (as in 3.11); about 20% of reshuffles reach 11R. System B (55 at +1.5R, 45 at −1R): median 6R, 95th 9.5R,
 *   99th 11.5R. A 50% × +2R system: 95th 10R, 99th 12R.
 * - 95% intervals: mean ± 1.96 × sd ÷ √n. Kelly f* = W − (1 − W) ÷ b. Trades for t ≈ 2: n = (2 × sd ÷ mean)².
 * - Times from the IANA database for 2026 (Europe/Bucharest, Europe/Berlin, Europe/London, America/New_York). Mismatch weeks:
 *   8–28 March and 25–31 October 2026, when New York is one hour closer to Europe.
 */

const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

/** Card sorting with the bias-spotter widget: a wrong pick explains what that option means, then what this card shows. */
interface SortOption {
  id: string;
  label: string;
  what: string;
}
interface SortCard {
  id: string;
  text: string;
  answer: string;
  correct: string;
  clue: string;
}
const cardSort = (options: SortOption[], cards: SortCard[]): TaskData => ({
  options: options.map(({ id, label }) => ({ id, label })),
  cards: cards.map((c) => ({
    id: c.id,
    text: c.text,
    answer: c.answer,
    correct: c.correct,
    rationales: Object.fromEntries(options.filter((o) => o.id !== c.answer).map((o) => [o.id, `${o.what} ${c.clue}`])),
  })),
});

// ─── 4.6.1 · The constraints matrix ─────────────────────────────────────────

const L_4_6_1: Lesson = {
  id: "4.6.1",
  title: "The constraints matrix",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Map your time, money, jurisdiction, drawdown tolerance, skills and measured temperament to the styles they allow, and rule out the rest with reasons.",
  objectives: [
    "Fill in a constraints matrix covering time, capital, jurisdiction, drawdown tolerance, skills and temperament.",
    "Replace self-reported traits with measured behaviour from your journal.",
    "Name the styles your constraints rule out, with a reason for each.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M06", label: "The FOMO Trap" },
    { kind: "check", ref: "decision_making", label: "Knowledge check: decision making" },
  ],
  script: {
    unit: "4.6",
    courseId: "4.6.1",
    hook: {
      prompt: "You work 09:00–17:00, Central European time, with a 30-minute lunch break. Which style fits best?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Scalping the open", feedback: "European indices open at 09:00, as your workday starts, and the US opens at 15:30 your time. Scalping needs you at the screen at exactly those hours." },
          { id: "b", label: "News trading", feedback: "The big US releases land at 14:30 your time, mid-afternoon at work. News trading needs you at the screen on the minute." },
          { id: "c", label: "Swing or position trading with end-of-day orders" },
          { id: "d", label: "Day trading the US close", feedback: "The US close is 22:00 your time. Possible after work, but every single evening, and late." },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. Fixed office hours point to swing or position trading, with orders set at the end of the day: no decision needs you during work.",
      concept: "constraints-matrix",
    },
    learn: [
      {
        kind: "figure",
        title: "The constraints matrix",
        text: "Each row is a constraint: the styles it points towards, and the ones it rules out. It's a practitioner rule of thumb (grade C), so read each row against your own numbers.",
        figure: {
          kind: "flow",
          start: "job",
          nodes: [
            { id: "job", text: "Full-time job, fixed hours → swing or position, end-of-day orders, systematic rules. Avoid scalping, news trading.", kind: "end" },
            { id: "morning", text: "Free in the mornings → day trading the European or US open, if you know the costs. Avoid Asian-session strategies.", kind: "end" },
            { id: "eu", text: "Living in the EU → European open, London–New York overlap, US open. Avoid daily US-close strategies unless automated.", kind: "end" },
            { id: "small", text: "Small account, under €5k → micro futures, micro FX lots, unleveraged ETFs, swing horizon. Avoid concentrated leverage.", kind: "end" },
            { id: "large", text: "Larger account → diversified position trading, option hedges. Avoid illiquid small caps.", kind: "end" },
            { id: "dd", text: "Low drawdown tolerance → 0.25–0.5% risk, mean reversion with stops. Avoid 35%-win-rate trend following, short volatility.", kind: "end" },
            { id: "code", text: "You like data and code → systematic strategies, backtesting. Avoid purely discretionary pattern reading.", kind: "end" },
            { id: "impulse", text: "Impulsive under stress, as measured → automated orders, fixed rules, longer horizons. Avoid discretionary intraday.", kind: "end" },
          ],
          steps: [
            "Time first: your free hours usually rule out the most styles.",
            "Then money and where you live: they set the instruments and the leverage.",
            "Then drawdown tolerance and skills: how much pain you can sit through, and how you work.",
            "Temperament last, and only as your journal measures it.",
          ],
        },
        concept: "constraints-matrix",
      },
      {
        kind: "explain",
        title: "Measured, not declared",
        text: "A [[behaviour-audit]] reads your simulator journal: how often you [[overtrading|overtrade]], how many trades open within minutes of a loss ([[revenge-trading]]), how many stops you move, your median holding time. The measure beats the description. If you call yourself patient but close winners within 20 minutes, you have a temperament constraint, whatever you believe.",
      },
      {
        kind: "predict",
        title: "Read the journal",
        prompt: "Your journal, 40 trades in 4 weeks: 9 opened within 10 minutes of a loss, 6 stops moved further away, planned swings closed after a median 18 minutes. You see yourself as patient. Which row goes in your matrix?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Patient: discretionary intraday suits me", feedback: "That's the declared trait. The journal says otherwise: planned swings held for 18 minutes." },
            { id: "b", label: "Impulsive under stress: automated orders, fixed rules, longer horizons" },
            { id: "c", label: "Nothing yet: 40 trades say nothing", feedback: "40 trades are a small sample for an edge, but a habit repeated 9 times in 4 weeks is a pattern worth recording." },
          ],
          answer: "b",
        },
        reveal: "9 of 40 trades, 22.5%, opened within 10 minutes of a loss; 6 stops moved; swings closed in 18 minutes. That's impulsive under stress. Write it in, and choose styles where orders run without you.",
        concept: "behaviour-audit",
      },
      {
        kind: "match",
        title: "What each profile rules out",
        prompt: "Match each trader to the style their constraints rule out.",
        columns: ["Profile", "Rules out"],
        pairs: [
          { left: "A nurse on rotating 12-hour shifts", right: "Day trading at fixed session hours", wrong: "Rotating shifts mean no session is free every day. Strategies that need the same hours daily are out." },
          { left: "An account of 1,500 wanting index futures", right: "Full-size contracts: one stop risks far more than 1%", wrong: "Contract size against the account: a full-size contract is too big. Micro contracts exist for this." },
          { left: "Loses sleep after a 5% drawdown", right: "Trend following with a 35% win rate", wrong: "Low win rates bring long losing runs and deep drawdowns, exactly what low tolerance can't sit through." },
          { left: "Journal: 6 moved stops in 40 trades", right: "Discretionary intraday trading", wrong: "Moved stops are a measured impulse under pressure. Fast, discretionary decisions give it the most room." },
        ],
        correct: "Each exclusion has a reason you could check: a rota, an account size, a drawdown you've lived through, a journal count.",
        concept: "constraints-matrix",
      },
      {
        kind: "fields",
        title: "Your matrix: circumstances",
        prompt: "Fill in the rows that come from your life. Be specific: hours in your own time zone, an amount, a country. A vague row can't rule anything out.",
        fields: [
          { id: "time", label: "Hours you can trade, in your time zone", kind: "text", default: "", placeholder: "e.g. 18:00–21:00 Bucharest on weekdays; nothing during work", required: true },
          { id: "capital", label: "Risk capital and account size", kind: "text", default: "", placeholder: "e.g. 3,000 of risk capital, all in one account, no leverage", required: true },
          { id: "place", label: "Where you live, and what that allows", kind: "text", default: "", placeholder: "e.g. Romania: EU retail rules, ESMA leverage caps", required: true },
          { id: "dd", label: "Drawdown you could sit through without changing the rules", kind: "stepper", min: 5, max: 30, step: 1, unit: "%", default: 10 },
        ],
        correct: "Saved: the circumstances half of your matrix. Next, the half only your journal can fill in honestly.",
        concept: "constraints-matrix",
      },
      {
        kind: "fields",
        title: "Your matrix: measured",
        prompt: "Now the rows about you. Take the numbers from your simulator journal, not from how you see yourself. No journal yet? Write 'unmeasured', and log 30 simulator trades before you fill it in.",
        fields: [
          { id: "skills", label: "Skills: data and code, or charts and judgment?", kind: "text", default: "", placeholder: "e.g. Comfortable with spreadsheets; no coding yet", required: true },
          { id: "measured", label: "From your journal: revenge trades, moved stops, holding time", kind: "text", default: "", placeholder: "e.g. 3 revenge trades in 50; 1 stop moved; median hold 2 days", required: true },
          { id: "temper", label: "The temperament row this points to", kind: "text", default: "", placeholder: "e.g. Calm with end-of-day orders; impulsive when I watch intraday", required: true },
        ],
        correct: "Saved. Your measured habits are part of the matrix now, so the style you choose has to fit them.",
        concept: "behaviour-audit",
      },
      {
        kind: "fields",
        title: "Your charter: style",
        prompt: "Choose your style. Justify it with at least two constraints and one measured behaviour. Then name each style your matrix rules out, with the reason.",
        fields: [
          { id: "style", label: "My style, and why", kind: "text", default: "", placeholder: "e.g. Swing with end-of-day orders: office hours; 10% drawdown limit; I overtrade intraday (journal)", required: true },
          { id: "out", label: "Styles I rule out, with a reason each", kind: "text", default: "", placeholder: "e.g. Scalping: no screen at the open. News trading: releases land during work.", required: true },
        ],
        correct: "Saved as section 1 of your trading approach. Every later choice in this unit has to fit inside it.",
        concept: "trading-styles",
      },
    ],
    check: ["q-4.6.1-1", "q-4.6.1-2", "q-4.6.1-3"],
    recap: {
      takeaways: [
        "A constraints matrix maps time, money, location, drawdown tolerance, skills and temperament to the styles they allow.",
        "Temperament comes from your journal: revenge trades, moved stops, holding time. Measured beats declared.",
        "Name each style your constraints rule out, with a reason. Your free hours usually rule out the most.",
      ],
    },
  },
};

// ─── 4.6.2 · Choosing your market and your style ────────────────────────────

/** 4.6.2: busy windows as bars on a clock, in Bucharest time (the vertical axis is the hour). */
const WINDOWS_CHART: ChartSpec = {
  candles: [k(10, 11, 10, 11), k(15, 19, 15, 19), k(16.5, 17.5, 16.5, 17.5), k(22, 23, 22, 23)],
  range: [8, 24],
  height: 240,
  describe:
    "Four vertical bars show busy windows in Bucharest time, with the hour of the day on the vertical axis. From the left: the European index open 10:00 to 11:00, the London–New York overlap 15:00 to 19:00, the first hour of the US session 16:30 to 17:30, and the last hour before the US close, 22:00 to 23:00.",
};

const SCANNER_CARDS = cardSort(
  [
    { id: "pick", label: "Pick", what: "A pick needs ratio 8+, busy hours in your window, access and low correlation." },
    { id: "cost", label: "Too costly", what: "Too costly means a tradability ratio under 8." },
    { id: "hours", label: "Busy outside your window", what: "This is for markets busy outside 15:00–19:00." },
    { id: "access", label: "Not available to you", what: "This is for markets your rules or broker don't allow." },
    { id: "same", label: "Same bet as a pick", what: "This is for a market highly correlated with a pick." },
  ],
  [
    {
      id: "labc",
      text: "LABC, a major FX pair. ATR 0.0080, round trip 0.0002. Busiest 15:00–19:00 your time. EU retail: yes. Correlation with LABI 0.2.",
      answer: "pick",
      correct: "Pick: ratio 40, and busiest exactly in your window.",
      clue: "LABC's ratio is 0.0080 ÷ 0.0002 = 40, and it's busiest in your window.",
    },
    {
      id: "labi",
      text: "LABI, a micro index future. ATR 60.00, round trip 2.50. Busiest at the US open, 16:30 your time. EU retail: yes.",
      answer: "pick",
      correct: "Pick: ratio 24, and the US open falls inside your window.",
      clue: "LABI's ratio is 60.00 ÷ 2.50 = 24, and the US open is 16:30 your time.",
    },
    {
      id: "labs",
      text: "LABS, a small-cap stock. ATR 1.50, round trip 0.30. Busiest 16:30–18:00 your time. EU retail: yes.",
      answer: "cost",
      correct: "Too costly: 1.50 ÷ 0.30 = 5. It moves only five times its cost a day.",
      clue: "LABS fits your hours, but 1.50 ÷ 0.30 = 5.",
    },
    {
      id: "laba",
      text: "LABA, an Asian index future. ATR 40.00, round trip 2.00. Busiest 02:00–08:00 your time. EU retail: yes.",
      answer: "hours",
      correct: "Busy outside your window: a good ratio, 20, at the wrong hours.",
      clue: "LABA's ratio is 20, but its busy hours are 02:00–08:00.",
    },
    {
      id: "labu",
      text: "LABU, a US-listed fund. ATR 3.00, round trip 0.20. Busiest 16:30–23:00 your time. EU retail: not offered by your broker.",
      answer: "access",
      correct: "Not available to you: ratio 15 and the right hours, but your broker doesn't offer it to EU retail clients.",
      clue: "LABU has ratio 15 and fits your hours, but your broker won't offer it.",
    },
    {
      id: "labj",
      text: "LABJ, a second US index future. ATR 45.00, round trip 2.50. Busiest at the US open. EU retail: yes. Correlation with LABI 0.9.",
      answer: "same",
      correct: "Same bet as LABI, at a lower ratio: 18 against 24. Two markets at 0.9 are one market.",
      clue: "LABJ's ratio is 18, but its correlation with LABI is 0.9.",
    },
  ],
);

const L_4_6_2: Lesson = {
  id: "4.6.2",
  title: "Choosing your market and your style",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Pick one or two markets that move a lot relative to their cost, are busiest in your hours, and fit your account and where you live.",
  objectives: [
    "Compute a tradability ratio (ATR ÷ round-trip cost) and the share of a target eaten by costs.",
    "Match session windows to your time zone, including daylight-saving mismatch weeks.",
    "Pick one or two instruments that fit your constraints, jurisdiction and account size.",
  ],
  blocks: [],
  practice: [
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
    { kind: "check", ref: "market_fundamentals", label: "Knowledge check: market fundamentals" },
  ],
  script: {
    unit: "4.6",
    courseId: "4.6.2",
    hook: {
      prompt: "Which market is cheapest to trade relative to how much it moves? A: daily ATR 2.40, round-trip cost 0.20. B: ATR 1.50, cost 0.30. C: ATR 30.00, cost 1.50.",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "A", feedback: "A has the smallest cost in price, 0.20, and moves 12 times that a day. C moves 20 times its cost." },
          { id: "b", label: "B", feedback: "B moves only 5 times its cost a day: the most expensive of the three." },
          { id: "c", label: "C" },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. Divide the daily move by the cost: A 12, B 5, C 20. C costs the most in price and the least per unit of movement.",
      concept: "tradability-ratio",
    },
    learn: [
      {
        kind: "worked",
        title: "The tradability ratio",
        lines: [
          "[[tradability-ratio|Tradability ratio]] = [[atr|ATR]] ÷ round-trip cost (spread plus commission, both ways).",
          "A: 2.40 ÷ 0.20 = 12. C: 30.00 ÷ 1.50 = 20.",
          "B: 1.50 ÷ 0.30 = ?",
        ],
        ask: {
          answer: 5,
          tolerance: 0,
          feedback: [{ value: 0.2, text: "That's cost ÷ ATR, upside down. Put the movement on top: 1.50 ÷ 0.30." }],
          correct: "Right: 5. B moves five times its cost a day; C moves twenty times.",
        },
        after: "You met the ratio in 2.14. Here it ranks your candidates: the higher it is, the more movement you get for each unit of cost.",
        concept: "tradability-ratio",
      },
      {
        kind: "worked",
        title: "What costs take from each style",
        lines: [
          "LABX near 100.00: spread 0.10 + commission 0.05 each side = 0.20 a round trip. ATR 2.40.",
          "Swing target, 2 × ATR = 4.80: costs take 0.20 ÷ 4.80 = 4%.",
          "Scalp target, 0.5 × ATR = 1.20: costs take 0.20 ÷ 1.20 = ? %",
        ],
        ask: {
          answer: 16.7,
          tolerance: 0.5,
          unit: "%",
          feedback: [
            { value: 4, text: "That's the swing target's share. The scalp aims for 1.20, so the same 0.20 takes a bigger bite." },
            { value: 6, text: "That's 1.20 ÷ 0.20, the ratio the other way round. Share = cost ÷ target × 100." },
          ],
          correct: "Right: about 17%, four times the swing trade's share. Shorter styles need a far bigger raw edge to pay the same costs.",
        },
        after: "This is the [[cost-drag]] wall from 2.9: the same cost against a smaller target takes a bigger bite.",
        concept: "cost-drag",
      },
      {
        kind: "figure",
        title: "Your windows, in Bucharest",
        text: "Busy windows on a weekday, in Bucharest time; Frankfurt is one hour behind all year. Volume clusters around opens, closes and the overlap (2.9). Check your own time zone the same way.",
        figure: {
          kind: "chart",
          chart: WINDOWS_CHART,
          steps: [
            { text: "From the left: the European index open, 09:00 Frankfurt, 10:00 Bucharest." },
            { text: "The London–New York overlap, 15:00–19:00 Bucharest: typically the busiest FX window of the day." },
            { text: "The US open at 16:30 and the close at 23:00. The close needs you there late, daily." },
            {
              text: "Mismatch weeks, such as 25–31 October 2026: US times arrive an hour earlier, the open at 15:30.",
              layers: [{ kind: "level", price: 15.5, role: "concept", label: "US open, mismatch weeks", chip: false }],
            },
          ],
        },
        concept: "fx-sessions",
      },
      {
        kind: "match",
        title: "What to check before you choose",
        prompt: "Match each criterion for choosing a market to the test that answers it.",
        columns: ["Criterion", "The test"],
        pairs: [
          { left: "Liquidity in your hours", right: "Tight spreads while you're actually at the screen", wrong: "Liquidity matters when you trade. A market busy at night is thin in your evening." },
          { left: "Cost per unit of volatility", right: "ATR ÷ round-trip cost, the tradability ratio", wrong: "Cost alone misleads. Divide the typical move by the cost of a round trip." },
          { left: "Available where you live", right: "Legal for you: no CFDs for US residents; ESMA leverage caps in the EU", wrong: "Jurisdiction decides which products you may trade at all, and on what terms." },
          { left: "Contract size against the account", right: "1% risk is possible at a sensible stop; micro contracts exist for this", wrong: "If one contract at a sensible stop risks more than 1%, the market is too big for the account." },
          { left: "Correlation with what you trade", right: "Under 0.5 with your other market, or it's the same bet", wrong: "Two markets moving together are one position twice. Check the correlation." },
        ],
        correct: "Two more criteria are personal: data you can get, and an edge you bring, such as knowing a sector or a region well.",
        concept: "constraints-matrix",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Start with one or two highly liquid instruments and learn their personality: their hours, their usual range, how they react to news. Add another only once you know the first ones well. It's practitioner advice (grade C); the arithmetic of the ratio is exact.",
      },
      {
        kind: "fields",
        title: "Your charter: market and window",
        prompt: "Write the market part of your approach, from your matrix: your hours, your account, where you live. Name the ratio of each instrument and the [[session-fit]] in your own time zone.",
        fields: [
          { id: "markets", label: "One or two instruments", kind: "text", default: "", placeholder: "e.g. A major FX pair and a micro index future", required: true },
          { id: "ratio", label: "Their tradability ratios", kind: "text", default: "", placeholder: "e.g. 40 and 24, both 8 or more", required: true },
          { id: "window", label: "Your trading window, in your time zone", kind: "text", default: "", placeholder: "e.g. 16:30–18:30 Bucharest: the US open, inside the overlap", required: true },
          { id: "dst", label: "What moves in mismatch weeks (optional)", kind: "text", default: "", placeholder: "e.g. 8–28 March and 25–31 October 2026: US open at 15:30" },
        ],
        correct: "Saved as section 2 of your approach: the market, its costs and your window.",
        concept: "fx-sessions",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: SCANNER_CARDS,
      goal: "You live in Bucharest, trade 15:00–19:00 on weekdays, under EU retail rules. Six instruments: pick two, and give the reason for rejecting each of the other four. A pick needs a ratio of 8 or more.",
      success: { field: "solved", eq: 6 },
      correct: "Two picks: LABC, ratio 40, and LABI, ratio 24, both busy in your window, correlation 0.2. Each reject failed one test.",
      hints: ["Filter by your time window first.", "Two highly correlated markets are one market."],
      showMe: { solved: 6 },
      concept: "tradability-ratio",
    },
    check: ["q-4.6.2-1", "q-4.6.2-2", "q-4.6.2-3"],
    recap: {
      takeaways: [
        "Tradability ratio = ATR ÷ round-trip cost. A short target makes the same cost a much bigger share.",
        "Match busy windows to your clock: the overlap is 15:00–19:00 Bucharest; mismatch weeks move US times earlier.",
        "Pick one or two liquid, available, weakly correlated instruments that fit your account, and learn them well.",
      ],
    },
  },
};

// ─── 4.6.3 · Specialise before you diversify ────────────────────────────────

const PRUNE_CARDS = cardSort(
  [
    { id: "keep", label: "Keep", what: "Keep is for the top two lower bounds among setups with 30+ trades." },
    { id: "drop", label: "Drop for now", what: "Drop is for setups with 30+ trades outside the top two." },
    { id: "thin", label: "Not enough evidence", what: "This label is for setups with fewer than 30 trades." },
  ],
  [
    {
      id: "pullback",
      text: "Trend pullback: 120 trades, +0.30R, interval +0.05R to +0.55R.",
      answer: "keep",
      correct: "Keep: the highest lower bound, +0.05R, on a solid sample.",
      clue: "This one has 120 trades and the highest lower bound of all, +0.05R.",
    },
    {
      id: "retest",
      text: "Breakout retest: 150 trades, +0.20R, interval +0.04R to +0.36R.",
      answer: "keep",
      correct: "Keep: a modest average, but the interval stays above zero over 150 trades.",
      clue: "This one has 150 trades and the second-highest lower bound, +0.04R.",
    },
    {
      id: "orb",
      text: "Opening range breakout: 60 trades, +0.45R, interval −0.01R to +0.91R.",
      answer: "drop",
      correct: "Drop for now: the best average, but zero is still inside the interval.",
      clue: "Its average is the highest, but its lower bound, −0.01R, is below zero.",
    },
    {
      id: "fade",
      text: "Range fade: 85 trades, +0.22R, interval −0.01R to +0.45R.",
      answer: "drop",
      correct: "Drop for now: 85 trades, and the interval still includes zero.",
      clue: "It has 85 trades, but its lower bound is −0.01R.",
    },
    {
      id: "rsi",
      text: "RSI reversal: 95 trades, −0.05R, interval −0.25R to +0.15R.",
      answer: "drop",
      correct: "Drop: a negative average over 95 trades.",
      clue: "Its average over 95 trades is negative.",
    },
    {
      id: "news",
      text: "News fade: 18 trades, +0.90R, interval −0.02R to +1.82R.",
      answer: "thin",
      correct: "Not enough evidence: 18 trades can't carry a decision, however good the average.",
      clue: "It has only 18 trades.",
    },
    {
      id: "gap",
      text: "Gap fill: 24 trades, +0.60R, interval −0.04R to +1.24R.",
      answer: "thin",
      correct: "Not enough evidence: 24 trades, and an interval 1.28R wide.",
      clue: "It has only 24 trades.",
    },
  ],
);

const L_4_6_3: Lesson = {
  id: "4.6.3",
  title: "Specialise before you diversify",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Trade one style, one or two setups and one or two markets until the sample can show whether the edge is real, and write down when you won't trade.",
  objectives: [
    "Compute how many trades you need before an edge of a given size is distinguishable from zero.",
    "Prune a playbook to one or two setups using sample size and confidence intervals.",
    "Write a no-trade list and the condition for adding a second strategy.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "check", ref: "decision_making", label: "Knowledge check: decision making" },
  ],
  script: {
    unit: "4.6",
    courseId: "4.6.3",
    hook: {
      prompt: "Trader A runs 6 setups on 5 markets. Trader B runs 1 setup on 2 markets. Both take 150 trades a year. Who learns faster whether their edge is real?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Trader A", feedback: "A's 150 trades split over 30 setup-and-market cells: about 5 trades each. No cell ever gets a sample." },
          { id: "b", label: "Trader B" },
          { id: "c", label: "Same speed: both take 150 trades", feedback: "The totals match, but an edge belongs to one setup on one market. B gets 75 trades per cell; A gets 5." },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. A spreads 150 trades over 30 combinations, 5 each. B has 2 combinations, 75 trades each, so B finds out first.",
      concept: "specialisation",
    },
    learn: [
      {
        kind: "worked",
        title: "How many trades?",
        lines: [
          "Trades needed for a [[t-statistic]] of about 2, from 3.10: n = (2 × sd ÷ mean)².",
          "Mean +0.2R, sd 1.5R: n = (2 × 1.5 ÷ 0.2)² = 15² = 225 trades.",
          "At 3 trades a week, weeks needed = ?",
        ],
        ask: {
          answer: 75,
          tolerance: 0,
          unit: "weeks",
          feedback: [{ value: 675, text: "That multiplies by 3. You take 3 trades a week, so divide: 225 ÷ 3." }],
          correct: "Right: 75 weeks, about a year and a half, on one setup. Spread over five setups at the same pace, about seven years.",
        },
        after: "That's [[statistical-power]] at work: with too few trades, even a real edge can't be told from noise. Every extra setup or market splits the trades you have.",
        concept: "specialisation",
      },
      {
        kind: "explain",
        title: "Specialise first",
        text: "[[specialisation|Specialise]]: one style, one or two setups, one or two markets, until the sample means something. That's at least 100 trades, or at least 30 for slow strategies with a backtest behind them. Your [[playbook]] defines each setup exactly, with screenshots, rules and statistics, and it ends with a [[no-trade-list|no-trade list]].",
      },
      {
        kind: "predict",
        title: "Which is better proven?",
        prompt: "Setup X: +0.45R over 60 trades, 95% interval −0.01R to +0.91R. Setup Y: +0.30R over 120 trades, interval +0.05R to +0.55R. Which has the better evidence of an edge?",
        control: {
          kind: "choice",
          choices: [
            { id: "x", label: "X: the higher average", feedback: "X's average is higher, but its interval still includes zero: X could have no edge at all." },
            { id: "y", label: "Y: the interval stays above zero" },
            { id: "same", label: "Both equally: both averages are positive", feedback: "Positive averages are where the evidence starts, not where it ends. Only Y's interval excludes zero." },
          ],
          answer: "y",
        },
        reveal: "Y. Rank setups by the lower end of their interval, not by the average. And leave setups under 30 trades out of the ranking: their intervals are too wide to rank.",
        concept: "expectancy-confidence-interval",
      },
      {
        kind: "match",
        title: "Why each line is on the list",
        prompt: "Match each line of a no-trade list to its reason.",
        columns: ["No-trade rule", "Reason"],
        pairs: [
          { left: "No trades in the 15 minutes before a tier-1 release", right: "Spreads widen and stops slip around big news", wrong: "News windows are about execution: wide spreads and jumps, as in 2.10." },
          { left: "No new positions after the daily limit", right: "A limit only protects you if it ends the session", wrong: "The daily limit exists for the moment you most want to keep going." },
          { left: "No setups outside the playbook", right: "Off-plan trades add evidence to no setup", wrong: "A trade without a setup tag can't count towards any sample." },
          { left: "No trades in the first 5 minutes of the open", right: "Spreads are wide and the range is still forming", wrong: "The first minutes are about price discovery: wide spreads and erratic fills." },
        ],
        correct: "Each line names a condition you can check, and a reason. A trade that breaks the list is an error, even if it wins.",
        concept: "when-not-to-trade",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Add a second strategy only when each one has positive expectancy on a meaningful sample, and the two are weakly correlated. Otherwise the second one just splits your sample, or doubles the same bet. These sample thresholds are practitioner conventions (grade C); the arithmetic behind them is exact.",
      },
      {
        kind: "fields",
        title: "Your playbook and edge hypothesis",
        prompt: "Write the one or two setups you'll specialise in. For each, the [[edge-hypothesis|edge hypothesis]] from 3.11: why it should pay, and who is on the other side.",
        fields: [
          { id: "setup1", label: "Setup 1: name, market, timeframe", kind: "text", default: "", placeholder: "e.g. Trend pullback, a major FX pair, 4H", required: true },
          { id: "hyp1", label: "Its edge hypothesis: mechanism, and who loses to you", kind: "text", default: "", placeholder: "e.g. Short-term profit-taking causes the pullback; the trend resumes, and late sellers are on the other side", required: true },
          { id: "setup2", label: "Setup 2 and its hypothesis (optional)", kind: "text", default: "", placeholder: "e.g. None yet: one setup until 100 trades" },
          { id: "sample", label: "Sample so far, and the target before judging", kind: "text", default: "", placeholder: "e.g. 42 simulator trades; judge at 100", required: true },
        ],
        correct: "Saved as section 3 of your approach. Link each setup to its validation dossier, if you built one in 4.3.",
        concept: "edge-hypothesis",
      },
      {
        kind: "fields",
        title: "Your no-trade list",
        prompt: "Write at least three no-trade rules, each a condition you can check, and the condition for adding a second strategy.",
        fields: [
          { id: "nt1", label: "No-trade rule 1", kind: "text", default: "", placeholder: "e.g. No new orders 15 minutes before a red event", required: true },
          { id: "nt2", label: "No-trade rule 2", kind: "text", default: "", placeholder: "e.g. No new positions after −3R in a day", required: true },
          { id: "nt3", label: "No-trade rule 3", kind: "text", default: "", placeholder: "e.g. Nothing outside the playbook, however good it looks", required: true },
          { id: "second", label: "I add a second strategy when…", kind: "text", default: "", placeholder: "e.g. Setup 1 has 100+ trades with an interval above zero, and the new one is weakly correlated", required: true },
        ],
        correct: "Saved with your playbook. Your no-trade list sits on every order now: a trade that breaks it is an error, even a winning one.",
        concept: "specialisation",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: PRUNE_CARDS,
      goal: "Prune this seven-setup playbook to two, using the statistics. Keep the two highest lower bounds among setups with 30 or more trades. Drop the other tested ones; mark the rest 'not enough evidence'.",
      success: { field: "solved", eq: 7 },
      correct: "Two left: trend pullback and breakout retest. The dropped ones can come back through the pipeline in 4.6.4, with fresh evidence.",
      hints: ["Rank by the lower end of the interval, not the average.", "Small samples cannot carry a decision."],
      showMe: { solved: 7 },
      concept: "specialisation",
    },
    check: ["q-4.6.3-1", "q-4.6.3-2", "q-4.6.3-3"],
    recap: {
      takeaways: [
        "Trades needed for t ≈ 2: n = (2 × sd ÷ mean)². Small edges need hundreds of trades.",
        "Rank setups by the lower end of their interval; under 30 trades, there's no evidence yet.",
        "Write a no-trade list. Add a second strategy only when both are positive and weakly correlated.",
      ],
    },
  },
};

// ─── 4.6.4 · The development pipeline and kill criteria ─────────────────────

const PIPELINE_CARDS = cardSort(
  [
    { id: "promote", label: "Promote", what: "Promote needs 50+ trades at the stage, 90%+ adherence and the drawdown inside the band." },
    { id: "hold", label: "Hold", what: "Hold means no written criterion has been met, either way." },
    { id: "review", label: "Demote and review", what: "Review fires past the 95th percentile, or on an interval including zero after 50+ trades." },
    { id: "kill", label: "Kill", what: "Kill fires past the 99th percentile, on an interval below zero, or when the regime is gone." },
  ],
  [
    {
      id: "trend",
      text: "Trend pullback, at 25% size. 62 trades at this stage, adherence 94%, drawdown 4R (95th percentile 13.5R). Expectancy +0.28R, interval +0.02R to +0.54R.",
      answer: "promote",
      correct: "Promote: 62 trades, 94% adherence, a drawdown well inside the band. Every stage criterion is met.",
      clue: "Here every promotion criterion is met: 62 trades, 94%, and 4R against 13.5R.",
    },
    {
      id: "range",
      text: "Range fade, at minimum live size. 58 trades, expectancy +0.11R, interval −0.17R to +0.39R. Drawdown 6R (95th 10R, 99th 12R).",
      answer: "review",
      correct: "Demote and review: after 58 trades the interval still includes zero. The drawdown is fine; the evidence isn't.",
      clue: "Here the interval includes zero after 58 trades, though the drawdown is normal.",
    },
    {
      id: "breakout",
      text: "Breakout, at 50% size. Drawdown 18R. Its Monte Carlo: 95th percentile 13.5R, 99th 16.5R.",
      answer: "kill",
      correct: "Kill: 18R is past the 99th percentile, 16.5R. Variance no longer explains it.",
      clue: "Here the drawdown, 18R, is past the 99th percentile, 16.5R.",
    },
    {
      id: "gap",
      text: "Gap fill, forward test in the simulator. 22 trades, average +0.35R, drawdown 3R, adherence 96%.",
      answer: "hold",
      correct: "Hold: 22 trades is too few to promote, and nothing has fired. Keep testing.",
      clue: "Here there are only 22 trades, and no threshold has fired.",
    },
  ],
);

const L_4_6_4: Lesson = {
  id: "4.6.4",
  title: "The development pipeline and kill criteria",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Every strategy moves through eight stages, from hypothesis to decay monitoring, with review and kill thresholds written from its Monte Carlo before it trades.",
  objectives: [
    "Order the eight stages of a strategy's development pipeline and the gate at each stage.",
    "Write review and kill thresholds from a Monte Carlo drawdown distribution and an expectancy interval, before going live.",
    "Run a premortem on a strategy you are about to deploy.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
    { kind: "check", ref: "risk_management", label: "Knowledge check: risk management" },
  ],
  script: {
    unit: "4.6",
    courseId: "4.6.4",
    hook: {
      prompt: "Your system is 11R below its peak. Its Monte Carlo puts the 95th-percentile drawdown at 13.5R and the 99th at 16.5R. What do you do?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Stop now", feedback: "About 1 in 5 reshuffled histories of the same trades goes 11R deep or deeper. Stopping here judges the system on noise." },
          { id: "b", label: "Keep trading as planned" },
          { id: "c", label: "Double the size to recover", feedback: "Raising size in a drawdown is martingale thinking. If the system is broken, it doubles the damage." },
          { id: "d", label: "Change the rules", feedback: "Rules changed in a drawdown get fitted to the last few trades. Changes go through the process, with a test." },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. 11R is short of the 95th percentile, 13.5R: normal bad luck. The thresholds were written in advance, so the decision was already made.",
      concept: "kill-criteria",
    },
    learn: [
      {
        kind: "order",
        title: "The pipeline",
        prompt: "Put the eight stages of the development pipeline in order, from idea to monitoring.",
        items: [
          "Hypothesis: the economic reason, and who is on the other side",
          "Rules, written so anyone gets the same trades",
          "Backtest with real costs, out-of-sample, walk-forward and an R0 control",
          "Robustness: neighbouring parameters, other markets and periods, Monte Carlo",
          "Forward test in the simulator for a set number of trades",
          "Live at minimum size",
          "Gradual scaling",
          "Decay monitoring",
        ],
        wrong: "Start from the idea and its reason; end by watching it fade. Real money enters only after the backtest, robustness and simulator gates.",
        explain: "Each stage has a gate. Backtests test the idea; the simulator tests your execution; minimum live size tests real fills and your nerves; scaling waits for evidence.",
        concept: "development-pipeline",
      },
      {
        kind: "worked",
        title: "Review and kill, in numbers",
        lines: [
          "Reference system, 10,000 reshuffles: median worst drawdown 8.5R, 95th percentile 13.5R, 99th 16.5R.",
          "Review (one capital stage down, full review): drawdown past 13.5R, or the live expectancy interval includes zero after 50+ trades.",
          "Kill (stop live trading): drawdown past 16.5R, or the interval entirely below zero, or its regime no longer appears.",
          "System B, 55% winners at +1.5R: median 6R, 95th 9.5R, 99th 11.5R. Its review threshold = ? R",
        ],
        ask: {
          answer: 9.5,
          tolerance: 0,
          unit: "R",
          feedback: [
            { value: 11.5, text: "11.5R is the 99th percentile: that's the kill line. Review comes first, at the 95th." },
            { value: 6, text: "6R is the median: half of all normal histories go deeper. A review there would fire constantly." },
          ],
          correct: "Right: review past 9.5R, kill past 11.5R. Both written now, before the first live trade.",
        },
        after: "Two tiers, set before going live: a [[review-trigger]] that steps down and investigates, and [[kill-criteria]] that stop.",
        concept: "kill-criteria",
      },
      {
        kind: "explain",
        title: "What's new since 3.11",
        text: "In 3.11 you set one [[kill-switch]] at the 99th percentile and ran a [[premortem]]. Here the [[development-pipeline]] adds two tiers, review and kill, each tied to the capital stages of 4.6.5. And you may run several strategies at once, each at its own stage, each with its own thresholds.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Thresholds are numbers, not adjectives. 'If it feels broken' is not a kill criterion; 'a drawdown past 16.5R' is. The percentiles come from the system's own Monte Carlo; the choice of the 95th and 99th is a practitioner convention (grade C).",
      },
      {
        kind: "fields",
        title: "Your kill criteria",
        prompt: "Write the thresholds for your main setup, from its Monte Carlo: review at the 95th percentile, kill at the 99th. No Monte Carlo yet? Use the reference system's 13.5R and 16.5R until you run one.",
        fields: [
          { id: "review", label: "Review: one stage down, full review, past a drawdown of", kind: "stepper", min: 5, max: 30, step: 0.5, unit: "R", default: 10 },
          { id: "kill", label: "Kill: stop live trading past a drawdown of", kind: "stepper", min: 5, max: 30, step: 0.5, unit: "R", default: 12 },
          { id: "ci", label: "Review if the expectancy interval includes zero after __ trades", kind: "choice", options: [20, 30, 50, 100], default: 20 },
          { id: "regime", label: "Kill if this regime stops appearing", kind: "text", default: "", placeholder: "e.g. No trending month, ADX over 25, in six months", required: true },
        ],
        valid: { field: "ci", gte: 50 },
        feedback: [{ when: { field: "ci", lt: 50 }, text: "After {ci} trades, an interval that includes zero is normal even for a real edge. Review from 50 trades on." }],
        correct: "Saved as section 6 of your approach. Check that the kill line sits beyond the review line, and leave both alone during a drawdown.",
        concept: "kill-criteria",
      },
      {
        kind: "fields",
        title: "Your premortem",
        prompt: "Your main setup goes live next month. Six months later, it has failed. Write three different reasons, each with the check that would catch it early.",
        fields: [
          { id: "r1", label: "Reason 1 and its check", kind: "text", default: "", placeholder: "e.g. Live fills were worse than the backtest → weekly slippage report", required: true },
          { id: "r2", label: "Reason 2 and its check", kind: "text", default: "", placeholder: "e.g. The regime it needs disappeared → regime tag on every trade", required: true },
          { id: "r3", label: "Reason 3 and its check", kind: "text", default: "", placeholder: "e.g. I traded outside the playbook after losses → no-trade list before every order", required: true },
        ],
        correct: "Saved with your kill criteria. Each reason now has a check that runs before it can cost you.",
        concept: "premortem",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: PIPELINE_CARDS,
      goal: "Four strategies, each at its own stage. Promote, hold, demote or kill each one by its written criteria: review past the 95th percentile, or an interval including zero after 50+ trades; kill past the 99th.",
      success: { field: "solved", eq: 4 },
      correct: "Four decisions, each read off the written criteria: one promotion, one hold, one review and one kill. None needed a mood.",
      hints: ["Compare the drawdown with the written percentiles, not with your mood.", "An interval that includes zero after 50 trades means review, not kill."],
      showMe: { solved: 4 },
      concept: "kill-criteria",
    },
    check: ["q-4.6.4-1", "q-4.6.4-2", "q-4.6.4-3"],
    recap: {
      takeaways: [
        "Eight stages, hypothesis to decay monitoring. Real money enters only after backtest, robustness and simulator gates.",
        "Review past the 95th percentile, or a zero-including interval after 50 trades. Kill past the 99th.",
        "Write the thresholds as numbers before going live, and run a premortem on every strategy you deploy.",
      ],
    },
  },
};

// ─── 4.6.5 · Scaling up without blowing up ──────────────────────────────────

const STAGE_CARDS = cardSort(
  [
    { id: "up", label: "Step up", what: "Step up needs 50+ trades, 90%+ adherence, the drawdown in the band and a new high." },
    { id: "hold", label: "Hold", what: "Hold means not every step-up criterion is met, and no trigger has fired." },
    { id: "down", label: "Step down", what: "Step down follows a review trigger, such as a drawdown past the 95th percentile." },
  ],
  [
    {
      id: "m1",
      text: "Trade 60, minimum live size. 60 trades at this stage, adherence 95%, drawdown 5R (95th percentile 13.5R), and a new equity high today.",
      answer: "up",
      correct: "Step up: sample, adherence, drawdown and a new high, all met. On to 25% of target size.",
      clue: "Here every criterion is met: 60 trades, 95%, 5R and a new high.",
    },
    {
      id: "m2",
      text: "Trade 95, 25% size. A run of five losses just ended. 35 trades at this stage, +9R so far.",
      answer: "hold",
      correct: "Hold: 35 trades isn't the sample, and there's no step up straight after a losing run.",
      clue: "Here there are only 35 trades at the stage, and no trigger has fired.",
    },
    {
      id: "m3",
      text: "Trade 150, 25% size. 90 trades at this stage, +14R, but adherence 78%.",
      answer: "hold",
      correct: "Hold: profit without adherence isn't evidence for your rules. Fix the process first.",
      clue: "Here adherence is 78%, under the 90% needed, and no trigger has fired.",
    },
    {
      id: "m4",
      text: "Trade 210, 50% size. The drawdown reaches 14R; the 95th percentile is 13.5R.",
      answer: "down",
      correct: "Step down: a review trigger fired. Back to 25% of target size, and a full review.",
      clue: "Here the drawdown, 14R, is past the 95th percentile, 13.5R.",
    },
    {
      id: "m5",
      text: "Trade 290, back at 25% size. 55 trades since the step down, adherence 93%, the drawdown recovered, and a new equity high.",
      answer: "up",
      correct: "Step up again: the stage's criteria are met afresh, so 50% size is earned back.",
      clue: "Here every criterion is met again: 55 trades, 93% and a new high.",
    },
  ],
);

const L_4_6_5: Lesson = {
  id: "4.6.5",
  title: "Scaling up without blowing up",
  topic: "position_sizing",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Raise size in stages unlocked by sample, adherence and drawdown, cut it automatically in drawdowns, and treat full Kelly as a ceiling far above your risk.",
  objectives: [
    "Define capital stages with promotion and demotion rules based on sample size, adherence and drawdown, not on profit alone.",
    "Apply drawdown-based de-risking and step-ups after new equity highs.",
    "Explain why full Kelly is a ceiling, not a target, and why size growth runs into market impact.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M05", label: "Size Matters" },
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
  ],
  script: {
    unit: "4.6",
    courseId: "4.6.5",
    hook: {
      prompt: "After a 10% drawdown, the Turtles traded as if their account were 20% smaller. Your 10,000.00 account is now at 9,000.00. Under that rule, what is a 1% risk, in vUSD?",
      control: {
        kind: "numeric",
        unit: "vUSD",
        answer: 80,
        tolerance: 0.01,
        feedback: [
          { value: 90, text: "That's 1% of current equity. The rule sizes from a notional account cut by 20%: 8,000.00." },
          { value: 100, text: "That's 1% of the starting account. After a 10% drawdown, size comes from 8,000.00." },
          { value: 72, text: "That cuts current equity by 20%. The rule cuts the notional account, 10,000.00, to 8,000.00." },
        ],
      },
      compare: "You answered {yours}. The notional account drops from 10,000.00 to 8,000.00, so 1% is 80.00. Risk falls faster than equity.",
      concept: "capital-staging",
    },
    learn: [
      {
        kind: "figure",
        title: "Five capital stages",
        text: "From the simulator to full size in five [[capital-stages]]. Profit alone never unlocks the next one.",
        figure: {
          kind: "flow",
          start: "sim",
          nodes: [
            { id: "sim", text: "1. Simulator: forward test, no money at stake", kind: "end" },
            { id: "min", text: "2. Live at minimum size: real fills, real nerves", kind: "end" },
            { id: "q", text: "3. 25% of target size", kind: "end" },
            { id: "h", text: "4. 50% of target size", kind: "end" },
            { id: "full", text: "5. Target size, such as 1% risk per trade", kind: "end" },
          ],
          steps: [
            "Each step up needs a sample: at least 50 trades at the current stage.",
            "And process: adherence of 90% or more, with the drawdown inside the Monte Carlo band.",
            "A review trigger moves you down one stage, automatically. A kill trigger stops live trading.",
          ],
        },
        concept: "capital-staging",
      },
      {
        kind: "worked",
        title: "Kelly as a ceiling",
        lines: [
          "[[kelly-criterion|Kelly]], from 3.12: f* = W − (1 − W) ÷ b.",
          "Reference system: 40% winners at +2.5R, losers at −1R.",
          "f* = 0.40 − 0.60 ÷ 2.5 = ? %",
        ],
        ask: {
          answer: 16,
          tolerance: 0.1,
          unit: "%",
          feedback: [
            { value: 24, text: "0.24 is 0.60 ÷ 2.5 on its own. Kelly subtracts it from the win rate: 0.40 − 0.24." },
            { value: 40, text: "0.40 × 2.5 − 0.60 = +0.40R is the edge per trade. Kelly divides it by the payoff: 0.40 ÷ 2.5." },
          ],
          correct: "Right: 16%. [[fractional-kelly|Quarter Kelly]] is 4%, still four times a 1% rule.",
        },
        after: "1% is about a sixteenth of Kelly. That margin absorbs an edge you've overestimated, which is the usual case.",
        concept: "kelly-criterion",
      },
      {
        kind: "explain",
        title: "The usual limits",
        text: "For most retail traders: 0.25–1% [[risk-per-trade|risk per trade]]. Total [[portfolio-heat|heat]] about 5–6%, correlated positions counted together. Size cut in drawdowns: the Turtles cut their [[notional-account|notional account]] by 20% for every 10% down. And a [[size-step-up]] of about 25%, only after a new equity high. All practitioner conventions (grade C).",
      },
      {
        kind: "match",
        title: "Four ways to blow up",
        prompt: "Match each scaling mistake to the reason it breaks the account.",
        columns: ["Mistake", "Why it breaks"],
        pairs: [
          { left: "Raising size after a loss to win it back", right: "Martingale: the bet grows through a losing run", wrong: "Size that rises with losses peaks exactly when the system may be broken." },
          { left: "Adding leverage to fix poor results", right: "A weak edge at a bigger size only loses faster", wrong: "Leverage multiplies the edge you have. If it's weak or negative, so is the result." },
          { left: "Scaling into a thin, illiquid market", right: "Your own orders move the price: impact eats the edge", wrong: "Impact grows with your order size against the market's volume. Big size in a thin market pays it." },
          { left: "Promoting after one great month of 12 trades", right: "No sample: 12 trades can't tell skill from luck", wrong: "A month of 12 trades is far below the 50 a stage needs." },
        ],
        correct: "All four grow size without evidence. Stages grow it only after the evidence arrives.",
        concept: "capital-staging",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Few retail traders make a living from trading. In Brazil, 97% of those who day traded futures for more than 300 days lost money; in Taiwan, fewer than 1% of day traders reliably earned returns after fees. Treat trading income as uncertain, keep your emergency savings separate, and never trade borrowed money.",
      },
      {
        kind: "fields",
        title: "Your risk policy",
        prompt: "Write the risk section of your approach. Each line is a number the journal can check on every ticket.",
        fields: [
          { id: "risk", label: "Risk per trade at target size", kind: "choice", options: [0.25, 0.5, 1, 2], unit: "%", default: 1 },
          { id: "heat", label: "Heat cap, correlated positions counted together", kind: "stepper", min: 2, max: 10, step: 1, unit: "%", default: 6 },
          { id: "daily", label: "Daily loss limit", kind: "stepper", min: 1, max: 5, step: 0.5, unit: "R", default: 3 },
          { id: "weekly", label: "Weekly loss limit", kind: "stepper", min: 2, max: 12, step: 1, unit: "R", default: 6 },
          { id: "steps", label: "Drawdown steps", kind: "text", default: "", placeholder: "e.g. Every 10% down: size from a notional account 20% smaller", required: true },
        ],
        valid: { all: [{ field: "risk", lte: 1 }, { field: "heat", lte: 6 }] },
        feedback: [
          { when: { field: "risk", gt: 1 }, text: "{risk}% a trade is above the 0.25–1% most retail traders use. Target size is a ceiling: keep it at 1% or less." },
          { when: { field: "heat", gt: 6 }, text: "A {heat}% heat cap lets one bad afternoon cost more than 6%. Keep it at about 5–6%." },
        ],
        correct: "Saved as section 5 of your approach: a risk policy the engine can check on every ticket.",
        concept: "portfolio-heat",
      },
      {
        kind: "fields",
        title: "Your capital stages",
        prompt: "Write the rules that move you between stages. Promotion needs evidence, not a good week. Demotion should be automatic.",
        fields: [
          { id: "n", label: "Trades at a stage before a step up", kind: "stepper", min: 10, max: 100, step: 10, default: 20 },
          { id: "adh", label: "Adherence needed", kind: "choice", options: [70, 80, 90, 95], unit: "%", default: 80 },
          { id: "step", label: "Size step after a new equity high", kind: "choice", options: [10, 25, 50, 100], unit: "%", default: 50 },
          { id: "down", label: "Automatic step down when…", kind: "text", default: "", placeholder: "e.g. A review trigger fires: a drawdown past the 95th percentile", required: true },
        ],
        valid: { all: [{ field: "n", gte: 50 }, { field: "adh", gte: 90 }, { field: "step", lte: 25 }] },
        feedback: [
          { when: { field: "n", lt: 50 }, text: "{n} trades can't separate skill from luck at one stage. Ask for at least 50." },
          { when: { field: "adh", lt: 90 }, text: "At {adh}% adherence, the results aren't really your rules' results. Ask for 90% or more." },
          { when: { field: "step", gt: 25 }, text: "A {step}% jump lets one bad run at the new size undo the stage. Step up about 25% at a time." },
        ],
        correct: "Saved as section 7 of your approach. The engine can now step you up and down without asking how you feel.",
        concept: "capital-staging",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: STAGE_CARDS,
      goal: "Five moments from a 300-trade history. A step up needs 50+ trades at the stage, adherence 90%+, the drawdown inside the band and a new equity high. A review trigger steps you down.",
      success: { field: "solved", eq: 5 },
      correct: "Two step-ups, two holds, one step down. Every move came from sample, adherence and drawdown; none from a good week.",
      hints: ["Promotion needs evidence, not a good week.", "Demotion should be automatic."],
      showMe: { solved: 5 },
      concept: "capital-staging",
    },
    check: ["q-4.6.5-1", "q-4.6.5-2", "q-4.6.5-3"],
    recap: {
      takeaways: [
        "Size grows in stages unlocked by sample, adherence and drawdown, never by profit alone.",
        "Cut size in drawdowns from a smaller notional account; step up about 25% only after new highs.",
        "Full Kelly is a ceiling: 1% is about a sixteenth of it. Big size also meets market impact.",
      ],
    },
  },
};

// ─── 4.6.6 · Keep improving: reviews, decay and the yearly decision ─────────

const REVIEW_CARDS = cardSort(
  [
    { id: "variance", label: "Variance", what: "Variance means the change fits inside the interval and the Monte Carlo band." },
    { id: "decay", label: "Decay", what: "Decay means a persistent fall across windows and regimes, often after the edge became known." },
    { id: "regime", label: "Regime change", what: "A regime change means losses concentrated in one regime that has become more common." },
  ],
  [
    {
      id: "v1",
      text: "Expectancy fell from 0.30R to 0.12R over 80 trades. The interval, −0.21R to +0.45R, still includes 0.30R. Drawdown inside the band; adherence 95%.",
      answer: "variance",
      correct: "Variance: the old 0.30R is still inside the interval. Keep executing and keep counting.",
      clue: "Here the interval still contains 0.30R and the drawdown is inside the band.",
    },
    {
      id: "d1",
      text: "Average R in four 100-trade windows: +0.35, +0.24, +0.15, +0.06. The setup went viral on social media last year.",
      answer: "decay",
      correct: "Decay: lower window after window, after the edge went public. Cut size and revalidate.",
      clue: "Here the average falls in every window, after the setup became widely known.",
    },
    {
      id: "r1",
      text: "In trending months the setup still makes +0.40R a trade; in range months, −0.25R. Range months went from 2 in 12 to 7 in 12.",
      answer: "regime",
      correct: "Regime change: the edge holds in its own regime, which got rarer. Test a regime filter out of sample.",
      clue: "Here the losses come only in range months, which have become far more common.",
    },
    {
      id: "v2",
      text: "A losing month, −6R. Over 200 trades, expectancy +0.31R, interval +0.10R to +0.52R. The drawdown is under the 95th percentile.",
      answer: "variance",
      correct: "Variance: one month isn't a sample, and the 200-trade interval is still above zero. Keep executing.",
      clue: "Here the 200-trade interval is above zero and the drawdown is inside the band.",
    },
    {
      id: "d2",
      text: "The edge shrank in each of the last three years, in every market and regime you trade. Random-entry twins now do as well.",
      answer: "decay",
      correct: "Decay: falling everywhere, not in one regime, and no better than random entries. Reduce, revalidate, perhaps retire.",
      clue: "Here the fall is everywhere, in every regime, down to random-entry level.",
    },
  ],
);

const L_4_6_6: Lesson = {
  id: "4.6.6",
  title: "Keep improving: reviews, decay and the yearly decision",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Tell decay from variance and regime change with intervals and Monte Carlo bands, change rules only through a logged process, and end each year with a decision.",
  objectives: [
    "Tell decay from variance and regime change using a confidence interval and the Monte Carlo band.",
    "Change a rule only through a documented, evidence-based process.",
    "Run a yearly review that compares your net, risk-adjusted results with the passive benchmark and ends with a continue, reduce, retire or invest-passively decision.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "check", ref: "decision_making", label: "Knowledge check: decision making" },
  ],
  script: {
    unit: "4.6",
    courseId: "4.6.6",
    hook: {
      prompt: "Your system's expectancy fell from 0.30R to 0.12R over the last 80 trades. Is the edge decaying?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Yes, clearly", feedback: "A fall from 0.30R to 0.12R looks big, but over 80 trades an average swings that far by chance." },
          { id: "b", label: "No, edges can't decay", feedback: "They can: published anomalies earned 58% less after publication. The question is whether these 80 trades show it." },
          { id: "c", label: "Can't tell yet: the interval still includes 0.30R" },
          { id: "d", label: "Only if it feels wrong", feedback: "A feeling isn't a test. The interval and the Monte Carlo band are." },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. The last 80 trades give an interval of −0.21R to +0.45R. It still contains 0.30R, so variance can explain the drop.",
      concept: "decay-vs-variance",
    },
    learn: [
      {
        kind: "worked",
        title: "Variance or decay?",
        lines: [
          "Last 80 trades: mean +0.12R, sd 1.5R. [[standard-error|Standard error]] = 1.5 ÷ √80 = 0.17R.",
          "Half-width of the 95% [[confidence-interval|interval]] = 1.96 × 0.17 = 0.33R. Lower end: 0.12 − 0.33 = −0.21R.",
          "Upper end = 0.12 + 0.33 = ? R",
        ],
        ask: {
          answer: 0.45,
          tolerance: 0.01,
          unit: "R",
          feedback: [{ value: 0.29, text: "That adds one standard error, 0.17. A 95% interval adds 1.96 of them: 0.33." }],
          correct: "Right: −0.21R to +0.45R. The old 0.30R is inside, so variance can explain the drop. Check the Monte Carlo band too.",
        },
        after: "Inside the interval and the band: keep executing. Outside both, or lower window after window: investigate.",
        concept: "decay-vs-variance",
      },
      {
        kind: "match",
        title: "Four diagnoses",
        prompt: "Match the signs to the diagnosis and the action.",
        columns: ["Signs", "Diagnosis and action"],
        pairs: [
          { left: "Inside the interval and the band; adherence good", right: "Variance: keep executing", wrong: "Nothing here is outside what chance produces. Changing anything would fit noise." },
          { left: "Lower in window after window; the edge is public; fills more crowded", right: "Decay: cut size and revalidate", wrong: "A persistent fall after an edge becomes known is the pattern of edge decay." },
          { left: "Losses only in one regime, which has become common", right: "Regime change: test a regime filter out of sample", wrong: "The edge still works in its own regime. A filter, tested properly, may restore it." },
          { left: "Drawdown past the 99th percentile", right: "Breakage: stop, back to research", wrong: "Past the 99th percentile, variance no longer explains the loss. That's the kill line." },
        ],
        correct: "Interval and band first, then split by regime. Only then decide which of the four you're looking at.",
        concept: "decay-vs-variance",
      },
      {
        kind: "explain",
        title: "The review rhythm",
        text: "Daily and weekly reviews, from 2.13, check process. Monthly or quarterly: the R distribution, [[mae|MAE]] and [[mfe|MFE]], expectancy per setup with its interval, and drawdown against the band. Yearly, the [[annual-review]]: net, risk-adjusted results against the passive [[benchmark]], rules and costs rechecked with their dates, and a decision for next year.",
      },
      {
        kind: "order",
        title: "The yearly decision",
        prompt: "Put the steps of the annual review in order.",
        items: [
          "Net result, after every cost",
          "Risk-adjusted: Sharpe and drawdown, next to the passive benchmark's",
          "Recheck the rules, regulation and costs, with their dates",
          "Decide: continue, reduce, retire or invest passively",
        ],
        wrong: "Start with the net result, because gross results flatter. Decide last, once everything is on the table.",
        explain: "Net first, because gross results flatter. Then risk-adjusted, against what buy-and-hold earned with no effort. Then check the ground rules haven't moved. Only then decide.",
        concept: "continuous-improvement",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Practise your measured weakness, not what you enjoy: if the journal shows late exits, drill exits in the simulator. And assume your edge will shrink too. Published anomalies earned 58% less after publication (McLean and Pontiff, 2016, grade A). Log every rule change in your [[rule-change-log]], with its reason and its evidence.",
      },
      {
        kind: "fields",
        title: "Your review cadence",
        prompt: "Write when each review happens and what it checks. Put the dates in your calendar like any appointment. Then set how long a rule must run before you may change it.",
        fields: [
          { id: "weekly", label: "Weekly: day, time and what you check", kind: "text", default: "", placeholder: "e.g. Sunday 18:00: process KPIs, rule breaks, journal gaps", required: true },
          { id: "quarterly", label: "Monthly or quarterly: what you check", kind: "text", default: "", placeholder: "e.g. Expectancy per setup with its interval; drawdown against the band", required: true },
          { id: "yearly", label: "Date of the yearly review", kind: "text", default: "", placeholder: "e.g. The first weekend of January", required: true },
          { id: "minTrades", label: "No rule change before __ trades on the current version", kind: "stepper", min: 10, max: 100, step: 10, default: 10 },
        ],
        valid: { field: "minTrades", gte: 30 },
        feedback: [{ when: { field: "minTrades", lt: 30 }, text: "{minTrades} trades can't tell a better rule from luck. Wait for 30–50, or test the change with a backtest and walk-forward." }],
        correct: "Saved as section 8 of your approach. Every change goes into the rule-change log, with its reason and its evidence.",
        concept: "continuous-improvement",
      },
      {
        kind: "fields",
        title: "Your yearly decision rule",
        prompt: "Write now what next year's results would make you continue, reduce, retire the strategy or invest passively instead. Decided in advance, the rule can't bend to the year you had.",
        fields: [
          { id: "cont", label: "Continue if…", kind: "text", default: "", placeholder: "e.g. Net Sharpe above the benchmark's, and process KPIs on target", required: true },
          { id: "reduce", label: "Reduce size if…", kind: "text", default: "", placeholder: "e.g. Net result positive but below the benchmark, interval including zero", required: true },
          { id: "stop", label: "Retire it, or invest passively, if…", kind: "text", default: "", placeholder: "e.g. Two years below the benchmark after costs, or a kill trigger", required: true },
        ],
        correct: "Saved as the last section of your approach. Next comes the capstone: one unknown market, with this whole document put to work.",
        concept: "continuous-improvement",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: REVIEW_CARDS,
      goal: "Five changes in your statistics. Classify each as variance, decay or a regime change; the confirmation tells you the action.",
      success: { field: "solved", eq: 5 },
      correct: "Two variance, two decay, one regime change. Each verdict came from the interval, the band or a regime split, not from the last month.",
      hints: ["Check the interval before you call it decay.", "Split results by regime before changing rules."],
      showMe: { solved: 5 },
      concept: "decay-vs-variance",
    },
    check: ["q-4.6.6-1", "q-4.6.6-2", "q-4.6.6-3"],
    recap: {
      takeaways: [
        "Before calling it decay, check the interval and the Monte Carlo band, then split results by regime.",
        "Change a rule only by hypothesis, evidence threshold, simulator test and a logged new version.",
        "Each year: net, risk-adjusted results against the benchmark, then continue, reduce, retire or invest passively.",
      ],
    },
  },
};

// ─── Check questions ─────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 4.6.1
  {
    id: "q-4.6.1-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "You work fixed hours, 09:00–17:00, and can't look at a screen during them. Which style do your hours rule out?",
    options: [
      { id: "a", label: "Swing trading with orders set in the evening", rationale: "Swing orders can be set after work and run on their own. Fixed hours point towards this style, not away from it." },
      { id: "b", label: "Scalping during the session" },
      { id: "c", label: "Position trading with weekly reviews", rationale: "Position trades need a few decisions a week, all of them possible outside work." },
      { id: "d", label: "A systematic strategy with automated end-of-day orders", rationale: "Automated end-of-day orders need no screen time during work. That's what fixed hours point to." },
    ],
    correct: "b",
    explanation: "Scalping needs your full attention while the market is busy, which is exactly when you're at work. Fixed hours point towards swing or position trading and systematic rules with end-of-day orders.",
    lesson: "4.6.1",
    concepts: ["constraints-matrix", "trading-styles"],
  },
  {
    id: "q-4.6.1-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "What is the difference between a declared and a measured constraint?",
    options: [
      { id: "a", label: "A declared one is in the plan; a measured one is only in your head", rationale: "That's backwards. Declared means self-described; measured means counted from your journal." },
      { id: "b", label: "None: if you know yourself, the two agree", rationale: "Self-reports are biased by overconfidence (2.12). People who call themselves patient often close winners in minutes; only the journal shows it." },
      { id: "c", label: "A declared one is how you describe yourself; a measured one comes from your journal, such as how often you revenge trade" },
      { id: "d", label: "Measured constraints are about money; declared ones are about time", rationale: "Either kind can cover anything. The difference is the source: your description or your recorded behaviour." },
    ],
    correct: "c",
    explanation: "The behaviour audit replaces self-description with counts from the journal: trades opened right after a loss, stops moved, overtrading, holding time. Where the two disagree, the measured one goes in the matrix.",
    lesson: "4.6.1",
    concepts: ["behaviour-audit"],
    hints: ["Ask where each one comes from.", "Think of someone who calls themselves patient but closes winners within 20 minutes."],
  },
  {
    id: "q-4.6.1-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "A 5% loss makes you want to rewrite your rules, and you've abandoned a plan twice after drawdowns of about that size.",
    prompt: "What does your constraints matrix point you towards?",
    options: [
      { id: "a", label: "0.25–0.5% risk per trade, mean reversion with stops, a diversified book" },
      { id: "b", label: "Selling options for steady premium", rationale: "Short volatility pays small and often, then rarely loses very large amounts. Low tolerance rules it out." },
      { id: "c", label: "Trend following with a 35% win rate", rationale: "A 35% win rate brings long losing runs and deep drawdowns, exactly what low tolerance can't sit through." },
      { id: "d", label: "1–2% risk per trade, to recover losses faster", rationale: "Bigger risk makes drawdowns deeper. Low tolerance calls for smaller risk, not larger." },
    ],
    correct: "a",
    explanation: "Low drawdown tolerance is a measured constraint here: two abandoned plans. Small risk per trade keeps drawdowns shallow, and higher-win-rate approaches with stops avoid long losing runs. Styles with long losing streaks or rare huge losses are ruled out.",
    lesson: "4.6.1",
    concepts: ["constraints-matrix", "drawdown"],
    hints: ["Which styles bring long losing runs or rare, very large losses?", "Lower risk per trade makes every drawdown shallower."],
  },
  // 4.6.2
  {
    id: "q-4.6.2-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 1,
    prompt: "A currency pair has a daily ATR of 0.0080 and a round-trip cost of 0.0002. What is its tradability ratio?",
    numeric: { answer: 40, tolerance: 0.1, unit: "×" },
    explanation: "Tradability ratio = ATR ÷ round-trip cost = 0.0080 ÷ 0.0002 = 40. The pair moves 40 times its cost in a typical day, a comfortable margin for most styles.",
    lesson: "4.6.2",
    concepts: ["tradability-ratio"],
    hints: ["Ratio = ATR ÷ round-trip cost.", "Both are in price units, so they cancel: 0.0080 ÷ 0.0002."],
    vary: {
      fields: { atr: [40, 120, 5], cost: [1, 4, 1] },
      answer: "round(atr / cost, 1)",
      prompt: "A currency pair has a daily ATR of {atr / 10000:4} and a round-trip cost of {cost / 10000:4}. What is its tradability ratio?",
      explanation: "Tradability ratio = ATR ÷ round-trip cost = {atr / 10000:4} ÷ {cost / 10000:4} = {answer:1}. Higher means more movement for each unit of cost.",
      hint: "Both are in price units, so they cancel: {atr / 10000:4} ÷ {cost / 10000:4}.",
    },
  },
  {
    id: "q-4.6.2-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why does scalping need a much higher tradability ratio than swing trading?",
    options: [
      { id: "a", label: "Scalpers pay a higher commission rate", rationale: "The rate per fill is the same. What changes is the target: the same cost against a far smaller move." },
      { id: "b", label: "Its targets are a small part of the ATR, so the same round-trip cost takes a much bigger share of each one" },
      { id: "c", label: "Short-term moves are more predictable, so brokers charge more", rationale: "Costs don't depend on predictability. A 0.5 × ATR target simply leaves less room for the same cost." },
      { id: "d", label: "Swing trades have no costs", rationale: "Swing trades pay the same spread and commission, plus any overnight financing. The point is the share of the target." },
    ],
    correct: "b",
    explanation: "On LABX, 0.20 a round trip is 4% of a 2 × ATR swing target (4.80) but about 17% of a 0.5 × ATR scalp target (1.20). Short styles need a much bigger raw edge, or a market that moves far more per unit of cost.",
    lesson: "4.6.2",
    concepts: ["cost-drag", "tradability-ratio"],
    hints: ["Compare the cost with the size of the target, not with the price.", "0.20 against 4.80, then against 1.20."],
  },
  {
    id: "q-4.6.2-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "You live in Romania and are free between 15:00 and 19:00, Bucharest time, on weekdays.",
    prompt: "Which window fits you best?",
    options: [
      { id: "a", label: "The Asian session", rationale: "Tokyo's busy hours fall in the night and early morning in Bucharest, far outside 15:00–19:00." },
      { id: "b", label: "The US close", rationale: "The US close is 23:00 in Bucharest, four hours after your window ends." },
      { id: "c", label: "The European index open", rationale: "European indices open at 10:00 Bucharest time, while you're busy." },
      { id: "d", label: "The London–New York overlap" },
    ],
    correct: "d",
    explanation: "The London–New York overlap runs about 15:00–19:00 Bucharest time, typically the busiest FX window, and the US open, 16:30, falls inside it. In the weeks when US and EU clocks disagree, it starts an hour earlier.",
    lesson: "4.6.2",
    concepts: ["fx-sessions"],
    hints: ["Convert each window to Bucharest time first.", "London and New York overlap from 08:00 to 12:00 New York time."],
  },
  // 4.6.3
  {
    id: "q-4.6.3-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "Your setup averages +0.25R with a standard deviation of 1.5R. How many trades do you need for a t-statistic of about 2?",
    numeric: { answer: 144, tolerance: 1, unit: "trades" },
    explanation: "n = (2 × sd ÷ mean)² = (2 × 1.5 ÷ 0.25)² = 12² = 144 trades. Halve the edge and you need four times as many.",
    lesson: "4.6.3",
    concepts: ["specialisation", "statistical-significance"],
    hints: ["n = (2 × sd ÷ mean)².", "2 × 1.5 ÷ 0.25 = 12. Now square it."],
    vary: {
      fields: { m: [0.15, 0.5, 0.05], s: [1, 2, 0.1] },
      answer: "ceil(round((2 * s / m) * (2 * s / m), 4))",
      prompt: "Your setup averages +{m:2}R with a standard deviation of {s:1}R. How many trades do you need for a t-statistic of about 2?",
      explanation: "n = (2 × sd ÷ mean)² = (2 × {s:1} ÷ {m:2})² = {2 * s / m:2}² ≈ {answer} trades. Halve the edge and you need four times as many.",
      hint: "2 × {s:1} ÷ {m:2} = {2 * s / m:2}. Now square it.",
    },
  },
  {
    id: "q-4.6.3-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "What is a no-trade list?",
    options: [
      { id: "a", label: "The setups that lost money last month", rationale: "That's a results list. A no-trade list is written in advance and doesn't depend on recent outcomes." },
      { id: "b", label: "Markets your broker doesn't offer", rationale: "Those are unavailable, not ruled out by you. The list covers situations in the markets you do trade." },
      { id: "c", label: "A written list of situations in which you never open a trade, such as 15 minutes before a tier-1 release" },
      { id: "d", label: "Trades you skipped and now regret", rationale: "Those are missed trades. The no-trade list sets the conditions in which skipping is the rule." },
    ],
    correct: "c",
    explanation: "The no-trade list is part of the playbook: checkable conditions in which no new trade is opened, whatever the setup shows. A trade that breaks it is an error, even if it wins.",
    lesson: "4.6.3",
    concepts: ["specialisation", "when-not-to-trade"],
  },
  {
    id: "q-4.6.3-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "When should you add a second strategy to your playbook?",
    options: [
      { id: "a", label: "When the first one is in a losing streak", rationale: "Adding a strategy to escape a drawdown splits your sample just when you need it, and is a decision made under stress." },
      { id: "b", label: "As soon as you find a setup with a higher average", rationale: "A higher average on a small sample is weak evidence. Each strategy needs its own meaningful sample." },
      { id: "c", label: "When the two are highly correlated, so they confirm each other", rationale: "Highly correlated strategies are the same bet twice. Diversifying needs low correlation." },
      { id: "d", label: "When each has positive expectancy on a meaningful sample, and the two are weakly correlated" },
    ],
    correct: "d",
    explanation: "A second strategy helps only if it adds an independent edge. Each needs its own evidence, and their results must be weakly correlated; otherwise it splits your sample or doubles the same bet.",
    lesson: "4.6.3",
    concepts: ["specialisation", "correlation-and-concentration"],
    hints: ["What does each strategy need before it counts as an edge?", "Two strategies that move together are one bet."],
  },
  // 4.6.4
  {
    id: "q-4.6.4-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which pipeline stage first tests real execution and your psychology with real money?",
    options: [
      { id: "a", label: "The backtest with costs", rationale: "A backtest uses assumed fills and has no emotions in it." },
      { id: "b", label: "The forward test in the simulator", rationale: "The simulator tests your execution, but no real money is at stake, so real fills and real nerves aren't tested yet." },
      { id: "c", label: "Live at minimum size" },
      { id: "d", label: "The robustness checks", rationale: "Robustness tests the rules across parameters, markets and periods, still on past data." },
    ],
    correct: "c",
    explanation: "Minimum live size is the first stage with real fills, real costs and real money at stake, at a size where mistakes are cheap. Scaling begins only after it.",
    lesson: "4.6.4",
    concepts: ["development-pipeline"],
  },
  {
    id: "q-4.6.4-2",
    topic: "psychology",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why are kill criteria written before a strategy goes live?",
    options: [
      { id: "a", label: "Because brokers require them", rationale: "No broker asks for them. They protect you from your own judgment in a drawdown." },
      { id: "b", label: "In a drawdown, judgment is biased; thresholds set while calm can't be bent to hope or fear" },
      { id: "c", label: "So they can be loosened if the strategy recovers", rationale: "Loosening thresholds mid-drawdown is exactly what writing them in advance prevents." },
      { id: "d", label: "Because a Monte Carlo can only be run before trading starts", rationale: "You can rerun it at any time. What matters is when you decide, not when you compute." },
    ],
    correct: "b",
    explanation: "Mid-drawdown, sunk cost, loss aversion and hope push you to move the line. Written beforehand from the Monte Carlo, the thresholds are a decision already made; the drawdown only checks it.",
    lesson: "4.6.4",
    concepts: ["kill-criteria", "sunk-cost"],
    hints: ["Who decides: you while calm, or you during a drawdown?", "Which biases from 2.12 push a trader to move a limit?"],
  },
  {
    id: "q-4.6.4-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario: "Your system's written thresholds: review past 13.5R (its 95th Monte Carlo percentile), kill past 16.5R (the 99th). It's now 15R below its peak.",
    prompt: "What do you do?",
    options: [
      { id: "a", label: "Kill it: 15R is a deep drawdown", rationale: "15R is past the review line but short of the kill line, 16.5R. Killing now overrides your own written rules." },
      { id: "b", label: "Keep trading at the same size: it's above the kill line", rationale: "The review line has been crossed. That means a stage down and a full review, not business as usual." },
      { id: "c", label: "Double the size to recover faster", rationale: "Raising size in a drawdown is martingale thinking, and breaks every scaling rule." },
      { id: "d", label: "Step down one capital stage and run a full review" },
    ],
    correct: "d",
    explanation: "15R lies between the 95th and 99th percentiles: unusual, but not proof of breakage. The written response is review: one capital stage down and a full review. Kill only past 16.5R, on an interval entirely below zero, or if the regime is gone.",
    lesson: "4.6.4",
    concepts: ["kill-criteria", "monte-carlo-resampling"],
    hints: ["Place 15R between the two written lines.", "Review comes past the 95th percentile; kill past the 99th."],
  },
  // 4.6.5
  {
    id: "q-4.6.5-1",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "A system wins 50% of its trades at +2R and loses 1R otherwise. What is its full Kelly fraction, in %?",
    numeric: { answer: 25, tolerance: 0.1, unit: "%" },
    explanation: "f* = W − (1 − W) ÷ b = 0.50 − 0.50 ÷ 2 = 0.25, or 25%. That's a ceiling: a 1% risk is a twenty-fifth of it, room for an overestimated edge.",
    lesson: "4.6.5",
    concepts: ["kelly-criterion"],
    hints: ["Kelly: f* = W − (1 − W) ÷ b.", "0.50 ÷ 2 = 0.25. Subtract it from 0.50."],
    vary: {
      fields: { w: [0.35, 0.6, 0.05], b: [1.5, 3, 0.5] },
      constraints: ["w - (1 - w) / b > 0.02"],
      answer: "round(100 * (w - (1 - w) / b), 1)",
      prompt: "A system wins {w * 100:0}% of its trades at +{b:1}R and loses 1R otherwise. What is its full Kelly fraction, in %?",
      explanation: "f* = W − (1 − W) ÷ b = {w:2} − {1 - w:2} ÷ {b:1} = {answer:1}%. That's a ceiling, far above a 1% risk.",
      hint: "{1 - w:2} ÷ {b:1} = {(1 - w) / b:3}. Subtract it from {w:2}.",
    },
  },
  {
    id: "q-4.6.5-2",
    topic: "position_sizing",
    kind: "mcq",
    difficulty: 2,
    prompt: "When do you increase your position size?",
    options: [
      { id: "a", label: "After a losing streak, to win the losses back", rationale: "That's martingale: size grows exactly when the system may be broken." },
      { id: "b", label: "After a great week", rationale: "A week is no sample. A step up needs trades at the stage, adherence and a drawdown inside the band." },
      { id: "c", label: "After a new equity high, once the stage's criteria are met: sample, adherence and drawdown" },
      { id: "d", label: "Whenever the account grows by 10%", rationale: "Profit alone isn't the criterion. A 10% gain can come with poor adherence or a tiny sample." },
    ],
    correct: "c",
    explanation: "Size steps up about 25% at a time, only after a new equity high and once the stage's evidence is in: enough trades, adherence of 90% or more, and the drawdown inside the Monte Carlo band.",
    lesson: "4.6.5",
    concepts: ["capital-staging"],
    hints: ["Profit alone never unlocks a stage.", "Think of the three criteria every stage needs."],
  },
  {
    id: "q-4.6.5-3",
    topic: "position_sizing",
    kind: "mcq",
    difficulty: 3,
    prompt: "Why does scaling into an illiquid instrument erode your edge?",
    options: [
      { id: "a", label: "Illiquid instruments never trend", rationale: "Liquidity says nothing about trends. The problem is the cost your own size creates." },
      { id: "b", label: "Your own orders move the price: impact grows with order size against daily volume, so each unit costs more as you grow" },
      { id: "c", label: "Brokers charge higher commission rates on larger orders", rationale: "Commission rates usually fall with volume. Impact is the cost that grows with size." },
      { id: "d", label: "It doesn't: costs per unit are the same at any size", rationale: "Spread and commission per unit may be, but market impact rises with your order size against the market's volume." },
    ],
    correct: "b",
    explanation: "Market impact grows roughly with the square root of your order size relative to daily volume (unit 4.2). An edge that pays at 100 units can vanish at 10,000, because each fill moves the price further against you.",
    lesson: "4.6.5",
    concepts: ["capital-staging", "trading-costs"],
    hints: ["Which cost depends on your own size?", "Compare your order with the market's daily volume."],
  },
  // 4.6.6
  {
    id: "q-4.6.6-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "100 trades, expectancy +0.15R, standard deviation 1.2R. What is the lower end of the 95% interval of the expectancy, in R?",
    numeric: { answer: -0.09, tolerance: 0.01, unit: "R" },
    explanation: "Standard error = 1.2 ÷ √100 = 0.12R. Half-width = 1.96 × 0.12 = 0.24R. Interval: 0.15 − 0.24 = −0.09R to 0.15 + 0.24 = +0.39R. Zero is inside, so the edge isn't proven yet.",
    lesson: "4.6.6",
    concepts: ["decay-vs-variance", "expectancy-confidence-interval"],
    hints: ["Standard error = sd ÷ √n.", "Lower end = mean − 1.96 × standard error."],
    vary: {
      fields: { m: [0.05, 0.4, 0.05], s: [0.8, 2, 0.1], n: [50, 200, 10] },
      answer: "round(m - round(1.96 * s / sqrt(n), 2), 2)",
      prompt: "{n} trades, expectancy +{m:2}R, standard deviation {s:1}R. What is the lower end of the 95% interval of the expectancy, in R?",
      explanation: "Standard error = {s:1} ÷ √{n} = {s / sqrt(n):3}R. Half-width = 1.96 × {s / sqrt(n):3} = {1.96 * s / sqrt(n):2}R. Lower end = {m:2} − {1.96 * s / sqrt(n):2} = {answer:2}R.",
      hint: "Standard error = {s:1} ÷ √{n} = {s / sqrt(n):3}R. Multiply by 1.96, then subtract.",
    },
  },
  {
    id: "q-4.6.6-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "What must exist before you change a rule in your plan?",
    options: [
      { id: "a", label: "Three losses in a row with the current rule", rationale: "Three losses are noise for most systems. A change needs a hypothesis and evidence, not a streak." },
      { id: "b", label: "A written hypothesis, an evidence threshold met, a simulator test, and a new logged plan version" },
      { id: "c", label: "A strong sense that the rule is wrong", rationale: "A feeling isn't evidence. It can start a hypothesis, which then has to pass a test." },
      { id: "d", label: "A better result for the new rule over the last 10 trades", rationale: "Ten trades fit noise. The new version needs a threshold set in advance, such as 30–50 trades or a walk-forward." },
    ],
    correct: "b",
    explanation: "Rule changes follow the governance from 3.11: state the hypothesis, set the evidence threshold in advance (30–50 trades, or a backtest with walk-forward), test it in the simulator, then release a new plan version and log the reason.",
    lesson: "4.6.6",
    concepts: ["rule-change-governance", "continuous-improvement"],
    hints: ["Think of the four steps from 3.11.10.", "When is the evidence threshold set: before or after the test?"],
  },
  {
    id: "q-4.6.6-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does the yearly review compare?",
    options: [
      { id: "a", label: "Your net, risk-adjusted result with the passive benchmark's, after every cost" },
      { id: "b", label: "Your gross profit with last year's", rationale: "Gross results ignore costs, and last year isn't the alternative. The alternative is a passive benchmark." },
      { id: "c", label: "Your win rate with other traders'", rationale: "A win rate means nothing without the payoff, and other traders' results aren't your alternative." },
      { id: "d", label: "Your best month with your worst", rationale: "The gap between months shows variance, not whether trading beat the simple alternative." },
    ],
    correct: "a",
    explanation: "The yearly question is whether your trading beat what buy-and-hold would have earned with no effort, after all costs and adjusted for risk. It ends in a decision: continue, reduce, retire the strategy, or invest passively.",
    lesson: "4.6.6",
    concepts: ["continuous-improvement", "passive-benchmark"],
  },
];

// ─── Glossary terms ──────────────────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "constraints-matrix",
    term: "Constraints matrix",
    definition: "A table that maps your time, capital, jurisdiction, drawdown tolerance, skills and measured temperament to the trading styles they allow or rule out.",
    plain: "A table matching your time, money, rules, skills and temperament to suitable trading styles.",
    related: ["trading-plan", "behaviour-audit", "swing-trading", "scalping"],
    lesson: "4.6.1",
  },
  {
    id: "behaviour-audit",
    term: "Behaviour audit",
    definition: "A review of measured habits from your own trade journal, such as overtrading, trades opened soon after a loss, moved stops and holding time, used in place of self-description.",
    plain: "A review of the habits your journal measures, such as revenge trades and moved stops.",
    related: ["journal", "revenge-trading", "overtrading", "constraints-matrix"],
    lesson: "4.6.1",
  },
  {
    id: "session-fit",
    term: "Session fit",
    definition: "How well an instrument's most liquid hours overlap the hours you can actually trade, in your own time zone, including the weeks when daylight-saving changes don't line up.",
    plain: "How well a market's most liquid hours match the hours you can actually trade.",
    related: ["trading-session", "session-overlap", "daylight-saving-time", "tradability-ratio"],
    lesson: "4.6.2",
  },
  {
    id: "specialisation",
    term: "Specialisation",
    definition: "Trading one style, one or two setups and one or two markets until the sample is large enough to judge whether the edge is real.",
    plain: "Focusing on one style, few setups and few markets until your results can be judged.",
    related: ["playbook", "sample-size", "statistical-power", "no-trade-list"],
    lesson: "4.6.3",
    aka: ["Specialization"],
  },
  {
    id: "no-trade-list",
    term: "No-trade list",
    definition: "The part of a playbook that lists checkable situations in which no new trade is opened, whatever the setup shows, such as the minutes before a tier-1 release.",
    plain: "A written list of situations in which you never open a trade.",
    related: ["playbook", "stand-aside", "daily-loss-limit", "impact-tier"],
    lesson: "4.6.3",
  },
  {
    id: "statistical-power",
    term: "Statistical power",
    definition: "The probability that a test detects an effect that is really there. For a trading edge it rises with the number of trades and with the edge's size relative to the spread of results.",
    plain: "The chance that a test detects a real effect; it rises with sample size.",
    related: ["sample-size", "t-statistic", "confidence-interval", "false-positive"],
    lesson: "4.6.3",
  },
  {
    id: "development-pipeline",
    term: "Development pipeline",
    definition: "The staged path of a strategy: hypothesis, rules, backtest, robustness, simulator forward test, minimum live size, gradual scaling and decay monitoring, with a gate at each stage.",
    plain: "The staged path a strategy follows from idea to full live size, with a gate at each stage.",
    related: ["edge-hypothesis", "backtest", "incubation", "kill-criteria"],
    lesson: "4.6.4",
  },
  {
    id: "kill-criteria",
    term: "Kill criteria",
    definition: "Numeric thresholds, written before going live, at which a strategy stops trading live, such as a drawdown past its 99th Monte Carlo percentile or an expectancy interval entirely below zero.",
    plain: "Numeric limits, set in advance, at which a strategy is stopped.",
    related: ["kill-switch", "review-trigger", "monte-carlo", "percentile"],
    lesson: "4.6.4",
  },
  {
    id: "review-trigger",
    term: "Review trigger",
    definition: "A threshold, such as a drawdown past the 95th Monte Carlo percentile or an expectancy interval that includes zero after 50 trades, that moves a strategy down one capital stage and starts a full review.",
    plain: "A threshold that moves a strategy down one stage and forces a full review.",
    related: ["kill-criteria", "capital-stages", "percentile", "confidence-interval"],
    lesson: "4.6.4",
  },
  {
    id: "capital-stages",
    term: "Capital stages",
    definition: "Steps of position size, from the simulator to minimum live size and then 25%, 50% and 100% of target size, each unlocked by sample size, adherence and drawdown, and lost on a review trigger.",
    plain: "Steps of position size, from simulator to full size, each unlocked by evidence.",
    related: ["size-step-up", "review-trigger", "plan-adherence", "go-live-gate"],
    lesson: "4.6.5",
  },
  {
    id: "notional-account",
    term: "Notional account",
    definition: "The account value used to size trades. Cutting it faster than equity in a drawdown, as the Turtles did by 20% for every 10% down, lowers risk ahead of further losses.",
    plain: "The account value used for sizing; cut after drawdowns so risk falls faster than equity.",
    related: ["drawdown-tier", "risk-per-trade", "equity", "max-drawdown"],
    lesson: "4.6.5",
  },
  {
    id: "size-step-up",
    term: "Size step-up",
    definition: "A planned increase in position size, typically about 25%, allowed only after a new equity high and once the current stage's criteria are met.",
    plain: "A planned size increase of about 25%, allowed only after new equity highs and stage criteria.",
    related: ["capital-stages", "position-size", "anti-martingale"],
    lesson: "4.6.5",
  },
  {
    id: "annual-review",
    term: "Annual review",
    definition: "A yearly review of net, risk-adjusted results against the passive benchmark, with rules, regulation and costs rechecked, ending in a decision: continue, reduce, retire or invest passively.",
    plain: "A yearly check of net, risk-adjusted results against the benchmark that ends in a decision.",
    related: ["benchmark", "sharpe-ratio", "weekly-review", "strategy-retirement"],
    lesson: "4.6.6",
    aka: ["Yearly review"],
  },
  {
    id: "rule-change-log",
    term: "Rule-change log",
    definition: "A versioned record of every rule change: the hypothesis, the evidence threshold, the test result, the date and the new plan version.",
    plain: "A versioned record of every rule change, with its reason and its evidence.",
    related: ["research-log", "trading-plan", "out-of-sample"],
    lesson: "4.6.6",
  },
  {
    id: "strategy-retirement",
    term: "Strategy retirement",
    definition: "Removing a strategy from live trading for good, when its edge has decayed, its regime no longer appears, or it keeps failing its reviews.",
    plain: "Stopping a strategy for good when its edge is gone or its regime no longer appears.",
    related: ["edge-decay", "kill-criteria", "annual-review"],
    lesson: "4.6.6",
  },
  {
    id: "edge-decay",
    term: "Edge decay",
    definition: "The weakening of a strategy's returns over time, often after it becomes widely known and crowded. Published anomalies earned 58% less after publication on average (McLean and Pontiff, 2016).",
    plain: "The weakening of a strategy's returns over time, often after it becomes widely known.",
    related: ["anomaly", "crowding", "out-of-sample", "strategy-retirement"],
    lesson: "4.6.6",
  },
];

// ─── Concepts ────────────────────────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "constraints-matrix",
    name: "Constraints matrix",
    category: "decision_making",
    summary: "Mapping time, capital, jurisdiction, drawdown tolerance, skills and temperament to the styles they allow or rule out.",
    body: [
      "Each row is one constraint and two lists: the styles it points towards and the ones it rules out. Fixed office hours point to swing or position trading with end-of-day orders and rule out scalping and news trading. A small account points to micro contracts and a swing horizon; low drawdown tolerance points to 0.25–0.5% risk and away from low-win-rate trend following.",
      "Time usually rules out the most, so it goes first. Temperament goes last, and only as the journal measures it. The rows are practitioner rules of thumb (grade C): the matrix narrows the choice; your own numbers decide it.",
    ],
    example: "Office hours 09:00–17:00, an account of 3,000, a 10% drawdown limit, and a journal with 9 of 40 trades opened within 10 minutes of a loss: swing trading with end-of-day orders at 0.5% risk. Scalping, news trading and discretionary intraday are ruled out.",
    related: ["trading-styles", "behaviour-audit", "trading-plan", "risk-capital"],
    missions: ["M06"],
    lessons: ["4.6.1"],
  },
  {
    id: "behaviour-audit",
    name: "Behaviour audit",
    category: "psychology",
    summary: "Measured habits from your own journal (overtrading, revenge trades, moved stops, holding time) used to choose a style.",
    body: [
      "Self-description is biased: overconfidence and hindsight make most people see themselves as more patient and disciplined than they trade. The journal doesn't. It counts trades opened soon after a loss, stops moved further away, trades per session against the plan, and how long positions are really held.",
      "Where the description and the count disagree, the count goes into the constraints matrix. A trader who closes planned swings within minutes, or revenge trades after losses, has a temperament constraint that points to automated orders, fixed rules and longer horizons.",
    ],
    example: "40 trades in 4 weeks: 9 opened within 10 minutes of a loss (22.5%), 6 stops moved further away, planned swings closed after a median 18 minutes. Whatever the trader believes, the matrix records 'impulsive under stress'.",
    related: ["revenge-trading", "overtrading", "behavioural-guard-rails", "process-kpis"],
    missions: ["M06"],
    lessons: ["4.6.1"],
  },
  {
    id: "tradability-ratio",
    name: "Tradability ratio",
    category: "market_fundamentals",
    summary: "Average true range divided by round-trip cost: a quick measure of how cheaply a market can be traded.",
    body: [
      "Divide the typical daily move, the ATR, by the full cost of a round trip, spread plus commission both ways, in the same units. The result says how many times its cost a market moves in a day. A higher ratio leaves more room for an edge after costs.",
      "The ratio matters most for short styles. The same cost takes a far bigger share of a small target than of a large one, so scalping needs a much higher ratio than swing trading. The arithmetic is exact; which ratio is 'enough' depends on your targets.",
    ],
    example: "A: 2.40 ÷ 0.20 = 12; B: 1.50 ÷ 0.30 = 5; C: 30.00 ÷ 1.50 = 20. On A, the 0.20 round trip is 4% of a 4.80 swing target but about 17% of a 1.20 scalp target.",
    related: ["cost-drag", "trading-costs", "volatility", "fx-sessions"],
    missions: [],
    lessons: ["4.6.2"],
  },
  {
    id: "specialisation",
    name: "Specialisation",
    category: "decision_making",
    summary: "Trading one style, few setups and few markets until the sample is large enough to judge the edge.",
    body: [
      "An edge belongs to one setup on one market. Trades spread over many setups and markets give each combination a tiny sample, so none of them can ever be judged. The number of trades needed for a t-statistic of about 2 is (2 × sd ÷ mean)², which runs into the hundreds for typical edges.",
      "So specialise: one or two setups on one or two markets, at least 100 trades, or 30 for slow strategies with a backtest behind them. Rank setups by the lower end of their interval, write a no-trade list, and add a second strategy only when each is positive on its own and the two are weakly correlated.",
    ],
    example: "Mean +0.2R, sd 1.5R: n = (2 × 1.5 ÷ 0.2)² = 225 trades, 75 weeks at 3 trades a week. Spread over five setups at the same pace, it would take about seven years.",
    related: ["sample-size", "statistical-significance", "setup-card", "expectancy-confidence-interval"],
    missions: ["M10"],
    lessons: ["4.6.3"],
  },
  {
    id: "development-pipeline",
    name: "Development pipeline",
    category: "decision_making",
    summary: "The staged path from hypothesis to backtest, robustness, forward test, small live size, scaling and decay monitoring.",
    body: [
      "Eight stages: the hypothesis, with its economic reason; the rules; a backtest with real costs, out-of-sample, walk-forward and an R0 control; robustness across parameters, markets, periods and Monte Carlo; a forward test in the simulator; minimum live size; gradual scaling; and decay monitoring.",
      "Each stage has a gate, and each tests something the earlier ones can't: the idea, then your execution, then real fills and nerves, then size. Several strategies can sit at different stages at once, each with its own review and kill thresholds.",
    ],
    example: "A pullback setup: hypothesis written, rules coded, backtest with costs and walk-forward, robustness passed, 50 simulator trades inside the corridor. It goes live at minimum size; scaling starts only after 50 more trades meet the stage criteria.",
    related: ["edge-hypothesis", "walk-forward-analysis", "robustness-testing", "incubation"],
    missions: [],
    lessons: ["4.6.4"],
  },
  {
    id: "kill-criteria",
    name: "Review and kill criteria",
    category: "risk_management",
    summary: "Numeric thresholds written in advance that demote or stop a strategy when results leave the expected range.",
    body: [
      "Two tiers, set from the strategy's own Monte Carlo and expectancy interval before it trades. Review steps it down one capital stage and starts a full review: a drawdown past the 95th percentile, or an interval that includes zero after at least 50 trades. Kill stops live trading: a drawdown past the 99th percentile, an interval entirely below zero, or the regime it was built for no longer appearing.",
      "They are numbers, not adjectives, and they aren't moved during a drawdown. The percentiles come from the data; the choice of the 95th and 99th is a practitioner convention (grade C).",
    ],
    example: "Reference system: review past 13.5R, kill past 16.5R. At 11R, keep trading. At 15R, step down and review. At 18R, stop.",
    related: ["kill-switch", "monte-carlo-resampling", "expectancy-confidence-interval", "premortem"],
    missions: ["M07"],
    lessons: ["4.6.4"],
  },
  {
    id: "capital-staging",
    name: "Capital stages",
    category: "position_sizing",
    summary: "Raising size in steps unlocked by sample size, adherence and drawdown, and cutting it automatically on breaches.",
    body: [
      "Five stages: simulator, minimum live size, then 25%, 50% and 100% of target size. Each step up needs a sample, such as 50 trades at the stage, adherence of 90% or more, the drawdown inside the Monte Carlo band and a new equity high. A review trigger moves you down a stage automatically.",
      "Within a stage, size falls faster than equity in drawdowns and grows about 25% at a time after new highs. Full Kelly is a ceiling, not a target, and large size eventually meets market impact, which grows with order size against volume. These are practitioner conventions (grade C).",
    ],
    example: "Turtle-style de-risking: an account down from 10,000 to 9,000 (−10%) sizes from a notional 8,000, so a 1% risk is 80.00. The reference system's full Kelly is 16%; a 1% risk is about a sixteenth of it.",
    related: ["kelly-criterion", "fractional-kelly", "drawdown-tiers", "position-sizing"],
    missions: ["M05"],
    lessons: ["4.6.5"],
  },
  {
    id: "continuous-improvement",
    name: "Continuous improvement",
    category: "decision_making",
    summary: "A review cycle from daily to yearly, with evidence-based rule changes and a yearly continue, reduce or retire decision.",
    body: [
      "Daily and weekly reviews check process. Monthly or quarterly reviews check statistics: the R distribution, MAE and MFE, expectancy per setup with its interval, and drawdown against the Monte Carlo band. The yearly review compares net, risk-adjusted results with the passive benchmark, rechecks rules and costs, and ends with a decision: continue, reduce, retire the strategy, or invest passively.",
      "Rules change only through a logged process: hypothesis, an evidence threshold set in advance, a simulator test and a new plan version. Practice targets the weaknesses the journal measures, not the parts you enjoy.",
    ],
    example: "A year: net +3.1% after costs with a Sharpe of 0.4; the passive benchmark returned +7.8% with a Sharpe of 0.6. Under a rule written a year earlier, 'below the benchmark but positive: reduce', size drops a stage for the next year.",
    related: ["trading-reviews", "rule-change-governance", "passive-benchmark", "decay-vs-variance"],
    missions: [],
    lessons: ["4.6.6"],
  },
  {
    id: "decay-vs-variance",
    name: "Decay versus variance",
    category: "decision_making",
    summary: "Telling a fading edge from normal luck or a regime change with confidence intervals and Monte Carlo bands.",
    body: [
      "Variance: recent results sit inside the expectancy interval and the Monte Carlo band, with good adherence; keep executing. Decay: a persistent fall across windows and regimes, often after the edge became public or crowded; cut size and revalidate. Regime change: losses only in one regime that has become more common; test a regime filter out of sample.",
      "Edges do decay: published anomalies earned 58% less after publication (McLean and Pontiff, 2016, grade A). But a single bad stretch rarely proves it. Check the interval and the band before calling it.",
    ],
    example: "Expectancy fell from 0.30R to 0.12R over 80 trades with sd 1.5R. Standard error 0.17R, 95% interval −0.21R to +0.45R: it still includes 0.30R, so variance can explain the fall.",
    related: ["anomaly-decay", "expectancy-confidence-interval", "market-regime", "strategy-crowding"],
    missions: ["M02"],
    lessons: ["4.6.6"],
  },
];

/** Unit 4.6 · Your trading approach (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_4_6: UnitContent = {
  lessons: [L_4_6_1, L_4_6_2, L_4_6_3, L_4_6_4, L_4_6_5, L_4_6_6],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
