import { useEffect, useMemo, useRef, useState } from "react";
import { MISSION_TOPICS } from "@market-lab/academy";
import { apply, equityOf, formatPrice, parsePrice, previewOrder, replay, unrealizedPnl, type Action, type EngineEvent, type LogEntry } from "@market-lab/engine";
import { ERROR_TAGS } from "@market-lab/evaluation";
import { SKILL_BY_ID } from "@market-lab/learning";
import { ARENA_SCENARIOS, ARENA_START, MISSIONS, arenaContext, evaluateArena, getArenaScenario, type ArenaScenario } from "@market-lab/missions";
import type { ArenaRegime } from "@market-lab/scenario-gen";
import { Chart } from "../components/Chart";
import { OrderTicket, initialTicket, parseTicket, type TicketValue } from "../components/OrderTicket";
import { Card, PageHead, Pnl, ProBadge, SubNav } from "../components/Page";
import { PlaybackControls, usePlaybackKeys } from "../components/Playback";
import { ChartTitle, Hud, StageBar, useChartHeight } from "../components/Stage";
import { aggregate, smaSeries, timeLabelFor } from "../components/series";
import { useToast } from "../components/Toast";
import { Button, Checkbox, Chips, Dialog, Empty, Icon, InlineError, KeyValues, Meter, ScoreRing, Segmented, Tabs, Tag, TextArea, TextField, cx } from "../components/ui";
import { draftLines, linesFromState, markersFrom } from "../components/visuals";
import { DIFFICULTY_LABEL, bandLabel, formatPct, formatSigned, money, plural, relativeTime } from "../format";
import { usePlan } from "../host";
import { Link, useRouter } from "../router";
import { useLab, useStore, type ArenaSession } from "../store";

const EMOTIONS = [
  { id: "calm", label: "Calm" },
  { id: "confident", label: "Confident" },
  { id: "unsure", label: "Unsure" },
  { id: "anxious", label: "Anxious" },
  { id: "fomo", label: "Fear of missing out" },
  { id: "frustrated", label: "Frustrated" },
];
const EXIT_PLANS = [
  { id: "target", label: "Take-profit at my target" },
  { id: "stop-only", label: "Hold until the stop or a signal" },
  { id: "time", label: "Exit after a set time" },
  { id: "trail", label: "Trail the stop as it moves" },
];
export const EMOTION_LABEL = Object.fromEntries(EMOTIONS.map((e) => [e.id, e.label]));
export const EXIT_LABEL = Object.fromEntries(EXIT_PLANS.map((e) => [e.id, e.label]));

/** Starts an Arena session, respecting the plan's scenario access and daily limit. */
function useStartArena() {
  const store = useStore();
  const { navigate } = useRouter();
  const { pro, limits } = usePlan();
  const usedToday = store.arenaSessionsToday();
  const remaining = limits.arenaPerDay - usedToday;
  const start = (s: ArenaScenario) => {
    if (s.tier === "pro" && !pro) return navigate("/pricing");
    if (remaining <= 0) return navigate("/pricing");
    store.startArena(s.id);
    navigate("/arena/simulator");
  };
  return { start, remaining, pro, limit: limits.arenaPerDay, usedToday };
}

function ScenarioFacts({ s }: { s: ArenaScenario }) {
  return (
    <dl className="ml-facts">
      <div>
        <dt>Starting conditions</dt>
        <dd>{s.conditions}</dd>
      </div>
      <div>
        <dt>Learning objective</dt>
        <dd>{s.objective}</dd>
      </div>
      <div>
        <dt>Capital</dt>
        <dd className="num">{money(s.capital)} (virtual)</dd>
      </div>
      <div>
        <dt>Constraints</dt>
        <dd>{s.constraints.join(" · ")}</dd>
      </div>
      <div>
        <dt>Risk parameters</dt>
        <dd className="num">
          Max {s.maxRiskPct}% of equity per trade ({money(s.capital * (s.maxRiskPct / 100))}) · position value ≤ equity
          {s.requireStop ? " · stop required" : ""}
        </dd>
      </div>
      <div>
        <dt>Completion</dt>
        <dd>
          Play {s.completion.minBars}+ candles{s.completion.minTrades ? ", take at least one trade" : ""}, a stop on every entry, risk ≤ {s.maxRiskPct}%
        </dd>
      </div>
    </dl>
  );
}

// ─── Scenarios ──────────────────────────────────────────────────────────────

export function ScenariosPage() {
  const lab = useLab();
  const { start, remaining, pro, limit } = useStartArena();
  const cleared = new Set(
    Object.values(lab.results)
      .filter((r) => r.kind === "arena" && r.completionMet)
      .map((r) => (lab.sessions[r.sessionId] as ArenaSession | undefined)?.regime),
  );

  return (
    <div className="ml-page">
      <PageHead
        title="Scenarios"
        sub="Nine simulated market conditions on one instrument, LABX. Each one has its own objective, risk limits and completion conditions. Every session is a new, seeded market."
      />
      <SubNav module="arena" />
      {!pro && (
        <p className="ml-note">
          <Icon name="info" size={16} />
          <span className="num">
            Free plan: {Math.max(0, remaining)} of {limit} Arena sessions left today. Three advanced scenarios are part of Pro. <Link to="/pricing" className="ml-text-link">Compare plans</Link>
          </span>
        </p>
      )}
      <ul className="ml-scenarios">
        {ARENA_SCENARIOS.map((s) => {
          const locked = s.tier === "pro" && !pro;
          return (
            <li key={s.id} className={cx("ml-scenario", locked && "is-locked")}>
              <div className="ml-scenario-head">
                <div>
                  <h2>{s.title}</h2>
                  <p className="ml-muted">{s.tagline}</p>
                </div>
                <div className="ml-row">
                  {cleared.has(s.id) && (
                    <span className="ml-status ml-status--done">
                      <Icon name="check" size={12} /> Cleared
                    </span>
                  )}
                  {s.tier === "pro" && <ProBadge />}
                </div>
              </div>
              <p className="ml-meta">
                {DIFFICULTY_LABEL[s.difficulty]} · trains {s.skills.map((k) => SKILL_BY_ID[k].name).join(" and ")}
              </p>
              <ScenarioFacts s={s} />
              <div className="ml-actions">
                <Button variant={locked ? "secondary" : "primary"} iconLeft={locked ? "lock" : undefined} iconRight={locked ? undefined : "arrow-right"} onClick={() => start(s)}>
                  {locked ? "Unlock with Pro" : remaining <= 0 ? "Daily limit reached" : "Start session"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Simulator ──────────────────────────────────────────────────────────────

export function SimulatorPage() {
  const lab = useLab();
  const store = useStore();
  const active = store.activeArena();
  if (active) return <ArenaLive key={active.id} session={active} speed={lab.settings.speed} />;
  return <SimulatorStart />;
}

function SimulatorStart() {
  const lab = useLab();
  const { start, remaining, pro, limit, usedToday } = useStartArena();
  const past = (Object.values(lab.sessions).filter((s) => s.kind === "arena" && s.status === "completed") as ArenaSession[]).sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
  const quick = ARENA_SCENARIOS.filter((s) => s.tier === "free" || pro);

  return (
    <div className="ml-page">
      <PageHead title="Simulator" sub="Trade a simulated market with virtual money: market and limit orders, stops and targets, one candle at a time. Nothing here touches a real market." />
      <SubNav module="arena" />
      <Card title="Start a session" eyebrow={pro ? "Unlimited sessions" : `${Math.max(0, remaining)} of ${limit} sessions left today`}>
        {remaining <= 0 ? (
          <Empty icon="clock" title="You've used today's free sessions" action={<Link to="/pricing" className="ml-text-link">See Pro</Link>}>
            {usedToday} sessions today. The Free plan resets at midnight. The Risk Calculator, lessons and missions stay available.
          </Empty>
        ) : (
          <ul className="ml-quickstart">
            {quick.map((s) => (
              <li key={s.id}>
                <button type="button" className="ml-quickstart-btn" onClick={() => start(s)}>
                  <b>{s.title}</b>
                  <span className="ml-muted">{s.tagline}</span>
                  <span className="ml-meta">
                    {DIFFICULTY_LABEL[s.difficulty]} · max risk {s.maxRiskPct}%
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <Link to="/arena/scenarios" className="ml-text-link">
          Scenario details and completion conditions
        </Link>
      </Card>
      <Card title="Recent sessions" action={<Link to="/journal/sessions" className="ml-text-link ml-small">All sessions</Link>}>
        {past.length === 0 ? (
          <p className="ml-muted">Finished sessions appear here with their decision quality, risk discipline and simulated outcome, kept separate.</p>
        ) : (
          <ul className="ml-rows">
            {past.slice(0, 5).map((s) => {
              const r = lab.results[s.id];
              return (
                <li key={s.id}>
                  <Link to={`/arena/session/${s.id}`} className="ml-row-link">
                    <span className="ml-row-main">
                      <b>{getArenaScenario(s.regime).title}</b>
                      <span className="ml-muted num">
                        Decision quality {r?.dqs ?? "—"} · risk discipline {r?.rds ?? "—"} · {relativeTime(s.completedAt ?? s.updatedAt)}
                      </span>
                    </span>
                    {r && <Pnl value={r.net} />}
                    <Icon name="chevron-right" size={18} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

function describeEvent(e: EngineEvent): string | null {
  switch (e.type) {
    case "order_submitted":
      return `${e.side === "buy" ? "Buy" : "Sell"} ${e.orderType} order · ${e.qty} units${e.limitPrice ? ` @ ${formatPrice(e.limitPrice)}` : ""}${e.stopLoss ? ` · stop ${formatPrice(e.stopLoss)}` : ""}${e.takeProfit ? ` · target ${formatPrice(e.takeProfit)}` : ""}`;
    case "order_filled":
      return `Filled: ${e.side === "buy" ? "bought" : "sold"} ${e.qty} @ ${formatPrice(e.price)}${e.reason === "stop" ? " (stop-loss)" : e.reason === "target" ? " (target)" : e.reason === "session_end" ? " (session end)" : ""} · fee ${formatPrice(e.fee)}`;
    case "order_cancelled":
      return "Order cancelled";
    case "order_rejected":
      return `Rejected: ${e.message}`;
    case "brackets_modified":
      return `Stop ${e.stopLoss !== null ? formatPrice(e.stopLoss) : "removed"} · target ${e.takeProfit !== null ? formatPrice(e.takeProfit) : "none"}`;
    case "position_closed":
      return `Position closed · ${formatSigned(e.realized)} before fees`;
    default:
      return null;
  }
}

export function ArenaLive({ session, speed }: { session: ArenaSession; speed: number }) {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const chartHeight = useChartHeight();
  const { ctx, scenario } = useMemo(() => arenaContext(session.regime, session.seed), [session.regime, session.seed]);
  const last = ctx.candles.length - 1;
  const [log, setLog] = useState<LogEntry[]>(session.log);
  const [cursor, setCursor] = useState(session.cursor);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState<"order" | "position" | "history" | "trades">("order");
  const [ticket, setTicket] = useState<TicketValue>(() => initialTicket("buy", { riskPct: Math.min(1, scenario.maxRiskPct) }));
  const [confirm, setConfirm] = useState<Action | null>(null);
  const [note, setNote] = useState<{ rationale: string; exitPlan?: string; emotion?: string }>({ rationale: "" });
  const [error, setError] = useState<string | null>(null);
  const [slText, setSlText] = useState("");
  const [tpText, setTpText] = useState("");
  const [ending, setEnding] = useState(false);
  const saved = useRef({ cursor: session.cursor, log: session.log });
  const chart = lab.settings.chart;
  const tfHours = chart.timeframe === "4h" ? 4 : 1;

  const { state, events } = useMemo(() => replay(ctx, ARENA_START, [...log, { kind: "advance", to: cursor }]), [ctx, log, cursor]);
  const equity = equityOf(ctx, state);
  const pos = state.position;
  const closed = state.trades.filter((t) => t.exitStep !== null);
  const close = ctx.candles[cursor].c;
  const notional = pos ? pos.qty * close : 0;
  const openRisk = pos?.stopLoss != null ? Math.max(0, (pos.side === "long" ? close - pos.stopLoss : pos.stopLoss - close) * pos.qty) : null;

  useEffect(() => {
    setSlText(pos?.stopLoss != null ? (pos.stopLoss / 100).toFixed(2) : "");
    setTpText(pos?.takeProfit != null ? (pos.takeProfit / 100).toFixed(2) : "");
  }, [pos?.tradeId, pos?.stopLoss, pos?.takeProfit]);

  useEffect(() => {
    if (!playing) return;
    if (cursor >= last) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setCursor((c) => Math.min(last, c + 1)), 1000 / speed);
    return () => window.clearTimeout(t);
  }, [playing, cursor, last, speed]);

  const persist = (c = cursor, l = log) => {
    if (saved.current.cursor === c && saved.current.log === l) return;
    saved.current = { cursor: c, log: l };
    store.saveArena(session.id, c, l);
  };
  useEffect(() => {
    if (!playing || cursor % 15 === 0) persist();
  });

  usePlaybackKeys(cursor < last, { toggle: () => setPlaying((p) => !p), step: () => setCursor((c) => Math.min(last, c + 1)) });

  const act = (action: Action, message?: string): number | null => {
    const r = apply(ctx, state, action);
    if (r.rejected) {
      setError(r.rejected.message);
      return null;
    }
    setError(null);
    const next = [...log, { kind: "action" as const, step: cursor, action }];
    setLog(next);
    persist(cursor, next);
    if (message) toast(message);
    return next.length - 1;
  };

  const review = () => {
    const { order, problem } = parseTicket(ticket);
    if (!order) return setError(problem);
    const pv = previewOrder(ctx, state, { type: "submit_order", ...order });
    if (!pv.ok) return setError(pv.rejection!.message);
    setError(null);
    setPlaying(false);
    setNote({ rationale: "" });
    setConfirm({ type: "submit_order", ...order });
  };

  const confirmPv = confirm?.type === "submit_order" ? previewOrder(ctx, state, confirm) : null;
  const openPnl = pos ? unrealizedPnl(pos, close) : 0;

  // Display series: 1-hour candles, or 4-hour candles built only from candles already visible.
  const display = useMemo(() => {
    const candles = tfHours === 1 ? ctx.candles : aggregate(ctx.candles, cursor, tfHours);
    const lastIdx = tfHours === 1 ? cursor : candles.length - 1;
    const overlays = [
      ...(chart.sma20 ? [{ id: "sma20", label: "SMA 20", values: smaSeries(candles, 20, lastIdx), tone: 1 as const }] : []),
      ...(chart.sma50 ? [{ id: "sma50", label: "SMA 50", values: smaSeries(candles, 50, lastIdx), tone: 2 as const }] : []),
    ];
    const markers = markersFrom(events, cursor).map((m) => ({ ...m, step: Math.floor(m.step / tfHours) }));
    return { candles, lastIdx, overlays, markers };
  }, [ctx.candles, cursor, tfHours, chart.sma20, chart.sma50, events]);

  const history = events
    .filter((e) => e.type !== "step_advanced")
    .map((e, i) => ({ i, step: e.step, text: describeEvent(e) }))
    .filter((x): x is { i: number; step: number; text: string } => x.text !== null)
    .reverse();

  return (
    <div className="ml-stage">
      <StageBar back={{ to: "/arena/scenarios", label: "Scenarios" }} eyebrow={`Simulator · max risk ${scenario.maxRiskPct}% per trade`} title={scenario.title}>
        <Tag variant="outline">Synthetic data</Tag>
        <Button size="sm" variant="secondary" onClick={() => setEnding(true)}>
          End session
        </Button>
      </StageBar>

      <div className="ml-stage-grid">
        <section className="ml-stage-main" aria-label="Market">
          <div className="ml-panel ml-chart-panel">
            <div className="ml-chart-tools">
              <Segmented
                label="Timeframe"
                size="sm"
                value={chart.timeframe}
                onChange={(v) => store.setChart({ timeframe: v })}
                options={[
                  { value: "1h", label: "1H" },
                  { value: "4h", label: "4H" },
                ]}
              />
              <div className="ml-row ml-chart-toggles" role="group" aria-label="Indicators">
                <Checkbox checked={chart.sma20} onChange={(v) => store.setChart({ sma20: v })} label={<span className="ml-ind ml-ind--1">SMA 20</span>} />
                <Checkbox checked={chart.sma50} onChange={(v) => store.setChart({ sma50: v })} label={<span className="ml-ind ml-ind--2">SMA 50</span>} />
                <Checkbox checked={chart.volume} onChange={(v) => store.setChart({ volume: v })} label="Volume" />
              </div>
            </div>
            <Chart
              title={<ChartTitle symbol="LABX" meta={`/ vUSD · ${tfHours === 1 ? "1H" : "4H"} · candle ${cursor - ARENA_START} of ${last - ARENA_START}`} />}
              candles={display.candles}
              visibleTo={display.lastIdx}
              futureSlots={cursor < last ? (tfHours === 1 ? 8 : 3) : 0}
              minBarWidth={tfHours === 1 ? 6 : 9}
              height={chartHeight}
              label="Arena price chart"
              lines={[...linesFromState(state), ...draftLines(tab === "order" ? ticket : null)]}
              markers={display.markers}
              overlays={display.overlays}
              showVolume={chart.volume}
              showGrid={chart.grid}
              timeLabelOf={timeLabelFor(tfHours)}
              tickMs={playing && tfHours === 1 ? 1000 / speed : undefined}
              animateNewest={playing && tfHours === 1}
            />
            <PlaybackControls
              playing={playing}
              onPlay={() => setPlaying(true)}
              onPause={() => {
                setPlaying(false);
                persist();
              }}
              onStep={() => setCursor((c) => Math.min(last, c + 1))}
              speed={speed}
              onSpeed={(v) => store.setSettings({ speed: v })}
              canAdvance={cursor < last}
              progress={(cursor - ARENA_START) / (last - ARENA_START)}
            />
          </div>
          <Hud
            label="Virtual account"
            items={[
              { label: "Equity", value: formatPrice(equity) },
              { label: "Available", value: formatPrice(Math.max(0, equity - notional)) },
              { label: "Unrealized P&L", value: pos ? <Pnl value={openPnl} unit={false} /> : "—" },
              { label: "Realized P&L", value: <Pnl value={state.realized - state.fees} unit={false} /> },
              { label: "Position", value: pos ? `${pos.side === "long" ? "Long" : "Short"} ${pos.qty} @ ${formatPrice(Math.round(pos.costBasis / pos.qty))}` : "Flat", wide: true },
              { label: "Exposure", value: formatPct((notional / Math.max(1, equity)) * 100) },
              { label: "Open risk", value: pos ? (openRisk === null ? "No stop" : formatPct((openRisk / equity) * 100)) : "—" },
            ]}
          />
        </section>

        <aside className="ml-dock" aria-label="Trading panel">
          <div className="ml-dock-tabs">
            <Tabs
              label="Trading panel"
              value={tab}
              onChange={(v) => {
                setTab(v);
                setError(null);
              }}
              items={[
                { value: "order", label: "Order" },
                { value: "position", label: "Position", count: pos ? 1 : state.orders.length || undefined },
                { value: "history", label: "History" },
                { value: "trades", label: "Trades", count: closed.length || undefined },
              ]}
            />
          </div>
          {tab === "order" && (
            <>
              <div className="ml-dock-body">
                <p className="ml-objective-note">
                  <Icon name="target" size={15} />
                  <span>{scenario.objective}</span>
                </p>
                <OrderTicket ctx={ctx} state={state} value={ticket} onChange={setTicket} sides={scenario.allowShort ? ["buy", "sell"] : ["buy"]} orderTypes={scenario.orderTypes} riskLimitPct={scenario.maxRiskPct} />
                {scenario.requireStop && <p className="ml-fine">This scenario requires a stop-loss on every order.</p>}
              </div>
              <div className="ml-dock-foot">
                {error && <InlineError>{error}</InlineError>}
                <Button variant="primary" size="lg" block iconRight="arrow-right" onClick={review}>
                  Review order
                </Button>
              </div>
            </>
          )}
          {tab === "position" && (
            <div className="ml-dock-body">
              {pos ? (
                <div className="ml-stack-4">
                  <KeyValues
                    items={[
                      { label: "Side", value: pos.side === "long" ? "Long" : "Short" },
                      { label: "Quantity", value: pos.qty },
                      { label: "Average entry", value: formatPrice(Math.round(pos.costBasis / pos.qty)) },
                      { label: "Position value", value: money(notional) },
                      { label: "Unrealized P&L", value: <Pnl value={openPnl} />, emphasis: true },
                    ]}
                  />
                  <div className="ml-grid-2">
                    <TextField label="Stop-loss" inputMode="decimal" value={slText} onChange={(e) => setSlText(e.target.value)} placeholder="None" />
                    <TextField label="Take-profit" inputMode="decimal" value={tpText} onChange={(e) => setTpText(e.target.value)} placeholder="None" />
                  </div>
                  {error && <InlineError>{error}</InlineError>}
                  <div className="ml-actions">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const sl = slText.trim() === "" ? null : parsePrice(slText);
                        const tp = tpText.trim() === "" ? null : parsePrice(tpText);
                        if ((slText.trim() && sl === null) || (tpText.trim() && tp === null)) return setError("Enter valid prices for the stop and the target.");
                        act({ type: "modify_brackets", stopLoss: sl, takeProfit: tp }, "Stop and target updated");
                      }}
                    >
                      Update stop and target
                    </Button>
                    <Button variant="tertiary" disabled={pos.qty < 2} onClick={() => act({ type: "close_position", qty: Math.floor(pos.qty / 2) }, "Half the position closed")}>
                      Close half
                    </Button>
                    <Button variant="destructive" onClick={() => act({ type: "close_position" }, "Position closed")}>
                      Close position
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="ml-muted">No open position. Place an order from the Order tab.</p>
              )}
              {state.orders.length > 0 && (
                <div className="ml-stack-2">
                  <h3 className="ml-h3">Pending orders</h3>
                  <ul className="ml-rows">
                    {state.orders.map((o) => (
                      <li key={o.id} className="ml-row-static">
                        <span className="num">
                          {o.side === "buy" ? "Buy" : "Sell"} limit · {o.qty} @ {formatPrice(o.limitPrice)}
                        </span>
                        <Button size="sm" variant="tertiary" onClick={() => act({ type: "cancel_order", orderId: o.id }, "Order cancelled")}>
                          Cancel
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {tab === "history" && (
            <div className="ml-dock-body">
              {history.length === 0 ? (
                <p className="ml-muted">Orders, fills, stop changes and cancellations will be listed here as they happen.</p>
              ) : (
                <ol className="ml-activity" aria-label="Order history">
                  {history.map((h) => (
                    <li key={h.i}>
                      <span className="ml-activity-step num">#{h.step - ARENA_START}</span>
                      <span>{h.text}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
          {tab === "trades" && (
            <div className="ml-dock-body">
              {closed.length === 0 ? (
                <p className="ml-muted">Closed trades will be listed here with their result in R: profit divided by the risk you took.</p>
              ) : (
                <table className="ml-table ml-table--compact">
                  <thead>
                    <tr>
                      <th scope="col">Trade</th>
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
                    {[...closed].reverse().map((t) => {
                      const net = t.realized - t.fees;
                      return (
                        <tr key={t.id}>
                          <th scope="row" className="num">
                            {t.side === "long" ? "Long" : "Short"} {t.maxQty}
                          </th>
                          <td>{t.exitReason === "stop" ? "Stop" : t.exitReason === "target" ? "Target" : "Manual"}</td>
                          <td className="num">
                            <Pnl value={net} unit={false} />
                          </td>
                          <td className="num">{t.initialRisk ? (net / t.initialRisk).toFixed(1) : "no stop"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </aside>
      </div>

      <Dialog
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title="Place this simulated order?"
        footer={
          <>
            <Button variant="tertiary" onClick={() => setConfirm(null)}>
              Back to the ticket
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (confirm) {
                  const index = act(confirm, "Order placed");
                  if (index !== null) {
                    if (note.rationale.trim() || note.exitPlan || note.emotion) store.saveDecisionNote(`${session.id}:${index}`, { rationale: note.rationale.trim() || undefined, exitPlan: note.exitPlan, emotion: note.emotion });
                    setTicket(initialTicket(ticket.side, { riskPct: Number(ticket.riskPct) || 1 }));
                  }
                }
                setConfirm(null);
              }}
            >
              Place order
            </Button>
          </>
        }
      >
        {confirm?.type === "submit_order" && confirmPv && (
          <div className="ml-stack-4">
            <p className="ml-confirm-line">
              {confirm.side === "buy" ? "Buy" : "Sell"} <b className="num">{confirm.qty}</b> LABX {confirm.orderType === "market" ? "at market" : `with a limit at ${formatPrice(confirm.limitPrice!)}`}
              <span className="ml-muted num"> ≈ {formatPrice(confirmPv.entryPrice)}</span>
            </p>
            <KeyValues
              items={[
                {
                  label: (confirmPv.riskPct ?? 0) > scenario.maxRiskPct ? `Loss if stopped · over the ${scenario.maxRiskPct}% limit` : "Loss if stopped",
                  value: confirmPv.risk !== null ? `${money(confirmPv.risk)} · ${formatPct(confirmPv.riskPct!)}` : "Unlimited, no stop",
                  emphasis: true,
                  alert: confirmPv.risk === null || (confirmPv.riskPct ?? 0) > scenario.maxRiskPct,
                },
                { label: "Reward if the target fills", value: confirmPv.reward !== null ? `${money(confirmPv.reward)}${confirmPv.rewardRisk ? ` · ${confirmPv.rewardRisk.toFixed(1)}R` : ""}` : "No target" },
                { label: "Position value", value: `${money(confirmPv.notional)} · ${formatPct((confirmPv.notional / equity) * 100)} of equity` },
              ]}
            />
            <details className="ml-journal-fields">
              <summary>Add to your decision journal (optional)</summary>
              <div className="ml-stack-4">
                <TextArea label="Why this trade?" rows={2} maxLength={400} value={note.rationale} onChange={(v) => setNote({ ...note, rationale: v })} placeholder="What do you expect, and what would prove you wrong?" />
                <Chips single label="Exit plan" options={EXIT_PLANS} selected={note.exitPlan ? [note.exitPlan] : []} onToggle={(id) => setNote({ ...note, exitPlan: note.exitPlan === id ? undefined : id })} />
                <Chips single label="How do you feel?" options={EMOTIONS} selected={note.emotion ? [note.emotion] : []} onToggle={(id) => setNote({ ...note, emotion: note.emotion === id ? undefined : id })} />
              </div>
            </details>
            <p className="ml-fine">Simulated order with virtual money. A real stop-loss can fill worse than its price in fast markets.</p>
          </div>
        )}
      </Dialog>

      <Dialog
        open={ending}
        onClose={() => setEnding(false)}
        title="End this session?"
        description="Any open position is closed at the current price and pending orders are cancelled. You'll get a session summary with your decision quality, risk discipline and simulated outcome, scored separately."
        footer={
          <>
            <Button variant="tertiary" onClick={() => setEnding(false)}>
              Keep trading
            </Button>
            <EndButton
              onEnd={() => {
                setPlaying(false);
                setEnding(false);
                store.finishArena(session.id, cursor, log);
              }}
              sessionId={session.id}
            />
          </>
        }
      />
    </div>
  );
}

function EndButton({ onEnd, sessionId }: { onEnd: () => void; sessionId: string }) {
  const { navigate } = useRouter();
  return (
    <Button
      variant="primary"
      onClick={() => {
        onEnd();
        navigate(`/arena/session/${sessionId}`);
      }}
    >
      End session
    </Button>
  );
}

// ─── Session summary ────────────────────────────────────────────────────────

export function ArenaSessionPage({ sessionId }: { sessionId: string }) {
  const lab = useLab();
  const s = lab.sessions[sessionId];
  if (!s || s.kind !== "arena") return <Empty title="Session not found" action={<Link to="/arena/simulator" className="ml-text-link">Back to the Simulator</Link>} />;
  return s.status === "completed" ? <ArenaResult session={s} /> : <ArenaLive key={s.id} session={s} speed={lab.settings.speed} />;
}

function ArenaResult({ session }: { session: ArenaSession }) {
  const { navigate } = useRouter();
  const lab = useLab();
  const { ctx, scenario } = useMemo(() => arenaContext(session.regime, session.seed), [session.regime, session.seed]);
  const r = useMemo(() => evaluateArena(ctx, session.log, scenario), [ctx, session.log, scenario]);
  const { events, state } = useMemo(() => replay(ctx, ARENA_START, session.log), [ctx, session.log]);
  const { start } = useStartArena();
  const well = r.dqs.criteria.filter((c) => c.applicable && c.score >= 0.8);
  const improve = r.dqs.criteria.filter((c) => c.applicable && c.score < 0.6);
  const next =
    MISSIONS.find((m) => r.dqs.errorTags.some((t) => m.targets.includes(t))) ??
    MISSIONS.find((m) => scenario.skills.includes(m.skillPrimary) && !Object.values(lab.results).some((x) => x.missionId === m.id)) ??
    MISSIONS.find((m) => scenario.skills.includes(m.skillPrimary));

  return (
    <article className="ml-page ml-report">
      <PageHead back={{ to: "/arena/simulator", label: "Simulator" }} eyebrow="Session summary · synthetic data, simulated orders" title={scenario.title} sub={scenario.objective} />

      <section className="ml-scores3" aria-label="Results, scored separately">
        <div className="ml-score3">
          <ScoreRing value={r.dqs.dqs} size={88} label="Decision quality" />
          <div>
            <span className="ml-eyebrow">Decision quality</span>
            <b>{r.trades === 0 ? "Not scored" : bandLabel(r.dqs.dqs)}</b>
            <p className="ml-muted">How sound your process was: stops, sizing, planned exits, pacing.</p>
          </div>
        </div>
        <div className="ml-score3">
          <ScoreRing value={r.rds} size={88} label="Risk discipline" />
          <div>
            <span className="ml-eyebrow">Risk discipline</span>
            <b>{r.rds === null ? "No risk taken" : bandLabel(r.rds)}</b>
            <p className="ml-muted">Whether you respected the limits: {scenario.maxRiskPct}% per trade, a stop every time, never widened.</p>
          </div>
        </div>
        <div className="ml-score3 ml-score3--outcome">
          <span className="ml-eyebrow">Simulated outcome</span>
          <span className="ml-score-big">
            <Pnl value={r.net} />
          </span>
          <p className="ml-muted num">
            {formatPct(r.returnPct, 2, true)} · {plural(r.trades, "trade")}, {r.winners} winning · max drawdown {formatPct(r.maxDrawdownPct)} · fees {formatPrice(r.fees)}
          </p>
        </div>
      </section>
      <p className="ml-verdict">A profitable session doesn't mean good decisions, and a losing one doesn't mean bad ones. The three numbers are kept apart on purpose.</p>

      <div className="ml-panel ml-chart-panel">
        <Chart
          title={<span className="ml-chart-symbol">Your session</span>}
          candles={ctx.candles}
          visibleTo={state.step}
          height={260}
          label="Arena session chart"
          markers={markersFrom(events, state.step)}
          windowStart={Math.max(0, ARENA_START - 20)}
          minBarWidth={2}
        />
      </div>

      <div className="ml-grid ml-grid--2">
        <Card title="Completion conditions" eyebrow={r.completion.met ? "Scenario cleared" : "Not cleared yet"}>
          <ul className="ml-prereqs">
            {r.completion.items.map((it) => (
              <li key={it.label} className={cx(it.met && "is-met")}>
                <Icon name={it.met ? "check" : "x"} size={14} />
                {it.label}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Debrief">
          <div className="ml-stack-4">
            <div>
              <h3 className="ml-h4">What went well</h3>
              {well.length ? (
                <ul className="ml-list ml-list--check">
                  {well.map((c) => (
                    <li key={c.id}>{c.detail}</li>
                  ))}
                </ul>
              ) : (
                <p className="ml-muted">{r.trades === 0 ? "You stayed flat. Watching a market without trading is practice too." : "Nothing stood out this time."}</p>
              )}
            </div>
            {improve.length > 0 && (
              <div>
                <h3 className="ml-h4">What could be improved</h3>
                <ul className="ml-list ml-list--dash">
                  {improve.map((c) => (
                    <li key={c.id}>{c.detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>

      {r.trades > 0 && (
        <section className="ml-section">
          <div className="ml-section-head">
            <h2>How the scores were built</h2>
          </div>
          <ul className="ml-criteria">
            {r.dqs.criteria.map((c) => (
              <li key={c.id} className={cx(!c.applicable && "is-na")}>
                <div className="ml-criteria-head">
                  <span className="ml-criteria-label">{c.label}</span>
                  <span className="ml-criteria-meta">
                    {SKILL_BY_ID[c.skill].name}
                    {["invalidation_before_entry", "risk_within_limit", "no_stop_widening", "no_revenge_sizing"].includes(c.evaluator) ? " · counts for risk discipline" : ""}
                  </span>
                  <span className="ml-criteria-score num">{c.applicable ? Math.round(c.score * 100) : "n/a"}</span>
                </div>
                {c.applicable && <Meter value={c.score} label={c.label} muted={c.score < 0.5} />}
                <p>{c.detail}</p>
              </li>
            ))}
          </ul>
          {r.dqs.errorTags.length > 0 && (
            <div className="ml-stack-2">
              <h3 className="ml-h4">Key learning points</h3>
              <ul className="ml-patterns">
                {r.dqs.errorTags.map((t) => (
                  <li key={t}>
                    <b>{ERROR_TAGS[t]?.label ?? t}</b>
                    <span className="ml-muted">{ERROR_TAGS[t]?.tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <div className="ml-actions">
        {next && (
          <Button variant="primary" iconRight="arrow-right" onClick={() => navigate(`/mission/${next.id}`)}>
            Recommended next: {next.title}
          </Button>
        )}
        <Button variant="secondary" iconLeft="replay" onClick={() => navigate(`/journal/replay/${session.id}`)}>
          Replay the session
        </Button>
        <Button variant="secondary" iconLeft="split" onClick={() => navigate(`/journal/alternatives/${session.id}`)}>
          Alternative decisions
        </Button>
        <Button variant="tertiary" onClick={() => start(scenario)}>
          New {scenario.title.toLowerCase()} session
        </Button>
      </div>
      {next && MISSION_TOPICS[next.id] && <p className="ml-fine">Suggested because it trains {SKILL_BY_ID[next.skillPrimary].name}, which this session exercised.</p>}
    </article>
  );
}

export type { ArenaRegime };
