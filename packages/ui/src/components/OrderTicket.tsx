import { useId } from "react";
import {
  bidAsk,
  maxQtyForRisk,
  parsePrice,
  parseQuantity,
  previewOrder,
  type OrderPreview,
  type OrderType,
  type Side,
  type SimContext,
  type SimState,
} from "@market-lab/engine";
import { formatPct, formatPrice, money } from "../format";
import { InlineError, KeyValues, Segmented, TextField, cx } from "./ui";

export interface TicketValue {
  side: Side;
  orderType: OrderType;
  qty: string;
  limitPrice: string;
  stopLoss: string;
  takeProfit: string;
  riskPct: string;
}

export interface ParsedOrder {
  side: Side;
  orderType: OrderType;
  qty: number;
  limitPrice?: number;
  stopLoss: number | null;
  takeProfit: number | null;
}

const centsText = (c?: number) => (c === undefined ? "" : (c / 100).toFixed(2));

export function initialTicket(side: Side, defaults?: { stopLoss?: number; takeProfit?: number; qty?: number; riskPct?: number }): TicketValue {
  return {
    side,
    orderType: "market",
    qty: defaults?.qty ? String(defaults.qty) : "",
    limitPrice: "",
    stopLoss: centsText(defaults?.stopLoss),
    takeProfit: centsText(defaults?.takeProfit),
    riskPct: String(defaults?.riskPct ?? 1),
  };
}

export function parseTicket(v: TicketValue): { order: ParsedOrder | null; problem: string | null } {
  const qty = parseQuantity(v.qty);
  if (qty === null) return { order: null, problem: "Enter a quantity in whole units." };
  let limitPrice: number | undefined;
  if (v.orderType === "limit") {
    const lp = parsePrice(v.limitPrice);
    if (lp === null) return { order: null, problem: "Enter a limit price." };
    limitPrice = lp;
  }
  const stopLoss = v.stopLoss.trim() === "" ? null : parsePrice(v.stopLoss);
  if (v.stopLoss.trim() !== "" && stopLoss === null) return { order: null, problem: "The stop-loss isn't a valid price." };
  const takeProfit = v.takeProfit.trim() === "" ? null : parsePrice(v.takeProfit);
  if (v.takeProfit.trim() !== "" && takeProfit === null) return { order: null, problem: "The take-profit isn't a valid price." };
  return { order: { side: v.side, orderType: v.orderType, qty, limitPrice, stopLoss, takeProfit }, problem: null };
}

export function ticketPreview(ctx: SimContext, state: SimState, v: TicketValue): { order: ParsedOrder | null; preview: OrderPreview | null; problem: string | null } {
  const { order, problem } = parseTicket(v);
  if (!order) return { order: null, preview: null, problem };
  const preview = previewOrder(ctx, state, { type: "submit_order", ...order });
  return { order, preview, problem: preview.ok ? null : preview.rejection!.message };
}

export function OrderTicket({
  ctx,
  state,
  value,
  onChange,
  sides,
  orderTypes,
  lockStop,
  riskLimitPct,
}: {
  ctx: SimContext;
  state: SimState;
  value: TicketValue;
  onChange: (v: TicketValue) => void;
  sides: Side[];
  orderTypes: OrderType[];
  lockStop?: boolean;
  riskLimitPct?: number;
}) {
  const id = useId();
  const { bid, ask } = bidAsk(ctx, state);
  const { preview, problem, order } = ticketPreview(ctx, state, value);
  const set = (patch: Partial<TicketValue>) => onChange({ ...value, ...patch });
  const marketRef = value.side === "buy" ? ask : bid;
  const entryRef = value.orderType === "limit" ? (parsePrice(value.limitPrice) ?? marketRef) : marketRef;
  const stop = parsePrice(value.stopLoss);
  const riskPct = Number(value.riskPct);
  const equity = preview?.equity ?? ctx.cfg.initialEquity;
  const sizing =
    stop !== null && Number.isFinite(riskPct) && riskPct > 0
      ? maxQtyForRisk({
          equity,
          riskPct,
          side: value.side === "buy" ? "long" : "short",
          entry: entryRef,
          stop,
          commissionBps: ctx.cfg.costs.commissionBps,
          maxNotional: preview?.buyingPower ?? equity,
        })
      : null;
  const stopDistPct = stop !== null ? (Math.abs(entryRef - stop) / entryRef) * 100 : null;
  const overLimit = riskLimitPct !== undefined && preview?.riskPct != null && preview.riskPct > riskLimitPct + 1e-9;

  const sizingHint = !sizing
    ? "Set a stop-loss to size the position from your risk budget."
    : sizing.qty <= 0
      ? "This stop is on the wrong side of the entry."
      : `Up to ${sizing.qty} units fit ${riskPct}% risk${sizing.simpleQty !== sizing.qty ? `, after spread and fees (textbook: ${sizing.simpleQty})` : ""}${sizing.cappedByBuyingPower ? ", capped by buying power" : ""}.`;

  return (
    <div className="ml-ticket">
      <div className="ml-ticket-quote num" aria-label={`Bid ${formatPrice(bid)}, ask ${formatPrice(ask)}`}>
        <span>
          <i>Bid</i> {formatPrice(bid)}
        </span>
        <span>
          <i>Ask</i> {formatPrice(ask)}
        </span>
        <span>
          <i>Spread</i> {formatPrice(ask - bid)}
        </span>
      </div>

      <div className="ml-ticket-row">
        {sides.length > 1 ? (
          <Segmented
            label="Direction"
            value={value.side}
            onChange={(side) => set({ side })}
            options={[
              { value: "buy", label: "Buy" },
              { value: "sell", label: "Sell short" },
            ]}
          />
        ) : (
          <span className="ml-side">{value.side === "buy" ? "Buy · long" : "Sell · short"}</span>
        )}
        {orderTypes.length > 1 && (
          <Segmented
            label="Order type"
            size="sm"
            value={value.orderType}
            onChange={(orderType) => set({ orderType })}
            options={[
              { value: "market", label: "Market" },
              { value: "limit", label: "Limit" },
            ]}
          />
        )}
      </div>

      {value.orderType === "limit" && (
        <TextField
          label="Limit price"
          inputMode="decimal"
          autoComplete="off"
          value={value.limitPrice}
          onChange={(e) => set({ limitPrice: e.target.value })}
          placeholder={formatPrice(value.side === "buy" ? bid : ask)}
          hint="Fills only at this price or better."
        />
      )}

      <div className="ml-grid-2">
        <TextField
          label={lockStop ? "Stop-loss · from your plan" : "Stop-loss"}
          inputMode="decimal"
          autoComplete="off"
          value={value.stopLoss}
          readOnly={lockStop}
          onChange={(e) => set({ stopLoss: e.target.value })}
          placeholder="Where you're wrong"
          hint={stopDistPct !== null ? `${stopDistPct.toFixed(2)}% from entry` : "Defines your risk"}
        />
        <TextField
          label="Take-profit"
          inputMode="decimal"
          autoComplete="off"
          value={value.takeProfit}
          onChange={(e) => set({ takeProfit: e.target.value })}
          placeholder="Optional"
          hint="Optional"
        />
      </div>

      <div className="ml-sizing">
        <TextField
          label="Quantity"
          inputMode="numeric"
          autoComplete="off"
          value={value.qty}
          onChange={(e) => set({ qty: e.target.value })}
          placeholder="Units"
          hint={sizingHint}
          trailing={
            <button type="button" className="ml-field-action" disabled={!sizing || sizing.qty <= 0} onClick={() => sizing && set({ qty: String(sizing.qty) })}>
              Fit to {Number.isFinite(riskPct) && riskPct > 0 ? `${riskPct}%` : "risk"}
            </button>
          }
        />
        <label className="ml-budget" htmlFor={`${id}-risk`}>
          Risk budget
          <input id={`${id}-risk`} inputMode="decimal" value={value.riskPct} onChange={(e) => set({ riskPct: e.target.value })} />% of equity
        </label>
      </div>

      <KeyValues
        className="ml-ticket-preview"
        items={[
          { label: "Entry ≈", value: formatPrice(preview?.entryPrice ?? entryRef) },
          { label: "Position value", value: preview ? money(preview.notional) : "—" },
          { label: "Fees, in and out", value: preview ? money(preview.entryFee + preview.exitFeeAtStop) : "—" },
          {
            label: overLimit ? `Loss if stopped · over the ${riskLimitPct}% limit` : "Loss if stopped",
            value: preview?.risk != null ? `${money(preview.risk)} · ${formatPct(preview.riskPct!)}` : order && order.stopLoss === null ? "Unlimited, no stop" : "—",
            emphasis: true,
            alert: overLimit || (order !== null && order.stopLoss === null),
          },
          { label: "Gain at target", value: preview?.reward != null ? money(preview.reward) : "—" },
          { label: "Reward to risk", value: preview?.rewardRisk != null ? `${preview.rewardRisk.toFixed(2)} : 1` : "—" },
        ]}
      />
      {problem && value.qty !== "" && <InlineError>{problem}</InlineError>}
      <p className={cx("ml-fine")}>Simulated order with virtual money.</p>
    </div>
  );
}
