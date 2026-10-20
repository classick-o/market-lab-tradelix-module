import type { Confidence, SkillId } from "@market-lab/evaluation";
import { SKILLS } from "./skills";

export interface SkillState {
  /** Estimated ability on a logit scale. Roughly −2 (new) … +2 (strong). */
  theta: number;
  /** Number of evidence records. */
  n: number;
  /** Last five (performance − expected) residuals, used for confidence. */
  residuals: number[];
  updatedAt: number | null;
}

export type SelfLevel = "beginner" | "unsure" | "basics";
export type SkillLevel = "novice" | "developing" | "proficient" | "advanced";

export interface Evidence {
  skill: SkillId;
  /** 0..1 */
  performance: number;
  /** Mission difficulty 1..5 */
  difficulty: number;
  /** 1 for the primary skill, 0.5 for secondary skills and placement, 0.3 for Arena. */
  weight: number;
}

export const PROFILE_VERSION = "1.0.0";

const PRIOR: Record<SelfLevel, number> = { beginner: -1, unsure: -0.5, basics: 0 };
const MAX_STEP = 0.3;

export function initialSkills(self: SelfLevel): Record<SkillId, SkillState> {
  const theta = PRIOR[self];
  const entries = SKILLS.map((s): [SkillId, SkillState] => [
    s.id,
    { theta: s.id === "reflection_review" ? Math.min(theta, -0.5) : theta, n: 0, residuals: [], updatedAt: null },
  ]);
  return Object.fromEntries(entries) as Record<SkillId, SkillState>;
}

export function difficultyToB(difficulty: number): number {
  return (difficulty - 3) * 0.5;
}

export function expectedPerformance(theta: number, difficulty: number): number {
  return 1 / (1 + Math.exp(-(theta - difficultyToB(difficulty))));
}

/**
 * Elo-style update: θ ← θ + K·w·(p − E), with K shrinking as evidence accumulates and every
 * step capped, so a single decision can never swing the profile dramatically.
 */
export function applyEvidence(state: SkillState, ev: Evidence, at: number): SkillState {
  const e = expectedPerformance(state.theta, ev.difficulty);
  const k = 0.5 / (1 + 0.12 * state.n);
  const delta = Math.max(-MAX_STEP, Math.min(MAX_STEP, k * ev.weight * (ev.performance - e)));
  return {
    theta: Math.round((state.theta + delta) * 10000) / 10000,
    n: state.n + 1,
    residuals: [...state.residuals, ev.performance - e].slice(-5),
    updatedAt: at,
  };
}

export function levelOf(theta: number): SkillLevel {
  if (theta < -0.5) return "novice";
  if (theta < 0.25) return "developing";
  if (theta < 1) return "proficient";
  return "advanced";
}

export const LEVEL_LABEL: Record<SkillLevel, string> = {
  novice: "Novice",
  developing: "Developing",
  proficient: "Proficient",
  advanced: "Advanced",
};

const LEVEL_RANK: Record<SkillLevel, number> = { novice: 0, developing: 1, proficient: 2, advanced: 3 };

export function levelAtLeast(theta: number, min: SkillLevel): boolean {
  return LEVEL_RANK[levelOf(theta)] >= LEVEL_RANK[min];
}

export function confidenceOf(state: SkillState): Confidence {
  if (state.n < 3) return "low";
  if (state.n < 8) return "medium";
  const r = state.residuals;
  const m = r.reduce((a, b) => a + b, 0) / r.length;
  const sd = Math.sqrt(r.reduce((a, b) => a + (b - m) ** 2, 0) / r.length);
  return sd < 0.25 ? "high" : "medium";
}

/** Position of θ on a 0..1 bar spanning −2..+2. */
export function thetaProgress(theta: number): number {
  return Math.max(0, Math.min(1, (theta + 2) / 4));
}
