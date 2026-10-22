import { riskAmount } from "./engine";
import type { PositionSide } from "./types";
import { commission } from "./units";

export interface SizingInput {
  equity: number;
  riskPct: number;
  side: PositionSide;
  /** Expected execution price (ask for a buy, bid for a sell). */
  entry: number;
  stop: number;
  commissionBps: number;
  /** Optional cap on buying power. The entry commission must fit under it too, as the order check requires. */
  maxNotional?: number;
}

export interface SizingResult {
  /** Largest whole quantity whose risk, including spread and both commissions, fits the budget. */
  qty: number;
  /** Risk of `qty`, in cents. */
  risk: number;
  budget: number;
  /** Price distance between entry and stop, per unit. */
  perUnit: number;
  /** The textbook answer: budget / distance, ignoring costs. */
  simpleQty: number;
  cappedByBuyingPower: boolean;
}

export function maxQtyForRisk(i: SizingInput): SizingResult {
  const budget = Math.floor((i.equity * i.riskPct) / 100);
  const perUnit = i.side === "long" ? i.entry - i.stop : i.stop - i.entry;
  if (perUnit <= 0 || budget <= 0) {
    return { qty: 0, risk: 0, budget, perUnit, simpleQty: 0, cappedByBuyingPower: false };
  }
  const simpleQty = Math.floor(budget / perUnit);
  const riskOf = (q: number) => riskAmount(i.side, q, i.entry, i.stop, i.commissionBps);

  let qty = Math.floor(budget / (perUnit + ((i.entry + i.stop) * i.commissionBps) / 10000));
  while (qty > 0 && riskOf(qty) > budget) qty--;
  while (riskOf(qty + 1) <= budget) qty++;

  let cappedByBuyingPower = false;
  if (i.maxNotional !== undefined) {
    let cap = Math.floor(i.maxNotional / i.entry);
    // The order preview needs room for the entry commission as well (notional + fee ≤ buying power).
    while (cap > 0 && cap * i.entry + commission(cap * i.entry, i.commissionBps) > i.maxNotional) cap--;
    if (cap < qty) {
      qty = Math.max(0, cap);
      cappedByBuyingPower = true;
    }
  }
  return { qty, risk: qty > 0 ? riskOf(qty) : 0, budget, perUnit, simpleQty, cappedByBuyingPower };
}
