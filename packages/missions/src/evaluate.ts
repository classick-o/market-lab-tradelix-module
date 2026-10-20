import { bidAsk, equityOf, type Trade } from "@market-lab/engine";
import { riskDisciplineScore, scoreRubric, type AnswerView, type DqsResult, type ProcessView } from "@market-lab/evaluation";
import type { Evidence, MissionMeta } from "@market-lab/learning";
import { describeDecisions, runMission, type LoggedAnswer, type MissionRun } from "./runtime";
import type { AlternativeDef, CheckpointAnswer, CheckpointDef, MissionDef } from "./schema";

export interface TradeSummary {
  id: string;
  side: "long" | "short";
  entryStep: number;
  exitStep: number | null;
  qty: number;
  avgEntry: number;
  avgExit: number | null;
  net: number;
  rMultiple: number | null;
  exitReason: Trade["exitReason"];
}

export interface MissionOutcome {
  hasTrades: boolean;
  net: number;
  returnPct: number;
  fees: number;
  finalEquity: number;
  maxDrawdown: number;
  maxDrawdownPct: number;
  trades: TradeSummary[];
}

export interface AlternativeResult {
  id: string;
  label: string;
  description: string;
  dqs: number | null;
  /** Risk Discipline Score of the alternative path. */
  rds: number | null;
  net: number;
  returnPct: number;
  maxDrawdownPct: number;
  decisions: string[];
}

export interface MissionResult {
  missionId: string;
  missionVersion: number;
  variantIdx: number;
  variantLabel: string;
  datasetHash: string;
  engineVersion: string;
  dqs: DqsResult;
  outcome: MissionOutcome;
  decisions: string[];
  feedback: { worked: string[]; improve: string[] };
  alternatives: AlternativeResult[];
  evidence: Evidence[];
}

export function buildProcessView(run: MissionRun): ProcessView {
  const answers: AnswerView[] = run.visited.map((v) => ({
    checkpointId: v.def.id,
    step: v.step,
    optionId: v.answer!.optionId,
    reasons: v.answer!.reasons,
    pickPrice: v.answer!.pickPrice,
    numeric: v.answer!.numeric,
    checklist: v.answer!.checklist,
    hypothesis: v.answer!.hypothesis,
  }));
  return {
    missionId: run.mission.id,
    initialEquity: run.mission.equity,
    commissionBps: run.ctx.cfg.costs.commissionBps,
    rules: run.mission.rules,
    answers,
    entries: run.entries,
    stopChanges: run.stopChanges,
    facts: run.facts,
  };
}

export function outcomeOf(run: MissionRun): MissionOutcome {
  const s = run.state;
  const finalEquity = equityOf(run.ctx, s);
  const trades = s.trades.map((t) => ({
    id: t.id,
    side: t.side,
    entryStep: t.entryStep,
    exitStep: t.exitStep,
    qty: t.maxQty,
    avgEntry: Math.round(t.entryNotional / t.entryQty),
    avgExit: t.exitQty ? Math.round(t.exitNotional / t.exitQty) : null,
    net: t.realized - t.fees,
    rMultiple: t.initialRisk ? (t.realized - t.fees) / t.initialRisk : null,
    exitReason: t.exitReason,
  }));
  return {
    hasTrades: trades.length > 0,
    net: finalEquity - run.mission.equity,
    returnPct: ((finalEquity - run.mission.equity) / run.mission.equity) * 100,
    fees: s.fees,
    finalEquity,
    maxDrawdown: s.maxDrawdown,
    maxDrawdownPct: s.maxDrawdownBps / 100,
    trades,
  };
}

export function scoreRun(run: MissionRun): DqsResult {
  return scoreRubric(run.mission.rubric(run.facts), buildProcessView(run));
}

function defaultAnswer(cp: CheckpointDef): CheckpointAnswer {
  const passive = cp.options?.find((o) => o.action === "skip" || o.action === "hold") ?? cp.options?.[0];
  return { optionId: passive?.id, reasons: [] };
}

/** Plays a mission with scripted answers (used for alternatives and golden tests). */
export function runScript(m: MissionDef, variantIdx: number, answers: AlternativeDef["answers"]): MissionRun {
  let log: LoggedAnswer[] = [];
  let run = runMission(m, variantIdx, log);
  for (let i = 0; i < 12 && run.phase === "checkpoint" && run.current && !run.error; i++) {
    const cp = run.current;
    const { bid, ask } = bidAsk(run.ctx, run.state);
    const fn = answers[cp.def.id];
    const answer = fn
      ? fn(cp.facts, { equity: equityOf(run.ctx, run.state), bid, ask, commissionBps: run.ctx.cfg.costs.commissionBps })
      : defaultAnswer(cp.def);
    log = [...log, { checkpointId: cp.def.id, answer }];
    run = runMission(m, variantIdx, log);
  }
  return run;
}

export function evaluateRun(run: MissionRun): MissionResult {
  if (run.phase !== "concluded") throw new Error("A mission can only be evaluated once it has concluded.");
  const m = run.mission;
  const dqs = scoreRun(run);
  const applicable = dqs.criteria.filter((c) => c.applicable);
  const alternatives = m.alternatives.map((alt) => {
    const altRun = runScript(m, run.variantIdx, alt.answers);
    const o = outcomeOf(altRun);
    const altScore = altRun.phase === "concluded" ? scoreRun(altRun) : null;
    return {
      id: alt.id,
      label: alt.label,
      description: alt.description,
      dqs: altScore?.dqs ?? null,
      rds: altScore ? riskDisciplineScore(altScore.criteria) : null,
      net: o.net,
      returnPct: o.returnPct,
      maxDrawdownPct: o.maxDrawdownPct,
      decisions: describeDecisions(altRun),
    };
  });
  return {
    missionId: m.id,
    missionVersion: m.version,
    variantIdx: run.variantIdx,
    variantLabel: run.variant.label,
    datasetHash: run.datasetHash,
    engineVersion: run.engineVersion,
    dqs,
    outcome: outcomeOf(run),
    decisions: describeDecisions(run),
    feedback: {
      worked: applicable.filter((c) => c.score >= 0.8).sort((a, b) => b.weight - a.weight).map((c) => c.detail),
      improve: applicable.filter((c) => c.score < 0.5).sort((a, b) => b.weight - a.weight).map((c) => c.detail),
    },
    alternatives,
    evidence: evidenceFrom(dqs, m.difficulty, m.skillPrimary),
  };
}

/**
 * One evidence record per skill per session: the weight-averaged score of that skill's criteria.
 * Several criteria for the same skill therefore never stack into one big jump.
 */
export function evidenceFrom(dqs: DqsResult, difficulty: number, primary: string | null, weightOverride?: number): Evidence[] {
  const bySkill = new Map<Evidence["skill"], { w: number; ws: number }>();
  for (const c of dqs.criteria) {
    if (!c.applicable) continue;
    const cur = bySkill.get(c.skill) ?? { w: 0, ws: 0 };
    bySkill.set(c.skill, { w: cur.w + c.weight, ws: cur.ws + c.weight * c.score });
  }
  return [...bySkill.entries()].map(([skill, { w, ws }]) => ({
    skill,
    performance: w > 0 ? ws / w : 0,
    difficulty,
    weight: weightOverride ?? (skill === primary ? 1 : 0.5),
  }));
}

export function evaluateMission(m: MissionDef, variantIdx: number, log: readonly LoggedAnswer[]): MissionResult {
  return evaluateRun(runMission(m, variantIdx, log));
}

export function missionMeta(m: MissionDef): MissionMeta {
  return {
    id: m.id,
    title: m.title,
    skillPrimary: m.skillPrimary,
    skillsSecondary: m.skillsSecondary,
    difficulty: m.difficulty,
    targets: m.targets,
    prerequisites: m.prerequisites,
  };
}
