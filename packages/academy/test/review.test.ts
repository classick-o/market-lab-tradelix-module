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

describe("expressions and question variants", () => {
  it("evaluates arithmetic, functions and comparisons safely", async () => {
    const { evaluate, renderTemplate } = await import("../src");
    expect(evaluate("floor(budget / (entry - stop))", { budget: 100, entry: 100, stop: 98 })).toBe(50);
    expect(evaluate("round(0.4 * 2.5 - 0.6 * 1, 2)", {})).toBe(0.4);
    expect(evaluate("commission(4700)", {})).toBe(2.35);
    expect(evaluate("commission(4606)", {})).toBe(2.31);
    expect(evaluate("entry > stop && stop >= 90", { entry: 100, stop: 95 })).toBe(1);
    expect(evaluate("2 × 3 ÷ 4 − 1", {})).toBe(0.5);
    expect(renderTemplate("Buy {units} at {entry:2}, budget {units * entry:2}", { units: 47, entry: 100 })).toBe("Buy 47 at 100.00, budget 4,700.00");
    expect(() => evaluate("alert(1)", {})).toThrow();
    expect(() => evaluate("x", {})).toThrow();
  });

  it("draws variants that meet the constraints", async () => {
    const { varyQuestion } = await import("../src");
    const q = {
      id: "t",
      topic: "position_sizing" as const,
      kind: "numeric" as const,
      difficulty: 1 as const,
      prompt: "",
      explanation: "",
      lesson: "L09",
      numeric: { answer: 50, tolerance: 0, unit: "units" },
      vary: {
        fields: { account: [5000, 20000, 1000] as [number, number, number], dist: [1, 4, 0.5] as [number, number, number] },
        constraints: ["account * 0.01 / dist == floor(account * 0.01 / dist)"],
        answer: "account * 0.01 / dist",
        prompt: "Account {account:2}, stop {dist:2} away: how many units for 1% risk?",
        explanation: "{account * 0.01:2} ÷ {dist:2} = {answer} units.",
      },
    };
    const rand = seededRandom(3);
    for (let i = 0; i < 20; i++) {
      const v = varyQuestion(q, rand)!;
      expect(Number.isInteger(v.answer)).toBe(true);
      expect(v.prompt).toMatch(/^Account [\d,]+\.00, stop \d\.\d0 away/);
    }
  });
});

describe("widget maths", () => {
  it("matches the lesson numbers", async () => {
    const { computeWidget, losingRunProbability, simulateEntry } = await import("../src");
    expect(computeWidget("candle-builder", { open: 100, high: 100.2, low: 98.8, close: 99.7 })).toMatchObject({ direction: "bearish", body: 0.3, upperWick: 0.2, lowerWick: 0.9, range: 1.4, lowerOverBody: 3 });
    expect(computeWidget("candle-builder", { open: 100, high: 99, low: 99.2, close: 101 })).toMatchObject({ high: 101, upperWick: 0 });
    expect(computeWidget("spread-cost", { units: 100, mid: 50, spread: 0.1, commissionPct: 0.05 })).toMatchObject({ spreadCost: 10, feeIn: 2.51, feeOut: 2.5, roundTrip: 15.01 });
    expect(computeWidget("bracket-builder", { stop: 97.7, target: 103.8, units: 25 }, { entry: 100 })).toMatchObject({ lossBefore: 57.5, lossAfter: 59.98, gainBefore: 95, gainAfter: 92.45, rr: 1.65 });
    expect(computeWidget("position-size", { account: 10000, riskPct: 1, entry: 100, stop: 98, units: 47 })).toMatchObject({ budget: 100, simpleQty: 50, qty: 47, lossAtStop: 98.66, withinBudget: true });
    expect(computeWidget("risk-reward", { entry: 100, stop: 98, target: 104 })).toMatchObject({ rr: 2, breakEven: 33.3 });
    expect(computeWidget("expectancy", { winRate: 40, avgWin: 2.5, avgLoss: 1, runLength: 5 })).toMatchObject({ expectancy: 0.4 });
    expect(computeWidget("loss-recovery", { drawdown: 50 })).toMatchObject({ gainNeeded: 100, lossesInRow: 69 });
    expect(losingRunProbability(0.5, 1, 1)).toBeCloseTo(0.5);
    expect(losingRunProbability(0.5, 2, 2)).toBeCloseTo(0.25);
    const candles = [{ o: 100, h: 100.2, l: 99.9, c: 100 }, { o: 100, h: 100.1, l: 99.5, c: 99.6 }, { o: 99.6, h: 99.7, l: 98.9, c: 99.2 }];
    expect(simulateEntry(candles, 1, "buy", "limit", 99)).toMatchObject({ filled: true, at: 2, price: 99, quote: 100.05, extreme: 98.95 });
    expect(simulateEntry(candles, 1, "buy", "limit", 98.8)).toMatchObject({ filled: false });
    expect(simulateEntry(candles, 1, "buy", "market", 0)).toMatchObject({ filled: true, price: 100.05 });
  });
});

describe("streak pauses", () => {
  it("bridge up to two missed days a week without counting them", async () => {
    const { streakInfo } = await import("../src");
    // 2026-10-19 is a Monday. Active Mon, Tue, (Wed missed), Thu, (Fri missed), Sat; today Sun.
    const days = ["2026-10-19", "2026-10-20", "2026-10-22", "2026-10-24"];
    expect(streakInfo(days, "2026-10-25")).toMatchObject({ current: 1 });
    expect(streakInfo(days, "2026-10-25", 2)).toMatchObject({ current: 4, paused: ["2026-10-21", "2026-10-23"], pausesLeft: 0, atRisk: true });
    // A third missed day in the same week ends the streak.
    expect(streakInfo(["2026-10-19", "2026-10-21", "2026-10-23", "2026-10-25"], "2026-10-25", 2)).toMatchObject({ current: 1 });
    // Pauses reset on Monday.
    expect(streakInfo(["2026-10-24", "2026-10-27"], "2026-10-27", 2)).toMatchObject({ current: 2, paused: ["2026-10-25", "2026-10-26"] });
  });
});
