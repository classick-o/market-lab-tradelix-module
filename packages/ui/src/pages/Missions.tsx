import { useMemo, useState } from "react";
import {
  CONCEPTS,
  DAILY_XP,
  KNOWLEDGE_CHECKS,
  LESSONS,
  QUESTIONS,
  TOPICS,
  TOPIC_BY_ID,
  WEEKLY_XP,
  addDays,
  assessmentId,
  dailyChallenge,
  dayKey,
  gradeChallengeItem,
  missionTopics,
  weekKey,
  weeklyChallenge,
  weeklyProgress,
  type ChallengeItem,
  type TopicId,
} from "@market-lab/academy";
import { ERROR_TAGS, type SkillId } from "@market-lab/evaluation";
import { LEVEL_LABEL, SKILLS, SKILL_BY_ID, XP_RULES, confidenceOf, levelOf, missingPrerequisites, recommend, type Recommendation } from "@market-lab/learning";
import { LEARNING_PATH, MISSIONS, getMission, missionMeta, type MissionDef } from "@market-lab/missions";
import { DifficultyCandles, LearningIllustration, missionGlyph } from "../components/Art";
import { Card, FilterChips, MiniRing, PageHead, Pnl, SubNav } from "../components/Page";
import { useToast } from "../components/Toast";
import { Button, Empty, Icon, InlineError, Meter, Note, TextField, cx } from "../components/ui";
import { DIFFICULTY_LABEL, formatDate, formatDayKey, formatWeekRange, plural, relativeTime } from "../format";
import { resultRds, useProgress } from "../progress";
import { Link, useRouter } from "../router";
import { missionHistory, useLab, useStore, type LabData } from "../store";

const SLOT_TITLE: Record<Recommendation["slot"], string> = {
  recommended: "Recommended",
  continue: "Continue your path",
  practice: "Practise a skill",
  harder: "Try something harder",
  review: "Review a decision",
};

function Dots({ n }: { n: number }) {
  return (
    <span className="ml-dots" role="img" aria-label={`Difficulty ${n} of 5`}>
      <DifficultyCandles level={n} />
    </span>
  );
}

function attemptsOf(lab: LabData, missionId: string) {
  return Object.values(lab.results).filter((r) => r.kind === "mission" && r.missionId === missionId);
}

function bestOf(lab: LabData, missionId: string): number | null {
  return attemptsOf(lab, missionId).reduce<number | null>((b, r) => (r.dqs !== null && (b === null || r.dqs > b) ? r.dqs : b), null);
}

/** Whole vUSD with thousands separators ("10,000"). */
function wholeVusd(cents: number): string {
  return Math.round(cents / 100).toLocaleString("en-US");
}

/** The design's "spotlight": a recommended mission with its risk budget on a ticket. */
function MissionSpotlight({ mission: m, reason, onStart, resume, eyebrow = "Recommended for you", note }: { mission: MissionDef; reason?: string; onStart: () => void; resume: boolean; eyebrow?: string; note?: string }) {
  const { navigate } = useRouter();
  const topic = missionTopics(m.id)[0];
  const pct = m.rules.maxRiskPct ?? 1;
  return (
    <section className="ml-spotlight" aria-label={eyebrow}>
      <div className="ml-spotlight-copy">
        <span className="ml-spotlight-eyebrow">{eyebrow}</span>
        <h2>{m.title}</h2>
        <p>{m.tagline}</p>
        <div className="ml-spotlight-meta">
          <span>
            <Icon name={missionGlyph(topic)} size={14} />
            {topic ? TOPIC_BY_ID[topic].name : SKILL_BY_ID[m.skillPrimary].name}
          </span>
          <span>
            <Icon name="clock" size={14} />
            {m.estMinutes} min
          </span>
          {note && <span>{note}</span>}
          <span className="ml-accent-text num">+{XP_RULES.missionByDifficulty[m.difficulty]} XP</span>
        </div>
        {reason && (
          <p className="ml-spotlight-why">
            <Icon name="bolt" size={13} />
            <span>
              <strong>Why this mission?</strong> {reason}
            </span>
          </p>
        )}
        <div className="ml-actions">
          <Button variant="primary" iconRight="arrow-right" onClick={onStart}>
            {resume ? "Resume mission" : "Start mission"}
          </Button>
          <Button variant="tertiary" onClick={() => navigate(`/mission/${m.id}`)}>
            Details
          </Button>
        </div>
      </div>
      <div className="ml-spotlight-visual">
        <div className="ml-spotlight-chart" aria-hidden="true">
          <LearningIllustration variant={1} />
        </div>
        <div className="ml-risk-ticket" role="group" aria-label="Risk budget for this mission">
          <span>Risk budget</span>
          <strong className="num">
            {pct.toFixed(2)}
            <small>%</small>
          </strong>
          <div>
            <span>Account</span>
            <b className="num">{wholeVusd(m.equity)} vUSD</b>
          </div>
          <div>
            <span>Max. loss</span>
            <b className="num">{wholeVusd((m.equity * pct) / 100)} vUSD</b>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A mission in the deck: id, topic, reward, symbol, objective, difficulty candles and the call to action. */
function MissionTile({ mission: m, lab }: { mission: MissionDef; lab: LabData }) {
  const store = useStore();
  const { navigate } = useRouter();
  const attempts = attemptsOf(lab, m.id);
  const best = bestOf(lab, m.id);
  const missing = missingPrerequisites(missionMeta(m), lab.skills);
  const st = store.activeSessionFor(m.id) ? "active" : attempts.length ? "done" : "new";
  const topic = missionTopics(m.id)[0];
  const cta = st === "active" ? "Resume" : st === "done" ? "Play again" : missing.length ? "Try anyway" : "Start mission";
  return (
    <article className={cx("ml-mtile", missing.length > 0 && "is-locked")}>
      <div className="ml-mtile-head">
        <span className="num">{m.id}</span>
        <span className="ml-mtile-cat">{topic ? TOPIC_BY_ID[topic].name : SKILL_BY_ID[m.skillPrimary].name}</span>
        <span className="ml-mtile-reward num">+{XP_RULES.missionByDifficulty[m.difficulty]} XP</span>
      </div>
      <div className="ml-mtile-body">
        <span className="ml-mtile-symbol" aria-hidden="true">
          <Icon name={missionGlyph(topic)} size={30} />
          <i />
        </span>
        <div>
          <h3>
            <Link to={`/mission/${m.id}`}>{m.title}</Link>
          </h3>
          <p>{m.objective}</p>
          {missing.length > 0 && (
            <p className="ml-mtile-lock">
              <Icon name="lock" size={13} />
              Unlocks when {missing.map((p) => `${SKILL_BY_ID[p.skill].name} reaches ${LEVEL_LABEL[p.level]}`).join(" and ")}. You can still try it.
            </p>
          )}
        </div>
      </div>
      <div className="ml-mtile-foot">
        <span className="ml-mtile-level">
          <DifficultyCandles level={m.difficulty} />
          {DIFFICULTY_LABEL[m.difficulty]}
        </span>
        <span className="ml-mtile-time">
          <Icon name="clock" size={13} />
          {m.estMinutes} min
        </span>
        {st !== "new" && (
          <span className={cx("ml-status", `ml-status--${st}`)}>
            {st === "active" ? "In progress" : `Best ${best ?? "—"}${attempts.length > 1 ? ` · ${plural(attempts.length, "attempt")}` : ""}`}
          </span>
        )}
        <button type="button" className="ml-mtile-cta" onClick={() => navigate(`/play/${store.startMission(m.id)}`)} aria-label={`${cta}: ${m.title}`}>
          {cta}
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </article>
  );
}

function SafetyNote() {
  return (
    <p className="ml-safety">
      <Icon name="shield" size={14} />
      Synthetic markets. Virtual money. Scored on decisions, not profit.
    </p>
  );
}

// ─── For You ────────────────────────────────────────────────────────────────

export function ForYouPage() {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const history = missionHistory(lab);
  const rec = recommend({ missions: MISSIONS.map(missionMeta), skills: lab.skills, history, path: LEARNING_PATH, now: Date.now() });
  const primary = rec.primary?.missionId ? getMission(rec.primary.missionId) : null;
  const active = Object.values(lab.sessions)
    .filter((s) => s.kind === "mission" && s.status === "active")
    .sort((a, b) => b.updatedAt - a.updatedAt);
  const skillIds = SKILLS.map((s) => s.id).filter((id) => MISSIONS.some((m) => m.skillPrimary === id || m.skillsSecondary.includes(id)));
  const gaps = [...skillIds].sort((a, b) => lab.skills[a].theta - lab.skills[b].theta).slice(0, 3);
  const mean = skillIds.reduce((s, id) => s + lab.skills[id].theta, 0) / skillIds.length;
  const lv = levelOf(mean);
  const recommendedDifficulty = lv === "novice" ? [1, 2] : lv === "developing" ? [2, 3] : lv === "proficient" ? [3, 4] : [4, 5];
  const start = (id: string) => navigate(`/play/${store.startMission(id)}`);

  return (
    <div className="ml-page">
      <PageHead title="For You" sub="Picked from your skill profile and your recent decisions. Every pick says why it was chosen." />
      <SubNav module="missions" />

      {active.length > 0 && (
        <Card title="Continue where you left off">
          <ul className="ml-rows">
            {active.map((s) => {
              const m = s.kind === "mission" ? getMission(s.missionId) : null;
              if (!m) return null;
              return (
                <li key={s.id}>
                  <button type="button" className="ml-row-link" onClick={() => navigate(`/play/${s.id}`)}>
                    <Icon name="flag" />
                    <span className="ml-row-main">
                      <b>{m.title}</b>
                      <span className="ml-muted">In progress · saved {relativeTime(s.updatedAt)}</span>
                    </span>
                    <span className="ml-row-cta">
                      Resume <Icon name="arrow-right" size={16} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {primary && <MissionSpotlight mission={primary} reason={rec.primary!.reason} resume={Boolean(store.activeSessionFor(primary.id))} onStart={() => start(primary.id)} />}

      <div className="ml-split">
        <div className="ml-stack-5">
          {rec.slots.length > 0 && (
            <Card title="Also for you">
              <ul className="ml-rows">
                {rec.slots.map((s) => (
                  <li key={s.slot}>
                    <button type="button" className="ml-row-link" onClick={() => (s.slot === "review" && s.sessionId ? navigate(`/journal/replay/${s.sessionId}`) : s.missionId && start(s.missionId))}>
                      <span className="ml-row-main">
                        <span className="ml-eyebrow">{SLOT_TITLE[s.slot]}</span>
                        <b>{s.missionId ? getMission(s.missionId).title : ""}</b>
                        <span className="ml-muted">{s.reason}</span>
                      </span>
                      <span className="ml-row-cta">
                        {s.slot === "review" ? "Open replay" : "Start"}
                        <Icon name="arrow-right" size={16} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card title="Close your skill gaps" eyebrow="Your three lowest skill estimates">
            <ul className="ml-gaps">
              {gaps.map((id) => {
                const st = lab.skills[id];
                const missions = MISSIONS.filter((m) => m.skillPrimary === id).concat(MISSIONS.filter((m) => m.skillsSecondary.includes(id))).slice(0, 2);
                const topic = TOPICS.find((t) => t.skill === id);
                const lesson = topic ? LESSONS.find((l) => l.topic === topic.id) : undefined;
                return (
                  <li key={id}>
                    <div className="ml-gap-head">
                      <b>{SKILL_BY_ID[id].name}</b>
                      <span className="ml-muted">
                        {LEVEL_LABEL[levelOf(st.theta)]} · {confidenceOf(st)} confidence
                      </span>
                    </div>
                    <div className="ml-gap-links">
                      {missions.map((m) => (
                        <Link key={m.id} to={`/mission/${m.id}`} className="ml-pill">
                          <Icon name="flag" size={14} /> {m.title}
                        </Link>
                      ))}
                      {lesson && (
                        <Link to={`/learn/lessons/${lesson.id}`} className="ml-pill">
                          <Icon name="book" size={14} /> {lesson.title}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <aside className="ml-stack-5">
          <Card eyebrow="Recommended difficulty">
            <div className="ml-kpi">
              <span className="ml-kpi-value">
                {DIFFICULTY_LABEL[recommendedDifficulty[0]]} to {DIFFICULTY_LABEL[recommendedDifficulty[1]]}
              </span>
              <span className="ml-kpi-sub">Your average skill estimate is {LEVEL_LABEL[lv]}. Missions in this band stretch you without overwhelming you.</span>
            </div>
            <ul className="ml-rows ml-rows--tight">
              {MISSIONS.filter((m) => m.difficulty >= recommendedDifficulty[0] && m.difficulty <= recommendedDifficulty[1]).map((m) => (
                <li key={m.id}>
                  <Link to={`/mission/${m.id}`} className="ml-row-link">
                    <span className="ml-row-main">
                      <b>{m.title}</b>
                      <span className="ml-muted">
                        <Dots n={m.difficulty} /> {DIFFICULTY_LABEL[m.difficulty]} · {m.estMinutes} min
                      </span>
                    </span>
                    <Icon name="chevron-right" size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          {rec.recurring.length > 0 && (
            <Card title="Patterns to watch">
              <ul className="ml-patterns">
                {rec.recurring.slice(0, 3).map((t) => {
                  const trains = MISSIONS.find((m) => m.targets.includes(t));
                  return (
                    <li key={t}>
                      <b>{ERROR_TAGS[t]?.label ?? t}</b>
                      <span className="ml-muted">{ERROR_TAGS[t]?.tip}</span>
                      {trains && (
                        <Link to={`/mission/${trains.id}`} className="ml-text-link ml-small">
                          Train it: {trains.title}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
        </aside>
      </div>
      <SafetyNote />
    </div>
  );
}

// ─── All Missions ───────────────────────────────────────────────────────────

type Status = "all" | "new" | "active" | "done";
type Duration = "any" | "short" | "medium" | "long";

export function AllMissionsPage() {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicId | "all">("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [duration, setDuration] = useState<Duration>("any");
  const [status, setStatus] = useState<Status>("all");

  const ordered = [...MISSIONS].sort((a, b) => LEARNING_PATH.indexOf(a.id) - LEARNING_PATH.indexOf(b.id));
  const statusOf = (m: MissionDef): Exclude<Status, "all"> => (store.activeSessionFor(m.id) ? "active" : attemptsOf(lab, m.id).length ? "done" : "new");
  const q = query.trim().toLowerCase();
  const shown = ordered.filter((m) => {
    if (q && !`${m.title} ${m.tagline} ${m.objective} ${SKILL_BY_ID[m.skillPrimary].name}`.toLowerCase().includes(q)) return false;
    if (topic !== "all" && !missionTopics(m.id).includes(topic)) return false;
    if (difficulty !== "all" && m.difficulty !== Number(difficulty)) return false;
    if (duration === "short" && m.estMinutes > 3) return false;
    if (duration === "medium" && (m.estMinutes < 4 || m.estMinutes > 5)) return false;
    if (duration === "long" && m.estMinutes < 6) return false;
    if (status !== "all" && statusOf(m) !== status) return false;
    return true;
  });
  const counts = { all: ordered.length, new: ordered.filter((m) => statusOf(m) === "new").length, active: ordered.filter((m) => statusOf(m) === "active").length, done: ordered.filter((m) => statusOf(m) === "done").length };
  const filtered = q !== "" || topic !== "all" || difficulty !== "all" || duration !== "any" || status !== "all";
  const rec = recommend({ missions: MISSIONS.map(missionMeta), skills: lab.skills, history: missionHistory(lab), path: LEARNING_PATH, now: Date.now() });
  const primary = rec.primary?.missionId ? getMission(rec.primary.missionId) : null;
  const reset = () => {
    setQuery("");
    setTopic("all");
    setDifficulty("all");
    setDuration("any");
    setStatus("all");
  };

  return (
    <div className="ml-page">
      <PageHead title="All Missions" sub="Three to six minutes each, one skill at a time. Every replay uses a different market, so answers can't be memorised." />
      <SubNav module="missions" />

      {primary && !filtered && <MissionSpotlight mission={primary} resume={Boolean(store.activeSessionFor(primary.id))} onStart={() => navigate(`/play/${store.startMission(primary.id)}`)} />}

      <div className="ml-mission-toolbar">
        <label className="ml-mission-search">
          <Icon name="search" size={17} />
          <span className="ml-sr">Search missions</span>
          <input type="search" placeholder="Search missions or skills" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label className="ml-mission-select">
          <span className="ml-sr">Topic</span>
          <select value={topic} onChange={(e) => setTopic(e.target.value as TopicId | "all")}>
            <option value="all">All topics</option>
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({MISSIONS.filter((m) => missionTopics(m.id).includes(t.id)).length})
              </option>
            ))}
          </select>
        </label>
        <label className="ml-mission-select">
          <span className="ml-sr">Difficulty</span>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="all">Any difficulty</option>
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABEL[d]}
              </option>
            ))}
          </select>
        </label>
        <label className="ml-mission-select">
          <span className="ml-sr">Duration</span>
          <select value={duration} onChange={(e) => setDuration(e.target.value as Duration)}>
            <option value="any">Any length</option>
            <option value="short">Up to 3 min</option>
            <option value="medium">4–5 min</option>
            <option value="long">6 min or more</option>
          </select>
        </label>
        <span className="ml-mission-count num" aria-live="polite">
          {plural(shown.length, "mission")}
        </span>
      </div>
      <div className="ml-row ml-row--between">
        <FilterChips
          label="Completion status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All", count: counts.all },
            { value: "new", label: "Not started", count: counts.new },
            { value: "active", label: "In progress", count: counts.active },
            { value: "done", label: "Completed", count: counts.done },
          ]}
        />
        {filtered && (
          <button type="button" className="ml-text-btn ml-inline ml-small" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <Empty
          icon="search"
          title={topic !== "all" && MISSIONS.every((m) => !missionTopics(m.id).includes(topic)) ? `No missions in ${TOPIC_BY_ID[topic].name} yet` : "No missions match these filters"}
          action={
            <div className="ml-actions">
              <Button variant="secondary" onClick={reset}>
                Clear filters
              </Button>
              {topic !== "all" && (
                <Link to="/learn/lessons" className="ml-text-link">
                  Lessons on {TOPIC_BY_ID[topic].name}
                </Link>
              )}
            </div>
          }
        >
          {topic !== "all" && MISSIONS.every((m) => !missionTopics(m.id).includes(topic))
            ? "This topic is covered by lessons, knowledge checks and the Risk Calculator for now. Missions for it are in development."
            : "Try a broader search or remove a filter."}
        </Empty>
      ) : (
        <div className="ml-mission-deck">
          {shown.map((m) => (
            <MissionTile key={m.id} mission={m} lab={lab} />
          ))}
        </div>
      )}
      <SafetyNote />
      <p className="ml-fine">In development: Order Types and Portfolio Exposure missions, Volatility Shift, The News Shock and Revenge Trade.</p>
    </div>
  );
}

// ─── Mission detail (lifecycle steps 1–3) ───────────────────────────────────

const LIFECYCLE = [
  "Introduction",
  "Learning objective",
  "Scenario briefing",
  "Interactive task",
  "Your decision",
  "Immediate feedback",
  "Alternatives explained",
  "Mission score",
  "Skill update",
  "Next mission",
];

export function MissionDetailPage({ missionId }: { missionId: string }) {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const m = MISSIONS.find((x) => x.id === missionId);
  if (!m) return <Empty title="Mission not found" action={<Link to="/missions/all" className="ml-text-link">All missions</Link>} />;
  const attempts = attemptsOf(lab, m.id).sort((a, b) => b.completedAt - a.completedAt);
  const missing = missingPrerequisites(missionMeta(m), lab.skills);
  const active = store.activeSessionFor(m.id);
  const lessons = LESSONS.filter((l) => l.practice.some((p) => p.kind === "mission" && p.ref === m.id));
  const concepts = CONCEPTS.filter((c) => c.missions.includes(m.id));

  return (
    <div className="ml-page">
      <PageHead
        back={{ to: "/missions/all", label: "All Missions" }}
        eyebrow={missionTopics(m.id)
          .map((t) => TOPIC_BY_ID[t].name)
          .join(" · ")}
        title={m.title}
        sub={m.tagline}
        actions={
          <div className="ml-actions">
            {attempts.length > 0 && !active && (
              <Button variant="secondary" iconLeft="replay" onClick={() => navigate(`/play/${store.startMission(m.id, { fresh: true })}`)}>
                New market
              </Button>
            )}
            <Button variant="primary" size="lg" iconRight="arrow-right" onClick={() => navigate(`/play/${store.startMission(m.id)}`)}>
              {active ? "Resume mission" : attempts.length ? "Play again" : "Start mission"}
            </Button>
          </div>
        }
      />

      <div className="ml-grid ml-grid--4">
        <div className="ml-tile">
          <span className="ml-tile-label">Difficulty</span>
          <span className="ml-tile-value">
            <Dots n={m.difficulty} /> {DIFFICULTY_LABEL[m.difficulty]}
          </span>
        </div>
        <div className="ml-tile">
          <span className="ml-tile-label">Duration</span>
          <span className="ml-tile-value num">About {m.estMinutes} min</span>
        </div>
        <div className="ml-tile">
          <span className="ml-tile-label">Reward</span>
          <span className="ml-tile-value num">+{XP_RULES.missionByDifficulty[m.difficulty]} XP</span>
          <span className="ml-tile-sub">For learning, never for profit</span>
        </div>
        <div className="ml-tile">
          <span className="ml-tile-label">Your best</span>
          <span className="ml-tile-value num">{bestOf(lab, m.id) ?? "—"}</span>
          <span className="ml-tile-sub">{attempts.length ? plural(attempts.length, "attempt") : "Not attempted yet"}</span>
        </div>
      </div>

      <div className="ml-split">
        <div className="ml-stack-5">
          <Card title="Learning objective">
            <p className="ml-body">{m.objective}</p>
          </Card>
          <Card title="Scenario briefing">
            <p className="ml-body">{m.briefing}</p>
            {m.setupText && <Note>{m.setupText}</Note>}
            <ul className="ml-list">
              {m.rulesText.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="ml-fine">
              <Icon name="info" size={14} /> {m.dataLabel === "synthetic" ? "Synthetic data" : "Hypothetical data"}. Each attempt uses a different variant of the market.
            </p>
          </Card>
          <Card title="Your attempts">
            {attempts.length === 0 ? (
              <p className="ml-muted">No attempts yet. Your decision quality, risk discipline and simulated outcome will be listed here, side by side.</p>
            ) : (
              <div className="ml-table-wrap">
                <table className="ml-table">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col" className="num">
                        Decision quality
                      </th>
                      <th scope="col" className="num">
                        Risk discipline
                      </th>
                      <th scope="col" className="num">
                        Simulated outcome
                      </th>
                      <th scope="col">
                        <span className="ml-sr">Open</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((r) => (
                      <tr key={r.sessionId}>
                        <th scope="row">{formatDate(r.completedAt, lab.settings.timeZone)}</th>
                        <td className="num">{r.dqs ?? "—"}</td>
                        <td className="num">{resultRds(lab, r) ?? "—"}</td>
                        <td className="num">
                          <Pnl value={r.net} unit={false} />
                        </td>
                        <td>
                          <Link to={`/debrief/${r.sessionId}`} className="ml-text-link">
                            Debrief
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
        <aside className="ml-stack-5">
          <Card title="How this mission works">
            <ol className="ml-lifecycle">
              {LIFECYCLE.map((s, i) => (
                <li key={s}>
                  <span className="num">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </Card>
          <Card title="Skills trained">
            <ul className="ml-list">
              <li>
                <b>{SKILL_BY_ID[m.skillPrimary].name}</b> (main)
              </li>
              {m.skillsSecondary.map((s: SkillId) => (
                <li key={s}>{SKILL_BY_ID[s].name}</li>
              ))}
            </ul>
            {m.prerequisites.length > 0 && (
              <>
                <h3 className="ml-h4">Prerequisites</h3>
                <ul className="ml-prereqs">
                  {m.prerequisites.map((p) => {
                    const met = !missing.some((x) => x.skill === p.skill);
                    return (
                      <li key={p.skill} className={cx(met && "is-met")}>
                        <Icon name={met ? "check" : "lock"} size={14} />
                        {SKILL_BY_ID[p.skill].name}: {LEVEL_LABEL[p.level]}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </Card>
          {(lessons.length > 0 || concepts.length > 0) && (
            <Card title="Prepare">
              <ul className="ml-rows ml-rows--tight">
                {lessons.map((l) => (
                  <li key={l.id}>
                    <Link to={`/learn/lessons/${l.id}`} className="ml-row-link">
                      <Icon name="book" size={16} />
                      <span className="ml-row-main">
                        <b>{l.title}</b>
                        <span className="ml-muted">Lesson · {l.minutes} min</span>
                      </span>
                    </Link>
                  </li>
                ))}
                {concepts.slice(0, 4).map((c) => (
                  <li key={c.id}>
                    <Link to={`/learn/concepts/${c.id}`} className="ml-row-link">
                      <Icon name="library" size={16} />
                      <span className="ml-row-main">
                        <b>{c.name}</b>
                        <span className="ml-muted">Concept</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

// ─── Daily challenges ───────────────────────────────────────────────────────

function ChallengeQuestion({ item, index, value, onChange, graded }: { item: ChallengeItem; index: number; value: string; onChange: (v: string) => void; graded: boolean }) {
  const correct = graded && gradeChallengeItem(item, value);
  return (
    <fieldset className={cx("ml-qcard", graded && (correct ? "is-right" : "is-wrong"))}>
      <legend className="ml-qcard-head">
        <span className="ml-qcard-n num">{index + 1}</span>
        <span>{item.prompt}</span>
      </legend>
      {item.kind === "choice" ? (
        <div className="ml-stack-2" role="radiogroup">
          {item.options!.map((o) => (
            <label key={o.id} className={cx("ml-option", value === o.id && "is-on", graded && o.id === item.correct && "is-correct")}>
              <input type="radio" name={item.id} value={o.id} checked={value === o.id} disabled={graded} onChange={() => onChange(o.id)} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <TextField label="Your answer" inputMode="decimal" value={value} disabled={graded} onChange={(e) => onChange(e.target.value)} trailing={item.unit ? <span className="ml-field-unit">{item.unit}</span> : undefined} />
      )}
      {graded && (
        <p className="ml-explain" role="status">
          <b>{correct ? "Correct." : `Not quite${item.kind === "numeric" ? `: ${item.answer} ${item.unit ?? ""}` : ""}.`}</b> {item.explanation}
        </p>
      )}
    </fieldset>
  );
}

export function DailyPage() {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const { today, xpToday } = useProgress(lab);
  const challenge = useMemo(() => dailyChallenge(today, QUESTIONS), [today]);
  const done = lab.dailies[today];
  const [answers, setAnswers] = useState<Record<string, string>>(done?.answers ?? {});
  const [error, setError] = useState<string | null>(null);
  const graded = Boolean(done);
  const last7 = Array.from({ length: 7 }, (_, i) => addDays(today, -6 + i));
  const goal = lab.profile.goals.dailyXp;

  const submit = () => {
    if (challenge.items.some((it) => !answers[it.id]?.trim())) return setError("Answer all three before checking.");
    setError(null);
    const correct = challenge.items.filter((it) => gradeChallengeItem(it, answers[it.id])).length;
    const xp = store.completeDaily(today, answers, correct, challenge.items.length);
    toast(`Daily challenge complete · +${xp} XP`);
  };

  return (
    <div className="ml-page">
      <PageHead eyebrow={formatDayKey(today, { weekday: "long", day: "numeric", month: "long" })} title="Daily Challenges" sub="One short challenge a day, one learning objective. A new one appears at midnight in your time zone." />
      <SubNav module="missions" />
      <div className="ml-split">
        <Card eyebrow={`Today · ${challenge.title}`} title={challenge.objective} className="ml-card--feature">
          <div className="ml-stack-4">
            {challenge.items.map((it, i) => (
              <ChallengeQuestion key={it.id} item={it} index={i} value={answers[it.id] ?? ""} graded={graded} onChange={(v) => setAnswers({ ...answers, [it.id]: v })} />
            ))}
            {error && <InlineError>{error}</InlineError>}
            {graded ? (
              <div className="ml-result-line">
                <Icon name="check-circle" size={18} />
                <span className="num">
                  {done.correct} of {done.total} correct · +{done.correct * DAILY_XP.perCorrect + DAILY_XP.completion} XP. Come back tomorrow for a new one.
                </span>
                {challenge.lesson && (
                  <Link to={`/learn/lessons/${challenge.lesson}`} className="ml-text-link">
                    Review the lesson
                  </Link>
                )}
              </div>
            ) : (
              <div className="ml-actions">
                <Button variant="primary" iconRight="check" onClick={submit}>
                  Check my answers
                </Button>
              </div>
            )}
          </div>
        </Card>
        <aside className="ml-stack-5">
          <Card eyebrow="Today's progress">
            <div className="ml-goal">
              <MiniRing value={xpToday / goal} size={52} stroke={5} />
              <div className="ml-kpi">
                <span className="ml-kpi-value num">
                  {xpToday}
                  <small> / {goal} XP</small>
                </span>
                <span className="ml-kpi-sub">{done ? "Challenge done" : "Challenge not done yet"}</span>
              </div>
            </div>
          </Card>
          <Card title="Reward">
            <p className="ml-body">
              {DAILY_XP.perCorrect} XP per correct answer, plus {DAILY_XP.completion} XP for finishing. Up to {DAILY_XP.perCorrect * 3 + DAILY_XP.completion} XP a day.
            </p>
            <p className="ml-fine">One attempt per day, so the score reflects what you knew.</p>
          </Card>
          <Card title="Last 7 days">
            <ol className="ml-daylist">
              {last7.map((d) => {
                const r = lab.dailies[d];
                return (
                  <li key={d} className={cx(r && "is-done", d === today && "is-today")}>
                    <span>{formatDayKey(d)}</span>
                    <span className="num">{r ? `${r.correct}/${r.total}` : d === today ? "Today" : "—"}</span>
                  </li>
                );
              })}
            </ol>
          </Card>
        </aside>
      </div>
    </div>
  );
}

// ─── Weekly challenges ──────────────────────────────────────────────────────

export function WeeklyPage() {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const { navigate } = useRouter();
  const { today, snapshot } = useProgress(lab);
  const week = weekKey(today);
  const wc = useMemo(() => weeklyChallenge(today, week), [today, week]);
  const progress = weeklyProgress(wc, snapshot);
  const allDone = progress.every((p) => p.done);
  const claimed = lab.weeklies[week];
  const featured = getMission(wc.featuredMission);
  const daysLeft = wc.days.filter((d) => d >= today).length;
  const daySet = new Set(wc.days);
  const inWeek = (t: number) => daySet.has(dayKey(t, lab.settings.timeZone));
  const xpWeek = lab.xp.filter((x) => inWeek(x.at)).reduce((s, x) => s + x.amount, 0);
  const summary = [
    { label: "Missions", value: snapshot.missions.filter((m) => inWeek(m.at)).length },
    { label: "Arena sessions", value: snapshot.arena.filter((a) => inWeek(a.at)).length },
    { label: "Lessons", value: snapshot.lessons.filter((l) => inWeek(l.at)).length },
    { label: "Checks passed", value: snapshot.checks.filter((c) => c.passed && inWeek(c.at)).length },
    { label: "XP earned", value: xpWeek },
  ];

  return (
    <div className="ml-page">
      <PageHead eyebrow={`${formatWeekRange(wc.days)} · ${plural(daysLeft, "day")} left`} title="Weekly Challenges" sub="Four objectives a week, including one multi-step scenario. Finish all four for a bonus." />
      <SubNav module="missions" />
      <MissionSpotlight
        mission={featured}
        eyebrow="Scenario of the week"
        note={`Multi-step · ${featured.checkpoints.filter((c) => !c.onlyVia).length}+ decision points`}
        resume={Boolean(store.activeSessionFor(featured.id))}
        onStart={() => navigate(`/play/${store.startMission(featured.id)}`)}
      />
      <div className="ml-split">
        <div className="ml-stack-5">
          <Card title="This week's objectives">
            <ul className="ml-objectives">
              {progress.map(({ objective, current, done }) => (
                <li key={objective.id} className={cx(done && "is-done")}>
                  <span className="ml-objective-check" aria-hidden="true">
                    {done && <Icon name="check" size={14} />}
                  </span>
                  <div className="ml-objective-main">
                    <span>{objective.id === "featured" ? `${objective.label}: ${featured.title}` : objective.label}</span>
                    <Meter value={current / objective.target} label={objective.label} />
                  </div>
                  <span className="num ml-objective-count">
                    {current}/{objective.target}
                  </span>
                </li>
              ))}
            </ul>
            <div className="ml-actions">
              {claimed ? (
                <span className="ml-result-line">
                  <Icon name="check-circle" size={18} /> Reward claimed · +{WEEKLY_XP} XP
                </span>
              ) : (
                <Button
                  variant="primary"
                  iconLeft="star"
                  disabled={!allDone}
                  onClick={() => {
                    store.claimWeekly(week);
                    toast(`Weekly challenge complete · +${WEEKLY_XP} XP`);
                  }}
                >
                  {allDone ? `Claim ${WEEKLY_XP} XP` : `Complete all four to earn ${WEEKLY_XP} XP`}
                </Button>
              )}
            </div>
          </Card>
        </div>
        <aside className="ml-stack-5">
          <Card title="Week so far">
            <dl className="ml-kv">
              {summary.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd className="num">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="ml-fine">Objectives count activity from Monday to Sunday in your time zone.</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

// ─── Assessments ────────────────────────────────────────────────────────────

const PRACTICAL = [
  { id: "M04", title: "Risk and stops", pass: 75 },
  { id: "M05", title: "Position sizing", pass: 75 },
  { id: "M07", title: "Discipline under pressure", pass: 75 },
];
const FINAL = { id: "M10", title: "Final mission assessment", pass: 80 };

export function AssessmentsPage() {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const { snapshot } = useProgress(lab);
  const best = (topic: TopicId) => {
    const attempts = lab.checks[assessmentId(topic)] ?? [];
    return attempts.reduce<number | null>((b, a) => Math.max(b ?? 0, Math.round((a.correct / a.total) * 100)), null);
  };
  const practicalPassed = PRACTICAL.map((p) => (bestOf(lab, p.id) ?? 0) >= p.pass);
  const finalUnlocked = practicalPassed.every(Boolean);
  const firstTheta = (skill: SkillId) => snapshot.skillHistory.find((h) => h.skill === skill);

  return (
    <div className="ml-page">
      <PageHead title="Assessments" sub="Check what you know and what you can do. Assessments measure understanding and process, never simulated profit." />
      <SubNav module="missions" />

      <Card title="Initial skill assessment" action={<Button size="sm" variant="secondary" iconLeft="replay" onClick={() => navigate("/start/retake")}>Retake</Button>}>
        <p className="ml-body">
          {lab.profile.onboarded
            ? lab.profile.placementSkipped
              ? "You skipped the starting questions. Take them now to sharpen your first recommendations."
              : `Completed. ${Object.keys(lab.profile.placementAnswers).length} quick questions set your starting profile.`
            : "Five quick questions that set your starting profile."}
        </p>
      </Card>

      <Card title="Topic assessments" eyebrow="Knowledge tests · pass with 70%">
        <ul className="ml-assess-grid">
          {TOPICS.map((t) => {
            const b = best(t.id);
            const check = KNOWLEDGE_CHECKS.find((c) => c.id === assessmentId(t.id))!;
            const passed = (lab.checks[check.id] ?? []).some((a) => a.passed);
            return (
              <li key={t.id}>
                <Link to={`/learn/checks/${check.id}`} className={cx("ml-assess", passed && "is-passed")}>
                  <span className="ml-assess-title">{t.name}</span>
                  <span className="ml-muted ml-small num">
                    {check.questionIds.length} questions · {b === null ? "not taken" : `best ${b}%`}
                  </span>
                  <span className={cx("ml-status", passed ? "ml-status--done" : b === null ? "ml-status--new" : "ml-status--active")}>{passed ? "Passed" : b === null ? "Not taken" : "Try again"}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="ml-grid ml-grid--2">
        <Card title="Practical assessments" eyebrow="A fresh market each time · pass with 75 decision quality">
          <ul className="ml-rows">
            {PRACTICAL.map((p, i) => {
              const b = bestOf(lab, p.id);
              return (
                <li key={p.id} className="ml-row-static">
                  <span className="ml-row-main">
                    <b>{p.title}</b>
                    <span className="ml-muted num">
                      {getMission(p.id).title} · best {b ?? "—"}
                    </span>
                  </span>
                  <span className={cx("ml-status", practicalPassed[i] ? "ml-status--done" : "ml-status--new")}>{practicalPassed[i] ? "Passed" : "Open"}</span>
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/play/${store.startMission(p.id, { fresh: true })}`)}>
                    Take it
                  </Button>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card title={FINAL.title} eyebrow={`Pass with ${FINAL.pass} decision quality`}>
          <p className="ml-body">
            {getMission(FINAL.id).title}: check a setup against a written playbook and act only when every condition is met. Unlocks after the three practical assessments.
          </p>
          {finalUnlocked ? (
            <div className="ml-actions">
              <Button variant="primary" iconRight="arrow-right" onClick={() => navigate(`/play/${store.startMission(FINAL.id, { fresh: true })}`)}>
                Take the final assessment
              </Button>
              <span className="ml-muted num">Best {bestOf(lab, FINAL.id) ?? "—"}</span>
            </div>
          ) : (
            <p className="ml-later">
              <Icon name="lock" size={14} /> {practicalPassed.filter(Boolean).length} of 3 practical assessments passed
            </p>
          )}
        </Card>
      </div>

      <Card title="Skill progression evaluation" eyebrow="How your estimates moved since your first observed decision">
        <div className="ml-table-wrap">
          <table className="ml-table">
            <thead>
              <tr>
                <th scope="col">Skill</th>
                <th scope="col">Now</th>
                <th scope="col" className="num">
                  Change
                </th>
                <th scope="col">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {SKILLS.map((s) => {
                const st = lab.skills[s.id];
                const first = firstTheta(s.id);
                const delta = first ? st.theta - first.theta : 0;
                return (
                  <tr key={s.id}>
                    <th scope="row">{s.name}</th>
                    <td>{LEVEL_LABEL[levelOf(st.theta)]}</td>
                    <td className="num">{first ? `${delta >= 0 ? "+" : "−"}${Math.abs(delta).toFixed(2)}` : "—"}</td>
                    <td>{confidenceOf(st)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="ml-fine">Estimates are learning indicators, not certifications.</p>
      </Card>
    </div>
  );
}
