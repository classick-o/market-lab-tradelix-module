import { averageVolume, highestHigh, lowestLow } from "../indicators";
import type { MissionDef } from "../schema";
import { EQUITY, LONG_ONLY, hyp, num, sizedBuy } from "./common";

const DECISION = 54;

const CHECKLIST = [
  { id: "c1", label: "The last candle closed above the 30-candle high" },
  { id: "c2", label: "The last candle's volume is above the 20-candle average" },
  { id: "c3", label: "A stop below the last 3 candles' low is within 3% of price" },
];

export const M10: MissionDef = {
  id: "M10",
  version: 1,
  title: "No Trade Is a Trade",
  tagline: "A playbook is as much about the trades you don't take.",
  skillPrimary: "decision_discipline",
  skillsSecondary: ["scenario_analysis", "risk_management"],
  difficulty: 3,
  estMinutes: 4,
  objective: "Check a setup against a written playbook, and act only when every condition is met.",
  briefing:
    "You wrote a simple breakout playbook for LABX. Something just happened on the chart and it looks exciting. Before you do anything, check each condition honestly. If one fails, the playbook's answer is no trade.",
  rulesText: [
    "Playbook: enter long only if all three conditions are true right now.",
    "1 · The last candle closed above the high of the previous 30 candles.",
    "2 · Its volume is above the average of the previous 20 candles.",
    "3 · A stop below the last 3 candles' low is within 3% of price.",
    "Risk 1% of equity if you enter.",
  ],
  dataLabel: "synthetic",
  symbol: "LABX",
  variants: [
    { key: "a", label: "A volume spike inside the range: no breakout" },
    { key: "b", label: "A real breakout that met every condition" },
    { key: "c", label: "A breakout on weak volume that faded" },
  ],
  startStep: DECISION,
  equity: EQUITY,
  rules: { ...LONG_ONLY, orderTypes: ["market"] },
  facts: ({ visible, step }) => {
    const last = visible[step];
    const rangeHigh = highestHigh(visible, step - 30, step - 1);
    const avgVol = averageVolume(visible, step - 20, step - 1);
    const low3 = lowestLow(visible, step - 2, step);
    const cond1 = last.c > rangeHigh;
    const cond2 = last.v > avgVol;
    const cond3 = (last.c - low3) / last.c <= 0.03;
    return { close: last.c, volume: last.v, rangeHigh, avgVol, low3, cond1, cond2, cond3, allMet: cond1 && cond2 && cond3 };
  },
  checkpoints: [
    {
      id: "decide",
      kind: "decision",
      trigger: { atStep: DECISION },
      title: "Check the playbook",
      prompt: "Tick every condition that is true right now, then decide.",
      checklist: CHECKLIST,
      options: [
        { id: "enter", label: "Enter long", description: "All conditions are met.", action: "enter" },
        { id: "skip", label: "No trade", description: "At least one condition fails.", action: "skip" },
      ],
      ticket: { sides: ["buy"], orderTypes: ["market"], requireHypothesis: false, hypothesisReasons: [], defaults: (f) => ({ stopLoss: num(f.low3) - 5, riskPct: 1 }) },
      cards: [
        { fact: "rangeHigh", label: "30-candle high", format: "price" },
        { fact: "close", label: "Last close", format: "price" },
        { fact: "volume", label: "Last volume", format: "int" },
        { fact: "avgVol", label: "20-candle average volume", format: "int" },
        { fact: "low3", label: "Low of the last 3 candles", format: "price" },
      ],
      highlight: (f) => ({ candle: DECISION, levels: [{ price: num(f.rangeHigh), label: "30-candle high", tone: "neutral" }] }),
    },
  ],
  rubric: (f) => [
    {
      id: "check",
      label: "Assessed each condition correctly",
      evaluator: "checklist",
      weight: 40,
      skill: "scenario_analysis",
      params: {
        checkpoint: "decide",
        items: CHECKLIST.map((c, i) => ({ ...c, truth: Boolean(f[`cond${i + 1}`]) })),
      },
    },
    { id: "consistent", label: "Acted on the playbook", evaluator: "playbook_consistency", weight: 40, skill: "decision_discipline", params: { checkpoint: "decide", allMet: Boolean(f.allMet) } },
    { id: "risk", label: "Risk within 1% if entered", evaluator: "risk_within_limit", weight: 20, skill: "risk_management", appliesIf: "entered", params: { maxPct: 1 } },
  ],
  alternatives: [
    {
      id: "playbook",
      label: "Follow the playbook strictly",
      description: "Enter with 1% risk only if all three conditions are true; otherwise no trade.",
      answers: {
        decide: (f, ctx) => {
          const checklist = { c1: Boolean(f.cond1), c2: Boolean(f.cond2), c3: Boolean(f.cond3) };
          return f.allMet
            ? { optionId: "enter", reasons: [], checklist, hypothesis: hyp(["breakout"]), order: sizedBuy(ctx, num(f.low3) - 5) }
            : { optionId: "skip", reasons: [], checklist };
        },
      },
    },
    {
      id: "always",
      label: "Trade every spike",
      description: "Enter whenever something exciting happens, same stop and size.",
      answers: {
        decide: (f, ctx) => ({ optionId: "enter", reasons: [], checklist: { c1: true, c2: true, c3: true }, hypothesis: hyp(["momentum"], "high"), order: sizedBuy(ctx, num(f.low3) - 5) }),
      },
    },
  ],
  reflection: {
    question: "How did this decision feel?",
    options: [
      { id: "relief", label: "Relieved to have clear rules" },
      { id: "frustrated", label: "Frustrated: I wanted to trade" },
      { id: "neutral", label: "Neutral" },
    ],
  },
  targets: ["broke_playbook", "misread_conditions", "missed_valid_setup"],
  prerequisites: [{ skill: "market_structure", level: "developing" }],
};
