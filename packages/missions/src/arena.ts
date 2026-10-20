import {
  apply,
  advance,
  createContext,
  equityOf,
  finish,
  hashValue,
  initState,
  previewOrder,
  replay,
  type Action,
  type EngineConfig,
  type LogEntry,
  type OrderType,
  type SimContext,
  type SimState,
} from "@market-lab/engine";
import { riskDisciplineScore, scoreRubric, type CriterionDef, type DqsResult, type EntryView, type SkillId, type StopChangeView } from "@market-lab/evaluation";
import type { Evidence } from "@market-lab/learning";
import { arenaSpec, generateCandles, type ArenaRegime } from "@market-lab/scenario-gen";
import { evidenceFrom } from "./evaluate";
import { DEFAULT_COSTS } from "./schema";

export const ARENA_START = 59;
export const ARENA_EQUITY = 1_000_000;

export interface ArenaScenario {
  id: ArenaRegime;
  title: string;
  tagline: string;
  /** What the user should practise. */
  objective: string;
  /** What the market looks like when the session starts. */
  conditions: string;
  /** Starting virtual capital, in cents. */
  capital: number;
  maxRiskPct: number;
  allowShort: boolean;
  orderTypes: OrderType[];
  /** Orders without a stop are rejected. */
  requireStop: boolean;
  /** Plain-language constraints shown before the session. */
  constraints: string[];
  completion: { minBars: number; minTrades: number };
  skills: SkillId[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  tier: "free" | "pro";
}

const base = { capital: ARENA_EQUITY, allowShort: true, orderTypes: ["market", "limit"] as OrderType[], requireStop: false };

/** The Arena scenario library. Every scenario is one simulated instrument (LABX) on 1-hour candles. */
export const ARENA_SCENARIOS: ArenaScenario[] = [
  {
    ...base,
    id: "bullish",
    title: "Bullish market",
    tagline: "Rising legs with pullbacks along the way.",
    objective: "Trade with the trend: enter on pullbacks with a stop below the last swing low, not after extended moves.",
    conditions: "Price has been climbing for the last 35 candles after a quiet start.",
    maxRiskPct: 2,
    constraints: ["Long and short allowed", "No leverage", "Risk at most 2% per trade"],
    completion: { minBars: 60, minTrades: 1 },
    skills: ["market_structure", "risk_management"],
    difficulty: 1,
    tier: "free",
  },
  {
    ...base,
    id: "bearish",
    title: "Bearish market",
    tagline: "Falling legs with relief rallies along the way.",
    objective: "Practise selling short with a stop above the last swing high, or the discipline of staying flat.",
    conditions: "Price has been falling for the last 35 candles after a quiet start.",
    maxRiskPct: 2,
    constraints: ["Long and short allowed", "No leverage", "Risk at most 2% per trade"],
    completion: { minBars: 60, minTrades: 1 },
    skills: ["market_structure", "order_mechanics"],
    difficulty: 2,
    tier: "free",
  },
  {
    ...base,
    id: "sideways",
    title: "Sideways market",
    tagline: "Price oscillates between two levels.",
    objective: "Trade the edges of the range with stops outside it, or wait. Avoid buying the top of a range.",
    conditions: "The last 60 candles moved inside a band about 5% wide.",
    maxRiskPct: 2,
    constraints: ["Long and short allowed", "No leverage", "Risk at most 2% per trade"],
    completion: { minBars: 60, minTrades: 1 },
    skills: ["market_structure", "decision_discipline"],
    difficulty: 2,
    tier: "free",
  },
  {
    ...base,
    id: "low_volatility",
    title: "Low volatility",
    tagline: "Small, quiet candles. Costs matter more.",
    objective: "See how the spread and commission eat small moves. Take fewer trades with targets worth the costs.",
    conditions: "Candles have been unusually small for the last 60 hours.",
    maxRiskPct: 2,
    constraints: ["Long and short allowed", "No leverage", "Risk at most 2% per trade"],
    completion: { minBars: 60, minTrades: 1 },
    skills: ["order_mechanics", "decision_discipline"],
    difficulty: 2,
    tier: "free",
  },
  {
    ...base,
    id: "breakout",
    title: "Breakout",
    tagline: "A long range that eventually resolves into a trend.",
    objective: "Plan an entry around the break of the range, with the stop back inside the range where the breakout is invalidated.",
    conditions: "A tight range has been forming for the last 60 candles.",
    maxRiskPct: 2,
    constraints: ["Long and short allowed", "No leverage", "Risk at most 2% per trade"],
    completion: { minBars: 80, minTrades: 1 },
    skills: ["market_structure", "scenario_analysis"],
    difficulty: 3,
    tier: "free",
  },
  {
    ...base,
    id: "reversal",
    title: "Reversal",
    tagline: "A trend that loses steam and turns around.",
    objective: "Notice when the trend's structure breaks (no new highs, a lower low) and stop trading the old direction.",
    conditions: "A strong trend has carried price for 60 candles.",
    maxRiskPct: 2,
    constraints: ["Long and short allowed", "No leverage", "Risk at most 2% per trade"],
    completion: { minBars: 120, minTrades: 1 },
    skills: ["market_structure", "scenario_analysis"],
    difficulty: 3,
    tier: "free",
  },
  {
    ...base,
    id: "high_volatility",
    title: "High volatility",
    tagline: "Large swings and the occasional gap.",
    objective: "Keep the risk in vUSD constant while swings grow: wider stops mean fewer units.",
    conditions: "Candles are two to three times their usual size.",
    maxRiskPct: 1,
    constraints: ["Long and short allowed", "No leverage", "Risk at most 1% per trade"],
    completion: { minBars: 60, minTrades: 1 },
    skills: ["position_sizing", "risk_management"],
    difficulty: 4,
    tier: "pro",
  },
  {
    ...base,
    id: "false_breakout",
    title: "False breakout",
    tagline: "Breaks out of a range, then falls back inside it.",
    objective: "Respect the stop when a breakout fails, and don't flip direction out of frustration.",
    conditions: "A range has been forming for the last 60 candles.",
    maxRiskPct: 2,
    constraints: ["Long and short allowed", "No leverage", "Risk at most 2% per trade"],
    completion: { minBars: 80, minTrades: 1 },
    skills: ["decision_discipline", "market_structure"],
    difficulty: 4,
    tier: "pro",
  },
  {
    ...base,
    id: "event_shock",
    title: "Unexpected event",
    tagline: "A calm market hit by a sudden gap.",
    objective: "Experience gap risk: a stop can fill worse than its price. Size so that even a gap is survivable.",
    conditions: "A calm, quiet market. Nothing on the chart warns you about what's coming.",
    maxRiskPct: 1,
    requireStop: true,
    constraints: ["Long and short allowed", "No leverage", "Risk at most 1% per trade", "A stop-loss is required on every order"],
    completion: { minBars: 120, minTrades: 1 },
    skills: ["risk_management", "position_sizing"],
    difficulty: 5,
    tier: "pro",
  },
];

/** Settings used by the original regimes (trending, ranging, volatile, mixed). */
const LEGACY: Omit<ArenaScenario, "id" | "title" | "tagline"> = {
  ...base,
  objective: "Free practice.",
  conditions: "A fresh simulated market.",
  maxRiskPct: 2,
  constraints: ["Long and short allowed", "No leverage", "Risk at most 2% per trade"],
  completion: { minBars: 30, minTrades: 0 },
  skills: ["risk_management", "decision_discipline"],
  difficulty: 2,
  tier: "free",
};

const LEGACY_TITLES: Record<string, string> = { trending: "Trending", ranging: "Ranging", volatile: "Volatile", mixed: "Mixed regimes" };

export function getArenaScenario(id: ArenaRegime | string): ArenaScenario {
  return (
    ARENA_SCENARIOS.find((s) => s.id === id) ?? { ...LEGACY, id: id as ArenaRegime, title: LEGACY_TITLES[id] ?? "Practice", tagline: "Free practice." }
  );
}

export function arenaConfig(s: ArenaScenario): EngineConfig {
  return {
    symbol: "LABX",
    initialEquity: s.capital,
    costs: DEFAULT_COSTS,
    rules: { allowShort: s.allowShort, orderTypes: s.orderTypes, maxLeverage: 1, requireStop: s.requireStop, maxRiskPct: s.maxRiskPct },
  };
}

/** Kept for compatibility: the default Arena rules. */
export const ARENA_CONFIG: EngineConfig = arenaConfig(getArenaScenario("trending"));

export function arenaContext(regime: ArenaRegime, seed: number): { ctx: SimContext; hash: string; scenario: ArenaScenario } {
  const scenario = getArenaScenario(regime);
  const candles = generateCandles(arenaSpec(regime, seed));
  return { ctx: createContext(arenaConfig(scenario), candles), hash: hashValue(candles), scenario };
}

/**
 * Decision Quality for the Arena: process only. Risk Discipline is the subset of these criteria
 * about respecting limits (stops, risk per trade, never widening, no revenge sizing).
 */
export function arenaRubric(maxRiskPct: number): CriterionDef[] {
  return [
    { id: "stops", label: "Every entry had a stop-loss", evaluator: "invalidation_before_entry", weight: 25, skill: "risk_management", appliesIf: "entered" },
    { id: "risk", label: `Risk within ${maxRiskPct}% per trade`, evaluator: "risk_within_limit", weight: 20, skill: "risk_management", appliesIf: "entered", params: { maxPct: maxRiskPct } },
    { id: "plan", label: "Planned exits worth the risk", evaluator: "reward_risk_planned", weight: 15, skill: "scenario_analysis", appliesIf: "entered", params: { minRatio: 1.5 } },
    { id: "widen", label: "Never widened a stop", evaluator: "no_stop_widening", weight: 15, skill: "decision_discipline" },
    { id: "revenge", label: "Kept risk steady after losses", evaluator: "no_revenge_sizing", weight: 10, skill: "decision_discipline" },
    { id: "pacing", label: "Traded selectively", evaluator: "pacing", weight: 15, skill: "decision_discipline" },
  ];
}

export const ARENA_RUBRIC: CriterionDef[] = arenaRubric(2);

export interface ArenaAnalysis {
  state: SimState;
  entries: EntryView[];
  stopChanges: StopChangeView[];
  barsPlayed: number;
}

/**
 * Replays an Arena log while recording, for every filled entry, what was known when the order
 * was submitted. Like `replay` in the engine, but it also builds the process view.
 */
export function analyzeArena(ctx: SimContext, log: readonly LogEntry[], startStep = ARENA_START): ArenaAnalysis {
  let state = initState(ctx, startStep);
  const pendingIntents = new Map<string, EntryView>();
  const entries: EntryView[] = [];
  const stopChanges: StopChangeView[] = [];

  const collectFills = (events: ReturnType<typeof advance>["events"]) => {
    for (const e of events) {
      if (e.type === "order_filled" && (e.reason === "market" || e.reason === "limit")) {
        const intent = pendingIntents.get(e.orderId);
        if (intent) {
          const closed = state.trades.filter((t) => t.exitStep !== null && t.exitStep <= intent.step);
          const last = closed[closed.length - 1];
          entries.push({
            ...intent,
            afterLoss: last ? last.realized - last.fees < 0 : false,
            previousRisk: entries.length ? entries[entries.length - 1].risk : null,
          });
          pendingIntents.delete(e.orderId);
        }
      }
    }
  };

  for (const entry of log) {
    if (entry.kind === "advance") {
      const r = advance(ctx, state, entry.to);
      state = r.state;
      collectFills(r.events);
      continue;
    }
    if (entry.kind === "finish") {
      state = finish(ctx, state).state;
      continue;
    }
    if (entry.step > state.step) {
      const r = advance(ctx, state, entry.step);
      state = r.state;
      collectFills(r.events);
    }
    const a = entry.action;
    let intent: EntryView | null = null;
    if (a.type === "submit_order") {
      const pv = previewOrder(ctx, state, a);
      intent = {
        checkpointId: null,
        step: state.step,
        side: a.side === "buy" ? "long" : "short",
        qty: a.qty,
        entryPrice: pv.entryPrice,
        stopLoss: a.stopLoss ?? null,
        takeProfit: a.takeProfit ?? null,
        risk: pv.risk,
        riskPct: pv.riskPct,
        rewardRisk: pv.rewardRisk,
        equityAtEntry: pv.equity,
        afterLoss: false,
        previousRisk: null,
      };
    }
    if (a.type === "modify_brackets" && state.position && a.stopLoss !== undefined) {
      stopChanges.push({ step: state.step, side: state.position.side, from: state.position.stopLoss, to: a.stopLoss });
    }
    const r = apply(ctx, state, a);
    if (r.rejected) continue;
    if (intent) {
      const submitted = r.events.find((e) => e.type === "order_submitted");
      if (submitted && submitted.type === "order_submitted") pendingIntents.set(submitted.orderId, intent);
    }
    state = r.state;
    collectFills(r.events);
  }
  return { state, entries, stopChanges, barsPlayed: state.step - startStep };
}

export interface ArenaResult {
  dqs: DqsResult;
  /** Risk Discipline Score, null when no position was taken. */
  rds: number | null;
  net: number;
  returnPct: number;
  fees: number;
  trades: number;
  winners: number;
  maxDrawdownPct: number;
  barsPlayed: number;
  avgRiskPct: number | null;
  stopsUsedPct: number | null;
  entries: EntryView[];
  completion: { met: boolean; items: { label: string; met: boolean }[] };
  evidence: Evidence[];
}

export function evaluateArena(ctx: SimContext, log: readonly LogEntry[], scenario: ArenaScenario = getArenaScenario("trending")): ArenaResult {
  const a = analyzeArena(ctx, log);
  const dqs = scoreRubric(arenaRubric(scenario.maxRiskPct), {
    missionId: "ARENA",
    initialEquity: ctx.cfg.initialEquity,
    commissionBps: ctx.cfg.costs.commissionBps,
    rules: ctx.cfg.rules,
    answers: [],
    entries: a.entries,
    stopChanges: a.stopChanges,
    facts: { barsPlayed: a.barsPlayed },
  });
  const finalEquity = equityOf(ctx, a.state);
  const risks = a.entries.filter((e) => e.riskPct !== null).map((e) => e.riskPct!);
  const allStops = a.entries.every((e) => e.stopLoss !== null);
  const withinLimit = a.entries.every((e) => e.riskPct !== null && e.riskPct <= scenario.maxRiskPct + 1e-9);
  const items = [
    { label: `Play at least ${scenario.completion.minBars} candles`, met: a.barsPlayed >= scenario.completion.minBars },
    ...(scenario.completion.minTrades > 0 ? [{ label: "Take at least one trade", met: a.entries.length >= scenario.completion.minTrades }] : []),
    { label: "A stop-loss on every entry", met: allStops },
    { label: `Risk at most ${scenario.maxRiskPct}% on every entry`, met: withinLimit },
  ];
  return {
    dqs,
    rds: riskDisciplineScore(dqs.criteria),
    net: finalEquity - ctx.cfg.initialEquity,
    returnPct: ((finalEquity - ctx.cfg.initialEquity) / ctx.cfg.initialEquity) * 100,
    fees: a.state.fees,
    trades: a.state.trades.length,
    winners: a.state.trades.filter((t) => t.realized - t.fees > 0).length,
    maxDrawdownPct: a.state.maxDrawdownBps / 100,
    barsPlayed: a.barsPlayed,
    avgRiskPct: risks.length ? risks.reduce((x, y) => x + y, 0) / risks.length : null,
    stopsUsedPct: a.entries.length ? (a.entries.filter((e) => e.stopLoss !== null).length / a.entries.length) * 100 : null,
    entries: a.entries,
    completion: { met: items.every((i) => i.met), items },
    evidence: evidenceFrom(dqs, scenario.difficulty, null, 0.3),
  };
}

// ─── What-if: hypothetical alternatives ─────────────────────────────────────

export interface ArenaWhatIf {
  id: string;
  label: string;
  description: string;
  net: number;
  dqs: number | null;
  rds: number | null;
  trades: number;
  maxDrawdownPct: number;
  /** Orders the engine refused in this variant (e.g. a doubled size over buying power). */
  rejected: number;
}

/**
 * Re-runs a finished session with one rule changed on every order: the size, or the distance to
 * the stop. Each run uses the same candles and the same engine. These are hypothetical: later
 * actions in the log may no longer make sense (a position may already be closed), and the engine
 * simply rejects them.
 */
export function arenaWhatIfs(ctx: SimContext, log: readonly LogEntry[], scenario: ArenaScenario): ArenaWhatIf[] {
  const variants: { id: string; label: string; description: string; map: (a: Action, close: number) => Action }[] = [
    {
      id: "half",
      label: "Half the size",
      description: "Every order with half the quantity, same stops and targets.",
      map: (a) => (a.type === "submit_order" ? { ...a, qty: Math.max(1, Math.floor(a.qty / 2)) } : a.type === "close_position" && a.qty ? { ...a, qty: Math.max(1, Math.floor(a.qty / 2)) } : a),
    },
    {
      id: "double",
      label: "Double the size",
      description: "Every order with twice the quantity. Some orders may be rejected for exceeding buying power.",
      map: (a) => (a.type === "submit_order" ? { ...a, qty: a.qty * 2 } : a.type === "close_position" && a.qty ? { ...a, qty: a.qty * 2 } : a),
    },
    {
      id: "tight",
      label: "Stops twice as tight",
      description: "Each stop placed at half its distance from the price at the time of the order.",
      map: (a, close) => (a.type === "submit_order" && a.stopLoss != null ? { ...a, stopLoss: Math.round(close - (close - a.stopLoss) / 2) } : a),
    },
    {
      id: "wide",
      label: "Stops twice as wide",
      description: "Each stop placed at twice its distance from the price at the time of the order.",
      map: (a, close) => (a.type === "submit_order" && a.stopLoss != null ? { ...a, stopLoss: Math.max(1, Math.round(close - (close - a.stopLoss) * 2)) } : a),
    },
    {
      id: "flat",
      label: "No trades",
      description: "Staying flat for the whole session.",
      map: (a) => a,
    },
  ];
  return variants.map((v) => {
    const altLog: LogEntry[] =
      v.id === "flat"
        ? log.filter((e) => e.kind !== "action")
        : log.map((e) => (e.kind === "action" ? { ...e, action: v.map(e.action, ctx.candles[e.step].c) } : e));
    const r = evaluateArena(ctx, altLog, scenario);
    const rejected = replay(ctx, ARENA_START, altLog).rejections.length;
    return { id: v.id, label: v.label, description: v.description, net: r.net, dqs: r.dqs.dqs, rds: r.rds, trades: r.trades, maxDrawdownPct: r.maxDrawdownPct, rejected };
  });
}

/** Equity after every candle of a session, for the portfolio's equity curve. */
export function arenaEquityCurve(ctx: SimContext, log: readonly LogEntry[], upTo: number, startStep = ARENA_START): number[] {
  let state = initState(ctx, startStep);
  const out: number[] = [equityOf(ctx, state)];
  const actions = log.filter((e) => e.kind === "action");
  let i = 0;
  for (let step = startStep + 1; step <= upTo; step++) {
    while (i < actions.length && actions[i].kind === "action" && (actions[i] as { step: number }).step < step) {
      const e = actions[i] as Extract<LogEntry, { kind: "action" }>;
      if (e.step > state.step) state = advance(ctx, state, e.step).state;
      const r = apply(ctx, state, e.action);
      if (!r.rejected) state = r.state;
      i++;
    }
    state = advance(ctx, state, step).state;
    out.push(equityOf(ctx, state));
  }
  return out;
}
