import {
  ENGINE_VERSION,
  advance,
  apply,
  bidAsk,
  createContext,
  equityOf,
  finish,
  formatPrice,
  initState,
  previewOrder,
  unrealizedPnl,
  type Action,
  type EngineEvent,
  type SimContext,
  type SimState,
} from "@market-lab/engine";
import type { EntryView, StopChangeView } from "@market-lab/evaluation";
import { getScenario } from "./data";
import {
  DEFAULT_COSTS,
  type CheckpointAnswer,
  type CheckpointDef,
  type FactContext,
  type Facts,
  type MissionDef,
  type OptionDef,
  type VariantDef,
} from "./schema";

export interface Frame {
  step: number;
  equity: number;
  realized: number;
  unrealized: number;
  fees: number;
  position: { side: "long" | "short"; qty: number; avgEntry: number; stopLoss: number | null; takeProfit: number | null } | null;
  orders: { id: string; side: "buy" | "sell"; qty: number; limitPrice: number }[];
}

export type MissionEvent =
  | { kind: "engine"; step: number; event: EngineEvent; by: "user" | "system" | "market" }
  | { kind: "checkpoint"; step: number; checkpointId: string; title: string }
  | { kind: "note"; step: number; text: string };

export interface VisitedCheckpoint {
  def: CheckpointDef;
  step: number;
  facts: Facts;
  prompt: string;
  answer?: CheckpointAnswer;
}

export interface LoggedAnswer {
  checkpointId: string;
  answer: CheckpointAnswer;
}

export interface MissionRun {
  mission: MissionDef;
  variantIdx: number;
  variant: VariantDef;
  ctx: SimContext;
  datasetHash: string;
  engineVersion: string;
  startStep: number;
  endStep: number;
  step: number;
  state: SimState;
  frames: Record<number, Frame>;
  events: MissionEvent[];
  visited: VisitedCheckpoint[];
  current: VisitedCheckpoint | null;
  phase: "checkpoint" | "concluded";
  entries: EntryView[];
  stopChanges: StopChangeView[];
  facts: Facts;
  error: string | null;
}

class AnswerError extends Error {}

export function missionContext(m: MissionDef, variantIdx: number): { ctx: SimContext; hash: string } {
  const variant = m.variants[variantIdx];
  if (!variant) throw new Error(`Mission ${m.id} has no variant ${variantIdx}.`);
  const { candles, hash } = getScenario(`${m.id}-${variant.key}`);
  const ctx = createContext({ symbol: m.symbol, initialEquity: m.equity, costs: m.costs ?? DEFAULT_COSTS, rules: m.rules }, candles);
  return { ctx, hash };
}

function frameOf(ctx: SimContext, s: SimState): Frame {
  const mark = ctx.candles[s.step].c;
  const p = s.position;
  return {
    step: s.step,
    equity: equityOf(ctx, s),
    realized: s.realized,
    unrealized: unrealizedPnl(p, mark),
    fees: s.fees,
    position: p
      ? { side: p.side, qty: p.qty, avgEntry: Math.round(p.costBasis / p.qty), stopLoss: p.stopLoss, takeProfit: p.takeProfit }
      : null,
    orders: s.orders.map((o) => ({ id: o.id, side: o.side, qty: o.qty, limitPrice: o.limitPrice })),
  };
}

function nextInSequence(m: MissionDef, after: CheckpointDef | null): CheckpointDef | null {
  const start = after ? m.checkpoints.indexOf(after) + 1 : 0;
  return m.checkpoints.slice(start).find((c) => !c.onlyVia) ?? null;
}

export function optionOf(cp: CheckpointDef, answer: CheckpointAnswer): OptionDef | undefined {
  return cp.options?.find((o) => o.id === answer.optionId);
}

/**
 * Checks an answer against the checkpoint and the current engine state. Returns a message for the
 * user, or null when the answer can be committed.
 */
export function validateAnswer(run: MissionRun, answer: CheckpointAnswer): string | null {
  const cp = run.current;
  if (!cp) return "There is no open decision.";
  const def = cp.def;
  const option = optionOf(def, answer);
  if ((def.kind === "choice" || def.kind === "decision" || def.kind === "manage") && !option) return "Choose an option first.";
  if (def.kind === "pick" && answer.pickPrice === undefined) return "Click on the chart to mark a price.";
  if (def.kind === "numeric" && (answer.numeric === undefined || !Number.isFinite(answer.numeric) || answer.numeric < 0)) {
    return "Enter a number.";
  }
  if (def.checklist && !answer.checklist) return "Go through the checklist first.";
  if ((def.requireReason || option?.requiresReason) && answer.reasons.length === 0) return "Pick at least one reason.";
  if (option?.action === "enter") {
    if (!answer.order) return "Fill in the order ticket.";
    if (def.ticket?.requireHypothesis && (!answer.hypothesis || answer.hypothesis.reasons.length === 0)) {
      return "State your hypothesis: a direction and at least one piece of evidence.";
    }
    const preview = previewOrder(run.ctx, run.state, { type: "submit_order", ...answer.order });
    if (!preview.ok) return preview.rejection!.message;
  }
  if (option?.action === "close_half" && (run.state.position?.qty ?? 0) < 2) return "The position is too small to split.";
  return null;
}

/**
 * Replays a mission from its answer log. Deterministic: the same mission, variant and log always
 * produce the same run. The UI calls this after every answer; a server would do the same.
 */
export function runMission(m: MissionDef, variantIdx: number, log: readonly LoggedAnswer[]): MissionRun {
  const { ctx, hash } = missionContext(m, variantIdx);
  const variant = m.variants[variantIdx];
  const endStep = Math.min(m.endStep ?? ctx.candles.length - 1, ctx.candles.length - 1);
  let state = initState(ctx, m.startStep);

  const run: MissionRun = {
    mission: m,
    variantIdx,
    variant,
    ctx,
    datasetHash: hash,
    engineVersion: ENGINE_VERSION,
    startStep: m.startStep,
    endStep,
    step: m.startStep,
    state,
    frames: { [m.startStep]: frameOf(ctx, state) },
    events: [],
    visited: [],
    current: null,
    phase: "checkpoint",
    entries: [],
    stopChanges: [],
    facts: { ...(variant.facts ?? {}) },
    error: null,
  };

  const factContext = (): FactContext => {
    const { bid, ask } = bidAsk(ctx, state);
    return {
      step: state.step,
      visible: ctx.candles.slice(0, state.step + 1),
      equity: equityOf(ctx, state),
      bid,
      ask,
      positionQty: state.position?.qty ?? 0,
      variantFacts: variant.facts ?? {},
    };
  };
  const factsNow = (): Facts => ({ ...(variant.facts ?? {}), ...(m.facts?.(factContext()) ?? {}) });

  const pushEngine = (events: EngineEvent[], by: "user" | "system" | "market") => {
    for (const e of events) if (e.type !== "step_advanced") run.events.push({ kind: "engine", step: e.step, event: e, by });
  };
  const stepTo = (k: number) => {
    const target = Math.min(k, endStep);
    for (let s = state.step + 1; s <= target; s++) {
      const r = advance(ctx, state, s);
      state = r.state;
      pushEngine(r.events, "market");
      run.frames[s] = frameOf(ctx, state);
    }
  };
  const act = (action: Action, by: "user" | "system") => {
    const r = apply(ctx, state, action);
    if (r.rejected) throw new AnswerError(r.rejected.message);
    state = r.state;
    pushEngine(r.events, by);
    run.frames[state.step] = frameOf(ctx, state);
    return r;
  };

  // System setup, e.g. a position the user already holds.
  if (m.setup) {
    const f = factsNow();
    for (const a of m.setup(f, factContext())) act(a, "system");
    run.facts = { ...run.facts, ...f, hadPosition: state.position !== null };
  }

  /** Advances to the checkpoint's trigger. Returns false if the mission concludes instead. */
  const reach = (cp: CheckpointDef): CheckpointDef | null => {
    const t = cp.trigger;
    if ("atStep" in t) {
      stepTo(t.atStep);
      return cp;
    }
    const until = Math.min(state.step + t.maxSteps, endStep);
    while (state.step < until) {
      stepTo(state.step + 1);
      if (t.condition(ctx.candles.slice(0, state.step + 1), run.facts)) return cp;
    }
    if (t.onTimeout === "conclude") {
      run.events.push({ kind: "note", step: state.step, text: `No confirmation within ${t.maxSteps} candles.` });
      return null;
    }
    const target = m.checkpoints.find((c) => c.id === (t.onTimeout as { goto: string }).goto);
    return target ? reach(target) : null;
  };

  let next: CheckpointDef | null = nextInSequence(m, null);
  let i = 0;
  try {
    while (next) {
      const cp = reach(next);
      if (!cp) break;
      const facts = factsNow();
      run.facts = { ...run.facts, ...facts };
      const visit: VisitedCheckpoint = {
        def: cp,
        step: state.step,
        facts,
        prompt: typeof cp.prompt === "function" ? cp.prompt(facts) : cp.prompt,
      };
      run.events.push({ kind: "checkpoint", step: state.step, checkpointId: cp.id, title: cp.title });

      const logged = log[i];
      if (!logged) {
        run.current = visit;
        run.step = state.step;
        run.state = state;
        return run;
      }
      if (logged.checkpointId !== cp.id) {
        throw new AnswerError(`Expected an answer for "${cp.id}" but the log has "${logged.checkpointId}".`);
      }
      run.current = visit;
      run.state = state;
      const problem = validateAnswer(run, logged.answer);
      if (problem) throw new AnswerError(problem);

      const answer = logged.answer;
      const option = optionOf(cp, answer);
      switch (option?.action) {
        case "enter": {
          const order = answer.order!;
          const preview = previewOrder(ctx, state, { type: "submit_order", ...order });
          const closed = state.trades.filter((t) => t.exitStep !== null);
          const lastClosed = closed[closed.length - 1];
          run.entries.push({
            checkpointId: cp.id,
            step: state.step,
            side: order.side === "buy" ? "long" : "short",
            qty: order.qty,
            entryPrice: preview.entryPrice,
            stopLoss: order.stopLoss,
            takeProfit: order.takeProfit,
            risk: preview.risk,
            riskPct: preview.riskPct,
            rewardRisk: preview.rewardRisk,
            equityAtEntry: preview.equity,
            hypothesis: answer.hypothesis,
            afterLoss: lastClosed ? lastClosed.realized - lastClosed.fees < 0 : false,
            previousRisk: run.entries.length ? run.entries[run.entries.length - 1].risk : null,
          });
          act({ type: "submit_order", ...order }, "user");
          break;
        }
        case "close":
          act({ type: "close_position" }, "user");
          break;
        case "close_half":
          act({ type: "close_position", qty: Math.floor(state.position!.qty / 2) }, "user");
          break;
        case "widen_stop":
        case "tighten_stop": {
          const pos = state.position;
          const to = Number(facts[option.stopFact!]);
          if (pos) {
            run.stopChanges.push({ step: state.step, side: pos.side, from: pos.stopLoss, to });
            act({ type: "modify_brackets", stopLoss: to }, "user");
          }
          break;
        }
        default:
          break;
      }
      run.visited.push({ ...visit, answer });
      run.current = null;
      i++;
      next = option?.next ? (m.checkpoints.find((c) => c.id === option.next) ?? null) : nextInSequence(m, cp);
    }

    stepTo(endStep);
    const r = finish(ctx, state);
    state = r.state;
    pushEngine(r.events, "system");
    run.frames[state.step] = frameOf(ctx, state);
    run.phase = "concluded";
  } catch (err) {
    if (!(err instanceof AnswerError)) throw err;
    run.error = err.message;
  }
  run.step = state.step;
  run.state = state;
  return run;
}

/** Plain-language summary of what the user decided, for the journal and the debrief. */
export function describeDecisions(run: MissionRun): string[] {
  return run.visited.map((v) => {
    const a = v.answer!;
    const opt = optionOf(v.def, a);
    const reasons = a.reasons
      .map((r) => v.def.reasons?.find((x) => x.id === r)?.label ?? v.def.ticket?.hypothesisReasons.find((x) => x.id === r)?.label ?? r)
      .join("; ");
    const title = v.def.title.replace(/[?:.]$/, "");
    if (v.def.kind === "pick" && a.pickPrice !== undefined) return `${title} — marked ${formatPrice(a.pickPrice)}`;
    if (v.def.kind === "numeric") return `${title} — answered ${a.numeric} ${v.def.numeric?.unit ?? ""}`.trim();
    if (opt?.action === "enter" && a.order) {
      const entry = run.entries.find((e) => e.checkpointId === v.def.id);
      const risk = entry?.riskPct != null ? `, risk ${entry.riskPct.toFixed(2)}%` : ", no stop";
      const stop = a.order.stopLoss !== null ? `, stop ${formatPrice(a.order.stopLoss)}` : "";
      return `${title} — ${a.order.side === "buy" ? "bought" : "sold"} ${a.order.qty} units${stop}${risk}`;
    }
    return `${title} — ${opt?.label ?? "answered"}${reasons ? ` (${reasons})` : ""}`;
  });
}
