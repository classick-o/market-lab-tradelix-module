import { CONCEPTS as BASE_CONCEPTS } from "./content/concepts";
import { GLOSSARY as BASE_GLOSSARY } from "./content/glossary";
import { LESSONS_A } from "./content/lessons-a";
import { LESSONS_B } from "./content/lessons-b";
import { QUESTIONS_A } from "./content/questions-a";
import { QUESTIONS_B } from "./content/questions-b";
import { COURSE_CONTENT_CONCEPTS, COURSE_CONTENT_LESSONS, COURSE_CONTENT_QUESTIONS, COURSE_CONTENT_TERMS } from "./content/course";
import { SCRIPTS, SCRIPT_CONCEPTS, SCRIPT_TERMS } from "./content/scripts";
import { assessmentId, checkId } from "./paths";
import { TOPICS } from "./topics";
import type { Concept, GlossaryTerm, KnowledgeCheck, Lesson, Question, TopicId } from "./types";

/** Lessons, each with its interactive script when one exists. */
export const LESSONS: Lesson[] = [
  ...[...LESSONS_A, ...LESSONS_B].map((l) => (SCRIPTS[l.id] ? { ...l, script: SCRIPTS[l.id] } : l)).sort((a, b) => a.id.localeCompare(b.id)),
  // Lessons written directly in code, in course order (ids are course positions, e.g. "1.1.2").
  ...COURSE_CONTENT_LESSONS,
];
export const QUESTIONS: Question[] = [...QUESTIONS_A, ...QUESTIONS_B, ...COURSE_CONTENT_QUESTIONS];
export const CONCEPTS: Concept[] = [...BASE_CONCEPTS, ...SCRIPT_CONCEPTS, ...COURSE_CONTENT_CONCEPTS];
export const GLOSSARY: GlossaryTerm[] = [...BASE_GLOSSARY, ...SCRIPT_TERMS, ...COURSE_CONTENT_TERMS];

const byId = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]));
const lessonMap = byId(LESSONS);
const questionMap = byId(QUESTIONS);
const conceptMap = byId(CONCEPTS);
const termMap = byId(GLOSSARY);

export const getLesson = (id: string): Lesson | undefined => lessonMap.get(id);
export const getQuestion = (id: string): Question | undefined => questionMap.get(id);
export const getConcept = (id: string): Concept | undefined => conceptMap.get(id);
export const getTerm = (id: string): GlossaryTerm | undefined => termMap.get(id);

export function questionsFor(topic: TopicId): Question[] {
  return QUESTIONS.filter((q) => q.topic === topic).sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id, undefined, { numeric: true }));
}

/** Five questions spread across difficulties: two easy, two medium, one hard where available. */
function practiceSet(topic: TopicId): string[] {
  const qs = questionsFor(topic);
  const pick: Question[] = [];
  for (const [d, n] of [[1, 2], [2, 2], [3, 1]] as const) pick.push(...qs.filter((q) => q.difficulty === d).slice(0, n));
  for (const q of qs) if (pick.length < 5 && !pick.includes(q)) pick.push(q);
  return pick.slice(0, 5).map((q) => q.id);
}

/** One short knowledge check per topic (practice) and one longer topic assessment. */
export const KNOWLEDGE_CHECKS: KnowledgeCheck[] = TOPICS.flatMap((t): KnowledgeCheck[] => [
  {
    id: checkId(t.id),
    title: `${t.name} check`,
    topic: t.id,
    description: `Five questions on ${t.name.toLowerCase()}, with an explanation after each.`,
    questionIds: practiceSet(t.id),
    passPct: 60,
    kind: "check",
  },
  {
    id: assessmentId(t.id),
    title: `${t.name} assessment`,
    topic: t.id,
    description: `Every question in the bank on ${t.name.toLowerCase()}. Pass with 70% or more.`,
    questionIds: questionsFor(t.id).map((q) => q.id),
    passPct: 70,
    kind: "assessment",
  },
]);

const checkMap = byId(KNOWLEDGE_CHECKS);
export const getCheck = (id: string): KnowledgeCheck | undefined => checkMap.get(id);

/** Concepts that cite a lesson, for "related concepts" on the lesson page. */
export function conceptsForLesson(lessonId: string): Concept[] {
  return CONCEPTS.filter((c) => c.lessons.includes(lessonId));
}

export function conceptsForMission(missionId: string): Concept[] {
  return CONCEPTS.filter((c) => c.missions.includes(missionId));
}

export function termsForLesson(lessonId: string): GlossaryTerm[] {
  return GLOSSARY.filter((t) => t.lesson === lessonId);
}

/**
 * Reads a typed number the way people write it: "42,9" and "42.9" are the same, "9,250.00" and
 * "1.234,56" use thousands separators, a trailing unit ("%", "R", "vUSD", "units") is ignored and the
 * typographic minus counts as a minus. Returns null when the text is not a number.
 */
export function parseNumericAnswer(raw: string | number): number | null {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  let s = raw.trim().replace(/−/g, "-").replace(/\s+/g, "");
  s = s.replace(/(vusd|usd|units|unit|r|%|×|x)$/i, "");
  const comma = s.lastIndexOf(",");
  const dot = s.lastIndexOf(".");
  if (comma >= 0 && dot >= 0) {
    // Whichever separator comes last is the decimal one.
    s = comma > dot ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  } else if (comma >= 0) {
    // A single comma followed by one or two digits is a decimal comma; otherwise commas group thousands.
    s = /^-?\d+,\d{1,2}$/.test(s) ? s.replace(",", ".") : s.replace(/,/g, "");
  }
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Grades an answer to a question. Numeric answers accept the stated tolerance. */
export function isCorrect(q: Question, answer: string | number | undefined): boolean {
  if (answer === undefined || answer === "") return false;
  if (q.kind === "numeric" && q.numeric) {
    const n = parseNumericAnswer(answer);
    return n !== null && Math.abs(n - q.numeric.answer) <= q.numeric.tolerance + 1e-9;
  }
  return answer === q.correct;
}
