import type { Candle } from "@market-lab/engine";
import { highestHigh, lowestLow, pctChange } from "../indicators";
import type { Facts, MissionDef } from "../schema";
import { EQUITY, LONG_ONLY, hyp, num, p, sizedBuy } from "./common";

const RANGE_END = 59;
const DECISION = 71;

const HYP_REASONS = [
  { id: "momentum", label: "Strong momentum" },
  { id: "breakout", label: "Clean breakout from the range" },
  { id: "volume", label: "Volume is rising" },
  { id: "fomo", label: "I don't want to miss the move" },
];

const SKIP_REASONS = [
  { id: "extended", label: "The move is already extended" },
  { id: "no_level", label: "There's no nearby level to define my risk" },
  { id: "too_much_risk", label: "A sensible stop would mean too much risk" },
  { id: "mood", label: "I'm just not in the mood" },
];

/** Deepest drop from a running highest close to a later low, between the decision and `to`. */
function deepestPullback(visible: readonly Candle[], to: number): number {
  let peak = visible[DECISION].c;
  let deepest = 0;
  for (let i = DECISION + 1; i <= to; i++) {
    deepest = Math.max(deepest, (peak - visible[i].l) / peak);
    peak = Math.max(peak, visible[i].c);
  }
  return deepest;
}

/** A pullback of ≥3% from a closing high, then a close above the previous two highs while above the old range. */
export function m06Confirmation(visible: readonly Candle[], facts: Facts): boolean {
  const k = visible.length - 1;
  if (k < DECISION + 2) return false;
  const last = visible[k];
  return (
    deepestPullback(visible, k - 1) >= 0.03 &&
    last.c > Math.max(visible[k - 1].h, visible[k - 2].h) &&
    last.c > num(facts.breakoutLevel)
  );
}

export const M06: MissionDef = {
  id: "M06",
  version: 1,
  title: "The FOMO Trap",
  tagline: "The move already happened. Now what?",
  skillPrimary: "decision_discipline",
  skillsSecondary: ["risk_management", "scenario_analysis"],
  difficulty: 3,
  estMinutes: 6,
  objective: "Recognize the risk of an impulsive entry after a strong move, and act on a plan instead of the urge.",
  briefing:
    "LABX spent a long time in a quiet range. Then it broke out and ran 12% in a dozen candles. Everyone is talking about it. The market might keep going, pause, or reverse — nothing here assumes which. What matters is how you decide.",
  rulesText: ["Long only.", "Every entry needs a defined exit.", "Risk at most 2% of equity per trade.", "Waiting and passing are valid decisions."],
  dataLabel: "synthetic",
  symbol: "LABX",
  variants: [
    { key: "a", label: "The move kept going without a meaningful pullback" },
    { key: "b", label: "Price pulled back, confirmed, and resumed higher" },
    { key: "c", label: "The breakout failed and price fell back into the range" },
  ],
  startStep: DECISION,
  equity: EQUITY,
  rules: { ...LONG_ONLY, maxRiskPct: 2 },
  facts: ({ visible, step }) => {
    const breakoutLevel = highestHigh(visible, 0, RANGE_END);
    const close = visible[step].c;
    const f: Facts = {
      breakoutLevel,
      move12: Math.round(pctChange(visible[RANGE_END].c, visible[DECISION].c) * 10) / 10,
      distBreakout: Math.round(pctChange(breakoutLevel, close) * 10) / 10,
      recentLow: lowestLow(visible, step - 4, step),
    };
    if (step > DECISION) {
      f.pullbackLow = lowestLow(visible, DECISION + 1, step);
      f.pullbackPct = Math.round(deepestPullback(visible, step) * 1000) / 10;
    }
    return f;
  },
  checkpoints: [
    {
      id: "entry",
      kind: "decision",
      trigger: { atStep: DECISION },
      title: "The move is on",
      prompt: (f) => `LABX is up ${f.move12}% in 12 candles and ${f.distBreakout}% above its old range. What do you do?`,
      options: [
        { id: "enter_now", label: "Buy now", description: "Open the order ticket at the current price.", action: "enter" },
        {
          id: "wait",
          label: "Wait for confirmation",
          description: "Enter only after a pullback of at least 3%, then a close back above the previous two candles, while price holds above the old range.",
          action: "wait",
          next: "confirm",
        },
        { id: "skip", label: "Pass on this one", description: "No trade. Pick your reason.", action: "skip", requiresReason: true },
      ],
      reasons: SKIP_REASONS,
      ticket: { sides: ["buy"], orderTypes: ["market", "limit"], requireHypothesis: true, hypothesisReasons: HYP_REASONS, defaults: () => ({ riskPct: 1 }) },
      cards: [
        { fact: "move12", label: "Move in the last 12 candles", format: "pct" },
        { fact: "distBreakout", label: "Above the old range high", format: "pct" },
        { fact: "recentLow", label: "Low of the last 5 candles", format: "price" },
      ],
      highlight: (f) => ({ levels: [{ price: num(f.breakoutLevel), label: "Old range high", tone: "neutral" }] }),
    },
    {
      id: "confirm",
      kind: "decision",
      onlyVia: true,
      trigger: { condition: m06Confirmation, maxSteps: 20, onTimeout: "conclude", waitingText: "Waiting for a pullback and a confirming close…" },
      title: "Confirmation",
      prompt: (f) =>
        `Your condition printed: a ${f.pullbackPct}% pullback, then a close above the previous two candles. The pullback low is ${p(num(f.pullbackLow))}.`,
      options: [
        { id: "enter", label: "Buy on the confirmation", action: "enter" },
        { id: "pass", label: "Pass anyway", action: "skip" },
      ],
      reasons: SKIP_REASONS,
      ticket: { sides: ["buy"], orderTypes: ["market", "limit"], requireHypothesis: true, hypothesisReasons: HYP_REASONS, defaults: () => ({ riskPct: 1 }) },
      cards: [
        { fact: "pullbackPct", label: "Pullback from the high", format: "pct" },
        { fact: "pullbackLow", label: "Pullback low", format: "price" },
      ],
      highlight: (f) => ({
        levels: [
          { price: num(f.breakoutLevel), label: "Old range high", tone: "neutral" },
          { price: num(f.pullbackLow), label: "Pullback low", tone: "warn" },
        ],
      }),
    },
  ],
  rubric: () => [
    {
      id: "hyp",
      label: "Stated a hypothesis based on evidence",
      evaluator: "hypothesis_stated",
      weight: 25,
      skill: "scenario_analysis",
      appliesIf: "entered",
      params: { weakReasons: { fomo: "chased_entry" } },
    },
    { id: "inv", label: "Defined invalidation before entering", evaluator: "invalidation_before_entry", weight: 30, skill: "risk_management", appliesIf: "entered" },
    {
      id: "unc",
      label: "Acknowledged uncertainty",
      evaluator: "uncertainty_acknowledged",
      weight: 20,
      skill: "decision_discipline",
      params: { checkpoint: "entry", waitOption: "wait", validSkipReasons: ["extended", "no_level", "too_much_risk"] },
    },
    { id: "rules", label: "Followed the scenario rules", evaluator: "followed_rules", weight: 25, skill: "decision_discipline", params: { maxPct: 2 } },
  ],
  alternatives: [
    {
      id: "wait",
      label: "Wait for confirmation",
      description: "Enter only if the pullback-and-close condition prints, with a stop under the pullback low and 1% risk.",
      answers: {
        entry: () => ({ optionId: "wait", reasons: [] }),
        confirm: (f, ctx) => ({ optionId: "enter", reasons: [], hypothesis: hyp(["breakout"]), order: sizedBuy(ctx, num(f.pullbackLow) - 10) }),
      },
    },
    {
      id: "enter_with_stop",
      label: "Buy now, with a stop and 1% risk",
      description: "Take the move, but under the 5-candle low and sized to 1%.",
      answers: {
        entry: (f, ctx) => ({ optionId: "enter_now", reasons: [], hypothesis: hyp(["momentum", "breakout"]), order: sizedBuy(ctx, num(f.recentLow) - 10) }),
      },
    },
    {
      id: "skip",
      label: "Pass: the move is extended",
      description: "No trade.",
      answers: { entry: () => ({ optionId: "skip", reasons: ["extended"] }) },
    },
  ],
  reflection: {
    question: "Would you have made the same decision if you hadn't just watched the move happen?",
    options: [
      { id: "yes", label: "Yes, my reasons were about the setup" },
      { id: "no", label: "No, the move itself pulled me in" },
      { id: "unsure", label: "I'm not sure" },
    ],
  },
  targets: ["chased_entry", "no_stop", "no_hypothesis"],
  prerequisites: [{ skill: "risk_management", level: "developing" }],
};
