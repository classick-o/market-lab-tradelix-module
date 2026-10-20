import type { SkillId } from "@market-lab/evaluation";

/** The ten topics shared by missions, lessons, concepts and knowledge checks. */
export type TopicId =
  | "market_fundamentals"
  | "technical_analysis"
  | "order_types"
  | "risk_management"
  | "position_sizing"
  | "stop_loss"
  | "psychology"
  | "decision_making"
  | "portfolio_exposure"
  | "scenario_analysis";

export interface Topic {
  id: TopicId;
  name: string;
  description: string;
  /** Skill in the learning profile that this topic feeds. */
  skill: SkillId;
  icon: string;
}

export type Tier = "free" | "pro";
export type ContentLevel = "beginner" | "intermediate";

/** Illustrations drawn by the UI. Lessons refer to them by id. */
export type DiagramId =
  | "candle-anatomy"
  | "bid-ask-spread"
  | "market-vs-limit"
  | "stop-placement"
  | "trend-range-noise"
  | "support-resistance"
  | "breakout-false-breakout"
  | "moving-average"
  | "risk-reward"
  | "position-size-formula"
  | "exposure-leverage"
  | "loss-recovery"
  | "volatility-regimes"
  | "decision-tree";

/** Interactive examples rendered by the UI. Lessons refer to them by id. */
export type WidgetId = "candle-builder" | "spread-cost" | "position-size" | "risk-reward" | "expectancy" | "exposure" | "loss-recovery";

/**
 * Lesson content. Strings are plain text; `**bold**` is the only inline markup.
 * Numbers in examples are in vUSD and must be arithmetically exact.
 */
export type LessonBlock =
  | { kind: "heading"; text: string }
  | { kind: "text"; text: string }
  | { kind: "points"; items: string[] }
  | { kind: "steps"; items: string[] }
  | { kind: "example"; title: string; lines: string[]; result?: string }
  | { kind: "figure"; diagram: DiagramId; caption: string }
  | { kind: "interactive"; widget: WidgetId; title: string; prompt: string }
  | { kind: "callout"; tone: "info" | "warning" | "key"; text: string }
  /** Embedded knowledge check: ids from the question bank. */
  | { kind: "check"; questionIds: string[] };

export interface PracticeLink {
  kind: "mission" | "calculator" | "arena" | "check";
  /** Mission id (e.g. "M04"), "risk-calculator", an Arena scenario id, or a topic id for "check". */
  ref: string;
  label: string;
}

export interface Lesson {
  /** e.g. "L01". Stable: progress is stored by id. */
  id: string;
  title: string;
  topic: TopicId;
  level: ContentLevel;
  tier: Tier;
  minutes: number;
  /** One sentence. */
  summary: string;
  /** Two or three "you will be able to…" outcomes. */
  objectives: string[];
  blocks: LessonBlock[];
  practice: PracticeLink[];
}

export interface Concept {
  /** kebab-case, e.g. "stop-loss". */
  id: string;
  name: string;
  category: TopicId;
  /** One-sentence definition. */
  summary: string;
  /** One to three short paragraphs. */
  body: string[];
  /** A concrete worked example, with numbers where useful. */
  example: string;
  /** Other concept ids. */
  related: string[];
  /** Mission ids. */
  missions: string[];
  /** Lesson ids. */
  lessons: string[];
}

export interface GlossaryTerm {
  /** kebab-case, e.g. "bid-price". */
  id: string;
  term: string;
  /** Precise definition, one or two sentences. */
  definition: string;
  /** "In plain words": a beginner-friendly explanation, one or two sentences. */
  plain: string;
  /** Other glossary term ids. */
  related: string[];
  /** Lesson id where the term is explained. */
  lesson?: string;
  /** Abbreviations or alternative names, e.g. ["SL"]. */
  aka?: string[];
}

export interface QuestionOption {
  id: string;
  label: string;
}

/**
 * A knowledge-check question. "mcq" and "scenario" have options and a correct option id.
 * "numeric" is a short practical exercise: the user types a number.
 */
export interface Question {
  /** e.g. "q-candles-1". */
  id: string;
  topic: TopicId;
  kind: "mcq" | "scenario" | "numeric";
  difficulty: 1 | 2 | 3;
  /** Context paragraph for scenario questions. */
  scenario?: string;
  prompt: string;
  options?: QuestionOption[];
  correct?: string;
  numeric?: { answer: number; tolerance: number; unit: string };
  /** Shown after submission, whatever the answer. Explains why, not just what. */
  explanation: string;
  /** Lesson to review when the answer is wrong. */
  lesson: string;
}

export type PathStep = { kind: "lesson"; id: string } | { kind: "mission"; id: string } | { kind: "check"; id: string };

export interface LearningPath {
  id: string;
  title: string;
  level: ContentLevel | "all";
  tier: Tier;
  description: string;
  outcomes: string[];
  steps: PathStep[];
}

export interface KnowledgeCheck {
  id: string;
  title: string;
  topic: TopicId;
  description: string;
  questionIds: string[];
  /** Percentage needed to pass. */
  passPct: number;
  /** "check": short practice quiz. "assessment": the longer topic test. */
  kind: "check" | "assessment";
}
