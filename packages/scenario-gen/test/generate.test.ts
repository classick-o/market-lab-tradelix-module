import { describe, expect, it } from "vitest";
import { ARENA_REGIMES, arenaSpec, generateCandles, totalBars, type ScenarioSpec } from "../src";

const spec: ScenarioSpec = {
  seed: 42,
  start: 100,
  segments: [
    { kind: "range", bars: 40, halfWidth: 0.02, vol: 0.006 },
    { kind: "move", bars: 12, move: 0.12, vol: 0.005 },
    { kind: "candle", body: -0.03, upper: 0.01, lower: 0.005 },
    { kind: "walk", bars: 20, vol: 0.01, gap: -0.05 },
  ],
};

describe("generateCandles", () => {
  it("is deterministic for a given seed", () => {
    expect(generateCandles(spec)).toEqual(generateCandles(spec));
    expect(generateCandles({ ...spec, seed: 43 })).not.toEqual(generateCandles(spec));
  });

  it("produces valid integer OHLC candles with an intrabar path", () => {
    const candles = generateCandles(spec);
    expect(candles).toHaveLength(totalBars(spec));
    for (const cd of candles) {
      for (const v of [cd.o, cd.h, cd.l, cd.c, cd.v]) expect(Number.isInteger(v) && v > 0).toBe(true);
      expect(cd.h).toBeGreaterThanOrEqual(Math.max(cd.o, cd.c));
      expect(cd.l).toBeLessThanOrEqual(Math.min(cd.o, cd.c));
      expect(["OHLC", "OLHC"]).toContain(cd.path);
    }
  });

  it("lands anchored moves on their target", () => {
    const candles = generateCandles(spec);
    const before = candles[39].c;
    const after = candles[51].c;
    expect(after / before - 1).toBeCloseTo(0.12, 2);
  });

  it("honours explicit candles and gaps", () => {
    const candles = generateCandles(spec);
    const shaped = candles[52];
    expect(shaped.c / shaped.o - 1).toBeCloseTo(-0.03, 3);
    expect(candles[53].o / shaped.c - 1).toBeCloseTo(-0.05, 3);
  });

  it("builds Arena scenarios for every regime", () => {
    for (const r of ARENA_REGIMES) {
      const s = arenaSpec(r.id, 7);
      expect(totalBars(s)).toBeGreaterThanOrEqual(420);
      expect(generateCandles(s).every((cd) => cd.l > 0)).toBe(true);
    }
  });
});
