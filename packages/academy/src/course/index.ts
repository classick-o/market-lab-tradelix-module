/**
 * The course: 5 levels, 44 units, 340 lessons (docs/learn/course). A course lesson is playable when
 * an app lesson implements it: the old lessons keep their ids (L01…), new ones use the course id.
 */
import { LESSONS, getCheck } from "../catalog";
import type { KnowledgeCheck, Lesson, TopicId } from "../types";
import { lessonCheckIds, lessonCourseId } from "../lesson-scripts";
import { COURSE_LEVELS } from "./map";
import type { CourseLesson, CourseLevel, CourseUnit } from "./types";

export * from "./types";
export { COURSE_LEVELS };

export const COURSE_UNITS: CourseUnit[] = COURSE_LEVELS.flatMap((l) => l.units);
export const COURSE_LESSONS: CourseLesson[] = COURSE_UNITS.flatMap((u) => u.lessons);

const lessonById = new Map(COURSE_LESSONS.map((l) => [l.id, l]));
const unitById = new Map(COURSE_UNITS.map((u) => [u.id, u]));
const appLessons = new Map(LESSONS.map((l) => [l.id, l]));
const byAppId = new Map<string, CourseLesson>();
for (const cl of COURSE_LESSONS) {
  const app = cl.legacy && appLessons.has(cl.legacy) ? cl.legacy : appLessons.has(cl.id) ? cl.id : undefined;
  if (app) byAppId.set(app, cl);
}

export const getCourseLesson = (id: string): CourseLesson | undefined => lessonById.get(id);
export const getCourseUnit = (id: string): CourseUnit | undefined => unitById.get(id);
export const getCourseLevel = (id: number): CourseLevel | undefined => COURSE_LEVELS.find((l) => l.id === id);

/** The app lesson that teaches a course lesson, if it's written yet. */
export function appLessonFor(cl: CourseLesson): Lesson | undefined {
  return (cl.legacy && appLessons.get(cl.legacy)) || appLessons.get(cl.id);
}

/** The course position of an app lesson (by its id or its script). */
export function courseLessonFor(appId: string): CourseLesson | undefined {
  const app = appLessons.get(appId);
  const courseId = app && lessonCourseId(app);
  return byAppId.get(appId) ?? (courseId ? lessonById.get(courseId) : undefined);
}

/** Course lessons in the recommended order: levels, then units, then lessons. */
export const COURSE_ORDER: CourseLesson[] = COURSE_LESSONS;

export const PLAYABLE_LESSONS: CourseLesson[] = COURSE_ORDER.filter((cl) => appLessonFor(cl));

export interface LessonState {
  startedAt?: number;
  completedAt?: number;
  testedOutAt?: number;
  readAt?: number;
}

export type NextStep =
  | { kind: "lesson"; lessonId: string; title: string; reason: "in-progress" | "next" }
  | { kind: "review"; due: number }
  | { kind: "done" };

/**
 * "Next step", one rule used everywhere (PLAN_LEARN §6.6): a lesson started and not finished; the
 * review when 5 or more are due; the next lesson of the course not yet done or tested out.
 */
export function nextLearnStep(lessons: Record<string, LessonState>, reviewsDue: number): NextStep {
  const done = (id: string) => !!(lessons[id]?.completedAt || lessons[id]?.testedOutAt);
  const started = PLAYABLE_LESSONS.map((cl) => appLessonFor(cl)!)
    .filter((l) => lessons[l.id]?.startedAt && !done(l.id) && !lessons[l.id]?.readAt)
    .sort((a, b) => (lessons[b.id].startedAt ?? 0) - (lessons[a.id].startedAt ?? 0))[0];
  if (started) return { kind: "lesson", lessonId: started.id, title: started.title, reason: "in-progress" };
  if (reviewsDue >= 5) return { kind: "review", due: reviewsDue };
  for (const cl of PLAYABLE_LESSONS) {
    const l = appLessonFor(cl)!;
    if (!done(l.id)) return { kind: "lesson", lessonId: l.id, title: l.title, reason: "next" };
  }
  if (reviewsDue > 0) return { kind: "review", due: reviewsDue };
  return { kind: "done" };
}

/** Progress through a unit: playable lessons done, and how many of its lessons are written yet. */
export function unitProgress(unit: CourseUnit, lessons: Record<string, LessonState>): { done: number; playable: number; total: number } {
  const playable = unit.lessons.map(appLessonFor).filter((l): l is Lesson => !!l);
  return {
    done: playable.filter((l) => lessons[l.id]?.completedAt || lessons[l.id]?.testedOutAt).length,
    playable: playable.length,
    total: unit.lessons.length,
  };
}

// ─── Unit checkpoints ──────────────────────────────────────────────────────

export const unitCheckpointId = (unitId: string) => `unit-${unitId}`;

/**
 * A unit's checkpoint: every check question of its written lessons. At 80% or more the unit's
 * lessons count as done ("Tested out"), without lesson XP (PLAN_LEARN §3.1).
 */
export function unitCheckpoint(unitId: string): KnowledgeCheck | undefined {
  const unit = getCourseUnit(unitId);
  if (!unit) return undefined;
  const lessons = unit.lessons.map(appLessonFor).filter((l): l is Lesson => !!l);
  const questionIds = [...new Set(lessons.flatMap(lessonCheckIds))];
  if (questionIds.length < 3) return undefined;
  const count = new Map<TopicId, number>();
  for (const l of lessons) count.set(l.topic, (count.get(l.topic) ?? 0) + 1);
  const topic = [...count.entries()].sort((a, b) => b[1] - a[1])[0][0];
  return {
    id: unitCheckpointId(unitId),
    title: `Unit ${unitId} checkpoint`,
    topic,
    description: `${questionIds.length} questions from the lessons of ${unit.title}. Score 80% or more and its lessons count as done.`,
    questionIds,
    passPct: 80,
    kind: "assessment",
  };
}

/** A topic check, a topic assessment or a unit checkpoint. */
export function getAnyCheck(id: string): KnowledgeCheck | undefined {
  return getCheck(id) ?? (id.startsWith("unit-") ? unitCheckpoint(id.slice(5)) : undefined);
}

/** The written lessons a unit checkpoint covers. */
export function unitLessonIds(unitId: string): string[] {
  return (getCourseUnit(unitId)?.lessons ?? []).map(appLessonFor).filter((l): l is Lesson => !!l).map((l) => l.id);
}
