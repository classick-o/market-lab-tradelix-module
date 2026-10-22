/**
 * Declarative success conditions and feedback cases for interactive tasks.
 * Content describes "what counts as right" as data; widgets expose their current values by name;
 * these pure functions decide. Prices and money are compared exactly, so content should use cents
 * or two-decimal values and the widget should round before exposing them.
 */

export type TaskValue = number | string | boolean;
export type TaskValues = Record<string, TaskValue>;

export type Condition =
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }
  | {
      field: string;
      eq?: TaskValue;
      ne?: TaskValue;
      gt?: number;
      gte?: number;
      lt?: number;
      lte?: number;
      /** For `eq` on numbers: accepted absolute difference. */
      tol?: number;
    };

const EPS = 1e-9;

export function evaluateCondition(c: Condition, v: TaskValues): boolean {
  if ("all" in c) return c.all.every((x) => evaluateCondition(x, v));
  if ("any" in c) return c.any.some((x) => evaluateCondition(x, v));
  if ("not" in c) return !evaluateCondition(c.not, v);
  const x = v[c.field];
  if (x === undefined) return false;
  if (c.eq !== undefined) {
    if (typeof c.eq === "number" && typeof x === "number") {
      if (Math.abs(x - c.eq) > (c.tol ?? 0) + EPS) return false;
    } else if (x !== c.eq) return false;
  }
  if (c.ne !== undefined && x === c.ne) return false;
  if (typeof x === "number") {
    if (c.gt !== undefined && !(x > c.gt + EPS)) return false;
    if (c.gte !== undefined && !(x >= c.gte - EPS)) return false;
    if (c.lt !== undefined && !(x < c.lt - EPS)) return false;
    if (c.lte !== undefined && !(x <= c.lte + EPS)) return false;
  } else if (c.gt !== undefined || c.gte !== undefined || c.lt !== undefined || c.lte !== undefined) {
    return false;
  }
  return true;
}

export interface FeedbackCase {
  when: Condition;
  /** May contain {placeholders} filled from the task values. */
  text: string;
}

/** The first feedback case whose condition holds, or undefined. */
export function pickFeedback(cases: FeedbackCase[], v: TaskValues): FeedbackCase | undefined {
  return cases.find((c) => evaluateCondition(c.when, v));
}

/**
 * Fills placeholders from the task values. `{name:2}` shows a number with 2 decimals (prices, money);
 * `{name}` shows whole numbers as they are and other numbers with 2 decimals. Thousands get commas.
 */
export function fillTemplate(text: string, v: TaskValues): string {
  return text.replace(/\{([a-zA-Z0-9_]+)(?::(\d))?\}/g, (m, name: string, digits?: string) => {
    const x = v[name];
    if (x === undefined) return m;
    if (typeof x !== "number") return String(x);
    const d = digits !== undefined ? Number(digits) : Number.isInteger(x) ? 0 : 2;
    return x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  });
}
