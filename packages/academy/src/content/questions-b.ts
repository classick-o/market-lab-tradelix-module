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
      { id: "a", label: "The total value of the position you buy" },
      { id: "b", label: "The commission charged when you open the trade" },
      { id: "c", label: "The amount you would lose if price reaches your stop-loss, decided before you enter" },
      { id: "d", label: "The largest loss the market could ever cause" },
    ],
    correct: "c",
    explanation:
      "Risk per trade is the planned loss if the stop is hit, including costs. Position value is a different number: 100 units at 50.00 is a 5,000.00 vUSD position, but with the stop 1.00 away it risks about 100.00.",
    lesson: "L08",
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
  },
  {
    id: "q-rm-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "After three losing trades, a trader's account is down from 10,000.00 to 9,700.00 vUSD. Their rule is 1% risk per trade. They feel sure the next setup will work and want to risk 3% on it to get back to even quickly.",
    prompt: "What is the most disciplined response?",
    options: [
      { id: "a", label: "Risk 3% once to get back to even, then return to 1%" },
      { id: "b", label: "Risk 1% of the original 10,000.00, which is 100.00 vUSD" },
      { id: "c", label: "Skip the stop on this trade so a small dip cannot shake them out" },
      { id: "d", label: "Keep risk at 1% of the current account: 9,700.00 × 1% = 97.00 vUSD" },
    ],
    correct: "d",
    explanation:
      "Sizing up after losses raises risk exactly when judgement is under pressure, and MARKET//LAB counts it against Risk Discipline. Risking 1% of the current account (97.00 vUSD) lets the budget shrink automatically during a drawdown; option b is close but ignores that the account is now smaller.",
    lesson: "L08",
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
  },
  {
    id: "q-rm-6",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which statement about win rate is correct?",
    options: [
      { id: "a", label: "Win rate only means something together with the average win and the average loss" },
      { id: "b", label: "A method that wins 70% of the time must be profitable" },
      { id: "c", label: "Win rate is irrelevant; only the reward-to-risk ratio matters" },
      { id: "d", label: "A higher reward-to-risk ratio always produces more profit" },
    ],
    correct: "a",
    explanation:
      "Expectancy combines both sides: winning 70% at +0.4R and losing 30% at −1R gives 0.28 − 0.30 = −0.02R per trade. A high win rate with small wins can still lose money, and a high ratio is useless if the target is rarely reached.",
    lesson: "L11",
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
      { id: "a", label: "−0.20R: the method is losing because most trades lost" },
      { id: "b", label: "+0.40R: encouraging, but 20 trades is a small sample to judge a method on" },
      { id: "c", label: "+2.50R: the average win is what counts" },
      { id: "d", label: "+0.40R: this proves the method will keep earning 0.40R per trade" },
    ],
    correct: "b",
    explanation:
      "0.40 × 2.5R − 0.60 × 1R = +0.40R per trade (8 × 250.00 − 12 × 100.00 = +800.00 vUSD, or 8R over 20 trades). The sign is encouraging, but a few lucky or unlucky results can distort 20 trades, so it is evidence, not proof.",
    lesson: "L11",
  },
  {
    id: "q-rm-8",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 1,
    prompt:
      "Volatility doubles and the stop that invalidates your idea is now twice as far from the entry as usual. To keep the same risk in vUSD, what should happen to your position size?",
    options: [
      { id: "a", label: "Double it" },
      { id: "b", label: "Keep it the same" },
      { id: "c", label: "Halve it" },
      { id: "d", label: "It doesn't matter as long as there is a stop" },
    ],
    correct: "c",
    explanation:
      "Units = risk budget ÷ distance to stop. If the distance doubles, the units must halve to keep the loss the same; keeping the same size would double the risk.",
    lesson: "L16",
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
      { id: "a", label: "40 units" },
      { id: "b", label: "80 units" },
      { id: "c", label: "200 units" },
      { id: "d", label: "500 units" },
    ],
    correct: "b",
    explanation:
      "The budget is 10,000.00 × 2% = 200.00 vUSD and the distance is 40.00 − 37.50 = 2.50, so 200.00 ÷ 2.50 = 80 units. 40 units uses the 1% mission limit instead; including commission on both fills, the cost-aware size would be 78 units.",
    lesson: "L16",
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
      { id: "a", label: "At a round number close to the entry" },
      { id: "b", label: "At whatever distance allows the largest position" },
      { id: "c", label: "Where the trade idea would be proven wrong, plus a small buffer for noise" },
      { id: "d", label: "Wherever the loss would feel bearable" },
    ],
    correct: "c",
    explanation:
      "A stop marks the point where the reason for the trade no longer holds. Round numbers, comfortable amounts or the size you wanted have nothing to do with whether the idea is still valid; the size is adjusted to the stop, not the other way round.",
    lesson: "L10",
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
  },
  {
    id: "q-sl-3",
    topic: "stop_loss",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "You bought LABX at 50.00 because support at 48.40 held. Your stop is at 48.00, below that support. Price drops to 48.30 and the trade now shows a loss.",
    prompt: "What does your plan say to do?",
    options: [
      { id: "a", label: "Leave the stop at 48.00: support has not failed yet, and the stop will act if it does" },
      { id: "b", label: "Move the stop to 47.00 to give the trade more room" },
      { id: "c", label: "Buy more units at 48.30 to lower the average entry price" },
      { id: "d", label: "Remove the stop and decide at the end of the session" },
    ],
    correct: "a",
    explanation:
      "Price is close to support, but the idea has not been invalidated, and the stop already sits where it would be. Widening it to 47.00 raises the agreed risk and breaks Risk Discipline; adding units adds risk to a trade that is going against you.",
    lesson: "L10",
  },
  {
    id: "q-sl-4",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why is a stop placed exactly on an obvious support level often a poor choice?",
    options: [
      { id: "a", label: "Obvious levels are often briefly tested, so a stop right on the level can be hit even if support holds" },
      { id: "b", label: "Stops cannot be placed at support levels" },
      { id: "c", label: "Support levels never break, so the stop is wasted" },
    ],
    correct: "a",
    explanation:
      "Many traders watch the same obvious price, and it is common for price to poke through it briefly before turning. A small buffer beyond the level means the stop is hit when support really fails, not when it is merely tested.",
    lesson: "L10",
  },
  {
    id: "q-sl-5",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 1,
    prompt: "In MARKET//LAB, what happens when price touches your stop-loss?",
    options: [
      { id: "a", label: "A limit order is placed at the stop price and is guaranteed to fill there" },
      { id: "b", label: "It becomes a market order and fills at the next available price" },
      { id: "c", label: "Nothing, until you confirm the exit" },
    ],
    correct: "b",
    explanation:
      "A stop-loss becomes a market order when touched, so the fill can be slightly worse than the stop price, and much worse if price gaps through it. It limits the loss in normal conditions but is not a guaranteed price.",
    lesson: "L10",
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
  },
  {
    id: "q-sl-7",
    topic: "stop_loss",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "You have a 10,000.00 vUSD account and a 1% risk limit. You want to buy LABX at 50.00. The idea is wrong if price breaks below support at 48.40, and normal candles move about 0.40. You would prefer a stop at 49.50, because it allows 200 units.",
    prompt: "What is the better approach?",
    options: [
      { id: "a", label: "Keep the stop at 49.50: more units means a bigger gain if it works" },
      { id: "b", label: "Put the stop at 48.00 and keep 200 units" },
      { id: "c", label: "Skip the stop and watch the trade closely instead" },
      { id: "d", label: "Put the stop beyond 48.40, at about 48.00, and buy 50 units for the same 100.00 vUSD risk" },
    ],
    correct: "d",
    explanation:
      "A stop at 49.50 sits inside normal noise, well above where the idea fails. Placing it beyond 48.40 and sizing to 100.00 ÷ 2.00 = 50 units keeps the risk at 1%; keeping 200 units with that stop would risk 400.00 vUSD, or 4%.",
    lesson: "L10",
  },
  {
    id: "q-sl-8",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which change to the stop on an open long trade counts against Risk Discipline in MARKET//LAB?",
    options: [
      { id: "a", label: "Leaving the stop where you planned it" },
      { id: "b", label: "Moving the stop up, closer to price, after the trade has moved in your favour" },
      { id: "c", label: "Moving the stop down, further from the entry, to avoid being stopped out" },
    ],
    correct: "c",
    explanation:
      "Widening a stop increases the loss you agreed to before entering, which is exactly what the risk rules exist to prevent. Moving a long trade's stop up reduces the risk, so it does not break the rule.",
    lesson: "L10",
  },
  {
    id: "q-sl-9",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 2,
    prompt: "In a volatile phase, your usual stop distance now sits inside the normal range of a single candle. What is the better adjustment?",
    options: [
      { id: "a", label: "Keep the usual distance and accept more stop-outs" },
      { id: "b", label: "Widen the stop beyond the noise and reduce the size so the risk in vUSD stays the same" },
      { id: "c", label: "Keep the usual distance and increase the size to make up for the stop-outs" },
      { id: "d", label: "Trade without a stop until volatility calms down" },
    ],
    correct: "b",
    explanation:
      "A stop inside ordinary noise gets hit by random swings even when the idea is still valid. Placing it beyond the noise and cutting the units keeps the loss when wrong unchanged; trading without a stop leaves the loss unlimited.",
    lesson: "L16",
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
      { id: "a", label: "Waiting until every condition in your plan is met" },
      { id: "b", label: "Entering because price is already moving fast and you fear being left out, rather than because your setup is present" },
      { id: "c", label: "Placing a stop-loss before entering" },
      { id: "d", label: "Reducing size in a volatile market" },
    ],
    correct: "b",
    explanation:
      "FOMO (fear of missing out) makes the move itself the reason to enter. The entry tends to be late, the stop far away or missing, and no setup from the plan is involved; the other options describe disciplined behaviour.",
    lesson: "L13",
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
      { id: "a", label: "Buy now with a large size so the move pays off" },
      { id: "b", label: "Buy now and decide where the stop goes later" },
      { id: "c", label: "Sell short, because a move that strong must come back down" },
      { id: "d", label: "Don't chase: write down what setup would make a trade valid, and wait for it" },
    ],
    correct: "d",
    explanation:
      "Chasing means entering because of the move, with no sensible stop nearby. Writing down a valid setup, for example a pullback that holds, turns the urge into a plan; shorting 'because it must come down' is the same impulse in the other direction.",
    lesson: "L13",
  },
  {
    id: "q-psy-3",
    topic: "psychology",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which behaviour is a typical sign of loss aversion?",
    options: [
      { id: "a", label: "Closing a trade at the planned stop" },
      { id: "b", label: "Risking the same percentage on every trade" },
      { id: "c", label: "Widening the stop on a losing trade to avoid taking the loss" },
    ],
    correct: "c",
    explanation:
      "Loss aversion makes a loss feel worse than a gain of the same size feels good, so traders avoid making the loss real by moving the stop. That turns a planned 1R loss into a larger one; the other two options are the plan working.",
    lesson: "L13",
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
      { id: "a", label: "It's confidence: after a loss a win is due, so a bigger size makes sense" },
      { id: "b", label: "It's revenge trading: pause and skip it, because the setup is incomplete and the size breaks your rule" },
      { id: "c", label: "Enter at normal size: two out of three conditions is close enough" },
      { id: "d", label: "Enter at triple size with a stop three times tighter, so the risk in vUSD stays the same" },
    ],
    correct: "b",
    explanation:
      "Wanting to win back a loss quickly, with a bigger size, is revenge trading, and a win is never 'due' after a loss. An incomplete setup is no trade at any size, and squeezing the stop to fit a bigger size just puts it inside the noise.",
    lesson: "L13",
  },
  {
    id: "q-psy-5",
    topic: "psychology",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which approach counters emotional trading decisions most directly?",
    options: [
      { id: "a", label: "Trading more often to get used to losing" },
      { id: "b", label: "Watching prices more closely during the session" },
      { id: "c", label: "Rules written before the session, a fixed risk per trade and a pause after losses" },
      { id: "d", label: "Acting on the strongest feeling about the next move" },
    ],
    correct: "c",
    explanation:
      "Emotions are strongest in the moment, so the most reliable countermeasures are decided in advance and leave little to decide under pressure. Watching prices more closely tends to feed urges rather than calm them.",
    lesson: "L13",
  },
  {
    id: "q-psy-6",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "A method with a positive expectancy has just lost five trades in a row. What does that tell you on its own?",
    options: [
      { id: "a", label: "Not much: streaks happen even with a positive expectancy, so check whether the decisions followed the plan" },
      { id: "b", label: "The method has stopped working and should be replaced at once" },
      { id: "c", label: "A win is now due, so the next trade should be larger" },
    ],
    correct: "a",
    explanation:
      "For example, a method that wins 40% of the time is very likely to have a run of five losses somewhere in 100 trades. A streak alone can't separate bad luck from a broken method, and past losses do not make a win 'due', so the next trade should be sized as usual.",
    lesson: "L18",
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
      { id: "a", label: "Take it: the setup is valid, so the session rule doesn't apply" },
      { id: "b", label: "Take it at 2% to recover the losses faster" },
      { id: "c", label: "Follow the session rule: stop for now, journal the three trades and look again next session" },
      { id: "d", label: "Take it, but without a stop so it can't become a fourth loss" },
    ],
    correct: "c",
    explanation:
      "Pause rules are written in advance because judgement is least reliable straight after a streak. Valid setups will come again; breaking the rule because 'this one is good' is the habit the rule exists to stop, and raising risk to recover breaks Risk Discipline.",
    lesson: "L18",
  },
  {
    id: "q-psy-8",
    topic: "psychology",
    kind: "mcq",
    difficulty: 2,
    prompt:
      "After four winning trades, a trader starts skipping the checklist because 'I can read this market now'. Which bias is this most closely linked to?",
    options: [
      { id: "a", label: "Loss aversion" },
      { id: "b", label: "Sunk cost" },
      { id: "c", label: "FOMO" },
      { id: "d", label: "Overconfidence fed by recent results" },
    ],
    correct: "d",
    explanation:
      "A short winning run makes skill feel larger than four trades can show, and recency gives those wins too much weight. The checklist matters just as much after wins as after losses.",
    lesson: "L18",
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
      { id: "b", label: "The plan is broken: switch to a new method straight away" },
      { id: "c", label: "The stops are the problem: trade without them for a while" },
      { id: "d", label: "Double the risk to win the losses back, then review" },
    ],
    correct: "a",
    explanation:
      "When the decisions and risk rules were all sound, a short run of losses says more about chance than about the method. Eight trades are far too few to judge expectancy, and switching method after every streak means no method ever gets enough trades to be judged.",
    lesson: "L18",
  },
  {
    id: "q-psy-10",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "'I've already lost 200.00 on this trade, I can't close it now.' Which trap does this describe?",
    options: [
      { id: "a", label: "FOMO" },
      { id: "b", label: "Sunk cost" },
      { id: "c", label: "Overconfidence" },
    ],
    correct: "b",
    explanation:
      "The 200.00 is already lost whatever you do next; the only question is whether the trade still fits the plan. Holding on to avoid 'making the loss real' is sunk-cost thinking, a close relative of loss aversion.",
    lesson: "L13",
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
      { id: "a", label: "The trend looks strong" },
      { id: "b", label: "I have a good feeling about this one" },
      { id: "c", label: "The last candle closed above the previous swing high" },
      { id: "d", label: "Everyone seems to be buying" },
    ],
    correct: "c",
    explanation:
      "A checkable condition is either true or false on the chart, so two people would agree on it. 'Looks strong' sounds objective but can be argued either way, which leaves room for wishful thinking.",
    lesson: "L14",
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
      { id: "a", label: "Enter: two out of three conditions is enough" },
      { id: "b", label: "No trade: condition 3 is not met" },
      { id: "c", label: "Enter, but move the stop closer so the ratio reaches 2:1" },
      { id: "d", label: "Enter with half the usual size to make up for the missing condition" },
    ],
    correct: "b",
    explanation:
      "The playbook requires every condition, so one 'no' means no trade. Tightening the stop to make the numbers fit puts it inside the noise and changes the trade, not the setup; a smaller size reduces the loss but does not make an incomplete setup valid.",
    lesson: "L14",
  },
  {
    id: "q-dm-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Why write a trading plan before the session rather than during it?",
    options: [
      { id: "a", label: "Because a written plan guarantees profits" },
      { id: "b", label: "So you can skip the stop-loss" },
      { id: "c", label: "So you never need to look at the chart" },
      { id: "d", label: "So the hard decisions are made while calm, before money is at risk" },
    ],
    correct: "d",
    explanation:
      "Under pressure, judgement drifts towards whatever the last few candles suggest. A plan made in advance moves the thinking to a calmer moment; it does not guarantee profits, it makes decisions consistent and reviewable.",
    lesson: "L14",
  },
  {
    id: "q-dm-4",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "A trade made 300.00 vUSD, but you entered without a stop and with twice your usual size. How should you review it?",
    options: [
      { id: "a", label: "As a poor decision with a good outcome: rules were broken, and the profit rewards a risky habit" },
      { id: "b", label: "As a good trade: the profit shows the decision was right" },
      { id: "c", label: "As proof that a larger size works better" },
      { id: "d", label: "It doesn't need reviewing because it made money" },
    ],
    correct: "a",
    explanation:
      "The outcome was good, but the decision broke two risk rules and the potential loss had no limit. This is the most dangerous combination, because the profit makes the habit feel right.",
    lesson: "L17",
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
      { id: "a", label: "A bad decision: it lost money" },
      { id: "b", label: "A bad decision: you should have predicted the news" },
      { id: "c", label: "A good decision with a bad outcome: keep the rule and record the result" },
      { id: "d", label: "A good decision, but place stops further away in future so they are not hit" },
    ],
    correct: "c",
    explanation:
      "The decision fitted the plan and the information available at the time; unscheduled news could not have been known. Losing trades like this are a normal cost of trading, and moving stops further away to avoid them only raises the risk.",
    lesson: "L17",
  },
  {
    id: "q-dm-6",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "When you replay a trade to review it, why should you look only at the candles that were visible at the decision point?",
    options: [
      { id: "a", label: "Because later candles are not saved" },
      { id: "b", label: "To avoid hindsight bias: judging a decision with information you did not have" },
      { id: "c", label: "So the trade looks better than it was" },
    ],
    correct: "b",
    explanation:
      "Once you know what happened, it feels as if it was obvious. Judging the decision against only what was visible at the time shows whether it was sound, rather than whether it was lucky.",
    lesson: "L17",
  },
  {
    id: "q-dm-7",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "MARKET//LAB scores Decision Quality, Risk Discipline and the Simulated Outcome separately. Which combination is possible?",
    options: [
      { id: "a", label: "A trade whose stop was widened mid-trade, with perfect Risk Discipline" },
      { id: "b", label: "A losing trade that automatically scores zero for Decision Quality" },
      { id: "c", label: "A profitable trade with poor Risk Discipline" },
    ],
    correct: "c",
    explanation:
      "The scores are separate precisely so a profit cannot hide a broken rule. Widening a stop always counts against Risk Discipline, and a loss does not by itself make a decision poor.",
    lesson: "L17",
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
      { id: "a", label: "Trade it with 1% risk: the risk rule is what matters" },
      { id: "b", label: "Trade it with 0.5% risk, since it isn't in the plan" },
      { id: "c", label: "Add breakouts to the plan in your head and enter now" },
      { id: "d", label: "No trade; if breakouts interest you, write a breakout playbook and practise it before trading them" },
    ],
    correct: "d",
    explanation:
      "A move outside the playbook is not a setup, however strong it looks, and a smaller size does not make an unplanned trade sound. Writing and practising new rules away from the screen is how a plan grows without becoming improvisation.",
    lesson: "L14",
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
      { id: "b", label: "Trade without a stop next time, since holding would have worked" },
      { id: "c", label: "The trade should never have been taken, because it lost" },
    ],
    correct: "a",
    explanation:
      "Alternatives help you understand a decision, but any single path is partly chance. Holding without a stop happened to work this time; as a habit it leaves losses unlimited, which one trade's outcome cannot show.",
    lesson: "L17",
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
      { id: "a", label: "To predict exactly where price will go" },
      { id: "b", label: "To have a planned action for each plausible path, so no outcome forces an unplanned decision" },
      { id: "c", label: "To find reasons to increase the position size" },
    ],
    correct: "b",
    explanation:
      "Scenario analysis accepts that the next move is unknown and prepares for several. Its value lies in having an action ready for each case, not in picking the right prediction.",
    lesson: "L15",
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
      { id: "a", label: "Bullish breakout: buy on the first close above 60.50 so you don't miss it" },
      { id: "b", label: "None: the stop covers every case" },
      { id: "c", label: "False breakout: a single close above 60.50 followed by a move back into the range means no entry" },
    ],
    correct: "c",
    explanation:
      "A push through resistance that fails is a common path, and without a planned action it invites an impulsive entry. Buying on the first close abandons the two-close rule that protects you from exactly this case; a stop only matters once you are in a trade.",
    lesson: "L15",
  },
  {
    id: "q-sa-3",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which is the best example of a scenario trigger?",
    options: [
      { id: "a", label: "A candle closes below the range floor at 59.00" },
      { id: "b", label: "Price feels weak" },
      { id: "c", label: "The market will probably fall soon" },
      { id: "d", label: "Other traders seem nervous" },
    ],
    correct: "a",
    explanation:
      "A trigger must be observable and unambiguous, so you know the moment a case has begun. Feelings and forecasts can't be checked on the chart and tend to shift with your mood.",
    lesson: "L15",
  },
  {
    id: "q-sa-4",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt:
      "Before entering, you judge the bearish case to be unlikely. If it did happen, however, your loss would be 3% of the account. What should you do?",
    options: [
      { id: "a", label: "Enter anyway, because the case is unlikely" },
      { id: "b", label: "Remove the stop, since the bearish case probably won't happen" },
      { id: "c", label: "Reduce the size, or skip the trade, so the loss in that case stays within your limit" },
    ],
    correct: "c",
    explanation:
      "A plan has to be acceptable in every case, including the unlikely ones. Likelihood estimates are judgements and can be wrong; the risk limit is a rule.",
    lesson: "L15",
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
      { id: "a", label: "No new case: the stop guarantees a loss of exactly 1R" },
      { id: "b", label: "Only the bullish case: events tend to push price up" },
      { id: "c", label: "Widen the stop to 3.00 below entry and keep the same size" },
      { id: "d", label: "A gap through the stop: the loss could be well over 1R, so reduce the size or close before the event" },
    ],
    correct: "d",
    explanation:
      "A stop becomes a market order, so a gap fills at the open, possibly far beyond the stop. Planning for that case means accepting the larger possible loss or reducing exposure before the event; widening the stop just raises the risk further.",
    lesson: "L15",
  },
  {
    id: "q-sa-6",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "After a trade, how should you judge your scenario plan?",
    options: [
      { id: "a", label: "By whether it covered what happened and whether you followed it" },
      { id: "b", label: "By the profit or loss alone" },
      { id: "c", label: "By how many cases it listed" },
    ],
    correct: "a",
    explanation:
      "A stop-out in a case you planned for is a plan well executed, while a win in a case you never considered was luck. Listing many cases is pointless if they don't cover the likely paths or you don't follow them.",
    lesson: "L15",
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
      { id: "a", label: "Hold until the stop or the target is hit, however long it takes" },
      { id: "b", label: "Close the trade, as the sideways case says" },
      { id: "c", label: "Add to the position, since it hasn't lost" },
      { id: "d", label: "Move the target closer so it is hit sooner" },
    ],
    correct: "b",
    explanation:
      "The sideways case has been triggered, and you decided its action while calm. A breakout that doesn't move has not done what the idea required; holding on, adding units or moving the target are all unplanned decisions made in the moment.",
    lesson: "L15",
  },
  {
    id: "q-sa-8",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which three cases make up the simple scenario frame?",
    options: [
      { id: "a", label: "Buy, sell and hold" },
      { id: "b", label: "Win, lose and break even" },
      { id: "c", label: "Bullish, bearish and sideways" },
    ],
    correct: "c",
    explanation:
      "The frame describes what the market might do: the idea works, it fails, or nothing much happens. Buy, sell and hold are your possible actions, which you then attach to each case.",
    lesson: "L15",
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
      { id: "a", label: "−0.45R, because the bearish case is the most likely" },
      { id: "b", label: "+0.80R, because the bullish case pays 2R" },
      { id: "c", label: "+0.35R, and it is guaranteed over time" },
      { id: "d", label: "+0.35R, but it is only as reliable as your probability estimates" },
    ],
    correct: "d",
    explanation:
      "0.40 × 2 − 0.45 × 1 + 0.15 × 0 = +0.35R. The calculation is exact, but the inputs are your judgement, so the result is an estimate; it does not need the most likely case to be the profitable one.",
    lesson: "L15",
  },
];
