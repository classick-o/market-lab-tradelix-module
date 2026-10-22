/**
 * Lesson scripts. The original lessons carry theirs; course lessons point to a unit file that is
 * loaded on demand (src/generated/scripts), so opening the app doesn't download the whole course.
 */
import { SCRIPT_LOADERS } from "./generated/script-loaders";
import type { Lesson, LessonScript } from "./types";

const cache = new Map<string, Promise<Record<string, LessonScript>>>();

/** True when the lesson is interactive (its script is here or can be loaded). */
export const hasScript = (l: Lesson): boolean => !!(l.script || l.scriptRef);

/** The lesson's check question ids, without loading its script. */
export const lessonCheckIds = (l: Lesson): string[] => l.script?.check ?? l.scriptRef?.check ?? [];

/** The lesson's course position, without loading its script. */
export const lessonCourseId = (l: Lesson): string | undefined => l.script?.courseId ?? l.scriptRef?.courseId;

export function loadLessonScript(l: Lesson): Promise<LessonScript | undefined> {
  if (l.script) return Promise.resolve(l.script);
  const ref = l.scriptRef;
  const load = ref && SCRIPT_LOADERS[ref.unit];
  if (!ref || !load) return Promise.resolve(undefined);
  if (!cache.has(ref.unit)) cache.set(ref.unit, load().then((m) => m.default));
  return cache.get(ref.unit)!.then((scripts) => scripts[l.id]);
}
