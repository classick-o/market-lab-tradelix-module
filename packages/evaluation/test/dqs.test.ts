import { describe, expect, it } from "vitest";
import { scoreRubric, type CriterionDef, type EntryView, type ProcessView } from "../src";

const baseView = (over: Partial<ProcessView> = {}): ProcessView => ({
  missionId: "TEST",
  initialEquity: 1_000_000,
  commissionBps: 5,
  rules: { allowShort: false, orderTypes: ["market"], maxLeverage: 1, requireStop: false },
  answers: [],
  entries: [],
  stopChanges: [],
  facts: {},
  ...over,
});

const entry = (over: Partial<EntryView> = {}): EntryView => ({
  checkpointId: "cp",
  step: 10,
  side: "long",
  qty: 46,
  entryPrice: 10005,
  stopLoss: 9800,
  takeProfit: null,
  risk: 9887,
  riskPct: 0.9887,
  rewardRisk: null,
  equityAtEntry: 1_000_000,
  hypothesis: { direction: "up", reasons: ["trend"], confidence: "medium" },
  afterLoss: false,
  previousRisk: null,
  ...over,
});

const rubric: CriterionDef[] = [
  { id: "hyp", label: "Hypothesis", evaluator: "hypothesis_stated", weight: 25, skill: "scenario_analysis", appliesIf: "entered" },
  { id: "inv", label: "Invalidation", evaluator: "invalidation_before_entry", weight: 30, skill: "risk_management", appliesIf: "entered" },
  { id: "rules", label: "Rules", evaluator: "followed_rules", weight: 45, skill: "decision_discipline", params: { maxPct: 2 } },
];

describe("scoreRubric", () => {
  it("scores a well-defined entry at 100", () => {
    expect(scoreRubric(rubric, baseView({ entries: [entry()] })).dqs).toBe(100);
  });

  it("redistributes the weight of criteria that don't apply", () => {
    const r = scoreRubric(rubric, baseView());
    expect(r.criteria.filter((c) => c.applicable).map((c) => c.id)).toEqual(["rules"]);
    expect(r.dqs).toBe(100);
  });

  it("penalises a missing stop and tags it", () => {
    const r = scoreRubric(rubric, baseView({ entries: [entry({ stopLoss: null, risk: null, riskPct: null })] }));
    expect(r.dqs).toBe(25);
    expect(r.errorTags).toContain("no_stop");
  });

  it("cannot see outcomes: ProcessView has no P&L, so identical decisions score identically", () => {
    const a = scoreRubric(rubric, baseView({ entries: [entry()] }));
    const b = scoreRubric(rubric, baseView({ entries: [entry()], facts: { anything: 1 } }));
    expect(a).toEqual(b);
  });

  it("flags oversized positions against the cost-aware maximum", () => {
    const r = scoreRubric(
      [{ id: "size", label: "Size", evaluator: "size_matches_risk", weight: 1, skill: "position_sizing", params: { riskPct: 1 } }],
      baseView({ entries: [entry({ qty: 50 })] }),
    );
    expect(r.criteria[0].score).toBe(0.4);
    expect(r.errorTags).toEqual(["oversized"]);
  });
});
