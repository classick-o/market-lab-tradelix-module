import { bidAsk, equityOf, formatPrice, maxQtyForRisk, previewOrder, unrealizedPnl, type Action, type SimContext, type SimState } from "@market-lab/engine";
import { formatPct, money } from "../format";
import { Pnl } from "./Page";
import { Button, Segmented } from "./ui";

/** The quick ticket's choices: size in % of buying power, stop and target as a distance from the entry in %. */
export interface QuickPrefs {
  size: number;
  stop: number;
  target: number;
}

export const QUICK_DEFAULTS: QuickPrefs = { size: 25, stop: 0, target: 0 };

const SIZES = ["10", "25", "50", "100"] as const;
const STOPS = ["0", "1", "2", "3"] as const;
const TARGETS = ["0", "2", "4", "6"] as const;

const options = <T extends string>(values: readonly T[], none?: string) => values.map((v) => ({ value: v, label: v === "0" && none ? none : `${v}%` }));

type Side = "buy" | "sell";

/**
 * The order a tap would send: a market order sized from the chosen share of buying power. With a
 * stop, the size is capped so the loss at the stop stays within the risk limit.
 */
function plan(ctx: SimContext, state: SimState, side: Side, prefs: QuickPrefs, riskLimitPct: number) {
  const long = side === "buy";
  const { bid, ask } = bidAsk(ctx, state);
  const entry = long ? ask : bid;
  const buyingPower = previewOrder(ctx, state, { type: "submit_order", side, orderType: "market", qty: 1 }).buyingPower;
  const stopLoss = prefs.stop ? Math.round(entry * (long ? 1 - prefs.stop / 100 : 1 + prefs.stop / 100)) : null;
  const takeProfit = prefs.target ? Math.round(entry * (long ? 1 + prefs.target / 100 : 1 - prefs.target / 100)) : null;
  let qty = Math.floor((buyingPower * prefs.size) / 100 / entry);
  let capped = false;
  if (stopLoss !== null) {
    const max = maxQtyForRisk({ equity: equityOf(ctx, state), riskPct: riskLimitPct, side: long ? "long" : "short", entry, stop: stopLoss, commissionBps: ctx.cfg.costs.commissionBps }).qty;
    if (max < qty) {
      qty = max;
      capped = true;
    }
  }
  // Adding to a position without choosing a stop or target keeps the position's own (null would remove them).
  const adding = state.position !== null;
  const order = (q: number): Extract<Action, { type: "submit_order" }> => ({
    type: "submit_order",
    side,
    orderType: "market",
    qty: q,
    ...(stopLoss !== null || !adding ? { stopLoss } : {}),
    ...(takeProfit !== null || !adding ? { takeProfit } : {}),
  });
  let preview = previewOrder(ctx, state, order(qty));
  // The entry fee has to fit in the buying power too.
  for (let i = 0; i < 6 && !preview.ok && preview.rejection?.code === "INSUFFICIENT_BUYING_POWER" && qty > 1; i++) {
    qty = Math.floor(qty * 0.99);
    preview = previewOrder(ctx, state, order(qty));
  }
  return { action: order(qty), preview, qty, capped, entry, stopLoss, takeProfit };
}

/** One-tap trading for a live market: pick a size, optionally a stop and a target, then Buy or Sell. */
export function QuickTrade({
  ctx,
  state,
  prefs,
  onPrefs,
  onAct,
  allowShort,
  riskLimitPct,
}: {
  ctx: SimContext;
  state: SimState;
  prefs: QuickPrefs;
  onPrefs: (p: QuickPrefs) => void;
  onAct: (action: Action, message: string) => boolean;
  allowShort: boolean;
  riskLimitPct: number;
}) {
  const { bid, ask } = bidAsk(ctx, state);
  const pos = state.position;
  const side: Side = pos?.side === "short" ? "sell" : "buy";
  const p = plan(ctx, state, side, prefs, riskLimitPct);
  const send = (s: Side) => {
    const x = s === side ? p : plan(ctx, state, s, prefs, riskLimitPct);
    if (x.qty <= 0) return;
    onAct(x.action, `${s === "buy" ? "Bought" : "Sold"} ${x.qty} at market`);
  };
  const close = () => onAct({ type: "close_position" }, "Position closed");
  const blocked = !p.preview.ok ? p.preview.rejection?.message : p.qty <= 0 ? "Not enough buying power for this size." : null;

  return (
    <div className="ml-qt">
      {pos && (
        <div className="ml-qt-pos">
          <div className="ml-qt-pos-main num">
            <b>
              {pos.side === "long" ? "Long" : "Short"} {pos.qty} @ {formatPrice(Math.round(pos.costBasis / pos.qty))}
            </b>
            <span className="ml-muted">
              Stop {pos.stopLoss !== null ? formatPrice(pos.stopLoss) : "none"} · target {pos.takeProfit !== null ? formatPrice(pos.takeProfit) : "none"}
            </span>
          </div>
          <Pnl value={unrealizedPnl(pos, ctx.candles[state.step].c)} />
        </div>
      )}

      <div className="ml-qt-row">
        <span className="ml-qt-label">Size</span>
        <Segmented label="Size, in % of your buying power" size="sm" block value={String(prefs.size) as (typeof SIZES)[number]} options={options(SIZES)} onChange={(v) => onPrefs({ ...prefs, size: Number(v) })} />
      </div>
      <div className="ml-qt-row">
        <span className="ml-qt-label">Stop-loss</span>
        <Segmented label="Stop-loss distance from the entry" size="sm" block value={String(prefs.stop) as (typeof STOPS)[number]} options={options(STOPS, "None")} onChange={(v) => onPrefs({ ...prefs, stop: Number(v) })} />
      </div>
      <div className="ml-qt-row">
        <span className="ml-qt-label">Target</span>
        <Segmented label="Take-profit distance from the entry" size="sm" block value={String(prefs.target) as (typeof TARGETS)[number]} options={options(TARGETS, "None")} onChange={(v) => onPrefs({ ...prefs, target: Number(v) })} />
      </div>

      <p className="ml-qt-summary num">
        {p.qty > 0 ? (
          <>
            {p.qty} units · {money(p.qty * p.entry)}
            {p.stopLoss !== null && p.preview.riskPct !== null ? ` · risk ${formatPct(p.preview.riskPct)} (${money(p.preview.risk ?? 0)})` : ""}
            {p.capped ? ` · capped so the risk stays within ${riskLimitPct}%` : ""}
          </>
        ) : (
          "No room for this size."
        )}
      </p>
      {p.stopLoss === null && <p className="ml-fine">No stop-loss: nothing limits the loss if the market turns. It's allowed, and it's scored.</p>}
      {blocked && <p className="ml-fine">{blocked}</p>}

      <div className="ml-qt-buttons">
        {!pos ? (
          <>
            <Button variant="primary" size="lg" block onClick={() => send("buy")} disabled={p.qty <= 0}>
              Buy <span className="ml-qt-price num">{formatPrice(ask)}</span>
            </Button>
            {allowShort && (
              <Button variant="secondary" size="lg" block onClick={() => send("sell")}>
                Sell <span className="ml-qt-price num">{formatPrice(bid)}</span>
              </Button>
            )}
          </>
        ) : pos.side === "long" ? (
          <>
            <Button variant="secondary" size="lg" block onClick={() => send("buy")} disabled={p.qty <= 0}>
              Buy more
            </Button>
            <Button variant="primary" size="lg" block onClick={close}>
              Close long
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" size="lg" block onClick={close}>
              Close short
            </Button>
            <Button variant="secondary" size="lg" block onClick={() => send("sell")} disabled={p.qty <= 0}>
              Sell more
            </Button>
          </>
        )}
      </div>
      {pos && pos.qty >= 2 && (
        <Button variant="tertiary" size="sm" onClick={() => onAct({ type: "close_position", qty: Math.floor(pos.qty / 2) }, "Half the position closed")}>
          Close half
        </Button>
      )}
    </div>
  );
}
