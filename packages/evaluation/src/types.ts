import type { PositionSide, RiskRules } from "@market-lab/engine";

export type SkillId =
  | "market_basics"
  | "order_mechanics"
  | "risk_management"
  | "position_sizing"
  | "market_structure"
  | "scenario_analysis"
  | "decision_discipline"
  | "reflection_review";

export type Confidence = "low" | "medium" | "high";

export interface Hypothesis {
  direction: "up" | "down" | "unclear";
  reasons: string[];
  confidence: Confidence;
  note?: string;
}

/** What the user answered at one checkpoint. */
export interface AnswerView {
  checkpointId: string;
  step: number;
  optionId?: string;
  reasons: string[];
  pickPrice?: number;
  numeric?: number;
  checklist?: Record<string, boolean>;
  hypothesis?: Hypothesis;
}

/** An entry the user decided on, with everything known at the moment of the decision. */
export interface EntryView {
  checkpointId: string | null;
  step: number;
  side: PositionSide;
  qty: number;
  /** Expected execution price at decision time (ask/bid, or the limit price). */
  entryPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  risk: number | null;
  riskPct: number | null;
  rewardRisk: number | null;
  equityAtEntry: number;
  hypothesis?: Hypothesis;
  /** The previous closed trade was a loss (known at decision time). */
  afterLoss: boolean;
  /** Risk of the previous entry, for revenge-sizing checks. */
  previousRisk: number | null;
  /** Average true range of the visible candles when the order was placed (duels). */
  atr?: number;
  /** SMA 20 of the visible candles when the order was placed (duels). */
  sma20?: number | null;
}

export interface StopChangeView {
  step: number;
  side: PositionSide;
  from: number | null;
  to: number | null;
}

/**
 * Everything an evaluator may look at. By construction it contains no outcome:
 * no P&L, no final equity, no prices after a decision. Facts are computed only
 * from candles that were visible when the decision was made.
 */
export interface ProcessView {
  missionId: string;
  initialEquity: number;
  commissionBps: number;
  rules: RiskRules;
  answers: AnswerView[];
  entries: EntryView[];
  stopChanges: StopChangeView[];
  facts: Record<string, number | string | boolean>;
}

export interface EvalResult {
  applicable: boolean;
  /** 0..1 */
  score: number;
  detail: string;
  errorTags?: string[];
}

export type AppliesIf = "always" | "entered" | "not_entered";

export interface CriterionDef {
  id: string;
  label: string;
  evaluator: string;
  weight: number;
  skill: SkillId;
  appliesIf?: AppliesIf;
  params?: Record<string, unknown>;
}

export interface CriterionResult {
  id: string;
  label: string;
  /** Evaluator name, used to group criteria (e.g. into Risk Discipline). */
  evaluator: string;
  skill: SkillId;
  weight: number;
  applicable: boolean;
  score: number;
  detail: string;
  errorTags: string[];
}

export type DqsBand = "work_on_it" | "in_progress" | "solid" | "excellent";

export interface DqsResult {
  dqs: number | null;
  band: DqsBand | null;
  criteria: CriterionResult[];
  errorTags: string[];
}
