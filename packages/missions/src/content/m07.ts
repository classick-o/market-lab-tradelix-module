import { maxQtyForRisk } from "@market-lab/engine";
import type { MissionDef } from "../schema";
import { EQUITY, LONG_ONLY, num, p } from "./common";

const OPENED = 39;
const DECISION = 49;
const HALF_SPREAD = 5;

const REASONS = [
  { id: "plan_holds", label: "My plan and my stop still make sense" },
  { id: "setup_changed", label: "Something in the setup has changed" },
  { id: "avoid_loss", label: "I don't want to take the loss" },
  { id: "nervous", label: "I'm nervous about it" },
];

export const M07: MissionDef = {
  id: "M07",
  version: 1,
  title: "Stop or Stay?",
  tagline: "Your trade is going against you. The plan is already written.",
  skillPrimary: "decision_discipline",
  skillsSecondary: ["risk_management"],
  difficulty: 3,
  estMinutes: 5,
  objective: "Manage an open position according to the plan you made before entering, especially when it hurts.",
  briefing:
    "You're already in a trade. Before entering, with a clear head, you wrote down a plan: a stop 3% below your entry and a target 6% above it, and a rule not to widen the stop. Since then, price has drifted against you.",
  rulesText: ["The position is already open.", "Your written plan: exit at the stop or the target. Don't widen the stop."],
  dataLabel: "synthetic",
  symbol: "LABX",
  variants: [
    { key: "a", label: "The stop was hit, then price recovered strongly" },
    { key: "b", label: "Price bounced and reached the target" },
    { key: "c", label: "The stop was hit and price kept falling" },
  ],
  startStep: OPENED,
  equity: EQUITY,
  rules: { ...LONG_ONLY, orderTypes: ["market"] },
  facts: ({ visible, bid }) => {
    const entry = visible[OPENED].c + HALF_SPREAD;
    const planStop = Math.round(entry * 0.97);
    const planTarget = Math.round(entry * 1.06);
    const planQty = maxQtyForRisk({ equity: EQUITY, riskPct: 1, side: "long", entry, stop: planStop, commissionBps: 5 }).qty;
    return {
      planEntry: entry,
      planStop,
      planTarget,
      planQty,
      widerStop: Math.round(entry * 0.94),
      distToStop: Math.round(((bid - planStop) / bid) * 1000) / 10,
      openPnl: (bid - entry) * planQty,
    };
  },
  setup: (f) => [
    { type: "submit_order", side: "buy", orderType: "market", qty: num(f.planQty), stopLoss: num(f.planStop), takeProfit: num(f.planTarget) },
  ],
  setupText: "You bought LABX with a stop 3% below and a target 6% above your entry, sized to risk 1% of the account.",
  checkpoints: [
    {
      id: "manage",
      kind: "manage",
      trigger: { atStep: DECISION },
      title: "It's going against you",
      prompt: (f) =>
        `Price is ${f.distToStop}% above your stop (${p(num(f.planStop))}). Your open loss is ${p(Math.abs(num(f.openPnl)))} vUSD. What do you do?`,
      options: [
        { id: "hold", label: "Hold: stick to the plan", description: "The stop and target stay where they are.", action: "hold" },
        { id: "close", label: "Close now, before the stop", description: "Take the smaller loss now.", action: "close" },
        { id: "close_half", label: "Close half the position", description: "Reduce exposure, keep the rest on the plan.", action: "close_half" },
        { id: "widen", label: "Move the stop lower to give it room", description: "New stop 6% below your entry.", action: "widen_stop", stopFact: "widerStop" },
      ],
      reasons: REASONS,
      requireReason: true,
      cards: [
        { fact: "planStop", label: "Your stop", format: "price" },
        { fact: "planTarget", label: "Your target", format: "price" },
        { fact: "distToStop", label: "Distance to stop", format: "pct" },
      ],
    },
  ],
  rubric: () => [
    {
      id: "plan",
      label: "Followed the plan made before entering",
      evaluator: "choice",
      weight: 50,
      skill: "decision_discipline",
      params: {
        checkpoint: "manage",
        credit: { hold: 1, close_half: 0.7, close: 0.6, widen: 0 },
        explain: {
          hold: "You let the plan do its job. Whether the stop got hit or not, the risk was decided in advance, with a clear head.",
          close: "Exiting early isn't a disaster, it reduced risk, but it overrides a plan made with a clear head. Do it when the setup has actually changed, not because it hurts.",
          close_half: "A compromise: less exposure, but still a deviation from the written plan.",
          widen: "Widening the stop raises the loss you already decided was acceptable. It's the most common way small losses become large ones.",
        },
        tags: { widen: ["moved_stop_away"] },
      },
    },
    { id: "widen", label: "Didn't move the stop further away", evaluator: "no_stop_widening", weight: 30, skill: "risk_management" },
    {
      id: "reason",
      label: "Decided for a reason, not a feeling",
      evaluator: "reason_given",
      weight: 20,
      skill: "decision_discipline",
      params: { checkpoint: "manage", weakReasons: { avoid_loss: "loss_aversion", nervous: "loss_aversion" } },
    },
  ],
  alternatives: [
    { id: "hold", label: "Hold to the plan", description: "Stop and target unchanged.", answers: { manage: () => ({ optionId: "hold", reasons: ["plan_holds"] }) } },
    { id: "close", label: "Close early", description: "Exit at the current price.", answers: { manage: () => ({ optionId: "close", reasons: ["nervous"] }) } },
    { id: "widen", label: "Widen the stop", description: "Move the stop to 6% below entry.", answers: { manage: () => ({ optionId: "widen", reasons: ["avoid_loss"] }) } },
  ],
  reflection: {
    question: "What would be a good reason to change a stop in the middle of a trade?",
    options: [
      { id: "new_info", label: "New information that invalidates the setup" },
      { id: "pain", label: "The trade hurting more than expected" },
      { id: "never", label: "Never" },
      { id: "unsure", label: "Not sure" },
    ],
  },
  targets: ["moved_stop_away", "loss_aversion"],
  prerequisites: [{ skill: "risk_management", level: "developing" }],
};
