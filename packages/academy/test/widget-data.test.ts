import { describe, expect, it } from "vitest";
import { computeWidget } from "../src";
import { L06_LEVEL_DRAWER, L07_SERIES } from "../src/content/scripts/u2";

describe("widget data from the lessons", () => {
  it("L07: the moving-average tables match the lesson", () => {
    const data = { series: { trend: L07_SERIES.trend, range: L07_SERIES.range }, warmup: L07_SERIES.warmup };
    for (const [p, [c, f, lag]] of Object.entries(L07_SERIES.expected.trend)) {
      expect(computeWidget("ma-period", { period: Number(p), market: "trend" }, data), `trend ${p}`).toMatchObject({ crossings: c, falseSignals: f, lag });
    }
    for (const [p, [c, f]] of Object.entries(L07_SERIES.expected.range)) {
      expect(computeWidget("ma-period", { period: Number(p), market: "range" }, data), `range ${p}`).toMatchObject({ crossings: c, falseSignals: f });
    }
  });

  it("L06: the band in Show me covers four touches", () => {
    const data = { chart: { candles: L06_LEVEL_DRAWER.base, visible: L06_LEVEL_DRAWER.visibleTo } };
    expect(computeWidget("level-drawer", { role: "resistance", bandLow: 104.19, bandHigh: 104.41, stop: 104 }, data)).toMatchObject({ touches: 4, height: 0.22 });
  });
});
