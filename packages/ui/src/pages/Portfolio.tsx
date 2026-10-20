import { useMemo } from "react";
import { equityOf, formatPrice, replay, unrealizedPnl } from "@market-lab/engine";
import { ARENA_START, arenaContext, arenaEquityCurve, getArenaScenario } from "@market-lab/missions";
import { LineChart } from "../components/MiniCharts";
import { Card, PageHead, Pnl, StatTile, SubNav } from "../components/Page";
import { Button, Empty, Icon, KeyValues } from "../components/ui";
import { formatDate, formatPct, money, plural } from "../format";
import { resultRds } from "../progress";
import { Link, useRouter } from "../router";
import { useLab, useStore, type ArenaSession } from "../store";

export function PortfolioPage() {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const active = store.activeArena();
  const tz = lab.settings.timeZone;

  const live = useMemo(() => {
    if (!active) return null;
    const { ctx, scenario } = arenaContext(active.regime, active.seed);
    const { state } = replay(ctx, ARENA_START, [...active.log, { kind: "advance", to: active.cursor }]);
    const equity = equityOf(ctx, state);
    const close = ctx.candles[active.cursor].c;
    const pos = state.position;
    const notional = pos ? pos.qty * close : 0;
    const openRisk = pos?.stopLoss != null ? Math.max(0, (pos.side === "long" ? close - pos.stopLoss : pos.stopLoss - close) * pos.qty) : null;
    const curve = arenaEquityCurve(ctx, active.log, active.cursor);
    return { ctx, scenario, state, equity, close, pos, notional, openRisk, curve };
  }, [active]);

  const completed = useMemo(
    () => (Object.values(lab.sessions).filter((s) => s.kind === "arena" && s.status === "completed") as ArenaSession[]).sort((a, b) => (a.completedAt ?? 0) - (b.completedAt ?? 0)),
    [lab.sessions],
  );

  const history = useMemo(() => {
    const trades = completed.flatMap((s) => {
      const { ctx } = arenaContext(s.regime, s.seed);
      const { state } = replay(ctx, ARENA_START, s.log);
      return state.trades
        .filter((t) => t.exitStep !== null)
        .map((t) => ({ ...t, sessionId: s.id, scenario: getArenaScenario(s.regime).title, at: s.completedAt ?? s.updatedAt }));
    });
    let running = 1_000_000;
    const account = [running, ...completed.map((s) => (running += lab.results[s.id]?.net ?? 0))];
    return { trades: trades.reverse(), account };
  }, [completed, lab.results]);

  const totalNet = completed.reduce((s, x) => s + (lab.results[x.id]?.net ?? 0), 0);
  const rdsValues = completed.map((s) => (lab.results[s.id] ? resultRds(lab, lab.results[s.id]) : null)).filter((v): v is number => v !== null);

  return (
    <div className="ml-page">
      <PageHead title="Virtual Portfolio" sub="Your simulated account: balance, positions, exposure and history. Virtual money only; none of these results reflect real market performance." />
      <SubNav module="arena" />

      {live && active ? (
        <>
          <div className="ml-grid ml-grid--4">
            <StatTile label="Account equity" value={formatPrice(live.equity)} sub="vUSD, virtual" icon="wallet" />
            <StatTile label="Available capital" value={formatPrice(Math.max(0, live.equity - live.notional))} sub="Not tied up in a position" />
            <StatTile label="Unrealized P&L" value={live.pos ? <Pnl value={unrealizedPnl(live.pos, live.close)} unit={false} /> : "—"} sub={live.pos ? "If closed at the last price" : "No open position"} />
            <StatTile label="Realized P&L" value={<Pnl value={live.state.realized - live.state.fees} unit={false} />} sub={`After ${formatPrice(live.state.fees)} in fees`} />
          </div>
          <div className="ml-split">
            <Card title="Account equity, this session" eyebrow={live.scenario.title} action={<Button size="sm" variant="primary" iconRight="arrow-right" onClick={() => navigate("/arena/simulator")}>Resume</Button>}>
              <LineChart
                series={[{ id: "eq", label: "Equity", values: live.curve, tone: "accent" }]}
                baseline={live.scenario.capital}
                formatY={(v) => formatPrice(Math.round(v))}
                description={`Equity over ${live.curve.length} candles, from ${formatPrice(live.curve[0])} to ${formatPrice(live.curve[live.curve.length - 1])} vUSD.`}
              />
            </Card>
            <Card title="Risk overview">
              <KeyValues
                items={[
                  { label: "Open position", value: live.pos ? `${live.pos.side === "long" ? "Long" : "Short"} ${live.pos.qty} LABX` : "Flat" },
                  { label: "Position exposure", value: `${money(live.notional)} · ${formatPct((live.notional / live.equity) * 100)}` },
                  {
                    label: "Open risk to stop",
                    value: live.pos ? (live.openRisk === null ? "Unlimited, no stop" : `${money(live.openRisk)} · ${formatPct((live.openRisk / live.equity) * 100)}`) : "—",
                    alert: Boolean(live.pos) && live.openRisk === null,
                  },
                  { label: "Risk limit", value: `${live.scenario.maxRiskPct}% per trade` },
                  { label: "Max drawdown so far", value: formatPct(live.state.maxDrawdownBps / 100) },
                  { label: "Pending orders", value: live.state.orders.length },
                ]}
              />
            </Card>
          </div>
        </>
      ) : (
        <Card title="No session in progress">
          <p className="ml-muted">Start a session in the Simulator to see live balance, exposure and open risk here.</p>
          <div className="ml-actions">
            <Button variant="primary" iconRight="arrow-right" onClick={() => navigate("/arena/simulator")}>
              Open the Simulator
            </Button>
          </div>
        </Card>
      )}

      <Card title="Historical account" eyebrow={`${plural(completed.length, "finished session")} · each starts with 10,000.00 vUSD`}>
        {completed.length === 0 ? (
          <p className="ml-muted">Finished sessions build this history.</p>
        ) : (
          <>
            <div className="ml-grid ml-grid--3">
              <StatTile label="Cumulative simulated result" value={<Pnl value={totalNet} unit={false} />} sub="Sum of all session results" />
              <StatTile label="Average risk discipline" value={rdsValues.length ? Math.round(rdsValues.reduce((a, b) => a + b, 0) / rdsValues.length) : "—"} sub="Across sessions with trades" />
              <StatTile label="Closed positions" value={history.trades.length} sub={`${history.trades.filter((t) => t.realized - t.fees > 0).length} with a gain`} />
            </div>
            <LineChart
              series={[{ id: "acct", label: "Virtual account", values: history.account, tone: "blue" }]}
              baseline={1_000_000}
              formatY={(v) => formatPrice(Math.round(v))}
              xLabels={["Start", ...completed.map((s) => formatDate(s.completedAt ?? s.updatedAt, tz, { day: "numeric", month: "short" }))]}
              description={`Session results added up as one virtual account, across ${completed.length} sessions.`}
            />
            <p className="ml-fine">Adds up session results as if they were one account. It's a learning record, not a performance track record.</p>
          </>
        )}
      </Card>

      <Card title="Closed positions">
        {history.trades.length === 0 ? (
          <Empty icon="list" title="No closed positions yet" action={<Link to="/arena/scenarios" className="ml-text-link">Pick a scenario</Link>}>
            Positions you close in finished sessions are listed here with their result in R.
          </Empty>
        ) : (
          <div className="ml-table-wrap">
            <table className="ml-table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Scenario</th>
                  <th scope="col">Position</th>
                  <th scope="col" className="num">
                    Entry → exit
                  </th>
                  <th scope="col">Exit</th>
                  <th scope="col" className="num">
                    Result
                  </th>
                  <th scope="col" className="num">
                    R
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.trades.slice(0, 50).map((t) => {
                  const net = t.realized - t.fees;
                  return (
                    <tr key={`${t.sessionId}-${t.id}`}>
                      <td>{formatDate(t.at, tz, { day: "numeric", month: "short" })}</td>
                      <td>
                        <Link to={`/arena/session/${t.sessionId}`} className="ml-text-link">
                          {t.scenario}
                        </Link>
                      </td>
                      <th scope="row" className="num">
                        {t.side === "long" ? "Long" : "Short"} {t.maxQty}
                      </th>
                      <td className="num">
                        {formatPrice(Math.round(t.entryNotional / Math.max(1, t.entryQty)))} → {formatPrice(Math.round(t.exitNotional / Math.max(1, t.exitQty)))}
                      </td>
                      <td>{t.exitReason === "stop" ? "Stop" : t.exitReason === "target" ? "Target" : t.exitReason === "session_end" ? "Session end" : "Manual"}</td>
                      <td className="num">
                        <Pnl value={net} unit={false} />
                      </td>
                      <td className="num">{t.initialRisk ? (net / t.initialRisk).toFixed(1) : <span title="No stop, so no defined risk">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <p className="ml-fine">
        <Icon name="info" size={14} /> All figures are simulated with virtual money on synthetic data.
      </p>
    </div>
  );
}
