import { EVALUATORS } from "./evaluators";
import type { CriterionDef, CriterionResult, DqsBand, DqsResult, ProcessView } from "./types";

export const EVALUATION_VERSION = "1.0.0";

export function bandOf(dqs: number): DqsBand {
  if (dqs < 50) return "work_on_it";
  if (dqs < 75) return "in_progress";
  if (dqs < 90) return "solid";
  return "excellent";
}

export const BAND_LABEL: Record<DqsBand, string> = {
  work_on_it: "Work on it",
  in_progress: "In progress",
  solid: "Solid",
  excellent: "Excellent",
};

/**
 * DQS = round(100 × Σ(wᵢ·sᵢ) / Σwᵢ) over applicable criteria.
 * Weights of criteria that don't apply to the user's path are redistributed proportionally.
 */
export function scoreRubric(criteria: readonly CriterionDef[], view: ProcessView): DqsResult {
  const entered = view.entries.length > 0;
  const results: CriterionResult[] = criteria.map((c) => {
    const applies = c.appliesIf === "entered" ? entered : c.appliesIf === "not_entered" ? !entered : true;
    const base = { id: c.id, label: c.label, evaluator: c.evaluator, skill: c.skill, weight: c.weight };
    if (!applies) return { ...base, applicable: false, score: 0, detail: "Not applicable to the path you took.", errorTags: [] };
    const evaluator = EVALUATORS[c.evaluator];
    if (!evaluator) throw new Error(`Unknown evaluator "${c.evaluator}" in criterion "${c.id}".`);
    const r = evaluator(view, c.params ?? {});
    return { ...base, applicable: r.applicable, score: r.applicable ? r.score : 0, detail: r.detail, errorTags: r.applicable ? (r.errorTags ?? []) : [] };
  });

  const applicable = results.filter((r) => r.applicable);
  const totalWeight = applicable.reduce((s, r) => s + r.weight, 0);
  const dqs = totalWeight > 0 ? Math.round((100 * applicable.reduce((s, r) => s + r.weight * r.score, 0)) / totalWeight) : null;
  const errorTags = [...new Set(applicable.flatMap((r) => r.errorTags))];
  return { dqs, band: dqs === null ? null : bandOf(dqs), criteria: results, errorTags };
}

/**
 * Criteria that measure whether risk limits were respected, independently of how good the idea was:
 * a stop on every entry, risk within the limit, sizing from the stop, never widening a stop,
 * no sizing up after a loss, and the scenario rules.
 */
export const DISCIPLINE_EVALUATORS = new Set([
  "invalidation_before_entry",
  "risk_within_limit",
  "size_matches_risk",
  "followed_rules",
  "no_stop_widening",
  "no_revenge_sizing",
]);

/**
 * Risk Discipline Score: the weighted score of the discipline criteria only.
 * Null when none applied (e.g. no position was ever taken).
 */
export function riskDisciplineScore(criteria: readonly CriterionResult[]): number | null {
  const applicable = criteria.filter((c) => c.applicable && DISCIPLINE_EVALUATORS.has(c.evaluator));
  const total = applicable.reduce((s, c) => s + c.weight, 0);
  return total > 0 ? Math.round((100 * applicable.reduce((s, c) => s + c.weight * c.score, 0)) / total) : null;
}
