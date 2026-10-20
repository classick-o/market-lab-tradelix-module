import { ERROR_TAGS, type SkillId } from "@market-lab/evaluation";
import { LEVEL_LABEL, confidenceOf, difficultyToB, levelAtLeast, levelOf, type SkillLevel, type SkillState } from "./profile";
import { SKILL_BY_ID } from "./skills";

export interface MissionMeta {
  id: string;
  title: string;
  skillPrimary: SkillId;
  skillsSecondary: SkillId[];
  difficulty: number;
  /** Error tags this mission is designed to train. */
  targets: string[];
  prerequisites: { skill: SkillId; level: SkillLevel }[];
}

export interface HistoryItem {
  missionId: string;
  sessionId: string;
  dqs: number | null;
  completedAt: number;
  errorTags: string[];
}

export type Slot = "recommended" | "continue" | "practice" | "harder" | "review";

export interface Recommendation {
  slot: Slot;
  missionId?: string;
  sessionId?: string;
  reason: string;
  score?: number;
  factors?: Record<string, number>;
}

export interface RecommendInput {
  missions: MissionMeta[];
  skills: Record<SkillId, SkillState>;
  history: HistoryItem[];
  /** Default learning path, in order. */
  path: string[];
  now: number;
}

export interface RecommendOutput {
  primary: Recommendation | null;
  slots: Recommendation[];
  recurring: string[];
}

const DAY = 24 * 60 * 60 * 1000;
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

/** Tags seen in at least two of the last five completed sessions. */
export function recurringTags(history: HistoryItem[]): string[] {
  const recent = [...history].sort((a, b) => b.completedAt - a.completedAt).slice(0, 5);
  const counts = new Map<string, number>();
  for (const h of recent) for (const t of new Set(h.errorTags)) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

export function missingPrerequisites(m: MissionMeta, skills: Record<SkillId, SkillState>): MissionMeta["prerequisites"] {
  return m.prerequisites.filter((p) => !levelAtLeast(skills[p.skill].theta, p.level));
}

function bestDqs(history: HistoryItem[], missionId: string): number | null {
  const scores = history.filter((h) => h.missionId === missionId && h.dqs !== null).map((h) => h.dqs!);
  return scores.length ? Math.max(...scores) : null;
}

function describeSkill(id: SkillId, skills: Record<SkillId, SkillState>): string {
  const s = skills[id];
  return `${SKILL_BY_ID[id].name} (${LEVEL_LABEL[levelOf(s.theta)]}, ${confidenceOf(s)} confidence)`;
}

export function nextOnPath(input: RecommendInput): string | null {
  const done = new Set(input.history.filter((h) => h.dqs !== null).map((h) => h.missionId));
  return input.path.find((id) => !done.has(id)) ?? null;
}

/**
 * Rule-based, explainable recommendation. Every recommendation carries the reason that
 * dominated its score, so the user always knows why it was suggested.
 */
export function recommend(input: RecommendInput): RecommendOutput {
  const { missions, skills, history, now } = input;
  const recurring = recurringTags(history);
  const next = nextOnPath(input);

  const scored = missions.map((m) => {
    const s = skills[m.skillPrimary];
    const conf = confidenceOf(s);
    const need = 1 - sigmoid(s.theta) + (conf === "low" ? 0.1 : 0);
    const fit = Math.max(0, Math.min(1, 1 - Math.abs(difficultyToB(m.difficulty) - (s.theta + 0.3)) / 2));
    const errorMatch = m.targets.some((t) => recurring.includes(t)) ? 1 : 0;
    const pathBonus = m.id === next ? 1 : 0;
    const attempts = history.filter((h) => h.missionId === m.id);
    const novelty = attempts.length === 0 ? 1 : 0.3;
    const best = bestDqs(history, m.id);
    const lastAt = attempts.reduce((t, h) => Math.max(t, h.completedAt), 0);
    const penalty =
      (lastAt && now - lastAt < DAY ? 0.3 : 0) + (best !== null && best >= 85 ? 0.4 : 0) + (missingPrerequisites(m, skills).length ? 0.25 : 0);
    const factors = {
      need: 0.35 * need,
      fit: 0.25 * fit,
      errorMatch: 0.25 * errorMatch,
      path: 0.1 * pathBonus,
      novelty: 0.05 * novelty,
      penalty: -penalty,
    };
    const score = Object.values(factors).reduce((a, b) => a + b, 0);
    return { m, score, factors };
  });
  scored.sort((a, b) => b.score - a.score || input.path.indexOf(a.m.id) - input.path.indexOf(b.m.id));

  const top = scored[0];
  let primary: Recommendation | null = null;
  if (top) {
    const { m, factors } = top;
    const matchedTag = m.targets.find((t) => recurring.includes(t));
    let reason: string;
    if (factors.errorMatch > 0 && matchedTag) {
      reason = `"${ERROR_TAGS[matchedTag]?.label ?? matchedTag}" showed up in several recent sessions. This mission trains exactly that.`;
    } else if (factors.path > 0 && factors.path + factors.novelty >= factors.need - 0.2) {
      reason = `Next step on your path. It builds ${describeSkill(m.skillPrimary, skills)}.`;
    } else if (factors.fit >= factors.need) {
      reason = `The right difficulty for where you are in ${SKILL_BY_ID[m.skillPrimary].name}.`;
    } else {
      reason = `${describeSkill(m.skillPrimary, skills)} is one of the skills where you have the most room to grow.`;
    }
    primary = { slot: "recommended", missionId: m.id, reason, score: top.score, factors };
  }

  const slots: Recommendation[] = [];
  if (next && next !== primary?.missionId) {
    const m = missions.find((x) => x.id === next)!;
    slots.push({ slot: "continue", missionId: next, reason: `Continue your path: ${m.title}.` });
  }

  const practiced = (Object.entries(skills) as [SkillId, SkillState][])
    .filter(([id, s]) => s.n > 0 && missions.some((m) => m.skillPrimary === id))
    .sort((a, b) => a[1].theta - b[1].theta);
  if (practiced.length > 0) {
    const [skillId] = practiced[0];
    const options = missions
      .filter((m) => m.skillPrimary === skillId && m.id !== primary?.missionId)
      .sort((a, b) => (bestDqs(history, a.id) ?? -1) - (bestDqs(history, b.id) ?? -1));
    if (options[0]) {
      slots.push({ slot: "practice", missionId: options[0].id, reason: `Practice ${describeSkill(skillId, skills)}.` });
    }
  }

  const strong = (Object.entries(skills) as [SkillId, SkillState][]).find(
    ([, s]) => levelAtLeast(s.theta, "proficient") && confidenceOf(s) !== "low",
  );
  if (strong) {
    const [skillId] = strong;
    const maxDone = Math.max(0, ...history.map((h) => missions.find((m) => m.id === h.missionId)).filter((m) => m?.skillPrimary === skillId).map((m) => m!.difficulty));
    const harder = missions.filter((m) => m.skillPrimary === skillId && m.difficulty > maxDone).sort((a, b) => a.difficulty - b.difficulty)[0];
    if (harder) slots.push({ slot: "harder", missionId: harder.id, reason: `You're ${LEVEL_LABEL[levelOf(skills[skillId].theta)]} in ${SKILL_BY_ID[skillId].name}. Ready for a harder scenario.` });
  }

  const review = [...history]
    .filter((h) => h.dqs !== null && h.dqs < 60)
    .sort((a, b) => b.completedAt - a.completedAt)[0];
  if (review) {
    const m = missions.find((x) => x.id === review.missionId);
    slots.push({
      slot: "review",
      missionId: review.missionId,
      sessionId: review.sessionId,
      reason: `Your process score on ${m?.title ?? review.missionId} was ${review.dqs}. Replay it to see what you knew at the time.`,
    });
  }

  return { primary, slots, recurring };
}
