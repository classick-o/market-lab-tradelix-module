import { describe, expect, it } from "vitest";
import {
  applyEvidence,
  confidenceOf,
  initialSkills,
  levelFromXp,
  levelOf,
  missionXp,
  recommend,
  recurringTags,
  type MissionMeta,
} from "../src";

describe("skill updates", () => {
  it("never moves θ by more than 0.3 for a single piece of evidence", () => {
    let s = initialSkills("beginner").risk_management;
    for (const p of [1, 0, 1, 1, 0, 0, 1]) {
      const next = applyEvidence(s, { skill: "risk_management", performance: p, difficulty: 5, weight: 1 }, 0);
      expect(Math.abs(next.theta - s.theta)).toBeLessThanOrEqual(0.3 + 1e-9);
      s = next;
    }
  });

  it("raises a beginner to Developing after a clean easy mission, with only medium confidence", () => {
    let s = initialSkills("beginner").market_basics;
    for (let i = 0; i < 3; i++) s = applyEvidence(s, { skill: "market_basics", performance: 1, difficulty: 1, weight: 1 }, 0);
    expect(levelOf(s.theta)).toBe("developing");
    expect(confidenceOf(s)).toBe("medium");
  });

  it("is harder to gain on easy items than on hard ones", () => {
    const base = initialSkills("basics").risk_management;
    const easy = applyEvidence(base, { skill: "risk_management", performance: 1, difficulty: 1, weight: 1 }, 0);
    const hard = applyEvidence(base, { skill: "risk_management", performance: 1, difficulty: 5, weight: 1 }, 0);
    expect(hard.theta - base.theta).toBeGreaterThan(easy.theta - base.theta);
  });
});

describe("recommendations", () => {
  const missions: MissionMeta[] = [
    { id: "M01", title: "Read the Candle", skillPrimary: "market_basics", skillsSecondary: [], difficulty: 1, targets: ["misread_candle"], prerequisites: [] },
    { id: "M04", title: "Define Your Risk", skillPrimary: "risk_management", skillsSecondary: [], difficulty: 2, targets: ["no_stop", "stop_inside_noise"], prerequisites: [] },
    { id: "M06", title: "The FOMO Trap", skillPrimary: "decision_discipline", skillsSecondary: [], difficulty: 3, targets: ["chased_entry"], prerequisites: [{ skill: "risk_management", level: "developing" }] },
  ];

  it("starts a new beginner on the first mission of the path", () => {
    const r = recommend({ missions, skills: initialSkills("beginner"), history: [], path: ["M01", "M04", "M06"], now: 0 });
    expect(r.primary?.missionId).toBe("M01");
    expect(r.primary?.reason).toMatch(/path/i);
  });

  it("targets a recurring error pattern and says so", () => {
    const history = [1, 2, 3].map((i) => ({ missionId: "M01", sessionId: `s${i}`, dqs: 40, completedAt: i * 1000, errorTags: ["no_stop"] }));
    expect(recurringTags(history)).toEqual(["no_stop"]);
    const r = recommend({ missions, skills: initialSkills("basics"), history, path: ["M01", "M04", "M06"], now: 10 * 24 * 3600 * 1000 });
    expect(r.primary?.missionId).toBe("M04");
    expect(r.primary?.reason).toMatch(/Entering without a stop/);
    expect(r.slots.find((s) => s.slot === "review")?.sessionId).toBe("s3");
  });
});

describe("xp", () => {
  it("decays for repeats on the same day and maps to levels", () => {
    expect([0, 1, 2, 3].map((n) => missionXp(3, n))).toEqual([100, 50, 25, 0]);
    expect(levelFromXp(0)).toEqual({ level: 1, into: 0, needed: 150 });
    expect(levelFromXp(160)).toEqual({ level: 2, into: 10, needed: 200 });
  });
});
