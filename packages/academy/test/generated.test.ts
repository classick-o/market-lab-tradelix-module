import { describe, expect, it } from "vitest";
import { compileCourseContent } from "../src/content/compile";
import COURSE_META from "../src/generated/course-meta";
import { SCRIPT_LOADERS } from "../src/generated/script-loaders";
import { LESSONS, loadLessonScript } from "../src";

describe("generated course content", () => {
  const compiled = compileCourseContent();
  it("matches the source files (run npm run content:build after editing content)", async () => {
    expect(JSON.parse(JSON.stringify(COURSE_META))).toEqual(JSON.parse(JSON.stringify(compiled.meta)));
    expect(Object.keys(SCRIPT_LOADERS).sort()).toEqual(Object.keys(compiled.scripts).sort());
    for (const [unit, load] of Object.entries(SCRIPT_LOADERS)) expect((await load()).default, `unit ${unit}`).toEqual(compiled.scripts[unit]);
  });

  it("loads any course lesson's script on demand", async () => {
    const lesson = LESSONS.find((l) => l.scriptRef)!;
    const script = await loadLessonScript(lesson);
    expect(script?.courseId).toBe(lesson.scriptRef!.courseId);
  });
});
