/**
 * The benchmark ghost (lesson 0.1.4 and the benchmark-ghost widget): buy-and-hold on the same
 * market against active trading, both after costs. Results are in percent of the account; a round
 * trip (a buy and its sell) costs `cost` percent, half on the way in and half on the way out.
 */

const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

/** Seeded numbers in [0, 1) (mulberry32), so a "random" year is the same for everyone. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A year of daily closes from 100.00: a seeded random walk, bent to finish `endPct` percent higher. */
export function raceSeries(seed: number, days = 252, endPct = 9.2, vol = 0.011): number[] {
  const r = rng(seed);
  const walk = [0];
  for (let i = 1; i < days; i++) {
    const z = Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
    walk.push(walk[i - 1] + vol * z);
  }
  const bend = Math.log(1 + endPct / 100) - walk[days - 1];
  return walk.map((w, i) => round(100 * Math.exp(w + (bend * i) / (days - 1))));
}

/** The days the learner switched (in, out, in, …), from the widget's log ("12,40,55"). */
export function parseSwitches(log: unknown, days: number): number[] {
  if (typeof log !== "string" || !log.trim()) return [];
  return log
    .split(",")
    .map(Number)
    .filter((d) => Number.isInteger(d) && d >= 0 && d < days);
}

/**
 * Day by day, in percent after costs: the ghost (in from day one to the last day) and the learner
 * (in cash until the first switch). An open position is closed on the last day, like the ghost's.
 */
export function raceCurves(prices: number[], switches: number[], cost: number): { you: number[]; ghost: number[] } {
  const n = prices.length;
  const half = cost / 2;
  const ghost = prices.map((p, i) => round((p / prices[0] - 1) * 100 - half - (i === n - 1 ? half : 0)));
  const you: number[] = [];
  let wealth = 1;
  let entry = -1;
  let paid = 0;
  let k = 0;
  for (let i = 0; i < n; i++) {
    for (; k < switches.length && switches[k] === i; k++) {
      if (entry < 0) entry = i;
      else {
        wealth *= prices[i] / prices[entry];
        entry = -1;
      }
      paid += half;
    }
    const w = entry >= 0 ? (wealth * prices[i]) / prices[entry] : wealth;
    you.push(round((w - 1) * 100 - paid - (i === n - 1 && entry >= 0 ? half : 0)));
  }
  return { you, ghost };
}

/** The year's result: round trips, costs, the learner's result before and after costs, and the ghost's. */
export function raceResult(prices: number[], switches: number[], cost: number) {
  const { you, ghost } = raceCurves(prices, switches, cost);
  const trips = Math.ceil(switches.length / 2);
  const net = you[you.length - 1];
  const costs = round(trips * cost);
  // Days in the market: from each buy to its sell, or to the end.
  let inDays = 0;
  for (let i = 0; i < switches.length; i += 2) inDays += (switches[i + 1] ?? prices.length - 1) - switches[i];
  return { trips, costs, net, gross: round(net + costs), ghost: ghost[ghost.length - 1], inDays };
}

/** "3.1 points behind it", "level with it", "1.2 points ahead of it": a result against the ghost. */
export function versusGhost(net: number, ghost: number): string {
  // From the results as shown, to one decimal, so the words agree with the numbers.
  const gap = round(round(net, 1) - round(ghost, 1), 1);
  return gap > 0 ? `${gap.toFixed(1)} points ahead of it` : gap < 0 ? `${(-gap).toFixed(1)} points behind it` : "level with it";
}
