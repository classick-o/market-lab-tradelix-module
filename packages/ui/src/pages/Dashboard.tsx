import { useState } from "react";
import { LEARNING_PATHS, MISSION_TOPICS, TOPIC_BY_ID, getLesson, pathProgress, weekActivity, type LearningPath } from "@market-lab/academy";
import type { SkillId } from "@market-lab/evaluation";
import { LEVEL_LABEL, SKILLS, SKILL_BY_ID, XP_RULES, levelOf, recommend, thetaProgress } from "@market-lab/learning";
import { LEARNING_PATH, MISSIONS, getArenaScenario, getMission, missionMeta } from "@market-lab/missions";
import { CandleStrip, missionGlyph } from "../components/Art";
import { Pnl } from "../components/Page";
import { Button, Dialog, Icon, cx } from "../components/ui";
import { DIFFICULTY_LABEL, bandLabel, formatDayKey, formatDuration, formatPct, relativeTime } from "../format";
import { usePlan } from "../host";
import { LOOKUP } from "../labels";
import { activityFeed, resultRds, useProgress } from "../progress";
import { Link, useRouter } from "../router";
import { missionHistory, useLab, useStore, type ArenaSession, type MissionSession } from "../store";

function greeting(): string {
  const h = new Date().getHours();
  return h < 5 ? "Good evening" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/** "TUESDAY, OCTOBER 20, 2026" in the user's time zone. */
function longDate(tz: string): string {
  const opts: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
  try {
    return new Date().toLocaleDateString("en-US", tz && tz !== "auto" ? { ...opts, timeZone: tz } : opts);
  } catch {
    return new Date().toLocaleDateString("en-US", opts);
  }
}

const SKILL_BARS: Record<string, number> = { novice: 2, developing: 3, proficient: 4, advanced: 5 };

function stepInfo(path: LearningPath, index: number) {
  const step = path.steps[index];
  if (step.kind === "lesson") {
    const l = getLesson(step.id);
    return { title: l?.title ?? step.id, kind: "Lesson", icon: "book", minutes: l?.minutes ?? 4, cta: "Continue learning", to: `/learn/lessons/${step.id}` };
  }
  if (step.kind === "mission") {
    const m = getMission(step.id);
    return { title: m.title, kind: "Mission", icon: "target", minutes: m.estMinutes, cta: "Start mission", to: null as string | null, missionId: step.id };
  }
  return { title: LOOKUP.check(step.id), kind: "Knowledge check", icon: "quiz", minutes: 4, cta: "Take the check", to: `/learn/checks/${step.id}` };
}

function GoalDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lab = useLab();
  const store = useStore();
  const [goal, setGoal] = useState(lab.profile.goals.dailyXp);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Edit daily goal"
      description="Make practice a habit. Choose a goal that works for you."
      footer={
        <Button
          variant="primary"
          block
          onClick={() => {
            store.setGoals({ dailyXp: goal });
            onClose();
          }}
        >
          Save daily goal
        </Button>
      }
    >
      <div className="ml-goal-options" role="radiogroup" aria-label="Daily XP goal">
        {[30, 50, 100, 150].map((n) => (
          <Button key={n} role="radio" aria-checked={goal === n} variant={goal === n ? "primary" : "secondary"} onClick={() => setGoal(n)}>
            {n} XP
          </Button>
        ))}
      </div>
    </Dialog>
  );
}

export function DashboardPage() {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const { pro } = usePlan();
  const { level, rank, streak, xpToday, snapshot, today, days } = useProgress(lab);
  const [editGoal, setEditGoal] = useState(false);
  const tz = lab.settings.timeZone;
  const firstName = (lab.profile.displayName || "").trim().split(/\s+/)[0];
  const goal = lab.profile.goals;
  const week = weekActivity(days, today);
  const activeThisWeek = week.filter((d) => d.active).length;
  const levelPct = Math.round((level.into / level.needed) * 100);

  const skillIds = SKILLS.map((s) => s.id).filter((id) => id !== "reflection_review" || lab.skills[id].n > 0) as SkillId[];
  const meanTheta = skillIds.reduce((s, id) => s + lab.skills[id].theta, 0) / skillIds.length;
  const observations = skillIds.reduce((s, id) => s + lab.skills[id].n, 0);
  const skillLevel = levelOf(meanTheta);
  const skillRows = [...skillIds]
    .map((id) => ({ id, value: Math.round(thetaProgress(lab.skills[id].theta) * 100) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // "Your X is up +N this week": the largest gain in the last 7 days, on the 0–100 scale.
  const weekAgo = Date.now() - 7 * 86_400_000;
  const weekResults = Object.values(lab.results)
    .filter((r) => r.completedAt >= weekAgo)
    .sort((a, b) => a.completedAt - b.completedAt);
  const gains = skillIds
    .map((id) => {
      const deltas = weekResults.flatMap((r) => r.skillDeltas.filter((d) => d.skill === id));
      if (!deltas.length) return { id, delta: 0 };
      return { id, delta: Math.round((thetaProgress(deltas[deltas.length - 1].after) - thetaProgress(deltas[0].before)) * 100) };
    })
    .filter((g) => g.delta > 0)
    .sort((a, b) => b.delta - a.delta);

  // Continue learning: an unfinished session first, then the next step of a started path.
  const activeMission = (Object.values(lab.sessions).filter((s) => s.kind === "mission" && s.status === "active") as MissionSession[]).sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const activeArena = store.activeArena();
  const paths = LEARNING_PATHS.filter((p) => p.tier === "free" || pro).map((p) => ({ p, pr: pathProgress(p, snapshot) }));
  const started = paths.find(({ pr }) => pr.completed > 0 && pr.nextIndex !== null) ?? paths.find(({ pr }) => pr.nextIndex !== null);

  const rec = recommend({ missions: MISSIONS.map(missionMeta), skills: lab.skills, history: missionHistory(lab), path: LEARNING_PATH, now: Date.now() });
  const primary = rec.primary?.missionId ? getMission(rec.primary.missionId) : null;
  const primaryTopic = primary ? MISSION_TOPICS[primary.id]?.[0] : undefined;

  const lastArena = Object.values(lab.results)
    .filter((r) => r.kind === "arena")
    .sort((a, b) => b.completedAt - a.completedAt)[0];
  const lastSession = lastArena ? (lab.sessions[lastArena.sessionId] as ArenaSession | undefined) : undefined;
  const lastRds = lastArena ? resultRds(lab, lastArena) : null;
  const feed = activityFeed(lab, 5, LOOKUP);
  const dailyDone = Boolean(lab.dailies[today]);

  return (
    <div className="ml-page ml-dash">
      <header className="ml-page-head ml-dash-hero ml-art ml-art--mountains">
        <span className="ml-eyebrow">{longDate(tz)}</span>
        <h1>
          {greeting()}
          {firstName ? `, ${firstName}` : ""}
          <span className="ml-accent-text">.</span>
        </h1>
      </header>

      {!lab.profile.onboarded && (
        <section className="ml-banner">
          <div>
            <h2>Start with a one-minute check</h2>
            <p>Five quick questions set your starting profile, so the first mission fits you.</p>
          </div>
          <Button variant="primary" iconRight="arrow-right" onClick={() => navigate("/start")}>
            Start
          </Button>
        </section>
      )}

      <section className="ml-stats" aria-label="Your progress at a glance">
        <div className="ml-stat-card ml-art ml-art--peak">
          <div className="ml-sc-label">
            Your progress
            <Icon name="bolt" size={15} />
          </div>
          <div className="ml-sc-value">
            Level {level.level} <span className="ml-sc-badge">{rank.title}</span>
          </div>
          <div className="ml-bar" role="meter" aria-label="XP towards the next level" aria-valuemin={0} aria-valuemax={100} aria-valuenow={levelPct}>
            <i style={{ width: `${levelPct}%` }} />
          </div>
          <div className="ml-sc-bottom">
            <span>
              <b>{level.needed - level.into} XP</b> to level {level.level + 1}
            </span>
            <span className="num">{levelPct}%</span>
          </div>
        </div>

        <div className="ml-stat-card">
          <div className="ml-sc-label">
            Daily goal
            <button type="button" onClick={() => setEditGoal(true)}>
              Edit
              <Icon name="chevron-right" size={11} />
            </button>
          </div>
          <div className="ml-sc-value">
            <span className="num">{xpToday}</span>
            <span className="ml-sc-muted num">/ {goal.dailyXp}</span>
            <span className="ml-sc-unit">XP</span>
            <span className="ml-sc-icon">
              <Icon name="target" size={29} />
            </span>
          </div>
          <div className="ml-sc-desc">{xpToday >= goal.dailyXp ? "Goal reached today." : `${goal.dailyXp - xpToday} XP remaining.`}</div>
          <div className="ml-bar" role="meter" aria-label="Daily XP goal" aria-valuemin={0} aria-valuemax={goal.dailyXp} aria-valuenow={Math.min(xpToday, goal.dailyXp)}>
            <i style={{ width: `${Math.min(100, (xpToday / goal.dailyXp) * 100)}%` }} />
          </div>
          <div className="ml-sc-bottom">
            <span>Weekly goal</span>
            <span>
              <b className="num">{activeThisWeek}</b> / {goal.weeklyDays} active days
            </span>
          </div>
        </div>

        <div className="ml-stat-card ml-art ml-art--range">
          <div className="ml-sc-label">
            Learning streak
            <Icon name="flame" size={15} />
          </div>
          <div className="ml-sc-value">
            <span className="num">{streak.current}</span> <span className="ml-sc-unit">{streak.current === 1 ? "day" : "days"}</span>
            {streak.current > 1 && streak.current >= streak.longest && <span className="ml-positive-badge">Personal best</span>}
          </div>
          <ol className="ml-week" aria-label="This week">
            {week.map((d) => (
              <li key={d.day} className={cx(d.active && "is-done", d.day === today && "is-today")}>
                <span aria-hidden="true">{d.active ? <Icon name="check" size={12} /> : null}</span>
                <small aria-hidden="true">{formatDayKey(d.day, { weekday: "narrow" })}</small>
                <span className="ml-sr">
                  {formatDayKey(d.day)}: {d.active ? "active" : "no activity"}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="ml-stat-card">
          <div className="ml-sc-label">
            Current skill level
            <Icon name="chart" size={15} />
          </div>
          <div className="ml-sc-value ml-skill-value">
            {LEVEL_LABEL[skillLevel]}
            <span className="ml-skill-bars" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <i key={n} className={cx(n <= SKILL_BARS[skillLevel] && "is-filled")} style={{ height: `${8 + n * 5}px` }} />
              ))}
            </span>
          </div>
          <div className="ml-sc-desc num">
            Across {skillIds.length} skills · {observations} observations
          </div>
          <div className="ml-skill-fine">
            <Icon name="shield" size={13} />
            Measured by decisions. Never profit.
          </div>
        </div>
      </section>

      <div className="ml-dash-columns">
        <div className="ml-dash-main">
          <section className="ml-continue-card" aria-label="Continue learning">
            <div className="ml-continue-copy">
              <div className="ml-eyebrow ml-continue-eyebrow">Continue learning</div>
              {activeMission ? (
                (() => {
                  const m = getMission(activeMission.missionId);
                  return (
                    <>
                      <h2>{m.title}</h2>
                      <div className="ml-continue-meta">
                        <span>
                          <Icon name="target" size={14} />
                          Saved {relativeTime(activeMission.updatedAt)}
                        </span>
                        <span>
                          <Icon name="clock" size={14} />
                          {m.estMinutes} min
                        </span>
                      </div>
                      <Button variant="primary" iconRight="arrow-right" onClick={() => navigate(`/play/${activeMission.id}`)}>
                        Resume mission
                      </Button>
                    </>
                  );
                })()
              ) : activeArena ? (
                <>
                  <h2>{getArenaScenario(activeArena.regime).title}</h2>
                  <div className="ml-continue-meta">
                    <span>
                      <Icon name="chart" size={14} />
                      Simulator
                    </span>
                    <span>
                      <Icon name="clock" size={14} />
                      Saved {relativeTime(activeArena.updatedAt)}
                    </span>
                  </div>
                  <Button variant="primary" iconRight="arrow-right" onClick={() => navigate("/arena/simulator")}>
                    Resume session
                  </Button>
                </>
              ) : started && started.pr.nextIndex !== null ? (
                (() => {
                  const info = stepInfo(started.p, started.pr.nextIndex!);
                  return (
                    <>
                      <h2>{info.title}</h2>
                      <div className="ml-continue-meta">
                        <span>
                          <Icon name={info.icon} size={14} />
                          {info.kind}
                        </span>
                        <span>
                          <Icon name="clock" size={14} />
                          {info.minutes} min
                        </span>
                        <span className="num">
                          <Icon name="route" size={14} />
                          {started.p.title} · {started.pr.nextIndex! + 1} of {started.p.steps.length}
                        </span>
                      </div>
                      <Button variant="primary" iconRight="arrow-right" onClick={() => (info.to ? navigate(info.to) : navigate(`/play/${store.startMission(info.missionId!)}`))}>
                        {info.cta}
                      </Button>
                    </>
                  );
                })()
              ) : (
                <>
                  <h2>Every path completed</h2>
                  <p className="ml-muted">Try a new Arena scenario, or revisit a lesson to keep the knowledge fresh.</p>
                  <Button variant="primary" iconRight="arrow-right" onClick={() => navigate("/arena/scenarios")}>
                    Arena scenarios
                  </Button>
                </>
              )}
            </div>
            <div className="ml-continue-chart" aria-hidden="true">
              <div className="ml-chart-top">
                <span>
                  LABX <span className="ml-muted">/ vUSD</span>
                </span>
                <span className="ml-synthetic">Synthetic data</span>
              </div>
              <CandleStrip mini />
              <div className="ml-level-line is-target">
                <span>Take profit</span>
                <b>128.50</b>
              </div>
              <div className="ml-level-line is-entry">
                <span>Entry</span>
                <b>124.82</b>
              </div>
              <div className="ml-level-line is-stop">
                <span>Stop loss</span>
                <b>121.40</b>
              </div>
            </div>
          </section>

          {primary && (
            <section className="ml-card ml-panel-flush ml-recommended" aria-label="Recommended next mission">
              <div className="ml-section-heading">
                <h3>Recommended next mission</h3>
                <Link to="/missions/all" className="ml-text-arrow">
                  All missions <Icon name="arrow-right" size={14} />
                </Link>
              </div>
              <div className="ml-mission-preview">
                <div className="ml-mission-art" aria-hidden="true">
                  <span className="ml-art-grid" />
                  <Icon name={missionGlyph(primaryTopic)} size={40} />
                  <span>M / {primary.id.slice(1)}</span>
                </div>
                <div className="ml-mission-info">
                  <div className="ml-tags">
                    {primaryTopic && <span className="ml-tag ml-tag--default">{TOPIC_BY_ID[primaryTopic].name}</span>}
                    <span className="ml-for-you">For you</span>
                  </div>
                  <h3>{primary.title}</h3>
                  <p>{primary.tagline}</p>
                  <div className="ml-mission-meta">
                    <span className="ml-diff" aria-label={`Difficulty: ${DIFFICULTY_LABEL[primary.difficulty]}`}>
                      {DIFFICULTY_LABEL[primary.difficulty]}
                    </span>
                    <span>
                      <Icon name="clock" size={13} />~{primary.estMinutes} min
                    </span>
                    <span className="ml-accent-text">
                      <Icon name="bolt" size={13} />+{XP_RULES.missionByDifficulty[primary.difficulty]} XP
                    </span>
                  </div>
                </div>
                <button type="button" className="ml-mission-arrow" onClick={() => navigate(`/play/${store.startMission(primary.id)}`)} aria-label={`${store.activeSessionFor(primary.id) ? "Resume" : "Start"} ${primary.title}`}>
                  <Icon name="arrow-right" size={22} />
                </button>
              </div>
              <div className="ml-reason">
                <Icon name="bolt" size={13} />
                <span>
                  <strong>Why this mission?</strong> {rec.primary!.reason}
                </span>
              </div>
            </section>
          )}

          <section className="ml-card ml-panel-flush" aria-label="Recent activity">
            <div className="ml-section-heading">
              <h3>Recent activity</h3>
              <Link to="/journal/sessions" className="ml-text-arrow">
                Session history <Icon name="arrow-right" size={14} />
              </Link>
            </div>
            {feed.length === 0 ? (
              <p className="ml-panel-empty">Nothing yet. Missions, lessons, checks and Arena sessions you complete will show up here.</p>
            ) : (
              <ul className="ml-activity-list">
                {feed.map((f) => (
                  <li key={f.id}>
                    <Link to={f.to} className="ml-activity-row">
                      <span className={cx("ml-activity-icon", `is-${f.kind}`)}>
                        <Icon name={f.icon} size={17} />
                      </span>
                      <span className="ml-activity-title">
                        <strong>{f.title}</strong>
                        <small>
                          {f.meta} · {relativeTime(f.at)}
                        </small>
                      </span>
                      {f.score !== null && (
                        <span className="ml-activity-score num">
                          {f.score}
                          <small>Decision quality</small>
                        </span>
                      )}
                      {f.xp > 0 && <span className="ml-activity-xp num">+{f.xp} XP</span>}
                      <Icon name="chevron-right" size={13} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="ml-dash-aside" aria-label="Overview">
          <section className="ml-card ml-panel-flush ml-skill-panel" aria-label="Skill development">
            <div className="ml-section-heading">
              <h3>Skill development</h3>
              <Link to="/progress/skills" className="ml-text-arrow">
                All skills <Icon name="arrow-right" size={14} />
              </Link>
            </div>
            {skillRows.map((s, i) => (
              <div className="ml-skill-row" key={s.id}>
                <div>
                  <span className="ml-skill-name">
                    {SKILL_BY_ID[s.id].name}
                    <span className="ml-skill-info">
                      <button type="button" aria-label={`About ${SKILL_BY_ID[s.id].name}`} aria-describedby={`ml-skill-tip-${i}`}>
                        <Icon name="info" size={14} />
                      </button>
                      <span className="ml-skill-tooltip" role="tooltip" id={`ml-skill-tip-${i}`}>
                        {SKILL_BY_ID[s.id].description}
                      </span>
                    </span>
                  </span>
                  <span className="num">
                    {s.value}
                    <small>/100</small>
                  </span>
                </div>
                <div className="ml-bar ml-bar--thin" aria-hidden="true">
                  <i style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
            <div className="ml-skill-note">
              {gains[0] ? (
                <>
                  Your {SKILL_BY_ID[gains[0].id].name.toLowerCase()} is up <b>+{gains[0].delta}</b> this week.
                </>
              ) : (
                "Skill estimates move as you complete missions and checks."
              )}
            </div>
          </section>

          <section className="ml-card ml-panel-flush" aria-label="Last simulation">
            <div className="ml-section-heading">
              <h3>Last simulation</h3>
              <Link to={lastArena ? `/arena/session/${lastArena.sessionId}` : "/arena/simulator"} className="ml-text-arrow">
                {lastArena ? "View" : "Open"} <Icon name="arrow-right" size={14} />
              </Link>
            </div>
            {lastArena && lastSession ? (
              <>
                <div className="ml-last-title">
                  <span className="ml-activity-icon is-arena">
                    <Icon name="chart" size={16} />
                  </span>
                  <div>
                    <strong>{getArenaScenario(lastSession.regime).title}</strong>
                    <small>
                      {relativeTime(lastArena.completedAt)} · {formatDuration(lastArena.completedAt - lastSession.createdAt)} · LABX
                    </small>
                  </div>
                  <span className="ml-complete-tag">{lastArena.completionMet ? "Cleared" : "Completed"}</span>
                </div>
                <div className="ml-sim-scores">
                  <div>
                    <span>Decision quality</span>
                    <strong className="num">
                      {lastArena.dqs ?? "—"}
                      <small>/100</small>
                    </strong>
                    <span className="ml-score-rating">{lastArena.dqs === null ? "Not scored" : bandLabel(lastArena.dqs)}</span>
                  </div>
                  <div>
                    <span>Risk discipline</span>
                    <strong className="num">
                      {lastRds ?? "—"}
                      <small>/100</small>
                    </strong>
                    <span className="ml-score-rating">{lastRds === null ? "No risk taken" : bandLabel(lastRds)}</span>
                  </div>
                  <div>
                    <span>Sim. outcome</span>
                    <strong className={cx("num", lastArena.net > 0 ? "ml-pos" : lastArena.net < 0 ? "ml-neg" : undefined)}>
                      {formatPct(lastArena.returnPct, 1, true)}
                    </strong>
                    <span>
                      <Pnl value={lastArena.net} />
                    </span>
                  </div>
                </div>
                <p className="ml-sim-note">
                  <Icon name="quiz" size={12} />A good process matters more than one result.
                </p>
              </>
            ) : (
              <p className="ml-panel-empty">No Arena sessions yet. Pick a scenario and trade a simulated market with virtual money.</p>
            )}
          </section>

          <section className="ml-card ml-panel-flush ml-quick-panel" aria-label="Quick actions">
            <div className="ml-section-heading">
              <h3>Quick actions</h3>
              <Icon name="bolt" size={15} />
            </div>
            <Link to="/missions/daily" className="ml-quick-row">
              <Icon name="target" size={16} />
              <strong>Daily challenge</strong>
              <span>{dailyDone ? "Done today" : "+40 XP"}</span>
              <Icon name="chevron-right" size={13} />
            </Link>
            <Link to="/arena/scenarios" className="ml-quick-row">
              <Icon name="chart" size={16} />
              <strong>Arena scenarios</strong>
              <span>9 scenarios</span>
              <Icon name="chevron-right" size={13} />
            </Link>
            <Link to="/arena/risk-calculator" className="ml-quick-row">
              <Icon name="calculator" size={16} />
              <strong>Risk calculator</strong>
              <span>Free tool</span>
              <Icon name="chevron-right" size={13} />
            </Link>
          </section>

          {!pro && (
            <Link to="/pricing" className="ml-pro-banner ml-art ml-art--range">
              <span className="ml-pro-banner-icon">
                <Icon name="star" size={23} />
              </span>
              <span>
                <strong>
                  MARKET//LAB Pro<b>PRO</b>
                </strong>
                <small>Advanced scenarios and analytics.</small>
              </span>
              <Icon name="arrow-right" size={17} />
            </Link>
          )}
        </aside>
      </div>
      <GoalDialog key={String(editGoal)} open={editGoal} onClose={() => setEditGoal(false)} />
    </div>
  );
}
