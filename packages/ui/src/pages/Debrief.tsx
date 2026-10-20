import { useEffect, useMemo, useState } from "react";
import { ERROR_TAGS, riskDisciplineScore } from "@market-lab/evaluation";
import { LEVEL_LABEL, SKILL_BY_ID, levelOf, recommend } from "@market-lab/learning";
import { LEARNING_PATH, MISSIONS, evaluateRun, getMission, missionMeta, runMission } from "@market-lab/missions";
import { Chart } from "../components/Chart";
import { useChartHeight } from "../components/Stage";
import { useToast } from "../components/Toast";
import { Pnl } from "../components/Page";
import { Button, Chips, Empty, Icon, Meter, ScoreRing, Tag, TextArea, cx } from "../components/ui";
import { markersFrom } from "../components/visuals";
import { bandLabel, formatPct, formatPrice, formatSigned } from "../format";
import { Link, useRouter } from "../router";
import { missionHistory, useLab, useStore } from "../store";

export function DebriefPage({ sessionId }: { sessionId: string }) {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const { navigate } = useRouter();
  const session = lab.sessions[sessionId];
  const chartHeight = Math.min(320, useChartHeight());

  const data = useMemo(() => {
    if (!session || session.kind !== "mission") return null;
    const mission = getMission(session.missionId);
    const run = runMission(mission, session.variantIdx, session.log);
    return { mission, run, result: run.phase === "concluded" ? evaluateRun(run) : null };
  }, [session]);

  const reflection = lab.reflections[sessionId];
  const [refOption, setRefOption] = useState<string | undefined>(reflection?.optionId);
  const [refText, setRefText] = useState(reflection?.text ?? "");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (session?.kind === "mission" && session.status === "active" && data?.run.phase === "concluded") store.completeMission(sessionId);
  }, [session, data, store, sessionId]);

  if (!session || session.kind !== "mission" || !data) {
    return <Empty title="Debrief not found" action={<Link to="/missions/all" className="ml-text-link">Browse missions</Link>} />;
  }
  const { mission, run, result } = data;
  if (!result) {
    return (
      <Empty title="This mission isn't finished yet" action={<Link to={`/play/${sessionId}`} className="ml-text-link">Continue the mission</Link>}>
        The debrief appears once the scenario has played out.
      </Empty>
    );
  }

  const stored = lab.results[sessionId];
  const engineEvents = run.events.flatMap((e) => (e.kind === "engine" ? [e.event] : []));
  const dqs = result.dqs.dqs;
  const rds = riskDisciplineScore(result.dqs.criteria);
  const revisit = result.dqs.criteria.filter((c) => c.applicable && c.score < 0.5);
  const o = result.outcome;
  const goodLuck = dqs !== null && dqs < 50 && o.net > 0;
  const badLuck = dqs !== null && dqs >= 75 && o.net < 0;
  const rec = recommend({ missions: MISSIONS.map(missionMeta), skills: lab.skills, history: missionHistory(lab), path: LEARNING_PATH, now: Date.now() });
  const nextId = rec.primary?.missionId !== mission.id ? rec.primary?.missionId : rec.slots.find((s) => s.missionId && s.missionId !== mission.id)?.missionId;
  const verdict = goodLuck
    ? "You made money with a weak process. That's luck, and luck doesn't repeat on purpose."
    : badLuck
      ? "Good decision, unlucky outcome. A sound process still loses sometimes, and that's fine."
      : "Scored separately on purpose: a good decision can lose money, and a bad one can get lucky.";

  return (
    <article className="ml-page ml-report">
      <header className="ml-page-head">
        <Link to={`/mission/${mission.id}`} className="ml-back">
          <Icon name="arrow-left" size={18} />
          <span>{mission.title}</span>
        </Link>
        <span className="ml-eyebrow">
          Debrief · {mission.id} · {SKILL_BY_ID[mission.skillPrimary].name}
        </span>
        <h1>{mission.title}</h1>
        <p className="ml-page-sub">
          This market: {result.variantLabel.toLowerCase()}. <Tag variant="outline">Synthetic data</Tag>
        </p>
      </header>

      <section className="ml-scores3" aria-label="Results, scored separately">
        <div className="ml-score3">
          <ScoreRing value={dqs} size={88} label="Decision quality" />
          <div>
            <span className="ml-eyebrow">Decision quality</span>
            <b>{bandLabel(dqs)}</b>
            <p className="ml-muted">How sound your reasoning was with what you knew at the time. Profit isn't part of it.</p>
          </div>
        </div>
        <div className="ml-score3">
          <ScoreRing value={rds} size={88} label="Risk discipline" />
          <div>
            <span className="ml-eyebrow">Risk discipline</span>
            <b>{rds === null ? "No risk taken" : bandLabel(rds)}</b>
            <p className="ml-muted">Whether you respected the limits: a stop, risk within the rule, sizing from the stop.</p>
          </div>
        </div>
        <div className="ml-score3 ml-score3--outcome">
          <span className="ml-eyebrow">Simulated outcome</span>
          {o.hasTrades ? (
            <>
              <span className="ml-score-big">
                <Pnl value={o.net} />
              </span>
              <span className="ml-score-meta num">
                {formatPct(o.returnPct, 2, true)} · fees {formatPrice(o.fees)} · max drawdown {formatPct(o.maxDrawdownPct)}
                {o.trades[0]?.rMultiple != null ? ` · ${o.trades[0].rMultiple.toFixed(2)}R` : ""}
              </span>
            </>
          ) : (
            <>
              <span className="ml-score-big">No trades</span>
              <span className="ml-score-meta">{mission.alternatives.length === 0 ? "This mission is about reading the market, not trading it." : "You stayed out. Your account is unchanged."}</span>
            </>
          )}
        </div>
      </section>
      <p className={cx("ml-verdict", (goodLuck || badLuck) && "is-strong")}>{verdict}</p>

      <section className="ml-section">
        <div className="ml-section-head">
          <h2>What you decided</h2>
        </div>
        <ol className="ml-decisions">
          {result.decisions.map((d, i) => (
            <li key={d}>
              <span className="ml-decision-n num">D{i + 1}</span>
              {d}
            </li>
          ))}
        </ol>
        <div className="ml-panel ml-chart-panel">
          <Chart
            title={<span className="ml-chart-symbol">Full scenario</span>}
            candles={run.ctx.candles}
            visibleTo={run.endStep}
            fixedEnd={run.endStep}
            height={chartHeight}
            label={`${mission.symbol} full scenario`}
            markers={markersFrom(engineEvents, run.endStep)}
            decisionSteps={run.visited.map((v, i) => ({ step: v.step, label: `D${i + 1}` }))}
            revealedAfter={run.visited[0]?.step}
            highlightCandle={mission.id === "M01" ? mission.startStep : undefined}
          />
        </div>
        <p className="ml-fine">Shaded: what was revealed after your first decision. None of it was available when you decided.</p>
      </section>

      <section className="ml-section">
        <div className="ml-section-head">
          <h2>How the score was built</h2>
          <p className="ml-section-sub">Each criterion is weighted. Criteria that didn't apply to your path don't count against you.</p>
        </div>
        <ul className="ml-criteria">
          {result.dqs.criteria.map((c) => (
            <li key={c.id} className={cx(!c.applicable && "is-na")}>
              <div className="ml-criteria-head">
                <span className="ml-criteria-label">{c.label}</span>
                <span className="ml-criteria-meta">
                  {SKILL_BY_ID[c.skill].name} · weight {c.weight}
                </span>
                <span className="ml-criteria-score num">{c.applicable ? `${Math.round(c.score * 100)}` : "n/a"}</span>
              </div>
              {c.applicable && <Meter value={c.score} label={c.label} muted={c.score < 0.5} />}
              <p>{c.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="ml-columns">
        <div className="ml-stack-4">
          <h3 className="ml-h3">Keep doing</h3>
          {result.feedback.worked.length ? (
            <ul className="ml-list ml-list--check">
              {result.feedback.worked.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          ) : (
            <p className="ml-muted">Nothing stood out this time. Every attempt is a data point.</p>
          )}
        </div>
        <div className="ml-stack-4">
          <h3 className="ml-h3">Work on</h3>
          {result.feedback.improve.length ? (
            <ul className="ml-list ml-list--dash">
              {result.feedback.improve.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          ) : (
            <p className="ml-muted">No weak spots in this run.</p>
          )}
          {result.dqs.errorTags.length > 0 && (
            <div className="ml-tags">
              {result.dqs.errorTags.map((t) => (
                <Tag key={t} variant="outline">
                  {ERROR_TAGS[t]?.label ?? t}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="ml-columns">
        <div className="ml-stack-4">
          <h3 className="ml-h3">Key learning points</h3>
          <ul className="ml-patterns">
            <li>
              <b>{mission.objective}</b>
              <span className="ml-muted">The objective of this mission.</span>
            </li>
            {result.dqs.errorTags.map((t) => (
              <li key={t}>
                <b>{ERROR_TAGS[t]?.label ?? t}</b>
                <span className="ml-muted">{ERROR_TAGS[t]?.tip}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ml-stack-4">
          <h3 className="ml-h3">Decisions to revisit</h3>
          {revisit.length ? (
            <ul className="ml-list ml-list--dash">
              {revisit.map((c) => (
                <li key={c.id}>
                  <b>{c.label}.</b> {c.detail}
                </li>
              ))}
            </ul>
          ) : (
            <p className="ml-muted">No decision scored below half. Replay it anyway to see what you knew at each point.</p>
          )}
          <Link to={`/journal/replay/${sessionId}`} className="ml-text-link">
            Open the replay
          </Link>
        </div>
      </section>

      {result.alternatives.length > 0 && (
        <section className="ml-section">
          <div className="ml-section-head">
            <h2>Other ways to play it</h2>
            <p className="ml-section-sub">Same market, same data, run through the same engine. Compare the two columns: they don't always agree.</p>
          </div>
          <div className="ml-table-wrap">
            <table className="ml-table">
              <thead>
                <tr>
                  <th scope="col">Approach</th>
                  <th scope="col" className="num">
                    Decision quality
                  </th>
                  <th scope="col" className="num">
                    Simulated result
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="is-you">
                  <th scope="row">
                    <b>Your decision</b>
                    <span>{result.decisions.join(" · ")}</span>
                  </th>
                  <td className="num">{dqs ?? "—"}</td>
                  <td className="num">{formatSigned(o.net)}</td>
                </tr>
                {result.alternatives.map((a) => (
                  <tr key={a.id}>
                    <th scope="row">
                      <b>{a.label}</b>
                      <span>{a.description}</span>
                    </th>
                    <td className="num">{a.dqs ?? "—"}</td>
                    <td className="num">{formatSigned(a.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="ml-columns ml-columns--rule">
        <div className="ml-stack-4">
          <h3 className="ml-h3">Reflect</h3>
          <p className="ml-body">{mission.reflection.question}</p>
          <Chips
            single
            label="Reflection"
            options={mission.reflection.options}
            selected={refOption ? [refOption] : []}
            onToggle={(id) => {
              setRefOption(id === refOption ? undefined : id);
              setDirty(true);
            }}
          />
          <TextArea
            label="In your own words"
            hint="Optional and private to this device."
            rows={3}
            maxLength={1000}
            value={refText}
            onChange={(v) => {
              setRefText(v);
              setDirty(true);
            }}
          />
          <div className="ml-row">
            <Button
              variant="secondary"
              disabled={(!refOption && !refText.trim()) || (!dirty && Boolean(reflection))}
              onClick={() => {
                store.saveReflection(sessionId, refOption, refText.trim());
                setDirty(false);
                toast(reflection ? "Reflection updated" : "Reflection saved to your journal · +20 XP");
              }}
            >
              {reflection && !dirty ? "Saved to journal" : "Save to journal"}
            </Button>
          </div>
        </div>
        <div className="ml-stack-4">
          <h3 className="ml-h3">Your progress</h3>
          {stored?.skillDeltas.length ? (
            <ul className="ml-deltas">
              {stored.skillDeltas.map((d) => {
                const delta = d.after - d.before;
                return (
                  <li key={d.skill}>
                    <span>{SKILL_BY_ID[d.skill].name}</span>
                    <span className="num">
                      {delta >= 0 ? "+" : "−"}
                      {Math.abs(delta).toFixed(2)}
                    </span>
                    <span className="ml-muted">{LEVEL_LABEL[levelOf(d.after)]}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="ml-muted">Skill estimates update when the mission is completed.</p>
          )}
          {stored && stored.xp > 0 && <p className="ml-fine num">+{stored.xp} XP</p>}
          <div className="ml-actions">
            {nextId && (
              <Button variant="primary" iconRight="arrow-right" onClick={() => navigate(`/play/${store.startMission(nextId)}`)}>
                Next: {getMission(nextId).title}
              </Button>
            )}
            <Button variant="secondary" iconLeft="replay" onClick={() => navigate(`/play/${store.startMission(mission.id, { fresh: true })}`)}>
              Try a new market
            </Button>
            <Button variant="tertiary" iconLeft="eye" onClick={() => navigate(`/journal/replay/${sessionId}`)}>
              Replay
            </Button>
            <Button variant="tertiary" iconLeft="split" onClick={() => navigate(`/journal/alternatives/${sessionId}`)}>
              Alternatives
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
