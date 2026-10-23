import {
  apply,
  bidAsk,
  equityOf,
  formatPrice,
  maxQtyForRisk,
  previewOrder,
  unrealizedPnl,
  type Action,
  type Candle,
  type SimContext,
  type SimState,
  type Trade,
} from "@market-lab/engine";
import type { Rng } from "@market-lab/scenario-gen";
import { atr, highestHigh, lowestLow, sma } from "./indicators";

/**
 * Duel bots: declared sparring partners, each with a trading style and, for most, one habit the
 * duel rubric can detect. A bot sees exactly what the player sees: the candles revealed so far
 * and its own account. It sizes with the same helper and is checked by the same engine rules.
 */

export type BotId = "pip" | "dash" | "blaze" | "grudge" | "hope" | "rook" | "sage" | "mirror";
export type BotStyle = "impulse" | "churn" | "momentum" | "trend" | "range";
/** Habits a bot can play. Each one is an error tag the duel rubric detects. */
export type BotFlaw = "stop_inside_noise" | "overtrading" | "chased_entry" | "revenge_size_up" | "moved_stop_away";

export const PLAYABLE_FLAWS: BotFlaw[] = ["stop_inside_noise", "overtrading", "chased_entry", "revenge_size_up", "moved_stop_away"];

export interface BotParams {
  /** Risk per trade, in % of equity. */
  riskPct: number;
  /** Stop distance in average candle ranges (ATR), when no structure gives a better one. */
  stopAtr: number;
  /** Target as a multiple of the stop distance. */
  targetR: number;
  /** Chance of taking a valid setup; the rest are let go. */
  takeChance: number;
  /** Chance of moving a threatened stop further away. */
  widenChance?: number;
  /** Risk multiplier after a losing trade. */
  revengeMult?: number;
  /** Closes a position at the first decision after opening it. */
  quickExit?: boolean;
  /** Trades the trend direction without waiting for a pullback. */
  loose?: boolean;
}

export interface BotPersona {
  id: BotId;
  name: string;
  /** What kind of trader this is, in a few words. */
  title: string;
  bio: string;
  level: 1 | 2 | 3 | 4 | 5;
  rating: number;
  style: BotStyle;
  flaws: BotFlaw[];
  /** What to watch for in a duel against this bot. */
  watch: string;
  params: BotParams;
}

export const FLAW_LABEL: Record<BotFlaw, string> = {
  stop_inside_noise: "Stops inside normal noise",
  overtrading: "Trading too often",
  chased_entry: "Chasing extended moves",
  revenge_size_up: "Sizing up after a loss",
  moved_stop_away: "Moving the stop further away",
};

export const BOTS: BotPersona[] = [
  {
    id: "pip",
    name: "Pip",
    title: "The eager beginner",
    bio: "Trades on a hunch almost every round and keeps stops tight, so every loss feels small.",
    level: 1,
    rating: 850,
    style: "impulse",
    flaws: ["stop_inside_noise", "moved_stop_away"],
    watch: "Stops so close that ordinary noise takes Pip out, often right before price goes the way Pip guessed.",
    params: { riskPct: 1, stopAtr: 0.35, targetR: 0.8, takeChance: 0.8, widenChance: 0.4 },
  },
  {
    id: "dash",
    name: "Dash",
    title: "The overtrader",
    bio: "Can't sit still. A new trade every round, out again at the next one, small targets.",
    level: 1,
    rating: 950,
    style: "churn",
    flaws: ["overtrading"],
    watch: "Spread and commission on every round trip. Count how much of Dash's result goes to costs.",
    params: { riskPct: 1, stopAtr: 1, targetR: 0.9, takeChance: 1, quickExit: true },
  },
  {
    id: "grudge",
    name: "Grudge",
    title: "The revenge trader",
    bio: "Follows the trend at small size, until a loss. Then it has to win it back, bigger.",
    level: 2,
    rating: 1050,
    style: "trend",
    flaws: ["revenge_size_up"],
    watch: "The trade right after a loss: Grudge more than doubles the risk.",
    params: { riskPct: 0.4, stopAtr: 1.1, targetR: 1.5, takeChance: 0.9, revengeMult: 2.4, loose: true },
  },
  {
    id: "blaze",
    name: "Blaze",
    title: "The momentum chaser",
    bio: "Buys the big green candle and the fresh breakout. Hates missing a move.",
    level: 2,
    rating: 1150,
    style: "momentum",
    flaws: ["chased_entry"],
    watch: "Entries after the move has already stretched far from the average, close to the top.",
    params: { riskPct: 1, stopAtr: 1, targetR: 1.2, takeChance: 0.9 },
  },
  {
    id: "hope",
    name: "Hope",
    title: "The stop mover",
    bio: "Picks decent pullbacks in a trend, but can't take a planned loss when price gets close.",
    level: 3,
    rating: 1250,
    style: "trend",
    flaws: ["moved_stop_away"],
    watch: "Hope's stop when price comes near it. Rare losses, but larger than planned.",
    params: { riskPct: 1, stopAtr: 1.1, targetR: 2.5, takeChance: 0.85, widenChance: 0.9 },
  },
  {
    id: "rook",
    name: "Rook",
    title: "The disciplined trend follower",
    bio: "Waits for a pullback to the SMA 20 in a clear trend, stop under the swing, target at 2R.",
    level: 4,
    rating: 1400,
    style: "trend",
    flaws: [],
    watch: "Rook is hard to beat in a trend and has nothing to do in a range.",
    params: { riskPct: 1, stopAtr: 1.2, targetR: 2, takeChance: 0.9 },
  },
  {
    id: "sage",
    name: "Sage",
    title: "The patient range trader",
    bio: "Trades the edges of a range, or a clean pullback in a trend. Only setups worth 2R or more.",
    level: 5,
    rating: 1550,
    style: "range",
    flaws: [],
    watch: "How long Sage waits. Fewer trades, each with a defined edge.",
    params: { riskPct: 1, stopAtr: 1.3, targetR: 2.2, takeChance: 0.85 },
  },
];

const MIRROR_BASE: BotPersona = {
  id: "mirror",
  name: "Mirror",
  title: "Your own habit",
  bio: "A trend follower that copies your most frequent mistake, so you can see it from the other side.",
  level: 3,
  rating: 1150,
  style: "trend",
  flaws: [],
  watch: "Your own habit, played against you.",
  params: { riskPct: 1, stopAtr: 1.2, targetR: 2, takeChance: 0.9 },
};

const FLAW_PARAMS: Record<BotFlaw, Partial<BotParams>> = {
  stop_inside_noise: { stopAtr: 0.35 },
  overtrading: { takeChance: 0.95, quickExit: true, loose: true, targetR: 1 },
  chased_entry: { targetR: 1.2 },
  revenge_size_up: { riskPct: 0.4, revengeMult: 2.4, loose: true },
  moved_stop_away: { widenChance: 0.9 },
};

/** Mirror with one habit (the player's most frequent one). Without a habit it plays like Rook. */
export function mirrorPersona(flaw: BotFlaw | null): BotPersona {
  if (!flaw) return MIRROR_BASE;
  return { ...MIRROR_BASE, flaws: [flaw], watch: `${FLAW_LABEL[flaw]}: your most frequent habit, played against you.`, params: { ...MIRROR_BASE.params, ...FLAW_PARAMS[flaw] } };
}

export function getBot(id: BotId | string, mirrorFlaw?: BotFlaw | null): BotPersona {
  if (id === "mirror") return mirrorPersona(mirrorFlaw ?? null);
  return BOTS.find((b) => b.id === id) ?? BOTS[0];
}

// ─── Lines in character ────────────────────────────────────────────────────

type LineKey = "enter" | "wait" | "stopped" | "target" | "widen" | "revenge" | "last";

const LINES: Partial<Record<BotId, Partial<Record<LineKey, string[]>>>> = {
  pip: {
    enter: ["Feels like it's going that way.", "Small stop, so it can't hurt much."],
    wait: ["Hmm. Nothing jumps out."],
    stopped: ["Stopped again. Funny how that keeps happening.", "Oops."],
    target: ["Told you!"],
    widen: ["Just a little more room…"],
  },
  dash: {
    enter: ["New round, new trade.", "Can't win if you don't play."],
    stopped: ["Next!"],
    target: ["Banked it. Next!"],
  },
  blaze: {
    enter: ["Look at that candle. I'm in!", "Breakout! Not missing this one."],
    wait: ["Nothing exciting. Waiting for a big move."],
    stopped: ["Bought the top again…"],
    target: ["Momentum pays!"],
  },
  grudge: {
    enter: ["Trend's my friend."],
    revenge: ["I'll win it back. Bigger this time.", "That loss is coming back to me."],
    stopped: ["That one stung."],
    target: ["See? Back on track."],
  },
  hope: {
    enter: ["Nice pullback."],
    widen: ["It'll come back. It just needs more room.", "Not yet. Moving the stop a little."],
    stopped: ["Should have given it even more room…"],
    target: ["Patience paid off."],
  },
  rook: {
    wait: ["No pullback yet. Waiting.", "No clear trend. Flat is a position too."],
    stopped: ["Stopped out. That's what the stop is for."],
    target: ["Target hit. The plan worked."],
    last: ["Last round: no new trades, there's no time left for a plan to work."],
  },
  sage: {
    wait: ["Nothing at the edges. Patience.", "No edge here. I'll wait."],
    stopped: ["Wrong this time. The loss was the planned one."],
    target: ["Edge to edge."],
    last: ["Last round. Nothing new."],
  },
  mirror: {
    wait: ["Waiting, like you would."],
    stopped: ["Familiar, isn't it?"],
    widen: ["You'd move it too, wouldn't you?"],
    revenge: ["You'd want it back too."],
  },
};

function line(id: BotId, key: LineKey, rng: Rng): string | null {
  const options = LINES[id]?.[key];
  return options?.length ? options[Math.floor(rng.next() * options.length)] : null;
}

// ─── Market read (visible candles only) ─────────────────────────────────────

interface Read {
  t: number;
  last: Candle;
  atr: number;
  sma20: number;
  sma50: number;
  up: boolean;
  down: boolean;
  pullbackLong: boolean;
  pullbackShort: boolean;
  swingLow: number;
  swingHigh: number;
  rangeHigh: number;
  rangeLow: number;
  range: boolean;
  burstUp: boolean;
  burstDown: boolean;
}

/** A big candle in direction `dir` among the last three. */
function recentBurst(v: readonly Candle[], a: number, dir: 1 | -1): boolean {
  return v.slice(-3).some((c) => dir * (c.c - c.o) > 0.9 * a);
}

function readMarket(v: readonly Candle[]): Read {
  const t = v.length - 1;
  const last = v[t];
  const a = Math.max(1, atr(v, t, 14));
  const s20 = sma(v, t, 20);
  const s50 = sma(v, t, 50);
  const s20before = sma(v, t - 5, 20);
  const up = s20 > s50 && last.c > s50 && s20 > s20before;
  const down = s20 < s50 && last.c < s50 && s20 < s20before;
  const rangeHigh = highestHigh(v, t - 40, t);
  const rangeLow = lowestLow(v, t - 40, t);
  const flat = Math.abs(s20 - sma(v, t - 15, 20)) < 0.8 * a;
  const body = last.c - last.o;
  const brokeUp = last.c > highestHigh(v, t - 20, t - 1);
  const brokeDown = last.c < lowestLow(v, t - 20, t - 1);
  const stretch = (last.c - s20) / a;
  return {
    t,
    last,
    atr: a,
    sma20: s20,
    sma50: s50,
    up,
    down,
    pullbackLong: up && lowestLow(v, t - 2, t) <= s20 + 0.3 * a && last.c >= s20 - 0.3 * a,
    pullbackShort: down && highestHigh(v, t - 2, t) >= s20 - 0.3 * a && last.c <= s20 + 0.3 * a,
    swingLow: lowestLow(v, t - 8, t),
    swingHigh: highestHigh(v, t - 8, t),
    rangeHigh,
    rangeLow,
    range: rangeHigh - rangeLow < 9 * a && flat,
    burstUp: (recentBurst(v, a, 1) && stretch > 1) || (brokeUp && body > 0.3 * a) || (stretch > 1.8 && body > 0),
    burstDown: (recentBurst(v, a, -1) && stretch < -1) || (brokeDown && -body > 0.3 * a) || (stretch < -1.8 && body < 0),
  };
}

// ─── Decisions ─────────────────────────────────────────────────────────────

export interface BotTurn {
  actions: Action[];
  note: string;
}

export interface BotTurnOptions {
  /** Index of this decision (0-based) and how many decisions the duel has. */
  round: number;
  rounds: number;
  /** The previous decision's step: trades closed since then are reported in the note. */
  sinceStep: number;
}

interface EntryPlan {
  side: "long" | "short";
  orderType: "market" | "limit";
  limitPrice?: number;
  why: string;
  /** Range trades put the stop beyond the range and cap the target at the other side. */
  rangeStop?: number;
  rangeTarget?: number;
  /** Taken without the usual chance of letting it go (the late fallback). */
  forced?: boolean;
}

const fmt = formatPrice;
const r1 = (x: number) => `${x >= 0 ? "+" : "−"}${Math.abs(x).toFixed(1)}R`;

export function tradeR(t: Trade): number | null {
  return t.initialRisk ? (t.realized - t.fees) / t.initialRisk : null;
}

function exitPrice(t: Trade): number {
  return t.exitQty ? Math.round(t.exitNotional / t.exitQty) : 0;
}

function planEntry(p: BotPersona, m: Read, opts: BotTurnOptions, hasTraded: boolean): EntryPlan | null {
  const { params } = p;
  const chase = p.style === "momentum" || p.flaws.includes("chased_entry");
  const longWhy = (s: string) => ({ side: "long" as const, orderType: "market" as const, why: s });
  const shortWhy = (s: string) => ({ side: "short" as const, orderType: "market" as const, why: s });

  let plan: EntryPlan | null = null;
  if (chase) {
    if (m.burstUp) plan = longWhy("A big candle up just broke out");
    else if (m.burstDown) plan = shortWhy("A big candle down just broke down");
  } else if (p.style === "impulse") {
    plan = m.last.c >= m.last.o ? longWhy("The last candle closed up") : shortWhy("The last candle closed down");
  } else if (p.style === "churn") {
    plan = m.last.c >= m.sma20 ? longWhy("Price is above the SMA 20") : shortWhy("Price is below the SMA 20");
  } else if (p.style === "range" && m.range) {
    const w = m.rangeHigh - m.rangeLow;
    if (m.last.c <= m.rangeLow + 0.25 * w) plan = { ...longWhy("Price is at the bottom of the range"), rangeStop: m.rangeLow - 0.5 * m.atr, rangeTarget: m.rangeHigh - 0.15 * w };
    else if (m.last.c >= m.rangeHigh - 0.25 * w) plan = { ...shortWhy("Price is at the top of the range"), rangeStop: m.rangeHigh + 0.5 * m.atr, rangeTarget: m.rangeLow + 0.15 * w };
    else if (m.last.c < m.rangeLow + 0.5 * w)
      plan = { side: "long", orderType: "limit", limitPrice: Math.round(m.rangeLow + 0.15 * w), why: "Price is in the lower half of the range: a buy limit waits near the bottom", rangeStop: m.rangeLow - 0.5 * m.atr, rangeTarget: m.rangeHigh - 0.15 * w };
    else
      plan = { side: "short", orderType: "limit", limitPrice: Math.round(m.rangeHigh - 0.15 * w), why: "Price is in the upper half of the range: a sell limit waits near the top", rangeStop: m.rangeHigh + 0.5 * m.atr, rangeTarget: m.rangeLow + 0.15 * w };
  } else {
    // Trend styles (and Sage outside a range).
    if (m.pullbackLong) plan = longWhy("Uptrend (SMA 20 above SMA 50) and price pulled back to the SMA 20");
    else if (m.pullbackShort) plan = shortWhy("Downtrend (SMA 20 below SMA 50) and price pulled back to the SMA 20");
    else if (params.loose && m.up) plan = longWhy("Price is in an uptrend");
    else if (params.loose && m.down) plan = shortWhy("Price is in a downtrend");
  }

  if (!plan && p.flaws.includes("overtrading")) plan = m.last.c >= m.sma20 ? longWhy("Price is above the SMA 20") : shortWhy("Price is below the SMA 20");
  // Late in the duel without a single trade, every bot takes the trend's side rather than sit out.
  if (!plan && !hasTraded && chase && opts.round >= opts.rounds - 4) {
    plan = { ...(m.last.c >= m.sma20 ? longWhy("Price is running above the SMA 20 and I'm not missing it") : shortWhy("Price is running below the SMA 20 and I'm not missing it")), forced: true };
  }
  if (!plan && !hasTraded && opts.round >= opts.rounds - 3) {
    plan = { ...(m.sma20 >= m.sma50 ? longWhy("Running out of rounds; the SMA 20 is above the SMA 50") : shortWhy("Running out of rounds; the SMA 20 is below the SMA 50")), forced: true };
  }
  return plan;
}

/**
 * One decision of a bot at the current step of its account. Pure and deterministic for a given
 * random stream: it only reads the candles revealed so far (`0…state.step`) and its own state.
 * Every returned action has been accepted by the engine, in order.
 */
export function botDecide(ctx: SimContext, start: SimState, p: BotPersona, rng: Rng, opts: BotTurnOptions): BotTurn {
  const visible = ctx.candles.slice(0, start.step + 1);
  const m = readMarket(visible);
  const params = p.params;
  const actions: Action[] = [];
  const said: string[] = [];
  const flavor: (string | null)[] = [];
  let state = start;
  const act = (a: Action): boolean => {
    const r = apply(ctx, state, a);
    if (r.rejected) return false;
    state = r.state;
    actions.push(a);
    return true;
  };

  // What happened since the last decision.
  const closedSince = start.trades.filter((t) => t.exitStep !== null && t.exitStep > opts.sinceStep);
  for (const t of closedSince) {
    const r = tradeR(t);
    const label = t.exitReason === "stop" ? "Stopped out" : t.exitReason === "target" ? "Target hit" : "Closed";
    said.push(`${label} at ${fmt(exitPrice(t))}${r !== null ? ` (${r1(r)})` : ""}.`);
    flavor.push(line(p.id, t.exitReason === "stop" ? "stopped" : t.exitReason === "target" ? "target" : "stopped", rng));
  }

  // Managing the open position.
  const pos = state.position;
  if (pos) {
    const long = pos.side === "long";
    const turned = (p.style === "trend" || p.style === "range") && (long ? m.sma20 < m.sma50 && m.last.c < m.sma20 : m.sma20 > m.sma50 && m.last.c > m.sma20);
    const losing = unrealizedPnl(pos, m.last.c) < 0;
    const near = pos.stopLoss !== null && (long ? m.last.c - pos.stopLoss : pos.stopLoss - m.last.c) < 2 * m.atr;
    if (params.quickExit && state.step - pos.openedStep >= 5) {
      if (act({ type: "close_position" })) said.push(`Closed the ${pos.side} at market after one round.`);
    } else if (turned) {
      if (act({ type: "close_position" })) said.push("The trend turned (SMA 20 crossed the SMA 50), so the reason for the trade is gone. Closed at market.");
    } else if (params.widenChance && losing && (near || params.widenChance >= 0.9) && pos.stopLoss !== null && rng.next() < params.widenChance) {
      const to = Math.max(1, Math.round(long ? pos.stopLoss - m.atr : pos.stopLoss + m.atr));
      if (act({ type: "modify_brackets", stopLoss: to })) {
        said.push(`Moved the stop from ${fmt(pos.stopLoss)} to ${fmt(to)}.`);
        flavor.push(line(p.id, "widen", rng));
      }
    } else {
      said.push(`Holding the ${pos.side}: stop ${pos.stopLoss !== null ? fmt(pos.stopLoss) : "none"}${pos.takeProfit !== null ? `, target ${fmt(pos.takeProfit)}` : ""}.`);
    }
  }

  // A limit order that has waited two rounds is cancelled.
  for (const o of state.orders) {
    if (state.step - o.submittedStep >= 20 && act({ type: "cancel_order", orderId: o.id })) said.push(`Cancelled the ${o.side} limit at ${fmt(o.limitPrice)}: it didn't fill.`);
  }

  // A new entry, when flat with nothing pending.
  if (!state.position && state.orders.length === 0) {
    const hasTraded = state.trades.length > 0;
    const lastRound = opts.round >= opts.rounds - 1;
    const disciplined = p.flaws.length === 0;
    let plan = lastRound && disciplined && hasTraded ? null : planEntry(p, m, opts, hasTraded);
    if (plan?.side === "short" && !ctx.cfg.rules.allowShort) plan = null;
    if (lastRound && disciplined && hasTraded) flavor.push(line(p.id, "last", rng));
    if (plan && !plan.forced && rng.next() > params.takeChance) {
      said.push(`${plan.why}, but I let this one go.`);
      plan = null;
    } else if (plan) {
      const placed = placeEntry(ctx, state, p, m, plan);
      if (placed) {
        act(placed.action);
        said.push(placed.text);
        flavor.push(line(p.id, placed.revenge ? "revenge" : "enter", rng));
      } else said.push(`${plan.why}, but no order fits the risk limit here. Waiting.`);
    } else if (!lastRound || !disciplined || !hasTraded) {
      said.push("No setup. Waiting.");
      flavor.push(line(p.id, "wait", rng));
    }
  }

  const extra = flavor.find((f): f is string => Boolean(f));
  return { actions, note: [...said, ...(extra ? [`“${extra}”`] : [])].join(" ") };
}

function placeEntry(ctx: SimContext, state: SimState, p: BotPersona, m: Read, plan: EntryPlan): { action: Action; text: string; revenge: boolean } | null {
  const params = p.params;
  const long = plan.side === "long";
  const { bid, ask } = bidAsk(ctx, state);
  const hs = ctx.cfg.costs.halfSpread;
  const entry = plan.orderType === "limit" && plan.limitPrice ? (long ? Math.min(plan.limitPrice, ask) : Math.max(plan.limitPrice, bid)) : long ? ask : bid;
  const minDist = 2 * hs + 3;

  let dist = params.stopAtr * m.atr;
  let stop: number;
  if (p.flaws.includes("stop_inside_noise")) stop = long ? entry - dist : entry + dist;
  else if (plan.rangeStop !== undefined) stop = long ? Math.min(plan.rangeStop, entry - m.atr) : Math.max(plan.rangeStop, entry + m.atr);
  else if (p.style === "trend" || p.style === "range") stop = long ? Math.min(m.swingLow - 0.2 * m.atr, entry - dist) : Math.max(m.swingHigh + 0.2 * m.atr, entry + dist);
  else stop = long ? entry - dist : entry + dist;
  stop = Math.round(stop);
  dist = Math.abs(entry - stop);
  if (dist < minDist) {
    stop = long ? entry - minDist : entry + minDist;
    dist = minDist;
  }
  if (dist > 4 * m.atr || stop <= 0) return null;

  let target = Math.round(long ? entry + params.targetR * dist : entry - params.targetR * dist);
  if (plan.rangeTarget !== undefined) {
    const capped = Math.round(plan.rangeTarget);
    target = long ? Math.min(target, capped) : Math.max(target, capped);
    if (Math.abs(target - entry) < 1.8 * dist) return null;
  }

  const closed = state.trades.filter((t) => t.exitStep !== null);
  const lastTrade = closed[closed.length - 1];
  const revenge = Boolean(params.revengeMult && lastTrade && lastTrade.realized - lastTrade.fees < 0);
  const riskPct = Math.min(ctx.cfg.rules.maxRiskPct ?? 1, revenge ? params.riskPct * params.revengeMult! : params.riskPct);
  const equity = equityOf(ctx, state);
  let qty = maxQtyForRisk({ equity, riskPct, side: plan.side, entry, stop, commissionBps: ctx.cfg.costs.commissionBps, maxNotional: equity }).qty;
  const base = { type: "submit_order" as const, side: long ? ("buy" as const) : ("sell" as const), orderType: plan.orderType, stopLoss: stop, takeProfit: target, ...(plan.orderType === "limit" ? { limitPrice: plan.limitPrice } : {}) };
  for (let i = 0; i < 8 && qty > 0; i++) {
    const pv = previewOrder(ctx, state, { ...base, qty });
    if (pv.ok) {
      const how = plan.orderType === "limit" ? `${long ? "Buy" : "Sell"} limit ${qty} at ${fmt(plan.limitPrice!)}` : `${long ? "Long" : "Short"} ${qty} at market`;
      const rr = pv.rewardRisk !== null ? ` (${pv.rewardRisk.toFixed(1)}R)` : "";
      const size = revenge ? ` Risking ${riskPct.toFixed(1)}% after the loss, up from ${params.riskPct.toFixed(1)}%.` : "";
      return { action: { ...base, qty }, text: `${plan.why}. ${how}, stop ${fmt(stop)}, target ${fmt(target)}${rr}.${size}`, revenge };
    }
    qty = Math.floor(qty * 0.9);
  }
  return null;
}
