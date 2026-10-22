import { describe, expect, it } from "vitest";
import {
  QUESTIONS,
  applyReview,
  checkPool,
  conceptMastery,
  dueReviews,
  enterReview,
  evaluateCondition,
  fillTemplate,
  pickFeedback,
  reviewForecast,
  seededRandom,
  type ConceptEvidence,
  type Condition,
} from "../src";

const T0 = Date.UTC(2026, 9, 22, 12);
const DAY = 86_400_000;

describe("spaced review", () => {
  it("starts wrong answers in box 1 and right ones in box 2", () => {
    expect(enterReview(false, "2026-10-22", T0)).toMatchObject({ box: 1, due: "2026-10-23" });
    expect(enterReview(true, "2026-10-22", T0)).toMatchObject({ box: 2, due: "2026-10-25" });
  });

  it("moves up a box when right, back to box 1 when wrong, and holds after a hint", () => {
    let r = enterReview(true, "2026-10-22", T0);
    r = applyReview(r, true, false, "2026-10-25", T0 + 3 * DAY);
    expect(r).toMatchObject({ box: 3, due: "2026-11-01" });
    r = applyReview(r, true, true, "2026-11-01", T0 + 10 * DAY);
    expect(r.box).toBe(3);
    r = applyReview(r, false, false, "2026-11-08", T0 + 17 * DAY);
    expect(r).toMatchObject({ box: 1, due: "2026-11-09" });
    expect(r.history).toHaveLength(4);
  });

  it("never goes above box 5 (30 days)", () => {
    let r = enterReview(true, "2026-01-01", T0);
    for (let i = 0; i < 6; i++) r = applyReview(r, true, false, "2026-02-01", T0);
    expect(r).toMatchObject({ box: 5, due: "2026-03-03" });
  });

  it("lists due questions, most overdue and lowest box first, up to the limit", () => {
    const review = {
      a: { box: 3 as const, due: "2026-10-20", lastAt: 0, history: [] },
      b: { box: 1 as const, due: "2026-10-22", lastAt: 0, history: [] },
      c: { box: 1 as const, due: "2026-10-20", lastAt: 0, history: [] },
      d: { box: 2 as const, due: "2026-10-23", lastAt: 0, history: [] },
    };
    expect(dueReviews(review, "2026-10-22")).toEqual(["c", "a", "b"]);
    expect(dueReviews(review, "2026-10-22", 2)).toEqual(["c", "a"]);
    expect(reviewForecast(review, "2026-10-22", 3)).toEqual([3, 1, 0]);
  });
});

describe("concept mastery", () => {
  const ev = (scores: number[], spanDays = 0): ConceptEvidence[] =>
    scores.map((score, i) => ({ concept: "risk-per-trade", at: T0 + (i === scores.length - 1 ? spanDays * DAY : i * 1000), score, source: "check" }));

  it("follows the five levels", () => {
    expect(conceptMastery([])).toBe(0);
    expect(conceptMastery(ev([0, 1, 0]))).toBe(1);
    expect(conceptMastery(ev([1, 1, 0]))).toBe(2);
    expect(conceptMastery(ev([1, 1, 1, 1]))).toBe(2); // ≥ 80% but all on one day
    expect(conceptMastery(ev([1, 1, 1, 1], 3))).toBe(3);
    expect(conceptMastery(ev([1, 1, 1, 1], 3), 4)).toBe(4);
  });

  it("only looks at the last five pieces of evidence", () => {
    expect(conceptMastery(ev([0, 0, 0, 1, 1, 1, 1, 1], 4))).toBe(3);
  });
});

describe("check pools", () => {
  it("draws two easy, two medium and one hard question, preferring unseen ones", () => {
    const pool = checkPool(QUESTIONS, "position_sizing", new Set(), seededRandom(7));
    expect(pool).toHaveLength(5);
    const diffs = pool.map((id) => QUESTIONS.find((q) => q.id === id)!.difficulty);
    expect(diffs).toEqual([1, 1, 2, 2, 3]);
    const seen = new Set(pool);
    const next = checkPool(QUESTIONS, "position_sizing", seen, seededRandom(7));
    const reused = next.filter((id) => seen.has(id));
    // Only levels with no unseen question left may repeat.
    for (const id of reused) {
      const d = QUESTIONS.find((q) => q.id === id)!.difficulty;
      const unseenAtLevel = QUESTIONS.filter((q) => q.topic === "position_sizing" && q.difficulty === d && !seen.has(q.id));
      expect(unseenAtLevel.length).toBeLessThan(next.filter((x) => QUESTIONS.find((q) => q.id === x)!.difficulty === d).length);
    }
  });

  it("is reproducible from the seed", () => {
    expect(checkPool(QUESTIONS, "stop_loss", new Set(), seededRandom(42))).toEqual(checkPool(QUESTIONS, "stop_loss", new Set(), seededRandom(42)));
  });
});

describe("task conditions", () => {
  const bearishLongLowerWick: Condition = {
    all: [{ field: "direction", eq: "bearish" }, { field: "lowerOverBody", gte: 2 }, { field: "lowerMinusUpper", gt: 0 }],
  };

  it("evaluates nested conditions with exact numeric comparisons", () => {
    expect(evaluateCondition(bearishLongLowerWick, { direction: "bearish", lowerOverBody: 3, lowerMinusUpper: 0.7 })).toBe(true);
    expect(evaluateCondition(bearishLongLowerWick, { direction: "bearish", lowerOverBody: 2, lowerMinusUpper: 0.1 })).toBe(true);
    expect(evaluateCondition(bearishLongLowerWick, { direction: "bullish", lowerOverBody: 3, lowerMinusUpper: 0.7 })).toBe(false);
    expect(evaluateCondition({ field: "answer", eq: 15.01, tol: 0.01 }, { answer: 15.0 })).toBe(true);
    expect(evaluateCondition({ field: "answer", eq: 15.01, tol: 0.01 }, { answer: 14.99 })).toBe(false);
    expect(evaluateCondition({ any: [{ field: "x", lt: 1 }, { not: { field: "y", eq: true } }] }, { x: 5, y: false })).toBe(true);
    expect(evaluateCondition({ field: "missing", gte: 0 }, {})).toBe(false);
  });

  it("picks the first matching feedback case and fills placeholders", () => {
    const cases = [
      { when: { field: "stop", gte: 97.9 } as Condition, text: "Stop at {stop:2} is inside the noise." },
      { when: { field: "stop", lt: 97.4 } as Condition, text: "Too far: {stop:2}." },
    ];
    expect(pickFeedback(cases, { stop: 98 })?.text).toBe("Stop at {stop:2} is inside the noise.");
    expect(fillTemplate("Stop at {stop:2} is inside the noise.", { stop: 98 })).toBe("Stop at 98.00 is inside the noise.");
    expect(fillTemplate("{units} units, {value:2} vUSD", { units: 47, value: 4700 })).toBe("47 units, 4,700.00 vUSD");
    expect(pickFeedback(cases, { stop: 97.6 })).toBeUndefined();
  });
});
