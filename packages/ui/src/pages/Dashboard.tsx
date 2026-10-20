import { LEARNING_PATHS, LESSONS, TOPICS, getLesson, pathProgress, weekActivity } from "@market-lab/academy";
import type { SkillId } from "@market-lab/evaluation";
import { LEVEL_LABEL, SKILLS, SKILL_BY_ID, levelOf, recommend, thetaProgress } from "@market-lab/learning";
import { LEARNING_PATH, MISSIONS, getArenaScenario, getMission, missionMeta } from "@market-lab/missions";
import { Card, MiniRing, PageHead, Pnl } from "../components/Page";
import { Button, Icon, Meter, cx } from "../components/ui";
import { DIFFICULTY_LABEL, formatDayKey, relativeTime } from "../format";
import { usePlan } from "../host";
import { LOOKUP } from "../labels";
import { activityFeed, resultRds, useProgress } from "../progress";
import { Link, useRouter } from "../router";
import { missionHistory, useLab, useStore, type ArenaSession, type MissionSession } from "../store";

function greeting(): string {
  const h = new Date().getHours();
  return h < 5 ? "Good evening" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export function DashboardPage() {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const { pro } = usePlan();
  const progress = useProgress(lab);
  const { level, rank, streak, xpToday, snapshot, today, days } = progress;
  const history = missionHistory(lab);
  const rec = recommend({ missions: MISSIONS.map(missionMeta), skills: lab.skills, history, path: LEARNING_PATH, now: Date.now() });
  const name = lab.profile.displayName;
  const goal = lab.profile.goals;

  // Overall progress: distinct missions done, lessons done and topic checks passed.
  const missionsDone = new Set(snapshot.missions.map((m) => m.missionId)).size;
  const lessonsDone = snapshot.lessons.length;
  const checksPassed = new Set(snapshot.checks.filter((c) => c.kind === "check" && c.passed).map((c) => c.topic)).size;
  const totalUnits = MISSIONS.length + LESSONS.length + TOPICS.length;
  const overall = (missionsDone + lessonsDone + checksPassed) / totalUnits;

  const skillIds = SKILLS.map((s) => s.id).filter((id) => id !== "reflection_review" || lab.skills[id].n > 0) as SkillId[];
  const meanTheta = skillIds.reduce((s, id) => s + lab.skills[id].theta, 0) / skillIds.length;
  const observations = skillIds.reduce((s, id) => s + lab.skills[id].n, 0);
  const week = weekActivity(days, today);
  const activeThisWeek = week.filter((d) => d.active).length;

  // Continue learning: an unfinished session first, then the next step of a started path.
  const activeMission = (Object.values(lab.sessions).filter((s) => s.kind === "mission" && s.status === "active") as MissionSession[]).sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const activeArena = store.activeArena();
  const startedPath =
    LEARNING_PATHS.map((p) => ({ p, pr: pathProgress(p, snapshot) })).find(({ p, pr }) => pr.completed > 0 && pr.nextIndex !== null && (p.tier === "free" || pro)) ??
    LEARNING_PATHS.map((p) => ({ p, pr: pathProgress(p, snapshot) })).find(({ pr }) => pr.nextIndex !== null);

  const primary = rec.primary?.missionId ? getMission(rec.primary.missionId) : null;
  const lastArena = Object.values(lab.results)
    .filter((r) => r.kind === "arena")
    .sort((a, b) => b.completedAt - a.completedAt)[0];
  const lastArenaSession = lastArena ? (lab.sessions[lastArena.sessionId] as ArenaSession | undefined) : undefined;
  const feed = activityFeed(lab, 6, LOOKUP);
  const growing = [...skillIds].sort((a, b) => lab.skills[a].theta - lab.skills[b].theta);

  return (
    <div className="ml-page ml-dash">
      <PageHead
        eyebrow={new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
        title={`${greeting()}${name ? `, ${name}` : ""}.`}
        sub={
          <>
            Level {level.level} · <span className="ml-accent-text">{rank.title}</span> · {snapshot.xp} XP earned through practice
          </>
        }
        actions={
          <div className="ml-actions">
            <Button variant="secondary" iconLeft="calculator" onClick={() => navigate("/arena/risk-calculator")}>
              Risk calculator
            </Button>
            <Button variant="primary" iconLeft="candles" onClick={() => navigate("/arena/simulator")}>
              {activeArena ? "Resume Arena" : "Open the Arena"}
            </Button>
          </div>
        }
      />

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

      <div className="ml-grid ml-grid--4">
        <Card eyebrow="Your progress" className="ml-card--stat">
          <div className="ml-kpi">
            <span className="ml-kpi-value num">Level {level.level}</span>
            <span className="ml-kpi-sub">{rank.next ? `${rank.next.title} at level ${rank.next.level}` : "Top rank"}</span>
          </div>
          <Meter value={level.into / level.needed} label={`${level.into} of ${level.needed} XP to level ${level.level + 1}`} />
          <span className="ml-fine num">
            {level.needed - level.into} XP to level {level.level + 1} · {Math.round(overall * 100)}% of the curriculum done
          </span>
        </Card>

        <Card eyebrow="Daily goal" className="ml-card--stat" action={<Link to="/settings/profile" className="ml-text-link ml-small">Edit</Link>}>
          <div className="ml-goal">
            <MiniRing value={xpToday / goal.dailyXp} size={52} stroke={5} />
            <div className="ml-kpi">
              <span className="ml-kpi-value num">
                {xpToday}
                <small> / {goal.dailyXp} XP</small>
              </span>
              <span className="ml-kpi-sub">{xpToday >= goal.dailyXp ? "Goal reached today" : `${goal.dailyXp - xpToday} XP to go today`}</span>
            </div>
          </div>
          <span className="ml-fine num">
            Weekly goal: {activeThisWeek} of {goal.weeklyDays} active days
          </span>
        </Card>

        <Card eyebrow="Learning streak" className="ml-card--stat" action={<Link to="/progress/streaks" className="ml-text-link ml-small">History</Link>}>
          <div className="ml-kpi">
            <span className="ml-kpi-value num">
              <Icon name="flame" size={22} className={cx(streak.activeToday && "ml-flame-on")} /> {streak.current} {streak.current === 1 ? "day" : "days"}
            </span>
            <span className="ml-kpi-sub">{streak.atRisk ? "Practise today to keep it going" : streak.activeToday ? "Today counts" : "Complete anything to start one"}</span>
          </div>
          <ol className="ml-weekdots" aria-label="This week">
            {week.map((d) => (
              <li key={d.day} className={cx(d.active && "is-on", d.day === today && "is-today", d.future && "is-future")} title={formatDayKey(d.day)}>
                <span aria-hidden="true">{formatDayKey(d.day, { weekday: "narrow" })}</span>
                <span className="ml-sr">
                  {formatDayKey(d.day)}: {d.active ? "active" : "no activity"}
                </span>
              </li>
            ))}
          </ol>
        </Card>

        <Card eyebrow="Current skill level" className="ml-card--stat" action={<Link to="/progress/skills" className="ml-text-link ml-small">Profile</Link>}>
          <div className="ml-kpi">
            <span className="ml-kpi-value">{LEVEL_LABEL[levelOf(meanTheta)]}</span>
            <span className="ml-kpi-sub num">Average across {skillIds.length} skills · {observations} observations</span>
          </div>
          <Meter value={thetaProgress(meanTheta)} label="Average skill estimate" />
          <span className="ml-fine">Estimated from decisions, never from profit.</span>
        </Card>
      </div>

      <div className="ml-split">
        <div className="ml-stack-5">
          <Card eyebrow="Continue learning" className="ml-card--feature">
            {activeMission ? (
              <ContinueRow
                icon="flag"
                title={getMission(activeMission.missionId).title}
                meta={`Mission in progress · saved ${relativeTime(activeMission.updatedAt)}`}
                cta="Resume mission"
                onClick={() => navigate(`/play/${activeMission.id}`)}
              />
            ) : activeArena ? (
              <ContinueRow icon="candles" title={getArenaScenario(activeArena.regime).title} meta={`Arena session in progress · saved ${relativeTime(activeArena.updatedAt)}`} cta="Resume session" onClick={() => navigate("/arena/simulator")} />
            ) : startedPath && startedPath.pr.nextIndex !== null ? (
              <PathStepRow path={startedPath.p} index={startedPath.pr.nextIndex} done={startedPath.pr.completed} />
            ) : (
              <p className="ml-muted">You've completed every path available to you. Try the Arena, or revisit a lesson.</p>
            )}
          </Card>

          {primary && (
            <Card eyebrow="Recommended next mission" className="ml-card--feature">
              <div className="ml-reco">
                <div className="ml-reco-main">
                  <h2 className="ml-reco-title">{primary.title}</h2>
                  <p className="ml-muted">{primary.tagline}</p>
                  <p className="ml-meta">
                    {SKILL_BY_ID[primary.skillPrimary].name} · {DIFFICULTY_LABEL[primary.difficulty]} · about {primary.estMinutes} min
                  </p>
                  <p className="ml-why">{rec.primary!.reason}</p>
                </div>
                <div className="ml-actions">
                  <Button variant="primary" iconRight="arrow-right" onClick={() => navigate(`/play/${store.startMission(primary.id)}`)}>
                    {store.activeSessionFor(primary.id) ? "Resume" : "Start mission"}
                  </Button>
                  <Button variant="tertiary" onClick={() => navigate(`/mission/${primary.id}`)}>
                    Details
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card title="Recent activity" action={<Link to="/journal/sessions" className="ml-text-link ml-small">Session history</Link>}>
            {feed.length === 0 ? (
              <p className="ml-muted">Nothing yet. Missions, lessons, checks and Arena sessions you complete will show up here.</p>
            ) : (
              <ul className="ml-feed">
                {feed.map((f) => (
                  <li key={f.id}>
                    <Link to={f.to} className="ml-feed-row">
                      <span className="ml-feed-icon">
                        <Icon name={f.icon} size={16} />
                      </span>
                      <span className="ml-feed-main">
                        <b>{f.title}</b>
                        <span className="ml-muted num">{f.meta}</span>
                      </span>
                      <span className="ml-feed-time">{relativeTime(f.at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <aside className="ml-stack-5" aria-label="Overview">
          <Card title="Skill development" action={<Link to="/progress/skills" className="ml-text-link ml-small">All skills</Link>}>
            <ul className="ml-skill-rows ml-skill-rows--compact">
              {growing.slice(0, 5).map((id) => {
                const st = lab.skills[id];
                return (
                  <li key={id}>
                    <span className="ml-skill-name">{SKILL_BY_ID[id].name}</span>
                    <Meter value={thetaProgress(st.theta)} label={`${SKILL_BY_ID[id].name} estimate`} />
                    <span className="ml-skill-level">{LEVEL_LABEL[levelOf(st.theta)]}</span>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title="Last simulation" action={<Link to="/arena/portfolio" className="ml-text-link ml-small">Portfolio</Link>}>
            {lastArena ? (
              <Link to={`/arena/session/${lastArena.sessionId}`} className="ml-simsum">
                <span className="ml-muted">
                  {lastArenaSession ? getArenaScenario(lastArenaSession.regime).title : "Arena"} · {relativeTime(lastArena.completedAt)}
                </span>
                <dl className="ml-trio">
                  <div>
                    <dt>Decision quality</dt>
                    <dd className="num">{lastArena.dqs ?? "—"}</dd>
                  </div>
                  <div>
                    <dt>Risk discipline</dt>
                    <dd className="num">{resultRds(lab, lastArena) ?? "—"}</dd>
                  </div>
                  <div>
                    <dt>Simulated outcome</dt>
                    <dd>
                      <Pnl value={lastArena.net} unit={false} />
                    </dd>
                  </div>
                </dl>
              </Link>
            ) : (
              <p className="ml-muted">No Arena sessions yet. Pick a scenario and trade a simulated market with virtual money.</p>
            )}
          </Card>

          <Card title="Quick actions">
            <ul className="ml-quick">
              <li>
                <Link to="/missions/daily" className="ml-quick-link">
                  <Icon name="sun" size={18} />
                  Daily challenge
                  {!lab.dailies[today] && <span className="ml-dot" aria-label="not done yet" />}
                </Link>
              </li>
              <li>
                <Link to="/arena/scenarios" className="ml-quick-link">
                  <Icon name="layers" size={18} />
                  Arena scenarios
                </Link>
              </li>
              <li>
                <Link to="/arena/risk-calculator" className="ml-quick-link">
                  <Icon name="calculator" size={18} />
                  Risk calculator
                </Link>
              </li>
              <li>
                <Link to="/learn/glossary" className="ml-quick-link">
                  <Icon name="list" size={18} />
                  Glossary
                </Link>
              </li>
            </ul>
          </Card>

          {!pro && (
            <Card className="ml-card--upgrade" eyebrow="MARKET//LAB Pro">
              <p className="ml-body">Advanced scenarios, the Intermediate and Psychology paths, full analytics history and unlimited Arena sessions.</p>
              <div className="ml-actions">
                <Button variant="secondary" iconLeft="sparkle" onClick={() => navigate("/pricing")}>
                  See plans
                </Button>
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function ContinueRow({ icon, title, meta, cta, onClick }: { icon: string; title: string; meta: string; cta: string; onClick: () => void }) {
  return (
    <div className="ml-continue">
      <span className="ml-continue-icon">
        <Icon name={icon} size={20} />
      </span>
      <div className="ml-continue-main">
        <b>{title}</b>
        <span className="ml-muted">{meta}</span>
      </div>
      <Button variant="primary" iconRight="arrow-right" onClick={onClick}>
        {cta}
      </Button>
    </div>
  );
}

function PathStepRow({ path, index, done }: { path: (typeof LEARNING_PATHS)[number]; index: number; done: number }) {
  const { navigate } = useRouter();
  const store = useStore();
  const step = path.steps[index];
  const title = step.kind === "lesson" ? getLesson(step.id)?.title : step.kind === "mission" ? getMission(step.id).title : LOOKUP.check(step.id);
  const go = () =>
    step.kind === "lesson" ? navigate(`/learn/lessons/${step.id}`) : step.kind === "mission" ? navigate(`/play/${store.startMission(step.id)}`) : navigate(`/learn/checks/${step.id}`);
  return (
    <ContinueRow
      icon={step.kind === "lesson" ? "book" : step.kind === "mission" ? "flag" : "quiz"}
      title={title ?? step.id}
      meta={`${path.title} · step ${index + 1} of ${path.steps.length}${done ? ` · ${done} done` : ""}`}
      cta={step.kind === "lesson" ? "Open lesson" : step.kind === "mission" ? "Start mission" : "Take the check"}
      onClick={go}
    />
  );
}
