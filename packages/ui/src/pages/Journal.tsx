import { useMemo, useState } from "react";
import { formatPrice } from "@market-lab/engine";
import { ERROR_TAGS } from "@market-lab/evaluation";
import { arenaContext, arenaWhatIfs, evaluateArena, evaluateRun, getArenaScenario, getMission, optionOf, runMission } from "@market-lab/missions";
import { Card, FilterChips, PageHead, Pnl, SubNav } from "../components/Page";
import { useToast } from "../components/Toast";
import { Button, Empty, Icon, Tag, TextArea, cx } from "../components/ui";
import { formatDate, formatDuration, formatPct, formatTime, money, plural } from "../format";
import { arenaDecisions } from "../journal";
import { resultRds } from "../progress";
import { Link, useRouter } from "../router";
import { useLab, useStore, type LabData, type Session } from "../store";
import { EMOTION_LABEL, EXIT_LABEL } from "./Arena";

function sessionName(s: Session): string {
  return s.kind === "mission" ? getMission(s.missionId).title : getArenaScenario(s.regime).title;
}

function decisionsCount(s: Session): number {
  return s.kind === "mission" ? s.log.length : s.log.filter((e) => e.kind === "action").length;
}

function sessionLink(s: Session): string {
  if (s.kind === "mission") return s.status === "completed" ? `/debrief/${s.id}` : s.status === "active" ? `/play/${s.id}` : `/mission/${s.missionId}`;
  return s.status === "completed" ? `/arena/session/${s.id}` : "/arena/simulator";
}

// ─── Session history ────────────────────────────────────────────────────────

export function SessionHistoryPage() {
  const lab = useLab();
  const tz = lab.settings.timeZone;
  const [kind, setKind] = useState<"all" | "mission" | "arena">("all");
  const [status, setStatus] = useState<"all" | "completed" | "active" | "abandoned">("all");
  const sessions = Object.values(lab.sessions)
    .filter((s) => s.log.length > 0 || s.status !== "abandoned")
    .sort((a, b) => (b.completedAt ?? b.updatedAt) - (a.completedAt ?? a.updatedAt));
  const shown = sessions.filter((s) => (kind === "all" || s.kind === kind) && (status === "all" || s.status === status));

  return (
    <div className="ml-page">
      <PageHead title="Session History" sub="Every mission and Arena session, with its decision quality, risk discipline and simulated outcome kept in separate columns." />
      <SubNav module="journal" />
      <div className="ml-row ml-row--between">
        <FilterChips
          label="Session type"
          value={kind}
          onChange={setKind}
          options={[
            { value: "all", label: "All", count: sessions.length },
            { value: "mission", label: "Missions", count: sessions.filter((s) => s.kind === "mission").length },
            { value: "arena", label: "Arena", count: sessions.filter((s) => s.kind === "arena").length },
          ]}
        />
        <FilterChips
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "Any status" },
            { value: "completed", label: "Completed" },
            { value: "active", label: "In progress" },
            { value: "abandoned", label: "Abandoned" },
          ]}
        />
      </div>
      {shown.length === 0 ? (
        <Empty icon="history" title={sessions.length ? "No sessions match these filters" : "No sessions yet"} action={<Link to="/missions/all" className="ml-text-link">Find a mission</Link>}>
          {sessions.length ? "Try another filter." : "Completed missions and Arena sessions are listed here."}
        </Empty>
      ) : (
        <div className="ml-table-wrap">
          <table className="ml-table ml-table--rows">
            <thead>
              <tr>
                <th scope="col">Session</th>
                <th scope="col">Date</th>
                <th scope="col" className="num">
                  Duration
                </th>
                <th scope="col">Instrument</th>
                <th scope="col" className="num">
                  Decisions
                </th>
                <th scope="col" className="num">
                  Outcome
                </th>
                <th scope="col" className="num">
                  Decision quality
                </th>
                <th scope="col" className="num">
                  Risk discipline
                </th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((s) => {
                const r = lab.results[s.id];
                const end = s.completedAt ?? s.updatedAt;
                return (
                  <tr key={s.id}>
                    <th scope="row">
                      <Link to={sessionLink(s)} className="ml-cell-link">
                        <Icon name={s.kind === "mission" ? "flag" : "candles"} size={15} />
                        <span>
                          <b>{sessionName(s)}</b>
                          <small>{s.kind === "mission" ? "Mission" : "Arena scenario"}</small>
                        </span>
                      </Link>
                    </th>
                    <td>
                      {formatDate(end, tz, { day: "numeric", month: "short" })} <span className="ml-muted">{formatTime(end, tz)}</span>
                    </td>
                    <td className="num">{formatDuration(end - s.createdAt)}</td>
                    <td>LABX</td>
                    <td className="num">{decisionsCount(s)}</td>
                    <td className="num">{r ? <Pnl value={r.net} unit={false} /> : "—"}</td>
                    <td className="num">{r?.dqs ?? "—"}</td>
                    <td className="num">{r ? (resultRds(lab, r) ?? "—") : "—"}</td>
                    <td>
                      <span className={cx("ml-status", s.status === "completed" ? "ml-status--done" : s.status === "active" ? "ml-status--active" : "ml-status--new")}>
                        {s.status === "completed" ? "Completed" : s.status === "active" ? "In progress" : "Abandoned"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="ml-fine">Outcomes are simulated with virtual money. A positive outcome does not imply a good decision.</p>
    </div>
  );
}

// ─── Decision journal ───────────────────────────────────────────────────────

function LessonNote({ noteKey, initial }: { noteKey: string; initial: string }) {
  const store = useStore();
  const toast = useToast();
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [open, setOpen] = useState(Boolean(initial));
  if (!open)
    return (
      <button type="button" className="ml-text-btn" onClick={() => setOpen(true)}>
        <Icon name="pen" size={15} /> Add a lesson learned
      </button>
    );
  return (
    <div className="ml-stack-2">
      <TextArea label="Lesson learned" rows={2} maxLength={600} value={text} onChange={setText} placeholder="What would you repeat, or do differently?" />
      {text !== saved && (
        <div className="ml-row">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              store.saveDecisionNote(noteKey, { lesson: text.trim() || undefined });
              setSaved(text);
              toast("Lesson saved");
            }}
          >
            Save
          </Button>
          <Button size="sm" variant="tertiary" onClick={() => setText(saved)}>
            Discard
          </Button>
        </div>
      )}
    </div>
  );
}

interface JournalEntry {
  key: string;
  sessionId: string;
  at: number;
  session: string;
  kind: "mission" | "arena";
  title: string;
  rationale?: string;
  emotion?: string;
  plan: { label: string; value: string }[];
  execution: string;
  noteKey: string;
}

function buildEntries(lab: LabData): JournalEntry[] {
  const out: JournalEntry[] = [];
  for (const s of Object.values(lab.sessions)) {
    if (s.status === "abandoned" && s.log.length === 0) continue;
    if (s.kind === "mission") {
      const m = getMission(s.missionId);
      let run;
      try {
        run = runMission(m, s.variantIdx, s.log);
      } catch {
        continue;
      }
      run.visited.forEach((v, i) => {
        const a = v.answer;
        if (!a) return;
        const opt = optionOf(v.def, a);
        const plan: { label: string; value: string }[] = [];
        if (a.order) {
          plan.push({ label: "Order", value: `${a.order.side === "buy" ? "Buy" : "Sell"} ${a.order.qty} ${a.order.orderType}${a.order.limitPrice ? ` @ ${formatPrice(a.order.limitPrice)}` : ""}` });
          plan.push({ label: "Intended stop", value: a.order.stopLoss !== null ? formatPrice(a.order.stopLoss) : "None" });
          plan.push({ label: "Intended exit", value: a.order.takeProfit !== null ? `Target ${formatPrice(a.order.takeProfit)}` : "No target" });
          const entry = run.entries.find((e) => e.checkpointId === v.def.id);
          if (entry) plan.push({ label: "Planned risk", value: entry.risk !== null ? `${money(entry.risk)} · ${formatPct(entry.riskPct!)}` : "Undefined, no stop" });
        }
        const fills = run.events.filter((e) => e.kind === "engine" && e.event.type === "order_filled" && e.event.step >= v.step).slice(0, 1);
        const fill = fills[0]?.kind === "engine" && fills[0].event.type === "order_filled" ? fills[0].event : null;
        out.push({
          key: `${s.id}:${i}`,
          sessionId: s.id,
          at: s.completedAt ?? s.updatedAt,
          session: m.title,
          kind: "mission",
          title: `${v.def.title}: ${opt?.label ?? (a.pickPrice !== undefined ? `marked ${formatPrice(a.pickPrice)}` : a.numeric !== undefined ? `${a.numeric} units` : "answered")}`,
          rationale: a.hypothesis ? `Expected ${a.hypothesis.direction}, ${a.hypothesis.confidence} confidence${a.hypothesis.note ? `: “${a.hypothesis.note}”` : ""}` : a.reasons.length ? `Reasons: ${a.reasons.join(", ").replace(/_/g, " ")}` : undefined,
          plan,
          execution: a.order ? (fill ? `${fill.side === "buy" ? "Bought" : "Sold"} ${fill.qty} @ ${formatPrice(fill.price)} (simulated)` : "Not filled") : "No order",
          noteKey: `${s.id}:cp${i}`,
        });
      });
    } else {
      const { ctx } = arenaContext(s.regime, s.seed);
      const scenario = getArenaScenario(s.regime);
      for (const d of arenaDecisions(ctx, s.log)) {
        const note = lab.decisionNotes[`${s.id}:${d.index}`];
        out.push({
          key: `${s.id}:${d.index}`,
          sessionId: s.id,
          at: s.completedAt ?? s.updatedAt,
          session: scenario.title,
          kind: "arena",
          title: `${d.action.side === "buy" ? "Buy" : "Sell"} ${d.action.qty} LABX ${d.action.orderType === "limit" ? `limit @ ${formatPrice(d.action.limitPrice!)}` : "at market"}`,
          rationale: note?.rationale,
          emotion: note?.emotion ? EMOTION_LABEL[note.emotion] : undefined,
          plan: [
            { label: "Planned risk", value: d.preview.risk !== null ? `${money(d.preview.risk)} · ${formatPct(d.preview.riskPct!)}` : "Undefined, no stop" },
            { label: "Intended stop", value: d.action.stopLoss != null ? formatPrice(d.action.stopLoss) : "None" },
            { label: "Intended exit", value: d.action.takeProfit != null ? `Target ${formatPrice(d.action.takeProfit)}` : note?.exitPlan ? EXIT_LABEL[note.exitPlan] : "Not set" },
          ],
          execution:
            d.status === "rejected"
              ? `Rejected: ${d.rejected}`
              : d.fill
                ? `Filled @ ${formatPrice(d.fill.price)}${d.exit ? ` · exited @ ${formatPrice(d.exit.price)} (${d.exit.reason === "stop" ? "stop-loss" : d.exit.reason === "target" ? "target" : d.exit.reason === "session_end" ? "session end" : "manual"})` : " · still open"}`
                : d.status === "cancelled"
                  ? "Cancelled before it filled"
                  : "Pending, not filled",
          noteKey: `${s.id}:${d.index}`,
        });
      }
    }
  }
  return out.sort((a, b) => b.at - a.at);
}

export function DecisionJournalPage() {
  const lab = useLab();
  const [kind, setKind] = useState<"all" | "mission" | "arena">("all");
  const entries = useMemo(() => buildEntries(lab), [lab]);
  const shown = entries.filter((e) => kind === "all" || e.kind === kind);
  const tz = lab.settings.timeZone;

  return (
    <div className="ml-page">
      <PageHead title="Decision Journal" sub="Your key decisions: the reasoning, the plan you made (risk, stop, exit) and what the simulation did with it. Add the lesson while it's fresh." />
      <SubNav module="journal" />
      <FilterChips
        label="Decision type"
        value={kind}
        onChange={setKind}
        options={[
          { value: "all", label: "All", count: entries.length },
          { value: "mission", label: "Missions", count: entries.filter((e) => e.kind === "mission").length },
          { value: "arena", label: "Arena orders", count: entries.filter((e) => e.kind === "arena").length },
        ]}
      />
      {shown.length === 0 ? (
        <Empty icon="pen" title="No decisions recorded yet" action={<Link to="/arena/simulator" className="ml-text-link">Open the Simulator</Link>}>
          Decisions from missions and Arena orders appear here. In the Arena, add your reasoning, exit plan and how you feel when you confirm an order.
        </Empty>
      ) : (
        <ol className="ml-journal">
          {shown.slice(0, 60).map((e) => {
            const lesson = lab.decisionNotes[e.noteKey]?.lesson ?? "";
            return (
              <li key={e.key} className="ml-journal-entry">
                <div className="ml-journal-meta">
                  <Tag variant="outline">{e.kind === "mission" ? "Mission" : "Arena"}</Tag>
                  <span className="ml-muted ml-small">
                    {e.session} · {formatDate(e.at, tz, { day: "numeric", month: "short" })}
                  </span>
                </div>
                <h2 className="ml-journal-title">{e.title}</h2>
                <div className="ml-journal-grid">
                  <div>
                    <span className="ml-eyebrow">Reasoning</span>
                    <p className="ml-body">{e.rationale ?? <span className="ml-muted">No rationale recorded.</span>}</p>
                    {e.emotion && <p className="ml-muted ml-small">Felt: {e.emotion}</p>}
                  </div>
                  {e.plan.length > 0 && (
                    <dl className="ml-kv ml-kv--tight">
                      {e.plan.map((p) => (
                        <div key={p.label}>
                          <dt>{p.label}</dt>
                          <dd className="num">{p.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <div>
                    <span className="ml-eyebrow">Simulated execution</span>
                    <p className="ml-body num">{e.execution}</p>
                  </div>
                </div>
                <LessonNote noteKey={e.noteKey} initial={lesson} />
                <div className="ml-row">
                  <Link to={`/journal/replay/${e.sessionId}`} className="ml-text-link ml-small">
                    Replay
                  </Link>
                  <Link to={`/journal/alternatives/${e.sessionId}`} className="ml-text-link ml-small">
                    Alternatives
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

// ─── Trade replay index ─────────────────────────────────────────────────────

function CompletedPicker({ to, empty, cta }: { to: (id: string) => string; empty: string; cta: string }) {
  const lab = useLab();
  const tz = lab.settings.timeZone;
  const done = Object.values(lab.sessions)
    .filter((s) => s.status === "completed")
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
  if (done.length === 0)
    return (
      <Empty icon="replay" title="Nothing to review yet" action={<Link to="/missions/all" className="ml-text-link">Find a mission</Link>}>
        {empty}
      </Empty>
    );
  return (
    <ul className="ml-pick-grid">
      {done.map((s) => {
        const r = lab.results[s.id];
        return (
          <li key={s.id}>
            <Link to={to(s.id)} className="ml-pick-card">
              <span className="ml-row">
                <Icon name={s.kind === "mission" ? "flag" : "candles"} size={16} />
                <b>{sessionName(s)}</b>
              </span>
              <span className="ml-muted ml-small num">
                {formatDate(s.completedAt ?? s.updatedAt, tz, { day: "numeric", month: "short" })} · {plural(decisionsCount(s), "decision")} · DQ {r?.dqs ?? "—"} · RD {r ? (resultRds(lab, r) ?? "—") : "—"}
              </span>
              <span className="ml-row-cta">
                {cta} <Icon name="arrow-right" size={14} />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ReplayIndexPage() {
  return (
    <div className="ml-page">
      <PageHead title="Trade Replay" sub="Step through a finished session candle by candle. At every decision point the chart stops exactly where your knowledge did, so you can judge the decision on what was known." />
      <SubNav module="journal" />
      <CompletedPicker to={(id) => `/journal/replay/${id}`} empty="Finish a mission or an Arena session to replay it." cta="Replay" />
    </div>
  );
}

// ─── Alternative decisions ──────────────────────────────────────────────────

const WHATIF_TRADEOFF: Record<string, string> = {
  half: "Smaller size halves both the risk and the result. Discipline scores usually rise; the outcome moves less.",
  double: "Doubling size doubles the risk per trade. It can break the risk limit even when the idea was sound.",
  tight: "Tighter stops cut the loss per trade but get hit more often by normal noise.",
  wide: "Wider stops survive more noise but double the loss when they're hit, unless the size is cut.",
  flat: "Not trading has no risk and no reward. Sometimes it's the best decision available.",
};

export function AlternativesPage({ sessionId }: { sessionId?: string }) {
  const lab = useLab();
  const { navigate } = useRouter();
  const session = sessionId ? lab.sessions[sessionId] : undefined;

  const data = useMemo(() => {
    if (!session || session.status !== "completed") return null;
    if (session.kind === "mission") {
      const run = runMission(getMission(session.missionId), session.variantIdx, session.log);
      if (run.phase !== "concluded") return null;
      const res = evaluateRun(run);
      return {
        title: run.mission.title,
        yours: { dqs: res.dqs.dqs, rds: lab.results[session.id] ? resultRds(lab, lab.results[session.id]) : null, net: res.outcome.net, dd: res.outcome.maxDrawdownPct, detail: res.decisions.join(" · ") },
        rows: res.alternatives.map((a) => ({ id: a.id, label: a.label, description: a.description, dqs: a.dqs, rds: a.rds, net: a.net, dd: a.maxDrawdownPct, tradeoff: a.decisions.join(" · ") })),
      };
    }
    const { ctx, scenario } = arenaContext(session.regime, session.seed);
    const res = evaluateArena(ctx, session.log, scenario);
    return {
      title: scenario.title,
      yours: { dqs: res.dqs.dqs, rds: res.rds, net: res.net, dd: res.maxDrawdownPct, detail: `${plural(res.trades, "trade")} · average risk ${res.avgRiskPct !== null ? formatPct(res.avgRiskPct) : "—"}` },
      rows: arenaWhatIfs(ctx, session.log, scenario).map((w) => ({ id: w.id, label: w.label, description: w.rejected ? `${w.description} Here, ${plural(w.rejected, "action")} would have been rejected by the engine.` : w.description, dqs: w.dqs, rds: w.rds, net: w.net, dd: w.maxDrawdownPct, tradeoff: WHATIF_TRADEOFF[w.id] })),
    };
  }, [session, lab]);

  return (
    <div className="ml-page">
      <PageHead
        back={sessionId ? { to: "/journal/alternatives", label: "All sessions" } : undefined}
        title={data ? `Alternatives: ${data.title}` : "Alternative Decisions"}
        sub="Compare what you did with other choices on the same market: different sizes, stops, or no trade at all. Every alternative is replayed through the same engine on the same candles."
      />
      <SubNav module="journal" />
      {!sessionId ? (
        <CompletedPicker to={(id) => `/journal/alternatives/${id}`} empty="Finish a session to compare it with the alternatives." cta="Compare" />
      ) : !data ? (
        <Empty title="This session can't be compared yet" action={<Link to="/journal/alternatives" className="ml-text-link">Pick another session</Link>}>
          Only finished sessions have alternatives.
        </Empty>
      ) : (
        <>
          <div className="ml-legendbar" role="note">
            <span>
              <i className="ml-swatch ml-swatch--known" /> Known outcome: what happened in your simulated session
            </span>
            <span>
              <i className="ml-swatch ml-swatch--hypo" /> Hypothetical: what the same market would have done with a different choice. It never happened.
            </span>
          </div>
          <div className="ml-table-wrap">
            <table className="ml-table ml-table--alts">
              <thead>
                <tr>
                  <th scope="col">Choice</th>
                  <th scope="col" className="num">
                    Decision quality
                  </th>
                  <th scope="col" className="num">
                    Risk discipline
                  </th>
                  <th scope="col" className="num">
                    Simulated outcome
                  </th>
                  <th scope="col" className="num">
                    Max drawdown
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="is-you">
                  <th scope="row">
                    <span className="ml-alt-label">
                      <Tag variant="inverse">Known</Tag> <b>Your decision</b>
                    </span>
                    <span>{data.yours.detail}</span>
                  </th>
                  <td className="num">{data.yours.dqs ?? "—"}</td>
                  <td className="num">{data.yours.rds ?? "—"}</td>
                  <td className="num">
                    <Pnl value={data.yours.net} unit={false} />
                  </td>
                  <td className="num">{formatPct(data.yours.dd)}</td>
                </tr>
                {data.rows.map((a) => (
                  <tr key={a.id}>
                    <th scope="row">
                      <span className="ml-alt-label">
                        <Tag variant="outline">Hypothetical</Tag> <b>{a.label}</b>
                      </span>
                      <span>{a.description}</span>
                      {a.tradeoff && <span className="ml-alt-trade">Trade-off: {a.tradeoff}</span>}
                    </th>
                    <td className="num">{a.dqs ?? "—"}</td>
                    <td className="num">{a.rds ?? "—"}</td>
                    <td className="num">
                      <Pnl value={a.net} unit={false} />
                    </td>
                    <td className="num">{formatPct(a.dd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Card title="How to read this">
            <ul className="ml-list">
              <li>Compare the columns separately. A hypothetical with a better outcome but worse risk discipline was luckier, not wiser.</li>
              <li>Hypotheticals use hindsight-free rules (the same change on every order), but they still can't know what you would really have done next.</li>
              <li>The question to ask: with what you knew at the time, which choice had the best process?</li>
            </ul>
            <div className="ml-actions">
              <Button variant="secondary" iconLeft="replay" onClick={() => navigate(`/journal/replay/${session!.id}`)}>
                Replay this session
              </Button>
              {session?.kind === "mission" && lab.results[session.id]?.errorTags.length ? (
                <span className="ml-muted ml-small">Patterns: {lab.results[session.id].errorTags.map((t) => ERROR_TAGS[t]?.label ?? t).join(", ")}</span>
              ) : null}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
