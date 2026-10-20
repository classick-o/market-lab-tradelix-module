import { useEffect, useMemo, useState } from "react";
import { getMission, optionOf, runMission } from "@market-lab/missions";
import { Chart } from "../components/Chart";
import { ChartTitle, Hud, StageBar, useChartHeight } from "../components/Stage";
import { Button, Checkbox, Empty, IconButton, KeyValues, Tag } from "../components/ui";
import { linesFromFrame, markersFrom } from "../components/visuals";
import { formatFact, formatPrice, formatSigned } from "../format";
import { Link } from "../router";
import { useLab, useStore } from "../store";
import { Activity } from "./Play";

export function ReplayPage({ sessionId }: { sessionId: string }) {
  const lab = useLab();
  const store = useStore();
  const session = lab.sessions[sessionId];
  const chartHeight = useChartHeight();
  const run = useMemo(() => (session?.kind === "mission" ? runMission(getMission(session.missionId), session.variantIdx, session.log) : null), [session]);
  const [step, setStep] = useState(() => run?.visited[0]?.step ?? run?.startStep ?? 0);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    if (run?.phase === "concluded") store.markReplayViewed(sessionId);
  }, [run, store, sessionId]);
  useEffect(() => setShowNext(false), [step]);

  if (!session || session.kind !== "mission" || !run) {
    return <Empty title="Replay not found" action={<Link to="/journal" className="ml-text-link">Open your journal</Link>} />;
  }
  if (run.phase !== "concluded") {
    return (
      <Empty title="Finish the mission first" action={<Link to={`/play/${sessionId}`} className="ml-text-link">Continue the mission</Link>}>
        Replays open once a scenario has played out.
      </Empty>
    );
  }

  const mission = run.mission;
  const events = run.events.flatMap((e) => (e.kind === "engine" ? [e.event] : []));
  const frame = run.frames[step] ?? run.frames[run.startStep];
  const decision = [...run.visited].reverse().find((v) => v.step <= step);
  const atDecision = run.visited.find((v) => v.step === step);
  const visibleTo = atDecision && showNext ? run.endStep : step;
  const span = Math.max(1, run.endStep - run.startStep);
  const answerText = decision
    ? (optionOf(decision.def, decision.answer!)?.label ??
      (decision.answer?.pickPrice !== undefined ? `Marked ${formatPrice(decision.answer.pickPrice)}` : decision.answer?.numeric !== undefined ? `${decision.answer.numeric} units` : "—"))
    : null;

  return (
    <div className="ml-stage">
      <StageBar back={{ to: `/debrief/${sessionId}`, label: "Debrief" }} eyebrow={`Replay Lab · ${mission.id}`} title={mission.title}>
        <Tag variant="outline">Synthetic data</Tag>
      </StageBar>

      <div className="ml-stage-grid">
        <section className="ml-stage-main" aria-label="Replay">
          <div className="ml-panel ml-chart-panel">
            <Chart
              title={<ChartTitle symbol={mission.symbol} meta="/ vUSD · 1H" />}
              candles={run.ctx.candles}
              visibleTo={visibleTo}
              fixedEnd={run.endStep}
              height={chartHeight}
              label="Replay chart"
              lines={linesFromFrame(frame)}
              markers={markersFrom(events, visibleTo)}
              decisionSteps={run.visited.map((v, i) => ({ step: v.step, label: `D${i + 1}` }))}
              highlightCandle={atDecision?.def.highlight?.(atDecision.facts).candle}
              zone={atDecision?.def.highlight?.(atDecision.facts).zone}
              revealedAfter={atDecision && showNext ? step : undefined}
            />
            <div className="ml-scrubber">
              <IconButton icon="arrow-left" label="Previous candle" onClick={() => setStep((s) => Math.max(run.startStep, s - 1))} />
              <div className="ml-scrubber-track">
                <input
                  type="range"
                  min={run.startStep}
                  max={run.endStep}
                  value={step}
                  onChange={(e) => setStep(Number(e.target.value))}
                  aria-label="Replay position"
                  aria-valuetext={`Candle ${step} of ${run.endStep}`}
                />
                <div className="ml-scrubber-marks" aria-hidden="true">
                  {run.visited.map((v, i) => (
                    <span key={v.def.id} style={{ left: `${((v.step - run.startStep) / span) * 100}%` }}>
                      D{i + 1}
                    </span>
                  ))}
                </div>
              </div>
              <IconButton icon="arrow-right" label="Next candle" onClick={() => setStep((s) => Math.min(run.endStep, s + 1))} />
            </div>
            <div className="ml-jumps">
              {run.visited.map((v, i) => (
                <Button key={v.def.id} size="sm" variant={step === v.step ? "primary" : "secondary"} onClick={() => setStep(v.step)}>
                  D{i + 1} · {v.def.title}
                </Button>
              ))}
              <Button size="sm" variant="tertiary" onClick={() => setStep(run.endStep)}>
                End
              </Button>
            </div>
          </div>
          <Hud
            label={`Account at candle ${step}`}
            items={[
              { label: "Candle", value: `#${step}` },
              { label: "Equity", value: formatPrice(frame.equity) },
              { label: "P&L", value: formatSigned(frame.equity - mission.equity) },
              {
                label: "Position",
                value: frame.position ? `${frame.position.side === "long" ? "Long" : "Short"} ${frame.position.qty} @ ${formatPrice(frame.position.avgEntry)}` : "Flat",
                wide: true,
              },
            ]}
          />
        </section>

        <aside className="ml-dock" aria-label="What you knew">
          <div className="ml-dock-body">
            <header className="ml-dock-head">
              <span className="ml-eyebrow">{atDecision ? "At this decision you knew" : decision ? "Your last decision" : "Before your first decision"}</span>
              <h2 className="ml-dock-title">{decision ? decision.def.title : "Move to a decision point"}</h2>
              {decision && <p className="ml-dock-prompt">{decision.prompt}</p>}
            </header>
            {decision?.def.cards && <KeyValues items={decision.def.cards.map((c) => ({ label: c.label, value: formatFact(decision.facts[c.fact], c.format) }))} />}
            {decision && (
              <div className="ml-answer">
                <span className="ml-eyebrow">You chose</span>
                <p>{answerText}</p>
                {decision.answer?.hypothesis && (
                  <p className="ml-muted">
                    Expected {decision.answer.hypothesis.direction}, {decision.answer.hypothesis.confidence} confidence
                    {decision.answer.hypothesis.note ? ` · “${decision.answer.hypothesis.note}”` : ""}
                  </p>
                )}
              </div>
            )}
            {atDecision && <Checkbox checked={showNext} onChange={setShowNext} label="Show what happened next" />}
            {!decision && <p className="ml-muted">Use the scrubber or the decision buttons. At each decision point, the chart stops exactly where your knowledge did.</p>}
            <Activity run={run} upTo={visibleTo} />
          </div>
        </aside>
      </div>
    </div>
  );
}
