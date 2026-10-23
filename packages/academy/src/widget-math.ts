/**
 * What each interactive widget computes from its controls (WIDGET_CONTRACTS). Pure, so the UI shows
 * exactly the numbers that task conditions are checked against, and tests can check content.
 * Money and prices go through integer cents with the simulator's own rules (packages/engine).
 */
import { commission, riskAmount } from "@market-lab/engine";
import { auctionAt, auctionBest, bestAsk, bestBid, bookAfter, fillBuy } from "./auction";
import { parseSwitches, raceResult, raceSeries, versusGhost } from "./benchmark";
import type { CandleData, TaskData } from "./types";

export type WidgetState = Record<string, number | string | boolean>;

const cents = (v: number) => Math.round(v * 100);
const fromCents = (c: number) => c / 100;
const num = (s: WidgetState, k: string, d = 0) => (typeof s[k] === "number" ? (s[k] as number) : Number(s[k] ?? d) || d);
const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

/** Half the LABX spread: the ask is mid + 0.05 and the bid mid − 0.05. */
export const HALF_SPREAD = 0.05;

/** Default controls of each widget, used when a task doesn't set them. */
export const WIDGET_DEFAULTS: Record<string, WidgetState> = {
  "candle-builder": { open: 100, high: 101.5, low: 99.2, close: 101 },
  "spread-cost": { units: 50, mid: 100, spread: 0.1, commissionPct: 0.05, answer: "" },
  "order-fill": { side: "buy", type: "market", limit: 100 },
  "bracket-builder": { stop: 99.5, target: 101, units: 25 },
  "trend-classifier": { labelA: "", evidenceA: "", labelB: "", evidenceB: "", labelC: "", evidenceC: "" },
  "level-drawer": { role: "resistance", bandLow: 100, bandHigh: 100.5, stop: 0 },
  "ma-period": { period: 20, market: "trend" },
  "loss-recovery": { drawdown: 20 },
  "position-size": { account: 10000, riskPct: 1, entry: 100, stop: 98 },
  "risk-reward": { entry: 100, stop: 98, target: 104 },
  expectancy: { winRate: 45, avgWin: 2, avgLoss: 1, runLength: 5 },
  exposure: { account: 10000, leverage: 1, position: 10000, move: 5 },
  "bias-spotter": {},
  "auction-book": { price: 0, bidPick: 0, askPick: 0, sent: false },
  "benchmark-ghost": { trips: 0, log: "", done: false },
};

// ─── Order fills (the engine's rules for a long or short entry) ───────────

export interface FillResult {
  filled: boolean;
  /** Candle index of the fill (−1 if not filled). */
  at: number;
  price: number;
  /** Ask (buy) or bid (sell) when the order was placed. */
  quote: number;
  /** Lowest ask (buy) or highest bid (sell) reached over the future candles. */
  extreme: number;
}

/**
 * Plays an entry order over the future candles (from index `from`). Market orders fill at once at
 * the ask (buy) or bid (sell) of the last known close. A buy limit fills when the ask reaches it, at
 * the limit, or at the open's ask if the market opened through it; at or above the ask it fills at once.
 */
export function simulateEntry(candles: CandleData[], from: number, side: "buy" | "sell", type: "market" | "limit", limit: number): FillResult {
  const last = candles[from - 1] ?? candles[0];
  const h = HALF_SPREAD;
  const quote = round(side === "buy" ? last.c + h : last.c - h, 2);
  const future = candles.slice(from);
  const extreme = round(side === "buy" ? Math.min(...future.map((c) => c.l)) + h : Math.max(...future.map((c) => c.h)) - h, 2);
  if (type === "market") return { filled: true, at: from - 1, price: quote, quote, extreme };
  if (side === "buy" ? limit >= quote - 1e-9 : limit <= quote + 1e-9) return { filled: true, at: from - 1, price: quote, quote, extreme };
  for (let i = 0; i < future.length; i++) {
    const c = future[i];
    if (side === "buy") {
      if (c.o + h <= limit + 1e-9) return { filled: true, at: from + i, price: round(c.o + h, 2), quote, extreme };
      if (c.l + h <= limit + 1e-9) return { filled: true, at: from + i, price: limit, quote, extreme };
    } else {
      if (c.o - h >= limit - 1e-9) return { filled: true, at: from + i, price: round(c.o - h, 2), quote, extreme };
      if (c.h - h >= limit - 1e-9) return { filled: true, at: from + i, price: limit, quote, extreme };
    }
  }
  return { filled: false, at: -1, price: 0, quote, extreme };
}

// ─── Swing points and moving averages ──────────────────────────────────────

/** Indices of swing highs or lows: a high (low) above (below) the `k` candles on each side. */
export function swingPoints(candles: CandleData[], kind: "high" | "low", k = 2): number[] {
  const out: number[] = [];
  for (let i = k; i < candles.length - k; i++) {
    const v = kind === "high" ? candles[i].h : candles[i].l;
    let ok = true;
    for (let j = i - k; j <= i + k && ok; j++) {
      if (j === i) continue;
      const w = kind === "high" ? candles[j].h : candles[j].l;
      if (kind === "high" ? w > v : w < v) ok = false;
    }
    if (ok) out.push(i);
  }
  return out;
}

export function smaValues(candles: CandleData[], period: number): (number | null)[] {
  let sum = 0;
  return candles.map((c, i) => {
    sum += c.c;
    if (i >= period) sum -= candles[i - period].c;
    return i >= period - 1 ? sum / period : null;
  });
}

/** Closes crossing the average, and crossings reversed within `within` candles (false signals). */
export function maCrossings(candles: CandleData[], period: number, within = 5): { crossings: number[]; falseSignals: number } {
  const ma = smaValues(candles, period);
  const sides: (1 | -1 | 0)[] = candles.map((c, i) => (ma[i] === null ? 0 : c.c > (ma[i] as number) ? 1 : c.c < (ma[i] as number) ? -1 : 0));
  const crossings: number[] = [];
  let prev: 1 | -1 | 0 = 0;
  sides.forEach((s, i) => {
    if (s === 0) return;
    if (prev !== 0 && s !== prev) crossings.push(i);
    prev = s;
  });
  let falseSignals = 0;
  for (let i = 0; i < crossings.length; i++) if (crossings[i + 1] !== undefined && crossings[i + 1] - crossings[i] <= within) falseSignals++;
  return { crossings, falseSignals };
}

/**
 * A moving average on a series whose first `warmup` candles only feed the average: crossings
 * (closes switching side of the average), false signals (a crossing reversed within 5 candles) and,
 * for a trend, the lag from the highest close to the highest point of the average. Indices are absolute.
 */
export function maStats(series: CandleData[], period: number, warmup = 0, within = 5): { ma: (number | null)[]; crossings: number[]; falseSignals: number; lag: number } {
  const ma = smaValues(series, period);
  const crossings: number[] = [];
  let prev = 0;
  for (let i = warmup; i < series.length; i++) {
    const m = ma[i];
    if (m === null) continue;
    const side = series[i].c > m + 1e-9 ? 1 : series[i].c < m - 1e-9 ? -1 : 0;
    if (side === 0) continue;
    if (prev !== 0 && side !== prev) crossings.push(i);
    prev = side;
  }
  let falseSignals = 0;
  for (let i = 0; i + 1 < crossings.length; i++) if (crossings[i + 1] - crossings[i] <= within) falseSignals++;
  let peak = warmup;
  let maPeak = -1;
  for (let i = warmup; i < series.length; i++) {
    if (series[i].c > series[peak].c) peak = i;
    const m = ma[i];
    if (m !== null && (maPeak < 0 || m > (ma[maPeak] as number))) maPeak = i;
  }
  return { ma, crossings, falseSignals, lag: Math.max(0, maPeak - peak) };
}

/** Probability (0–1) of at least one run of `k` losses in `n` trades with win probability `p`. */
export function losingRunProbability(p: number, k: number, n = 100): number {
  const q = 1 - p;
  // state[j] = probability of a current losing run of length j with no run of k yet.
  let state: number[] = Array.from({ length: k }, (_, j) => (j === 0 ? 1 : 0));
  let hit = 0;
  for (let t = 0; t < n; t++) {
    const next = Array.from({ length: k }, () => 0);
    for (let j = 0; j < k; j++) {
      next[0] += state[j] * p;
      if (j + 1 === k) hit += state[j] * q;
      else next[j + 1] += state[j] * q;
    }
    state = next;
  }
  return hit;
}

// ─── The widgets ───────────────────────────────────────────────────────────

/** The widget's outputs for a state of its controls (see WIDGET_CONTRACTS for the meaning of each). */
export function computeWidget(widget: string, s: WidgetState, data: TaskData = {}): WidgetState {
  switch (widget) {
    case "candle-builder": {
      const o = num(s, "open");
      const c = num(s, "close");
      const h = Math.max(num(s, "high"), o, c);
      const l = Math.min(num(s, "low"), o, c);
      const [oc, cc, hc, lc] = [o, c, h, l].map(cents);
      const body = Math.abs(cc - oc);
      const upper = hc - Math.max(oc, cc);
      const lower = Math.min(oc, cc) - lc;
      return {
        high: h,
        low: l,
        direction: cc >= oc ? "bullish" : "bearish",
        body: fromCents(body),
        upperWick: fromCents(upper),
        lowerWick: fromCents(lower),
        range: fromCents(hc - lc),
        lowerOverBody: body === 0 ? 99 : lower / body,
        upperOverBody: body === 0 ? 99 : upper / body,
        lowerMinusUpper: fromCents(lower - upper),
      };
    }
    case "spread-cost": {
      const units = Math.round(num(s, "units"));
      const mid = cents(num(s, "mid"));
      const half = Math.round(cents(num(s, "spread")) / 2);
      const bps = Math.round(num(s, "commissionPct") * 100);
      const ask = mid + half;
      const bid = mid - half;
      const feeIn = commission(units * ask, bps);
      const feeOut = commission(units * bid, bps);
      const spreadCost = units * (ask - bid);
      const total = spreadCost + feeIn + feeOut;
      return {
        ask: fromCents(ask),
        bid: fromCents(bid),
        spreadCost: fromCents(spreadCost),
        feeIn: fromCents(feeIn),
        feeOut: fromCents(feeOut),
        roundTrip: fromCents(total),
        breakEven: units > 0 ? fromCents(Math.ceil(total / units)) : 0,
      };
    }
    case "order-fill": {
      const chart = data.chart;
      if (!chart) return { placed: !!s.placed, filled: false, fillPrice: 0, ask: 0, lowestAsk: 0 };
      const from = chart.visible ?? chart.candles.length;
      const r = simulateEntry(chart.candles, from, s.side === "sell" ? "sell" : "buy", s.type === "limit" ? "limit" : "market", num(s, "limit"));
      return { placed: !!s.placed, filled: r.filled, fillPrice: r.price, fillAt: r.at, ask: r.quote, lowestAsk: r.extreme };
    }
    case "bracket-builder": {
      const entry = data.entry ?? 100;
      const units = Math.round(num(s, "units", data.units ?? 25));
      const [e, st, t] = [entry, num(s, "stop"), num(s, "target")].map(cents);
      const lossBefore = units * (e - st);
      const gainBefore = units * (t - e);
      const lossAfter = riskAmount("long", units, e, st, 5);
      const gainAfter = gainBefore - commission(units * e, 5) - commission(units * t, 5);
      return {
        entry,
        units,
        stopDistance: fromCents(e - st),
        targetDistance: fromCents(t - e),
        lossBefore: fromCents(lossBefore),
        gainBefore: fromCents(gainBefore),
        lossAfter: fromCents(lossAfter),
        gainAfter: fromCents(gainAfter),
        rr: e - st > 0 ? round((t - e) / (e - st), 2) : 0,
      };
    }
    case "trend-classifier": {
      const segs = data.segments ?? [];
      let correctCount = 0;
      segs.forEach((g, i) => {
        const k = "ABC"[i];
        if (s[`label${k}`] === g.label && s[`evidence${k}`] === g.evidence) correctCount++;
      });
      return { correctCount, total: segs.length };
    }
    case "level-drawer": {
      const lo = Math.min(num(s, "bandLow"), num(s, "bandHigh"));
      const hi = Math.max(num(s, "bandLow"), num(s, "bandHigh"));
      const candles = data.chart?.candles ?? [];
      const known = candles.slice(0, data.chart?.visible ?? candles.length);
      const resistance = s.role !== "support";
      const swings = swingPoints(known, resistance ? "high" : "low");
      const touches = swings.filter((i) => {
        const v = resistance ? known[i].h : known[i].l;
        return v >= lo - 1e-9 && v <= hi + 1e-9;
      }).length;
      // A test reaches into the band without closing beyond it; a break closes beyond it.
      let tests = 0;
      let breaks = 0;
      for (const c of known) {
        const into = resistance ? c.h >= lo - 1e-9 : c.l <= hi + 1e-9;
        const beyond = resistance ? c.c > hi + 1e-9 : c.c < lo - 1e-9;
        if (beyond) breaks++;
        else if (into) tests++;
      }
      return { height: fromCents(cents(hi) - cents(lo)), touches, tests, breaks, phase: num(s, "phase", 1) };
    }
    case "ma-period": {
      const market = String(s.market ?? "trend");
      const series = data.series?.[market] ?? [];
      if (!series.length) return { crossings: 0, falseSignals: 0, lag: 0 };
      const r = maStats(series, Math.round(num(s, "period", 20)), data.warmup ?? 0);
      return { crossings: r.crossings.length, falseSignals: r.falseSignals, lag: market === "trend" ? r.lag : 0 };
    }
    case "loss-recovery": {
      const dd = num(s, "drawdown");
      return { left: 100 - dd, gainNeeded: round((dd / (100 - dd)) * 100, 1), lossesInRow: Math.ceil(Math.log(1 - dd / 100) / Math.log(0.99) - 1e-9) };
    }
    case "position-size": {
      const account = cents(num(s, "account"));
      const riskPct = num(s, "riskPct");
      const e = cents(num(s, "entry"));
      const st = cents(num(s, "stop"));
      const budget = Math.floor((account * riskPct) / 100);
      const distance = e - st;
      if (distance <= 0) return { budget: fromCents(budget), distance: fromCents(distance), simpleQty: 0, qty: 0, lossAtStop: 0, withinBudget: false, positionValue: 0 };
      const simpleQty = Math.floor(budget / distance);
      let qty = Math.floor(budget / (distance + ((e + st) * 5) / 10000));
      while (qty > 0 && riskAmount("long", qty, e, st, 5) > budget) qty--;
      while (riskAmount("long", qty + 1, e, st, 5) <= budget) qty++;
      let cap = Math.floor(account / e);
      while (cap > 0 && cap * e + commission(cap * e, 5) > account) cap--;
      qty = Math.min(qty, cap);
      const learner = typeof s.units === "number" || (typeof s.units === "string" && s.units !== "");
      const units = learner ? Math.max(0, Math.floor(num(s, "units"))) : qty;
      const loss = units > 0 ? riskAmount("long", units, e, st, 5) : 0;
      return {
        budget: fromCents(budget),
        distance: fromCents(distance),
        simpleQty,
        qty,
        lossAtStop: fromCents(loss),
        withinBudget: loss <= budget,
        positionValue: fromCents(units * e),
      };
    }
    case "risk-reward": {
      const [e, st, t] = [num(s, "entry"), num(s, "stop"), num(s, "target")].map(cents);
      const risk = e - st;
      const reward = t - e;
      return {
        risk: fromCents(risk),
        reward: fromCents(reward),
        rr: risk > 0 ? round(reward / risk, 2) : 0,
        breakEven: risk + reward > 0 ? round((risk / (risk + reward)) * 100, 1) : 0,
      };
    }
    case "expectancy": {
      const win = Math.round(num(s, "winRate"));
      // Percent × tenths of R, so break-even shows 0.00 rather than −0.00.
      const e = (win * Math.round(num(s, "avgWin") * 10) - (100 - win) * Math.round(num(s, "avgLoss") * 10)) / 1000;
      return { expectancy: round(e, 2) || 0, runProb: round(losingRunProbability(win / 100, Math.round(num(s, "runLength", 5))) * 100, 1) };
    }
    case "exposure": {
      const account = num(s, "account");
      const position = num(s, "position");
      const move = num(s, "move");
      const loss = round((position * move) / 100, 2);
      return {
        exposurePct: account > 0 ? round((position / account) * 100, 1) : 0,
        leverageUsed: account > 0 ? round(position / account, 2) : 0,
        loss,
        lossPct: account > 0 ? round((loss / account) * 100, 1) : 0,
      };
    }
    case "bias-spotter":
      return { solved: num(s, "solved"), firstTry: num(s, "firstTry") };
    case "auction-book": {
      const a = data.auction;
      if (!a) return {};
      if (a.mode === "clear") {
        const price = round(num(s, "price"), 2);
        const at = auctionAt(a, price);
        const best = auctionBest(a, a.step).units;
        const short = at.buyers < at.sellers ? "buyers" : at.sellers < at.buyers ? "sellers" : "none";
        return { price, ...at, best, atBest: best > 0 && at.units === best, short };
      }
      if (a.mode === "spread") {
        const left = bookAfter(a, a.cleared ?? auctionBest(a, a.step).price);
        const bid = bestBid(left);
        const ask = bestAsk(left);
        const bidPick = round(num(s, "bidPick"), 2);
        const askPick = round(num(s, "askPick"), 2);
        return { bestBid: bid, bestAsk: ask, spread: round(ask - bid, 2), mid: round((ask + bid) / 2, 3), bidRight: bidPick === bid, askRight: askPick === ask, picked: bidPick > 0 && askPick > 0 };
      }
      const order = a.incoming ?? { units: 1, limit: bestAsk(a) };
      const sent = !!s.sent;
      const r = fillBuy(a, order.units, order.limit);
      const after = sent ? r.book : a;
      return { sent, filled: sent ? r.fills.length : 0, lastPrice: sent && r.fills.length ? r.fills[r.fills.length - 1] : 0, rest: sent ? r.rest : 0, bestBid: bestBid(after), bestAsk: bestAsk(after) };
    }
    case "benchmark-ghost": {
      const g = data.ghost;
      if (!g) return {};
      if (g.mode === "trips") {
        const trips = Math.round(num(s, "trips"));
        const gross = g.gross?.at(-1) ?? 0;
        const ghost = g.ghost?.at(-1) ?? 0;
        const costs = round(trips * g.cost, 2);
        const net = round(gross - costs, 2);
        const gap = round(net - ghost, 2);
        return { trips, gross, ghost, costs, net, gap, level: gap === 0, side: gap > 0 ? "above" : gap < 0 ? "below" : "level" };
      }
      const days = g.days ?? 252;
      const r = raceResult(raceSeries(g.seed ?? 1, days, g.end), parseSwitches(s.log, days), g.cost);
      return { done: !!s.done, ...r, net: round(r.net, 1), gross: round(r.gross, 1), ghost: round(r.ghost, 1), versus: versusGhost(r.net, r.ghost), tripsText: `${r.trips} round trip${r.trips === 1 ? "" : "s"}` };
    }
    default:
      return {};
  }
}

/** Controls and outputs together: what success conditions and feedback templates read. */
export function widgetValues(widget: string, s: WidgetState, data?: TaskData): WidgetState {
  return { ...s, ...computeWidget(widget, s, data) };
}
