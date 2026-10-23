import { useMemo, useState } from "react";
import {
  ACHIEVEMENT_CATEGORY_LABEL,
  LESSONS,
  RANKS,
  TOPICS,
  addDays,
  dayIndex,
  dayKey,
  weekActivity,
  type AchievementCategory,
} from "@market-lab/academy";
import type { SkillId } from "@market-lab/evaluation";
import { DUEL_XP_PER_DAY, LEVEL_LABEL, SKILLS, SKILL_BY_ID, XP_RULES, confidenceOf, levelOf, thetaProgress } from "@market-lab/learning";
import { MISSIONS } from "@market-lab/missions";
import { Heatmap, LineChart } from "../components/MiniCharts";
import { Card, FilterChips, PageHead, StatTile, SubNav } from "../components/Page";
import { Button, Empty, Icon, Meter, Segmented, cx } from "../components/ui";
import { formatDate, formatDayKey, plural, relativeTime } from "../format";
import { useProgress } from "../progress";
import { Link, useRouter } from "../router";
import { useLab, useStore } from "../store";

// ─── Skill profile ──────────────────────────────────────────────────────────

function Radar({ values }: { values: { label: string; v: number }[] }) {
  const n = values.length;
  const R = 92;
  const c = 120;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  };
  const poly = values.map((x, i) => pt(i, Math.max(0.04, x.v) * R).join(",")).join(" ");
  return (
    <svg viewBox="0 0 240 240" className="ml-radar" role="img" aria-label={`Skill profile: ${values.map((x) => `${x.label} ${Math.round(x.v * 100)}`).join(", ")}`}>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={values.map((_, i) => pt(i, f * R).join(",")).join(" ")} className="ml-radar-ring" />
      ))}
      {values.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} className="ml-radar-spoke" />;
      })}
      <polygon points={poly} className="ml-radar-area" />
      {values.map((x, i) => {
        const [lx, ly] = pt(i, R + 16);
        return (
          <text key={x.label} x={lx} y={ly + 3} textAnchor={lx < c - 4 ? "end" : lx > c + 4 ? "start" : "middle"} className="ml-radar-label">
            {x.label}
          </text>
        );
      })}
    </svg>
  );
}

export function SkillProfilePage() {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const { snapshot } = useProgress(lab);
  const [open, setOpen] = useState<string | null>(null);
  const [histSkill, setHistSkill] = useState<SkillId>("risk_management");
  const ranked = [...SKILLS].sort((a, b) => lab.skills[a.id].theta - lab.skills[b.id].theta);
  const weakest = ranked.filter((s) => s.id !== "reflection_review").slice(0, 3);
  const target = weakest[0];
  const targetTopic = TOPICS.find((t) => t.skill === target.id);
  const targetLesson = LESSONS.find((l) => l.topic === targetTopic?.id && !lab.lessons[l.id]?.completedAt) ?? LESSONS.find((l) => l.topic === targetTopic?.id);
  const targetMission = MISSIONS.find((m) => m.skillPrimary === target.id);
  const history = snapshot.skillHistory.filter((h) => h.skill === histSkill);

  return (
    <div className="ml-page">
      <PageHead title="Skill Profile" sub="Estimated from how you decide, never from profit. Estimates move gradually: one mistake never defines a level. They are learning indicators, not certifications." />
      <SubNav module="progress" />
      <div className="ml-split">
        <Card title="Overall profile">
          <div className="ml-profile">
            <Radar values={SKILLS.map((s) => ({ label: s.short, v: thetaProgress(lab.skills[s.id].theta) }))} />
            <dl className="ml-profile-legend">
              {SKILLS.map((s) => (
                <div key={s.id}>
                  <dt>{s.short}</dt>
                  <dd>{s.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>
        <div className="ml-stack-5">
          <Card eyebrow="Recommended next objective" className="ml-card--feature">
            <h2 className="ml-reco-title">Strengthen {target.name}</h2>
            <p className="ml-muted">
              Currently {LEVEL_LABEL[levelOf(lab.skills[target.id].theta)]} with {confidenceOf(lab.skills[target.id])} confidence. {target.description}
            </p>
            <div className="ml-actions">
              {targetLesson && (
                <Button variant="secondary" iconLeft="book" onClick={() => navigate(`/learn/lessons/${targetLesson.id}`)}>
                  {targetLesson.title}
                </Button>
              )}
              {targetMission && (
                <Button variant="primary" iconRight="arrow-right" onClick={() => navigate(`/play/${store.startMission(targetMission.id)}`)}>
                  {targetMission.title}
                </Button>
              )}
            </div>
          </Card>
          <Card title="Skills requiring improvement">
            <ul className="ml-skill-rows ml-skill-rows--compact">
              {weakest.map((s) => (
                <li key={s.id}>
                  <span className="ml-skill-name">{s.name}</span>
                  <Meter value={thetaProgress(lab.skills[s.id].theta)} label={`${s.name} estimate`} />
                  <span className="ml-skill-level">{LEVEL_LABEL[levelOf(lab.skills[s.id].theta)]}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card title="Skill-specific scores">
        <div className="ml-scale-head" aria-hidden="true">
          <span />
          <span className="ml-scale">
            <span>Novice</span>
            <span>Developing</span>
            <span>Proficient</span>
            <span>Advanced</span>
          </span>
          <span />
        </div>
        <ul className="ml-skill-table">
          {SKILLS.map((s) => {
            const st = lab.skills[s.id];
            const isOpen = open === s.id;
            const observed = lab.observed.filter((o) => o.skill === s.id);
            const byLabel = new Map<string, { n: number; good: number; at: number }>();
            for (const o of observed.slice(-20)) {
              const cur = byLabel.get(o.label) ?? { n: 0, good: 0, at: 0 };
              byLabel.set(o.label, { n: cur.n + 1, good: cur.good + (o.score >= 0.8 ? 1 : 0), at: Math.max(cur.at, o.at) });
            }
            const practice = MISSIONS.find((m) => m.skillPrimary === s.id) ?? MISSIONS.find((m) => m.skillsSecondary.includes(s.id));
            return (
              <li key={s.id} className={cx("ml-skill-item", isOpen && "is-open")}>
                <button type="button" className="ml-skill-toggle" aria-expanded={isOpen} aria-controls={`skill-${s.id}`} onClick={() => setOpen(isOpen ? null : s.id)}>
                  <span className="ml-abbr num">{s.short}</span>
                  <span className="ml-skill-id">
                    <b>{s.name}</b>
                    <span className="ml-muted">
                      {LEVEL_LABEL[levelOf(st.theta)]} · {confidenceOf(st)} confidence · {plural(st.n, "observation")}
                    </span>
                  </span>
                  <Meter value={thetaProgress(st.theta)} label={`${s.name}: ${LEVEL_LABEL[levelOf(st.theta)]}`} />
                  <Icon name="chevron-down" size={18} className="ml-chevron" />
                </button>
                <div id={`skill-${s.id}`} className="ml-skill-detail" hidden={!isOpen}>
                  <p className="ml-body">{s.description}</p>
                  {byLabel.size > 0 ? (
                    <ul className="ml-observed">
                      {[...byLabel.entries()].map(([label, v]) => (
                        <li key={label}>
                          <span>{label}</span>
                          <span className="num">
                            {v.good} of {v.n}
                          </span>
                          <span className="ml-muted">{relativeTime(v.at)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-muted">No decisions observed for this skill yet.</p>
                  )}
                  {practice && (
                    <Button size="sm" variant="secondary" iconRight="arrow-right" onClick={() => navigate(`/play/${store.startMission(practice.id)}`)}>
                      Practise with {practice.title}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card
        title="Historical progression"
        action={
          <label className="ml-select ml-select--inline">
            <span className="ml-sr">Skill</span>
            <select value={histSkill} onChange={(e) => setHistSkill(e.target.value as SkillId)}>
              {SKILLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        }
      >
        {history.length < 2 ? (
          <p className="ml-muted">Two or more completed sessions that use {SKILL_BY_ID[histSkill].name} will draw its history here.</p>
        ) : (
          <LineChart
            series={[{ id: histSkill, label: SKILL_BY_ID[histSkill].name, values: history.map((h) => Math.round(thetaProgress(h.theta) * 100)), tone: "accent" }]}
            min={0}
            max={100}
            xLabels={history.map((h) => formatDate(h.at, lab.settings.timeZone, { day: "numeric", month: "short" }))}
            description={`${SKILL_BY_ID[histSkill].name} estimate over ${history.length} updates, from ${Math.round(thetaProgress(history[0].theta) * 100)} to ${Math.round(thetaProgress(history[history.length - 1].theta) * 100)} out of 100.`}
          />
        )}
      </Card>
    </div>
  );
}

// ─── Levels & XP ────────────────────────────────────────────────────────────

const XP_REASON: Record<string, string> = {
  mission: "Mission completed",
  arena: "Arena session (30+ candles)",
  duel: "Duel completed",
  reflection: "Reflection written",
  replay: "Replay reviewed",
  placement: "Initial assessment",
  lesson: "Lesson completed",
  check: "Knowledge check passed",
  assessment: "Topic assessment passed",
  daily: "Daily challenge",
  weekly: "Weekly challenge",
};

function xpForLevel(level: number): number {
  return 150 + 50 * (level - 1);
}

export function LevelsPage() {
  const lab = useLab();
  const { level, rank, snapshot } = useProgress(lab);
  const ledger = [...lab.xp].sort((a, b) => b.at - a.at);
  const bySource = new Map<string, number>();
  for (const x of lab.xp) bySource.set(x.reason, (bySource.get(x.reason) ?? 0) + x.amount);

  return (
    <div className="ml-page">
      <PageHead title="Levels & XP" sub="XP comes only from learning activity: missions, lessons, checks, challenges and reviews. It's never awarded for simulated profit, and it can't be bought." />
      <SubNav module="progress" />
      <div className="ml-grid ml-grid--4">
        <StatTile label="Current level" value={level.level} sub={rank.title} icon="trophy" />
        <StatTile label="Total XP" value={snapshot.xp} sub={`${plural(lab.xp.length, "reward")}`} />
        <StatTile label="To the next level" value={`${level.needed - level.into} XP`} sub={<Meter value={level.into / level.needed} label="Level progress" />} />
        <StatTile label="Next rank" value={rank.next ? rank.next.title : "—"} sub={rank.next ? `At level ${rank.next.level}` : "Top rank reached"} />
      </div>
      <div className="ml-split">
        <Card title="XP history">
          {ledger.length === 0 ? (
            <p className="ml-muted">Rewards will be listed here as you learn.</p>
          ) : (
            <ul className="ml-ledger">
              {ledger.slice(0, 40).map((x) => (
                <li key={x.id}>
                  <span>{XP_REASON[x.reason] ?? x.reason}</span>
                  <span className="ml-muted ml-small">{formatDate(x.at, lab.settings.timeZone, { day: "numeric", month: "short" })}</span>
                  <span className="num ml-accent-text">+{x.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <div className="ml-stack-5">
          <Card title="Ranks">
            <ol className="ml-ranks">
              {RANKS.map((r) => (
                <li key={r.title} className={cx(r.title === rank.title && "is-current", level.level >= r.minLevel && "is-reached")}>
                  <span>{r.title}</span>
                  <span className="ml-muted num">Level {r.minLevel}+</span>
                </li>
              ))}
            </ol>
            <p className="ml-fine">Ranks name your practice. They are not qualifications or certifications.</p>
          </Card>
          <Card title="How XP is earned">
            <dl className="ml-kv">
              <div>
                <dt>Mission (by difficulty)</dt>
                <dd className="num">
                  {XP_RULES.missionByDifficulty[1]}–{XP_RULES.missionByDifficulty[5]}
                </dd>
              </div>
              <div>
                <dt>Lesson completed</dt>
                <dd className="num">{XP_RULES.lesson}</dd>
              </div>
              <div>
                <dt>Knowledge check / assessment passed</dt>
                <dd className="num">
                  {XP_RULES.checkPass} / {XP_RULES.assessmentPass}
                </dd>
              </div>
              <div>
                <dt>Daily / weekly challenge</dt>
                <dd className="num">up to 40 / 150</dd>
              </div>
              <div>
                <dt>Arena session, reflection, replay</dt>
                <dd className="num">
                  {XP_RULES.arenaSession} / {XP_RULES.reflection} / {XP_RULES.replay}
                </dd>
              </div>
              <div>
                <dt>Duel finished (first {DUEL_XP_PER_DAY} each day, win or lose)</dt>
                <dd className="num">{XP_RULES.duel}</dd>
              </div>
            </dl>
            <p className="ml-fine">Repeating the same mission on the same day earns less each time. Levels need {xpForLevel(1)} XP for level 2, then 50 more per level.</p>
          </Card>
          {bySource.size > 0 && (
            <Card title="XP by source">
              <dl className="ml-kv">
                {[...bySource.entries()]
                  .sort((a, b) => b[1] - a[1])
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt>{XP_REASON[k] ?? k}</dt>
                      <dd className="num">{v}</dd>
                    </div>
                  ))}
              </dl>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Achievements ───────────────────────────────────────────────────────────

export function AchievementsPage() {
  const lab = useLab();
  const { achievements } = useProgress(lab);
  const [cat, setCat] = useState<AchievementCategory | "all">("all");
  const shown = achievements.filter((a) => cat === "all" || a.category === cat);
  const unlocked = achievements.filter((a) => a.status.unlocked);
  const historyList = unlocked.filter((a) => a.status.at !== null).sort((a, b) => b.status.at! - a.status.at!);
  const cats = Object.keys(ACHIEVEMENT_CATEGORY_LABEL) as AchievementCategory[];

  return (
    <div className="ml-page">
      <PageHead title="Achievements" sub={`${unlocked.length} of ${achievements.length} earned. Achievements reward learning, discipline and consistency. None depends on simulated profit.`} />
      <SubNav module="progress" />
      <FilterChips
        label="Category"
        value={cat}
        onChange={setCat}
        options={[{ value: "all" as const, label: "All", count: achievements.length }, ...cats.map((c) => ({ value: c, label: ACHIEVEMENT_CATEGORY_LABEL[c], count: achievements.filter((a) => a.category === c).length }))]}
      />
      <ul className="ml-badges">
        {shown.map((a) => (
          <li key={a.id} className={cx("ml-badge", a.status.unlocked && "is-on")}>
            <span className="ml-badge-icon" aria-hidden="true">
              <Icon name={a.status.unlocked ? a.icon : "lock"} size={20} />
            </span>
            <div className="ml-badge-body">
              <b>{a.title}</b>
              <span className="ml-muted ml-small">{a.description}</span>
              {a.status.unlocked ? (
                <span className="ml-fine">{a.status.at ? `Earned ${formatDate(a.status.at, lab.settings.timeZone)}` : "Earned"}</span>
              ) : (
                <>
                  <Meter value={a.status.progress[0] / a.status.progress[1]} label={`${a.title} progress`} muted />
                  <span className="ml-fine num">
                    {a.status.progress[0]} / {a.status.progress[1]}
                  </span>
                </>
              )}
            </div>
            <span className="ml-sr">{a.status.unlocked ? "Earned" : "Not earned yet"}</span>
          </li>
        ))}
      </ul>
      <Card title="Achievement history">
        {historyList.length === 0 ? (
          <p className="ml-muted">Your first achievement is one mission away.</p>
        ) : (
          <ul className="ml-ledger">
            {historyList.map((a) => (
              <li key={a.id}>
                <span>
                  <Icon name={a.icon} size={15} /> {a.title}
                </span>
                <span className="ml-muted ml-small">{ACHIEVEMENT_CATEGORY_LABEL[a.category]}</span>
                <span className="ml-muted ml-small">{formatDate(a.status.at!, lab.settings.timeZone)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

// ─── Streaks ────────────────────────────────────────────────────────────────

export function StreaksPage() {
  const lab = useLab();
  const store = useStore();
  const { streak, days, today, xpToday } = useProgress(lab);
  const goals = lab.profile.goals;
  const week = weekActivity(days, today);
  const set = new Set(days);
  const tz = lab.settings.timeZone;
  const xpByDay = useMemo(() => {
    const m = new Map<string, number>();
    for (const x of lab.xp) {
      const k = dayKey(x.at, tz);
      m.set(k, (m.get(k) ?? 0) + x.amount);
    }
    return m;
  }, [lab.xp, tz]);
  const weeks = useMemo(() => {
    const mondayIdx = dayIndex(week[0].day);
    return Array.from({ length: 16 }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => {
        const day = addDays(week[0].day, (w - 15) * 7 + d);
        const xp = xpByDay.get(day) ?? 0;
        const level = (!set.has(day) ? 0 : xp >= goals.dailyXp ? 3 : xp >= goals.dailyXp / 2 ? 2 : 1) as 0 | 1 | 2 | 3;
        return { day, level, title: `${formatDayKey(day)}: ${set.has(day) ? `${xp} XP` : "no activity"}`, future: dayIndex(day) > dayIndex(today) && dayIndex(day) >= mondayIdx };
      }),
    );
  }, [week, xpByDay, set, goals.dailyXp, today]);
  const activeWeek = week.filter((d) => d.active).length;
  const xpWeek = week.reduce((s, d) => s + (xpByDay.get(d.day) ?? 0), 0);

  return (
    <div className="ml-page">
      <PageHead title="Learning Streaks" sub="A day counts when you complete something meaningful: a mission, an Arena session, a lesson, a check, a daily challenge or a reflection. Opening the app isn't enough." />
      <SubNav module="progress" />
      <div className="ml-grid ml-grid--4">
        <StatTile label="Current streak" value={plural(streak.current, "day")} sub={streak.atRisk ? "Practise today to keep it" : streak.activeToday ? "Today already counts" : "Start one today"} icon="flame" />
        <StatTile label="Longest streak" value={plural(streak.longest, "day")} />
        <StatTile label="This week" value={`${activeWeek} / ${goals.weeklyDays} days`} sub={activeWeek >= goals.weeklyDays ? "Weekly goal met" : `${goals.weeklyDays - activeWeek} to go`} />
        <StatTile label="Today" value={`${xpToday} / ${goals.dailyXp} XP`} sub={xpToday >= goals.dailyXp ? "Daily goal met" : "Daily goal"} />
      </div>
      <Card title="Last 16 weeks">
        <div className="ml-heat-wrap">
          <div className="ml-heat-days" aria-hidden="true">
            {["Mon", "", "Wed", "", "Fri", "", "Sun"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <Heatmap weeks={weeks} label={`Activity over the last 16 weeks: ${days.length} active days in total.`} />
        </div>
        <div className="ml-heat-legend" aria-hidden="true">
          <span>Less</span>
          {[0, 1, 2, 3].map((l) => (
            <span key={l} className={`ml-heat ml-heat--${l}`} />
          ))}
          <span>More XP</span>
        </div>
      </Card>
      <div className="ml-grid ml-grid--2">
        <Card title="This week">
          <ol className="ml-weekdots ml-weekdots--lg">
            {week.map((d) => (
              <li key={d.day} className={cx(d.active && "is-on", d.day === today && "is-today", d.future && "is-future")}>
                <span aria-hidden="true">{formatDayKey(d.day, { weekday: "short" })}</span>
                <span className="ml-sr">
                  {formatDayKey(d.day)}: {d.active ? "active" : "no activity"}
                </span>
              </li>
            ))}
          </ol>
          <p className="ml-muted num">
            {activeWeek} active {activeWeek === 1 ? "day" : "days"} · {xpWeek} XP this week
          </p>
        </Card>
        <Card title="Personal goals">
          <div className="ml-setting">
            <div>
              <b>Daily XP goal</b>
              <p className="ml-muted">Roughly one mission, or a lesson and a challenge.</p>
            </div>
            <Segmented label="Daily XP goal" size="sm" value={String(goals.dailyXp)} onChange={(v) => store.setGoals({ dailyXp: Number(v) })} options={[30, 50, 100, 150].map((v) => ({ value: String(v), label: String(v) }))} />
          </div>
          <div className="ml-setting">
            <div>
              <b>Active days per week</b>
              <p className="ml-muted">Consistency beats intensity.</p>
            </div>
            <Segmented label="Active days per week" size="sm" value={String(goals.weeklyDays)} onChange={(v) => store.setGoals({ weeklyDays: Number(v) })} options={[2, 3, 4, 5, 7].map((v) => ({ value: String(v), label: String(v) }))} />
          </div>
        </Card>
      </div>
      <Card title="Streak history">
        {streak.history.length === 0 ? (
          <p className="ml-muted">Streaks of two days or more will be listed here.</p>
        ) : (
          <ul className="ml-ledger">
            {streak.history.map((r) => (
              <li key={r.start}>
                <span>
                  <Icon name="flame" size={15} /> {plural(r.length, "day")}
                </span>
                <span className="ml-muted ml-small">
                  {formatDayKey(r.start, { day: "numeric", month: "short" })} – {formatDayKey(r.end, { day: "numeric", month: "short" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

// ─── Milestones ─────────────────────────────────────────────────────────────

export function MilestonesPage() {
  const lab = useLab();
  const { milestones, snapshot } = useProgress(lab);
  const reached = milestones.filter((m) => m.reached).sort((a, b) => (b.at ?? 0) - (a.at ?? 0));
  const upcoming = milestones.filter((m) => !m.reached);
  const tz = lab.settings.timeZone;
  const months = useMemo(() => {
    const m = new Map<string, { missions: number; lessons: number; checks: number; xp: number }>();
    const key = (t: number) => dayKey(t, tz).slice(0, 7);
    const bump = (t: number, f: "missions" | "lessons" | "checks", n = 1) => {
      const k = key(t);
      const cur = m.get(k) ?? { missions: 0, lessons: 0, checks: 0, xp: 0 };
      cur[f] += n;
      m.set(k, cur);
    };
    snapshot.missions.forEach((x) => bump(x.at, "missions"));
    snapshot.lessons.forEach((x) => bump(x.at, "lessons"));
    snapshot.checks.filter((c) => c.passed).forEach((x) => bump(x.at, "checks"));
    lab.xp.forEach((x) => {
      const k = key(x.at);
      const cur = m.get(k) ?? { missions: 0, lessons: 0, checks: 0, xp: 0 };
      cur.xp += x.amount;
      m.set(k, cur);
    });
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6);
  }, [snapshot, lab.xp, tz]);

  const icon = (k: string) => (k === "path" ? "route" : k === "skill" ? "trend" : k === "assessment" ? "medal" : "star");

  return (
    <div className="ml-page">
      <PageHead title="Milestones" sub="The bigger steps: finished learning paths, skill levels reached, assessments passed and personal improvements." />
      <SubNav module="progress" />
      <div className="ml-split">
        <Card title="Reached">
          {reached.length === 0 ? (
            <Empty icon="flag" title="No milestones yet">
              Complete a learning path, pass a topic assessment or move a skill up a level.
            </Empty>
          ) : (
            <ol className="ml-milestones">
              {reached.map((m) => (
                <li key={m.id}>
                  <span className="ml-milestone-icon">
                    <Icon name={icon(m.kind)} size={16} />
                  </span>
                  <div>
                    <b>{m.title}</b>
                    <span className="ml-muted ml-small">
                      {m.detail}
                      {m.at ? ` · ${formatDate(m.at, tz)}` : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
        <Card title="Up next">
          <ul className="ml-milestones ml-milestones--upcoming">
            {upcoming.slice(0, 8).map((m) => (
              <li key={m.id}>
                <span className="ml-milestone-icon">
                  <Icon name={icon(m.kind)} size={16} />
                </span>
                <div>
                  <b>{m.title}</b>
                  <span className="ml-muted ml-small">{m.detail}</span>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/learn/paths" className="ml-text-link ml-small">
            Learning paths
          </Link>
        </Card>
      </div>
      <Card title="Progress summaries" eyebrow="By month">
        {months.length === 0 ? (
          <p className="ml-muted">Monthly summaries appear once you've completed something.</p>
        ) : (
          <div className="ml-table-wrap">
            <table className="ml-table">
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col" className="num">
                    Missions
                  </th>
                  <th scope="col" className="num">
                    Lessons
                  </th>
                  <th scope="col" className="num">
                    Checks passed
                  </th>
                  <th scope="col" className="num">
                    XP
                  </th>
                </tr>
              </thead>
              <tbody>
                {months.map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">{new Date(`${k}-01T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })}</th>
                    <td className="num">{v.missions}</td>
                    <td className="num">{v.lessons}</td>
                    <td className="num">{v.checks}</td>
                    <td className="num">{v.xp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
