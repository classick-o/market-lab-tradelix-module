import type { Candle, CostModel, OrderType, RiskRules, Side, Action } from "@market-lab/engine";
import type { CriterionDef, Hypothesis, SkillId } from "@market-lab/evaluation";
import type { SkillLevel } from "@market-lab/learning";

export type Facts = Record<string, number | string | boolean>;

/** What a mission can know at a checkpoint. Built only from candles that are visible at that step. */
export interface FactContext {
  step: number;
  /** Candles 0..step. Never contains a future candle. */
  visible: readonly Candle[];
  equity: number;
  bid: number;
  ask: number;
  positionQty: number;
  variantFacts: Facts;
}

export interface ChipDef {
  id: string;
  label: string;
}

export interface OptionDef {
  id: string;
  label: string;
  description?: string;
  /**
   * enter: opens the order ticket. wait: goes to `next`. skip / hold: no trade.
   * close, close_half: exit all / half the position. widen_stop / tighten_stop: move the stop to `stopFact`.
   */
  action?: "enter" | "wait" | "skip" | "hold" | "close" | "close_half" | "widen_stop" | "tighten_stop";
  next?: string;
  stopFact?: string;
  /** Reason chips are required for this option. */
  requiresReason?: boolean;
}

export type Trigger =
  | { atStep: number }
  | {
      /** Evaluated on each new candle; only sees visible candles. */
      condition: (visible: readonly Candle[], facts: Facts) => boolean;
      maxSteps: number;
      onTimeout: "conclude" | { goto: string };
      waitingText: string;
    };

export type CheckpointKind = "choice" | "pick" | "numeric" | "decision" | "manage";

export interface CheckpointDef {
  id: string;
  kind: CheckpointKind;
  trigger: Trigger;
  title: string;
  prompt: string | ((facts: Facts) => string);
  /** Only reachable through an option's `next` (not in the default sequence). */
  onlyVia?: boolean;
  options?: OptionDef[];
  reasons?: ChipDef[];
  requireReason?: boolean;
  checklist?: { id: string; label: string }[];
  pick?: { label: string };
  numeric?: { label: string; unit: string };
  /** Order ticket configuration for "enter" options. */
  ticket?: {
    sides: Side[];
    orderTypes: OrderType[];
    requireHypothesis: boolean;
    hypothesisReasons: ChipDef[];
    /** Values to pre-fill (cents / units), computed from facts. */
    defaults?: (facts: Facts) => { stopLoss?: number; takeProfit?: number; qty?: number; riskPct?: number };
    lockStop?: boolean;
  };
  /** Fact keys to show as context cards: [key, label, format]. */
  cards?: { fact: string; label: string; format: "price" | "pct" | "int" | "text" }[];
  /** Highlight a candle / zone on the chart while this checkpoint is open. */
  highlight?: (facts: Facts) => ChartHighlight;
}

export interface ChartHighlight {
  candle?: number;
  zone?: { from: number; to: number; label?: string };
  levels?: { price: number; label: string; tone: "neutral" | "warn" | "good" | "bad" }[];
}

export interface CheckpointAnswer {
  optionId?: string;
  reasons: string[];
  pickPrice?: number;
  numeric?: number;
  checklist?: Record<string, boolean>;
  hypothesis?: Hypothesis;
  order?: {
    side: Side;
    orderType: OrderType;
    qty: number;
    limitPrice?: number;
    stopLoss: number | null;
    takeProfit: number | null;
  };
}

export interface VariantDef {
  key: string;
  /** Shown in the debrief, after the fact: what this run of the market did. */
  label: string;
  /** Facts known about the visible past (e.g. "the last 40 candles are a range"). */
  facts?: Facts;
}

export interface AlternativeDef {
  id: string;
  label: string;
  description: string;
  answers: Record<string, (facts: Facts, ctx: { equity: number; bid: number; ask: number; commissionBps: number }) => CheckpointAnswer>;
}

export interface MissionDef {
  id: string;
  version: number;
  title: string;
  tagline: string;
  skillPrimary: SkillId;
  skillsSecondary: SkillId[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  estMinutes: number;
  objective: string;
  briefing: string;
  rulesText: string[];
  dataLabel: "synthetic" | "hypothetical";
  symbol: string;
  variants: VariantDef[];
  /** Index of the last candle visible when the mission starts. */
  startStep: number;
  /** Last candle of the mission. Defaults to the end of the data. */
  endStep?: number;
  equity: number;
  costs?: CostModel;
  rules: RiskRules;
  /** Actions applied by the system at the start (e.g. an existing position). */
  setup?: (facts: Facts, ctx: FactContext) => Action[];
  setupText?: string;
  facts?: (ctx: FactContext) => Facts;
  checkpoints: CheckpointDef[];
  rubric: (facts: Facts) => CriterionDef[];
  alternatives: AlternativeDef[];
  reflection: { question: string; options: ChipDef[] };
  /** Error tags this mission trains. */
  targets: string[];
  prerequisites: { skill: SkillId; level: SkillLevel }[];
}

export const DEFAULT_COSTS: CostModel = { halfSpread: 5, commissionBps: 5 };
