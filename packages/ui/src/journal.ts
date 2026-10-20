import { advance, apply, finish, initState, previewOrder, type Action, type EngineEvent, type LogEntry, type OrderPreview, type SimContext } from "@market-lab/engine";
import { ARENA_START } from "@market-lab/missions";

/** One order decision in an Arena session, with what was planned and what the engine did with it. */
export interface ArenaDecision {
  /** Index of the action in the session log; decision notes are keyed by it. */
  index: number;
  step: number;
  action: Extract<Action, { type: "submit_order" }>;
  preview: OrderPreview;
  rejected: string | null;
  fill: { price: number; step: number } | null;
  exit: { price: number; step: number; reason: string } | null;
  status: "filled" | "pending" | "cancelled" | "rejected";
}

/**
 * Replays an Arena log and returns every order decision: the plan at the moment it was placed
 * (risk, stop, target, from the preview) and the simulated execution that followed.
 */
export function arenaDecisions(ctx: SimContext, log: readonly LogEntry[]): ArenaDecision[] {
  let state = initState(ctx, ARENA_START);
  const out: ArenaDecision[] = [];
  const byOrder = new Map<string, ArenaDecision>();
  let open: ArenaDecision | null = null;

  const track = (events: EngineEvent[]) => {
    for (const e of events) {
      if (e.type === "order_filled") {
        const d = byOrder.get(e.orderId);
        if (d && (e.reason === "market" || e.reason === "limit")) {
          d.fill = { price: e.price, step: e.step };
          d.status = "filled";
          open = d;
        } else if (open && (e.reason === "stop" || e.reason === "target" || e.reason === "manual" || e.reason === "session_end") && !open.exit) {
          open.exit = { price: e.price, step: e.step, reason: e.reason };
        }
      }
      if (e.type === "order_cancelled") {
        const d = byOrder.get(e.orderId);
        if (d && d.status === "pending") d.status = "cancelled";
      }
      if (e.type === "position_closed") open = null;
    }
  };

  log.forEach((entry, index) => {
    if (entry.kind === "advance") {
      const r = advance(ctx, state, entry.to);
      state = r.state;
      track(r.events);
      return;
    }
    if (entry.kind === "finish") {
      const r = finish(ctx, state);
      state = r.state;
      track(r.events);
      return;
    }
    if (entry.step > state.step) {
      const r = advance(ctx, state, entry.step);
      state = r.state;
      track(r.events);
    }
    const a = entry.action;
    if (a.type === "submit_order") {
      const preview = previewOrder(ctx, state, a);
      const r = apply(ctx, state, a);
      const d: ArenaDecision = { index, step: state.step, action: a, preview, rejected: r.rejected?.message ?? null, fill: null, exit: null, status: r.rejected ? "rejected" : "pending" };
      out.push(d);
      if (!r.rejected) {
        const sub = r.events.find((e) => e.type === "order_submitted");
        if (sub && sub.type === "order_submitted") byOrder.set(sub.orderId, d);
        state = r.state;
        track(r.events);
      }
      return;
    }
    const r = apply(ctx, state, a);
    if (!r.rejected) {
      state = r.state;
      track(r.events);
    }
  });
  return out;
}
