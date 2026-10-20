import { createRng, type Rng } from "./prng";
import type { ScenarioSpec, SegmentSpec } from "./generate";

/**
 * Market regimes for the Trading Arena. The first nine are the scenario library; the last four
 * are the original regimes, kept so that saved sessions still rebuild the same market.
 */
export type ArenaRegime =
  | "bullish"
  | "bearish"
  | "sideways"
  | "high_volatility"
  | "low_volatility"
  | "breakout"
  | "false_breakout"
  | "reversal"
  | "event_shock"
  | "trending"
  | "ranging"
  | "volatile"
  | "mixed";

export const ARENA_REGIMES: { id: ArenaRegime; title: string; description: string; legacy?: boolean }[] = [
  { id: "bullish", title: "Bullish market", description: "Rising legs with pullbacks along the way." },
  { id: "bearish", title: "Bearish market", description: "Falling legs with relief rallies along the way." },
  { id: "sideways", title: "Sideways market", description: "Price oscillates between two levels." },
  { id: "high_volatility", title: "High volatility", description: "Large swings and the occasional gap." },
  { id: "low_volatility", title: "Low volatility", description: "Small, quiet candles. Costs matter more." },
  { id: "breakout", title: "Breakout", description: "A long range that eventually resolves into a trend." },
  { id: "false_breakout", title: "False breakout", description: "Breaks out of a range, then falls back inside it." },
  { id: "reversal", title: "Reversal", description: "A trend that loses steam and turns around." },
  { id: "event_shock", title: "Unexpected event", description: "A calm market hit by a sudden gap." },
  { id: "trending", title: "Trending", description: "Directional legs with pullbacks.", legacy: true },
  { id: "ranging", title: "Ranging", description: "Price oscillates between levels, with the occasional false breakout.", legacy: true },
  { id: "volatile", title: "Volatile", description: "Large swings and sudden gaps.", legacy: true },
  { id: "mixed", title: "Mixed regimes", description: "Regimes change without warning.", legacy: true },
];

const TARGET_BARS = 420;
/** Visible history before the session starts (the Arena starts at candle 59). */
const HISTORY = 60;

const barsOf = (segs: SegmentSpec[]) => segs.reduce((n, s) => n + (s.kind === "candle" ? 1 : s.bars), 0);

function trendingLegs(rng: Rng, bias: 1 | -1): SegmentSpec[] {
  return [
    { kind: "move", bars: Math.round(rng.between(22, 40)), move: bias * rng.between(0.05, 0.11), vol: rng.between(0.005, 0.008) },
    { kind: "move", bars: Math.round(rng.between(7, 14)), move: -bias * rng.between(0.02, 0.045), vol: rng.between(0.005, 0.008) },
  ];
}

function rangingBlock(rng: Rng, falseBreaks = 0.5): SegmentSpec[] {
  const out: SegmentSpec[] = [
    { kind: "range", bars: Math.round(rng.between(45, 80)), halfWidth: rng.between(0.025, 0.045), vol: rng.between(0.006, 0.009) },
  ];
  if (rng.chance(falseBreaks)) {
    const dir = rng.chance(0.5) ? 1 : -1;
    out.push({ kind: "candle", body: dir * rng.between(0.025, 0.04), upper: 0.004, lower: 0.004, volume: 1.8 });
    out.push({ kind: "move", bars: Math.round(rng.between(4, 8)), move: -dir * rng.between(0.03, 0.05), vol: 0.007 });
  }
  return out;
}

function volatileBlock(rng: Rng, scale = 1): SegmentSpec[] {
  const out: SegmentSpec[] = [
    {
      kind: "walk",
      bars: Math.round(rng.between(30, 55)),
      vol: rng.between(0.012, 0.018) * scale,
      drift: rng.between(-0.002, 0.002),
      wick: 1.3,
    },
  ];
  if (rng.chance(0.6)) {
    out.push({ kind: "walk", bars: Math.round(rng.between(10, 20)), vol: 0.01 * scale, gap: (rng.chance(0.5) ? 1 : -1) * rng.between(0.03, 0.06), volume: 1.6 });
  }
  return out;
}

function quietBlock(rng: Rng): SegmentSpec[] {
  return rng.chance(0.5)
    ? [{ kind: "range", bars: Math.round(rng.between(40, 70)), halfWidth: rng.between(0.008, 0.014), vol: rng.between(0.0022, 0.0032), volume: 0.7 }]
    : [{ kind: "walk", bars: Math.round(rng.between(40, 70)), vol: rng.between(0.0022, 0.0032), drift: rng.between(-0.0004, 0.0004), volume: 0.7 }];
}

/** A tight range followed by a decisive break and a trend that follows through. */
function breakoutBlock(rng: Rng, dir: 1 | -1): SegmentSpec[] {
  return [
    { kind: "range", bars: Math.round(rng.between(50, 80)), halfWidth: rng.between(0.018, 0.028), vol: rng.between(0.004, 0.006), volume: 0.8 },
    { kind: "candle", body: dir * rng.between(0.03, 0.045), upper: 0.004, lower: 0.003, volume: 2.2 },
    { kind: "move", bars: Math.round(rng.between(18, 30)), move: dir * rng.between(0.05, 0.09), vol: 0.007, volume: 1.3 },
    { kind: "move", bars: Math.round(rng.between(6, 12)), move: -dir * rng.between(0.015, 0.03), vol: 0.006 },
    { kind: "move", bars: Math.round(rng.between(15, 25)), move: dir * rng.between(0.03, 0.06), vol: 0.007 },
  ];
}

/** A range whose break fails: price pops out, then falls back inside and runs to the other side. */
function falseBreakoutBlock(rng: Rng): SegmentSpec[] {
  const dir = rng.chance(0.5) ? 1 : -1;
  const half = rng.between(0.025, 0.035);
  return [
    { kind: "range", bars: Math.round(rng.between(45, 70)), halfWidth: half, vol: rng.between(0.005, 0.007) },
    { kind: "candle", body: dir * rng.between(0.035, 0.05), upper: 0.005, lower: 0.004, volume: 2 },
    { kind: "move", bars: Math.round(rng.between(2, 4)), move: dir * rng.between(0.004, 0.01), vol: 0.006, volume: 1.4 },
    { kind: "move", bars: Math.round(rng.between(6, 10)), move: -dir * rng.between(0.06, 0.08), vol: 0.008, volume: 1.5 },
    { kind: "range", bars: Math.round(rng.between(20, 35)), halfWidth: half * 0.8, vol: 0.006 },
  ];
}

/** Opening history, shaped so the regime is (or isn't yet) visible when the session starts. */
function history(regime: ArenaRegime, rng: Rng, bias: 1 | -1): SegmentSpec[] {
  switch (regime) {
    case "bullish":
    case "bearish":
      return [
        { kind: "walk", bars: 25, vol: 0.006, drift: 0 },
        { kind: "move", bars: HISTORY - 25, move: bias * rng.between(0.03, 0.05), vol: 0.006 },
      ];
    case "reversal":
      return [{ kind: "move", bars: HISTORY, move: bias * rng.between(0.06, 0.09), vol: 0.006 }];
    case "low_volatility":
    case "event_shock":
      return [{ kind: "walk", bars: HISTORY, vol: 0.003, drift: 0, volume: 0.8 }];
    case "high_volatility":
      return [{ kind: "walk", bars: HISTORY, vol: 0.013, drift: 0, wick: 1.3 }];
    case "breakout":
    case "false_breakout":
    case "sideways":
      return [{ kind: "range", bars: HISTORY, halfWidth: 0.025, vol: 0.005 }];
    default:
      return [{ kind: "walk", bars: HISTORY, vol: 0.006, drift: 0 }];
  }
}

/** A fresh, seeded Arena scenario. Same regime + seed → same market. */
export function arenaSpec(regime: ArenaRegime, seed: number): ScenarioSpec {
  const rng = createRng(seed ^ 0x9e3779b9);
  // Legacy regimes keep their original construction exactly, so old sessions rebuild the same candles.
  if (regime === "trending" || regime === "ranging" || regime === "volatile" || regime === "mixed") return legacySpec(regime, seed);

  const bias: 1 | -1 = regime === "bearish" ? -1 : regime === "bullish" ? 1 : rng.chance(0.5) ? 1 : -1;
  const start = Math.round(rng.between(40, 160));
  const segments: SegmentSpec[] = history(regime, rng, bias);
  let bars = barsOf(segments);
  let blockIndex = 0;

  while (bars < TARGET_BARS) {
    let block: SegmentSpec[];
    switch (regime) {
      case "bullish":
      case "bearish":
        block = trendingLegs(rng, bias);
        break;
      case "sideways":
        block = rangingBlock(rng, 0.25);
        break;
      case "high_volatility":
        block = volatileBlock(rng, 1.2);
        break;
      case "low_volatility":
        block = quietBlock(rng);
        break;
      case "breakout":
        block = blockIndex === 0 ? breakoutBlock(rng, bias) : trendingLegs(rng, bias);
        break;
      case "false_breakout":
        block = falseBreakoutBlock(rng);
        break;
      case "reversal":
        // Two legs in the trend's direction, a stalling range, then the opposite trend.
        block = blockIndex < 2 ? trendingLegs(rng, bias) : blockIndex === 2 ? rangingBlock(rng, 0) : trendingLegs(rng, bias === 1 ? -1 : 1);
        break;
      case "event_shock":
        block =
          blockIndex === 0
            ? [
                { kind: "walk", bars: Math.round(rng.between(50, 90)), vol: 0.003, drift: 0, volume: 0.8 },
                { kind: "walk", bars: Math.round(rng.between(20, 30)), vol: 0.016, gap: bias * rng.between(0.06, 0.09), volume: 2.4, wick: 1.4 },
                { kind: "walk", bars: Math.round(rng.between(30, 50)), vol: 0.009, drift: 0, volume: 1.3 },
              ]
            : quietBlock(rng);
        break;
      default:
        block = trendingLegs(rng, bias);
    }
    segments.push(...block);
    bars += barsOf(block);
    blockIndex++;
  }
  return { seed, start, segments };
}

function legacySpec(regime: "trending" | "ranging" | "volatile" | "mixed", seed: number): ScenarioSpec {
  const rng = createRng(seed ^ 0x9e3779b9);
  const segments: SegmentSpec[] = [{ kind: "walk", bars: 60, vol: 0.006, drift: 0 }];
  let bars = 60;
  const bias: 1 | -1 = rng.chance(0.6) ? 1 : -1;
  while (bars < TARGET_BARS) {
    let block: SegmentSpec[];
    const pick = regime === "mixed" ? (["trending", "ranging", "volatile"] as const)[Math.floor(rng.next() * 3)] : regime;
    if (pick === "trending") block = trendingLegs(rng, regime === "mixed" ? (rng.chance(0.5) ? 1 : -1) : bias);
    else if (pick === "ranging") block = rangingBlock(rng);
    else block = volatileBlock(rng);
    segments.push(...block);
    bars += barsOf(block);
  }
  return { seed, start: Math.round(rng.between(40, 160)), segments };
}
