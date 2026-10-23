import { createContext, equityOf, replay, type EngineConfig, type LogEntry, type SimContext } from "@market-lab/engine";
import { riskDisciplineScore, scoreRubric, type CriterionDef, type DqsResult } from "@market-lab/evaluation";
import { arenaSpec, createRng, generateCandles, type ArenaRegime } from "@market-lab/scenario-gen";
import { ARENA_SCENARIOS, ARENA_START, analyzeArena, arenaConfig, getArenaScenario, type ArenaScenario } from "./arena";
import { BOTS, PLAYABLE_FLAWS, botDecide, tradeR, type BotFlaw, type BotId, type BotPersona } from "./bots";
import { atr, sma } from "./indicators";

/**
 * Duels (PLAN_DUELS.md): the player and a declared bot trade the same Arena market, round by
 * round. The better process wins: Duel score = 70% decision quality + 30% outcome in R.
 */

export const DUEL_ROUNDS = 8;
export const DUEL_ROUND_BARS = 10;
export const DUEL_START = ARENA_START;
export const DUEL_END = DUEL_START + DUEL_ROUNDS * DUEL_ROUND_BARS;
/** Risk limit per order, enforced by the engine. */
export const DUEL_RISK_PCT = 1;
export const DUEL_PROCESS_WEIGHT = 0.7;
/** The outcome counts up to ±3R, so one lucky move can't decide a duel. */
export const DUEL_R_CAP = 3;
export const DUEL_START_RATING = 1000;
export const DUEL_K = 32;

/** Arena rules plus the duel limits: a stop on every order and at most 1% risk, both enforced. */
export function duelConfig(s: ArenaScenario): EngineConfig {
  const cfg = arenaConfig(s);
  return { ...cfg, rules: { ...cfg.rules, requireStop: true, maxRiskPct: DUEL_RISK_PCT, enforceMaxRisk: true } };
}

/** Both players trade this market. Same regime + seed → same candles. */
export function duelContext(regime: ArenaRegime, seed: number): { ctx: SimContext; scenario: ArenaScenario } {
  const scenario = getArenaScenario(regime);
  return { ctx: createContext(duelConfig(scenario), generateCandles(arenaSpec(regime, seed))), scenario };
}

/** The decision step of a round (0-based); round DUEL_ROUNDS is the end of the duel. */
export function roundStep(round: number): number {
  return DUEL_START + round * DUEL_ROUND_BARS;
}

/** A log closed at the end of the duel: the remaining candles play, then open positions close at market. */
export function closeDuelLog(log: readonly LogEntry[]): LogEntry[] {
  return [...log, { kind: "advance", to: DUEL_END }, { kind: "finish" }];
}

// ─── The bot's side ────────────────────────────────────────────────────────

export interface BotNote {
  round: number;
  step: number;
  text: string;
}

/** The bot's random stream for one round: from the duel, the bot and the round, so a duel always replays the same way. */
function botSeed(seed: number, botId: string, round: number): number {
  let h = seed >>> 0;
  for (const ch of botId) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193) >>> 0;
  return (h ^ Math.imul(round + 1, 0x9e3779b1)) >>> 0;
}

/** The bot's decision at the start of a round: log entries to append (all accepted by the engine) and its note. */
export function botRound(ctx: SimContext, persona: BotPersona, botLog: readonly LogEntry[], round: number, seed: number): { entries: LogEntry[]; note: BotNote } {
  const step = roundStep(round);
  const { state } = replay(ctx, DUEL_START, [...botLog, { kind: "advance", to: step }]);
  const turn = botDecide(ctx, state, persona, createRng(botSeed(seed, persona.id, round)), {
    round,
    rounds: DUEL_ROUNDS,
    sinceStep: round === 0 ? DUEL_START : roundStep(round - 1),
  });
  return { entries: turn.actions.map((action) => ({ kind: "action" as const, step, action })), note: { round, step, text: turn.note } };
}

/** A whole duel played by the bot alone (tests and calibration). */
export function playBot(ctx: SimContext, persona: BotPersona, seed: number): { log: LogEntry[]; notes: BotNote[] } {
  let log: LogEntry[] = [];
  const notes: BotNote[] = [];
  for (let round = 0; round < DUEL_ROUNDS; round++) {
    const { entries, note } = botRound(ctx, persona, log, round, seed);
    log = [...log, ...entries];
    notes.push(note);
  }
  return { log, notes };
}

// ─── Scoring ───────────────────────────────────────────────────────────────

/** Stops and risk are enforced by the engine in a duel, so the rubric scores what still separates players. */
export const DUEL_RUBRIC: CriterionDef[] = [
  { id: "plan", label: "Planned exits worth the risk", evaluator: "reward_risk_planned", weight: 20, skill: "scenario_analysis", appliesIf: "entered", params: { minRatio: 1.5 } },
  { id: "noise", label: "Stops outside normal noise", evaluator: "stop_outside_noise", weight: 15, skill: "risk_management", appliesIf: "entered", params: { minAtr: 0.8 } },
  { id: "chase", label: "Entries that didn't chase", evaluator: "entry_not_extended", weight: 15, skill: "market_structure", appliesIf: "entered", params: { maxAtr: 1.8 } },
  { id: "widen", label: "Never widened a stop", evaluator: "no_stop_widening", weight: 20, skill: "decision_discipline" },
  { id: "revenge", label: "Kept risk steady after losses", evaluator: "no_revenge_sizing", weight: 15, skill: "decision_discipline" },
  { id: "pacing", label: "Traded selectively", evaluator: "pacing", weight: 15, skill: "decision_discipline", params: { selectivePer20: 0.75, busyPer20: 1.25 } },
];

export interface DuelSide {
  dqs: DqsResult;
  /** Decision quality on the duel rubric; null without a trade. */
  process: number | null;
  rds: number | null;
  /** Sum of the trades' R-multiples (net result ÷ initial risk). Size can't change it. */
  r: number;
  /** 0–100: 50 at 0R, 0 at −3R or worse, 100 at +3R or better. */
  outcome: number;
  /** Duel score; null without a trade (a player without a trade loses). */
  score: number | null;
  net: number;
  fees: number;
  trades: number;
  winners: number;
}

export function outcomeScore(r: number): number {
  return Math.max(0, Math.min(100, 50 + (50 * r) / DUEL_R_CAP));
}

export function duelScore(process: number, outcome: number): number {
  return Math.round(DUEL_PROCESS_WEIGHT * process + (1 - DUEL_PROCESS_WEIGHT) * outcome);
}

/** Scores one side of a finished duel (a log closed with `closeDuelLog`). */
export function evaluateDuelSide(ctx: SimContext, log: readonly LogEntry[]): DuelSide {
  const a = analyzeArena(ctx, log, DUEL_START);
  // What the visible candles said when each order was placed: for the noise and chase criteria.
  const entries = a.entries.map((e) => ({ ...e, atr: atr(ctx.candles, e.step, 14), sma20: sma(ctx.candles, e.step, 20) }));
  const dqs = scoreRubric(DUEL_RUBRIC, {
    missionId: "DUEL",
    initialEquity: ctx.cfg.initialEquity,
    commissionBps: ctx.cfg.costs.commissionBps,
    rules: ctx.cfg.rules,
    answers: [],
    entries,
    stopChanges: a.stopChanges,
    facts: { barsPlayed: a.barsPlayed },
  });
  const trades = a.state.trades;
  const r = trades.reduce((s, t) => s + (tradeR(t) ?? 0), 0);
  const process = trades.length > 0 ? dqs.dqs : null;
  const outcome = outcomeScore(r);
  return {
    dqs,
    process,
    rds: trades.length > 0 ? riskDisciplineScore(dqs.criteria) : null,
    r,
    outcome,
    score: process === null ? null : duelScore(process, outcome),
    net: equityOf(ctx, a.state) - ctx.cfg.initialEquity,
    fees: a.state.fees,
    trades: trades.length,
    winners: trades.filter((t) => t.realized - t.fees > 0).length,
  };
}

export type DuelWinner = "you" | "bot" | "draw";
export type DuelReason = "score" | "discipline" | "outcome" | "no_trade" | "draw";

/** Higher duel score wins; a player without a trade loses; ties go to risk discipline, then R. */
export function duelVerdict(you: DuelSide, bot: DuelSide): { winner: DuelWinner; reason: DuelReason } {
  if (you.score === null || bot.score === null) {
    if (you.score === bot.score) return { winner: "draw", reason: "no_trade" };
    return { winner: you.score === null ? "bot" : "you", reason: "no_trade" };
  }
  if (you.score !== bot.score) return { winner: you.score > bot.score ? "you" : "bot", reason: "score" };
  const yd = you.rds ?? 0;
  const bd = bot.rds ?? 0;
  if (yd !== bd) return { winner: yd > bd ? "you" : "bot", reason: "discipline" };
  if (Math.abs(you.r - bot.r) >= 0.01) return { winner: you.r > bot.r ? "you" : "bot", reason: "outcome" };
  return { winner: "draw", reason: "draw" };
}

/** Elo: the rating after one result (1 win, 0.5 draw, 0 loss). Never below 100. */
export function eloUpdate(rating: number, opponent: number, result: 0 | 0.5 | 1, k = DUEL_K): number {
  const expected = 1 / (1 + 10 ** ((opponent - rating) / 400));
  return Math.max(100, Math.round(rating + k * (result - expected)));
}

// ─── Daily duel, Mirror, ladder ────────────────────────────────────────────

const DAILY_BOTS: BotId[] = ["pip", "dash", "blaze", "grudge", "hope", "rook", "sage"];

function fnv(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193) >>> 0;
  return h;
}

/** Today's duel: the same bot, scenario and market for everyone on that day ("YYYY-MM-DD"). */
export function dailyDuel(day: string): { botId: BotId; regime: ArenaRegime; seed: number } {
  const [y, m, d] = day.split("-").map(Number);
  const n = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  const free = ARENA_SCENARIOS.filter((s) => s.tier === "free");
  return { botId: DAILY_BOTS[n % DAILY_BOTS.length], regime: free[(n * 5 + 2) % free.length].id, seed: fnv(`duel:${day}`) & 0x7fffffff };
}

/** The habit Mirror plays: the player's most frequent error tag that a bot can play, or null. */
export function mostFrequentFlaw(tagLists: readonly (readonly string[])[]): BotFlaw | null {
  const counts = new Map<string, number>();
  for (const tags of tagLists) for (const t of new Set(tags)) counts.set(t, (counts.get(t) ?? 0) + 1);
  let best: BotFlaw | null = null;
  let most = 0;
  for (const f of PLAYABLE_FLAWS) {
    const n = counts.get(f) ?? 0;
    if (n > most) {
      best = f;
      most = n;
    }
  }
  return best;
}

export interface DuelRecord {
  botId: BotId;
  winner: DuelWinner;
  at: number;
}

export interface DuelLadder {
  record: Partial<Record<BotId, { won: number; lost: number; drawn: number }>>;
  /** Bots beaten at least twice. */
  beaten: BotId[];
  /** The bot that won the player's last two duels against it (the most recent, if several). */
  rival: BotId | null;
  /** The unbeaten bot with the rating closest to the player's. */
  recommended: BotId;
}

export function duelLadder(records: readonly DuelRecord[], rating: number): DuelLadder {
  const record: DuelLadder["record"] = {};
  for (const r of records) {
    const x = (record[r.botId] ??= { won: 0, lost: 0, drawn: 0 });
    if (r.winner === "you") x.won++;
    else if (r.winner === "bot") x.lost++;
    else x.drawn++;
  }
  const beaten = BOTS.filter((b) => (record[b.id]?.won ?? 0) >= 2).map((b) => b.id);
  let rival: BotId | null = null;
  let rivalAt = 0;
  for (const b of [...BOTS.map((x) => x.id), "mirror" as const]) {
    const last2 = records.filter((r) => r.botId === b).sort((x, y) => y.at - x.at).slice(0, 2);
    if (last2.length === 2 && last2.every((r) => r.winner === "bot") && last2[0].at > rivalAt) {
      rival = b;
      rivalAt = last2[0].at;
    }
  }
  const open = BOTS.filter((b) => !beaten.includes(b.id));
  const pool = open.length ? open : BOTS;
  const recommended = [...pool].sort((a, b) => Math.abs(a.rating - rating) - Math.abs(b.rating - rating) || a.rating - b.rating)[0].id;
  return { record, beaten, rival, recommended };
}
