import type {
  Action,
  Candle,
  EngineEvent,
  ExitReason,
  FillReason,
  IntrabarPath,
  OrderPreview,
  Position,
  PositionSide,
  Rejection,
  RejectCode,
  Side,
  SimContext,
  SimState,
  StepResult,
  Trade,
} from "./types";
import { commission, formatPrice } from "./units";

type SubmitOrder = Extract<Action, { type: "submit_order" }>;

const MAX_PENDING_ORDERS = 5;

// ─── Basics ────────────────────────────────────────────────────────────────

export function createContext(cfg: SimContext["cfg"], candles: readonly Candle[]): SimContext {
  if (candles.length === 0) throw new Error("A scenario needs at least one candle.");
  return { cfg, candles };
}

export function initState(ctx: SimContext, startStep: number): SimState {
  if (!Number.isInteger(startStep) || startStep < 0 || startStep >= ctx.candles.length) {
    throw new Error(`startStep ${startStep} is outside the scenario (0..${ctx.candles.length - 1}).`);
  }
  return {
    step: startStep,
    realized: 0,
    fees: 0,
    position: null,
    orders: [],
    trades: [],
    equityPeak: ctx.cfg.initialEquity,
    maxDrawdown: 0,
    maxDrawdownBps: 0,
    maxExposureBps: 0,
    idSeq: 0,
    ended: false,
  };
}

export function lastStep(ctx: SimContext): number {
  return ctx.candles.length - 1;
}

export function markPrice(ctx: SimContext, state: SimState): number {
  return ctx.candles[state.step].c;
}

export function bidAsk(ctx: SimContext, state: SimState): { bid: number; ask: number; mid: number } {
  const mid = markPrice(ctx, state);
  const hs = ctx.cfg.costs.halfSpread;
  return { bid: mid - hs, ask: mid + hs, mid };
}

export function unrealizedPnl(position: Position | null, mark: number): number {
  if (!position) return 0;
  const value = position.qty * mark;
  return position.side === "long" ? value - position.costBasis : position.costBasis - value;
}

export function equityOf(ctx: SimContext, state: SimState, mark = markPrice(ctx, state)): number {
  return ctx.cfg.initialEquity + state.realized - state.fees + unrealizedPnl(state.position, mark);
}

export function averageEntry(position: Position): number {
  return position.costBasis / position.qty;
}

export function openTrade(state: SimState): Trade | null {
  if (!state.position) return null;
  return state.trades.find((t) => t.id === state.position!.tradeId) ?? null;
}

/** Money lost if a position of `qty` entered at `entry` exits at `stop`, including both commissions. */
export function riskAmount(
  side: PositionSide,
  qty: number,
  entry: number,
  stop: number,
  commissionBps: number,
): number {
  const distance = side === "long" ? entry - stop : stop - entry;
  return qty * distance + commission(qty * entry, commissionBps) + commission(qty * stop, commissionBps);
}

function isPositiveInt(n: unknown): n is number {
  return typeof n === "number" && Number.isSafeInteger(n) && n > 0;
}

function clone(state: SimState): SimState {
  return structuredClone(state);
}

function nextId(s: SimState, prefix: string): string {
  s.idSeq += 1;
  return `${prefix}${s.idSeq}`;
}

function pendingNotional(s: SimState): number {
  return s.orders.reduce((sum, o) => sum + o.qty * o.limitPrice, 0);
}

function sideOf(dir: PositionSide): Side {
  return dir === "long" ? "buy" : "sell";
}

function dirOf(side: Side): PositionSide {
  return side === "buy" ? "long" : "short";
}

function exitReasonOf(reason: FillReason): ExitReason {
  if (reason === "stop" || reason === "target" || reason === "session_end") return reason;
  return "manual";
}

// ─── Order preview / validation ────────────────────────────────────────────

/**
 * Validates an order against the current state and computes what it would cost and risk.
 * Pure: never changes the state. `apply` uses the same function, so the preview a user sees
 * is exactly what the engine enforces.
 */
export function previewOrder(ctx: SimContext, state: SimState, a: SubmitOrder): OrderPreview {
  const { rules, costs } = ctx.cfg;
  const hs = costs.halfSpread;
  const bps = costs.commissionBps;
  const { bid, ask } = bidAsk(ctx, state);
  const equity = equityOf(ctx, state);
  const dir = dirOf(a.side);
  const marketPrice = a.side === "buy" ? ask : bid;

  let entry = marketPrice;
  if (a.orderType === "limit" && isPositiveInt(a.limitPrice)) {
    entry = a.side === "buy" ? Math.min(a.limitPrice, ask) : Math.max(a.limitPrice, bid);
  }

  const qtyOk = isPositiveInt(a.qty);
  const qty = qtyOk ? a.qty : 0;
  const sl = a.stopLoss ?? null;
  const tp = a.takeProfit ?? null;
  const notional = qty * entry;
  const entryFee = commission(notional, bps);
  const exitFeeAtStop = sl !== null && qtyOk ? commission(qty * sl, bps) : 0;
  const risk = sl !== null && qtyOk ? riskAmount(dir, qty, entry, sl, bps) : null;
  const reward =
    tp !== null && qtyOk
      ? qty * (dir === "long" ? tp - entry : entry - tp) - entryFee - commission(qty * tp, bps)
      : null;
  const rewardRisk = risk !== null && reward !== null && risk > 0 ? reward / risk : null;
  const exposure = (state.position ? state.position.qty * markPrice(ctx, state) : 0) + pendingNotional(state);
  const buyingPower = Math.max(0, Math.floor(equity * rules.maxLeverage) - exposure);

  const base: OrderPreview = {
    ok: true,
    entryPrice: entry,
    notional,
    entryFee,
    exitFeeAtStop,
    risk,
    riskPct: risk !== null && equity > 0 ? (risk * 100) / equity : null,
    reward,
    rewardRisk,
    equity,
    buyingPower,
  };
  const reject = (code: RejectCode, message: string): OrderPreview => ({
    ...base,
    ok: false,
    rejection: { code, message },
  });

  if (state.ended) return reject("SESSION_NOT_ACTIVE", "This session has ended.");
  if (!rules.orderTypes.includes(a.orderType)) {
    return reject("ORDER_TYPE_NOT_ALLOWED", `${a.orderType === "limit" ? "Limit" : "Market"} orders are not available in this scenario.`);
  }
  if (!qtyOk) return reject("INVALID_QUANTITY", "Quantity must be a whole number of units, greater than zero.");
  if (a.orderType === "limit" && !isPositiveInt(a.limitPrice)) return reject("INVALID_PRICE", "Enter a valid limit price.");
  if ((sl !== null && !isPositiveInt(sl)) || (tp !== null && !isPositiveInt(tp))) {
    return reject("INVALID_PRICE", "Stop-loss and take-profit must be valid prices.");
  }
  if (dir === "short" && !rules.allowShort) return reject("SHORT_NOT_ALLOWED", "Short selling is not allowed in this scenario.");
  const pos = state.position;
  if (pos && pos.side !== dir) {
    return reject("CONFLICTING_DIRECTION", "Close your current position before trading in the opposite direction.");
  }
  if (state.orders.some((o) => o.side !== a.side)) {
    return reject("CONFLICTING_DIRECTION", "Cancel your pending order in the other direction first.");
  }
  if (a.orderType === "limit" && state.orders.length >= MAX_PENDING_ORDERS) {
    return reject("TOO_MANY_ORDERS", `You can have at most ${MAX_PENDING_ORDERS} pending orders.`);
  }
  if (rules.requireStop && sl === null) return reject("STOP_REQUIRED", "This scenario requires a stop-loss on every entry.");

  // After the fill, the exit side of the book is two half-spreads away from the entry price.
  const exitSideAtEntry = dir === "long" ? entry - 2 * hs : entry + 2 * hs;
  if (sl !== null && (dir === "long" ? sl >= exitSideAtEntry : sl <= exitSideAtEntry)) {
    return reject(
      "STOP_WRONG_SIDE",
      dir === "long"
        ? `For a buy, the stop-loss must be below ${formatPrice(exitSideAtEntry)} (the price you could sell at right after entry).`
        : `For a sell, the stop-loss must be above ${formatPrice(exitSideAtEntry)} (the price you could buy back at right after entry).`,
    );
  }
  if (tp !== null && (dir === "long" ? tp <= entry : tp >= entry)) {
    return reject(
      "TARGET_WRONG_SIDE",
      dir === "long" ? "For a buy, the take-profit must be above the entry price." : "For a sell, the take-profit must be below the entry price.",
    );
  }
  if (notional + entryFee > buyingPower) {
    return reject(
      "INSUFFICIENT_BUYING_POWER",
      `Not enough buying power: this order needs ${formatPrice(notional + entryFee)} and you have ${formatPrice(buyingPower)} available.`,
    );
  }
  if (rules.enforceMaxRisk && rules.maxRiskPct !== undefined && risk !== null && risk * 100 > equity * rules.maxRiskPct) {
    return reject("RISK_LIMIT_EXCEEDED", `This order risks more than the ${rules.maxRiskPct}% limit of this scenario.`);
  }
  return base;
}

// ─── Fills ─────────────────────────────────────────────────────────────────

interface FillInput {
  side: Side;
  qty: number;
  price: number;
  reason: FillReason;
  orderId: string;
  stopLoss?: number | null;
  takeProfit?: number | null;
}

function fill(ctx: SimContext, s: SimState, events: EngineEvent[], f: FillInput): void {
  const bps = ctx.cfg.costs.commissionBps;
  const notional = f.qty * f.price;
  const fee = commission(notional, bps);
  s.fees += fee;
  events.push({ type: "order_filled", step: s.step, orderId: f.orderId, side: f.side, qty: f.qty, price: f.price, fee, reason: f.reason });

  const dir = dirOf(f.side);
  const pos = s.position;

  if (!pos) {
    const tradeId = nextId(s, "T");
    const stopLoss = f.stopLoss ?? null;
    s.position = {
      side: dir,
      qty: f.qty,
      costBasis: notional,
      stopLoss,
      takeProfit: f.takeProfit ?? null,
      openedStep: s.step,
      tradeId,
    };
    s.trades.push({
      id: tradeId,
      side: dir,
      entryStep: s.step,
      exitStep: null,
      maxQty: f.qty,
      entryQty: f.qty,
      entryNotional: notional,
      exitQty: 0,
      exitNotional: 0,
      initialStop: stopLoss,
      initialRisk: stopLoss !== null ? riskAmount(dir, f.qty, f.price, stopLoss, bps) : null,
      realized: 0,
      fees: fee,
      mae: 0,
      mfe: 0,
      exitReason: null,
    });
    return;
  }

  const trade = s.trades.find((t) => t.id === pos.tradeId)!;
  trade.fees += fee;

  if (pos.side === dir) {
    pos.qty += f.qty;
    pos.costBasis += notional;
    if (f.stopLoss !== undefined) pos.stopLoss = f.stopLoss;
    if (f.takeProfit !== undefined) pos.takeProfit = f.takeProfit;
    trade.entryQty += f.qty;
    trade.entryNotional += notional;
    trade.maxQty = Math.max(trade.maxQty, pos.qty);
    return;
  }

  const closeQty = Math.min(f.qty, pos.qty);
  const closedBasis = closeQty === pos.qty ? pos.costBasis : Math.round((pos.costBasis * closeQty) / pos.qty);
  const pnl = pos.side === "long" ? closeQty * f.price - closedBasis : closedBasis - closeQty * f.price;
  s.realized += pnl;
  pos.qty -= closeQty;
  pos.costBasis -= closedBasis;
  trade.realized += pnl;
  trade.exitQty += closeQty;
  trade.exitNotional += closeQty * f.price;

  if (pos.qty === 0) {
    trade.exitStep = s.step;
    trade.exitReason = exitReasonOf(f.reason);
    s.position = null;
    events.push({ type: "position_closed", step: s.step, tradeId: trade.id, reason: trade.exitReason, realized: trade.realized });
  }
}

function updateRiskMetrics(ctx: SimContext, s: SimState): void {
  const equity = equityOf(ctx, s);
  if (equity > s.equityPeak) s.equityPeak = equity;
  const dd = s.equityPeak - equity;
  if (dd > s.maxDrawdown) s.maxDrawdown = dd;
  const ddBps = s.equityPeak > 0 ? Math.round((dd * 10000) / s.equityPeak) : 0;
  if (ddBps > s.maxDrawdownBps) s.maxDrawdownBps = ddBps;
  if (s.position && equity > 0) {
    const exposureBps = Math.round((s.position.qty * markPrice(ctx, s) * 10000) / equity);
    if (exposureBps > s.maxExposureBps) s.maxExposureBps = exposureBps;
  }
}

// ─── Actions ───────────────────────────────────────────────────────────────

function rejected(state: SimState, rejection: Rejection): StepResult {
  return {
    state,
    events: [{ type: "order_rejected", step: state.step, code: rejection.code, message: rejection.message }],
    rejected: rejection,
  };
}

/** Applies one user action at the current step. A rejected action returns the original state unchanged. */
export function apply(ctx: SimContext, state: SimState, action: Action): StepResult {
  if (state.ended) return rejected(state, { code: "SESSION_NOT_ACTIVE", message: "This session has ended." });

  switch (action.type) {
    case "submit_order": {
      const preview = previewOrder(ctx, state, action);
      if (!preview.ok) return rejected(state, preview.rejection!);
      const s = clone(state);
      const events: EngineEvent[] = [];
      const orderId = nextId(s, "O");
      const stopLoss = action.stopLoss ?? null;
      const takeProfit = action.takeProfit ?? null;
      events.push({
        type: "order_submitted",
        step: s.step,
        orderId,
        side: action.side,
        orderType: action.orderType,
        qty: action.qty,
        limitPrice: action.orderType === "limit" ? action.limitPrice! : null,
        stopLoss,
        takeProfit,
      });
      const { bid, ask } = bidAsk(ctx, s);
      const marketable =
        action.orderType === "market" ||
        (action.side === "buy" ? action.limitPrice! >= ask : action.limitPrice! <= bid);
      if (marketable) {
        fill(ctx, s, events, {
          side: action.side,
          qty: action.qty,
          price: action.side === "buy" ? ask : bid,
          reason: action.orderType === "market" ? "market" : "limit",
          orderId,
          stopLoss: action.stopLoss,
          takeProfit: action.takeProfit,
        });
      } else {
        s.orders.push({
          id: orderId,
          side: action.side,
          qty: action.qty,
          limitPrice: action.limitPrice!,
          stopLoss,
          takeProfit,
          submittedStep: s.step,
        });
      }
      updateRiskMetrics(ctx, s);
      return { state: s, events };
    }

    case "modify_brackets": {
      const pos = state.position;
      if (!pos) return rejected(state, { code: "NO_POSITION", message: "There is no open position to modify." });
      const { bid, ask } = bidAsk(ctx, state);
      const exitPrice = pos.side === "long" ? bid : ask;
      const sl = action.stopLoss === undefined ? pos.stopLoss : action.stopLoss;
      const tp = action.takeProfit === undefined ? pos.takeProfit : action.takeProfit;
      if ((sl !== null && !isPositiveInt(sl)) || (tp !== null && !isPositiveInt(tp))) {
        return rejected(state, { code: "INVALID_PRICE", message: "Stop-loss and take-profit must be valid prices." });
      }
      if (sl !== null && (pos.side === "long" ? sl >= exitPrice : sl <= exitPrice)) {
        return rejected(state, {
          code: "STOP_WRONG_SIDE",
          message: `The stop-loss must be ${pos.side === "long" ? "below" : "above"} the current exit price (${formatPrice(exitPrice)}). To exit now, close the position.`,
        });
      }
      if (tp !== null && (pos.side === "long" ? tp <= exitPrice : tp >= exitPrice)) {
        return rejected(state, {
          code: "TARGET_WRONG_SIDE",
          message: `The take-profit must be ${pos.side === "long" ? "above" : "below"} the current exit price (${formatPrice(exitPrice)}). To exit now, close the position.`,
        });
      }
      const s = clone(state);
      const p = s.position!;
      const event: EngineEvent = {
        type: "brackets_modified",
        step: s.step,
        stopLoss: sl,
        takeProfit: tp,
        prevStopLoss: p.stopLoss,
        prevTakeProfit: p.takeProfit,
      };
      p.stopLoss = sl;
      p.takeProfit = tp;
      return { state: s, events: [event] };
    }

    case "cancel_order": {
      if (!state.orders.some((o) => o.id === action.orderId)) {
        return rejected(state, { code: "ORDER_NOT_FOUND", message: "That order no longer exists." });
      }
      const s = clone(state);
      s.orders = s.orders.filter((o) => o.id !== action.orderId);
      return { state: s, events: [{ type: "order_cancelled", step: s.step, orderId: action.orderId }] };
    }

    case "close_position": {
      const pos = state.position;
      if (!pos) return rejected(state, { code: "NO_POSITION", message: "There is no open position to close." });
      const qty = action.qty ?? pos.qty;
      if (!isPositiveInt(qty) || qty > pos.qty) {
        return rejected(state, { code: "INVALID_QUANTITY", message: `You can close between 1 and ${pos.qty} units.` });
      }
      const s = clone(state);
      const events: EngineEvent[] = [];
      const { bid, ask } = bidAsk(ctx, s);
      fill(ctx, s, events, {
        side: sideOf(pos.side === "long" ? "short" : "long"),
        qty,
        price: pos.side === "long" ? bid : ask,
        reason: "manual",
        orderId: nextId(s, "O"),
      });
      updateRiskMetrics(ctx, s);
      return { state: s, events };
    }
  }
}

// ─── Time ──────────────────────────────────────────────────────────────────

interface Trigger {
  kind: "sl" | "tp" | "limit";
  /** "down": fires when mid ≤ x. "up": fires when mid ≥ x. */
  dir: "down" | "up";
  x: number;
  priority: number;
  orderId?: string;
}

function triggersOf(s: SimState, hs: number): Trigger[] {
  const out: Trigger[] = [];
  const p = s.position;
  if (p) {
    if (p.side === "long") {
      if (p.stopLoss !== null) out.push({ kind: "sl", dir: "down", x: p.stopLoss + hs, priority: 0 });
      if (p.takeProfit !== null) out.push({ kind: "tp", dir: "up", x: p.takeProfit + hs, priority: 1 });
    } else {
      if (p.stopLoss !== null) out.push({ kind: "sl", dir: "up", x: p.stopLoss - hs, priority: 0 });
      if (p.takeProfit !== null) out.push({ kind: "tp", dir: "down", x: p.takeProfit - hs, priority: 1 });
    }
  }
  for (const o of s.orders) {
    out.push(
      o.side === "buy"
        ? { kind: "limit", dir: "down", x: o.limitPrice - hs, priority: 2, orderId: o.id }
        : { kind: "limit", dir: "up", x: o.limitPrice + hs, priority: 2, orderId: o.id },
    );
  }
  return out;
}

function isSatisfied(t: Trigger, mid: number): boolean {
  return t.dir === "down" ? mid <= t.x : mid >= t.x;
}

/** Nearest trigger level strictly beyond `from`, up to and including `to`, in the direction of travel. */
function nextCrossing(s: SimState, hs: number, from: number, to: number): number | null {
  if (to === from) return null;
  const down = to < from;
  let best: number | null = null;
  for (const t of triggersOf(s, hs)) {
    if (down && t.dir === "down" && t.x < from && t.x >= to) best = best === null ? t.x : Math.max(best, t.x);
    if (!down && t.dir === "up" && t.x > from && t.x <= to) best = best === null ? t.x : Math.min(best, t.x);
  }
  return best;
}

/** Fires every trigger satisfied at `mid`, at the executable price at that point (stop first, then target, then entries). */
function fireSatisfied(ctx: SimContext, s: SimState, events: EngineEvent[], mid: number): void {
  const hs = ctx.cfg.costs.halfSpread;
  for (let guard = 0; guard < 20; guard++) {
    const due = triggersOf(s, hs)
      .filter((t) => isSatisfied(t, mid))
      .sort((a, b) => a.priority - b.priority || (a.orderId ?? "").localeCompare(b.orderId ?? ""));
    const t = due[0];
    if (!t) return;
    if (t.kind === "limit") {
      const order = s.orders.find((o) => o.id === t.orderId)!;
      s.orders = s.orders.filter((o) => o.id !== order.id);
      fill(ctx, s, events, {
        side: order.side,
        qty: order.qty,
        price: order.side === "buy" ? mid + hs : mid - hs,
        reason: "limit",
        orderId: order.id,
        stopLoss: order.stopLoss,
        takeProfit: order.takeProfit,
      });
    } else {
      const pos = s.position!;
      fill(ctx, s, events, {
        side: pos.side === "long" ? "sell" : "buy",
        qty: pos.qty,
        price: pos.side === "long" ? mid - hs : mid + hs,
        reason: t.kind === "sl" ? "stop" : "target",
        orderId: nextId(s, "O"),
      });
    }
  }
}

/** When the intrabar order is unknown, assume the adverse extreme came first. */
function pessimisticPath(s: SimState): IntrabarPath {
  if (s.position) return s.position.side === "long" ? "OLHC" : "OHLC";
  if (s.orders.length > 0) return s.orders[0].side === "buy" ? "OLHC" : "OHLC";
  return "OHLC";
}

function processCandle(ctx: SimContext, s: SimState, events: EngineEvent[], k: number): void {
  const cd = ctx.candles[k];
  const hs = ctx.cfg.costs.halfSpread;
  s.step = k;
  const path = cd.path ?? pessimisticPath(s);
  const points = path === "OHLC" ? [cd.h, cd.l, cd.c] : [cd.l, cd.h, cd.c];

  // Gap at the open: anything already through its level fills at the open.
  let cur = cd.o;
  fireSatisfied(ctx, s, events, cur);
  for (const target of points) {
    for (let guard = 0; guard < 50; guard++) {
      const x = nextCrossing(s, hs, cur, target);
      if (x === null) break;
      cur = x;
      fireSatisfied(ctx, s, events, cur);
    }
    cur = target;
  }

  const pos = s.position;
  if (pos) {
    const trade = s.trades.find((t) => t.id === pos.tradeId)!;
    const atLow = unrealizedPnl(pos, cd.l);
    const atHigh = unrealizedPnl(pos, cd.h);
    trade.mae = Math.max(trade.mae, -Math.min(atLow, atHigh));
    trade.mfe = Math.max(trade.mfe, Math.max(atLow, atHigh));
  }
  updateRiskMetrics(ctx, s);
  events.push({ type: "step_advanced", step: k });
}

/** Reveals and processes candles up to `toStep` (inclusive). */
export function advance(ctx: SimContext, state: SimState, toStep: number): StepResult {
  const target = Math.min(toStep, lastStep(ctx));
  if (state.ended || target <= state.step) return { state, events: [] };
  const s = clone(state);
  const events: EngineEvent[] = [];
  for (let k = s.step + 1; k <= target; k++) processCandle(ctx, s, events, k);
  return { state: s, events };
}

/** Ends the session: cancels pending orders and closes any open position at the current exit price. */
export function finish(ctx: SimContext, state: SimState): StepResult {
  if (state.ended) return { state, events: [] };
  const s = clone(state);
  const events: EngineEvent[] = [];
  for (const o of s.orders) events.push({ type: "order_cancelled", step: s.step, orderId: o.id });
  s.orders = [];
  const pos = s.position;
  if (pos) {
    const { bid, ask } = bidAsk(ctx, s);
    fill(ctx, s, events, {
      side: pos.side === "long" ? "sell" : "buy",
      qty: pos.qty,
      price: pos.side === "long" ? bid : ask,
      reason: "session_end",
      orderId: nextId(s, "O"),
    });
  }
  updateRiskMetrics(ctx, s);
  s.ended = true;
  events.push({ type: "session_ended", step: s.step });
  return { state: s, events };
}

// ─── Replay ────────────────────────────────────────────────────────────────

export type LogEntry =
  | { kind: "action"; step: number; action: Action }
  | { kind: "advance"; to: number }
  | { kind: "finish" };

/** Rebuilds a session from its log. The same inputs always produce the same state and events. */
export function replay(
  ctx: SimContext,
  startStep: number,
  log: readonly LogEntry[],
): { state: SimState; events: EngineEvent[]; rejections: Rejection[] } {
  let state = initState(ctx, startStep);
  const events: EngineEvent[] = [];
  const rejections: Rejection[] = [];
  for (const entry of log) {
    if (entry.kind === "advance") {
      const r = advance(ctx, state, entry.to);
      state = r.state;
      events.push(...r.events);
    } else if (entry.kind === "finish") {
      const r = finish(ctx, state);
      state = r.state;
      events.push(...r.events);
    } else {
      if (entry.step < state.step) throw new Error(`Log entry at step ${entry.step} is behind the session (step ${state.step}).`);
      if (entry.step > state.step) {
        const r = advance(ctx, state, entry.step);
        state = r.state;
        events.push(...r.events);
      }
      const r = apply(ctx, state, entry.action);
      state = r.state;
      events.push(...r.events);
      if (r.rejected) rejections.push(r.rejected);
    }
  }
  return { state, events, rejections };
}
