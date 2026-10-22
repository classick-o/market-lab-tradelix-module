import type { Question } from "../types";

/**
 * Knowledge-check questions for risk management, stop-losses, psychology,
 * decision making and scenario analysis. Numbers are in vUSD and exact.
 */
export const QUESTIONS_B: Question[] = [
  // ---------------------------------------------------------------------------
  // Risk management
  // ---------------------------------------------------------------------------
  {
    id: "q-rm-1",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does 'risk per trade' mean?",
    options: [
      { id: "a", label: "The total value of the position you buy", rationale: "That is the position's value, your exposure. Risk per trade is only the slice lost if the stop fills: units × distance to the stop, plus costs." },
      { id: "b", label: "The commission charged when you open the trade", rationale: "Commission is one part of the cost, not the risk. Risk per trade is the whole planned loss at the stop, costs included." },
      { id: "c", label: "The amount you would lose if price reaches your stop-loss, decided before you enter" },
      { id: "d", label: "The largest loss the market could ever cause", rationale: "That is closer to your full exposure. Risk per trade is a planned number: the loss at your stop, chosen before you enter." },
    ],
    correct: "c",
    explanation:
      "Risk per trade is the planned loss if the stop is hit, including costs. Position value is a different number: 100 units at 50.00 is a 5,000.00 vUSD position, but with the stop 1.00 away it risks about 100.00.",
    lesson: "L08",
    concepts: ["risk-per-trade"],
  },
  {
    id: "q-rm-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt:
      "In the Arena your account has fallen to 9,250.00 vUSD and the risk limit is 2% per trade. What is the most you may lose on the next trade, in vUSD? Give the answer to two decimal places.",
    numeric: { answer: 185, tolerance: 0.01, unit: "vUSD" },
    explanation:
      "The limit is a percentage of the current account: 9,250.00 × 2% = 185.00 vUSD. Using the starting 10,000.00 (200.00) would let the risk stay high while the account shrinks.",
    lesson: "L08",
    concepts: ["risk-per-trade", "fixed-fractional-sizing"],
    hints: [
      "Start from the account as it is now, not the 10,000.00 you began with.",
      "Risk budget = current account × risk limit.",
      "2% of 9,000.00 is 180.00. Now add 2% of the remaining 250.00.",
    ],
    vary: {
      fields: { acct: [8050, 9950, 50], pct: [1, 2, 1] },
      constraints: ["floor(acct / 1000) * 1000 != acct"],
      answer: "acct * pct / 100",
      prompt:
        "Your account has fallen to {acct:2} vUSD and the risk limit is {pct}% per trade. What is the most you may lose on the next trade, in vUSD? Give the answer to two decimal places.",
      explanation:
        "The limit is a percentage of the current account: {acct:2} × {pct}% = {answer:2} vUSD. Using the starting 10,000.00 ({100 * pct:2}) would let the risk stay high while the account shrinks.",
      hint: "{pct}% of {floor(acct / 1000) * 1000:2} is {floor(acct / 1000) * 10 * pct:2}. Now add {pct}% of the remaining {acct - floor(acct / 1000) * 1000:2}.",
    },
  },
  {
    id: "q-rm-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "After a run of losing trades, a trader's account is down from 10,000.00 to 9,700.00 vUSD. Their rule is 1% risk per trade. They feel sure the next setup will work and want to risk 3% on it to get back to even quickly.",
    prompt: "What is the most disciplined response?",
    options: [
      { id: "a", label: "Risk 3% once to get back to even, then return to 1%", rationale: "Wanting to get even fast is a normal urge, but sizing up after losses triples the next loss if this trade fails too. Feeling sure isn't in the rule." },
      { id: "b", label: "Risk 1% of the original 10,000.00, which is 100.00 vUSD", rationale: "Close, but the rule uses the current account: 1% of 9,700.00 is 97.00. The budget is meant to shrink during a drawdown." },
      { id: "c", label: "Skip the stop on this trade so a small dip cannot shake them out", rationale: "Without a stop there is no planned loss, so nothing to size to 1%, and entering without a stop counts against Risk Discipline." },
      { id: "d", label: "Keep risk at 1% of the current account: 9,700.00 × 1% = 97.00 vUSD" },
    ],
    correct: "d",
    explanation:
      "Sizing up after losses raises risk exactly when judgement is under pressure, and MARKET//LAB counts it against Risk Discipline. Risking 1% of the current account (97.00 vUSD) lets the budget shrink automatically during a drawdown; option b is close but ignores that the account is now smaller.",
    lesson: "L08",
    concepts: ["fixed-fractional-sizing", "drawdown"],
  },
  {
    id: "q-rm-4",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt:
      "A trade has its stop 1.00 vUSD below the entry and its target 3.00 vUSD above. What win rate does it need to break even, before costs? Answer in %, rounded to one decimal place.",
    numeric: { answer: 25, tolerance: 0.1, unit: "%" },
    explanation:
      "Break-even win rate = risk ÷ (risk + reward) = 1.00 ÷ 4.00 = 25.0%. At that rate one win of +3R exactly cancels three losses of −1R.",
    lesson: "L11",
    concepts: ["reward-to-risk", "expectancy"],
    hints: [
      "Break-even means the wins and losses cancel out over many trades.",
      "Break-even win rate = risk ÷ (risk + reward).",
      "Risk + reward = 1.00 + 3.00 = 4.00. Now divide the risk by that.",
    ],
    vary: {
      fields: { risk: [0.5, 2, 0.5], k: [1, 4, 0.5] },
      constraints: ["k != 3.5", "risk != 1 || k != 3"],
      answer: "round(100 * risk / (risk + risk * k), 1)",
      prompt:
        "A trade has its stop {risk:2} vUSD below the entry and its target {risk * k:2} vUSD above. What win rate does it need to break even, before costs? Answer in %, rounded to one decimal place.",
      explanation:
        "Break-even win rate = risk ÷ (risk + reward) = {risk:2} ÷ {risk + risk * k:2} = {answer:1}%. At that rate, wins of +{k:1}R exactly cancel losses of −1R over many trades.",
      hint: "Risk + reward = {risk:2} + {risk * k:2} = {risk + risk * k:2}. Now divide the risk by that.",
    },
  },
  {
    id: "q-rm-5",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt:
      "A method wins 45% of its trades with an average win of +1.8R and loses 55% with an average loss of −1R. What is its expectancy per trade, in R? Round to two decimal places.",
    numeric: { answer: 0.26, tolerance: 0.01, unit: "R" },
    explanation:
      "Expectancy = 0.45 × 1.8 − 0.55 × 1 = 0.81 − 0.55 = +0.26R per trade. It loses more often than it wins, but the wins are large enough to make the average positive.",
    lesson: "L11",
    concepts: ["expectancy"],
    hints: [
      "Weigh each outcome by how often it happens, then combine the two.",
      "Expectancy = win rate × average win − loss rate × average loss.",
      "Wins: 0.45 × 1.8 = 0.81R. Now subtract the losses' share.",
    ],
    vary: {
      fields: { w: [30, 60, 5], W: [1, 3, 0.1] },
      constraints: ["abs(w * W - round(w * W, 0)) < 0.001", "abs(round(w * W, 0) - (100 - w)) >= 5"],
      answer: "round((w * W - (100 - w)) / 100, 2)",
      prompt:
        "A method wins {w}% of its trades with an average win of +{W:1}R and loses {100 - w}% with an average loss of −1R. What is its expectancy per trade, in R? Round to two decimal places.",
      explanation: "Expectancy = {w / 100:2} × {W:1} − {(100 - w) / 100:2} × 1 = {w * W / 100:2} − {(100 - w) / 100:2} = {answer:2}R per trade.",
      hint: "Wins: {w / 100:2} × {W:1} = {w * W / 100:2}R. Now subtract the losses' share.",
    },
  },
  {
    id: "q-rm-6",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which statement about win rate is correct?",
    options: [
      { id: "a", label: "Win rate only means something together with the average win and the average loss" },
      { id: "b", label: "A method that wins 70% of the time must be profitable", rationale: "A high win rate can hide small wins. Winning 70% at +0.4R and losing 30% at −1R averages −0.02R per trade." },
      { id: "c", label: "Win rate is irrelevant; only the reward-to-risk ratio matters", rationale: "The ratio alone ignores how often the target is reached. Expectancy needs both: how often you win, and how big the wins and losses are." },
      { id: "d", label: "A higher reward-to-risk ratio always produces more profit", rationale: "Distant targets are usually reached less often. A higher ratio lowers the break-even win rate, but profit depends on the win rate you actually achieve." },
    ],
    correct: "a",
    explanation:
      "Expectancy combines both sides: winning 70% at +0.4R and losing 30% at −1R gives 0.28 − 0.30 = −0.02R per trade. A high win rate with small wins can still lose money, and a high ratio is useless if the target is rarely reached.",
    lesson: "L11",
    concepts: ["expectancy", "reward-to-risk"],
  },
  {
    id: "q-rm-7",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "Over your last 20 trades you won 8 and lost 12. You risked 100.00 vUSD (1R) on each one. Your wins averaged +250.00 vUSD and your losses averaged −100.00 vUSD.",
    prompt: "What was the expectancy per trade in R over this sample, and how should you treat it?",
    options: [
      { id: "a", label: "−0.20R: the method is losing because most trades lost", rationale: "Counting losses misses their size. The 8 wins at +2.5R outweigh the 12 losses at −1R: +800.00 vUSD in total, so the average is positive." },
      { id: "b", label: "+0.40R: encouraging, but 20 trades is a small sample to judge a method on" },
      { id: "c", label: "+2.50R: the average win is what counts", rationale: "+2.5R is only the average win. Expectancy also weighs how often you win and subtracts the losses: 0.40 × 2.5 − 0.60 × 1." },
      { id: "d", label: "+0.40R: this proves the method will keep earning 0.40R per trade", rationale: "The arithmetic is right, but 20 trades is a small sample. A few lucky or unlucky results can move it; treat it as evidence, not proof." },
    ],
    correct: "b",
    explanation:
      "0.40 × 2.5R − 0.60 × 1R = +0.40R per trade (8 × 250.00 − 12 × 100.00 = +800.00 vUSD, or 8R over 20 trades). The sign is encouraging, but a few lucky or unlucky results can distort 20 trades, so it is evidence, not proof.",
    lesson: "L11",
    concepts: ["expectancy", "r-multiple"],
    hints: [
      "Put everything in R first: divide each vUSD figure by the 100.00 you risked.",
      "Expectancy = win rate × average win − loss rate × average loss.",
      "Win rate: 8 ÷ 20 = 40%. Average win: 250.00 ÷ 100.00 = +2.5R.",
    ],
  },
  {
    id: "q-rm-8",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 1,
    prompt:
      "Volatility doubles and the stop that invalidates your idea is now twice as far from the entry as usual. To keep the same risk in vUSD, what should happen to your position size?",
    options: [
      { id: "a", label: "Double it", rationale: "Twice the units over twice the distance makes the loss at the stop four times bigger. A wider stop needs fewer units, not more." },
      { id: "b", label: "Keep it the same", rationale: "The same units over twice the distance doubles the loss at the stop. Units = risk budget ÷ distance, so the units must fall." },
      { id: "c", label: "Halve it" },
      { id: "d", label: "It doesn't matter as long as there is a stop", rationale: "A stop caps the loss only at the size you chose. Loss at the stop = units × distance, so the size still has to fit the budget." },
    ],
    correct: "c",
    explanation:
      "Units = risk budget ÷ distance to stop. If the distance doubles, the units must halve to keep the loss the same; keeping the same size would double the risk.",
    lesson: "L16",
    concepts: ["position-sizing", "volatility"],
  },
  {
    id: "q-rm-9",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "You are in the Arena with 10,000.00 vUSD and a 2% risk limit. LABX is in a high-volatility phase. You plan to buy at 40.00, and the level that invalidates your idea puts the stop at 37.50.",
    prompt: "What is the largest whole number of units that keeps the risk within the limit, before costs?",
    options: [
      { id: "a", label: "40 units", rationale: "That uses a 100.00 budget, the 1% mission limit. The Arena allows 2%, 200.00, and high volatility doesn't change the limit." },
      { id: "b", label: "80 units" },
      { id: "c", label: "200 units", rationale: "200.00 is the risk budget in vUSD, not a number of units. Divide it by the 2.50 distance: 200 units would lose 500.00 at the stop." },
      { id: "d", label: "500 units", rationale: "That multiplies the budget by the distance, 200.00 × 2.50. Units = budget ÷ distance; 500 units would lose 1,250.00 at the stop." },
    ],
    correct: "b",
    explanation:
      "The budget is 10,000.00 × 2% = 200.00 vUSD and the distance is 40.00 − 37.50 = 2.50, so 200.00 ÷ 2.50 = 80 units. 40 units uses the 1% mission limit instead; including commission on both fills, the cost-aware size would be 78 units.",
    lesson: "L16",
    concepts: ["risk-per-trade", "position-sizing"],
    hints: [
      "Start from the Arena limit; volatility changes the stop, not the limit.",
      "Units = risk budget ÷ (entry − stop), rounded down.",
      "Budget: 10,000.00 × 2% = 200.00. Distance: 40.00 − 37.50 = 2.50.",
    ],
  },
  {
    id: "q-rm-10",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 3,
    prompt:
      "You are long 60 units bought at 25.00 with a stop at 24.00, so the planned risk is 60.00 vUSD (1R) before costs. An event makes the next candle open at 23.40, and your stop fills there. How large is the loss in R, before costs? Give a positive number rounded to two decimal places.",
    numeric: { answer: 1.6, tolerance: 0.01, unit: "R" },
    explanation:
      "The loss is 60 × (25.00 − 23.40) = 96.00 vUSD, and 96.00 ÷ 60.00 = 1.60R. A stop becomes a market order, so a gap through it fills at the open, beyond the planned 1R.",
    lesson: "L16",
    concepts: ["r-multiple", "gap-risk"],
    hints: [
      "Check where the stop actually filled: a gapped stop fills at the open.",
      "Loss in R = actual loss ÷ planned risk (1R).",
      "Actual loss = 60 × (25.00 − 23.40) = 96.00 vUSD. Now divide by 60.00.",
    ],
    vary: {
      fields: { n: [20, 100, 10], entry: [20, 120, 0.5], d: [0.5, 2.5, 0.5], g: [0.1, 1.5, 0.1] },
      constraints: ["d != 1.5", "g <= d", "n * d <= 200", "n * entry <= 10000"],
      answer: "round((d + g) / d, 2)",
      prompt:
        "You are long {n} units bought at {entry:2} with a stop at {entry - d:2}, so the planned risk is {n * d:2} vUSD (1R) before costs. An event makes the next candle open at {entry - d - g:2}, and your stop fills there. How large is the loss in R, before costs? Give a positive number rounded to two decimal places.",
      explanation:
        "The loss is {n} × ({entry:2} − {entry - d - g:2}) = {n * (d + g):2} vUSD, and {n * (d + g):2} ÷ {n * d:2} = {answer:2}R. A stop becomes a market order, so a gap through it fills at the open, beyond the planned 1R.",
      hint: "Actual loss = {n} × ({entry:2} − {entry - d - g:2}) = {n * (d + g):2} vUSD. Now divide by {n * d:2}.",
    },
  },
  {
    id: "q-rm-11",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt:
      "An account falls from 10,000.00 to 7,000.00 vUSD. What percentage gain on 7,000.00 is needed to get back to 10,000.00? Answer in %, rounded to one decimal place.",
    numeric: { answer: 42.9, tolerance: 0.1, unit: "%" },
    explanation:
      "The account needs 3,000.00 more, earned on 7,000.00: 3,000.00 ÷ 7,000.00 = 42.9%. A 30% loss needs a much larger gain than 30% because the recovery starts from a smaller base.",
    lesson: "L08",
    concepts: ["drawdown"],
    hints: [
      "The gain is earned on the smaller account, not on the 10,000.00.",
      "Gain needed = amount lost ÷ account after the loss × 100.",
      "Amount lost: 10,000.00 − 7,000.00 = 3,000.00. Divide it by 7,000.00.",
    ],
    vary: {
      fields: { dd: [5, 60, 5] },
      constraints: ["dd != 10 && dd != 20 && dd != 30 && dd != 50 && dd != 55"],
      answer: "round(100 * (100 * dd) / (10000 - 100 * dd), 1)",
      prompt:
        "An account falls from 10,000.00 to {10000 - 100 * dd:2} vUSD. What percentage gain on {10000 - 100 * dd:2} is needed to get back to 10,000.00? Answer in %, rounded to one decimal place.",
      explanation:
        "The account needs {100 * dd:2} more, earned on {10000 - 100 * dd:2}: {100 * dd:2} ÷ {10000 - 100 * dd:2} = {answer:1}%. A {dd}% loss needs a larger gain than {dd}% because the recovery starts from a smaller base.",
      hint: "Amount lost: 10,000.00 − {10000 - 100 * dd:2} = {100 * dd:2}. Divide it by {10000 - 100 * dd:2}.",
    },
  },
  {
    id: "q-rm-12",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 1,
    prompt: "You risked 80.00 vUSD (1R) on a trade and closed it for a profit of 140.00 vUSD. What is the result in R? Round to two decimal places.",
    numeric: { answer: 1.75, tolerance: 0.01, unit: "R" },
    explanation:
      "R multiple = result ÷ amount risked: 140.00 ÷ 80.00 = +1.75R. Measuring in R makes trades of different sizes comparable: the same +1.75R on a 100.00 risk would be 175.00 vUSD.",
    lesson: "L11",
    concepts: ["r-multiple"],
    hints: [
      "Compare the result with what you risked, not with the account.",
      "R multiple = result in vUSD ÷ 1R.",
      "80.00 × 1 = 80.00, leaving 60.00. What fraction of 80.00 is 60.00?",
    ],
    vary: {
      fields: { oneR: [50, 100, 5], m: [1.25, 3, 0.25] },
      constraints: ["oneR == 50 || oneR == 60 || oneR == 75 || oneR == 80 || oneR == 100", "m != floor(m)"],
      answer: "m",
      prompt: "You risked {oneR:2} vUSD (1R) on a trade and closed it for a profit of {oneR * m:2} vUSD. What is the result in R? Round to two decimal places.",
      explanation: "R multiple = result ÷ amount risked: {oneR * m:2} ÷ {oneR:2} = +{answer:2}R. Measuring in R makes trades of different sizes comparable.",
      hint: "{oneR:2} × {floor(m)} = {oneR * floor(m):2}, leaving {oneR * (m - floor(m)):2}. What fraction of {oneR:2} is {oneR * (m - floor(m)):2}?",
    },
  },

  // ---------------------------------------------------------------------------
  // Stop-loss
  // ---------------------------------------------------------------------------
  {
    id: "q-sl-1",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 1,
    prompt: "Where does a stop-loss belong?",
    options: [
      { id: "a", label: "At a round number close to the entry", rationale: "A round number says nothing about whether the idea still holds, and close to the entry it usually sits inside normal noise." },
      { id: "b", label: "At whatever distance allows the largest position", rationale: "That reverses the order: the stop comes from the idea, then the size from the stop. A stop placed for size usually sits inside the noise." },
      { id: "c", label: "Where the trade idea would be proven wrong, plus a small buffer for noise" },
      { id: "d", label: "Wherever the loss would feel bearable", rationale: "Sizing already handles the loss in vUSD. The stop's place comes from the chart: where the reason for the trade no longer holds." },
    ],
    correct: "c",
    explanation:
      "A stop marks the point where the reason for the trade no longer holds. Round numbers, comfortable amounts or the size you wanted have nothing to do with whether the idea is still valid; the size is adjusted to the stop, not the other way round.",
    lesson: "L10",
    concepts: ["invalidation-level", "stop-loss-order"],
  },
  {
    id: "q-sl-2",
    topic: "stop_loss",
    kind: "numeric",
    difficulty: 2,
    prompt:
      "Your account is 10,000.00 vUSD and you risk 1% per trade. You buy at 32.00 with the stop at 30.80. How many whole units can you buy, before costs? Round down to a whole number.",
    numeric: { answer: 83, tolerance: 0, unit: "units" },
    explanation:
      "The budget is 100.00 vUSD and the distance is 32.00 − 30.80 = 1.20, so 100.00 ÷ 1.20 = 83.33, rounded down to 83 units. Rounding up to 84 would risk 100.80, just over the limit.",
    lesson: "L10",
    concepts: ["position-sizing", "stop-loss-order"],
    hints: [
      "The stop is fixed by the chart; the number of units is what you adjust.",
      "Units = risk budget ÷ (entry − stop), rounded down.",
      "Budget: 10,000.00 × 1% = 100.00. Distance: 32.00 − 30.80 = 1.20.",
    ],
    vary: {
      fields: { entry: [20, 80, 0.1], d: [0.6, 3, 0.1] },
      constraints: ["10000 / round(d * 100, 0) != floor(10000 / round(d * 100, 0))", "floor(10000 / round(d * 100, 0)) * entry <= 10000"],
      answer: "floor(10000 / round(d * 100, 0))",
      prompt:
        "Your account is 10,000.00 vUSD and you risk 1% per trade. You buy at {entry:2} with the stop at {entry - d:2}. How many whole units can you buy, before costs? Round down to a whole number.",
      explanation:
        "The budget is 100.00 vUSD and the distance is {entry:2} − {entry - d:2} = {d:2}, so 100.00 ÷ {d:2} = {100 / d:2}, rounded down to {answer} units. Rounding up to {answer + 1} would risk {(answer + 1) * d:2}, just over the limit.",
      hint: "Budget: 10,000.00 × 1% = 100.00. Distance: {entry:2} − {entry - d:2} = {d:2}.",
    },
  },
  {
    id: "q-sl-3",
    topic: "stop_loss",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "You bought LABX at 50.00 because support at 48.40 held. Your stop is at 48.00, below that support. Price drops to 48.50 and the trade now shows a loss.",
    prompt: "What does your plan say to do?",
    options: [
      { id: "a", label: "Leave the stop at 48.00: support has not failed yet, and the stop will act if it does" },
      { id: "b", label: "Move the stop to 47.00 to give the trade more room", rationale: "Wanting to avoid the loss is natural, but moving the stop further away raises the loss you agreed to while the idea hasn't changed. It counts against Risk Discipline." },
      { id: "c", label: "Buy more units at 48.50 to lower the average entry price", rationale: "Adding units to a trade going against you raises the risk above the planned 1R, with no new setup behind it." },
      { id: "d", label: "Remove the stop and decide at the end of the session", rationale: "Without a stop the loss has no limit, and the decision moves to when you're under most pressure. The stop already sits where the idea fails." },
    ],
    correct: "a",
    explanation:
      "Price is close to support, but the idea has not been invalidated, and the stop already sits where it would be. Widening it to 47.00 raises the agreed risk and breaks Risk Discipline; adding units adds risk to a trade that is going against you.",
    lesson: "L10",
    concepts: ["invalidation-level", "loss-aversion"],
  },
  {
    id: "q-sl-4",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why is a stop placed exactly on an obvious support level often a poor choice?",
    options: [
      { id: "a", label: "Obvious levels are often briefly tested, so a stop right on the level can be hit even if support holds" },
      { id: "b", label: "Stops cannot be placed at support levels", rationale: "A stop can go at any price. The trouble is that one sitting right on an obvious level is easily touched while support still holds." },
      { id: "c", label: "Support levels never break, so the stop is wasted", rationale: "Support zones fail regularly; that's why the stop exists. Put it just beyond the level, so it acts when support really breaks." },
    ],
    correct: "a",
    explanation:
      "Many traders watch the same obvious price, and it is common for price to poke through it briefly before turning. A small buffer beyond the level means the stop is hit when support really fails, not when it is merely tested.",
    lesson: "L10",
    concepts: ["invalidation-level", "support-and-resistance"],
  },
  {
    id: "q-sl-5",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 1,
    prompt: "In MARKET//LAB, what happens when price touches your stop-loss?",
    options: [
      { id: "a", label: "A limit order is placed at the stop price and is guaranteed to fill there", rationale: "A stop is not a limit order. It becomes a market order when touched, so the fill can be worse than the stop, especially after a gap." },
      { id: "b", label: "It becomes a market order and fills at the next available price" },
      { id: "c", label: "Nothing, until you confirm the exit", rationale: "The stop acts on its own; that's its job. It turns 'I was wrong' into an exit without a debate, even when you aren't watching." },
    ],
    correct: "b",
    explanation:
      "A stop-loss becomes a market order when touched, so the fill can be slightly worse than the stop price, and much worse if price gaps through it. It limits the loss in normal conditions but is not a guaranteed price.",
    lesson: "L10",
    concepts: ["stop-loss-order", "slippage"],
  },
  {
    id: "q-sl-6",
    topic: "stop_loss",
    kind: "numeric",
    difficulty: 3,
    prompt:
      "You hold 40 units bought at 75.00 with a stop at 73.50. The next candle opens at 72.90, gapping through the stop, and the stop fills at the open. How much do you lose, in vUSD, before costs? Give the answer to two decimal places.",
    numeric: { answer: 84, tolerance: 0.01, unit: "vUSD" },
    explanation:
      "The fill is at the open, 72.90, so the loss is 40 × (75.00 − 72.90) = 40 × 2.10 = 84.00 vUSD instead of the planned 40 × 1.50 = 60.00. A gap fills at the open, not at the stop price.",
    lesson: "L10",
    concepts: ["gap-risk", "stop-loss-order"],
    hints: [
      "Ask where the stop actually filled, not where it was placed.",
      "Loss = units × (entry − fill price).",
      "The fill is the open, 72.90. Per unit: 75.00 − 72.90 = 2.10.",
    ],
    vary: {
      fields: { n: [20, 80, 5], entry: [30, 120, 0.5], d: [1, 3, 0.25], g: [0.2, 1.5, 0.1] },
      constraints: ["n * d <= 100", "n * entry <= 10000", "g <= d"],
      answer: "round(n * (d + g), 2)",
      prompt:
        "You hold {n} units bought at {entry:2} with a stop at {entry - d:2}. The next candle opens at {entry - d - g:2}, gapping through the stop, and the stop fills at the open. How much do you lose, in vUSD, before costs? Give the answer to two decimal places.",
      explanation:
        "The fill is at the open, {entry - d - g:2}, so the loss is {n} × ({entry:2} − {entry - d - g:2}) = {n} × {d + g:2} = {answer:2} vUSD instead of the planned {n} × {d:2} = {n * d:2}. A gap fills at the open, not at the stop price.",
      hint: "The fill is the open, {entry - d - g:2}. Per unit: {entry:2} − {entry - d - g:2} = {d + g:2}.",
    },
  },
  {
    id: "q-sl-7",
    topic: "stop_loss",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "You have a 10,000.00 vUSD account and a 1% risk limit. You want to buy LABX at 50.00. The idea is wrong if price breaks below support at 48.40, and normal swings over a few candles reach about 0.80. You would prefer a stop at 49.50, because it allows 200 units. Ignore costs.",
    prompt: "What is the better approach?",
    options: [
      { id: "a", label: "Keep the stop at 49.50: more units means a bigger gain if it works", rationale: "That stop sits above the level where the idea fails, inside normal noise, so ordinary swings can end a sound idea. The size follows the stop, not the reverse." },
      { id: "b", label: "Put the stop at 48.00 and keep 200 units", rationale: "Right stop, wrong size: 200 × 2.00 = 400.00 vUSD, 4% of the account. When the stop moves further out, the units must fall." },
      { id: "c", label: "Skip the stop and watch the trade closely instead", rationale: "Watching is not a limit. Without a stop the loss has no cap and you can't size to 1%; entering without a stop counts against Risk Discipline." },
      { id: "d", label: "Put the stop beyond 48.40, at about 48.00, and buy 50 units for the same 100.00 vUSD risk" },
    ],
    correct: "d",
    explanation:
      "A stop at 49.50 sits inside normal noise, well above where the idea fails. Placing it beyond 48.40 and sizing to 100.00 ÷ 2.00 = 50 units keeps the risk at 1%; keeping 200 units with that stop would risk 400.00 vUSD, or 4%.",
    lesson: "L10",
    concepts: ["invalidation-level", "position-sizing"],
    hints: [
      "Decide where the idea fails before thinking about the size.",
      "The stop goes just beyond the invalidation level; then units = risk budget ÷ (entry − stop).",
      "The idea fails below 48.40, so the stop sits near 48.00, 2.00 below the 50.00 entry.",
    ],
  },
  {
    id: "q-sl-8",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which change to the stop on an open long trade counts against Risk Discipline in MARKET//LAB?",
    options: [
      { id: "a", label: "Leaving the stop where you planned it", rationale: "That's the plan working. A stop is a decision you made with a clear head; keeping it never counts against Risk Discipline." },
      { id: "b", label: "Moving the stop up, closer to price, after the trade has moved in your favour", rationale: "On a long, moving the stop up reduces the risk; that's trailing, which only moves in the trade's favour. The rule targets moves that add risk." },
      { id: "c", label: "Moving the stop down, further from the entry, to avoid being stopped out" },
    ],
    correct: "c",
    explanation:
      "Widening a stop increases the loss you agreed to before entering, which is exactly what the risk rules exist to prevent. Moving a long trade's stop up reduces the risk, so it does not break the rule.",
    lesson: "L10",
    concepts: ["stop-loss-order", "trailing-stop"],
  },
  {
    id: "q-sl-9",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 2,
    prompt:
      "When planning your next trade in a volatile phase, your usual stop distance would sit inside the normal range of a single candle. What is the better adjustment?",
    options: [
      { id: "a", label: "Keep the usual distance and accept more stop-outs", rationale: "A stop inside one candle's normal range is hit by noise, not by the idea failing. Stop-outs on sound ideas are a cost you can avoid." },
      { id: "b", label: "Place the stop beyond the noise and reduce the size so the risk in vUSD stays the same" },
      { id: "c", label: "Keep the usual distance and increase the size to make up for the stop-outs", rationale: "The stop stays inside the noise and every trade risks more. A bigger size doesn't fix a misplaced stop; it makes each stop-out costlier." },
      { id: "d", label: "Trade without a stop until volatility calms down", rationale: "Volatile phases are when a stop matters most: without one the loss has no limit, and gaps are more likely. Change the size, not the stop." },
    ],
    correct: "b",
    explanation:
      "A stop inside ordinary noise gets hit by random swings even when the idea is still valid. Placing it beyond the noise and cutting the units keeps the loss when wrong unchanged; trading without a stop leaves the loss unlimited.",
    lesson: "L16",
    concepts: ["volatility", "invalidation-level"],
  },
  {
    id: "q-sl-10",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which description fits a trailing stop?",
    options: [
      { id: "a", label: "It only ever moves in the trade's favour, following a rule set before entry" },
      { id: "b", label: "It moves further from price to give a winning trade more room", rationale: "Moving a stop away from price is widening it, even on a winning trade. It raises the loss you agreed to; a trailing stop only ever reduces it." },
      { id: "c", label: "It is moved whenever the trade feels at risk", rationale: "A trailing stop follows a rule written before entry, such as new higher lows. Moving it by feel tends to trail too tightly and turn pullbacks into exits." },
      { id: "d", label: "It is removed once the trade shows a profit", rationale: "A profitable trade can still turn and give back the gain. A trailing stop moves up to protect part of it; it is never removed." },
    ],
    correct: "a",
    explanation:
      "A trailing stop follows a profitable trade, for example under each new higher low, and never moves further away. Its rule belongs in the plan before entry; moving a stop away from price is widening it, not trailing it.",
    lesson: "L10",
    concepts: ["trailing-stop", "stop-loss-order"],
  },
  {
    id: "q-sl-11",
    topic: "stop_loss",
    kind: "numeric",
    difficulty: 2,
    prompt:
      "You bought 50 LABX at 60.00 with the stop at 58.00, risking 100.00 vUSD (1R). Price climbs to 64.10 and forms a higher low at 62.70, so you trail the stop to 62.50. If this stop fills, what is the result in R, before costs? Round to two decimal places.",
    numeric: { answer: 1.25, tolerance: 0.01, unit: "R" },
    explanation:
      "If the trailed stop fills at 62.50, the trade closes at 50 × (62.50 − 60.00) = +125.00 vUSD, and 125.00 ÷ 100.00 = +1.25R. Trailing turned the worst planned outcome from −1R into a gain, unless a gap jumps the stop.",
    lesson: "L10",
    concepts: ["trailing-stop", "r-multiple"],
    hints: [
      "R is always measured against the original risk, 100.00 vUSD.",
      "Result in R = (exit − entry) × units ÷ 1R.",
      "Per unit: 62.50 − 60.00 = 2.50. Times 50 units = 125.00 vUSD.",
    ],
    vary: {
      fields: { n: [20, 50, 5], entry: [40, 120, 1], d: [1, 2.5, 0.5], t: [0.5, 4, 0.25], rise: [0.8, 2, 0.1] },
      constraints: [
        "n == 20 || n == 25 || n == 40 || n == 50",
        "d != 1.5",
        "n * d <= 100",
        "n * entry <= 10000",
        "100 * t / d == round(100 * t / d, 0)",
        "t > 0",
      ],
      answer: "round(t / d, 2)",
      prompt:
        "You bought {n} LABX at {entry:2} with the stop at {entry - d:2}, risking {n * d:2} vUSD (1R). Price climbs to {entry + t + 0.2 + rise:2} and forms a higher low at {entry + t + 0.2:2}, so you trail the stop to {entry + t:2}. If this stop fills, what is the result in R, before costs? Round to two decimal places.",
      explanation:
        "If the trailed stop fills at {entry + t:2}, the trade closes at {n} × ({entry + t:2} − {entry:2}) = +{n * t:2} vUSD, and {n * t:2} ÷ {n * d:2} = +{answer:2}R. Trailing turned the worst planned outcome from −1R into a gain, unless a gap jumps the stop.",
      hint: "Per unit: {entry + t:2} − {entry:2} = {t:2}. Times {n} units = {n * t:2} vUSD.",
    },
  },

  // ---------------------------------------------------------------------------
  // Psychology
  // ---------------------------------------------------------------------------
  {
    id: "q-psy-1",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "What best describes FOMO in trading?",
    options: [
      { id: "a", label: "Waiting until every condition in your plan is met", rationale: "That's following the plan, the opposite of FOMO. With FOMO, the move itself decides, before any setup is present." },
      { id: "b", label: "Entering because price is already moving fast and you fear being left out, rather than because your setup is present" },
      { id: "c", label: "Placing a stop-loss before entering", rationale: "That's a disciplined habit. FOMO entries tend to have the stop far away or missing, because the move made the decision." },
      { id: "d", label: "Reducing size in a volatile market", rationale: "That's sizing from the stop in a volatile phase, a planned choice. FOMO is the urge to enter because price is already running." },
    ],
    correct: "b",
    explanation:
      "FOMO (fear of missing out) makes the move itself the reason to enter. The entry tends to be late, the stop far away or missing, and no setup from the plan is involved; the other options describe disciplined behaviour.",
    lesson: "L13",
    concepts: ["fomo"],
  },
  {
    id: "q-psy-2",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "LABX has just risen 6% in four candles. You had no plan for this move and have no position. Price is far above any level where a stop would make sense, and a voice in your head says: 'it's going higher, get in now'.",
    prompt: "What is the process-based response?",
    options: [
      { id: "a", label: "Buy now with a large size so the move pays off", rationale: "The urge to catch the move is normal, but here the move is deciding. With no sensible stop nearby, a large size could break the risk limit." },
      { id: "b", label: "Buy now and decide where the stop goes later", rationale: "The stop is the decision that belongs before entry. Entering without one leaves the loss open; decide where you're wrong first." },
      { id: "c", label: "Sell short, because a move that strong must come back down", rationale: "That's the same impulse in the other direction: a forecast drawn from the move, not a setup from your plan." },
      { id: "d", label: "Don't chase: write down what setup would make a trade valid, and wait for it" },
    ],
    correct: "d",
    explanation:
      "Chasing means entering because of the move, with no sensible stop nearby. Writing down a valid setup, for example a pullback that holds, turns the urge into a plan; shorting 'because it must come down' is the same impulse in the other direction.",
    lesson: "L13",
    concepts: ["fomo"],
  },
  {
    id: "q-psy-3",
    topic: "psychology",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which behaviour is a typical sign of loss aversion?",
    options: [
      { id: "a", label: "Closing a trade at the planned stop", rationale: "That's the opposite: taking the planned loss is part of the plan working. Loss aversion shows up as avoiding that exit." },
      { id: "b", label: "Risking the same percentage on every trade", rationale: "Fixed risk is a rule decided in advance, not a bias. Loss aversion shows up when a loss is about to become real." },
      { id: "c", label: "Widening the stop on a losing trade to avoid taking the loss" },
    ],
    correct: "c",
    explanation:
      "Loss aversion makes a loss feel worse than a gain of the same size feels good, so traders avoid making the loss real by moving the stop. That turns a planned 1R loss into a larger one; the other two options are the plan working.",
    lesson: "L13",
    concepts: ["loss-aversion"],
  },
  {
    id: "q-psy-4",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "You were stopped out for −100.00 vUSD a few minutes ago and feel the market 'owes' you. A setup appears that meets two of your three playbook conditions, and you consider entering with three times your usual size.",
    prompt: "What is happening, and what should you do?",
    options: [
      { id: "a", label: "It's confidence: after a loss a win is due, so a bigger size makes sense", rationale: "Past results don't make a win due; each trade stands on its own. Sizing up after a loss is how one planned loss becomes several." },
      { id: "b", label: "It's revenge trading: pause and skip it, because the setup is incomplete and the size breaks your rule" },
      { id: "c", label: "Enter at normal size: two out of three conditions is close enough", rationale: "Normal size fixes the risk, not the setup. Every condition must be met; with one missing, the plan says no trade." },
      { id: "d", label: "Enter at triple size with a stop three times tighter, so the risk in vUSD stays the same", rationale: "The risk in vUSD matches, but a stop squeezed to fit the size sits inside the noise. And the setup is still incomplete." },
    ],
    correct: "b",
    explanation:
      "Wanting to win back a loss quickly, with a bigger size, is revenge trading, and a win is never 'due' after a loss. An incomplete setup is no trade at any size, and squeezing the stop to fit a bigger size just puts it inside the noise.",
    lesson: "L13",
    concepts: ["revenge-trading"],
  },
  {
    id: "q-psy-5",
    topic: "psychology",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which approach counters emotional trading decisions most directly?",
    options: [
      { id: "a", label: "Trading more often to get used to losing", rationale: "More trades mean more costs and more decisions under pressure; that's overtrading. Rules made in advance reduce what you decide in the moment." },
      { id: "b", label: "Watching prices more closely during the session", rationale: "Closer watching tends to feed urges rather than calm them. The countermeasures that work are decided before the session starts." },
      { id: "c", label: "Rules written before the session, a fixed risk per trade and a pause after losses" },
      { id: "d", label: "Acting on the strongest feeling about the next move", rationale: "A strong urge to act now isn't evidence the trade is good. Treat it as the signal to slow down and run the checklist." },
    ],
    correct: "c",
    explanation:
      "Emotions are strongest in the moment, so the most reliable countermeasures are decided in advance and leave little to decide under pressure. Watching prices more closely tends to feed urges rather than calm them.",
    lesson: "L13",
    concepts: ["trading-plan", "revenge-trading"],
  },
  {
    id: "q-psy-6",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "A method with a positive expectancy has just lost five trades in a row. What does that tell you on its own?",
    options: [
      { id: "a", label: "Not much: streaks happen even with a positive expectancy, so check whether the decisions followed the plan" },
      { id: "b", label: "The method has stopped working and should be replaced at once", rationale: "A streak alone can't separate bad luck from a broken method. Switching after every bad run means no method gets enough trades to be judged." },
      { id: "c", label: "A win is now due, so the next trade should be larger", rationale: "Each trade's result is independent; losses don't make a win due. Sizing up after losses raises risk exactly when judgement is under strain." },
    ],
    correct: "a",
    explanation:
      "For example, a method that wins 40% of the time is very likely to have a run of five losses somewhere in 100 trades. A streak alone can't separate bad luck from a broken method, and past losses do not make a win 'due', so the next trade should be sized as usual.",
    lesson: "L18",
    concepts: ["drawdown", "expectancy"],
  },
  {
    id: "q-psy-7",
    topic: "psychology",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "Your written plan says: risk 1% per trade, stop for the session after three losses in a row, and do a full review after a 5% drawdown. You have just had your third loss in a row. A clean setup that meets every playbook condition appears.",
    prompt: "What should you do?",
    options: [
      { id: "a", label: "Take it: the setup is valid, so the session rule doesn't apply", rationale: "The pause rule has no exception for good setups; right after a streak, every setup can look good. Valid setups will come again." },
      { id: "b", label: "Take it at 2% to recover the losses faster", rationale: "Raising risk to recover is sizing up after a loss, which counts against Risk Discipline. It also breaks the pause rule." },
      { id: "c", label: "Follow the session rule: stop for now, journal the three trades and look again next session" },
      { id: "d", label: "Take it, but without a stop so it can't become a fourth loss", rationale: "No stop doesn't prevent a loss; it removes the limit on it. And the session rule says stop for now, whatever the setup." },
    ],
    correct: "c",
    explanation:
      "Pause rules are written in advance because judgement is least reliable straight after a streak. Valid setups will come again; breaking the rule because 'this one is good' is the habit the rule exists to stop, and raising risk to recover breaks Risk Discipline.",
    lesson: "L18",
    concepts: ["revenge-trading", "trading-plan"],
    hints: [
      "Your written plan already covers this moment. Find the rule that applies.",
      "Rules written in advance apply whatever the next setup looks like; that is why they're written before the streak.",
      "You've just had your third loss in a row, so the session rule is now in force.",
    ],
  },
  {
    id: "q-psy-8",
    topic: "psychology",
    kind: "mcq",
    difficulty: 2,
    prompt:
      "After four winning trades, a trader starts skipping the checklist because 'I can read this market now'. Which bias is this most closely linked to?",
    options: [
      { id: "a", label: "Loss aversion", rationale: "Loss aversion is about avoiding a loss, such as widening a stop. Here the trigger is a winning run that makes skill feel bigger than it is." },
      { id: "b", label: "Sunk cost", rationale: "Sunk cost is holding on because of what's already lost. Nothing is lost here; four wins are being given more weight than four trades can carry." },
      { id: "c", label: "FOMO", rationale: "FOMO is entering because a move is running without you. Here the checklist is skipped because recent wins feel like proof of skill." },
      { id: "d", label: "Recency bias: four recent wins given more weight than they can carry" },
    ],
    correct: "d",
    explanation:
      "A short winning run makes skill feel larger than four trades can show, and recency gives those wins too much weight. The checklist matters just as much after wins as after losses.",
    lesson: "L18",
    concepts: ["base-rates", "trading-plan"],
  },
  {
    id: "q-psy-9",
    topic: "psychology",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "You have lost 6 of your last 8 trades. The journal shows that all 8 met every playbook condition, each risked 1% with a stop placed at entry, and no stop was moved.",
    prompt: "What is the most reasonable conclusion?",
    options: [
      { id: "a", label: "Most likely normal variance: keep following the plan and judge it over many more trades" },
      { id: "b", label: "The plan is broken: switch to a new method straight away", rationale: "Eight trades are far too few to judge expectancy. Switching after every bad run means no method ever gets enough trades to be judged." },
      { id: "c", label: "The stops are the problem: trade without them for a while", rationale: "The stops capped each loss at about 1R, which is why the run is still small. Without them, one bad trade could cost far more." },
      { id: "d", label: "Double the risk to win the losses back, then review", rationale: "Doubling risk to recover is sizing up after losses, and it doubles the next loss too. During a streak, risk may go down, never up." },
    ],
    correct: "a",
    explanation:
      "When the decisions and risk rules were all sound, a short run of losses says more about chance than about the method. Eight trades are far too few to judge expectancy, and switching method after every streak means no method ever gets enough trades to be judged.",
    lesson: "L18",
    concepts: ["journaling", "expectancy"],
    hints: [
      "Look at the decisions in the journal before looking at the results.",
      "Sound decisions with a short losing run usually mean variance; broken rules mean the process needs a fix.",
      "All 8 trades met every condition, risked 1% and kept their stops: the process was followed.",
    ],
  },
  {
    id: "q-psy-10",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "'I've already lost 200.00 on this trade, I can't close it now.' Which trap does this describe?",
    options: [
      { id: "a", label: "FOMO", rationale: "FOMO is about entering a move you fear missing. This trader is already in and can't let go of money already lost." },
      { id: "b", label: "Sunk cost" },
      { id: "c", label: "Confirmation bias", rationale: "Confirmation bias is favouring evidence for your view. This is about refusing to accept a loss that has already happened." },
    ],
    correct: "b",
    explanation:
      "The 200.00 is already lost whatever you do next; the only question is whether the trade still fits the plan. Holding on to avoid 'making the loss real' is sunk-cost thinking, a close relative of loss aversion.",
    lesson: "L13",
    concepts: ["loss-aversion"],
  },
  {
    id: "q-psy-11",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "You are long LABX and keen on the idea. Which habit is a sign of confirmation bias?",
    options: [
      { id: "a", label: "Writing down, before entry, the price that would prove the idea wrong", rationale: "That's the countermeasure. Writing down in advance what proves you wrong makes evidence against the idea hard to ignore later." },
      { id: "b", label: "Counting every rising candle as proof, while treating lower highs as noise" },
      { id: "c", label: "Checking each condition against a written list before entering", rationale: "Checking each condition against a written list tests the setup against the chart, not against your hopes. It works against the bias." },
      { id: "d", label: "Closing the trade when the stop is hit", rationale: "Taking the planned loss is the plan working. Confirmation bias would rather explain the drop away as noise and look for reasons to stay." },
    ],
    correct: "b",
    explanation:
      "Confirmation bias makes you notice what supports your view and discount what argues against it, and it is strongest once you hold a position. Lower highs are evidence too; a written invalidation level turns them into a rule.",
    lesson: "L13",
    concepts: ["confirmation-bias"],
  },
  {
    id: "q-psy-12",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "You are bullish on LABX and want to buy. Your notes list three reasons: the 20-period moving average is rising, the last two candles closed strongly higher, and the move feels like the start of a trend. You haven't checked the swing highs: over the last 10 candles, LABX has printed three lower highs.",
    prompt: "What is the best next step?",
    options: [
      { id: "a", label: "Enter: three reasons in favour outweigh one against", rationale: "Counting reasons isn't a test. Lower highs argue against an uptrend, and one failed playbook condition means no trade, however many reasons agree." },
      { id: "b", label: "Look for a fourth reason in favour before entering", rationale: "Searching for more support is the bias itself. The useful search is for evidence against the idea, such as the lower highs you skipped." },
      { id: "c", label: "Write down the price that would prove the idea wrong, check each playbook condition against the chart, then decide" },
      { id: "d", label: "Enter with half the usual size because of the lower highs", rationale: "A smaller size limits the loss but doesn't answer the evidence. If the structure fails a playbook condition, there is no trade at any size." },
    ],
    correct: "c",
    explanation:
      "Listing only reasons in favour is confirmation bias at work: the three lower highs are evidence too, and they speak against an uptrend. Writing the invalidation first and checking each condition tests the idea against the chart rather than against your hopes.",
    lesson: "L13",
    concepts: ["confirmation-bias", "trading-plan"],
  },

  // ---------------------------------------------------------------------------
  // Decision making
  // ---------------------------------------------------------------------------
  {
    id: "q-dm-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which of these is a checkable entry condition?",
    options: [
      { id: "a", label: "The trend looks strong", rationale: "It sounds objective, but two people could disagree on it. A checkable condition is plainly true or false on the chart, like a close above a swing high." },
      { id: "b", label: "I have a good feeling about this one", rationale: "A feeling can't be checked on the chart and shifts with your mood. Playbook conditions must be true or false for anyone looking." },
      { id: "c", label: "The last candle closed above the previous swing high" },
      { id: "d", label: "Everyone seems to be buying", rationale: "You can't see or confirm this on the chart. A move that others seem to be chasing is closer to FOMO than to a setup." },
    ],
    correct: "c",
    explanation:
      "A checkable condition is either true or false on the chart, so two people would agree on it. 'Looks strong' sounds objective but can be argued either way, which leaves room for wishful thinking.",
    lesson: "L14",
    concepts: ["trading-plan"],
  },
  {
    id: "q-dm-2",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Your pullback playbook has three conditions: (1) an uptrend of higher highs and higher lows, (2) a pullback that holds above the previous swing low, (3) a target at the previous high at least 2R away. Conditions 1 and 2 are met. With the stop beyond the pullback low, the previous high is only 1.5R away.",
    prompt: "What does the plan say?",
    options: [
      { id: "a", label: "Enter: two out of three conditions is enough", rationale: "A playbook works as a checklist: every condition must be true. One 'no' means no trade, and that counts as following the plan." },
      { id: "b", label: "No trade: condition 3 is not met" },
      { id: "c", label: "Enter, but move the stop closer so the ratio reaches 2:1", rationale: "That bends the stop to fit the target. The stop belongs beyond the pullback low; pulled closer, it sits inside the noise and the trade changes." },
      { id: "d", label: "Enter with half the usual size to make up for the missing condition", rationale: "A smaller size limits the loss, but it doesn't make the setup complete. An incomplete setup is no trade at any size." },
    ],
    correct: "b",
    explanation:
      "The playbook requires every condition, so one 'no' means no trade. Tightening the stop to make the numbers fit puts it inside the noise and changes the trade, not the setup; a smaller size reduces the loss but does not make an incomplete setup valid.",
    lesson: "L14",
    concepts: ["trading-plan"],
  },
  {
    id: "q-dm-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Why write a trading plan before the session rather than during it?",
    options: [
      { id: "a", label: "Because a written plan guarantees profits", rationale: "No plan can guarantee profits in an uncertain market. A plan makes your decisions consistent and reviewable, which is the part you control." },
      { id: "b", label: "So you can skip the stop-loss", rationale: "A plan includes the stop rule; it doesn't replace it. Writing where the idea fails is one of the plan's core parts." },
      { id: "c", label: "So you never need to look at the chart", rationale: "You still check each condition against the chart. The plan decides what you look for, before money is at risk." },
      { id: "d", label: "So the hard decisions are made while calm, before money is at risk" },
    ],
    correct: "d",
    explanation:
      "Under pressure, judgement drifts towards whatever the last few candles suggest. A plan made in advance moves the thinking to a calmer moment; it does not guarantee profits, it makes decisions consistent and reviewable.",
    lesson: "L14",
    concepts: ["trading-plan"],
  },
  {
    id: "q-dm-4",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "A trade made 300.00 vUSD, but you entered without a stop and with twice your usual size. How should you review it?",
    options: [
      { id: "a", label: "As a poor decision with a good outcome: rules were broken, and the profit rewards a risky habit" },
      { id: "b", label: "As a good trade: the profit shows the decision was right", rationale: "Judging by outcome alone rewards luck. With no stop and double size, the loss had no limit. Grade the decision apart from the result." },
      { id: "c", label: "As proof that a larger size works better", rationale: "One profit can't show that. Double size doubled the risk too; on a losing path, the same habit would have cost twice as much, with nothing to cap it." },
      { id: "d", label: "It doesn't need reviewing because it made money", rationale: "Profitable rule breaks need review most, because the profit makes the habit feel right. Review the decision, not the result." },
    ],
    correct: "a",
    explanation:
      "The outcome was good, but the decision broke two risk rules and the potential loss had no limit. This is the most dangerous combination, because the profit makes the habit feel right.",
    lesson: "L17",
    concepts: ["decision-quality"],
  },
  {
    id: "q-dm-5",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "You followed your playbook exactly: every condition was met, risk was 1% and the stop sat beyond the level that invalidated the idea. Unscheduled news then pushed price down, and the stop filled slightly below its price, for a loss of −1.05R.",
    prompt: "In your review, how should this trade be classified?",
    options: [
      { id: "a", label: "A bad decision: it lost money", rationale: "That judges the outcome, not the decision. The plan was followed with the information available; a loss near −1R is a normal cost of trading." },
      { id: "b", label: "A bad decision: you should have predicted the news", rationale: "Unscheduled news couldn't be known when you decided. Judging the decision with what you learned afterwards is hindsight bias." },
      { id: "c", label: "A good decision with a bad outcome: keep the rule and record the result" },
      { id: "d", label: "A good decision, but place stops further away in future so they are not hit", rationale: "Wider stops don't prevent losses; they make each one bigger. The stop sat where the idea failed, so the rule stays." },
    ],
    correct: "c",
    explanation:
      "The decision fitted the plan and the information available at the time; unscheduled news could not have been known. Losing trades like this are a normal cost of trading, and moving stops further away to avoid them only raises the risk.",
    lesson: "L17",
    concepts: ["decision-quality"],
  },
  {
    id: "q-dm-6",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "When you replay a trade to review it, why should you look only at the candles that were visible at the decision point?",
    options: [
      { id: "a", label: "Because later candles are not saved", rationale: "Replay keeps every candle. You hide the later ones on purpose, so the decision is judged only on what you could see then." },
      { id: "b", label: "To avoid hindsight bias: judging a decision with information you did not have" },
      { id: "c", label: "So the trade looks better than it was", rationale: "The aim is an honest review, not a flattering one. Hindsight can make a decision look better or worse than it really was." },
    ],
    correct: "b",
    explanation:
      "Once you know what happened, it feels as if it was obvious. Judging the decision against only what was visible at the time shows whether it was sound, rather than whether it was lucky.",
    lesson: "L17",
    concepts: ["decision-quality", "journaling"],
  },
  {
    id: "q-dm-7",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "MARKET//LAB scores Decision Quality, Risk Discipline and the Simulated Outcome separately. Which combination is possible?",
    options: [
      { id: "a", label: "A trade whose stop was widened mid-trade, with perfect Risk Discipline", rationale: "Widening a stop always counts against Risk Discipline, whatever happens next. It raises the loss you agreed to before entry." },
      { id: "b", label: "A losing trade that automatically scores zero for Decision Quality", rationale: "Decision Quality rates the reasoning with the information at the time, not the result. A sound, planned trade can lose and still score well." },
      { id: "c", label: "A profitable trade with poor Risk Discipline" },
    ],
    correct: "c",
    explanation:
      "The scores are separate precisely so a profit cannot hide a broken rule. Widening a stop always counts against Risk Discipline, and a loss does not by itself make a decision poor.",
    lesson: "L17",
    concepts: ["decision-quality"],
  },
  {
    id: "q-dm-8",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "Your plan says you trade only pullbacks in an uptrend, with 1% risk. During the session LABX breaks out sharply above a range. Breakouts are not in your playbook, but the move looks strong.",
    prompt: "What is the sound decision?",
    options: [
      { id: "a", label: "Trade it with 1% risk: the risk rule is what matters", rationale: "Risk rules limit the loss, but they don't create a setup. A trade outside the playbook breaks the plan even at the right size." },
      { id: "b", label: "Trade it with 0.5% risk, since it isn't in the plan", rationale: "A smaller size makes an unplanned trade cheaper, not sound. With no tested conditions, there's nothing to check it against." },
      { id: "c", label: "Add breakouts to the plan in your head and enter now", rationale: "Changing the plan mid-session because a move looks strong is improvising. New setups are written and practised away from the screen, after review." },
      { id: "d", label: "No trade; if breakouts interest you, write a breakout playbook and practise it before trading them" },
    ],
    correct: "d",
    explanation:
      "A move outside the playbook is not a setup, however strong it looks, and a smaller size does not make an unplanned trade sound. Writing and practising new rules away from the screen is how a plan grows without becoming improvisation.",
    lesson: "L14",
    concepts: ["trading-plan", "fomo"],
    hints: [
      "Ask first whether this setup is in your playbook at all.",
      "A move outside the playbook is not a setup. Plans change between sessions, after review, not mid-session.",
      "Your playbook lists pullbacks in an uptrend. A breakout above a range is not on that list.",
    ],
  },
  {
    id: "q-dm-9",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "Reviewing a trade that was stopped out for −1R, the alternative decisions view shows that skipping the trade would have given 0R, and holding without a stop would have ended at +0.5R.",
    prompt: "What is the right lesson?",
    options: [
      { id: "a", label: "One trade's hypothetical paths say little; judge whether the original decision fitted the plan and the information at the time" },
      { id: "b", label: "Trade without a stop next time, since holding would have worked", rationale: "That generalises from one path. Without a stop, the paths where price kept falling have no limit on the loss, and this result can't show them." },
      { id: "c", label: "The trade should never have been taken, because it lost", rationale: "That judges the trade by its outcome. If it fitted the plan, a −1R loss is the planned cost of being wrong, not proof of a bad decision." },
    ],
    correct: "a",
    explanation:
      "Alternatives help you understand a decision, but any single path is partly chance. Holding without a stop happened to work this time; as a habit it leaves losses unlimited, which one trade's outcome cannot show.",
    lesson: "L17",
    concepts: ["counterfactual-thinking", "decision-quality"],
    hints: [
      "Separate the decision from the one path this trade happened to take.",
      "Judge a decision by the plan and what was visible at the time; judge outcomes only across many trades.",
      "Holding without a stop ended at +0.5R here, but on a path that kept falling, its loss had no limit.",
    ],
  },
  {
    id: "q-dm-10",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which journal entry gives you the most to learn from later?",
    options: [
      { id: "a", label: "'Lost 100.00. Bad day.'", rationale: "This records a result and a mood, but not the setup, the stop or whether you followed the plan. There's nothing to review except the outcome." },
      { id: "b", label: "'Pullback setup, all three conditions met. Stop 0.20 below the pullback low, risk 1%. Stopped out, −1R. Followed plan: yes. Felt calm.'" },
      { id: "c", label: "'Won 150.00. Great trade.'", rationale: "A result alone can't tell a sound decision from a lucky one. Record the setup, the risk and whether you followed the plan." },
      { id: "d", label: "No entry for losing trades, so the journal stays motivating", rationale: "Memory already favours the flattering. Skipping losses hides the patterns you most need to see, such as widened stops or skipped conditions." },
    ],
    correct: "b",
    explanation:
      "A useful entry records the plan, the reasons, the execution, how you felt and the result, and grades the decision apart from the outcome. Across many trades, that shows patterns memory would miss, such as where losses beyond 1R come from.",
    lesson: "L17",
    concepts: ["journaling", "decision-quality"],
  },

  // ---------------------------------------------------------------------------
  // Scenario analysis
  // ---------------------------------------------------------------------------
  {
    id: "q-sa-1",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "What is the main purpose of scenario analysis before a trade?",
    options: [
      { id: "a", label: "To predict exactly where price will go", rationale: "Nobody knows the next move, and scenario analysis accepts that. Its aim is preparation for several paths, not one correct forecast." },
      { id: "b", label: "To have a planned action for each plausible path, so no outcome forces an unplanned decision" },
      { id: "c", label: "To find reasons to increase the position size", rationale: "Scenarios are about actions, not size. If anything, the worst case can show that the size is too big for your limit." },
    ],
    correct: "b",
    explanation:
      "Scenario analysis accepts that the next move is unknown and prepares for several. Its value lies in having an action ready for each case, not in picking the right prediction.",
    lesson: "L15",
    concepts: ["scenario-planning"],
  },
  {
    id: "q-sa-2",
    topic: "scenario_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "LABX trades at 60.10, under resistance at 60.50; the range floor is 59.00. Your plan covers a clean breakout (buy after two closes above 60.50, stop at 59.90) and a drop below 59.00 (no trade). It says nothing about price closing above 60.50 once and then falling straight back into the range.",
    prompt: "Which case should be added, and what is a reasonable action for it?",
    options: [
      { id: "a", label: "Bullish breakout: buy on the first close above 60.50 so you don't miss it", rationale: "That drops the two-close rule, which exists to filter out this exact case. Not wanting to miss the move is normal; the rule still decides." },
      { id: "b", label: "None: the stop covers every case", rationale: "A stop only matters once you're in a trade. The gap here is a path with no planned action, which invites an impulsive entry." },
      { id: "c", label: "False breakout: a single close above 60.50 followed by a move back into the range means no entry" },
    ],
    correct: "c",
    explanation:
      "A push through resistance that fails is a common path, and without a planned action it invites an impulsive entry. Buying on the first close abandons the two-close rule that protects you from exactly this case; a stop only matters once you are in a trade.",
    lesson: "L15",
    concepts: ["scenario-planning", "false-breakout"],
  },
  {
    id: "q-sa-3",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which is the best example of a scenario trigger?",
    options: [
      { id: "a", label: "A candle closes below the range floor at 59.00" },
      { id: "b", label: "Price feels weak", rationale: "A feeling can't be seen on the chart, so you can't tell when the case has started. A trigger is an observable event, like a close beyond a level." },
      { id: "c", label: "The market will probably fall soon", rationale: "That's a forecast, not a trigger. A trigger tells you a case has begun; it doesn't guess what comes next." },
      { id: "d", label: "Other traders seem nervous", rationale: "You can't check this on the chart, and it shifts with your mood. A trigger is something you can point to, such as a candle closing below 59.00." },
    ],
    correct: "a",
    explanation:
      "A trigger must be observable and unambiguous, so you know the moment a case has begun. Feelings and forecasts can't be checked on the chart and tend to shift with your mood.",
    lesson: "L15",
    concepts: ["scenario-planning"],
  },
  {
    id: "q-sa-4",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt:
      "Before entering, you judge the bearish case to be unlikely. If it did happen, however, your loss would be 3% of the account. What should you do?",
    options: [
      { id: "a", label: "Enter anyway, because the case is unlikely", rationale: "Likelihood is a judgement and can be wrong; the risk limit is a rule. The plan must be acceptable in every case, unlikely ones included." },
      { id: "b", label: "Remove the stop, since the bearish case probably won't happen", rationale: "Removing the stop makes the bearish case worse, not less likely. The loss in that case would then have no limit at all." },
      { id: "c", label: "Reduce the size, or skip the trade, so the loss in that case stays within your limit" },
    ],
    correct: "c",
    explanation:
      "A plan has to be acceptable in every case, including the unlikely ones. Likelihood estimates are judgements and can be wrong; the risk limit is a rule.",
    lesson: "L15",
    concepts: ["scenario-planning", "risk-per-trade"],
  },
  {
    id: "q-sa-5",
    topic: "scenario_analysis",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "You hold a long position with a stop 1.00 below your entry. A scheduled event is due in the next candle. Around past events, LABX has often opened 2.00 or more away from the previous close.",
    prompt: "Which case should your plan include, and how could you respond?",
    options: [
      { id: "a", label: "No new case: the stop guarantees a loss of exactly 1R", rationale: "A stop doesn't guarantee a price. It becomes a market order, so a gap through it fills at the open, possibly far beyond 1R." },
      { id: "b", label: "Only the bullish case: events tend to push price up", rationale: "That's a forecast, and the plan must be acceptable in every case. The bearish gap is exactly the case that can exceed your limit." },
      { id: "c", label: "Widen the stop to 3.00 below entry and keep the same size", rationale: "The same size with a stop three times further away triples the planned risk, and widening counts against Risk Discipline. A gap can still jump it." },
      { id: "d", label: "A gap through the stop: the loss could be well over 1R, so reduce the size or close before the event" },
    ],
    correct: "d",
    explanation:
      "A stop becomes a market order, so a gap fills at the open, possibly far beyond the stop. Planning for that case means accepting the larger possible loss or reducing exposure before the event; widening the stop just raises the risk further.",
    lesson: "L15",
    concepts: ["gap-risk", "scenario-planning"],
    hints: [
      "Think about what a stop does when price opens beyond it.",
      "A stop becomes a market order, so a gap through it fills at the open.",
      "If price opens 2.00 below a close near your entry, the stop fills there: about 2R, not 1R.",
    ],
  },
  {
    id: "q-sa-6",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "After a trade, how should you judge your scenario plan?",
    options: [
      { id: "a", label: "By whether it covered what happened and whether you followed it" },
      { id: "b", label: "By the profit or loss alone", rationale: "One result owes a lot to chance. A stop-out in a planned case can be a plan well executed, and a win in an unplanned case was luck." },
      { id: "c", label: "By how many cases it listed", rationale: "A long list doesn't help if it misses the likely paths or isn't followed. Coverage and execution are what count." },
    ],
    correct: "a",
    explanation:
      "A stop-out in a case you planned for is a plan well executed, while a win in a case you never considered was luck. Listing many cases is pointless if they don't cover the likely paths or you don't follow them.",
    lesson: "L15",
    concepts: ["scenario-planning", "decision-quality"],
  },
  {
    id: "q-sa-7",
    topic: "scenario_analysis",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "You bought expecting a breakout to continue. Twelve candles later, price is still within 0.20 of your entry, nowhere near the stop or the target. Your plan's sideways case says: 'If nothing happens within 10 candles, close the trade.'",
    prompt: "What should you do?",
    options: [
      { id: "a", label: "Hold until the stop or the target is hit, however long it takes", rationale: "The plan already has a time limit for this case. Holding on ignores it and swaps a calm decision for one made in the moment." },
      { id: "b", label: "Close the trade, as the sideways case says" },
      { id: "c", label: "Add to the position, since it hasn't lost", rationale: "Not losing isn't the idea working; a breakout was supposed to move. Adding units raises risk on a trade whose trigger says close." },
      { id: "d", label: "Move the target closer so it is hit sooner", rationale: "That changes the plan mid-trade to get a result. The sideways case already says what to do: close the trade." },
    ],
    correct: "b",
    explanation:
      "The sideways case has been triggered, and you decided its action while calm. A breakout that doesn't move has not done what the idea required; holding on, adding units or moving the target are all unplanned decisions made in the moment.",
    lesson: "L15",
    concepts: ["scenario-planning"],
    hints: [
      "Check which of your planned cases matches what price is doing now.",
      "When a case's trigger is met, carry out the action you wrote for it.",
      "Twelve candles within 0.20 of entry is more than the 10 candles in your sideways trigger.",
    ],
  },
  {
    id: "q-sa-8",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which three cases make up the simple scenario frame?",
    options: [
      { id: "a", label: "Buy, sell and hold", rationale: "Those are your possible actions, which you attach to each case. The frame describes what the market might do." },
      { id: "b", label: "Win, lose and break even", rationale: "Those are a trade's outcomes. The frame describes price paths: the idea works, it fails, or nothing much happens." },
      { id: "c", label: "Bullish, bearish and sideways" },
    ],
    correct: "c",
    explanation:
      "The frame describes what the market might do: the idea works, it fails, or nothing much happens. Buy, sell and hold are your possible actions, which you then attach to each case.",
    lesson: "L15",
    concepts: ["scenario-planning"],
  },
  {
    id: "q-sa-9",
    topic: "scenario_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Before a breakout trade you estimate three cases: bullish (target hit, +2R) with a 40% chance, bearish (stop hit, −1R) with 45%, and sideways (closed at entry, 0R) with 15%. Ignore costs.",
    prompt: "What is the estimated expectancy, and how much should you trust it?",
    options: [
      { id: "a", label: "−0.45R, because the bearish case is the most likely", rationale: "That counts only the bearish case. Expectancy weighs every case: the 40% bullish case at +2R more than offsets the 45% bearish one at −1R." },
      { id: "b", label: "+0.80R, because the bullish case pays 2R", rationale: "That's only the bullish share, 0.40 × 2. Subtract the bearish share, 0.45 × 1, to get the average across all three cases." },
      { id: "c", label: "+0.35R, and it is guaranteed over time", rationale: "The arithmetic is right, but the probabilities are your estimates. If they're off, so is the result: a hypothesis to test, not a promise." },
      { id: "d", label: "+0.35R, but it is only as reliable as your probability estimates" },
    ],
    correct: "d",
    explanation:
      "0.40 × 2 − 0.45 × 1 + 0.15 × 0 = +0.35R. The calculation is exact, but the inputs are your judgement, so the result is an estimate; it does not need the most likely case to be the profitable one.",
    lesson: "L15",
    concepts: ["expectancy", "base-rates"],
    hints: [
      "Weigh each case by its estimated chance, then add the cases up.",
      "Expectancy = the sum of (probability × result in R) over all cases.",
      "Bullish: 0.40 × 2 = +0.80R. Now add the bearish and sideways cases.",
    ],
  },
  {
    id: "q-sa-10",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt:
      "You were stopped out for −1R at the level where your idea failed. LABX then rallied well past your target. Which question makes the most useful counterfactual review?",
    options: [
      { id: "a", label: "How much would I have made if I had held without a stop?", rationale: "That looks only at the path you now know. 'If only I had held' is hindsight; on a falling path, no stop would have meant an unlimited loss." },
      { id: "b", label: "Had price kept falling instead, what would the stop have done, and did it sit where the idea failed?" },
      { id: "c", label: "Why didn't I see the rally coming?", rationale: "The rally wasn't visible when you decided. Judging the decision with information you didn't have is hindsight bias, not analysis." },
    ],
    correct: "b",
    explanation:
      "Counterfactual thinking checks a decision against the other paths that were possible when you made it. On a path where price kept falling, the stop capped the loss; a stop at the invalidation level was sound on both paths.",
    lesson: "L17",
    concepts: ["counterfactual-thinking", "decision-quality"],
  },
  {
    id: "q-sa-11",
    topic: "scenario_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt:
      "Your journal holds 50 breakout trades taken under the same rules: 17 reached the +2.5R target and 33 were stopped out at −1R. Starting from this base rate, what is the estimated expectancy per trade, in R, before costs? Round to two decimal places.",
    numeric: { answer: 0.19, tolerance: 0.01, unit: "R" },
    explanation:
      "The base rate is 17 ÷ 50 = 34%, so expectancy = 0.34 × 2.5 − 0.66 × 1 = 0.85 − 0.66 = +0.19R per trade. A new breakout that looks perfect still starts from this estimate until there is evidence it is different.",
    lesson: "L15",
    concepts: ["base-rates", "expectancy"],
    hints: [
      "Start from how often this setup has worked, not from how good the next one looks.",
      "Base rate = wins ÷ trades. Expectancy = base rate × average win − (1 − base rate) × average loss.",
      "Base rate: 17 ÷ 50 = 0.34. Wins contribute 0.34 × 2.5 = 0.85R.",
    ],
    vary: {
      fields: { N: [25, 50, 25], k: [6, 30, 1], W: [1.5, 3, 0.5] },
      constraints: ["k / N >= 0.25 && k / N <= 0.6", "100 * k * W / N == round(100 * k * W / N, 0)", "abs(k * W - (N - k)) / N >= 0.02"],
      answer: "round((k * W - (N - k)) / N, 2)",
      prompt:
        "Your journal holds {N} breakout trades taken under the same rules: {k} reached the +{W:1}R target and {N - k} were stopped out at −1R. Starting from this base rate, what is the estimated expectancy per trade, in R, before costs? Round to two decimal places.",
      explanation:
        "The base rate is {k} ÷ {N} = {100 * k / N}%, so expectancy = {k / N:2} × {W:1} − {(N - k) / N:2} × 1 = {k * W / N:2} − {(N - k) / N:2} = {answer:2}R per trade. A new breakout that looks perfect still starts from this estimate until there is evidence it is different.",
      hint: "Base rate: {k} ÷ {N} = {k / N:2}. Wins contribute {k / N:2} × {W:1} = {k * W / N:2}R.",
    },
  },
];
