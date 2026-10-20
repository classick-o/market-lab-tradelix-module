import { useMemo, useState } from "react";
import { weekKey, dayKey } from "@market-lab/academy";
import { ERROR_TAGS, type EntryView } from "@market-lab/evaluation";
import { SKILLS, SKILL_BY_ID, thetaProgress } from "@market-lab/learning";
import { analyzeArena, arenaContext, getArenaScenario, getMission, runMission } from "@market-lab/missions";
import { BarList, Legend, LineChart, type LineSeries } from "../components/MiniCharts";
import { Card, PageHead, ProBadge, StatTile, SubNav } from "../components/Page";
import { useToast } from "../components/Toast";
import { Button, Empty, Icon, Segmented, cx } from "../components/ui";
import { formatDate, formatPct, plural } from "../format";
import { usePlan } from "../host";
import { resultRds } from "../progress";
import { Link, useRouter } from "../router";
import { useLab, type LabData } from "../store";

const DAY = 86_400_000;

interface Row {
  sessionId: string;
  kind: "mission" | "arena";
  name: string;
  category: string;
  at: number;
  dqs: number | null;
  rds: number | null;
  net: number;
  tags: string[];
  entries: EntryView[];
  widened: number;
}

function buildRows(lab: LabData, since: number): Row[] {
  const rows: Row[] = [];
  for (const r of Object.values(lab.results)) {
    if (r.completedAt < since) continue;
    const s = lab.sessions[r.sessionId];
    if (!s) continue;
    let entries: EntryView[] = [];
    let widened = 0;
    try {
      if (s.kind === "mission") {
        const run = runMission(getMission(s.missionId), s.variantIdx, s.log);
        entries = run.entries;
        widened = run.stopChanges.filter((c) => c.from !== null && (c.to === null || (c.side === "long" ? c.to < c.from : c.to > c.from))).length;
      } else {
        const { ctx } = arenaContext(s.regime, s.seed);
        const a = analyzeArena(ctx, s.log);
        entries = a.entries;
        widened = a.stopChanges.filter((c) => c.from !== null && (c.to === null || (c.side === "long" ? c.to < c.from : c.to > c.from))).length;
      }
    } catch {
      // A session saved by an older version that no longer replays is skipped, not fatal.
    }
    rows.push({
      sessionId: r.sessionId,
      kind: r.kind,
      name: s.kind === "mission" ? getMission(s.missionId).title : getArenaScenario(s.regime).title,
      category: s.kind === "mission" ? "Missions" : getArenaScenario(s.regime).title,
      at: r.completedAt,
      dqs: r.dqs,
      rds: resultRds(lab, r),
      net: r.net,
      tags: r.errorTags,
      entries,
      widened,
    });
  }
  return rows.sort((a, b) => a.at - b.at);
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const sd = (xs: number[]) => {
  const m = avg(xs);
  return m === null || xs.length < 2 ? null : Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
};

export function AnalyticsPage() {
  const lab = useLab();
  const toast = useToast();
  const { navigate } = useRouter();
  const { pro, limits } = usePlan();
  const [range, setRange] = useState<"30" | "90" | "all">("30");
  const tz = lab.settings.timeZone;
  const days = range === "all" ? Infinity : Number(range);
  const allowedDays = Math.min(days, limits.analyticsDays);
  const since = allowedDays === Infinity ? 0 : Date.now() - allowedDays * DAY;
  const rows = useMemo(() => buildRows(lab, since), [lab, since]);
  const [compare, setCompare] = useState<[string, string] | null>(null);

  const entries = rows.flatMap((r) => r.entries);
  const withStop = entries.filter((e) => e.stopLoss !== null).length;
  const riskPcts = entries.filter((e) => e.riskPct !== null).map((e) => e.riskPct!);
  const withinLimit = entries.filter((e) => e.riskPct !== null && e.riskPct <= 2 + 1e-9).length;
  const riskSd = sd(riskPcts);
  const dqsList = rows.filter((r) => r.dqs !== null).map((r) => r.dqs!);
  const rdsList = rows.filter((r) => r.rds !== null).map((r) => r.rds!);

  const byCategory = new Map<string, { dqs: number[]; rds: number[]; n: number }>();
  for (const r of rows) {
    const c = byCategory.get(r.category) ?? { dqs: [], rds: [], n: 0 };
    c.n++;
    if (r.dqs !== null) c.dqs.push(r.dqs);
    if (r.rds !== null) c.rds.push(r.rds);
    byCategory.set(r.category, c);
  }

  const observed = lab.observed.filter((o) => o.at >= since);
  const bySkill = SKILLS.map((s) => ({ s, scores: observed.filter((o) => o.skill === s.id).map((o) => o.score) })).filter((x) => x.scores.length);
  const byLabel = new Map<string, number[]>();
  for (const o of observed) byLabel.set(o.label, [...(byLabel.get(o.label) ?? []), o.score]);
  const labels = [...byLabel.entries()].filter(([, v]) => v.length >= 1).map(([label, v]) => ({ label, score: avg(v)!, n: v.length }));
  const strengths = [...labels].sort((a, b) => b.score - a.score).slice(0, 3);
  const weaknesses = [...labels].sort((a, b) => a.score - b.score).filter((l) => l.score < 0.8).slice(0, 3);

  const tagCounts = new Map<string, number>();
  for (const r of rows) for (const t of new Set(r.tags)) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
  const tags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const weekly = new Map<string, number[]>();
  for (const r of rows) if (r.dqs !== null) weekly.set(weekKey(dayKey(r.at, tz)), [...(weekly.get(weekKey(dayKey(r.at, tz))) ?? []), r.dqs]);
  const weeks = [...weekly.keys()].sort();

  const trend: LineSeries[] = [
    { id: "dqs", label: "Decision quality", values: rows.map((r) => r.dqs), tone: "accent" },
    { id: "rds", label: "Risk discipline", values: rows.map((r) => r.rds), tone: "blue" },
  ];

  const skillTrend: LineSeries[] = useMemo(() => {
    const hist = Object.values(lab.results)
      .sort((a, b) => a.completedAt - b.completedAt)
      .filter((r) => r.completedAt >= since);
    const tones: LineSeries["tone"][] = ["accent", "blue", "pos", "neg", "muted"];
    const ids = SKILLS.map((s) => s.id).filter((id) => hist.some((h) => h.skillDeltas.some((d) => d.skill === id)));
    return ids.slice(0, 5).map((id, i) => {
      let last: number | null = null;
      return {
        id,
        label: SKILL_BY_ID[id].name,
        tone: tones[i],
        values: hist.map((h) => {
          const d = h.skillDeltas.find((x) => x.skill === id);
          if (d) last = Math.round(thetaProgress(d.after) * 100);
          return last;
        }),
      };
    });
  }, [lab.results, since]);

  const exportReport = () => {
    const header = ["date", "session", "type", "decision_quality", "risk_discipline", "simulated_outcome_vusd", "entries", "entries_with_stop", "error_tags"];
    const lines = rows.map((r) =>
      [new Date(r.at).toISOString(), `"${r.name}"`, r.kind, r.dqs ?? "", r.rds ?? "", (r.net / 100).toFixed(2), r.entries.length, r.entries.filter((e) => e.stopLoss !== null).length, `"${r.tags.join(" ")}"`].join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `market-lab-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Learning report exported");
  };

  const cmp = compare ? compare.map((id) => rows.find((r) => r.sessionId === id)).filter((r): r is Row => Boolean(r)) : [];

  return (
    <div className="ml-page">
      <PageHead
        title="Performance Analytics"
        sub="How your process is developing: decision quality, risk discipline and consistency over time. Simulated profit is shown elsewhere and never mixed in."
        actions={
          <div className="ml-actions">
            <Segmented
              label="Period"
              size="sm"
              value={range}
              onChange={(v) => (!pro && v !== "30" ? navigate("/pricing") : setRange(v))}
              options={[
                { value: "30", label: "30 days" },
                { value: "90", label: pro ? "90 days" : "90 days · Pro" },
                { value: "all", label: pro ? "All time" : "All · Pro" },
              ]}
            />
            <Button size="sm" variant="secondary" iconLeft={pro ? "download" : "lock"} onClick={() => (pro ? exportReport() : navigate("/pricing"))}>
              Export report
            </Button>
          </div>
        }
      />
      <SubNav module="journal" />

      {rows.length === 0 ? (
        <Empty icon="bars" title="No sessions in this period" action={<Link to="/missions/all" className="ml-text-link">Start a mission</Link>}>
          Complete missions or Arena sessions and your trends will build up here.
        </Empty>
      ) : (
        <>
          <div className="ml-grid ml-grid--4">
            <StatTile label="Sessions" value={rows.length} sub={`${plural(entries.length, "entry", "entries")} analysed`} icon="history" />
            <StatTile label="Average decision quality" value={dqsList.length ? Math.round(avg(dqsList)!) : "—"} sub={`Over ${plural(dqsList.length, "scored session")}`} />
            <StatTile label="Average risk discipline" value={rdsList.length ? Math.round(avg(rdsList)!) : "—"} sub="Stops, limits, no widening" />
            <StatTile label="Stop-loss adherence" value={entries.length ? formatPct((withStop / entries.length) * 100, 0) : "—"} sub={`${withStop} of ${entries.length} entries had a stop`} />
          </div>

          <Card title="Decision quality and risk discipline" eyebrow="Per session, oldest to newest">
            <Legend items={trend.map((t) => ({ label: t.label, tone: t.tone }))} />
            <LineChart
              series={trend}
              min={0}
              max={100}
              xLabels={rows.map((r) => formatDate(r.at, tz, { day: "numeric", month: "short" }))}
              description={`Decision quality across ${rows.length} sessions averaged ${dqsList.length ? Math.round(avg(dqsList)!) : "n/a"}; risk discipline averaged ${rdsList.length ? Math.round(avg(rdsList)!) : "n/a"}.`}
            />
          </Card>

          <div className="ml-grid ml-grid--2">
            <Card title="Risk-management consistency">
              <dl className="ml-kv">
                <div>
                  <dt>Entries within a 2% risk limit</dt>
                  <dd className="num">{entries.length ? formatPct((withinLimit / entries.length) * 100, 0) : "—"}</dd>
                </div>
                <div>
                  <dt>Average risk per entry</dt>
                  <dd className="num">{riskPcts.length ? formatPct(avg(riskPcts)!) : "—"}</dd>
                </div>
                <div>
                  <dt>Variation in risk per entry</dt>
                  <dd className="num">{riskSd !== null ? `±${formatPct(riskSd)}` : "—"}</dd>
                </div>
                <div>
                  <dt>Stops widened</dt>
                  <dd className="num">{rows.reduce((s, r) => s + r.widened, 0)}</dd>
                </div>
              </dl>
              <p className="ml-fine">{riskSd !== null && riskSd < 0.3 ? "Your risk per trade is consistent." : "Consistent risk per trade makes results comparable and drawdowns predictable."}</p>
            </Card>
            <Card title="Position-sizing consistency">
              <BarList
                items={entries.slice(-12).map((e, i) => ({ label: `#${entries.length - Math.min(12, entries.length) + i + 1}`, value: e.riskPct, note: e.stopLoss === null ? "no stop" : undefined }))}
                max={Math.max(2.5, ...riskPcts)}
                format={(v) => formatPct(v)}
              />
              <p className="ml-fine">Risk per entry as % of equity, last {Math.min(12, entries.length)} entries. Even bars mean sizing from the stop.</p>
            </Card>
          </div>

          <div className="ml-grid ml-grid--2">
            <Card title="Performance by scenario type" eyebrow="Average decision quality">
              <BarList items={[...byCategory.entries()].map(([k, v]) => ({ label: k, value: avg(v.dqs), note: `${plural(v.n, "session")} · RD ${v.rds.length ? Math.round(avg(v.rds)!) : "—"}` }))} />
            </Card>
            <Card title="Performance by skill" eyebrow="Average score of observed decisions">
              {bySkill.length ? (
                <BarList items={bySkill.map(({ s, scores }) => ({ label: s.name, value: avg(scores)! * 100, note: plural(scores.length, "decision") }))} />
              ) : (
                <p className="ml-muted">Missions record which skill each decision used.</p>
              )}
            </Card>
          </div>

          <div className="ml-grid ml-grid--3">
            <Card title="Strengths">
              {strengths.length ? (
                <ul className="ml-list ml-list--check">
                  {strengths.map((s) => (
                    <li key={s.label}>
                      {s.label} <span className="ml-muted num">({Math.round(s.score * 100)})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ml-muted">Not enough decisions yet.</p>
              )}
            </Card>
            <Card title="To work on">
              {weaknesses.length ? (
                <ul className="ml-list ml-list--dash">
                  {weaknesses.map((s) => (
                    <li key={s.label}>
                      {s.label} <span className="ml-muted num">({Math.round(s.score * 100)})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ml-muted">No weak spots in this period.</p>
              )}
            </Card>
            <Card title="Common decision errors">
              {tags.length ? (
                <ul className="ml-patterns">
                  {tags.map(([t, n]) => (
                    <li key={t}>
                      <b>
                        {ERROR_TAGS[t]?.label ?? t} <span className="ml-muted num">× {n}</span>
                      </b>
                      <span className="ml-muted">{ERROR_TAGS[t]?.tip}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ml-muted">No recurring errors in this period.</p>
              )}
            </Card>
          </div>

          <Card title="Progress over time" eyebrow="Average decision quality per week">
            <BarList items={weeks.map((w) => ({ label: w.replace("-W", " · week "), value: avg(weekly.get(w)!), note: plural(weekly.get(w)!.length, "session") }))} />
          </Card>

          <Card title="Skill trends" eyebrow="Pro · how each estimate moved" action={!pro ? <ProBadge /> : undefined} className={cx(!pro && "ml-card--locked")}>
            {pro ? (
              skillTrend.length ? (
                <>
                  <Legend items={skillTrend.map((s) => ({ label: s.label, tone: s.tone }))} />
                  <LineChart series={skillTrend} min={0} max={100} description="Skill estimates after each session, on a 0 to 100 scale." />
                </>
              ) : (
                <p className="ml-muted">Skill estimates change after missions and sessions.</p>
              )
            ) : (
              <div className="ml-locked">
                <Icon name="lock" size={18} />
                <p>Detailed skill trends, longer history, session comparisons and exportable reports are part of Pro.</p>
                <Button size="sm" variant="secondary" onClick={() => navigate("/pricing")}>
                  See Pro
                </Button>
              </div>
            )}
          </Card>

          {pro && rows.length >= 2 && (
            <Card title="Compare two sessions" eyebrow="Pro">
              <div className="ml-grid-2">
                {[0, 1].map((k) => (
                  <label key={k} className="ml-select">
                    <span>Session {k + 1}</span>
                    <select
                      value={compare?.[k] ?? ""}
                      onChange={(e) => {
                        const next: [string, string] = compare ? [...compare] : [rows[rows.length - 2].sessionId, rows[rows.length - 1].sessionId];
                        next[k] = e.target.value;
                        setCompare(next);
                      }}
                    >
                      <option value="" disabled>
                        Choose…
                      </option>
                      {[...rows].reverse().map((r) => (
                        <option key={r.sessionId} value={r.sessionId}>
                          {formatDate(r.at, tz, { day: "numeric", month: "short" })} · {r.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              {cmp.length === 2 && (
                <div className="ml-table-wrap">
                  <table className="ml-table">
                    <thead>
                      <tr>
                        <th scope="col">Measure</th>
                        <th scope="col">{cmp[0].name}</th>
                        <th scope="col">{cmp[1].name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Decision quality", (r: Row) => r.dqs ?? "—"],
                        ["Risk discipline", (r: Row) => r.rds ?? "—"],
                        ["Entries", (r: Row) => r.entries.length],
                        ["Entries with a stop", (r: Row) => r.entries.filter((e) => e.stopLoss !== null).length],
                        ["Average risk", (r: Row) => (avg(r.entries.filter((e) => e.riskPct !== null).map((e) => e.riskPct!)) ?? null) === null ? "—" : formatPct(avg(r.entries.filter((e) => e.riskPct !== null).map((e) => e.riskPct!))!)],
                        ["Patterns", (r: Row) => r.tags.map((t) => ERROR_TAGS[t]?.label ?? t).join(", ") || "None"],
                      ].map(([label, f]) => (
                        <tr key={label as string}>
                          <th scope="row">{label as string}</th>
                          <td className="num">{(f as (r: Row) => string | number)(cmp[0])}</td>
                          <td className="num">{(f as (r: Row) => string | number)(cmp[1])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
          {!pro && <p className="ml-fine">Free plan: analytics cover the last 30 days.</p>}
        </>
      )}
    </div>
  );
}

