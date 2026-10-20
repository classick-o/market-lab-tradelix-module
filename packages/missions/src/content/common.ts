import { formatPrice, maxQtyForRisk, type RiskRules } from "@market-lab/engine";
import type { Hypothesis } from "@market-lab/evaluation";
import type { CheckpointAnswer } from "../schema";

export const EQUITY = 1_000_000; // 10,000.00 vUSD

export const LONG_ONLY: RiskRules = {
  allowShort: false,
  orderTypes: ["market", "limit"],
  maxLeverage: 1,
  requireStop: false,
  maxRiskPct: 1,
};

export const p = formatPrice;

export interface AltCtx {
  equity: number;
  bid: number;
  ask: number;
  commissionBps: number;
}

/** A market buy sized to `riskPct` of equity with the given stop. */
export function sizedBuy(ctx: AltCtx, stop: number, riskPct = 1, takeProfit: number | null = null): NonNullable<CheckpointAnswer["order"]> {
  const qty = maxQtyForRisk({
    equity: ctx.equity,
    riskPct,
    side: "long",
    entry: ctx.ask,
    stop,
    commissionBps: ctx.commissionBps,
    maxNotional: Math.floor(ctx.equity * 0.995),
  }).qty;
  return { side: "buy", orderType: "market", qty: Math.max(1, qty), stopLoss: stop, takeProfit };
}

export function hyp(reasons: string[], confidence: Hypothesis["confidence"] = "medium"): Hypothesis {
  return { direction: "up", reasons, confidence };
}

export const num = (x: unknown) => Number(x);
