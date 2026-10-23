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
  /** Finished daily reviews (spaced repetition). */
  reviews?: { at: number }[];
  /** Finished duels against a bot. */
  duels?: { at: number }[];
  /** θ after each update, oldest first. */
  skillHistory: { skill: SkillId; theta: number; at: number }[];
  skills: Record<SkillId, { theta: number }>;
  xp: number;
  level: number;
}

/** Timestamps of meaningful learning activity: completed missions, sessions, duels, lessons, checks, challenges and reflections. */
export function activityTimes(s: ProgressSnapshot): number[] {
  return [
    ...s.missions.map((m) => m.at),
    ...s.arena.filter((a) => a.trades > 0 || a.completed).map((a) => a.at),
    ...s.lessons.map((l) => l.at),
    ...s.checks.map((c) => c.at),
    ...s.dailies.map((d) => d.at),
    ...s.reflections.map((r) => r.at),
    ...(s.reviews ?? []).map((r) => r.at),
    ...(s.duels ?? []).map((d) => d.at),
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
  /** Missed days the current streak skipped over with a pause. */
  paused: string[];
  /** Pauses left this week (Monday to Sunday). */
  pausesLeft: number;
}

/** Monday of the week containing a day key. */
function weekOf(day: string): number {
  const i = dayIndex(day);
  // dayIndex 0 is 1970-01-01, a Thursday: shift so weeks start on Monday.
  return Math.floor((i + 3) / 7);
}

/**
 * The learning streak. With `pausesPerWeek` (PLAN_LEARN §17: 2, automatic), up to that many missed days
 * in a calendar week keep the streak alive without counting towards its length.
 */
export function streakInfo(days: string[], today: string, pausesPerWeek = 0): StreakInfo {
  if (pausesPerWeek > 0) return streakWithPauses(days, today, pausesPerWeek);
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
    paused: [],
    pausesLeft: 0,
  };
}

function streakWithPauses(days: string[], today: string, pausesPerWeek: number): StreakInfo {
  const set = new Set(days);
  const used = new Map<number, number>();
  const runs: { start: string; end: string; length: number; paused: string[] }[] = [];
  let run: { start: string; end: string; length: number; paused: string[] } | null = null;
  const first = days.length ? days[0] : today;
  const t = dayIndex(today);
  for (let i = dayIndex(first); i <= t; i++) {
    const d = addDays(first, i - dayIndex(first));
    if (set.has(d)) {
      if (!run) run = { start: d, end: d, length: 0, paused: [] };
      run.end = d;
      run.length++;
      continue;
    }
    if (!run || i === t) continue; // Today isn't over yet.
    const w = weekOf(d);
    if ((used.get(w) ?? 0) < pausesPerWeek) {
      used.set(w, (used.get(w) ?? 0) + 1);
      run.paused.push(d);
      continue;
    }
    runs.push(run);
    run = null;
  }
  if (run) runs.push(run);
  const activeToday = set.has(today);
  const last = runs[runs.length - 1];
  // Alive when the run reached yesterday, either active or paused.
  const lastDay = last ? Math.max(dayIndex(last.end), ...last.paused.map(dayIndex)) : -Infinity;
  const alive = !!last && lastDay >= t - 1;
  const current = alive ? last.length : 0;
  return {
    current,
    longest: runs.reduce((m, r) => Math.max(m, r.length), 0),
    atRisk: !activeToday && current > 0,
    activeToday,
    history: runs.filter((r) => r.length >= 2).map(({ start, end, length }) => ({ start, end, length })).reverse(),
    paused: alive ? last.paused : [],
    pausesLeft: Math.max(0, pausesPerWeek - (used.get(weekOf(today)) ?? 0)),
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
