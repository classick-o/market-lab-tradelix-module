import { useEffect, useMemo, useState } from "react";
import { equityOf, formatPrice, replay, type LogEntry } from "@market-lab/engine";
import { ARENA_START, arenaContext } from "@market-lab/missions";
import { Chart } from "../components/Chart";
import { ChartTitle, Hud, StageBar, useChartHeight } from "../components/Stage";
import { Button, Checkbox, Empty, IconButton, KeyValues, Tag } from "../components/ui";
import { linesFromState, markersFrom } from "../components/visuals";
import { formatPct, formatSigned, money } from "../format";
import { arenaDecisions } from "../journal";
import { Link } from "../router";
import { useLab, useStore } from "../store";
import { EMOTION_LABEL, EXIT_LABEL } from "./Arena";

/** Trade Replay for an Arena session: the chart rebuilt at any candle, with every order on the timeline. */
export function ArenaReplayPage({ sessionId }: { sessionId: string }) {
  const lab = useLab();
  const store = useStore();
  const session = lab.sessions[sessionId];
  const chartHeight = useChartHeight();
  const data = useMemo(() => {
    if (!session || session.kind !== "arena") return null;
    const { ctx, scenario } = arenaContext(session.regime, session.seed);
    const decisions = arenaDecisions(ctx, session.log);
    const end = Math.max(ARENA_START, ...session.log.map((e) => (e.kind === "advance" ? e.to : e.kind === "action" ? e.step : ARENA_START)));
    return { ctx, scenario, decisions, end };
  }, [session]);
  const [step, setStep] = useState(() => data?.decisions[0]?.step ?? ARENA_START);
  const [showNext, setShowNext] = useState(false);
  useEffect(() => setShowNext(false), [step]);
  useEffect(() => {
    if (session?.status === "completed") store.markReplayViewed(sessionId);
  }, [session?.status, store, sessionId]);

  // State as of the end of `step`: every log entry up to that candle, nothing after it.
  const frame = useMemo(() => {
    if (!data || !session || session.kind !== "arena") return null;
    const upTo: LogEntry[] = session.log.filter((e) => e.kind === "action" && e.step <= step);
    return replay(data.ctx, ARENA_START, [...upTo, { kind: "advance", to: step }]);
  }, [data, session, step]);

  const atDecisionStep = data?.decisions.some((d) => d.step === step) ?? false;
  const visibleTo = data && atDecisionStep && showNext ? data.end : step;
  const full = useMemo(
    () => (data && session?.kind === "arena" ? replay(data.ctx, ARENA_START, [...session.log.filter((e) => e.kind === "action" && e.step <= visibleTo), { kind: "advance", to: visibleTo }]) : null),
    [data, session, visibleTo],
  );

  if (!session || session.kind !== "arena" || !data || !frame || !full) return <Empty title="Replay not found" action={<Link to="/journal/replay" className="ml-text-link">Trade Replay</Link>} />;
  if (session.status !== "completed")
    return (
      <Empty title="Finish the session first" action={<Link to="/arena/simulator" className="ml-text-link">Back to the Simulator</Link>}>
        Replays open once a session has ended.
      </Empty>
    );

  const { ctx, scenario, decisions, end } = data;
  const atDecision = decisions.filter((d) => d.step === step);
  const lastDecision = [...decisions].reverse().find((d) => d.step <= step);
  const span = Math.max(1, end - ARENA_START);
  const equity = equityOf(ctx, frame.state);
  const pos = frame.state.position;

  return (
    <div className="ml-stage">
      <StageBar back={{ to: "/journal/replay", label: "Trade Replay" }} eyebrow={`Trade Replay · ${scenario.title}`} title="What you knew, decision by decision">
        <Tag variant="outline">Synthetic data</Tag>
      </StageBar>
      <div className="ml-stage-grid">
        <section className="ml-stage-main" aria-label="Replay">
          <div className="ml-panel ml-chart-panel">
            <Chart
              title={<ChartTitle symbol="LABX" meta={`/ vUSD · 1H · candle ${step - ARENA_START} of ${end - ARENA_START}`} />}
              candles={ctx.candles}
              visibleTo={visibleTo}
              fixedEnd={end}
              windowStart={Math.max(0, ARENA_START - 20)}
              minBarWidth={2}
              height={chartHeight}
              label="Replay chart"
              lines={linesFromState(frame.state)}
              markers={markersFrom(full.events, visibleTo)}
              decisionSteps={decisions.map((d, i) => ({ step: d.step, label: `O${i + 1}` }))}
              revealedAfter={atDecision.length && showNext ? step : undefined}
            />
            <div className="ml-scrubber">
              <IconButton icon="arrow-left" label="Previous candle" onClick={() => setStep((s) => Math.max(ARENA_START, s - 1))} />
              <div className="ml-scrubber-track">
                <input type="range" min={ARENA_START} max={end} value={step} onChange={(e) => setStep(Number(e.target.value))} aria-label="Replay position" aria-valuetext={`Candle ${step - ARENA_START} of ${end - ARENA_START}`} />
                <div className="ml-scrubber-marks" aria-hidden="true">
                  {decisions.map((d, i) => (
                    <span key={d.index} style={{ left: `${((d.step - ARENA_START) / span) * 100}%` }}>
                      O{i + 1}
                    </span>
                  ))}
                </div>
              </div>
              <IconButton icon="arrow-right" label="Next candle" onClick={() => setStep((s) => Math.min(end, s + 1))} />
            </div>
            <div className="ml-jumps">
              {decisions.map((d, i) => (
                <Button key={d.index} size="sm" variant={step === d.step ? "primary" : "secondary"} onClick={() => setStep(d.step)}>
                  O{i + 1} · {d.action.side === "buy" ? "Buy" : "Sell"} {d.action.qty}
                </Button>
              ))}
              <Button size="sm" variant="tertiary" onClick={() => setStep(end)}>
                End
              </Button>
            </div>
          </div>
          <Hud
            label={`Account at candle ${step - ARENA_START}`}
            items={[
              { label: "Candle", value: `#${step - ARENA_START}` },
              { label: "Equity", value: formatPrice(equity) },
              { label: "P&L", value: formatSigned(equity - scenario.capital) },
              { label: "Position", value: pos ? `${pos.side === "long" ? "Long" : "Short"} ${pos.qty} @ ${formatPrice(Math.round(pos.costBasis / pos.qty))}` : "Flat", wide: true },
            ]}
          />
        </section>
        <aside className="ml-dock" aria-label="What you knew">
          <div className="ml-dock-body">
            <header className="ml-dock-head">
              <span className="ml-eyebrow">{atDecision.length ? "At this order you knew" : lastDecision ? "Your last order" : "Before your first order"}</span>
              <h2 className="ml-dock-title">{lastDecision ? `${lastDecision.action.side === "buy" ? "Buy" : "Sell"} ${lastDecision.action.qty} LABX` : "Move to an order"}</h2>
              <p className="ml-dock-prompt">
                Price {formatPrice(ctx.candles[step].c)} after {step - ARENA_START} candles. Nothing to the right of the chart was visible.
              </p>
            </header>
            {lastDecision && (
              <>
                <KeyValues
                  items={[
                    { label: "Order", value: lastDecision.action.orderType === "limit" ? `Limit @ ${formatPrice(lastDecision.action.limitPrice!)}` : "Market" },
                    { label: "Planned risk", value: lastDecision.preview.risk !== null ? `${money(lastDecision.preview.risk)} · ${formatPct(lastDecision.preview.riskPct!)}` : "No stop", alert: lastDecision.preview.risk === null },
                    { label: "Stop", value: lastDecision.action.stopLoss != null ? formatPrice(lastDecision.action.stopLoss) : "None" },
                    { label: "Target", value: lastDecision.action.takeProfit != null ? formatPrice(lastDecision.action.takeProfit) : "None" },
                    { label: "Execution", value: lastDecision.status === "rejected" ? "Rejected" : lastDecision.fill ? `Filled @ ${formatPrice(lastDecision.fill.price)}` : lastDecision.status === "cancelled" ? "Cancelled" : "Pending" },
                  ]}
                />
                {(() => {
                  const note = lab.decisionNotes[`${session.id}:${lastDecision.index}`];
                  return note ? (
                    <div className="ml-answer">
                      <span className="ml-eyebrow">Your notes</span>
                      {note.rationale && <p>“{note.rationale}”</p>}
                      <p className="ml-muted">
                        {[note.exitPlan && `Exit plan: ${EXIT_LABEL[note.exitPlan]}`, note.emotion && `Felt: ${EMOTION_LABEL[note.emotion]}`].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  ) : null;
                })()}
              </>
            )}
            {atDecision.length > 0 && <Checkbox checked={showNext} onChange={setShowNext} label="Show what happened next" />}
            <ol className="ml-activity" aria-label="Timeline">
              {decisions
                .filter((d) => d.step <= visibleTo)
                .slice(-6)
                .reverse()
                .map((d) => (
                  <li key={d.index}>
                    <span className="ml-activity-step num">#{d.step - ARENA_START}</span>
                    <span>
                      {d.action.side === "buy" ? "Buy" : "Sell"} {d.action.qty}
                      {d.fill ? ` filled @ ${formatPrice(d.fill.price)}` : ` (${d.status})`}
                      {d.exit && d.exit.step <= visibleTo ? ` · exit @ ${formatPrice(d.exit.price)}` : ""}
                    </span>
                  </li>
                ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
