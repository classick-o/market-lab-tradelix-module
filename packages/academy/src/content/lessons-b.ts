import type { Lesson } from "../types";

/**
 * Lessons on risk, stops, psychology, planning, scenarios and review.
 * All numbers are in vUSD on the synthetic LABX instrument and are arithmetically exact.
 */
export const LESSONS_B: Lesson[] = [
  // ---------------------------------------------------------------------------
  {
    id: "L08",
    title: "Risk per trade",
    topic: "risk_management",
    level: "beginner",
    tier: "free",
    minutes: 6,
    summary: "Decide the most you are willing to lose on a trade before you enter, as a small, fixed percentage of your account.",
    objectives: [
      "Set a maximum loss before entering a trade",
      "Convert a percentage risk limit into vUSD using the current account value",
      "Explain why small, fixed risk keeps a losing run recoverable",
    ],
    blocks: [
      {
        kind: "text",
        text: "Every trade can lose. **Risk per trade** is the amount you accept losing if price reaches your stop-loss, decided before you enter and including costs such as spread and commission. It is not the value of the position: it is the slice of the account genuinely on the line if you are wrong. Traders call this amount **1R**.",
      },
      { kind: "heading", text: "A fixed percentage of the account" },
      {
        kind: "text",
        text: "Most risk rules are written as a percentage of the account. MARKET//LAB missions allow 1% per trade and the Arena 2%. On a 10,000.00 vUSD account, 1% is 100.00 vUSD. The app's **Risk Discipline** score checks that every entry has a stop and that the planned loss stays within the limit.",
      },
      {
        kind: "example",
        title: "Turning a percentage into vUSD",
        lines: [
          "Account: 10,000.00 vUSD. Risk limit: 1%.",
          "Budget: 10,000.00 × 1% = 100.00 vUSD.",
          "After a few losses the account is 9,500.00 vUSD.",
          "New budget: 9,500.00 × 1% = 95.00 vUSD.",
        ],
        result: "Because the rule is a percentage, the budget shrinks after losses and grows after gains without any extra decision.",
      },
      {
        kind: "steps",
        items: [
          "Before looking for trades, write down your limit as a percentage: 1% in missions, at most 2% in the Arena.",
          "Convert it to vUSD using the current account value, not the starting one.",
          "Find the price where the trade idea would be wrong: that is where the stop goes.",
          "Size the position so a stop-out, including spread and commission, costs no more than the budget.",
          "If even a small position would break the limit, there is no trade.",
        ],
      },
      { kind: "heading", text: "Why small losses matter" },
      {
        kind: "text",
        text: "Losses are harder to undo than they look. A **drawdown** is the fall from the account's highest value. A 10% drawdown needs an 11.1% gain to recover, because the gain is earned on a smaller account; a 50% drawdown needs 100%. Keeping each loss small keeps any losing run in the shallow part of that curve.",
      },
      {
        kind: "figure",
        diagram: "loss-recovery",
        caption: "The deeper the drawdown, the larger the gain needed to get back to the start: −10% needs +11.1%, −20% needs +25%, −50% needs +100%.",
      },
      {
        kind: "example",
        title: "The same ten losses at two risk levels",
        lines: [
          "Start: 10,000.00 vUSD. Ten losing trades in a row, each risking a percentage of the current account.",
          "At 1% per trade: 10,000.00 → 9,043.82 vUSD (−9.6%). Gain needed to recover: about +10.6%.",
          "At 5% per trade: 10,000.00 → 5,987.37 vUSD (−40.1%). Gain needed to recover: about +67.0%.",
        ],
        result: "The same run of losses is a setback at 1% and a serious hole at 5%.",
      },
      {
        kind: "interactive",
        widget: "loss-recovery",
        title: "How deep is too deep?",
        prompt: "Set the drawdown to 10%, then 25%, then 50%. Notice how the gain needed to recover grows much faster than the loss itself.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Decide your maximum loss before you enter, as a fixed percentage of the current account, and never let a single trade exceed it. The risk is chosen first; the position size follows from it.",
      },
      { kind: "check", questionIds: ["q-rm-1", "q-rm-2", "q-rm-3"] },
    ],
    practice: [
      { kind: "mission", ref: "M04", label: "Mission: Define Your Risk" },
      { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
      { kind: "check", ref: "risk_management", label: "Knowledge check: risk management" },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: "L10",
    title: "Where a stop belongs",
    topic: "stop_loss",
    level: "beginner",
    tier: "free",
    minutes: 6,
    summary: "Place a stop-loss where your trade idea is proven wrong, not at a convenient distance, and let the position size absorb the difference.",
    objectives: [
      "Place a stop where the trade idea is invalidated",
      "Tell a stop inside normal noise from one beyond a meaningful level",
      "Adjust the position size, not the stop, to keep risk within the limit",
    ],
    blocks: [
      {
        kind: "text",
        text: "A **stop-loss** is an order that closes your position if price reaches a level you chose in advance. Its job is not to prevent every loss. Its job is to get you out when the reason for the trade no longer holds, at a cost you accepted before you entered.",
      },
      { kind: "heading", text: "Invalidation, not a round number" },
      {
        kind: "text",
        text: "Ask what price would have to do to prove the idea wrong. If you bought because support held, the idea is wrong once price breaks clearly through that support. The stop belongs just beyond that point, with a small buffer for noise, not at a round number or at whatever loss feels comfortable.",
      },
      {
        kind: "figure",
        diagram: "stop-placement",
        caption: "A stop inside the normal noise is easily touched even while the idea is still valid. A stop beyond the support level is hit only if the support actually fails.",
      },
      {
        kind: "points",
        items: [
          "**Too tight**: inside the normal back-and-forth of price, so random noise stops you out of a sound idea.",
          "**Arbitrary**: set by a round number or a fixed amount rather than by what the chart says.",
          "**Exactly on the level**: obvious levels are often briefly tested, so a stop right on them is easily hit.",
          "**Missing**: no stop at all, so the possible loss has no limit.",
        ],
      },
      { kind: "heading", text: "Let the size absorb the distance" },
      {
        kind: "text",
        text: "A stop placed by logic will sometimes be far from the entry. That is fine. You don't move the stop to suit the size you wanted; you change the size to suit the stop. A wider stop means fewer units for the same risk in vUSD, and a tighter one means more.",
      },
      {
        kind: "example",
        title: "Same risk, two stops",
        lines: [
          "Account 10,000.00 vUSD, risk 1% = 100.00 vUSD. Entry 50.00 (the ask you pay). Support at 48.40.",
          "Stop A at 49.50, inside normal noise: 0.50 per unit → 100.00 ÷ 0.50 = 200 units.",
          "Stop B at 48.00, beyond support: 2.00 per unit → 100.00 ÷ 2.00 = 50 units.",
          "With 0.05% commission on entry and exit, the cost-aware sizes are 181 and 48 units.",
        ],
        result: "Both risk about 100.00 vUSD. Stop B gives the idea room to be right; it simply uses fewer units.",
      },
      {
        kind: "interactive",
        widget: "position-size",
        title: "Move the stop, watch the size",
        prompt: "Keep the account at 10,000.00 and the risk at 1%. Set the entry to 50.00, then try a stop at 49.50 and one at 48.00. The risk stays about the same; only the number of units changes.",
      },
      {
        kind: "text",
        text: "A stop is not a guaranteed price. When it is touched it becomes a market order and fills at the next available price, which may be slightly worse. If price gaps through the stop, the fill is at the opening price, possibly well beyond it. Small risk per trade keeps that surprise survivable.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Never widen a stop once a trade is open. Moving it further away to avoid being stopped out raises the risk you agreed to, and MARKET//LAB counts it against your Risk Discipline. If the stop is hit, either the idea was wrong or the noise was bigger than planned: both are lessons for the next plan.",
      },
      { kind: "check", questionIds: ["q-sl-1", "q-sl-2", "q-sl-3"] },
    ],
    practice: [
      { kind: "mission", ref: "M04", label: "Mission: Define Your Risk" },
      { kind: "mission", ref: "M07", label: "Mission: Stop or Stay?" },
      { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: "L11",
    title: "Reward-to-risk and expectancy",
    topic: "risk_management",
    level: "beginner",
    tier: "free",
    minutes: 7,
    summary: "Compare what a trade can make with what it can lose, and judge a method by its average result over many trades rather than by any single one.",
    objectives: [
      "Calculate a reward-to-risk ratio and its break-even win rate",
      "Estimate expectancy in R from a win rate and the average win and loss",
      "Explain why a single result says little about a method",
    ],
    blocks: [
      {
        kind: "text",
        text: "Measuring results in **R** makes trades comparable. R is the amount you risked: the distance from entry to stop times the units, plus costs. If you risked 100.00 vUSD and made 200.00 vUSD, the result is +2R. A loss at the stop is −1R, whatever the position size.",
      },
      { kind: "heading", text: "Reward-to-risk" },
      {
        kind: "text",
        text: "The **reward-to-risk ratio** compares the distance to your target with the distance to your stop. A target twice as far away as the stop gives 2:1. The ratio alone does not make a trade good: a distant target that price rarely reaches is not better than a closer one it often does.",
      },
      {
        kind: "figure",
        diagram: "risk-reward",
        caption: "Entry with the stop below and the target above. The distance to the stop is 1R; a target twice as far away is 2R.",
      },
      {
        kind: "example",
        title: "From prices to a ratio",
        lines: [
          "Entry 50.00, stop 49.00, target 52.00.",
          "Risk per unit: 50.00 − 49.00 = 1.00. Reward per unit: 52.00 − 50.00 = 2.00.",
          "Reward-to-risk: 2.00 ÷ 1.00 = 2:1.",
          "Break-even win rate = risk ÷ (risk + reward) = 1.00 ÷ 3.00 = 33.3%.",
        ],
        result: "At 2:1 the trade has to work more than one time in three just to break even, before costs.",
      },
      {
        kind: "interactive",
        widget: "risk-reward",
        title: "Ratio and break-even",
        prompt: "Enter 50.00, 49.00 and 52.00, then move the target to 51.00 and to 53.00. At 1:1 you need to win 50% of the time to break even; at 3:1, only 25%.",
      },
      { kind: "heading", text: "Expectancy: the average trade" },
      {
        kind: "text",
        text: "**Expectancy** is the average result per trade, in R: (win rate × average win) − (loss rate × average loss). A positive figure means the method has made money on average over a sample of trades; a negative one means it has lost, however good some single trades felt. The bigger the sample, the more the figure means.",
      },
      {
        kind: "example",
        title: "Three methods, before costs",
        lines: [
          "A: wins 40% at +2R, loses 60% at −1R → 0.40 × 2 − 0.60 × 1 = +0.20R per trade, +20R over 100 trades.",
          "B: wins 60% at +0.8R, loses 40% at −1R → 0.60 × 0.8 − 0.40 × 1 = +0.08R per trade, +8R over 100 trades.",
          "C: wins 70% at +0.4R, loses 30% at −1R → 0.70 × 0.4 − 0.30 × 1 = −0.02R per trade, −2R over 100 trades.",
        ],
        result: "The method that wins most often is the only one that loses money. Win rate and payoff only make sense together.",
      },
      {
        kind: "interactive",
        widget: "expectancy",
        title: "Find the break-even point",
        prompt: "Set the average win to 2R and the average loss to 1R, then lower the win rate until expectancy reaches zero. It happens at about 33.3%, the same break-even rate as a 2:1 trade.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Judge a method by its expectancy over many trades in R, and judge each trade by whether it followed the plan. A single result, good or bad, proves almost nothing on its own.",
      },
      { kind: "check", questionIds: ["q-rm-4", "q-rm-5", "q-rm-6"] },
    ],
    practice: [
      { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
      { kind: "arena", ref: "bullish", label: "Arena: trending market" },
      { kind: "check", ref: "risk_management", label: "Knowledge check: risk management" },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: "L13",
    title: "FOMO, revenge and loss aversion",
    topic: "psychology",
    level: "beginner",
    tier: "free",
    minutes: 6,
    summary: "Recognise three common emotional traps that pull traders away from their plan, and the process rules that counter them.",
    objectives: [
      "Recognise FOMO, revenge trading and loss aversion in your own decisions",
      "Use rules written in advance to counter emotional decisions",
      "Take a set pause before acting after a strong move or a loss",
    ],
    blocks: [
      {
        kind: "text",
        text: "Decisions under uncertainty are rarely calm. Three well-known patterns often pull traders away from their plan: chasing a move, trying to win back a loss, and refusing to accept one. Naming them makes them easier to notice while they are happening, which is when it matters.",
      },
      { kind: "heading", text: "Three common traps" },
      {
        kind: "text",
        text: "**FOMO** (fear of missing out) is the urge to enter because price is already moving fast and you don't want to be left behind. The entry is late, the stop is usually far away or missing, and the decision is driven by the move itself rather than by a setup in your plan.",
      },
      {
        kind: "text",
        text: "**Revenge trading** is entering again soon after a loss, often with a larger size, to win the money back. The new trade is about the last result, not about the market in front of you. Sizing up after a loss raises the risk exactly when judgement is under the most strain.",
      },
      {
        kind: "example",
        title: "What revenge sizing costs",
        lines: [
          "Account 10,000.00 vUSD. A trade hits its stop: −100.00 (1%). Account: 9,900.00.",
          "Plan: the next trade risks 1% of 9,900.00 = 99.00. If it also loses, the account is 9,801.00 (−1.99% in total).",
          "Revenge: the next trade risks 3% of 9,900.00 = 297.00. If it also loses, the account is 9,603.00 (−3.97% in total).",
        ],
        result: "Two losses cost 199.00 vUSD with the plan and 397.00 vUSD with the revenge trade, roughly double, and the bigger size was chosen because of a feeling, not a setup.",
      },
      {
        kind: "text",
        text: "**Loss aversion** is the tendency to feel a loss more strongly than a gain of the same size. In trading it shows up as widening the stop to avoid taking a loss, or closing winners early to lock in a good feeling. A close relative is the **sunk cost** trap: 'I've lost too much already to sell now.'",
      },
      { kind: "heading", text: "Process beats willpower" },
      {
        kind: "figure",
        diagram: "decision-tree",
        caption: "A checklist written in advance replaces the urge with questions: is the setup present, are all conditions met, is the risk defined and within the limit? Any 'no' means no trade.",
      },
      {
        kind: "points",
        items: [
          "Write your setups and entry conditions before the session. A move that is not in the plan is not a trade.",
          "Fix risk per trade as a percentage and never increase the size after a loss.",
          "Place the stop when you enter and never widen it.",
          "After a loss, take a cooling-off pause of a set length before the next decision.",
          "Record in the journal how you felt at each decision, so patterns become visible over time.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        text: "A strong urge to act right now, after a big move or a painful loss, is not evidence that the trade is good. Treat it as the signal to slow down and run the checklist, not to skip it.",
      },
      { kind: "check", questionIds: ["q-psy-1", "q-psy-2", "q-psy-3"] },
    ],
    practice: [
      { kind: "mission", ref: "M06", label: "Mission: The FOMO Trap" },
      { kind: "mission", ref: "M07", label: "Mission: Stop or Stay?" },
      { kind: "check", ref: "psychology", label: "Knowledge check: psychology" },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: "L14",
    title: "Writing a trading plan",
    topic: "decision_making",
    level: "beginner",
    tier: "free",
    minutes: 6,
    summary: "Write down, before you trade, what you will trade, when you will act, how much you will risk and how you will exit, so decisions follow rules rather than moods.",
    objectives: [
      "Write a short playbook with entry conditions, risk and exits",
      "Check a setup against every condition before acting",
      "Treat 'no trade' as a valid decision",
    ],
    blocks: [
      {
        kind: "text",
        text: "A **trading plan** is a written set of rules you decide while calm and follow while under pressure. The hard thinking is done before money is at risk. Its core is a **playbook**: the setups you trade, each described by conditions specific enough to answer yes or no.",
      },
      { kind: "heading", text: "What a plan contains" },
      {
        kind: "points",
        items: [
          "**Market and timeframe**: what you trade and which candle interval you read.",
          "**Setups**: the patterns you trade, such as a pullback in an uptrend.",
          "**Entry conditions**: a checklist for each setup; every item must be true.",
          "**Risk**: the maximum per trade (1% in missions) and the rule for placing the stop.",
          "**Exits**: the stop, the target or profit-taking rule, and how long to wait if nothing happens.",
          "**Limits**: for example, stop for the session after a set number of losses.",
        ],
      },
      { kind: "heading", text: "Make every condition checkable" },
      {
        kind: "text",
        text: "Vague rules leave room for wishful thinking. 'The trend looks strong' can be argued either way; 'the last two swing lows are each higher than the one before' is simply true or false. If two people could look at the same chart and disagree about a condition, rewrite it until they couldn't.",
      },
      {
        kind: "example",
        title: "A playbook entry (illustrative)",
        lines: [
          "Setup: pullback in an uptrend.",
          "Condition 1: the last two swing highs and swing lows are each higher than the ones before.",
          "Condition 2: the pullback has held above the previous swing low.",
          "Condition 3: the target, the previous swing high, is at least 2R away.",
          "Stop: 0.20 below the pullback low. Risk: 1% of the account.",
          "Today: entry 49.00, pullback low 48.20, so the stop is 48.00, 1.00 below entry. The previous high is 51.50, 2.50 above entry: 2.5R.",
        ],
        result: "All three conditions are met, the stop is defined and 2.5R clears the 2R minimum, so the plan allows the trade.",
      },
      {
        kind: "interactive",
        widget: "risk-reward",
        title: "Test the 2R rule",
        prompt: "Enter 49.00, 48.00 and 51.50 from the example: 2.5:1. Then move the target to 50.50. The ratio falls to 1.5:1, condition 3 fails and the plan says no trade.",
      },
      {
        kind: "figure",
        diagram: "decision-tree",
        caption: "The plan as a decision path: setup present? All playbook conditions met? Risk defined and within the limit? Only three yeses lead to an entry; every other path ends in no trade.",
      },
      {
        kind: "steps",
        items: [
          "Name the setup you think you see.",
          "Check each condition against the chart, one at a time, and write yes or no.",
          "Define the stop and size the position within your risk limit.",
          "If every answer is yes, enter and record your reasons in the journal.",
          "If any answer is no, record 'no trade' and why.",
        ],
      },
      {
        kind: "text",
        text: "Declining a trade that does not meet the plan is not a missed opportunity; it is the plan working. In MARKET//LAB, **Decision Quality** looks at whether a decision fitted the plan and the information available at the time, not at what price did afterwards. A well-reasoned 'no trade' is a good decision too.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Write the plan before you trade, and make it specific enough to say no. When every condition is met, act; when any one is missing, no trade is the correct decision.",
      },
      { kind: "check", questionIds: ["q-dm-1", "q-dm-2", "q-dm-3"] },
    ],
    practice: [
      { kind: "mission", ref: "M10", label: "Mission: No Trade Is a Trade" },
      { kind: "check", ref: "decision_making", label: "Knowledge check: decision making" },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: "L15",
    title: "Thinking in scenarios",
    topic: "scenario_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 6,
    summary: "Before acting, map out the few ways price could plausibly move next and decide in advance what you would do in each.",
    objectives: [
      "Describe the bullish, bearish and sideways cases before entering a trade",
      "Attach a trigger and a planned action to each case",
      "Judge a scenario plan by its coverage and execution, not by its profit",
    ],
    blocks: [
      {
        kind: "text",
        text: "Nobody knows what price will do next. **Scenario analysis** accepts that: instead of one prediction, you list the few plausible paths, what would show that each is happening, and what you would do. The aim is not to be right but never to be pushed into an unplanned decision by a move you hadn't considered.",
      },
      { kind: "heading", text: "Bull, bear and sideways" },
      {
        kind: "text",
        text: "A simple frame uses three cases. In the **bullish** case the idea works, in the **bearish** case it fails, and in the **sideways** case nothing much happens. Each case needs a **trigger**, an observable event such as a candle closing beyond a level, and an **action** you decide now, not when it happens.",
      },
      {
        kind: "figure",
        diagram: "breakout-false-breakout",
        caption: "At resistance there are at least two paths after the first push: a breakout that holds, and a false breakout that falls back into the range. A plan needs an action for both.",
      },
      {
        kind: "example",
        title: "A scenario plan at resistance",
        lines: [
          "Now: LABX at 60.10, under resistance at 60.50. The range floor is 59.00. No position.",
          "Bullish: two candles close above 60.50 → buy near 60.80, stop 59.90 (back inside the range), target 62.60. Risk 0.90, reward 1.80: 2:1.",
          "False breakout: one close above 60.50, then back below it → no entry.",
          "Bearish: a close below 59.00 → the long idea is off; no trade.",
          "Sideways: price stays between 59.00 and 60.50 → wait.",
        ],
        result: "Every path already has an action. Whatever happens next, you are carrying out a plan, not reacting to a surprise.",
      },
      {
        kind: "interactive",
        widget: "risk-reward",
        title: "Check the bullish case",
        prompt: "Enter 60.80 as the entry, 59.90 as the stop and 62.60 as the target. The ratio is 2:1, so this case has to play out about one time in three just to break even before costs. Ask whether your view of the chart supports that.",
      },
      {
        kind: "text",
        text: "You can estimate roughly how likely each case is, but treat those estimates as judgement, not fact. What matters more is that the plan is acceptable in every case. If the bearish case would cost more than your risk limit, the trade is too big, however unlikely that case looks. Scheduled events deserve their own case, because price can gap past a stop.",
      },
      {
        kind: "points",
        items: [
          "What would show me the idea is working?",
          "What would show me it has failed, and where does the stop go?",
          "What if nothing happens? How long will I wait before closing?",
          "Is an event due that could make price gap past my stop?",
          "Can I accept the loss in the worst plausible case?",
        ],
      },
      { kind: "heading", text: "Outcome versus decision" },
      {
        kind: "text",
        text: "Afterwards, judge the plan by whether it covered what happened and whether you followed it, not by the profit. A stop-out in the bearish case you planned for is a plan well executed. A win in a case you never considered was luck. MARKET//LAB scores **Decision Quality** and the **Simulated Outcome** separately for exactly this reason.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Before entering, write down each plausible path, the trigger that would confirm it and the action you will take, and make sure you can accept the worst case. Then follow the plan, whichever path appears.",
      },
      { kind: "check", questionIds: ["q-sa-1", "q-sa-2", "q-sa-4"] },
    ],
    practice: [
      { kind: "arena", ref: "breakout", label: "Arena: breakout" },
      { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
      { kind: "check", ref: "scenario_analysis", label: "Knowledge check: scenario analysis" },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: "L16",
    title: "Volatility and adapting your size",
    topic: "risk_management",
    level: "intermediate",
    tier: "pro",
    minutes: 7,
    summary: "Measure how much price normally moves, set stops outside that noise and adjust position size so the risk in vUSD stays the same in calm and volatile markets.",
    objectives: [
      "Measure normal price movement with the average true range (ATR)",
      "Widen stops in volatile markets and reduce size to match",
      "Keep risk per trade constant across calm and volatile conditions",
    ],
    blocks: [
      {
        kind: "text",
        text: "**Volatility** is how far price typically moves in a given period. It changes over time: quiet phases alternate with busy ones. A stop distance that sits comfortably outside the noise in a calm market can sit right inside it in a volatile one, so neither a fixed stop distance nor a fixed size works in both.",
      },
      {
        kind: "figure",
        diagram: "volatility-regimes",
        caption: "The same stop distance in two markets: comfortably outside the noise when price is calm, well inside it when price is volatile.",
      },
      { kind: "heading", text: "Measuring normal movement" },
      {
        kind: "text",
        text: "A common yardstick is the **average true range (ATR)**: the average size of recent candles, measured from high to low and counting any gap from the previous close. If LABX's 14-candle ATR is 0.40, a typical candle covers about 0.40 vUSD. A stop beyond the invalidation level plus a fraction of the ATR is less likely to be hit by noise alone.",
      },
      { kind: "heading", text: "Constant risk, variable size" },
      {
        kind: "text",
        text: "When volatility rises, a sensible stop moves further from the entry. If the size stayed the same, the risk in vUSD would rise with it. Instead, keep the risk budget fixed and let the number of units fall. Your loss when wrong stays about the same; what changes is your **exposure**, the value of the position you hold.",
      },
      {
        kind: "example",
        title: "Calm versus volatile market",
        lines: [
          "Account 10,000.00 vUSD, risk 1% = 100.00 vUSD, entry 50.00 (ask).",
          "Calm: ATR 0.40. The pullback low plus a buffer puts the stop at 49.40, 0.60 below entry. 100.00 ÷ 0.60 = 166.67 → 166 units (risk 99.60, position 8,300.00).",
          "Volatile: ATR 1.20. Swings are wider, so the same logic puts the stop at 48.20, 1.80 below entry. 100.00 ÷ 1.80 = 55.56 → 55 units (risk 99.00, position 2,750.00).",
          "With 0.05% commission on entry and exit, the sizes fall to 153 and 54 units: costs take a bigger share when the stop is tight.",
        ],
        result: "The loss if wrong is about 100.00 vUSD in both markets. In the volatile one you hold about a third of the units.",
      },
      {
        kind: "interactive",
        widget: "position-size",
        title: "Same risk, two markets",
        prompt: "Set the account to 10,000.00, risk to 1% and entry to 50.00. Try a stop at 49.40, then at 48.20. Compare the units and the position value: the risk barely changes, but the exposure does.",
      },
      {
        kind: "points",
        items: [
          "Expect wider stops in volatile conditions and plan a smaller size before you enter.",
          "Check that the stop is beyond normal noise, not just beyond the level.",
          "The limit does not change with the market: 2% in the Arena's high-volatility scenario is still 2%.",
          "If a sensible stop is so wide that the size becomes too small to be worthwhile, waiting is a valid decision.",
          "Allow for gaps: around events price can jump past a stop, so the real loss can exceed 1R.",
        ],
      },
      {
        kind: "example",
        title: "When the stop is gapped",
        lines: [
          "Long 55 units from 50.00, stop 48.20. Planned loss: 55 × 1.80 = 99.00 vUSD before costs.",
          "An event pushes the next candle to open at 47.60. The stop becomes a market order and fills there.",
          "Actual loss: 55 × (50.00 − 47.60) = 55 × 2.40 = 132.00 vUSD.",
          "In R: 132.00 ÷ 99.00 = 1.33R.",
        ],
        result: "A gap can turn a 1R plan into a bigger loss. Keeping each trade's risk small is what makes that survivable.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Don't keep your usual size and squeeze the stop to fit a volatile market. A stop inside the noise turns ordinary swings into losses. Change the size, not the logic of the stop.",
      },
      { kind: "check", questionIds: ["q-rm-8", "q-rm-9", "q-rm-10"] },
    ],
    practice: [
      { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
      { kind: "arena", ref: "low_volatility", label: "Arena: low volatility" },
      { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: "L17",
    title: "Reviewing your decisions",
    topic: "decision_making",
    level: "beginner",
    tier: "free",
    minutes: 5,
    summary: "Review trades by the quality of each decision with the information you had at the time, not by whether they made money.",
    objectives: [
      "Separate the quality of a decision from the trade's outcome",
      "Use the journal and replay to review what you knew at each decision point",
      "Turn a review into one concrete rule to keep, add or change",
    ],
    blocks: [
      {
        kind: "text",
        text: "After a trade, the result is the loudest piece of information and often the least useful. One profit or loss owes a lot to chance. A useful review asks a different question: given what I knew at that moment, was the decision sound, and did I follow my plan?",
      },
      { kind: "heading", text: "Decision and outcome are different things" },
      {
        kind: "points",
        items: [
          "**Good decision, good outcome**: the plan worked. Note what made the decision sound so you can repeat it.",
          "**Good decision, bad outcome**: a sound plan, followed, that lost. A normal cost of trading; don't change the plan because of one result.",
          "**Bad decision, good outcome**: a broken rule that made money. The most dangerous case, because the profit rewards the habit.",
          "**Bad decision, bad outcome**: the loss came from the mistake. Name the rule that was broken.",
        ],
      },
      {
        kind: "figure",
        diagram: "decision-tree",
        caption: "Review with the same path you use to decide: at the moment of entry, was the setup present, were all conditions met, was the risk defined and within the limit? A 'no' at any step marks a decision to learn from, whatever the result.",
      },
      { kind: "heading", text: "Reviewing in MARKET//LAB" },
      {
        kind: "text",
        text: "The app keeps three scores apart. **Decision Quality** rates how sound your reasoning was with the information available at the time. **Risk Discipline** checks the rules: a stop on every entry, risk within the limit, no widened stops, no sizing up after a loss. The **Simulated Outcome** is the profit or loss. A profitable trade can still score poorly on the first two.",
      },
      {
        kind: "steps",
        items: [
          "Open the trade in the journal and replay it up to your first decision point.",
          "Note what you could see then: the setup, which conditions were met, the stop and the size.",
          "Compare the decision with your plan, condition by condition.",
          "Check Risk Discipline: stop placed at entry, risk within the limit, stop never widened.",
          "Use alternative decisions to compare what other reasonable choices would have done, without treating any single path as proof.",
          "Write one lesson: a rule to keep, add or change.",
        ],
      },
      {
        kind: "example",
        title: "A profitable mistake",
        lines: [
          "Plan: buy 50 units at 50.00, stop at 48.00. Risk: 50 × 2.00 = 100.00 vUSD, 1% of the account (before costs).",
          "Price dipped towards 48.00 and the stop was moved down to 47.00 to avoid being stopped out.",
          "New risk: 50 × 3.00 = 150.00 vUSD, 1.5% of the account.",
          "Price recovered and the trade was closed at 52.40: 50 × 2.40 = +120.00 vUSD.",
        ],
        result: "Outcome: +120.00 vUSD. Risk Discipline: the stop was widened and the risk went above the 1% limit. The lesson from the review is the broken rule, not the profit.",
      },
      {
        kind: "text",
        text: "Two biases distort reviews. **Hindsight bias** makes what happened feel obvious once you know it, so replay only the candles you could see at the time and judge the decision against that view. **Recency bias** gives the last few results more weight than they deserve, so look at decisions across many trades before changing a rule.",
      },
      {
        kind: "interactive",
        widget: "expectancy",
        title: "One result, many trades",
        prompt: "Set a win rate of 50%, an average win of 1.5R and an average loss of 1R. Expectancy is +0.25R per trade, yet half of all trades still lose. Judging the method by the last trade alone would be misleading.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Judge each decision by what you knew when you made it and whether you followed the plan. Judge outcomes only across many trades.",
      },
      { kind: "check", questionIds: ["q-dm-4", "q-dm-5", "q-dm-6"] },
    ],
    practice: [
      { kind: "mission", ref: "M10", label: "Mission: No Trade Is a Trade" },
      { kind: "mission", ref: "M07", label: "Mission: Stop or Stay?" },
      { kind: "check", ref: "decision_making", label: "Knowledge check: decision making" },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: "L18",
    title: "Handling losing streaks",
    topic: "psychology",
    level: "intermediate",
    tier: "pro",
    minutes: 6,
    summary: "Expect losing streaks as a normal part of any method, keep risk fixed through them and rely on pre-set pauses and reviews instead of reacting to the run.",
    objectives: [
      "Explain why losing streaks happen even with a positive expectancy",
      "Apply fixed risk and pre-set stopping rules during a streak",
      "Review a streak to tell bad luck from a broken process",
    ],
    blocks: [
      {
        kind: "text",
        text: "Any method that sometimes loses will sometimes lose several times in a row. A run of losses does not by itself mean the method is broken, just as a run of wins does not mean it is perfect. The real danger is the response: streaks invite exactly the decisions that turn a normal drawdown into a deep one.",
      },
      { kind: "heading", text: "Streaks are normal" },
      {
        kind: "example",
        title: "How likely is a run of losses?",
        lines: [
          "Method: wins 40% of trades at +2R, loses 60% at −1R. Expectancy: 0.40 × 2 − 0.60 × 1 = +0.20R per trade.",
          "Chance that five given trades in a row all lose: 0.6 × 0.6 × 0.6 × 0.6 × 0.6 = 7.8%.",
          "Chance of at least one run of five or more losses somewhere in 100 trades: about 98%.",
          "Chance of a run of eight or more in those 100 trades: about 49%.",
          "These figures assume each trade's result is independent of the last.",
        ],
        result: "For a method like this, a run of five losses is close to certain over 100 trades, even though its expectancy is positive.",
      },
      {
        kind: "figure",
        diagram: "loss-recovery",
        caption: "At 1% risk, eight losses in a row take 10,000.00 vUSD to 9,227.45 (−7.7%), which needs +8.4% to recover. Larger risk per trade pushes the same streak into the steep part of the curve.",
      },
      {
        kind: "interactive",
        widget: "expectancy",
        title: "Positive, but not smooth",
        prompt: "Set a win rate of 40%, an average win of 2R and an average loss of 1R. Expectancy is +0.20R per trade, or +20R over 100 trades, yet the same settings make a run of five losses close to certain along the way.",
      },
      { kind: "heading", text: "Where the damage really comes from" },
      {
        kind: "points",
        items: [
          "**Sizing up to win it back**: raises risk exactly when judgement is under strain, and counts against Risk Discipline.",
          "**Loosening the rules**: widening stops, or skipping them, to avoid 'yet another loss'.",
          "**Recency bias**: giving the last few results more weight than the whole record.",
          "**Method-hopping**: switching approach after every bad run, so no method ever gets enough trades to be judged.",
          "**Overcorrection**: becoming so cautious that you skip setups that meet every condition.",
        ],
      },
      { kind: "heading", text: "Rules for a streak, written in advance" },
      {
        kind: "steps",
        items: [
          "Keep risk per trade fixed as a percentage. You may reduce it during a drawdown (for example from 1% to 0.5%); never increase it to recover.",
          "Set a pause rule, for example: stop for the session after three losses in a row.",
          "Set a review trigger, for example: a full review once the account is 5% below its peak.",
          "In the review, sort each loss: a sound decision with a bad outcome, or a broken rule?",
          "Change the method only on evidence from many trades, never because of the streak alone.",
        ],
      },
      {
        kind: "text",
        text: "To tell bad luck from a broken process, look at the decisions rather than the profit and loss. If the journal shows complete setups, stops placed at entry and risk within the limit, the streak is most likely **variance**: the normal clustering of random results. If it shows skipped conditions, late entries or widened stops, the process is the problem, and the fix is a rule.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Decide how you will behave in a losing streak before it starts: fixed risk, a pause rule and a review trigger. During the streak, follow those rules rather than reacting to the run.",
      },
      { kind: "check", questionIds: ["q-psy-6", "q-psy-7", "q-psy-9"] },
    ],
    practice: [
      { kind: "mission", ref: "M07", label: "Mission: Stop or Stay?" },
      { kind: "arena", ref: "sideways", label: "Arena: sideways market" },
      { kind: "check", ref: "psychology", label: "Knowledge check: psychology" },
    ],
  },
];
