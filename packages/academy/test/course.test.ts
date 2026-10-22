import { describe, expect, it } from "vitest";
import { COURSE_LESSONS, COURSE_UNITS, LESSONS, PLAYABLE_LESSONS, appLessonFor, courseLessonFor, getCourseLesson, hasScript, lessonCourseId, nextLearnStep } from "../src";

describe("course map", () => {
  it("has 5 levels, 44 units and 340 lessons with unique ids", () => {
    expect(COURSE_UNITS).toHaveLength(44);
    expect(COURSE_LESSONS).toHaveLength(340);
    expect(new Set(COURSE_LESSONS.map((l) => l.id)).size).toBe(340);
    for (const l of COURSE_LESSONS) {
      expect(l.objectives.length, `${l.id}: objectives`).toBeGreaterThan(0);
      for (const p of l.prereqs) expect(getCourseLesson(p) ?? COURSE_UNITS.find((u) => u.id === p), `${l.id}: prereq ${p}`).toBeTruthy();
    }
  });

  it("places every scripted lesson at its course position", () => {
    for (const l of LESSONS.filter(hasScript)) expect(courseLessonFor(l.id)?.id, l.id).toBe(lessonCourseId(l));
    expect(PLAYABLE_LESSONS.length).toBe(LESSONS.filter((x) => x.script || courseLessonFor(x.id)).length);
  });

  it("picks the next step: a started lesson, then a big review, then the course order", () => {
    const id = (i: number) => appLessonFor(PLAYABLE_LESSONS[i])!.id;
    expect(nextLearnStep({}, 0)).toMatchObject({ kind: "lesson", lessonId: id(0) });
    expect(nextLearnStep({ L09: { startedAt: 5 } }, 9)).toMatchObject({ kind: "lesson", lessonId: "L09", reason: "in-progress" });
    expect(nextLearnStep({}, 6)).toMatchObject({ kind: "review", due: 6 });
    expect(nextLearnStep({ [id(0)]: { startedAt: 1, completedAt: 2 } }, 0)).toMatchObject({ kind: "lesson", lessonId: id(1) });
  });
});

describe("course content written in code", async () => {
  const { COURSE_UNITS_CONTENT } = await import("../src/content/course");
  const { QUESTIONS: ALL_QUESTIONS } = await import("../src");
  const qids = new Set(ALL_QUESTIONS.map((q) => q.id));
  it("places each lesson in its own unit, with a script and its own check questions", () => {
    for (const [unitId, content] of Object.entries(COURSE_UNITS_CONTENT)) {
      for (const l of content.lessons) {
        const cl = getCourseLesson(l.id);
        expect(cl, `${l.id}: a course position`).toBeTruthy();
        expect(cl!.unit, `${l.id}: written in unit ${unitId}`).toBe(unitId);
        expect(cl!.legacy, `${l.id}: not a lesson that already exists (${cl!.legacy})`).toBeUndefined();
        expect(l.title, `${l.id}: title from the course map`).toBe(cl!.title);
        expect(l.script, `${l.id}: script`).toBeTruthy();
        expect(l.script!.courseId).toBe(l.id);
        expect(l.script!.unit).toBe(unitId);
        for (const q of l.script!.check) expect(qids.has(q), `${l.id}: check question ${q}`).toBe(true);
      }
      for (const q of content.questions) expect(content.lessons.some((l) => l.id === q.lesson) || !!getCourseLesson(q.lesson), `${q.id}: lesson ${q.lesson}`).toBe(true);
    }
  });
});

describe("unit introductions", async () => {
  const { COURSE_UNITS_CONTENT } = await import("../src/content/course");
  const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
  it("are short and give three to five outcomes", () => {
    for (const [unit, c] of Object.entries(COURSE_UNITS_CONTENT)) {
      if (!c.intro) continue;
      expect(words(c.intro.summary), `${unit}: summary ≤ 60 words`).toBeLessThanOrEqual(60);
      expect(c.intro.outcomes.length, `${unit}: 3–5 outcomes`).toBeGreaterThanOrEqual(3);
      expect(c.intro.outcomes.length, `${unit}: 3–5 outcomes`).toBeLessThanOrEqual(5);
      for (const o of c.intro.outcomes) expect(words(o), `${unit}: outcome ≤ 20 words`).toBeLessThanOrEqual(20);
      if (c.intro.buildsOn) expect(words(c.intro.buildsOn), `${unit}: buildsOn ≤ 40 words`).toBeLessThanOrEqual(40);
    }
  });
});
