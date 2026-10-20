import type { SkillId } from "@market-lab/evaluation";
import { addDays, dayIndex, dayKey, weekDays } from "./calendar";
import type { LearningPath, PathStep, TopicId } from "./types";

/**
 * Everything progression rules look at, derived from the user's stored activity.
 * Achievements, streaks, milestones and weekly goals are computed from it; nothing is stored twice.
 */
export interface ProgressSnapshot {
  now: number;
  /** IANA time zone or "auto". */
  tz?: string;
  missions: { sessionId: string; missionId: string; dqs: number | null; rds: number | null; net: number; at: number }[];
  arena: { sessionId: string; scenario: string; dqs: number | null; rds: number | null; trades: number; completed: boolean; at: number }[];
  lessons: { id: string; at: number }[];
  checks: { id: string; topic: TopicId; kind: "check" | "assessment"; pct: number; passed: boolean; at: number }[];
  dailies: { day: string; at: number; correct: number; total: number }[];
  weeklies: { week: string; at: number }[];
  reflections: { at: number }[];
  replays: { at: number }[];
  /** θ after each update, oldest first. */
  skillHistory: { skill: SkillId; theta: number; at: number }[];
  skills: Record<SkillId, { theta: number }>;
  xp: number;
  level: number;
}

/** Timestamps of meaningful learning activity: completed missions, sessions, lessons, checks, challenges and reflections. */
export function activityTimes(s: ProgressSnapshot): number[] {
  return [
    ...s.missions.map((m) => m.at),
    ...s.arena.filter((a) => a.trades > 0 || a.completed).map((a) => a.at),
    ...s.lessons.map((l) => l.at),
    ...s.checks.map((c) => c.at),
    ...s.dailies.map((d) => d.at),
    ...s.reflections.map((r) => r.at),
  ];
}

export function activeDays(s: ProgressSnapshot): string[] {
  return [...new Set(activityTimes(s).map((t) => dayKey(t, s.tz)))].sort();
}

export interface StreakInfo {
  current: number;
  longest: number;
  /** Today has no activity yet, but the streak is still alive from yesterday. */
  atRisk: boolean;
  activeToday: boolean;
  /** Runs of two or more consecutive active days, newest first. */
  history: { start: string; end: string; length: number }[];
}

export function streakInfo(days: string[], today: string): StreakInfo {
  const set = new Set(days);
  const runs: { start: string; end: string; length: number }[] = [];
  let run: { start: string; end: string; length: number } | null = null;
  for (const d of days) {
    if (run && dayIndex(d) === dayIndex(run.end) + 1) {
      run.end = d;
      run.length++;
    } else {
      if (run) runs.push(run);
      run = { start: d, end: d, length: 1 };
    }
  }
  if (run) runs.push(run);
  const activeToday = set.has(today);
  const yesterday = addDays(today, -1);
  const last = runs[runs.length - 1];
  const current = last && (last.end === today || last.end === yesterday) ? last.length : 0;
  return {
    current,
    longest: runs.reduce((m, r) => Math.max(m, r.length), 0),
    atRisk: !activeToday && current > 0,
    activeToday,
    history: runs.filter((r) => r.length >= 2).reverse(),
  };
}

/** Active days in the week containing `today` (Monday first). */
export function weekActivity(days: string[], today: string): { day: string; active: boolean; future: boolean }[] {
  const set = new Set(days);
  return weekDays(today).map((d) => ({ day: d, active: set.has(d), future: dayIndex(d) > dayIndex(today) }));
}

// ─── Learning paths ─────────────────────────────────────────────────────────

export function stepDone(step: PathStep, s: ProgressSnapshot): number | null {
  if (step.kind === "lesson") return s.lessons.find((l) => l.id === step.id)?.at ?? null;
  if (step.kind === "mission") {
    const done = s.missions.filter((m) => m.missionId === step.id).sort((a, b) => a.at - b.at)[0];
    return done?.at ?? null;
  }
  const passed = s.checks.filter((c) => c.id === step.id && c.passed).sort((a, b) => a.at - b.at)[0];
  return passed?.at ?? null;
}

export interface PathProgress {
  done: (number | null)[];
  completed: number;
  total: number;
  pct: number;
  /** When the last remaining step was completed, if the path is complete. */
  completedAt: number | null;
  nextIndex: number | null;
}

export function pathProgress(path: LearningPath, s: ProgressSnapshot): PathProgress {
  const done = path.steps.map((st) => stepDone(st, s));
  const completed = done.filter((d) => d !== null).length;
  const next = done.findIndex((d) => d === null);
  return {
    done,
    completed,
    total: path.steps.length,
    pct: path.steps.length ? completed / path.steps.length : 0,
    completedAt: completed === path.steps.length && completed > 0 ? Math.max(...(done as number[])) : null,
    nextIndex: next === -1 ? null : next,
  };
}
