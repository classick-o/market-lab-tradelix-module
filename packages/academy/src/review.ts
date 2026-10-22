/**
 * The memory of learning: spaced review (Leitner boxes) and concept mastery.
 * Pure functions; the UI stores the review items and the evidence list and calls these to read them.
 */
import { addDays, dayIndex } from "./calendar";
import { evaluate, renderTemplate, type Env } from "./expr";
import type { Question, TopicId } from "./types";

/** Days until a question in each box comes back: box 1 → 1 day, … box 5 → 30 days. */
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30] as const;
export type ReviewBox = 1 | 2 | 3 | 4 | 5;

/** At most this many reviews are offered on one day; the rest move to the next day. */
export const DAILY_REVIEW_LIMIT = 15;

export interface ReviewItem {
  box: ReviewBox;
  /** Day key when the question is due again. */
  due: string;
  lastAt: number;
  history: { at: number; correct: boolean; hinted: boolean }[];
}

/** Puts a question into review: wrong answers start in box 1, first-time right answers in box 2. */
export function enterReview(correct: boolean, today: string, at: number): ReviewItem {
  const box: ReviewBox = correct ? 2 : 1;
  return { box, due: addDays(today, REVIEW_INTERVALS[box - 1]), lastAt: at, history: [{ at, correct, hinted: false }] };
}

/**
 * Records a review answer. Right moves the question up one box, wrong sends it back to box 1.
 * A right answer after a hint stays in its box: it was recalled, but not freely.
 */
export function applyReview(item: ReviewItem | undefined, correct: boolean, hinted: boolean, today: string, at: number): ReviewItem {
  if (!item) return enterReview(correct && !hinted, today, at);
  const box: ReviewBox = !correct ? 1 : hinted ? item.box : (Math.min(5, item.box + 1) as ReviewBox);
  return { box, due: addDays(today, REVIEW_INTERVALS[box - 1]), lastAt: at, history: [...item.history, { at, correct, hinted }].slice(-20) };
}

/** Question ids due today or earlier, the most overdue and lowest box first, up to the limit. */
export function dueReviews(review: Record<string, ReviewItem>, today: string, limit = DAILY_REVIEW_LIMIT): string[] {
  const t = dayIndex(today);
  return Object.entries(review)
    .filter(([, r]) => dayIndex(r.due) <= t)
    .sort(([, a], [, b]) => dayIndex(a.due) - dayIndex(b.due) || a.box - b.box)
    .slice(0, limit)
    .map(([id]) => id);
}

/** How many reviews fall due on each of the next `days` days (index 0 = today, including overdue). */
export function reviewForecast(review: Record<string, ReviewItem>, today: string, days = 7): number[] {
  const t = dayIndex(today);
  const out = Array.from({ length: days }, () => 0);
  for (const r of Object.values(review)) {
    const d = Math.max(0, dayIndex(r.due) - t);
    if (d < days) out[d]++;
  }
  return out;
}

// ─── Concept mastery ───────────────────────────────────────────────────────

export interface ConceptEvidence {
  concept: string;
  at: number;
  /** 1 = right first time, 0.5 = right after a hint or a retry, 0 = wrong. */
  score: number;
  source: "lesson" | "task" | "check" | "assessment" | "review" | "daily";
}

/** 0 New · 1 Learning · 2 Familiar · 3 Proficient · 4 Mastered. */
export type MasteryLevel = 0 | 1 | 2 | 3 | 4;
export const MASTERY_LABEL: Record<MasteryLevel, string> = { 0: "New", 1: "Learning", 2: "Familiar", 3: "Proficient", 4: "Mastered" };

const DAY = 86_400_000;

/**
 * Mastery of one concept from its evidence (oldest first or any order).
 * Familiar needs ≥ 60% over the last five; Proficient ≥ 80% and evidence at least 3 days after the
 * first; Mastered ≥ 80% and a review question of the concept in box 4 or higher (`maxBox`).
 */
export function conceptMastery(evidence: ConceptEvidence[], maxBox = 0): MasteryLevel {
  if (evidence.length === 0) return 0;
  const sorted = [...evidence].sort((a, b) => a.at - b.at);
  const last = sorted.slice(-5);
  const pct = last.reduce((s, e) => s + e.score, 0) / last.length;
  if (pct < 0.6) return 1;
  if (pct < 0.8) return 2;
  const spaced = sorted[sorted.length - 1].at - sorted[0].at >= 3 * DAY;
  if (!spaced) return 2;
  return maxBox >= 4 ? 4 : 3;
}

/** Mastery for every concept that has evidence. */
export function masteryByConcept(evidence: ConceptEvidence[], review: Record<string, ReviewItem>, questions: Question[]): Record<string, MasteryLevel> {
  const byConcept = new Map<string, ConceptEvidence[]>();
  for (const e of evidence) {
    const list = byConcept.get(e.concept) ?? [];
    list.push(e);
    byConcept.set(e.concept, list);
  }
  const maxBox = new Map<string, number>();
  for (const q of questions) {
    const r = review[q.id];
    if (!r) continue;
    for (const c of q.concepts ?? []) maxBox.set(c, Math.max(maxBox.get(c) ?? 0, r.box));
  }
  const out: Record<string, MasteryLevel> = {};
  for (const [c, list] of byConcept) out[c] = conceptMastery(list, maxBox.get(c) ?? 0);
  return out;
}

// ─── Question pools ────────────────────────────────────────────────────────

/** A small seeded generator (mulberry32), so a check can be rebuilt from its seed. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled<T>(xs: readonly T[], rand: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Picks a knowledge check: two easy, two medium and one hard question from the topic, preferring
 * questions the learner hasn't seen; fills from other difficulties if a level runs short.
 */
export function checkPool(questions: Question[], topic: TopicId, seen: ReadonlySet<string>, rand: () => number, size = 5): string[] {
  const bank = questions.filter((q) => q.topic === topic);
  const pickFrom = (pool: Question[], n: number, taken: Set<string>) => {
    const fresh = shuffled(pool.filter((q) => !taken.has(q.id) && !seen.has(q.id)), rand);
    const old = shuffled(pool.filter((q) => !taken.has(q.id) && seen.has(q.id)), rand);
    return [...fresh, ...old].slice(0, n);
  };
  const taken = new Set<string>();
  const out: Question[] = [];
  for (const [d, n] of [[1, 2], [2, 2], [3, 1]] as const) {
    for (const q of pickFrom(bank.filter((x) => x.difficulty === d), n, taken)) {
      out.push(q);
      taken.add(q.id);
    }
  }
  for (const q of pickFrom(bank, size - out.length, taken)) {
    out.push(q);
    taken.add(q.id);
  }
  return out.slice(0, size).sort((a, b) => a.difficulty - b.difficulty).map((q) => q.id);
}

// ─── Fresh numbers for numeric questions ─────────────────────────────────

export interface QuestionVariant {
  prompt: string;
  explanation: string;
  hint?: string;
  answer: number;
  values: Env;
}

/**
 * A new version of a numeric question with `vary`: fields drawn from their ranges until every
 * constraint holds (up to 200 draws), then prompt, explanation, hint and answer computed from them.
 * Returns null for questions without `vary` or when no draw satisfies the constraints.
 */
export function varyQuestion(q: Question, rand: () => number): QuestionVariant | null {
  const spec = q.vary;
  if (!spec) return null;
  for (let attempt = 0; attempt < 200; attempt++) {
    const values: Env = {};
    for (const [name, [min, max, step]] of Object.entries(spec.fields)) {
      const n = Math.floor((max - min) / step + 1e-9) + 1;
      values[name] = Number((min + Math.floor(rand() * n) * step).toFixed(6));
    }
    if (!(spec.constraints ?? []).every((c) => evaluate(c, values) !== 0)) continue;
    // Drop floating-point noise (99.24499999… → 99.245) so the answer is the one a person computes.
    const answer = Number(evaluate(spec.answer, values).toFixed(9));
    if (!Number.isFinite(answer)) continue;
    const env = { ...values, answer };
    return { prompt: renderTemplate(spec.prompt, env), explanation: renderTemplate(spec.explanation, env), hint: spec.hint ? renderTemplate(spec.hint, env) : undefined, answer, values };
  }
  return null;
}
