import { describe, expect, it } from "vitest";
import { hashValue, type LogEntry } from "@market-lab/engine";
import {
  M04,
  M06,
  M07,
  M10,
  MISSIONS,
  PLACEMENT,
  arenaContext,
  evaluateArena,
  evaluateRun,
  getScenario,
  runMission,
  runScript,
  scoreRun,
  validateAnswer,
} from "../src";

describe("content validation", () => {
  for (const m of MISSIONS) {
    describe(m.id, () => {
      it("has data for every variant and a start step inside it", () => {
        for (const v of m.variants) {
          const { candles } = getScenario(`${m.id}-${v.key}`);
          expect(m.startStep).toBeLessThan(candles.length - 1);
        }
      });

      it("has rubric weights that sum to 100 and evaluators that exist", () => {
        const run = runMission(m, 0, []);
        const rubric = m.rubric(run.facts);
        expect(rubric.reduce((s, c) => s + c.weight, 0)).toBe(100);
      });

      it("only links to checkpoints that exist", () => {
        const ids = new Set(m.checkpoints.map((c) => c.id));
        for (const c of m.checkpoints) for (const o of c.options ?? []) if (o.next) expect(ids.has(o.next)).toBe(true);
      });

      it("plays every alternative to the end on every variant", () => {
        m.variants.forEach((_, vi) => {
          for (const alt of m.alternatives) {
            const run = runScript(m, vi, alt.answers);
            expect(run.error, `${alt.id} on variant ${vi}`).toBeNull();
            expect(run.phase).toBe("concluded");
            expect(scoreRun(run).dqs).not.toBeNull();
          }
        });
      });

      it("is deterministic", () => {
        const a = runScript(m, 0, m.alternatives[0]?.answers ?? {});
        const b = runScript(m, 0, m.alternatives[0]?.answers ?? {});
        expect(hashValue(a.state)).toBe(hashValue(b.state));
      });
    });
  }
});

describe("golden scores", () => {
  it("M04: a textbook stop scores 100; no stop scores low and is tagged", () => {
    M04.variants.forEach((_, vi) => {
      const alts = Object.fromEntries(M04.alternatives.map((a) => [a.id, scoreRun(runScript(M04, vi, a.answers))]));
      expect(alts.textbook.dqs).toBe(100);
      expect(alts.tight.errorTags).toContain("stop_inside_noise");
      expect(alts.nostop.dqs).toBeLessThan(20);
      expect(alts.nostop.errorTags).toContain("no_stop");
    });
  });

  it("M06: the same decision scores the same on every variant, whatever the outcome", () => {
    const alt = M06.alternatives.find((a) => a.id === "enter_with_stop")!;
    const results = M06.variants.map((_, vi) => evaluateRun(runScript(M06, vi, alt.answers)));
    expect(new Set(results.map((r) => r.dqs.dqs)).size).toBe(1);
    expect(new Set(results.map((r) => Math.sign(r.outcome.net))).size).toBeGreaterThan(1);
  });

  it("M06: the confirmation prints only in the pullback variant", () => {
    const wait = M06.alternatives.find((a) => a.id === "wait")!;
    const visitedConfirm = M06.variants.map((_, vi) => runScript(M06, vi, wait.answers).visited.some((v) => v.def.id === "confirm"));
    expect(visitedConfirm).toEqual([false, true, false]);
  });

  it("M06: fear of missing out as the only evidence is tagged", () => {
    const run = runScript(M06, 0, {
      entry: () => ({
        optionId: "enter_now",
        reasons: [],
        hypothesis: { direction: "up", reasons: ["fomo"], confidence: "high" },
        order: { side: "buy", orderType: "market", qty: 50, stopLoss: null, takeProfit: null },
      }),
    });
    const r = scoreRun(run);
    expect(r.errorTags).toEqual(expect.arrayContaining(["chased_entry", "no_stop"]));
    expect(r.dqs!).toBeLessThan(30);
  });

  it("M07: the position is still open at the decision, and widening the stop is flagged", () => {
    M07.variants.forEach((_, vi) => {
      const run = runMission(M07, vi, []);
      expect(run.current?.def.id).toBe("manage");
      expect(run.state.position).not.toBeNull();
      const widen = scoreRun(runScript(M07, vi, M07.alternatives.find((a) => a.id === "widen")!.answers));
      expect(widen.errorTags).toEqual(expect.arrayContaining(["moved_stop_away", "loss_aversion"]));
      expect(widen.dqs!).toBeLessThanOrEqual(20);
    });
  });

  it("records at most one skill evidence per skill per mission", () => {
    const r = evaluateRun(runScript(M06, 0, M06.alternatives[1].answers));
    const skills = r.evidence.map((e) => e.skill);
    expect(new Set(skills).size).toBe(skills.length);
  });

  it("M10: each variant has the intended truth table", () => {
    const facts = M10.variants.map((_, vi) => runMission(M10, vi, []).current!.facts);
    expect(facts.map((f) => [f.cond1, f.cond2, f.allMet])).toEqual([
      [false, true, false],
      [true, true, true],
      [true, false, false],
    ]);
  });
});

describe("runtime safety", () => {
  it("rejects an order with a stop on the wrong side without corrupting the run", () => {
    const run = runMission(M04, 0, []);
    const problem = validateAnswer(run, {
      optionId: "enter",
      reasons: [],
      hypothesis: { direction: "up", reasons: ["trend_intact"], confidence: "medium" },
      order: { side: "buy", orderType: "market", qty: 10, stopLoss: 999_999, takeProfit: null },
    });
    expect(problem).toMatch(/stop-loss must be below/);
    const bad = runMission(M04, 0, [{ checkpointId: "entry", answer: { optionId: "enter", reasons: [] } }]);
    expect(bad.error).toBeTruthy();
  });

  it("never shows a checkpoint before its candle", () => {
    for (const m of MISSIONS) {
      const run = runMission(m, 0, []);
      expect(run.current!.step).toBeGreaterThanOrEqual(m.startStep);
      expect(run.state.step).toBe(run.current!.step);
    }
  });
});

describe("placement", () => {
  it("has one correct option per item", () => {
    for (const p of PLACEMENT) expect(p.options.some((o) => o.id === p.correct)).toBe(true);
  });
});

describe("arena", () => {
  it("is reproducible from regime and seed, and scores discipline without P&L", () => {
    const { ctx, hash } = arenaContext("trending", 123);
    expect(arenaContext("trending", 123).hash).toBe(hash);
    const step = 70;
    const price = ctx.candles[step].c;
    const log: LogEntry[] = [
      { kind: "action", step, action: { type: "submit_order", side: "buy", orderType: "market", qty: 10, stopLoss: price - 300, takeProfit: null } },
      { kind: "advance", to: 90 },
      { kind: "action", step: 90, action: { type: "close_position" } },
      { kind: "action", step: 95, action: { type: "submit_order", side: "buy", orderType: "market", qty: 10, stopLoss: null, takeProfit: null } },
      { kind: "advance", to: 120 },
      { kind: "finish" },
    ];
    const r = evaluateArena(ctx, log);
    expect(r.trades).toBe(2);
    expect(r.stopsUsedPct).toBe(50);
    expect(r.dqs.errorTags).toContain("no_stop");
    expect(r.barsPlayed).toBe(61);
  });
});
