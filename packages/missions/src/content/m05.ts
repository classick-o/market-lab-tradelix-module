import { maxQtyForRisk } from "@market-lab/engine";
import { atr, lowestLow } from "../indicators";
import type { MissionDef } from "../schema";
import { EQUITY, LONG_ONLY, hyp, num, p } from "./common";

const DECISION = 52;
const BPS = 5;

export const M05: MissionDef = {
  id: "M05",
  version: 1,
  title: "Size Matters",
  tagline: "Your stop decides your size, not the other way around.",
  skillPrimary: "position_sizing",
  skillsSecondary: ["risk_management"],
  difficulty: 2,
  estMinutes: 5,
  objective: "Turn a risk budget and a stop into the right number of units, including trading costs.",
  briefing:
    "The plan is already made: buy here, with the stop just below support. What's left is the question most beginners skip: how many units? Too many and a normal loss becomes a big one. You'll calculate it first, then place the order.",
  rulesText: ["Long only.", "Risk 1% of equity: 100.00 vUSD.", "Spread 0.10, commission 0.05% per fill (charged on entry and exit)."],
  dataLabel: "synthetic",
  symbol: "LABX",
  variants: [
    { key: "a", label: "The trend resumed" },
    { key: "b", label: "Price fell through the stop, then recovered" },
    { key: "c", label: "Price went sideways" },
  ],
  startStep: DECISION,
  equity: EQUITY,
  rules: LONG_ONLY,
  facts: ({ visible, step, ask, equity }) => {
    const swingLow = lowestLow(visible, step - 10, step);
    const stop = swingLow - Math.round(atr(visible, step) * 0.15);
    const sizing = maxQtyForRisk({ equity, riskPct: 1, side: "long", entry: ask, stop, commissionBps: BPS });
    return { ask, stop, perUnit: ask - stop, simpleQty: sizing.simpleQty, costQty: sizing.qty, budget: sizing.budget };
  },
  checkpoints: [
    {
      id: "calc",
      kind: "numeric",
      trigger: { atStep: DECISION },
      title: "Calculate the size",
      prompt: (f) =>
        `You'll buy at the ask, ${p(num(f.ask))}, with a stop at ${p(num(f.stop))}. Your account is 10,000.00 and you'll risk 1% (100.00). How many whole units can you buy?`,
      numeric: { label: "Units", unit: "units" },
      cards: [
        { fact: "ask", label: "Entry (ask)", format: "price" },
        { fact: "stop", label: "Planned stop", format: "price" },
        { fact: "perUnit", label: "Risk per unit (entry − stop)", format: "price" },
      ],
      highlight: (f) => ({ levels: [{ price: num(f.stop), label: "Planned stop", tone: "bad" }] }),
    },
    {
      id: "order",
      kind: "decision",
      trigger: { atStep: DECISION },
      title: "Place the order",
      prompt: "Now place the buy order with that stop. The sizing helper in the ticket shows the cost-aware maximum.",
      options: [{ id: "enter", label: "Open the order ticket", action: "enter" }],
      ticket: {
        sides: ["buy"],
        orderTypes: ["market"],
        requireHypothesis: false,
        hypothesisReasons: [],
        defaults: (f) => ({ stopLoss: num(f.stop), riskPct: 1 }),
        lockStop: true,
      },
      highlight: (f) => ({ levels: [{ price: num(f.stop), label: "Planned stop", tone: "bad" }] }),
    },
  ],
  rubric: (f) => [
    {
      id: "calc",
      label: "Calculated the position size",
      evaluator: "numeric",
      weight: 40,
      skill: "position_sizing",
      params: {
        checkpoint: "calc",
        min: num(f.costQty),
        max: num(f.simpleQty),
        partial: 0.2,
        unit: "units",
        explain: `The textbook formula gives ${f.simpleQty} (100.00 ÷ ${p(num(f.perUnit))}). After the spread and both commissions, the true maximum is ${f.costQty}. Both count as correct here.`,
      },
    },
    { id: "size", label: "Order size fits the 1% budget", evaluator: "size_matches_risk", weight: 35, skill: "position_sizing", appliesIf: "entered", params: { riskPct: 1 } },
    { id: "inv", label: "Kept the stop on the order", evaluator: "invalidation_before_entry", weight: 10, skill: "risk_management", appliesIf: "entered" },
    { id: "risk", label: "Risk within 1% of equity", evaluator: "risk_within_limit", weight: 15, skill: "risk_management", appliesIf: "entered", params: { maxPct: 1 } },
  ],
  alternatives: [
    {
      id: "cost_aware",
      label: "Cost-aware size",
      description: "Units = the largest size whose loss at the stop, including costs, stays within 100.00.",
      answers: {
        calc: (f) => ({ reasons: [], numeric: num(f.costQty) }),
        order: (f) => ({ optionId: "enter", reasons: [], hypothesis: hyp(["trend"]), order: { side: "buy", orderType: "market", qty: num(f.costQty), stopLoss: num(f.stop), takeProfit: null } }),
      },
    },
    {
      id: "textbook",
      label: "Textbook size, ignoring costs",
      description: "100.00 ÷ (entry − stop), rounded down.",
      answers: {
        calc: (f) => ({ reasons: [], numeric: num(f.simpleQty) }),
        order: (f) => ({ optionId: "enter", reasons: [], hypothesis: hyp(["trend"]), order: { side: "buy", orderType: "market", qty: num(f.simpleQty), stopLoss: num(f.stop), takeProfit: null } }),
      },
    },
    {
      id: "all_in",
      label: "All in",
      description: "As many units as the account can buy, same stop.",
      answers: {
        calc: (f) => ({ reasons: [], numeric: Math.floor(EQUITY / num(f.ask)) }),
        order: (f) => ({
          optionId: "enter",
          reasons: [],
          hypothesis: hyp(["trend"], "high"),
          order: { side: "buy", orderType: "market", qty: Math.floor((EQUITY * 0.99) / num(f.ask)), stopLoss: num(f.stop), takeProfit: null },
        }),
      },
    },
  ],
  reflection: {
    question: "Why is the cost-aware size smaller than the textbook size?",
    options: [
      { id: "spread", label: "Because of the spread" },
      { id: "commission", label: "Because of commissions" },
      { id: "both", label: "Both" },
      { id: "unsure", label: "Not sure yet" },
    ],
  },
  targets: ["sizing_math", "oversized", "risk_over_limit"],
  prerequisites: [{ skill: "risk_management", level: "developing" }],
};
