import { useMemo } from "react";
import {
  activeDays,
  dayKey,
  evaluateAchievements,
  getCheck,
  milestones,
  rankOf,
  streakInfo,
  type ProgressSnapshot,
} from "@market-lab/academy";
import { riskDisciplineScore, type SkillId } from "@market-lab/evaluation";
import { levelFromXp } from "@market-lab/learning";
import { arenaContext, evaluateArena, evaluateMission, getMission } from "@market-lab/missions";
import { totalXp, type LabData, type StoredResult } from "./store";

const rdsCache = new Map<string, number | null>();

/** Risk Discipline for a stored result; recomputed (once) for results saved before the score existed. */
export function resultRds(lab: LabData, r: StoredResult): number | null {
  if (r.rds !== undefined) return r.rds;
  if (rdsCache.has(r.sessionId)) return rdsCache.get(r.sessionId)!;
  const s = lab.sessions[r.sessionId];
  let rds: number | null = null;
  try {
    if (s?.kind === "mission") rds = riskDisciplineScore(evaluateMission(getMission(s.missionId), s.variantIdx, s.log).dqs.criteria);
    else if (s?.kind === "arena") {
      const { ctx, scenario } = arenaContext(s.regime, s.seed);
      rds = evaluateArena(ctx, s.log, scenario).rds;
    }
  } catch {
    rds = null;
  }
  rdsCache.set(r.sessionId, rds);
  return rds;
}

export function buildSnapshot(lab: LabData, now = Date.now()): ProgressSnapshot {
  const results = Object.values(lab.results);
  const xp = totalXp(lab);
  const skillHistory = results
    .flatMap((r) => r.skillDeltas.map((d) => ({ skill: d.skill as SkillId, theta: d.after, at: r.completedAt })))
    .sort((a, b) => a.at - b.at);
  return {
    now,
    tz: lab.settings.timeZone,
    missions: results
      .filter((r) => r.kind === "mission")
      .map((r) => ({ sessionId: r.sessionId, missionId: r.missionId, dqs: r.dqs, rds: resultRds(lab, r), net: r.net, at: r.completedAt })),
    arena: results
      .filter((r) => r.kind === "arena")
      .map((r) => {
        const s = lab.sessions[r.sessionId];
        return {
          sessionId: r.sessionId,
          scenario: s?.kind === "arena" ? s.regime : "unknown",
          dqs: r.dqs,
          rds: resultRds(lab, r),
          trades: r.trades ?? (r.dqs !== null ? 1 : 0),
          completed: r.completionMet ?? false,
          at: r.completedAt,
        };
      }),
    lessons: Object.entries(lab.lessons)
      .filter(([, v]) => v.completedAt)
      .map(([id, v]) => ({ id, at: v.completedAt! })),
    checks: Object.entries(lab.checks).flatMap(([id, attempts]) => {
      const def = getCheck(id);
      if (!def) return [];
      return attempts.map((a) => ({ id, topic: def.topic, kind: def.kind, pct: a.total ? (a.correct / a.total) * 100 : 0, passed: a.passed, at: a.at }));
    }),
    dailies: Object.entries(lab.dailies).map(([day, v]) => ({ day, at: v.at, correct: v.correct, total: v.total })),
    weeklies: Object.entries(lab.weeklies).map(([week, v]) => ({ week, at: v.at })),
    reflections: Object.values(lab.reflections).map((r) => ({ at: r.at })),
    replays: lab.xp.filter((x) => x.reason === "replay").map((x) => ({ at: x.at })),
    skillHistory,
    skills: lab.skills,
    xp,
    level: levelFromXp(xp).level,
  };
}

/** Derived progression state, memoised on the stored data. */
export function useProgress(lab: LabData) {
  return useMemo(() => {
    const now = Date.now();
    const snapshot = buildSnapshot(lab, now);
    const today = dayKey(now, lab.settings.timeZone);
    const days = activeDays(snapshot);
    const streak = streakInfo(days, today);
    const lvl = levelFromXp(snapshot.xp);
    const achievements = evaluateAchievements(snapshot);
    return {
      snapshot,
      today,
      days,
      streak,
      level: lvl,
      rank: rankOf(lvl.level),
      achievements,
      milestones: milestones(snapshot),
      xpToday: lab.xp.filter((x) => dayKey(x.at, lab.settings.timeZone) === today).reduce((s, x) => s + x.amount, 0),
    };
  }, [lab]);
}

export type ProgressState = ReturnType<typeof useProgress>;

export interface ActivityItem {
  id: string;
  at: number;
  icon: string;
  title: string;
  meta: string;
  to: string;
}

/** Recent learning activity across missions, sessions, lessons, checks and challenges, newest first. */
export function activityFeed(lab: LabData, limit = 8, lookup: { mission: (id: string) => string; lesson: (id: string) => string; check: (id: string) => string; scenario: (id: string) => string }): ActivityItem[] {
  const items: ActivityItem[] = [];
  for (const r of Object.values(lab.results)) {
    const s = lab.sessions[r.sessionId];
    if (r.kind === "mission")
      items.push({ id: r.sessionId, at: r.completedAt, icon: "flag", title: lookup.mission(r.missionId), meta: `Mission · decision quality ${r.dqs ?? "—"}`, to: `/debrief/${r.sessionId}` });
    else items.push({ id: r.sessionId, at: r.completedAt, icon: "candles", title: lookup.scenario(s?.kind === "arena" ? s.regime : ""), meta: `Arena session · discipline ${resultRds(lab, r) ?? "—"}`, to: `/arena/session/${r.sessionId}` });
  }
  for (const [id, v] of Object.entries(lab.lessons)) if (v.completedAt) items.push({ id, at: v.completedAt, icon: "book", title: lookup.lesson(id), meta: "Lesson completed", to: `/learn/lessons/${id}` });
  for (const [id, attempts] of Object.entries(lab.checks))
    for (const a of attempts) items.push({ id: `${id}-${a.at}`, at: a.at, icon: "quiz", title: lookup.check(id), meta: `${a.correct} of ${a.total} correct${a.passed ? " · passed" : ""}`, to: `/learn/checks/${id}` });
  for (const [day, d] of Object.entries(lab.dailies)) items.push({ id: day, at: d.at, icon: "sun", title: "Daily challenge", meta: `${d.correct} of ${d.total} correct`, to: "/missions/daily" });
  return items.sort((a, b) => b.at - a.at).slice(0, limit);
}
