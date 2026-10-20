import { describe, expect, it } from "vitest";
import type { LogEntry } from "@market-lab/engine";
import { riskDisciplineScore } from "@market-lab/evaluation";
import { ARENA_SCENARIOS, ARENA_START, arenaContext, arenaEquityCurve, arenaWhatIfs, evaluateArena, getArenaScenario } from "../src";

function buyLog(stop: number | null, qty: number, target: number | null = null): LogEntry[] {
  return [
    { kind: "action", step: ARENA_START, action: { type: "submit_order", side: "buy", orderType: "market", qty, stopLoss: stop, takeProfit: target } },
    { kind: "advance", to: ARENA_START + 80 },
    { kind: "finish" },
  ];
}

describe("Arena scenarios", () => {
  it("builds every scenario as a valid, deterministic market", () => {
    for (const s of ARENA_SCENARIOS) {
      const a = arenaContext(s.id, 11);
      const b = arenaContext(s.id, 11);
      expect(a.hash).toBe(b.hash);
      expect(a.ctx.candles.length).toBeGreaterThanOrEqual(420);
      expect(a.ctx.candles.every((c) => c.l > 0 && c.h >= Math.max(c.o, c.c) && c.l <= Math.min(c.o, c.c))).toBe(true);
      expect(a.ctx.cfg.rules.maxRiskPct).toBe(s.maxRiskPct);
    }
  });

  it("keeps the original regimes available for saved sessions", () => {
    for (const id of ["trending", "ranging", "volatile", "mixed"]) {
      expect(getArenaScenario(id).maxRiskPct).toBe(2);
      expect(arenaContext(id as never, 3).ctx.candles.length).toBeGreaterThanOrEqual(420);
    }
  });

  it("enforces a required stop in the unexpected-event scenario", () => {
    const { ctx, scenario } = arenaContext("event_shock", 5);
    const r = evaluateArena(ctx, buyLog(null, 10), scenario);
    expect(r.trades).toBe(0);
  });
});

describe("Risk discipline", () => {
  it("is 100 with a stop inside the limit, lower without a stop, null without trades", () => {
    const { ctx, scenario } = arenaContext("bullish", 9);
    const close = ctx.candles[ARENA_START].c;
    const good = evaluateArena(ctx, buyLog(close - 200, 30, close + 600), scenario);
    expect(good.rds).toBe(100);
    expect(good.completion.items.find((i) => i.label.startsWith("A stop-loss"))?.met).toBe(true);

    const noStop = evaluateArena(ctx, buyLog(null, 30), scenario);
    expect(noStop.rds).not.toBeNull();
    expect(noStop.rds!).toBeLessThan(50);
    expect(noStop.dqs.errorTags).toContain("no_stop");

    const flat = evaluateArena(ctx, [{ kind: "advance", to: ARENA_START + 70 }, { kind: "finish" }], scenario);
    expect(flat.rds).toBeNull();
    expect(riskDisciplineScore(flat.dqs.criteria)).toBeNull();
  });

  it("is independent of the simulated outcome", () => {
    const { ctx, scenario } = arenaContext("bearish", 4);
    const close = ctx.candles[ARENA_START].c;
    const r = evaluateArena(ctx, buyLog(close - 150, 40), scenario);
    // Whatever the market did, the same disciplined order scores the same discipline.
    expect(r.rds).toBe(100);
  });
});

describe("What-if alternatives", () => {
  it("are deterministic, and staying flat changes nothing", () => {
    const { ctx, scenario } = arenaContext("sideways", 21);
    const close = ctx.candles[ARENA_START].c;
    const log = buyLog(close - 150, 40, close + 300);
    const a = arenaWhatIfs(ctx, log, scenario);
    expect(arenaWhatIfs(ctx, log, scenario)).toEqual(a);
    const flat = a.find((w) => w.id === "flat")!;
    expect(flat.trades).toBe(0);
    expect(flat.net).toBe(0);
    const half = a.find((w) => w.id === "half")!;
    expect(half.trades).toBe(1);
  });

  it("builds an equity curve that starts at the starting capital", () => {
    const { ctx } = arenaContext("bullish", 2);
    const close = ctx.candles[ARENA_START].c;
    const curve = arenaEquityCurve(ctx, buyLog(close - 200, 30), ARENA_START + 40);
    expect(curve[0]).toBe(1_000_000);
    expect(curve).toHaveLength(41);
  });
});
