import { useCallback, useEffect, useMemo, useState } from "react";
import type { EngineEvent } from "@market-lab/engine";
import { SKILL_BY_ID } from "@market-lab/learning";
import { scoreRubric } from "@market-lab/evaluation";
import { buildProcessView, getMission, runMission, type CheckpointAnswer, type MissionEvent, type MissionRun } from "@market-lab/missions";
import { Chart } from "../components/Chart";
import { CheckpointPanel } from "../components/CheckpointPanel";
import type { TicketValue } from "../components/OrderTicket";
import { PlaybackControls, usePlayback, usePlaybackKeys } from "../components/Playback";
import { ChartTitle, Hud, StageBar, useChartHeight } from "../components/Stage";
import { Button, Dialog, Empty, Icon, Tag, cx } from "../components/ui";
import { draftLines, linesFromFrame, linesFromHighlight, markersFrom } from "../components/visuals";
import { DIFFICULTY_LABEL, formatPrice, formatSigned } from "../format";
import { Link, useRouter } from "../router";
import { useLab, useStore, type MissionSession } from "../store";

function describeEvent(e: MissionEvent, symbol: string): string | null {
  if (e.kind === "note") return e.text;
  if (e.kind === "checkpoint") return `Decision point: ${e.title}`;
  const ev: EngineEvent = e.event;
  switch (ev.type) {
    case "order_filled": {
      const why = ev.reason === "stop" ? " · stop-loss" : ev.reason === "target" ? " · target" : ev.reason === "session_end" ? " · scenario end" : ev.reason === "limit" ? " · limit" : "";
      return `${ev.side === "buy" ? "Bought" : "Sold"} ${ev.qty} ${symbol} at ${formatPrice(ev.price)}${why}`;
    }
    case "order_submitted":
      return ev.orderType === "limit" ? `Limit order placed at ${formatPrice(ev.limitPrice!)}` : null;
    case "brackets_modified":
      return `Stop moved to ${ev.stopLoss !== null ? formatPrice(ev.stopLoss) : "none"}`;
    case "position_closed":
      return `Position closed · ${formatSigned(ev.realized)} before fees`;
    default:
      return null;
  }
}

export function Activity({ run, upTo }: { run: MissionRun; upTo: number }) {
  const items = run.events
    .filter((e) => e.step <= upTo)
    .map((e) => ({ step: e.step, text: describeEvent(e, run.ctx.cfg.symbol) }))
    .filter((x): x is { step: number; text: string } => x.text !== null)
    .slice(-5)
    .reverse();
  if (items.length === 0) return null;
  return (
    <ol className="ml-activity" aria-label="Activity">
      {items.map((it, i) => (
        <li key={`${it.step}-${i}`}>
          <span className="ml-activity-step num">#{it.step}</span>
          <span>{it.text}</span>
        </li>
      ))}
    </ol>
  );
}

export function PlayPage({ sessionId }: { sessionId: string }) {
  const lab = useLab();
  const session = lab.sessions[sessionId];
  if (!session || session.kind !== "mission") {
    return (
      <Empty title="This mission isn't on this device" action={<Link to="/missions/all" className="ml-text-link">Browse missions</Link>}>
        Sessions are saved in this browser. It may have been deleted, or started somewhere else.
      </Empty>
    );
  }
  return <Player key={session.id} session={session} speed={lab.settings.speed} />;
}

function Player({ session, speed }: { session: MissionSession; speed: number }) {
  const store = useStore();
  const { navigate } = useRouter();
  const mission = getMission(session.missionId);
  const run = useMemo(() => runMission(mission, session.variantIdx, session.log), [mission, session.variantIdx, session.log]);
  const pb = usePlayback(run.step, run.step, speed);
  const [briefed, setBriefed] = useState(session.log.length > 0 || session.status !== "active");
  const [picked, setPicked] = useState<number | null>(null);
  const [draft, setDraft] = useState<TicketValue | null>(null);
  const [briefOpen, setBriefOpen] = useState(false);
  const chartHeight = useChartHeight();
  const onDraft = useCallback((t: TicketValue | null) => setDraft(t), []);

  useEffect(() => setPicked(null), [run.current?.def.id, run.current?.step]);

  const display = Math.min(pb.display, run.step);
  const caughtUp = display >= run.step;
  const frame = run.frames[display] ?? run.frames[run.step];
  const engineEvents = useMemo(() => run.events.flatMap((e) => (e.kind === "engine" ? [e.event] : [])), [run.events]);
  const atDecision = briefed && caughtUp && run.phase === "checkpoint" && run.current !== null && !run.error;
  const concluded = caughtUp && run.phase === "concluded";
  const highlight = atDecision ? run.current!.def.highlight?.(run.current!.facts) : undefined;
  const pickMode = atDecision && run.current!.def.kind === "pick";
  const pnl = frame.equity - mission.equity;
  const pos = frame.position;

  usePlaybackKeys(briefed && !run.error && !caughtUp, { toggle: () => (pb.playing ? pb.pause() : pb.play()), step: pb.step });

  const commit = (answer: CheckpointAnswer) => {
    store.answer(session.id, { checkpointId: run.current!.def.id, answer });
    setDraft(null);
    pb.play();
  };
  const finish = () => {
    store.completeMission(session.id);
    navigate(`/debrief/${session.id}`);
  };

  // Immediate feedback on the latest decision: process criteria only, judged on what was known when deciding.
  const feedback = useMemo(() => {
    const v = run.visited[run.visited.length - 1];
    if (!v || !v.answer) return [];
    const defs = run.mission.rubric(run.facts);
    const res = scoreRubric(defs, buildProcessView(run));
    const ENTRY = new Set(["invalidation_before_entry", "risk_within_limit", "stop_beyond_level", "size_matches_risk", "hypothesis_stated", "followed_rules"]);
    return res.criteria.filter((c) => {
      const cp = (defs.find((d) => d.id === c.id)?.params as { checkpoint?: string } | undefined)?.checkpoint;
      return c.applicable && (cp === v.def.id || (Boolean(v.answer!.order) && ENTRY.has(c.evaluator)));
    });
  }, [run]);

  const dockKey = run.error ? "error" : !briefed ? "brief" : atDecision ? `cp-${run.current!.def.id}-${run.current!.step}` : concluded ? "done" : "watch";

  return (
    <div className="ml-stage">
      <StageBar back={{ to: `/mission/${mission.id}`, label: "Mission" }} eyebrow={`${mission.id} · ${SKILL_BY_ID[mission.skillPrimary].name}`} title={mission.title}>
        <Tag variant="outline">{DIFFICULTY_LABEL[mission.difficulty]}</Tag>
        <Tag variant="outline">Synthetic data</Tag>
        <Button size="sm" variant="tertiary" iconLeft="info" onClick={() => setBriefOpen(true)}>
          Brief
        </Button>
      </StageBar>

      <div className="ml-stage-grid">
        <section className="ml-stage-main" aria-label="Market">
          <div className="ml-panel ml-chart-panel">
            <Chart
              title={<ChartTitle symbol={mission.symbol} meta="/ vUSD · 1H" />}
              candles={run.ctx.candles}
              visibleTo={display}
              fixedEnd={run.endStep}
              height={chartHeight}
              label={`${mission.symbol} price chart`}
              highlightCandle={highlight?.candle}
              zone={highlight?.zone}
              lines={[...linesFromFrame(frame), ...linesFromHighlight(highlight), ...draftLines(atDecision ? draft : null)]}
              markers={markersFrom(engineEvents, display)}
              decisionSteps={run.visited.map((v, i) => ({ step: v.step, label: `D${i + 1}` }))}
              pickMode={pickMode}
              picked={pickMode ? picked : null}
              onPick={(price) => setPicked(price)}
              tickMs={pb.playing ? 1000 / speed : undefined}
              animateNewest={pb.playing}
            />
            <PlaybackControls
              playing={pb.playing}
              onPlay={pb.play}
              onPause={pb.pause}
              onStep={pb.step}
              onSkip={pb.skip}
              skipLabel={run.phase === "concluded" ? "Skip to the end" : "Skip to decision"}
              speed={speed}
              onSpeed={(s) => store.setSettings({ speed: s })}
              canAdvance={!caughtUp && briefed}
              progress={(display - run.startStep) / Math.max(1, run.endStep - run.startStep)}
            />
          </div>
          <Hud
            label="Virtual account"
            items={[
              { label: "Equity", value: formatPrice(frame.equity) },
              { label: "P&L", value: formatSigned(pnl) },
              { label: "Position", value: pos ? `${pos.side === "long" ? "Long" : "Short"} ${pos.qty} @ ${formatPrice(pos.avgEntry)}` : "Flat", wide: true },
              { label: "Stop", value: pos?.stopLoss != null ? formatPrice(pos.stopLoss) : "—" },
              { label: "Target", value: pos?.takeProfit != null ? formatPrice(pos.takeProfit) : "—" },
              { label: "Fees", value: formatPrice(frame.fees) },
            ]}
          />
        </section>

        <aside className="ml-dock" aria-label="Decision panel" key={dockKey}>
          {run.error ? (
            <div className="ml-dock-body ml-enter-up">
              <header className="ml-dock-head">
                <span className="ml-eyebrow">Something went wrong</span>
                <h2 className="ml-dock-title">This session can't continue</h2>
                <p className="ml-dock-prompt">{run.error}</p>
              </header>
              <Button variant="primary" block onClick={() => navigate(`/play/${store.startMission(mission.id, { fresh: true })}`)}>
                Start the mission again
              </Button>
            </div>
          ) : !briefed ? (
            <>
              <div className="ml-dock-body ml-enter-up">
                <header className="ml-dock-head">
                  <span className="ml-eyebrow">Briefing</span>
                  <h2 className="ml-dock-title">{mission.objective}</h2>
                </header>
                <p className="ml-body">{mission.briefing}</p>
                {mission.setupText && <p className="ml-callout">{mission.setupText}</p>}
                <ul className="ml-list">
                  {mission.rulesText.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="ml-dock-foot">
                <Button variant="primary" size="lg" block iconRight="arrow-right" onClick={() => setBriefed(true)}>
                  Begin
                </Button>
              </div>
            </>
          ) : atDecision ? (
            <CheckpointPanel run={run} number={run.visited.length + 1} picked={picked} onClearPick={() => setPicked(null)} onCommit={commit} onDraft={onDraft} />
          ) : concluded ? (
            <>
              <div className="ml-dock-body ml-enter-up">
                <header className="ml-dock-head">
                  <span className="ml-eyebrow">Scenario complete</span>
                  <h2 className="ml-dock-title">The market has played out.</h2>
                </header>
                <div className="ml-outcome-line">
                  <span>Simulated result</span>
                  <b className="num">{formatSigned(pnl)} vUSD</b>
                </div>
                <p className="ml-body ml-muted">That's only half the story. The debrief separates what happened from how well you decided.</p>
                <Activity run={run} upTo={display} />
              </div>
              <div className="ml-dock-foot">
                <Button variant="primary" size="lg" block iconRight="arrow-right" onClick={finish}>
                  See your debrief
                </Button>
              </div>
            </>
          ) : (
            <div className="ml-dock-body ml-enter-up">
              <header className="ml-dock-head">
                <span className="ml-eyebrow">{run.phase === "concluded" ? "Playing out" : "Watching the market"}</span>
                <h2 className="ml-dock-title">
                  <span className="num">{run.step - display}</span> {run.step - display === 1 ? "candle" : "candles"} {run.phase === "concluded" ? "to the end" : "to your next decision"}
                </h2>
              </header>
              <p className="ml-body ml-muted">
                {run.phase === "concluded"
                  ? "Your decisions are locked in. Watch how they play out against a future you couldn't see."
                  : "Nothing to do yet. Take in how price behaves before the next decision."}
              </p>
              {feedback.length > 0 && (
                <section className="ml-feedback" aria-label="Feedback on your last decision">
                  <span className="ml-eyebrow">Feedback on D{run.visited.length}</span>
                  <ul>
                    {feedback.map((c) => (
                      <li key={c.id} className={cx(c.score >= 0.8 ? "is-good" : c.score < 0.5 ? "is-bad" : "is-mid")}>
                        <Icon name={c.score >= 0.8 ? "check-circle" : c.score < 0.5 ? "alert" : "info"} size={16} />
                        <span>
                          <b>{c.label}.</b> {c.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="ml-fine">Judged on what you knew when you decided, not on what the market does next.</p>
                </section>
              )}
              {!pb.playing && (
                <Button variant="secondary" iconLeft="play" onClick={pb.play}>
                  Continue
                </Button>
              )}
              <Activity run={run} upTo={display} />
            </div>
          )}
        </aside>
      </div>

      <Dialog open={briefOpen} onClose={() => setBriefOpen(false)} title="Mission brief" variant="sheet">
        <div className="ml-stack-5">
          <div className="ml-stack-2">
            <span className="ml-eyebrow">Objective</span>
            <p className="ml-lead">{mission.objective}</p>
          </div>
          <p className="ml-body">{mission.briefing}</p>
          {mission.setupText && <p className="ml-callout">{mission.setupText}</p>}
          <div className="ml-stack-2">
            <span className="ml-eyebrow">Rules</span>
            <ul className="ml-list">
              {mission.rulesText.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div className="ml-stack-2">
            <span className="ml-eyebrow">Reading the chart</span>
            <ul className="ml-legend">
              <li>
                <span className={cx("ml-legend-swatch", "is-up")} /> Light candle: closed above its open
              </li>
              <li>
                <span className={cx("ml-legend-swatch", "is-down")} /> Dark candle: closed below its open
              </li>
              <li>
                <span className="ml-legend-line is-stop" /> Stop-loss · <span className="ml-legend-line is-target" /> Target
              </li>
              <li>
                <span className="ml-legend-veil" /> Unknown: the future, revealed only after you decide
              </li>
            </ul>
          </div>
          <p className="ml-fine">
            <Icon name="info" size={14} /> Synthetic market data. Virtual money only.
          </p>
        </div>
      </Dialog>
    </div>
  );
}
