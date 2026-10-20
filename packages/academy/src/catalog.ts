import { CONCEPTS } from "./content/concepts";
import { GLOSSARY } from "./content/glossary";
import { LESSONS_A } from "./content/lessons-a";
import { LESSONS_B } from "./content/lessons-b";
import { QUESTIONS_A } from "./content/questions-a";
import { QUESTIONS_B } from "./content/questions-b";
import { assessmentId, checkId } from "./paths";
import { TOPICS } from "./topics";
import type { Concept, GlossaryTerm, KnowledgeCheck, Lesson, Question, TopicId } from "./types";

export const LESSONS: Lesson[] = [...LESSONS_A, ...LESSONS_B].sort((a, b) => a.id.localeCompare(b.id));
export const QUESTIONS: Question[] = [...QUESTIONS_A, ...QUESTIONS_B];
export { CONCEPTS, GLOSSARY };

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

/** Grades an answer to a question. Numeric answers accept the stated tolerance. */
export function isCorrect(q: Question, answer: string | number | undefined): boolean {
  if (answer === undefined || answer === "") return false;
  if (q.kind === "numeric" && q.numeric) {
    const n = typeof answer === "number" ? answer : Number(String(answer).replace(/,/g, "").trim());
    return Number.isFinite(n) && Math.abs(n - q.numeric.answer) <= q.numeric.tolerance + 1e-9;
  }
  return answer === q.correct;
}
