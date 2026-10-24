import { describe, expect, it } from "vitest";
import { ACHIEVEMENTS, COURSE_LEVELS, REVIEW_INTERVALS, WEEKLY_XP } from "@market-lab/academy";
import meta from "../../academy/src/generated/course-meta.js";
import { SKILLS } from "@market-lab/learning";
import { ARENA_EQUITY, ARENA_SCENARIOS, BOTS, CANDLE_SECONDS, DUEL_CANDLES, DUEL_PROCESS_WEIGHT, DUEL_START_RATING, FLAW_LABEL, getMission, mirrorPersona } from "@market-lab/missions";
import { BOTS as BOT_FACTS, EXACT, FLOOR, LEVELS, MIRROR, SCENE_TEXT, TERMS } from "../src/data/facts";

describe("site facts match the product", () => {
  it("floor numbers stay at or below the real content", () => {
    expect(meta.lessons.length).toBeGreaterThanOrEqual(FLOOR.lessons);
    expect(meta.questions.length).toBeGreaterThanOrEqual(FLOOR.questions);
    expect(meta.concepts.length).toBeGreaterThanOrEqual(FLOOR.concepts);
    expect(meta.terms.length).toBeGreaterThanOrEqual(FLOOR.terms);
  });

  it("exact numbers are exact", () => {
    expect(COURSE_LEVELS.reduce((n, l) => n + l.units.length, 0)).toBe(EXACT.units);
    expect(ARENA_SCENARIOS.length).toBe(EXACT.regimes);
    expect(ARENA_SCENARIOS.filter((s) => s.tier === "free").length).toBe(EXACT.freeRegimes);
    expect(BOTS.length).toBe(EXACT.bots);
    expect(ACHIEVEMENTS.length).toBe(EXACT.achievements);
    expect(SKILLS.length).toBe(EXACT.skills);
    expect(getMission("M01").estMinutes).toBe(EXACT.firstMissionMinutes);
    expect(DUEL_CANDLES).toBe(EXACT.duelCandles);
    expect(CANDLE_SECONDS).toBe(EXACT.candleSeconds);
    expect(DUEL_PROCESS_WEIGHT).toBe(EXACT.processWeight);
    expect(DUEL_START_RATING).toBe(EXACT.startRating);
    expect([...REVIEW_INTERVALS]).toEqual([...EXACT.reviewDays]);
    expect(WEEKLY_XP).toBe(EXACT.weeklyXp);
    expect(ARENA_EQUITY / 100).toBe(EXACT.equity);
  });

  it("course levels match the course map", () => {
    expect(LEVELS.map((l) => [l.id, l.name, l.tagline, l.lessons])).toEqual(
      COURSE_LEVELS.map((l) => [l.id, l.name, l.tagline, l.units.reduce((n, u) => n + u.lessons.length, 0)]),
    );
  });

  it("bots match the duel roster", () => {
    expect(BOT_FACTS.map((b) => b.id)).toEqual(BOTS.map((b) => b.id));
    for (const b of BOTS) {
      const f = BOT_FACTS.find((x) => x.id === b.id)!;
      expect([f.name, f.title, f.level, f.rating, f.watch]).toEqual([b.name, b.title, b.level, b.rating, b.watch]);
      expect(f.habits).toEqual(b.flaws.map((x) => FLAW_LABEL[x]));
    }
    const m = mirrorPersona(null);
    expect([MIRROR.name, MIRROR.title, MIRROR.watch]).toEqual([m.name, m.title, m.watch]);
  });

  it("quoted content exists", () => {
    for (const t of TERMS) {
      const real = meta.terms.find((x) => x.id === t.id);
      expect(real?.term).toBe(t.term);
      expect(real?.plain).toBe(t.plain);
    }
    const lesson = meta.lessons.find((l) => l.id === SCENE_TEXT.lesson.id);
    expect([lesson?.title, lesson?.minutes]).toEqual([SCENE_TEXT.lesson.title, SCENE_TEXT.lesson.minutes]);
    expect(getMission(SCENE_TEXT.mission.id).title).toBe(SCENE_TEXT.mission.title);
    expect(ACHIEVEMENTS.some((a) => a.title === SCENE_TEXT.achievement)).toBe(true);
  });
});
