import { parsePrice, type EngineEvent, type SimState } from "@market-lab/engine";
import type { ChartHighlight, Frame } from "@market-lab/missions";
import type { ChartLine, ChartMarker, LineKind } from "./Chart";
import type { TicketValue } from "./OrderTicket";

export function markersFrom(events: readonly EngineEvent[], upTo: number): ChartMarker[] {
  const out: ChartMarker[] = [];
  for (const e of events) {
    if (e.type !== "order_filled" || e.step > upTo) continue;
    if (e.reason === "market" || e.reason === "limit") out.push({ step: e.step, price: e.price, kind: e.side === "buy" ? "buy" : "sell" });
    else out.push({ step: e.step, price: e.price, kind: e.reason === "stop" ? "exit-stop" : e.reason === "target" ? "exit-target" : "exit" });
  }
  return out;
}

type PositionLike = { side: "long" | "short"; qty: number; avgEntry: number; stopLoss: number | null; takeProfit: number | null } | null;

export function linesFrom(position: PositionLike, orders: { side: "buy" | "sell"; qty: number; limitPrice: number }[]): ChartLine[] {
  const out: ChartLine[] = [];
  if (position) {
    out.push({ price: position.avgEntry, label: `${position.side === "long" ? "Long" : "Short"} ${position.qty}`, kind: "entry" });
    if (position.stopLoss !== null) out.push({ price: position.stopLoss, label: "Stop", kind: "stop" });
    if (position.takeProfit !== null) out.push({ price: position.takeProfit, label: "Target", kind: "target" });
  }
  for (const o of orders) out.push({ price: o.limitPrice, label: `${o.side === "buy" ? "Buy" : "Sell"} limit · ${o.qty}`, kind: "limit" });
  return out;
}

export function linesFromFrame(frame: Frame | undefined): ChartLine[] {
  return frame ? linesFrom(frame.position, frame.orders) : [];
}

export function linesFromState(state: SimState): ChartLine[] {
  const p = state.position;
  return linesFrom(p ? { side: p.side, qty: p.qty, avgEntry: Math.round(p.costBasis / p.qty), stopLoss: p.stopLoss, takeProfit: p.takeProfit } : null, state.orders);
}

const TONE_KIND: Record<string, LineKind> = { neutral: "level", warn: "level-strong", good: "target", bad: "stop" };

export function linesFromHighlight(h: ChartHighlight | undefined): ChartLine[] {
  return (h?.levels ?? []).map((l) => ({ price: l.price, label: l.label, kind: TONE_KIND[l.tone] ?? "level" }));
}

/** Lines the user is drafting in the order ticket, shown on the chart before the order exists. */
export function draftLines(t: TicketValue | null): ChartLine[] {
  if (!t) return [];
  const out: ChartLine[] = [];
  const sl = parsePrice(t.stopLoss);
  const tp = parsePrice(t.takeProfit);
  const lp = t.orderType === "limit" ? parsePrice(t.limitPrice) : null;
  if (lp !== null) out.push({ price: lp, label: "Limit · draft", kind: "limit", draft: true });
  if (sl !== null) out.push({ price: sl, label: "Stop · draft", kind: "stop", draft: true });
  if (tp !== null) out.push({ price: tp, label: "Target · draft", kind: "target", draft: true });
  return out;
}
