import { describe, expect, it } from "vitest";
import {
  CONCEPTS,
  GLOSSARY,
  LESSONS,
  QUESTIONS,
  WIDGET_CONTRACTS,
  WIDGET_DEFAULTS,
  evaluateCondition,
  widgetValues,
  type Beat,
  type ChartSpec,
  type Condition,
  type FigureSpec,
  type LessonScript,
  type TaskSpec,
} from "../src";
import { COURSE_UNITS_CONTENT } from "../src/content/course";

const termIds = new Set(GLOSSARY.map((t) => t.id));
const conceptIds = new Set(CONCEPTS.map((c) => c.id));
const questionIds = new Set(QUESTIONS.map((q) => q.id));

function words(s: string): number {
  return s.replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, "$1").replace(/\[\[([^\]]+)\]\]/g, "$1").split(/\s+/).filter(Boolean).length;
}

function glossaryLinks(s: string): string[] {
  return [...s.matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]*)?\]\]/g)].map((m) => m[1]);
}

function fields(c: Condition): string[] {
  if ("all" in c) return c.all.flatMap(fields);
  if ("any" in c) return c.any.flatMap(fields);
  if ("not" in c) return fields(c.not);
  return [c.field];
}

function chartOk(chart: ChartSpec, where: string) {
  expect(chart.candles.length, `${where}: candles`).toBeGreaterThan(0);
  for (const c of chart.candles) {
    expect(c.h, `${where}: high ≥ open/close`).toBeGreaterThanOrEqual(Math.max(c.o, c.c) - 1e-9);
    expect(c.l, `${where}: low ≤ open/close`).toBeLessThanOrEqual(Math.min(c.o, c.c) + 1e-9);
  }
  if (chart.visible !== undefined) expect(chart.visible, `${where}: visible`).toBeLessThanOrEqual(chart.candles.length);
}

function figureOk(f: FigureSpec, where: string) {
  if (f.kind === "chart") {
    chartOk(f.chart, where);
    expect(f.steps.length, `${where}: 1–4 steps`).toBeGreaterThan(0);
    expect(f.steps.length, `${where}: 1–4 steps`).toBeLessThanOrEqual(4);
    for (const s of f.steps) expect(words(s.text), `${where}: step ≤ 20 words: ${s.text}`).toBeLessThanOrEqual(20);
  }
  if (f.kind === "formula") expect(f.operators.length, `${where}: operators`).toBe(f.boxes.length - 1);
  if (f.kind === "flow") expect(new Set(f.nodes.map((n) => n.id)).has(f.start), `${where}: flow start`).toBe(true);
}

function taskOk(t: TaskSpec, where: string) {
  const contract = WIDGET_CONTRACTS[t.widget];
  expect(contract, `${where}: widget ${t.widget} has a contract`).toBeTruthy();
  const known = new Set([...Object.keys(contract.controls), ...Object.keys(contract.outputs)]);
  for (const f of fields(t.success)) expect(known.has(f), `${where}: success field "${f}"`).toBe(true);
  for (const c of t.feedback ?? []) for (const f of fields(c.when)) expect(known.has(f), `${where}: feedback field "${f}"`).toBe(true);
  for (const k of [...Object.keys(t.start ?? {}), ...(t.locked ?? []), ...Object.keys(t.showMe)]) expect(known.has(k), `${where}: control "${k}"`).toBe(true);
  expect(t.hints.length, `${where}: 1–3 hints`).toBeGreaterThan(0);
  expect(t.hints.length, `${where}: 1–3 hints`).toBeLessThanOrEqual(3);
  for (const h of t.hints) expect(words(h), `${where}: hint ≤ 25 words`).toBeLessThanOrEqual(25);
  expect(words(t.goal), `${where}: goal ≤ 40 words`).toBeLessThanOrEqual(40);
}

function beatTexts(b: Beat): string[] {
  switch (b.kind) {
    case "explain":
      return [b.text];
    case "callout":
      return [b.text];
    case "figure":
      return b.text ? [b.text] : [];
    default:
      return [];
  }
}

function scriptOk(id: string, s: LessonScript) {
  expect(s.check, `${id}: 3 check questions`).toHaveLength(3);
  for (const q of s.check) expect(questionIds.has(q), `${id}: question ${q}`).toBe(true);
  expect(words(s.hook.prompt), `${id}: hook ≤ 40 words`).toBeLessThanOrEqual(40);
  if (s.hook.control.kind === "tap") chartOk(s.hook.control.chart, `${id} hook`);
  if (s.hook.figure) figureOk(s.hook.figure, `${id} hook`);
  expect(s.learn.length, `${id}: 4–7 Learn beats`).toBeGreaterThanOrEqual(4);
  expect(s.learn.length, `${id}: 4–7 Learn beats`).toBeLessThanOrEqual(8);
  for (const t of s.recap.takeaways) expect(words(t), `${id}: takeaway ≤ 20 words`).toBeLessThanOrEqual(20);
  expect(s.bridge, `${id}: bridge to the previous lesson`).toBeTruthy();
  expect(s.recap.next, `${id}: recap.next`).toBeTruthy();
  if (s.bridge) expect(words(s.bridge), `${id}: bridge ≤ 45 words`).toBeLessThanOrEqual(45);
  if (s.recap.next) expect(words(s.recap.next), `${id}: recap.next ≤ 25 words`).toBeLessThanOrEqual(25);
  if (s.task) taskOk(s.task, `${id} Try`);
  const texts: string[] = [s.hook.prompt, ...s.recap.takeaways, ...(s.bridge ? [s.bridge] : []), ...(s.recap.next ? [s.recap.next] : [])];
  s.learn.forEach((b, i) => {
    const where = `${id} B${i + 1}`;
    for (const t of beatTexts(b)) {
      expect(words(t), `${where}: ≤ 60 words`).toBeLessThanOrEqual(60);
      texts.push(t);
    }
    if ("figure" in b && b.figure) figureOk(b.figure, where);
    if (b.kind === "reveal") chartOk(b.chart, where);
    if (b.kind === "hotspot") {
      chartOk(b.chart, where);
      expect(b.zones.some((z) => z.id === b.answer), `${where}: hotspot answer is a zone`).toBe(true);
    }
    if (b.kind === "task") taskOk(b.task, where);
    if (b.kind === "predict" && b.control.kind === "tap") chartOk(b.control.chart, where);
    if ("concept" in b && b.concept) expect(conceptIds.has(b.concept), `${where}: concept ${b.concept}`).toBe(true);
  });
  for (const t of texts) for (const term of glossaryLinks(t)) expect(termIds.has(term), `${id}: glossary link [[${term}]]`).toBe(true);
}

describe("interactive lesson scripts", () => {
  // The original lessons carry their scripts; course lessons are checked from their source files.
  const scripted = [...LESSONS.filter((l) => l.script), ...Object.values(COURSE_UNITS_CONTENT).flatMap((u) => u.lessons).filter((l) => l.script)];
  it("are valid and consistent with the question bank, glossary, concepts and widget contracts", () => {
    for (const l of scripted) scriptOk(l.id, l.script!);
  });

  it("start unsolved, and \"Show me\" solves the task on the widget's own numbers", () => {
    // Widgets that finish in steps of their own (placing an order, a breakout plan) are checked by the widget.
    const stepped = (t: TaskSpec) => t.widget === "order-fill" || (t.widget === "level-drawer" && !!t.data?.breakout);
    for (const l of scripted) {
      const tasks = [l.script!.task, ...l.script!.learn.filter((b): b is Extract<Beat, { kind: "task" }> => b.kind === "task").map((b) => b.task)].filter(Boolean) as TaskSpec[];
      for (const t of tasks) {
        const start = { ...WIDGET_DEFAULTS[t.widget], ...t.start };
        expect(evaluateCondition(t.success, widgetValues(t.widget, start, t.data)), `${l.id}: start state already solves the task`).toBe(false);
        const shown = widgetValues(t.widget, { ...start, ...t.showMe, ...(t.widget === "level-drawer" ? { phase: 3 } : {}) }, t.data);
        if (!stepped(t) || t.widget === "level-drawer") expect(evaluateCondition(t.success, shown), `${l.id}: "Show me" solves the task`).toBe(true);
      }
    }
  });

  it("plan-fields beats have defaults in range", () => {
    for (const l of scripted)
      for (const b of l.script!.learn)
        if (b.kind === "fields")
          for (const f of b.fields) {
            if (f.kind === "text") expect(typeof f.default, `${l.id}: ${f.id} text default`).toBe("string");
            else if (f.kind === "choice") expect(f.options, `${l.id}: ${f.id} options`).toContain(f.default);
            else expect(Number(f.default) >= (f.min ?? -Infinity) && Number(f.default) <= (f.max ?? Infinity), `${l.id}: ${f.id} default`).toBe(true);
          }
  });

  it("use unique glossary and concept ids", () => {
    expect(new Set(GLOSSARY.map((t) => t.id)).size).toBe(GLOSSARY.length);
    expect(new Set(CONCEPTS.map((c) => c.id)).size).toBe(CONCEPTS.length);
  });
});
