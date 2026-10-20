import { atr, lowestLow } from "../indicators";
import type { MissionDef } from "../schema";
import { EQUITY, LONG_ONLY, hyp, num, p, sizedBuy } from "./common";

const DECISION = 55;

const HYP_REASONS = [
  { id: "trend_intact", label: "The uptrend is still intact" },
  { id: "pullback_held", label: "The pullback held above the previous swing" },
  { id: "bounce", label: "Price is bouncing off the pullback low" },
  { id: "feeling", label: "Just a feeling" },
];

export const M04: MissionDef = {
  id: "M04",
  version: 1,
  title: "Define Your Risk",
  tagline: "Decide where you're wrong before you decide to buy.",
  skillPrimary: "risk_management",
  skillsSecondary: ["order_mechanics", "scenario_analysis"],
  difficulty: 2,
  estMinutes: 5,
  objective: "Place a stop-loss where the idea is actually invalidated, and keep the loss within 1% of the account.",
  briefing:
    "LABX has been trending up. It just pulled back and started to bounce. You've already decided to buy — that part isn't the lesson. The lesson is the stop: where would this idea be clearly wrong, and how much can being wrong cost you?",
  rulesText: ["Long only.", "Risk at most 1% of equity (100.00 vUSD) on this trade.", "Spread 0.10, commission 0.05% per fill."],
  dataLabel: "synthetic",
  symbol: "LABX",
  variants: [
    { key: "a", label: "The trend resumed and rallied" },
    { key: "b", label: "Price broke below the pullback low, then recovered" },
    { key: "c", label: "Price went sideways" },
  ],
  startStep: DECISION,
  equity: EQUITY,
  rules: LONG_ONLY,
  facts: ({ visible, step }) => {
    const swingLow = lowestLow(visible, step - 12, step);
    const a = atr(visible, step);
    return { swingLow, atr: a, suggestedStop: swingLow - Math.round(a * 0.25) };
  },
  checkpoints: [
    {
      id: "entry",
      kind: "decision",
      trigger: { atStep: DECISION },
      title: "Place the order",
      prompt: (f) =>
        `Buy LABX with a stop-loss where the idea is wrong. The pullback low is ${p(num(f.swingLow))}. Size the position so being wrong costs at most 1% (100.00 vUSD).`,
      options: [{ id: "enter", label: "Open the order ticket", action: "enter" }],
      ticket: {
        sides: ["buy"],
        orderTypes: ["market", "limit"],
        requireHypothesis: true,
        hypothesisReasons: HYP_REASONS,
        defaults: () => ({ riskPct: 1 }),
      },
      cards: [
        { fact: "swingLow", label: "Pullback low", format: "price" },
        { fact: "atr", label: "Average candle range (ATR 14)", format: "price" },
      ],
      highlight: (f) => ({ levels: [{ price: num(f.swingLow), label: "Pullback low", tone: "warn" }] }),
    },
  ],
  rubric: (f) => [
    { id: "inv", label: "Defined invalidation before entering", evaluator: "invalidation_before_entry", weight: 20, skill: "risk_management", appliesIf: "entered" },
    {
      id: "level",
      label: "Stop placed beyond the level that invalidates the idea",
      evaluator: "stop_beyond_level",
      weight: 35,
      skill: "risk_management",
      appliesIf: "entered",
      params: { level: num(f.swingLow), levelLabel: "pullback low" },
    },
    { id: "risk", label: "Risk within 1% of equity", evaluator: "risk_within_limit", weight: 25, skill: "risk_management", appliesIf: "entered", params: { maxPct: 1 } },
    {
      id: "hyp",
      label: "Stated a hypothesis with evidence",
      evaluator: "hypothesis_stated",
      weight: 20,
      skill: "scenario_analysis",
      appliesIf: "entered",
      params: { weakReasons: { feeling: "no_hypothesis" } },
    },
  ],
  alternatives: [
    {
      id: "textbook",
      label: "Stop below the pullback low, 1% risk",
      description: "The stop sits where the idea is wrong; size follows from it.",
      answers: {
        entry: (f, ctx) => ({ optionId: "enter", reasons: [], hypothesis: hyp(["trend_intact", "bounce"]), order: sizedBuy(ctx, num(f.suggestedStop)) }),
      },
    },
    {
      id: "tight",
      label: "Tight stop, as many units as possible",
      description: "A stop just under the entry so the loss looks small, with a big position.",
      answers: {
        entry: (_f, ctx) => {
          const stop = Math.round(ctx.ask * 0.993);
          return { optionId: "enter", reasons: [], hypothesis: hyp(["bounce"]), order: sizedBuy(ctx, stop, 1) };
        },
      },
    },
    {
      id: "nostop",
      label: "No stop at all",
      description: "Buy 40 units and decide later.",
      answers: {
        entry: () => ({ optionId: "enter", reasons: [], hypothesis: hyp(["feeling"], "high"), order: { side: "buy", orderType: "market", qty: 40, stopLoss: null, takeProfit: null } }),
      },
    },
  ],
  reflection: {
    question: "If your stop had been hit, would this still have been a good decision?",
    options: [
      { id: "yes", label: "Yes: the loss was planned and limited" },
      { id: "no", label: "No: a loss means the decision was wrong" },
      { id: "unsure", label: "I'm not sure" },
    ],
  },
  targets: ["no_stop", "stop_inside_noise", "risk_over_limit", "no_hypothesis"],
  prerequisites: [{ skill: "market_basics", level: "developing" }],
};
