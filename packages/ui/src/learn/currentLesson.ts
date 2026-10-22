import { createContext, useContext } from "react";
import { COURSE_LESSONS, courseLessonFor } from "@market-lab/academy";

const ORDER = new Map(COURSE_LESSONS.map((l, i) => [l.id, i]));

/** Course position of an app lesson id (L01… or a course id), for "taught later" notes. */
export function coursePosition(lessonId: string | undefined): number | undefined {
  if (!lessonId) return undefined;
  return ORDER.get(courseLessonFor(lessonId)?.id ?? lessonId);
}

/** The lesson being played or read, so glossary cards can say when a term is taught later. */
export const CurrentLessonContext = createContext<string | null>(null);
export const useCurrentLesson = () => useContext(CurrentLessonContext);
