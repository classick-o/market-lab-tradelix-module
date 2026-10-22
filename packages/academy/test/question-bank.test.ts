import { describe, expect, it } from "vitest";
import { CONCEPTS, LESSONS, QUESTIONS, seededRandom, varyQuestion } from "../src";

const conceptIds = new Set(CONCEPTS.map((c) => c.id));
const lessonIds = new Set(LESSONS.map((l) => l.id));
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe("question bank", () => {
  it("has unique ids and points at real lessons and concepts", () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
    for (const q of QUESTIONS) {
      expect(lessonIds.has(q.lesson), `${q.id}: lesson ${q.lesson}`).toBe(true);
      for (const c of q.concepts ?? []) expect(conceptIds.has(c), `${q.id}: concept ${c}`).toBe(true);
      expect((q.concepts ?? []).length, `${q.id}: at most two concepts`).toBeLessThanOrEqual(2);
    }
  });

  it("has a right answer for every question and rationales only on wrong options", () => {
    for (const q of QUESTIONS) {
      if (q.kind === "numeric") {
        expect(q.numeric, `${q.id}: numeric answer`).toBeTruthy();
        continue;
      }
      expect(q.options?.some((o) => o.id === q.correct), `${q.id}: correct option`).toBe(true);
      const right = q.options!.find((o) => o.id === q.correct)!;
      expect(right.rationale, `${q.id}: no rationale on the right option`).toBeUndefined();
    }
  });

  it("keeps hints short and at most three", () => {
    for (const q of QUESTIONS) {
      expect((q.hints ?? []).length, `${q.id}: ≤ 3 hints`).toBeLessThanOrEqual(3);
      for (const h of q.hints ?? []) expect(words(h), `${q.id}: hint ≤ 25 words: ${h}`).toBeLessThanOrEqual(25);
    }
  });

  it("generates valid variants for every question with vary", () => {
    for (const q of QUESTIONS.filter((x) => x.vary)) {
      expect(q.kind, `${q.id}: vary is for numeric questions`).toBe("numeric");
      const rand = seededRandom(11);
      for (let i = 0; i < 25; i++) {
        const v = varyQuestion(q, rand);
        expect(v, `${q.id}: a draw meets the constraints`).not.toBeNull();
        expect(Number.isFinite(v!.answer), `${q.id}: finite answer`).toBe(true);
        expect(v!.prompt, `${q.id}: placeholders resolved`).not.toMatch(/[{}]/);
        expect(v!.explanation, `${q.id}: placeholders resolved`).not.toMatch(/[{}]/);
      }
    }
  });
});
