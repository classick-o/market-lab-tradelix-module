import { dayIndex, seedOf, weekDays, dayKey } from "./calendar";
import type { ProgressSnapshot } from "./progress";
import type { Question, TopicId } from "./types";

// ─── Daily challenges ───────────────────────────────────────────────────────

/** One item of a daily challenge. Numeric items are graded with a tolerance. */
export interface ChallengeItem {
  id: string;
  prompt: string;
  kind: "numeric" | "choice";
  options?: { id: string; label: string }[];
  correct?: string;
  answer?: number;
  tolerance?: number;
  unit?: string;
  explanation: string;
}

export interface DailyChallenge {
  day: string;
  theme: string;
  title: string;
  /** The single learning objective of the day. */
  objective: string;
  items: ChallengeItem[];
  /** Lesson to revisit if it goes badly. */
  lesson: string;
}

export const DAILY_XP = { perCorrect: 10, completion: 10 } as const;

function rngFrom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fmt = (cents: number) => (cents / 100).toFixed(2);
const pickOf = <T>(r: () => number, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];

function sizingItem(r: () => number, i: number): ChallengeItem {
  const riskPct = pickOf(r, [0.5, 1, 1, 2]);
  const entry = Math.round(40 + r() * 120) * 100 + pickOf(r, [0, 25, 50]);
  const dist = pickOf(r, [50, 80, 100, 125, 150, 200, 250, 400]);
  const stop = entry - dist;
  const budget = 1_000_000 * (riskPct / 100);
  const units = Math.floor(budget / dist);
  return {
    id: `size-${i}`,
    kind: "numeric",
    prompt: `Account 10,000.00 vUSD, risk ${riskPct}%. You buy at ${fmt(entry)} with a stop at ${fmt(stop)}. How many units can you buy? Ignore costs and round down.`,
    answer: units,
    tolerance: 0,
    unit: "units",
    explanation: `Risk budget = ${fmt(budget)} vUSD. Distance to stop = ${fmt(dist)}. Units = ${fmt(budget)} ÷ ${fmt(dist)} = ${(budget / dist).toFixed(2)}, rounded down to ${units}.`,
  };
}

function riskAmountItem(r: () => number, i: number): ChallengeItem {
  const qty = pickOf(r, [20, 25, 40, 50, 80, 100, 120, 150]);
  const entry = Math.round(50 + r() * 100) * 100;
  const dist = pickOf(r, [50, 75, 100, 150, 200, 300]);
  const loss = (qty * dist) / 100;
  return {
    id: `risk-${i}`,
    kind: "numeric",
    prompt: `You hold ${qty} units bought at ${fmt(entry)}, with a stop at ${fmt(entry - dist)}. How much do you lose, in vUSD, if the stop fills exactly at its price? Ignore costs.`,
    answer: loss,
    tolerance: 0.01,
    unit: "vUSD",
    explanation: `Loss = units × distance = ${qty} × ${fmt(dist)} = ${loss.toFixed(2)} vUSD. Costs and gaps would make it a little worse.`,
  };
}

function rewardRiskItem(r: () => number, i: number): ChallengeItem {
  const entry = Math.round(60 + r() * 100) * 100;
  const dist = pickOf(r, [100, 150, 200, 250]);
  const ratio = pickOf(r, [1, 1.5, 2, 2.5, 3]);
  const target = entry + Math.round(dist * ratio);
  return {
    id: `rr-${i}`,
    kind: "numeric",
    prompt: `Entry ${fmt(entry)}, stop ${fmt(entry - dist)}, target ${fmt(target)}. What is the reward-to-risk ratio? Answer with one decimal, e.g. 2.0.`,
    answer: ratio,
    tolerance: 0.05,
    unit: ": 1",
    explanation: `Reward = ${fmt(target - entry)}, risk = ${fmt(dist)}. Ratio = ${fmt(target - entry)} ÷ ${fmt(dist)} = ${ratio.toFixed(1)}.`,
  };
}

function breakEvenItem(r: () => number, i: number): ChallengeItem {
  const ratio = pickOf(r, [1, 2, 3, 4]);
  const be = 100 / (1 + ratio);
  return {
    id: `be-${i}`,
    kind: "numeric",
    prompt: `Every trade risks 1R and aims for ${ratio}R. Ignoring costs, what win rate (in %) breaks even? Round to one decimal.`,
    answer: Math.round(be * 10) / 10,
    tolerance: 0.15,
    unit: "%",
    explanation: `Break-even win rate = 1 ÷ (1 + ${ratio}) = ${be.toFixed(1)}%. Winning ${be.toFixed(1)}% of the time at +${ratio}R exactly pays for the losses at −1R.`,
  };
}

function recoveryItem(r: () => number, i: number): ChallengeItem {
  const dd = pickOf(r, [10, 20, 25, 30, 40, 50]);
  const need = (dd / (100 - dd)) * 100;
  return {
    id: `rec-${i}`,
    kind: "numeric",
    prompt: `An account falls ${dd}%. What gain (in %) does it need to get back to where it started? Round to one decimal.`,
    answer: Math.round(need * 10) / 10,
    tolerance: 0.15,
    unit: "%",
    explanation: `After −${dd}%, ${100 - dd}% is left. Getting back to 100% needs ${dd} ÷ ${100 - dd} = ${need.toFixed(1)}%. Losses need larger gains to recover, which is why risk per trade stays small.`,
  };
}

function candleItem(r: () => number, i: number): ChallengeItem {
  const o = Math.round(80 + r() * 60) * 100;
  const up = r() < 0.5;
  const body = pickOf(r, [40, 60, 90, 120]);
  const c = up ? o + body : o - body;
  const h = Math.max(o, c) + pickOf(r, [10, 30, 80, 150]);
  const l = Math.min(o, c) - pickOf(r, [10, 30, 80, 150]);
  const ask = pickOf(r, ["direction", "upper", "range"] as const);
  if (ask === "direction") {
    return {
      id: `candle-${i}`,
      kind: "choice",
      prompt: `A candle opened at ${fmt(o)}, reached ${fmt(h)} and ${fmt(l)}, and closed at ${fmt(c)}. What kind of candle is it?`,
      options: [
        { id: "bull", label: "Bullish: closed above its open" },
        { id: "bear", label: "Bearish: closed below its open" },
      ],
      correct: up ? "bull" : "bear",
      explanation: `It closed ${up ? "above" : "below"} its open (${fmt(c)} vs ${fmt(o)}), so the body is ${up ? "bullish" : "bearish"}. The high and low only show the extremes reached.`,
    };
  }
  if (ask === "upper") {
    const wick = h - Math.max(o, c);
    return {
      id: `candle-${i}`,
      kind: "numeric",
      prompt: `Open ${fmt(o)}, high ${fmt(h)}, low ${fmt(l)}, close ${fmt(c)}. How long is the upper wick, in vUSD?`,
      answer: wick / 100,
      tolerance: 0.005,
      unit: "vUSD",
      explanation: `The upper wick runs from the top of the body (${fmt(Math.max(o, c))}) to the high (${fmt(h)}): ${fmt(wick)}.`,
    };
  }
  return {
    id: `candle-${i}`,
    kind: "numeric",
    prompt: `Open ${fmt(o)}, high ${fmt(h)}, low ${fmt(l)}, close ${fmt(c)}. What is the candle's full range (high minus low), in vUSD?`,
    answer: (h - l) / 100,
    tolerance: 0.005,
    unit: "vUSD",
    explanation: `Range = high − low = ${fmt(h)} − ${fmt(l)} = ${fmt(h - l)}.`,
  };
}

function quizItem(q: Question): ChallengeItem {
  return q.kind === "numeric" && q.numeric
    ? { id: q.id, kind: "numeric", prompt: q.scenario ? `${q.scenario} ${q.prompt}` : q.prompt, answer: q.numeric.answer, tolerance: q.numeric.tolerance, unit: q.numeric.unit, explanation: q.explanation }
    : { id: q.id, kind: "choice", prompt: q.scenario ? `${q.scenario} ${q.prompt}` : q.prompt, options: q.options, correct: q.correct, explanation: q.explanation };
}

const THEMES = [
  { theme: "sizing", title: "Size it right", objective: "Turn a risk budget and a stop into a number of units.", lesson: "L09", make: [sizingItem, sizingItem, sizingItem] },
  { theme: "reward", title: "Reward and risk", objective: "Measure what a trade risks against what it aims for.", lesson: "L11", make: [riskAmountItem, rewardRiskItem, breakEvenItem] },
  { theme: "quiz", title: "Quick quiz", objective: "Check your understanding of one topic.", lesson: "", make: [] },
  { theme: "candle", title: "Read the candle", objective: "Read open, high, low and close without guessing.", lesson: "L01", make: [candleItem, candleItem, candleItem] },
  { theme: "recovery", title: "The maths of losing", objective: "See why losses need bigger gains to recover.", lesson: "L08", make: [recoveryItem, riskAmountItem, recoveryItem] },
] as const;

const QUIZ_TOPICS: TopicId[] = ["order_types", "risk_management", "stop_loss", "psychology", "technical_analysis", "decision_making", "position_sizing", "market_fundamentals", "portfolio_exposure", "scenario_analysis"];

/** Today's challenge: three short items on one objective. The same day always gives the same challenge. */
export function dailyChallenge(day: string, questions: readonly Question[]): DailyChallenge {
  const idx = dayIndex(day);
  const r = rngFrom(seedOf(day));
  const t = THEMES[((idx % THEMES.length) + THEMES.length) % THEMES.length];
  if (t.theme === "quiz") {
    const topic = QUIZ_TOPICS[Math.floor(idx / THEMES.length) % QUIZ_TOPICS.length];
    const pool = questions.filter((q) => q.topic === topic);
    const items: ChallengeItem[] = [];
    const used = new Set<number>();
    while (items.length < Math.min(3, pool.length)) {
      const k = Math.floor(r() * pool.length);
      if (used.has(k)) continue;
      used.add(k);
      items.push(quizItem(pool[k]));
    }
    return { day, theme: t.theme, title: t.title, objective: t.objective, items, lesson: pool[0]?.lesson ?? "L01" };
  }
  return { day, theme: t.theme, title: t.title, objective: t.objective, items: t.make.map((m, i) => m(r, i)), lesson: t.lesson };
}

export function gradeChallengeItem(item: ChallengeItem, response: string | undefined): boolean {
  if (response === undefined || response.trim() === "") return false;
  if (item.kind === "choice") return response === item.correct;
  const n = Number(response.replace(/,/g, "").trim());
  return Number.isFinite(n) && Math.abs(n - (item.answer ?? NaN)) <= (item.tolerance ?? 0) + 1e-9;
}

// ─── Weekly challenges ──────────────────────────────────────────────────────

export interface WeeklyObjective {
  id: string;
  label: string;
  target: number;
  measure: (s: ProgressSnapshot, days: Set<string>) => number;
}

/** Multi-step mission of the week: one of the harder decision scenarios, rotating. */
const FEATURED = ["M06", "M07", "M10"];

const POOL: WeeklyObjective[] = [
  { id: "missions-3", label: "Complete 3 missions", target: 3, measure: (s, d) => s.missions.filter((m) => d.has(dayKey(m.at, s.tz))).length },
  { id: "solid", label: "Score 75+ decision quality in a mission", target: 1, measure: (s, d) => s.missions.filter((m) => d.has(dayKey(m.at, s.tz)) && (m.dqs ?? 0) >= 75).length },
  { id: "arena-clear", label: "Clear an Arena scenario", target: 1, measure: (s, d) => s.arena.filter((a) => d.has(dayKey(a.at, s.tz)) && a.completed).length },
  { id: "check", label: "Pass a knowledge check", target: 1, measure: (s, d) => s.checks.filter((c) => d.has(dayKey(c.at, s.tz)) && c.passed).length },
  { id: "lessons-2", label: "Complete 2 lessons", target: 2, measure: (s, d) => s.lessons.filter((l) => d.has(dayKey(l.at, s.tz))).length },
  { id: "dailies-3", label: "Complete 3 daily challenges", target: 3, measure: (s, d) => s.dailies.filter((x) => d.has(x.day)).length },
  { id: "discipline", label: "Finish an Arena session with Risk Discipline 90+", target: 1, measure: (s, d) => s.arena.filter((a) => d.has(dayKey(a.at, s.tz)) && a.trades > 0 && (a.rds ?? 0) >= 90).length },
  { id: "reflect-2", label: "Write 2 reflections", target: 2, measure: (s, d) => s.reflections.filter((r) => d.has(dayKey(r.at, s.tz))).length },
];

export const WEEKLY_XP = 150;

export interface WeeklyChallenge {
  week: string;
  days: string[];
  featuredMission: string;
  objectives: WeeklyObjective[];
}

export function weeklyChallenge(day: string, week: string): WeeklyChallenge {
  const r = rngFrom(seedOf(week));
  const pool = [...POOL];
  const objectives: WeeklyObjective[] = [];
  while (objectives.length < 3) objectives.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  const featuredMission = FEATURED[seedOf(`${week}:featured`) % FEATURED.length];
  return {
    week,
    days: weekDays(day),
    featuredMission,
    objectives: [
      {
        id: "featured",
        label: `Complete the scenario of the week with decision quality 75+`,
        target: 1,
        measure: (s, d) => s.missions.filter((m) => m.missionId === featuredMission && d.has(dayKey(m.at, s.tz)) && (m.dqs ?? 0) >= 75).length,
      },
      ...objectives,
    ],
  };
}

export function weeklyProgress(w: WeeklyChallenge, s: ProgressSnapshot): { objective: WeeklyObjective; current: number; done: boolean }[] {
  const days = new Set(w.days);
  return w.objectives.map((o) => {
    const current = Math.min(o.target, o.measure(s, days));
    return { objective: o, current, done: current >= o.target };
  });
}
