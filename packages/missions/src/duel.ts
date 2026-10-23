import { advance, createContext, equityOf, initState, replay, type Candle, type EngineConfig, type LogEntry, type SimContext, type SimState } from "@market-lab/engine";
import { riskDisciplineScore, scoreRubric, type CriterionDef, type DqsResult } from "@market-lab/evaluation";
import { DUEL_LEAD_IN, createRng, duelSpec, generateCandles, type ArenaRegime, type Rng } from "@market-lab/scenario-gen";
import { ARENA_SCENARIOS, ARENA_START, analyzeArena, arenaConfig, getArenaScenario, type ArenaScenario } from "./arena";
import { BOTS, PLAYABLE_FLAWS, botDecide, tradeR, type BotFlaw, type BotId, type BotPersona } from "./bots";
import { atr, sma } from "./indicators";

/**
 * Duels (PLAN_DUELS.md): the player and a declared bot trade the same market in real time. Each
 * candle forms over 15 seconds; the engine runs on ticks inside it, so orders fill at the live
 * price. The better process wins: Duel score = 70% decision quality + 30% outcome in R.
 */

export const DUEL_CANDLES = 80;
export const CANDLE_SECONDS = 15;
/** Price updates per candle: one every 250 ms. */
export const TICKS_PER_CANDLE = 60;
export const TICK_MS = (CANDLE_SECONDS * 1000) / TICKS_PER_CANDLE;
/** Seconds of countdown before the market starts moving. */
export const DUEL_COUNTDOWN = 10;
/** The last history candle: closed when the duel starts. The history is the Arena's plus a longer lead-in. */
export const DUEL_START = ARENA_START + DUEL_LEAD_IN;
/** The engine step (tick) at which the duel ends: the close of its last candle. */
export const DUEL_END = DUEL_START + DUEL_CANDLES * TICKS_PER_CANDLE;
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

// ─── The market: whole candles for the chart, ticks for the engine ─────────

export interface DuelMarket {
  scenario: ArenaScenario;
  /** The engine's market: the history as whole candles, then TICKS_PER_CANDLE ticks per duel candle. */
  ctx: SimContext;
  /** Whole candles: the history and the duel's candles. */
  candles: readonly Candle[];
}

/** One candle's path in `n` ticks: open → first extreme → second extreme → close, with some noise. */
export function subdivide(c: Candle, n: number, rng: Rng): Candle[] {
  const highFirst = c.path ? c.path === "OHLC" : c.c < c.o;
  const anchors: [number, number][] = [
    [0, c.o],
    [Math.round(n * rng.between(0.15, 0.4)), highFirst ? c.h : c.l],
    [Math.round(n * rng.between(0.6, 0.85)), highFirst ? c.l : c.h],
    [n, c.c],
  ];
  const noise = (c.h - c.l) * 0.12;
  const p: number[] = [];
  for (let a = 0; a < anchors.length - 1; a++) {
    const [i0, v0] = anchors[a];
    const [i1, v1] = anchors[a + 1];
    // A Brownian bridge between two anchors: free in the middle, exact at both ends.
    const walk = [0];
    for (let i = i0 + 1; i <= i1; i++) walk.push(walk[walk.length - 1] + rng.normal());
    const end = walk[walk.length - 1];
    for (let i = i0; i < i1; i++) {
      const f = (i - i0) / (i1 - i0);
      const w = walk[i - i0] - f * end;
      p.push(Math.round(Math.min(c.h, Math.max(c.l, v0 + f * (v1 - v0) + (noise * w) / Math.sqrt(i1 - i0 + 1)))));
    }
  }
  p.push(c.c);
  const vol = c.v / n;
  const out: Candle[] = [];
  for (let k = 1; k <= n; k++) {
    const o = p[k - 1];
    const cl = p[k];
    out.push({ o, h: Math.max(o, cl), l: Math.min(o, cl), c: cl, v: vol, path: cl >= o ? "OLHC" : "OHLC" });
  }
  return out;
}

const markets = new Map<string, DuelMarket>();

/** Both players trade this market. Same regime + seed → same market, tick for tick. */
export function duelMarket(regime: ArenaRegime, seed: number): DuelMarket {
  const key = `${regime}:${seed}`;
  const cached = markets.get(key);
  if (cached) return cached;
  const scenario = getArenaScenario(regime);
  const candles = generateCandles(duelSpec(regime, seed)).slice(0, DUEL_START + 1 + DUEL_CANDLES);
  const rng = createRng((seed ^ 0x51ed27) >>> 0);
  const ticks: Candle[] = candles.slice(0, DUEL_START + 1);
  for (let i = DUEL_START + 1; i < candles.length; i++) ticks.push(...subdivide(candles[i], TICKS_PER_CANDLE, rng));
  const market: DuelMarket = { scenario, ctx: createContext(duelConfig(scenario), ticks), candles };
  if (markets.size > 6) markets.delete(markets.keys().next().value!);
  markets.set(key, market);
  return market;
}

/** The chart candle a tick belongs to. */
export function candleAt(step: number): number {
  return step <= DUEL_START ? step : DUEL_START + Math.ceil((step - DUEL_START) / TICKS_PER_CANDLE);
}

/** The last fully closed candle at a tick. */
export function closedCandleAt(step: number): number {
  return step <= DUEL_START ? step : DUEL_START + Math.floor((step - DUEL_START) / TICKS_PER_CANDLE);
}

/** The tick at which a chart candle closes. */
export function candleCloseStep(index: number): number {
  return index <= DUEL_START ? index : DUEL_START + (index - DUEL_START) * TICKS_PER_CANDLE;
}

/** Duel candles closed so far (0–80) at a tick. */
export function duelCandlesClosed(step: number): number {
  return closedCandleAt(step) - DUEL_START;
}

/** The chart at a tick: the closed candles, plus the one forming, built from its ticks so far. */
export function duelChartCandles(m: DuelMarket, step: number): Candle[] {
  const i = candleAt(step);
  if (step === candleCloseStep(i)) return m.candles.slice(0, i + 1);
  const ticks = m.ctx.candles.slice(candleCloseStep(i - 1) + 1, step + 1);
  const forming: Candle = {
    o: ticks[0].o,
    h: Math.max(...ticks.map((t) => t.h)),
    l: Math.min(...ticks.map((t) => t.l)),
    c: ticks[ticks.length - 1].c,
    v: ticks.reduce((s, t) => s + t.v, 0),
  };
  return [...m.candles.slice(0, i), forming];
}

/** A log closed at a tick (the end of the duel by default): positions close at market there. */
export function closeDuelLog(log: readonly LogEntry[], at = DUEL_END): LogEntry[] {
  return [...log, { kind: "advance", to: at }, { kind: "finish" }];
}

// ─── The bot's side ────────────────────────────────────────────────────────

export interface BotNote {
  /** Duel candles closed when the bot decided (0 = at the start). */
  candle: number;
  step: number;
  text: string;
}

/**
 * Chance, by level, that the bot sees the coming candles in a duel (product decision of
 * 23.10.2026: some duels the bot should win). The player is not told; the bot's notes in those
 * duels say only what it did, never an invented reason.
 */
export const FORESIGHT_CHANCE: Record<number, number> = { 1: 0.15, 2: 0.2, 3: 0.25, 4: 0.3, 5: 0.35 };
/** How far ahead a bot with foresight sees, in candles. */
export const FORESIGHT_CANDLES = 12;

function fnv(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193) >>> 0;
  return h;
}

/** Whether the bot has foresight in this duel: fixed by the seed, so a duel always replays the same way. */
export function duelForesight(seed: number, bot: BotPersona): boolean {
  return (fnv(`foresight:${seed}:${bot.id}`) % 1000) / 1000 < (FORESIGHT_CHANCE[bot.level] ?? 0);
}

/** The bot's random stream for one decision: from the duel, the bot and the candle. */
function botSeed(seed: number, botId: string, candle: number): number {
  let h = seed >>> 0;
  for (const ch of botId) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193) >>> 0;
  return (h ^ Math.imul(candle + 1, 0x9e3779b1)) >>> 0;
}

/**
 * The bot's decision at the close of a duel candle (`candle` closed so far, 0 at the start):
 * log entries to append, all accepted by the engine, and its note when it did something.
 */
export function botTurn(
  m: DuelMarket,
  persona: BotPersona,
  botLog: readonly LogEntry[],
  candle: number,
  seed: number,
  foresight = false,
  /** The bot's account at this candle's close, when the caller already has it (saves a replay). */
  at?: SimState,
): { entries: LogEntry[]; note: BotNote | null; state: SimState } {
  const step = candleCloseStep(DUEL_START + candle);
  const state = at ?? replay(m.ctx, DUEL_START, [...botLog, { kind: "advance", to: step }]).state;
  const turn = botDecide(m.ctx, state, persona, createRng(botSeed(seed, persona.id, candle)), {
    candles: m.candles.slice(0, DUEL_START + candle + 1),
    index: candle,
    total: DUEL_CANDLES,
    ticksPerCandle: TICKS_PER_CANDLE,
    sinceStep: candle === 0 ? DUEL_START : candleCloseStep(DUEL_START + candle - 1),
    future: foresight ? m.ctx.candles.slice(step + 1, step + 1 + FORESIGHT_CANDLES * TICKS_PER_CANDLE) : undefined,
  });
  return {
    entries: turn.actions.map((action) => ({ kind: "action" as const, step, action })),
    note: turn.note ? { candle, step, text: turn.note } : null,
    state: turn.state,
  };
}

/** A whole duel played by the bot alone (tests and calibration). */
export function playBot(m: DuelMarket, persona: BotPersona, seed: number, foresight = false): { log: LogEntry[]; notes: BotNote[] } {
  const log: LogEntry[] = [];
  const notes: BotNote[] = [];
  let state = initState(m.ctx, DUEL_START);
  for (let candle = 0; candle < DUEL_CANDLES; candle++) {
    state = advance(m.ctx, state, candleCloseStep(DUEL_START + candle)).state;
    const turn = botTurn(m, persona, log, candle, seed, foresight, state);
    log.push(...turn.entries);
    state = turn.state;
    if (turn.note) notes.push(turn.note);
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
  { id: "pacing", label: "Traded selectively", evaluator: "pacing", weight: 15, skill: "decision_discipline" },
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
  /** Duel candles played. */
  candles: number;
}

/** Whole points, so the formula shown in the result adds up exactly. */
export function outcomeScore(r: number): number {
  return Math.round(Math.max(0, Math.min(100, 50 + (50 * r) / DUEL_R_CAP)));
}

export function duelScore(process: number, outcome: number): number {
  return Math.round(DUEL_PROCESS_WEIGHT * process + (1 - DUEL_PROCESS_WEIGHT) * outcome);
}

/** Scores one side of a finished duel (a log closed with `closeDuelLog`). */
export function evaluateDuelSide(m: DuelMarket, log: readonly LogEntry[]): DuelSide {
  const a = analyzeArena(m.ctx, log, DUEL_START);
  // What the closed candles said when each order was placed: for the noise and chase criteria.
  const entries = a.entries.map((e) => {
    const i = closedCandleAt(e.step);
    return { ...e, atr: atr(m.candles, i, 14), sma20: sma(m.candles, i, 20) };
  });
  const candles = candleAt(a.state.step) - DUEL_START;
  const dqs = scoreRubric(DUEL_RUBRIC, {
    missionId: "DUEL",
    initialEquity: m.ctx.cfg.initialEquity,
    commissionBps: m.ctx.cfg.costs.commissionBps,
    rules: m.ctx.cfg.rules,
    answers: [],
    entries,
    stopChanges: a.stopChanges,
    facts: { barsPlayed: candles },
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
    net: equityOf(m.ctx, a.state) - m.ctx.cfg.initialEquity,
    fees: a.state.fees,
    trades: trades.length,
    winners: trades.filter((t) => t.realized - t.fees > 0).length,
    candles,
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
