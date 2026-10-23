import type { ReactNode } from "react";
import { equityOf, formatPrice, openTrade, unrealizedPnl, type SimContext, type SimState } from "@market-lab/engine";
import { duelTradeR, type BotPersona } from "@market-lab/missions";
import { Pnl } from "./Page";
import { Tag, cx } from "./ui";

/** R with its sign: "+1.4R", "−0.6R". */
export function formatR(r: number): string {
  const v = Math.round(r * 10) / 10;
  return `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(1)}R`;
}

/** The bot's initial in a circle, in the rival colour. Decorative: the name is always next to it. */
export function BotAvatar({ bot, size = 36 }: { bot: BotPersona; size?: number }) {
  return (
    <span className="ml-bot-avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }} aria-hidden="true">
      {bot.name[0]}
    </span>
  );
}

/** Every bot is labelled as one, everywhere it appears. */
export function BotTag() {
  return (
    <Tag variant="outline" className="ml-bot-tag">
      Bot
    </Tag>
  );
}

/** Whose marks are whose on the duel chart. Shape and label, not only colour. */
export function DuelLegend({ bot }: { bot: BotPersona }) {
  return (
    <span className="ml-duel-legend">
      <span className="ml-duel-key">You</span>
      <span className="ml-duel-key ml-duel-key--rival">{bot.name} (bot)</span>
    </span>
  );
}

/** Closed R so far, plus the open position's R at the current price (1% of the account is the unit without a stop). */
export function accountR(ctx: SimContext, state: SimState): { closed: number; open: number | null } {
  const unit = ctx.cfg.initialEquity / 100;
  const closed = state.trades.filter((t) => t.exitStep !== null).reduce((s, t) => s + duelTradeR(t, ctx.cfg.initialEquity), 0);
  const trade = openTrade(state);
  const open = state.position && trade ? unrealizedPnl(state.position, ctx.candles[state.step].c) / (trade.initialRisk || unit) : null;
  return { closed, open };
}

function SideColumn({ title, rival, ctx, state }: { title: ReactNode; rival?: boolean; ctx: SimContext; state: SimState }) {
  const pos = state.position;
  const closed = state.trades.filter((t) => t.exitStep !== null);
  const mark = ctx.candles[state.step].c;
  const { closed: closedR, open: openR } = accountR(ctx, state);
  return (
    <section className={cx("ml-vs-col", rival && "is-rival")}>
      <header className="ml-vs-head">{title}</header>
      <dl className="ml-vs-stats">
        <div>
          <dt>Equity</dt>
          <dd className="num">{formatPrice(equityOf(ctx, state))}</dd>
        </div>
        <div>
          <dt>P&amp;L</dt>
          <dd>
            <Pnl value={equityOf(ctx, state) - ctx.cfg.initialEquity} unit={false} />
          </dd>
        </div>
        <div>
          <dt>Closed R</dt>
          <dd className="num">{closed.length ? formatR(closedR) : "—"}</dd>
        </div>
        <div>
          <dt>Trades</dt>
          <dd className="num">{state.trades.length}</dd>
        </div>
      </dl>

      <div className="ml-vs-block">
        <h4 className="ml-vs-label">Open position</h4>
        {pos ? (
          <dl className="ml-vs-pos">
            <div>
              <dt>Side</dt>
              <dd className="num">
                {pos.side === "long" ? "Long" : "Short"} {pos.qty} @ {formatPrice(Math.round(pos.costBasis / pos.qty))}
              </dd>
            </div>
            <div>
              <dt>Stop · target</dt>
              <dd className="num">
                {pos.stopLoss !== null ? formatPrice(pos.stopLoss) : "none"} · {pos.takeProfit !== null ? formatPrice(pos.takeProfit) : "none"}
              </dd>
            </div>
            <div>
              <dt>Open P&amp;L</dt>
              <dd>
                <Pnl value={unrealizedPnl(pos, mark)} unit={false} />
                {openR !== null && <span className="ml-muted num"> · {formatR(openR)}</span>}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="ml-muted">Flat</p>
        )}
        {state.orders.length > 0 && (
          <ul className="ml-vs-orders">
            {state.orders.map((o) => (
              <li key={o.id} className="num">
                {o.side === "buy" ? "Buy" : "Sell"} limit {o.qty} @ {formatPrice(o.limitPrice)}
                {o.stopLoss !== null ? ` · stop ${formatPrice(o.stopLoss)}` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="ml-vs-block">
        <h4 className="ml-vs-label">Closed trades</h4>
        {closed.length === 0 ? (
          <p className="ml-muted">None yet</p>
        ) : (
          <table className="ml-table ml-table--compact">
            <thead>
              <tr>
                <th scope="col">Trade</th>
                <th scope="col">Exit</th>
                <th scope="col" className="num">
                  P&amp;L
                </th>
                <th scope="col" className="num">
                  R
                </th>
              </tr>
            </thead>
            <tbody>
              {[...closed].reverse().map((t) => {
                const r = duelTradeR(t, ctx.cfg.initialEquity);
                return (
                  <tr key={t.id}>
                    <th scope="row" className="num">
                      {t.side === "long" ? "Long" : "Short"} {t.maxQty}
                    </th>
                    <td>{t.exitReason === "stop" ? "Stop" : t.exitReason === "target" ? "Target" : t.exitReason === "session_end" ? "Duel end" : "Manual"}</td>
                    <td className="num">
                      <Pnl value={t.realized - t.fees} unit={false} />
                    </td>
                    <td className="num">{formatR(r)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

/** The player's account next to the bot's: positions, orders and closed trades, side by side. */
export function VsPanel({ ctx, bot, you, rival, showRival = true }: { ctx: SimContext; bot: BotPersona; you: SimState; rival: SimState; showRival?: boolean }) {
  return (
    <div className={cx("ml-vs", !showRival && "is-solo")} role="region" aria-label={showRival ? `You vs ${bot.name}: positions and trades` : "Your positions and trades"}>
      <SideColumn ctx={ctx} state={you} title={<span className="ml-vs-name">You</span>} />
      {showRival && <SideColumn
        ctx={ctx}
        state={rival}
        rival
        title={
          <span className="ml-vs-name">
            <BotAvatar bot={bot} size={22} />
            {bot.name} <BotTag />
          </span>
        }
      />}
    </div>
  );
}
