import type { SkillId } from "@market-lab/evaluation";
import { LEVEL_LABEL, SKILL_BY_ID, levelAtLeast, type SkillLevel } from "@market-lab/learning";
import { LEARNING_PATHS } from "./paths";
import { pathProgress, type ProgressSnapshot } from "./progress";
import { TOPIC_BY_ID } from "./topics";

export type MilestoneKind = "path" | "skill" | "assessment" | "improvement";

export interface Milestone {
  id: string;
  kind: MilestoneKind;
  title: string;
  detail: string;
  reached: boolean;
  /** When it was reached; null when upcoming or when the date isn't known. */
  at: number | null;
}

/**
 * Milestones mark larger steps than achievements: finished paths, skill levels reached,
 * assessments passed and personal improvements. Reached ones carry a date; upcoming ones don't.
 */
export function milestones(s: ProgressSnapshot): Milestone[] {
  const out: Milestone[] = [];
  for (const p of LEARNING_PATHS) {
    const pr = pathProgress(p, s);
    out.push({
      id: `path-${p.id}`,
      kind: "path",
      title: `Completed the ${p.title}`,
      detail: pr.completedAt ? `${pr.total} steps` : `${pr.completed} of ${pr.total} steps so far`,
      reached: pr.completedAt !== null,
      at: pr.completedAt,
    });
  }
  const levels: SkillLevel[] = ["developing", "proficient", "advanced"];
  for (const skill of Object.keys(s.skills) as SkillId[]) {
    for (const lv of levels) {
      const hit = s.skillHistory.find((h) => h.skill === skill && levelAtLeast(h.theta, lv));
      const reachedNow = levelAtLeast(s.skills[skill].theta, lv);
      // Only show the next level up as an upcoming milestone, so the list stays short.
      if (!hit && !reachedNow && lv !== nextLevel(s.skills[skill].theta)) continue;
      out.push({
        id: `skill-${skill}-${lv}`,
        kind: "skill",
        title: `${SKILL_BY_ID[skill].name} reached ${LEVEL_LABEL[lv]}`,
        detail: SKILL_BY_ID[skill].description,
        reached: Boolean(hit) || reachedNow,
        at: hit?.at ?? null,
      });
    }
  }
  const passed = new Map<string, number>();
  for (const c of [...s.checks].filter((x) => x.kind === "assessment" && x.passed).sort((a, b) => a.at - b.at)) if (!passed.has(c.topic)) passed.set(c.topic, c.at);
  for (const [topic, at] of passed) out.push({ id: `assessment-${topic}`, kind: "assessment", title: `Passed the ${TOPIC_BY_ID[topic as keyof typeof TOPIC_BY_ID].name} assessment`, detail: "Topic assessment, 70% or more", reached: true, at });

  const firstBy = new Map<string, { dqs: number; at: number }>();
  for (const m of [...s.missions].sort((a, b) => a.at - b.at)) {
    if (m.dqs === null) continue;
    const first = firstBy.get(m.missionId);
    if (!first) firstBy.set(m.missionId, { dqs: m.dqs, at: m.at });
    else if (m.dqs - first.dqs >= 15 && !out.some((o) => o.id === `improve-${m.missionId}`)) {
      out.push({ id: `improve-${m.missionId}`, kind: "improvement", title: `Improved ${m.missionId} by ${m.dqs - first.dqs} points`, detail: `Decision quality from ${first.dqs} to ${m.dqs}`, reached: true, at: m.at });
    }
  }
  return out;
}

function nextLevel(theta: number): SkillLevel | null {
  if (!levelAtLeast(theta, "developing")) return "developing";
  if (!levelAtLeast(theta, "proficient")) return "proficient";
  if (!levelAtLeast(theta, "advanced")) return "advanced";
  return null;
}
