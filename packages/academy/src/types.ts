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
  /** The interactive version: Hook → Learn → Try → Check → Recap. Lessons without it open in Read mode. */
  script?: LessonScript;
}

// ─── Interactive lessons (PLAN_LEARN §4, docs/learn) ───────────────────────

/** One candle in a figure, in price units (2 decimals). */
export interface CandleData {
  o: number;
  h: number;
  l: number;
  c: number;
  v?: number;
}

/** What a level means on a chart; the UI maps roles to the colour system (PLAN_LEARN §8.2). */
export type LevelRole = "entry" | "stop" | "target" | "support" | "resistance" | "neutral" | "concept";
/** Colour role for lines, markers and brackets. */
export type MarkRole = "accent" | "concept" | "up" | "down" | "neutral";

export type ChartLayer =
  | { kind: "line"; values: (number | null)[]; role?: MarkRole; label?: string; dashed?: boolean }
  | { kind: "ma"; period: number; role?: MarkRole; label?: string }
  | { kind: "level"; id?: string; price: number; role: LevelRole; label?: string; chip?: boolean }
  | { kind: "zone"; from: number; to: number; role: LevelRole; label?: string }
  | { kind: "marker"; index: number; price?: number; at?: "high" | "low" | "open" | "close"; label?: string; role?: MarkRole }
  | { kind: "bracket"; from: number; to: number; index?: number; label: string; role?: MarkRole }
  | { kind: "path"; points: { index: number; price: number }[]; role?: MarkRole; label?: string; dashed?: boolean };

export interface ChartSpec {
  candles: CandleData[];
  layers?: ChartLayer[];
  /** Candles after this count are hidden under the "unknown" veil until revealed. */
  visible?: number;
  /** Fixed price range; otherwise fitted to the data and levels. */
  range?: [number, number];
  /** Chart height in px (default 240). */
  height?: number;
  /** Draw only the layers (a line chart); the candles still set the time axis and slots. */
  hideCandles?: boolean;
  /** Screen-reader description; generated from the data when absent. */
  describe?: string;
}

export interface FigureStep {
  text: string;
  /** Layers that appear at this step (added to those of earlier steps). */
  layers?: ChartLayer[];
  /** Candles visible from this step on. */
  visible?: number;
}

export interface FormulaBox {
  text: string;
  /** The box the learner fills in (one per formula). */
  answer?: number;
  tolerance?: number;
  unit?: string;
}

export interface FlowNode {
  id: string;
  text: string;
  /** Terminal nodes have no branches. "pause" nodes have one way on. */
  kind?: "question" | "end" | "pause";
  yes?: string;
  no?: string;
  next?: string;
  /** For learner choices: which branch is right, and what to say on the other one. */
  correct?: "yes" | "no";
  explain?: string;
}

export type FigureSpec =
  | { kind: "chart"; chart: ChartSpec; steps: FigureStep[] }
  | { kind: "formula"; boxes: FormulaBox[]; operators: string[]; steps?: string[] }
  | { kind: "bars"; bars: { label: string; value: number; role?: MarkRole }[]; unit?: string; steps?: string[] }
  | { kind: "flow"; nodes: FlowNode[]; start: string; interactive?: boolean; steps?: string[] }
  /** A static diagram from before the chart kit, kept while it is being migrated. */
  | { kind: "diagram"; diagram: DiagramId; caption?: string };

export interface Choice {
  id: string;
  label: string;
  /** Shown when this choice is picked. */
  feedback?: string;
}

/** The control a learner answers with in a hook or a predict beat. */
export type AnswerControl =
  | { kind: "choice"; choices: Choice[]; answer?: string }
  | { kind: "slider"; min: number; max: number; step: number; unit?: string; start?: number; answer?: number; tolerance?: number; feedback?: { from: number; to: number; text: string }[] }
  | { kind: "numeric"; unit?: string; answer?: number; tolerance?: number; feedback?: { value: number; text: string }[] }
  | { kind: "tap"; chart: ChartSpec; zones: TapZone[]; answer?: string };

export interface TapZone {
  id: string;
  label: string;
  /** A price band (from–to) or a candle index (with optional price) defines where a tap lands. */
  price?: number;
  from?: number;
  to?: number;
  index?: number;
  feedback?: string;
}

/** Content a widget needs beyond its controls: the chart it plays, fixed prices, card sets. */
export interface TaskData {
  /** The chart the widget draws (order-fill, bracket-builder, level-drawer, trend-classifier). Candles after `visible` are the hidden future. */
  chart?: ChartSpec;
  /** Fixed entry price (bracket-builder). */
  entry?: number;
  /** Fixed position size (order-fill, bracket-builder). */
  units?: number;
  /** Text of the plan panel (order-fill). */
  plan?: string;
  /**
   * trend-classifier: segments A, B, C with the right label and evidence. Each has its own candles
   * (drawn as separate charts), or a candle index range of `chart`. `showMe` adds layers on Show me.
   */
  segments?: { id?: string; label: "trend" | "range" | "noise"; evidence: "hh_hl" | "lh_ll" | "bounded" | "overlap"; candles?: CandleData[]; from?: number; to?: number; showMe?: ChartLayer[] }[];
  /** trend-classifier: the evidence options, in order. */
  evidence?: { id: string; label: string }[];
  /** ma-period: one candle series per market ("trend", "range"). */
  series?: Record<string, CandleData[]>;
  /** ma-period: leading candles of each series used only to warm up the average (not drawn or counted). */
  warmup?: number;
  /** position-size: a price ruler beside the controls, with context levels, a note card and a fixed comparison row. */
  ruler?: { layers: ChartLayer[]; card?: string; compare?: string };
  /**
   * level-drawer breakout plan: after the band, the breakout candle (`breakIndex`, 0-based in `chart`) appears with
   * the entry; the stop must sit `minBelowBand`–`maxBelowBand` under the band; Play shows the endings in `order`.
   * `messages` are templates: {touches} {bandLow} {bandHigh} {stop} {risk} {total} {k} {close}.
   */
  breakout?: {
    endings: Record<string, CandleData[]>;
    order: string[];
    breakIndex: number;
    entry: number;
    stopRule: { minBelowBand: number; maxBelowBand: number };
    showMeEnding: string;
    messages: Record<string, string>;
  };
  /** bias-spotter: the cards, each a short situation; `answer` is an id from `options`; `rationales` explain wrong picks. */
  cards?: { id: string; text: string; answer: string; correct: string; rationales?: Record<string, string> }[];
  /** bias-spotter: the answer buttons, in order. */
  options?: { id: string; label: string }[];
}

/** One field a learner sets in a plan-fields beat (their own rules): a choice between values, or a stepper. */
export interface PlanField {
  id: string;
  label: string;
  kind: "choice" | "stepper";
  /** Choice values (choice fields). */
  options?: number[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  default: number;
}

/** Interactive task configuration for a widget (docs/learn/widgets.md). */
export interface TaskSpec {
  widget: string;
  goal: string;
  /** Content the widget needs (charts, fixed prices, cards). */
  data?: TaskData;
  /** Starting values, by the widget's field names. */
  start?: Record<string, number | string | boolean>;
  /** Controls the learner can't change. */
  locked?: string[];
  /** Output rows hidden until the task is solved (they would give the answer away). */
  hidden?: string[];
  success: import("./success").Condition;
  /** Checked in order after a wrong attempt; the first that matches is shown. */
  feedback?: import("./success").FeedbackCase[];
  correct: string;
  /** Shown when no feedback case matches. */
  incorrect?: string;
  hints: string[];
  /** The state "Show me" animates to. */
  showMe: Record<string, number | string | boolean>;
  concept?: string;
}

export type Beat =
  | { kind: "explain"; title?: string; text: string; figure?: FigureSpec }
  | { kind: "figure"; title?: string; figure: FigureSpec; text?: string; concept?: string }
  | { kind: "predict"; title?: string; prompt: string; control: AnswerControl; figure?: FigureSpec; reveal?: string; concept?: string }
  | { kind: "reveal"; title?: string; prompt: string; chart: ChartSpec; choices?: Choice[]; answer?: string; after: string; concept?: string }
  | { kind: "worked"; title: string; lines: string[]; ask?: { answer: number; tolerance?: number; unit?: string; feedback?: { value: number; text: string }[]; correct?: string; incorrect?: string }; after?: string; concept?: string }
  | { kind: "task"; title?: string; task: TaskSpec }
  | { kind: "match"; title?: string; prompt: string; pairs: { left: string; right: string; wrong?: string }[]; columns?: [string, string]; correct?: string; concept?: string }
  /** `note`: an optional free-text field shown once the order is solved, saved with the lesson under `key`. */
  | { kind: "order"; title?: string; prompt: string; items: string[]; explain?: string; wrong?: string; note?: { key: string; label: string; placeholder?: string }; concept?: string }
  /** The learner sets their own rules; any values for which `valid` holds are accepted and saved with the lesson. */
  | { kind: "fields"; title?: string; prompt: string; fields: PlanField[]; valid?: import("./success").Condition; correct?: string; feedback?: import("./success").FeedbackCase[]; concept?: string }
  | { kind: "hotspot"; title?: string; prompt: string; chart: ChartSpec; zones: TapZone[]; answer: string; correct: string; concept?: string }
  | { kind: "callout"; tone: "key" | "warning" | "info"; text: string };

export interface LessonScript {
  /** Course unit id, e.g. "1.4". */
  unit: string;
  /** Position in the course, e.g. "1.4.4". */
  courseId: string;
  /** The prediction before any explanation. `compare` is shown in the recap; `{yours}` is the learner's answer. */
  hook: { prompt: string; control: AnswerControl; figure?: FigureSpec; compare: string; concept?: string };
  learn: Beat[];
  task?: TaskSpec;
  /** Three question ids from the bank. */
  check: string[];
  recap: { takeaways: [string, string, string] };
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
  /** Why a learner might pick this wrong option, and the right reasoning (wrong options only). */
  rationale?: string;
}

/**
 * Generates fresh numbers for a numeric question, so reviews don't repeat the same figures.
 * `fields` are drawn from [min, max] in `step`s; `answer`, `prompt`, `explanation` and `hint` are
 * templates evaluated by the UI (`{field}` placeholders; `answer` is an expression over the fields).
 */
export interface VarySpec {
  fields: Record<string, [min: number, max: number, step: number]>;
  /** Arithmetic expression over the fields, e.g. "floor(budget / (entry - stop))". */
  answer: string;
  /** Conditions the drawn fields must meet; the generator draws again until they hold. */
  constraints?: string[];
  prompt: string;
  explanation: string;
  /** Replaces the last hint, which usually contains numbers. */
  hint?: string;
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
  /** Concept ids this question gives evidence for (one or two). */
  concepts?: string[];
  /** Up to three hints, from a direction to the first step worked out. */
  hints?: string[];
  vary?: VarySpec;
}

/** A unit of the course written in code: its lessons (with scripts), check questions, and new terms and concepts. */
export interface UnitContent {
  lessons: Lesson[];
  questions: Question[];
  terms: GlossaryTerm[];
  concepts: Concept[];
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
