import { describe, expect, it } from "vitest";
import { computeWidget, raceCurves, raceResult, raceSeries } from "../src";

const YEAR = raceSeries(130);
const race = (log: string) => computeWidget("benchmark-ghost", { log, done: true }, { ghost: { mode: "race", cost: 0.2, seed: 130, days: 252, end: 9.2 } });

describe("the benchmark ghost", () => {
  it("plays the same year for everyone, ending where the lesson says", () => {
    expect(raceSeries(130)).toEqual(YEAR);
    expect(YEAR).toHaveLength(252);
    expect(YEAR[0]).toBe(100);
    expect(YEAR[251]).toBe(109.2);
  });

  it("makes you the ghost when you buy on day one and hold", () => {
    const v = race("0");
    expect(v.net).toBe(9);
    expect(v.ghost).toBe(9);
    expect(v.versus).toBe("level with it");
    expect(v.tripsText).toBe("1 round trip");
  });

  it("charges every round trip, even one that goes nowhere", () => {
    // Out and straight back in on the same day: same exposure, one more round trip.
    const v = race("0,100,100");
    expect(v.trips).toBe(2);
    expect(v.costs).toBe(0.4);
    expect(v.net).toBe(8.8);
    expect(v.versus).toBe("0.2 points behind it");
  });

  it("stays flat in cash and pays half a round trip on each side", () => {
    const { you } = raceCurves(YEAR, [10, 20], 0.2);
    expect(you.slice(0, 10).every((x) => x === 0)).toBe(true);
    expect(you[10]).toBe(-0.1);
    expect(you[251]).toBe(you[21]);
    expect(raceResult(YEAR, [10, 20], 0.2).inDays).toBe(10);
  });

  it("finds the round trips that bring a result level with the ghost", () => {
    const data = { ghost: { mode: "trips" as const, cost: 0.2, gross: [0, 14], ghost: [0, 9], max: 60 } };
    expect(computeWidget("benchmark-ghost", { trips: 25 }, data)).toMatchObject({ costs: 5, net: 9, level: true, side: "level" });
    expect(computeWidget("benchmark-ghost", { trips: 40 }, data)).toMatchObject({ net: 6, gap: -3, side: "below" });
    expect(computeWidget("benchmark-ghost", { trips: 10 }, data)).toMatchObject({ side: "above" });
  });
});
