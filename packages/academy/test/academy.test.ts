import { describe, expect, it } from "vitest";
import { MISSIONS } from "@market-lab/missions";
import { ARENA_SCENARIOS } from "@market-lab/missions";
import {
  ACHIEVEMENTS,
  CONCEPTS,
  GLOSSARY,
  KNOWLEDGE_CHECKS,
  LEARNING_PATHS,
  LESSONS,
  QUESTIONS,
  TOPICS,
  addDays,
  dailyChallenge,
  gradeChallengeItem,
  isCorrect,
  parseNumericAnswer,
  streakInfo,
  weekKey,
  weeklyChallenge,
  weeklyProgress,
  type ProgressSnapshot,
} from "../src";

const missionIds = new Set(MISSIONS.map((m) => m.id));
const lessonIds = new Set(LESSONS.map((l) => l.id));
const questionIds = new Set(QUESTIONS.map((q) => q.id));
const conceptIds = new Set(CONCEPTS.map((c) => c.id));
const termIds = new Set(GLOSSARY.map((t) => t.id));
const topicIds = new Set(TOPICS.map((t) => t.id));
const checkIds = new Set(KNOWLEDGE_CHECKS.map((c) => c.id));
const scenarioIds = new Set(ARENA_SCENARIOS.map((s) => s.id));

const empty = (over: Partial<ProgressSnapshot> = {}): ProgressSnapshot => ({
  now: Date.UTC(2026, 9, 20, 12),
  tz: "UTC",
  missions: [],
  arena: [],
  lessons: [],
  checks: [],
  dailies: [],
  weeklies: [],
  reflections: [],
  replays: [],
  skillHistory: [],
  skills: {} as ProgressSnapshot["skills"],
  xp: 0,
  level: 1,
  ...over,
});

describe("content integrity", () => {
  it("keeps the 18 original lessons, and every lesson id is unique", () => {
    expect(LESSONS.filter((l) => /^L[0-9][0-9]$/.test(l.id))).toHaveLength(18);
    expect(lessonIds.size).toBe(LESSONS.length);
  });

  it("links lessons only to things that exist", () => {
    for (const l of LESSONS) {
      expect(topicIds.has(l.topic)).toBe(true);
      for (const b of l.blocks) if (b.kind === "check") for (const q of b.questionIds) expect(questionIds.has(q), `${l.id} → ${q}`).toBe(true);
      for (const p of l.practice) {
        if (p.kind === "mission") expect(missionIds.has(p.ref), `${l.id} → ${p.ref}`).toBe(true);
        if (p.kind === "arena") expect(scenarioIds.has(p.ref as never), `${l.id} → ${p.ref}`).toBe(true);
        if (p.kind === "check") expect(topicIds.has(p.ref as never), `${l.id} → ${p.ref}`).toBe(true);
        if (p.kind === "calculator") expect(p.ref).toBe("risk-calculator");
      }
    }
  });

  it("has well-formed questions, at least eight per topic", () => {
    expect(questionIds.size).toBe(QUESTIONS.length);
    for (const q of QUESTIONS) {
      expect(lessonIds.has(q.lesson), q.id).toBe(true);
      if (q.kind === "numeric") expect(q.numeric, q.id).toBeDefined();
      else expect(q.options?.some((o) => o.id === q.correct), q.id).toBe(true);
    }
    for (const t of TOPICS) expect(QUESTIONS.filter((q) => q.topic === t.id).length, t.id).toBeGreaterThanOrEqual(8);
  });

  it("links concepts and glossary terms to existing ids", () => {
    for (const c of CONCEPTS) {
      for (const r of c.related) expect(conceptIds.has(r), `${c.id} → ${r}`).toBe(true);
      for (const m of c.missions) expect(missionIds.has(m), `${c.id} → ${m}`).toBe(true);
      for (const l of c.lessons) expect(lessonIds.has(l), `${c.id} → ${l}`).toBe(true);
    }
    for (const t of GLOSSARY) {
      for (const r of t.related) expect(termIds.has(r), `${t.id} → ${r}`).toBe(true);
      if (t.lesson) expect(lessonIds.has(t.lesson), `${t.id} → ${t.lesson}`).toBe(true);
    }
  });

  it("builds a check and an assessment for every topic, and valid paths", () => {
    for (const c of KNOWLEDGE_CHECKS) {
      expect(c.questionIds.length).toBeGreaterThanOrEqual(c.kind === "check" ? 5 : 8);
      for (const q of c.questionIds) expect(questionIds.has(q)).toBe(true);
    }
    for (const p of LEARNING_PATHS)
      for (const s of p.steps) {
        const ok = s.kind === "lesson" ? lessonIds.has(s.id) : s.kind === "mission" ? missionIds.has(s.id) : checkIds.has(s.id);
        expect(ok, `${p.id} → ${s.id}`).toBe(true);
      }
  });

  it("grades numeric answers with their tolerance", () => {
    const q = QUESTIONS.find((x) => x.kind === "numeric")!;
    expect(isCorrect(q, q.numeric!.answer)).toBe(true);
    expect(isCorrect(q, String(q.numeric!.answer))).toBe(true);
    expect(isCorrect(q, q.numeric!.answer + q.numeric!.tolerance + 1)).toBe(false);
  });
});

describe("numeric answers", () => {
  it("reads decimal commas, thousands separators, units and the typographic minus", () => {
    const cases: [string, number | null][] = [
      ["42.9", 42.9],
      ["42,9", 42.9],
      ["185,00", 185],
      ["9,250.00", 9250],
      ["1,234", 1234],
      ["1.234,56", 1234.56],
      ["25%", 25],
      ["0,26R", 0.26],
      ["1.6 R", 1.6],
      ["100.00 vUSD", 100],
      ["47 units", 47],
      ["−0.30", -0.3],
      ["-0.30", -0.3],
      [".5", 0.5],
      ["", null],
      ["abc", null],
      ["1-2", null],
    ];
    for (const [raw, want] of cases) expect(parseNumericAnswer(raw), raw).toBe(want);
  });
});

describe("daily and weekly challenges", () => {
  it("are deterministic, have three items, and their own answers grade as correct", () => {
    let day = "2026-01-01";
    for (let i = 0; i < 120; i++) {
      const a = dailyChallenge(day, QUESTIONS);
      expect(dailyChallenge(day, QUESTIONS)).toEqual(a);
      expect(a.items).toHaveLength(3);
      for (const it of a.items) expect(gradeChallengeItem(it, it.kind === "choice" ? it.correct : String(it.answer)), `${day} ${it.id}`).toBe(true);
      day = addDays(day, 1);
    }
  });

  it("computes ISO weeks and weekly progress", () => {
    expect(weekKey("2026-10-20")).toBe("2026-W43");
    expect(weekKey("2027-01-01")).toBe("2026-W53");
    const w = weeklyChallenge("2026-10-20", "2026-W43");
    expect(w.objectives).toHaveLength(4);
    const s = empty({ missions: [{ sessionId: "s", missionId: w.featuredMission, dqs: 80, rds: 100, net: -100, at: Date.UTC(2026, 9, 20, 10) }] });
    expect(weeklyProgress(w, s)[0].done).toBe(true);
  });
});

describe("streaks and achievements", () => {
  it("counts a streak that is still alive from yesterday", () => {
    const s = streakInfo(["2026-10-16", "2026-10-17", "2026-10-18", "2026-10-19"], "2026-10-20");
    expect(s.current).toBe(4);
    expect(s.atRisk).toBe(true);
    expect(streakInfo(["2026-10-10", "2026-10-11"], "2026-10-20").current).toBe(0);
  });

  it("never unlocks anything on an empty profile, and rewards process over profit", () => {
    const skills = Object.fromEntries(["market_basics", "order_mechanics", "risk_management", "position_sizing", "market_structure", "scenario_analysis", "decision_discipline", "reflection_review"].map((k) => [k, { theta: -1 }]));
    const none = empty({ skills: skills as ProgressSnapshot["skills"] });
    expect(ACHIEVEMENTS.filter((a) => a.evaluate(none).unlocked)).toHaveLength(0);
    const lucky = empty({ skills: skills as ProgressSnapshot["skills"], missions: [{ sessionId: "s", missionId: "M04", dqs: 30, rds: 0, net: 50000, at: 1 }] });
    const unlocked = ACHIEVEMENTS.filter((a) => a.evaluate(lucky).unlocked).map((a) => a.id);
    expect(unlocked).toEqual(["first-mission"]);
  });
});
