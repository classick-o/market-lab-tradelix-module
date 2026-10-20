import { describe, expect, it } from "vitest";
import {
  advance,
  apply,
  createContext,
  equityOf,
  finish,
  hashValue,
  initState,
  maxQtyForRisk,
  replay,
  type Candle,
  type EngineConfig,
  type LogEntry,
  type SimState,
} from "../src";

const cfg = (over: Partial<EngineConfig["rules"]> = {}): EngineConfig => ({
  symbol: "LABX",
  initialEquity: 1_000_000,
  costs: { halfSpread: 5, commissionBps: 5 },
  rules: { allowShort: true, orderTypes: ["market", "limit"], maxLeverage: 1, requireStop: false, ...over },
});

const c = (o: number, h: number, l: number, cl: number, path: Candle["path"] = "OHLC"): Candle => ({ o, h, l, c: cl, v: 1000, path });

function mustApply(ctx: ReturnType<typeof createContext>, s: SimState, action: Parameters<typeof apply>[2]) {
  const r = apply(ctx, s, action);
  if (r.rejected) throw new Error(`unexpected rejection: ${r.rejected.code} ${r.rejected.message}`);
  return r;
}

describe("market orders", () => {
  it("fills a buy at the close plus half the spread and charges commission rounded up", () => {
    const ctx = createContext(cfg(), [c(10000, 10010, 9990, 10000)]);
    const r = mustApply(ctx, initState(ctx, 0), { type: "submit_order", side: "buy", orderType: "market", qty: 46 });
    const filled = r.events.find((e) => e.type === "order_filled");
    expect(filled).toMatchObject({ price: 10005, qty: 46, fee: 231 });
    expect(r.state.position).toMatchObject({ side: "long", qty: 46, costBasis: 46 * 10005 });
    // Marked at mid: lose the half-spread on 46 units plus the fee.
    expect(equityOf(ctx, r.state)).toBe(1_000_000 - 46 * 5 - 231);
  });

  it("rejects a stop on the wrong side and leaves the state untouched", () => {
    const ctx = createContext(cfg(), [c(10000, 10010, 9990, 10000)]);
    const s0 = initState(ctx, 0);
    const r = apply(ctx, s0, { type: "submit_order", side: "buy", orderType: "market", qty: 10, stopLoss: 10100 });
    expect(r.rejected?.code).toBe("STOP_WRONG_SIDE");
    expect(r.state).toBe(s0);
  });

  it("rejects orders larger than the buying power", () => {
    const ctx = createContext(cfg(), [c(10000, 10010, 9990, 10000)]);
    const r = apply(ctx, initState(ctx, 0), { type: "submit_order", side: "buy", orderType: "market", qty: 101 });
    expect(r.rejected?.code).toBe("INSUFFICIENT_BUYING_POWER");
  });

  it("refuses shorts when the scenario does not allow them", () => {
    const ctx = createContext(cfg({ allowShort: false }), [c(10000, 10010, 9990, 10000)]);
    const r = apply(ctx, initState(ctx, 0), { type: "submit_order", side: "sell", orderType: "market", qty: 1 });
    expect(r.rejected?.code).toBe("SHORT_NOT_ALLOWED");
  });
});

describe("stops, targets and limits", () => {
  it("fills a long stop exactly at the stop price when the candle trades through it", () => {
    const ctx = createContext(cfg(), [c(10000, 10010, 9990, 10000), c(10000, 10020, 9700, 9750)]);
    let s = mustApply(ctx, initState(ctx, 0), { type: "submit_order", side: "buy", orderType: "market", qty: 10, stopLoss: 9800 }).state;
    const r = advance(ctx, s, 1);
    s = r.state;
    expect(s.position).toBeNull();
    expect(r.events.find((e) => e.type === "order_filled")).toMatchObject({ price: 9800, reason: "stop" });
    expect(s.trades[0].exitReason).toBe("stop");
  });

  it("fills a gapped stop at the open, which is worse than the stop", () => {
    const ctx = createContext(cfg(), [c(10000, 10010, 9990, 10000), c(9500, 9600, 9400, 9550)]);
    let s = mustApply(ctx, initState(ctx, 0), { type: "submit_order", side: "buy", orderType: "market", qty: 10, stopLoss: 9800 }).state;
    const r = advance(ctx, s, 1);
    s = r.state;
    expect(r.events.find((e) => e.type === "order_filled" && e.reason === "stop")).toMatchObject({ price: 9495 });
  });

  it("uses the intrabar path when stop and target are both inside one candle", () => {
    const base = [c(10000, 10010, 9990, 10000)];
    for (const [path, expected] of [["OHLC", "target"], ["OLHC", "stop"]] as const) {
      const ctx = createContext(cfg(), [...base, c(10000, 10400, 9600, 10000, path)]);
      const s = mustApply(ctx, initState(ctx, 0), {
        type: "submit_order", side: "buy", orderType: "market", qty: 10, stopLoss: 9800, takeProfit: 10200,
      }).state;
      const after = advance(ctx, s, 1).state;
      expect(after.trades[0].exitReason).toBe(expected);
    }
  });

  it("assumes the adverse extreme first when the intrabar path is unknown", () => {
    const ctx = createContext(cfg(), [c(10000, 10010, 9990, 10000), { o: 10000, h: 10400, l: 9600, c: 10000, v: 1 }]);
    const s = mustApply(ctx, initState(ctx, 0), {
      type: "submit_order", side: "buy", orderType: "market", qty: 10, stopLoss: 9800, takeProfit: 10200,
    }).state;
    expect(advance(ctx, s, 1).state.trades[0].exitReason).toBe("stop");
  });

  it("fills a buy limit at the limit price and then honours its attached stop in the same candle", () => {
    const ctx = createContext(cfg(), [c(10000, 10010, 9990, 10000), c(10000, 10050, 9500, 9600, "OHLC")]);
    let s = mustApply(ctx, initState(ctx, 0), {
      type: "submit_order", side: "buy", orderType: "limit", qty: 10, limitPrice: 9900, stopLoss: 9700,
    }).state;
    expect(s.orders).toHaveLength(1);
    const r = advance(ctx, s, 1);
    s = r.state;
    const fills = r.events.filter((e) => e.type === "order_filled");
    expect(fills.map((f) => f.type === "order_filled" && [f.reason, f.price])).toEqual([
      ["limit", 9900],
      ["stop", 9700],
    ]);
    expect(s.position).toBeNull();
  });

  it("never fills a limit order on the candle it was placed on", () => {
    const ctx = createContext(cfg(), [c(10000, 10010, 9000, 10000), c(10000, 10010, 9990, 10000)]);
    const s = mustApply(ctx, initState(ctx, 0), { type: "submit_order", side: "buy", orderType: "limit", qty: 10, limitPrice: 9500 }).state;
    expect(s.position).toBeNull();
    expect(advance(ctx, s, 1).state.position).toBeNull();
  });
});

describe("position accounting", () => {
  it("realizes P&L proportionally on a partial close", () => {
    const ctx = createContext(cfg({ allowShort: true }), [c(10000, 10010, 9990, 10000), c(10000, 10210, 9990, 10200)]);
    let s = mustApply(ctx, initState(ctx, 0), { type: "submit_order", side: "buy", orderType: "market", qty: 10 }).state;
    s = advance(ctx, s, 1).state;
    s = mustApply(ctx, s, { type: "close_position", qty: 4 }).state;
    // Bought at 100.05, sold 4 at 101.95: 4 × 190 = 760 cents.
    expect(s.realized).toBe(760);
    expect(s.position?.qty).toBe(6);
  });

  it("closes open positions and cancels orders when the session finishes", () => {
    const ctx = createContext(cfg(), [c(10000, 10010, 9990, 10000)]);
    let s = mustApply(ctx, initState(ctx, 0), { type: "submit_order", side: "buy", orderType: "market", qty: 10 }).state;
    s = finish(ctx, s).state;
    expect(s.ended).toBe(true);
    expect(s.position).toBeNull();
    expect(s.trades[0].exitReason).toBe("session_end");
    expect(apply(ctx, s, { type: "submit_order", side: "buy", orderType: "market", qty: 1 }).rejected?.code).toBe("SESSION_NOT_ACTIVE");
  });
});

describe("sizing", () => {
  it("matches the worked example from the plan: 46 units, not the textbook 50", () => {
    const r = maxQtyForRisk({ equity: 1_000_000, riskPct: 1, side: "long", entry: 10005, stop: 9800, commissionBps: 5 });
    expect(r.qty).toBe(46);
    expect(r.risk).toBe(9887);
    expect(r.simpleQty).toBe(48);
    expect(maxQtyForRisk({ equity: 1_000_000, riskPct: 1, side: "long", entry: 10000, stop: 9800, commissionBps: 0 }).qty).toBe(50);
  });
});

// ─── Property tests (seeded, deterministic) ───────────────────────────────

function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomCandles(rand: () => number, n: number): Candle[] {
  const out: Candle[] = [];
  let price = 10000;
  for (let i = 0; i < n; i++) {
    const o = Math.max(100, price + Math.round((rand() - 0.5) * 60));
    const cl = Math.max(100, o + Math.round((rand() - 0.5) * 300));
    const h = Math.max(o, cl) + Math.round(rand() * 120);
    const l = Math.max(50, Math.min(o, cl) - Math.round(rand() * 120));
    out.push({ o, h, l, c: cl, v: 1000, path: rand() < 0.5 ? "OHLC" : "OLHC" });
    price = cl;
  }
  return out;
}

function randomLog(rand: () => number, candles: Candle[], start: number): LogEntry[] {
  const log: LogEntry[] = [];
  let step = start;
  while (step < candles.length - 1) {
    step = Math.min(candles.length - 1, step + 1 + Math.floor(rand() * 6));
    const price = candles[step].c;
    const roll = rand();
    const side = rand() < 0.7 ? "buy" : "sell";
    const sign = side === "buy" ? 1 : -1;
    if (roll < 0.45) {
      log.push({
        kind: "action",
        step,
        action: {
          type: "submit_order",
          side,
          orderType: rand() < 0.6 ? "market" : "limit",
          qty: 1 + Math.floor(rand() * 40),
          limitPrice: price - sign * Math.round(rand() * 150),
          stopLoss: rand() < 0.8 ? price - sign * (50 + Math.round(rand() * 300)) : null,
          takeProfit: rand() < 0.6 ? price + sign * (50 + Math.round(rand() * 400)) : null,
        },
      });
    } else if (roll < 0.6) {
      log.push({ kind: "action", step, action: { type: "close_position", qty: rand() < 0.5 ? undefined : 1 + Math.floor(rand() * 5) } });
    } else if (roll < 0.75) {
      log.push({ kind: "action", step, action: { type: "modify_brackets", stopLoss: price - sign * (40 + Math.round(rand() * 200)) } });
    } else {
      log.push({ kind: "advance", to: step });
    }
  }
  log.push({ kind: "finish" });
  return log;
}

describe("engine properties", () => {
  const cases = Array.from({ length: 150 }, (_, i) => i + 1);

  it("is deterministic: replaying the same log twice gives the same state hash", () => {
    for (const seed of cases) {
      const rand = prng(seed);
      const candles = randomCandles(rand, 60);
      const log = randomLog(rand, candles, 5);
      const ctx = createContext(cfg(), candles);
      expect(hashValue(replay(ctx, 5, log).state)).toBe(hashValue(replay(ctx, 5, log).state));
    }
  });

  it("never looks ahead: changing future candles does not change any earlier state", () => {
    for (const seed of cases) {
      const rand = prng(seed);
      const candles = randomCandles(rand, 60);
      const log = randomLog(rand, candles, 5).filter((e) => e.kind !== "finish");
      const cut = 20 + Math.floor(rand() * 30);
      const before = log.filter((e) => (e.kind === "action" ? e.step : e.kind === "advance" ? e.to : Infinity) <= cut);
      const altered = candles.map((cd, i) => (i > cut ? { ...cd, o: cd.o + 777, h: cd.h + 900, l: Math.max(1, cd.l - 900), c: cd.c - 333 } : cd));
      const a = replay(createContext(cfg(), candles), 5, [...before, { kind: "advance", to: cut }]).state;
      const b = replay(createContext(cfg(), altered), 5, [...before, { kind: "advance", to: cut }]).state;
      expect(hashValue(b)).toBe(hashValue(a));
    }
  });

  it("keeps the accounting identity exact", () => {
    for (const seed of cases) {
      const rand = prng(seed);
      const candles = randomCandles(rand, 60);
      const ctx = createContext(cfg(), candles);
      const { state, events } = replay(ctx, 5, randomLog(rand, candles, 5));
      const fees = events.reduce((sum, e) => sum + (e.type === "order_filled" ? e.fee : 0), 0);
      const realized = state.trades.reduce((sum, t) => sum + t.realized, 0);
      expect(state.fees).toBe(fees);
      expect(state.realized).toBe(realized);
      expect(state.position).toBeNull();
      expect(equityOf(ctx, state)).toBe(ctx.cfg.initialEquity + realized - fees);
      for (const t of state.trades) expect(t.exitQty).toBe(t.entryQty);
    }
  });

  it("never fills a stop at a better price than the stop", () => {
    let checked = 0;
    for (const seed of cases) {
      const rand = prng(seed);
      const candles = randomCandles(rand, 60);
      const ctx = createContext(cfg(), candles);
      const { events } = replay(ctx, 5, randomLog(rand, candles, 5));
      const submittedStops = new Map<string, number | null>();
      let stop: number | null = null;
      for (const e of events) {
        if (e.type === "order_submitted") submittedStops.set(e.orderId, e.stopLoss);
        if (e.type === "order_filled" && (e.reason === "market" || e.reason === "limit")) stop = submittedStops.get(e.orderId) ?? null;
        if (e.type === "brackets_modified") stop = e.stopLoss;
        if (e.type === "order_filled" && e.reason === "stop") {
          expect(stop).not.toBeNull();
          // A long stop sells at or below its level; a short stop buys back at or above it.
          if (e.side === "sell") expect(e.price).toBeLessThanOrEqual(stop!);
          else expect(e.price).toBeGreaterThanOrEqual(stop!);
          checked++;
        }
      }
    }
    expect(checked).toBeGreaterThan(20);
  });

  it("leaves the state untouched when an action is rejected", () => {
    for (const seed of cases) {
      const rand = prng(seed);
      const candles = randomCandles(rand, 40);
      const ctx = createContext(cfg({ allowShort: false }), candles);
      const s = advance(ctx, initState(ctx, 3), 10).state;
      const r = apply(ctx, s, { type: "submit_order", side: "sell", orderType: "market", qty: 1 + Math.floor(rand() * 10) });
      expect(r.rejected).toBeDefined();
      expect(r.state).toBe(s);
    }
  });
});
