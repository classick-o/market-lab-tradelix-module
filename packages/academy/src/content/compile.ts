/**
 * Splits the course content written in code (content/course/u*.ts) into what the app needs at once
 * (lesson metadata, questions, terms, concepts) and what it loads when a lesson opens (the scripts,
 * one file per unit). `scripts/build-content.ts` writes the result to src/generated; a test checks
 * the generated files match this function's output.
 */
import { COURSE_UNITS_CONTENT } from "./course";
import type { Concept, GlossaryTerm, Lesson, LessonScript, Question, UnitIntro } from "../types";

export interface CompiledContent {
  meta: { lessons: Lesson[]; questions: Question[]; terms: GlossaryTerm[]; concepts: Concept[]; units: Record<string, UnitIntro> };
  /** Scripts by unit id, then lesson id. */
  scripts: Record<string, Record<string, LessonScript>>;
}

export function compileCourseContent(): CompiledContent {
  const meta: CompiledContent["meta"] = { lessons: [], questions: [], terms: [], concepts: [], units: {} };
  const scripts: CompiledContent["scripts"] = {};
  for (const [unit, content] of Object.entries(COURSE_UNITS_CONTENT)) {
    if (content.intro) meta.units[unit] = content.intro;
    for (const lesson of content.lessons) {
      const { script, ...rest } = lesson;
      if (script) {
        (scripts[unit] ??= {})[lesson.id] = script;
        meta.lessons.push({ ...rest, scriptRef: { unit, courseId: script.courseId, check: script.check } });
      } else meta.lessons.push(rest);
    }
    meta.questions.push(...content.questions);
    meta.terms.push(...content.terms);
    meta.concepts.push(...content.concepts);
  }
  return { meta, scripts };
}

/** Unit id → generated file stem, e.g. "1.2" → "u1-2". */
export const unitFile = (unit: string) => `u${unit.replace(".", "-")}`;
