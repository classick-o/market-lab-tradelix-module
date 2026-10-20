import { formatPrice, maxQtyForRisk } from "@market-lab/engine";
import type { AnswerView, EntryView, EvalResult, ProcessView } from "./types";

// Each evaluator declares its own params shape; the rubric supplies them untyped.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Evaluator = (view: ProcessView, params: any) => EvalResult;

const NA: EvalResult = { applicable: false, score: 0, detail: "Not applicable to the path you took." };

function answer(view: ProcessView, checkpoint: string): AnswerView | undefined {
  return view.answers.find((a) => a.checkpointId === checkpoint);
}

function mean(xs: number[]): number {
  return xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;
}

const pct = (x: number) => `${x.toFixed(2)}%`;

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function describeRisk(e: EntryView): string {
  return e.riskPct === null ? "no stop-loss (unlimited risk)" : `${formatPrice(e.risk!)} vUSD (${pct(e.riskPct)} of equity)`;
}

// ─── Answers ───────────────────────────────────────────────────────────────

const choice: Evaluator = (view, p: { checkpoint: string; credit: Record<string, number>; explain?: Record<string, string>; tags?: Record<string, string[]> }) => {
  const a = answer(view, p.checkpoint);
  if (!a?.optionId) return NA;
  const score = p.credit[a.optionId] ?? 0;
  return {
    applicable: true,
    score,
    detail: p.explain?.[a.optionId] ?? (score >= 1 ? "Good call." : "There was a better reading of this situation."),
    errorTags: p.tags?.[a.optionId] ?? [],
  };
};

const pick: Evaluator = (view, p: { checkpoint: string; target: number; tolerance: number; targetLabel: string }) => {
  const a = answer(view, p.checkpoint);
  if (a?.pickPrice === undefined) return NA;
  const dist = Math.abs(a.pickPrice - p.target);
  const score = dist <= p.tolerance ? 1 : dist <= 2 * p.tolerance ? 0.5 : 0;
  const verdict = score === 1 ? "Spot on." : score === 0.5 ? "Close, but not quite." : "That's a different part of the candle.";
  return {
    applicable: true,
    score,
    detail: `${verdict} You marked ${formatPrice(a.pickPrice)}; the ${p.targetLabel} was ${formatPrice(p.target)}.`,
    errorTags: score === 0 ? ["misread_candle"] : [],
  };
};

const numeric: Evaluator = (view, p: { checkpoint: string; min: number; max: number; partial: number; unit: string; explain: string }) => {
  const a = answer(view, p.checkpoint);
  if (a?.numeric === undefined) return NA;
  const v = a.numeric;
  let score = 0;
  if (v >= p.min && v <= p.max) score = 1;
  else if (v >= p.min * (1 - p.partial) && v <= p.max * (1 + p.partial)) score = 0.5;
  const range = p.min === p.max ? `${p.min}` : `${p.min}–${p.max}`;
  return {
    applicable: true,
    score,
    detail: `You answered ${v} ${p.unit}; a correct answer is ${range} ${p.unit}. ${p.explain}`,
    errorTags: score === 0 ? ["sizing_math"] : [],
  };
};

const checklist: Evaluator = (view, p: { checkpoint: string; items: { id: string; label: string; truth: boolean }[] }) => {
  const a = answer(view, p.checkpoint);
  if (!a?.checklist) return NA;
  const wrong = p.items.filter((it) => Boolean(a.checklist![it.id]) !== it.truth);
  const score = (p.items.length - wrong.length) / p.items.length;
  const detail =
    wrong.length === 0
      ? "You assessed every condition correctly."
      : `You misjudged ${plural(wrong.length, "condition")}: ${wrong
          .map((it) => `"${it.label}" was ${it.truth ? "met" : "not met"}`)
          .join("; ")}.`;
  return { applicable: true, score, detail, errorTags: wrong.length > 0 ? ["misread_conditions"] : [] };
};

const reasonGiven: Evaluator = (view, p: { checkpoint: string; weakReasons?: Record<string, string> }) => {
  const a = answer(view, p.checkpoint);
  if (!a) return NA;
  if (a.reasons.length === 0) return { applicable: true, score: 0, detail: "You didn't record why you made this decision." };
  const weak = a.reasons.filter((r) => p.weakReasons?.[r]);
  if (weak.length === a.reasons.length) {
    return {
      applicable: true,
      score: 0.5,
      detail: "Your reason was about how you felt, not about the plan or the market.",
      errorTags: weak.map((r) => p.weakReasons![r]),
    };
  }
  return { applicable: true, score: 1, detail: "You recorded a concrete reason for your decision." };
};

// ─── Entries ───────────────────────────────────────────────────────────────

const hypothesisStated: Evaluator = (view, p: { weakReasons?: Record<string, string> }) => {
  if (view.entries.length === 0) return NA;
  const tags = new Set<string>();
  let emotional = false;
  const scores = view.entries.map((e) => {
    const h = e.hypothesis;
    if (!h) {
      tags.add("no_hypothesis");
      return 0;
    }
    const weak = h.reasons.filter((r) => p.weakReasons?.[r]);
    if (h.reasons.length > 0 && weak.length === h.reasons.length) {
      emotional = true;
      weak.forEach((r) => tags.add(p.weakReasons![r]));
      return 0.4;
    }
    return h.direction !== "unclear" && h.reasons.length > 0 ? 1 : 0.5;
  });
  const score = mean(scores);
  return {
    applicable: true,
    score,
    detail: emotional
      ? "Your only evidence was a feeling about the move, not something on the chart."
      : score === 1
        ? "You stated a direction and the evidence behind it before entering."
        : score === 0
          ? "You entered without stating what you expected and why."
          : "Your hypothesis was incomplete: give both a direction and at least one piece of evidence.",
    errorTags: [...tags],
  };
};

const invalidationBeforeEntry: Evaluator = (view) => {
  if (view.entries.length === 0) return NA;
  const withStop = view.entries.filter((e) => e.stopLoss !== null).length;
  const score = withStop / view.entries.length;
  return {
    applicable: true,
    score,
    detail:
      score === 1
        ? view.entries.length === 1
          ? `You defined where you'd be wrong (stop at ${formatPrice(view.entries[0].stopLoss!)}) before entering.`
          : `All ${view.entries.length} entries had a stop-loss defined before they were placed.`
        : view.entries.length === 1
          ? "Your entry had no stop-loss: there was no defined exit if the idea was wrong."
          : `${plural(view.entries.length - withStop, "entry")} out of ${view.entries.length} had no stop-loss.`,
    errorTags: score < 1 ? ["no_stop"] : [],
  };
};

const riskWithinLimit: Evaluator = (view, p: { maxPct: number }) => {
  if (view.entries.length === 0) return NA;
  const tags = new Set<string>();
  const scores = view.entries.map((e) => {
    if (e.riskPct === null) {
      tags.add("no_stop");
      return 0;
    }
    if (e.riskPct <= p.maxPct + 1e-9) return 1;
    tags.add("risk_over_limit");
    return e.riskPct <= p.maxPct * 1.5 ? 0.5 : 0;
  });
  const score = mean(scores);
  const detail =
    view.entries.length === 1
      ? `You risked ${describeRisk(view.entries[0])}; the limit was ${p.maxPct}%.`
      : `${view.entries.filter((e) => e.riskPct !== null && e.riskPct <= p.maxPct + 1e-9).length} of ${view.entries.length} entries stayed within the ${p.maxPct}% risk limit.`;
  return { applicable: true, score, detail, errorTags: [...tags] };
};

const stopBeyondLevel: Evaluator = (view, p: { level: number; levelLabel: string }) => {
  const e = view.entries.find((x) => x.stopLoss !== null);
  if (!e) return NA;
  const stop = e.stopLoss!;
  const long = e.side === "long";
  const beyond = long ? stop < p.level : stop > p.level;
  if (!beyond) {
    return {
      applicable: true,
      score: 0.2,
      detail: `Your stop (${formatPrice(stop)}) sits ${long ? "above" : "below"} the ${p.levelLabel} (${formatPrice(p.level)}). Normal noise could hit it before your idea is actually invalidated.`,
      errorTags: ["stop_inside_noise"],
    };
  }
  const levelDist = Math.abs(e.entryPrice - p.level);
  const stopDist = Math.abs(e.entryPrice - stop);
  if (levelDist > 0 && stopDist > 2.5 * levelDist) {
    return {
      applicable: true,
      score: 0.6,
      detail: `Your stop (${formatPrice(stop)}) is beyond the ${p.levelLabel}, but much further than needed. A wider stop means a smaller position for the same risk.`,
    };
  }
  return {
    applicable: true,
    score: 1,
    detail: `Your stop (${formatPrice(stop)}) is just beyond the ${p.levelLabel} (${formatPrice(p.level)}) — the point where the setup is actually wrong.`,
  };
};

const sizeMatchesRisk: Evaluator = (view, p: { riskPct: number }) => {
  if (view.entries.length === 0) return NA;
  const tags = new Set<string>();
  const details: string[] = [];
  const scores = view.entries.map((e) => {
    if (e.stopLoss === null) {
      tags.add("no_stop");
      details.push("Without a stop there is no way to size a position to a risk budget.");
      return 0;
    }
    const m = maxQtyForRisk({
      equity: e.equityAtEntry,
      riskPct: p.riskPct,
      side: e.side,
      entry: e.entryPrice,
      stop: e.stopLoss,
      commissionBps: view.commissionBps,
    }).qty;
    if (m <= 0) return 0;
    const ratio = e.qty / m;
    if (ratio <= 1) {
      details.push(
        ratio >= 0.6
          ? `${e.qty} units fits your ${p.riskPct}% budget (max ${m} with this stop).`
          : `${e.qty} units is well under your ${p.riskPct}% budget (max ${m}). Safe, but you used less than planned.`,
      );
      return ratio >= 0.6 ? 1 : 0.7;
    }
    tags.add("oversized");
    details.push(`${e.qty} units is more than your ${p.riskPct}% budget allows (max ${m} with this stop).`);
    return ratio <= 1.25 ? 0.4 : 0;
  });
  return { applicable: true, score: mean(scores), detail: details.join(" "), errorTags: [...tags] };
};

const uncertaintyAcknowledged: Evaluator = (view, p: { checkpoint: string; waitOption?: string; validSkipReasons: string[] }) => {
  const a = answer(view, p.checkpoint);
  if (view.entries.length > 0) {
    const e = view.entries[0];
    if (e.stopLoss === null) {
      return { applicable: true, score: 0, detail: "Entering without a stop treats the idea as certain. It never is.", errorTags: ["no_stop"] };
    }
    if (e.hypothesis?.confidence === "high") {
      return {
        applicable: true,
        score: 0.6,
        detail: "You had a stop, but rated your confidence as high right after an extended move. Extended moves are when certainty is least justified.",
      };
    }
    return { applicable: true, score: 1, detail: "You entered with a defined exit and a realistic level of confidence." };
  }
  if (!a) return NA;
  if (p.waitOption && a.optionId === p.waitOption) {
    return { applicable: true, score: 1, detail: "You chose to wait for evidence instead of acting on the move alone." };
  }
  if (a.reasons.some((r) => p.validSkipReasons.includes(r))) {
    return { applicable: true, score: 1, detail: "You passed for a concrete, risk-based reason." };
  }
  return {
    applicable: true,
    score: a.reasons.length > 0 ? 0.4 : 0.2,
    detail: "Passing can be right, but your reason wasn't tied to the setup or its risk.",
  };
};

const followedRules: Evaluator = (view, p: { maxPct: number }) => {
  if (view.entries.length === 0) return { applicable: true, score: 1, detail: "No position, so no rule was broken." };
  const e = view.entries[0];
  if (e.stopLoss === null) {
    return { applicable: true, score: 0, detail: "The scenario rules require a defined exit. Your entry had none.", errorTags: ["no_stop"] };
  }
  if (e.riskPct !== null && e.riskPct > p.maxPct + 1e-9) {
    return {
      applicable: true,
      score: 0.3,
      detail: `The rules cap risk at ${p.maxPct}% per trade; you risked ${pct(e.riskPct)}.`,
      errorTags: ["risk_over_limit"],
    };
  }
  return { applicable: true, score: 1, detail: `Your entry respected the rules: a defined exit and risk within ${p.maxPct}%.` };
};

const playbookConsistency: Evaluator = (view, p: { checkpoint: string; allMet: boolean }) => {
  const a = answer(view, p.checkpoint);
  if (!a) return NA;
  const entered = view.entries.length > 0;
  if (p.allMet) {
    if (entered) {
      return view.entries[0].stopLoss !== null
        ? { applicable: true, score: 1, detail: "Every condition was met and you took the trade with a defined exit. That's the playbook working." }
        : { applicable: true, score: 0.5, detail: "The setup was valid, but you entered without the stop your playbook needs.", errorTags: ["no_stop"] };
    }
    return {
      applicable: true,
      score: 0.4,
      detail: "All your conditions were met, but you passed. A playbook only works if you also take the valid setups.",
      errorTags: ["missed_valid_setup"],
    };
  }
  return entered
    ? { applicable: true, score: 0, detail: "Not every condition was met, but you entered anyway.", errorTags: ["broke_playbook"] }
    : { applicable: true, score: 1, detail: "Not every condition was met, so you stayed out. No trade was the right trade." };
};

// ─── Position management ───────────────────────────────────────────────────

const noStopWidening: Evaluator = (view) => {
  const hadPosition = view.entries.length > 0 || view.facts.hadPosition === true;
  if (!hadPosition) return NA;
  const widened = view.stopChanges.filter((c) =>
    c.from === null ? false : c.to === null ? true : c.side === "long" ? c.to < c.from : c.to > c.from,
  );
  return widened.length === 0
    ? { applicable: true, score: 1, detail: "You never moved a stop further away from the price." }
    : {
        applicable: true,
        score: 0,
        detail: `You moved your stop further away ${plural(widened.length, "time")}. That increases the loss you already decided was acceptable.`,
        errorTags: ["moved_stop_away"],
      };
};

const noRevengeSizing: Evaluator = (view) => {
  const afterLoss = view.entries.filter((e) => e.afterLoss && e.risk !== null && e.previousRisk !== null);
  if (afterLoss.length === 0) return NA;
  const bad = afterLoss.filter((e) => e.risk! > 1.5 * e.previousRisk!);
  return bad.length === 0
    ? { applicable: true, score: 1, detail: "After losses, you kept your risk at the same level." }
    : {
        applicable: true,
        score: 1 - bad.length / afterLoss.length,
        detail: `After a loss you increased your risk sharply ${plural(bad.length, "time")}. Trying to win it back quickly is how small losses become large ones.`,
        errorTags: ["revenge_size_up"],
      };
};

const rewardRiskPlanned: Evaluator = (view, p: { minRatio: number }) => {
  if (view.entries.length === 0) return NA;
  const scores = view.entries.map((e) => (e.takeProfit === null || e.rewardRisk === null ? 0 : e.rewardRisk >= p.minRatio ? 1 : e.rewardRisk >= 1 ? 0.5 : 0.2));
  const score = mean(scores);
  const planned = view.entries.filter((e) => e.takeProfit !== null).length;
  return {
    applicable: true,
    score,
    detail:
      planned === 0
        ? "No entry had a planned exit, so the reward you were aiming for was never defined."
        : score === 1
          ? `Every entry had a target at least ${p.minRatio}× the risk.`
          : `${planned} of ${view.entries.length} entries had a target; aim for a reward of at least ${p.minRatio}× the risk.`,
  };
};

const pacing: Evaluator = (view) => {
  const bars = Number(view.facts.barsPlayed ?? 0);
  if (view.entries.length === 0 || bars < 20) return NA;
  const per20 = view.entries.length / (bars / 20);
  if (per20 <= 1.5) return { applicable: true, score: 1, detail: `${plural(view.entries.length, "entry")} in ${bars} candles: selective.` };
  if (per20 <= 3) return { applicable: true, score: 0.6, detail: `${plural(view.entries.length, "entry")} in ${bars} candles: on the busy side.` };
  return {
    applicable: true,
    score: 0.2,
    detail: `${plural(view.entries.length, "entry")} in ${bars} candles. Frequent trading adds costs and usually lowers decision quality.`,
    errorTags: ["overtrading"],
  };
};

export const EVALUATORS: Record<string, Evaluator> = {
  choice,
  pick,
  numeric,
  checklist,
  reason_given: reasonGiven,
  hypothesis_stated: hypothesisStated,
  invalidation_before_entry: invalidationBeforeEntry,
  risk_within_limit: riskWithinLimit,
  stop_beyond_level: stopBeyondLevel,
  size_matches_risk: sizeMatchesRisk,
  uncertainty_acknowledged: uncertaintyAcknowledged,
  followed_rules: followedRules,
  playbook_consistency: playbookConsistency,
  no_stop_widening: noStopWidening,
  no_revenge_sizing: noRevengeSizing,
  reward_risk_planned: rewardRiskPlanned,
  pacing,
};
