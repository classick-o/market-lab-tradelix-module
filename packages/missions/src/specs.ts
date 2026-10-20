import type { ScenarioSpec, SegmentSpec } from "@market-lab/scenario-gen";

/**
 * Generator specs for every mission variant. The datasets are generated once with
 * `npm run content:generate` and committed to data/scenarios.json, so every client and
 * a future server read byte-identical candles.
 */

const m01Lead: SegmentSpec[] = [{ kind: "walk", bars: 39, vol: 0.006, drift: 0.0006 }];
const m01Tail: SegmentSpec[] = [{ kind: "walk", bars: 12, vol: 0.006 }];

const m02: Record<string, SegmentSpec[]> = {
  a: [
    { kind: "move", bars: 45, move: 0.11, vol: 0.005 },
    { kind: "range", bars: 40, halfWidth: 0.025, vol: 0.006 },
    { kind: "move", bars: 35, move: 0.01, vol: 0.011, wick: 1.4 },
    { kind: "walk", bars: 10, vol: 0.006 },
  ],
  b: [
    { kind: "move", bars: 45, move: -0.1, vol: 0.005 },
    { kind: "range", bars: 40, halfWidth: 0.025, vol: 0.006 },
    { kind: "move", bars: 35, move: -0.01, vol: 0.011, wick: 1.4 },
    { kind: "walk", bars: 10, vol: 0.006 },
  ],
  c: [
    { kind: "range", bars: 45, halfWidth: 0.025, vol: 0.006 },
    { kind: "move", bars: 40, move: 0.1, vol: 0.005 },
    { kind: "move", bars: 35, move: 0.01, vol: 0.011, wick: 1.4 },
    { kind: "walk", bars: 10, vol: 0.006 },
  ],
};

const pullbackSetup = (lead: number, leg: number, pull: number, bounce: number): SegmentSpec[] => [
  { kind: "walk", bars: lead, vol: 0.005, drift: 0.001 },
  { kind: "move", bars: 22, move: leg, vol: 0.005 },
  { kind: "move", bars: 10, move: -pull, vol: 0.005 },
  { kind: "move", bars: 4, move: bounce, vol: 0.004 },
];

const m06Setup: SegmentSpec[] = [
  { kind: "range", bars: 60, halfWidth: 0.02, vol: 0.006 },
  { kind: "move", bars: 12, move: 0.12, vol: 0.005, volume: 1.6 },
];

const m07Setup: SegmentSpec[] = [
  { kind: "walk", bars: 25, vol: 0.005, drift: 0.0008 },
  { kind: "move", bars: 15, move: 0.05, vol: 0.005 },
  { kind: "move", bars: 10, move: -0.017, vol: 0.003, wick: 0.6 },
];

const m10Range: SegmentSpec[] = [{ kind: "range", bars: 50, halfWidth: 0.025, vol: 0.006 }];

export const SCENARIO_SPECS: Record<string, ScenarioSpec> = {
  // M01 Read the Candle: one highlighted candle at index 39.
  "M01-a": { seed: 1101, start: 100, segments: [...m01Lead, { kind: "candle", body: -0.022, upper: 0.006, lower: 0.005, volume: 1.8 }, ...m01Tail] },
  "M01-b": { seed: 1102, start: 84, segments: [...m01Lead, { kind: "candle", body: 0.02, upper: 0.004, lower: 0.007, volume: 1.7 }, ...m01Tail] },
  "M01-c": { seed: 1103, start: 132, segments: [...m01Lead, { kind: "candle", body: -0.008, upper: 0.006, lower: 0.018, volume: 1.5 }, ...m01Tail] },

  // M02 Trend or Noise?: three labelled segments.
  "M02-a": { seed: 2101, start: 100, segments: m02.a },
  "M02-b": { seed: 2102, start: 118, segments: m02.b },
  "M02-c": { seed: 2103, start: 76, segments: m02.c },

  // M04 Define Your Risk: uptrend, pullback, bounce; decision at 55.
  "M04-a": { seed: 4101, start: 100, segments: [...pullbackSetup(20, 0.08, 0.035, 0.012), { kind: "move", bars: 30, move: 0.07, vol: 0.005 }] },
  "M04-b": {
    seed: 4102,
    start: 64,
    segments: [...pullbackSetup(20, 0.08, 0.035, 0.012), { kind: "move", bars: 12, move: -0.05, vol: 0.006 }, { kind: "move", bars: 18, move: 0.03, vol: 0.005 }],
  },
  "M04-c": { seed: 4103, start: 142, segments: [...pullbackSetup(20, 0.08, 0.035, 0.012), { kind: "range", bars: 30, halfWidth: 0.015, vol: 0.005 }] },

  // M05 Size Matters: same structure, decision at 52.
  "M05-a": { seed: 5101, start: 100, segments: [...pullbackSetup(17, 0.07, 0.03, 0.01), { kind: "move", bars: 25, move: 0.06, vol: 0.005 }] },
  "M05-b": {
    seed: 5102,
    start: 57,
    segments: [...pullbackSetup(17, 0.07, 0.03, 0.01), { kind: "move", bars: 10, move: -0.045, vol: 0.006 }, { kind: "move", bars: 15, move: 0.02, vol: 0.005 }],
  },
  "M05-c": { seed: 5103, start: 121, segments: [...pullbackSetup(17, 0.07, 0.03, 0.01), { kind: "range", bars: 25, halfWidth: 0.015, vol: 0.005 }] },

  // M06 The FOMO Trap: range, then a +12% extension; decision at 71.
  "M06-a": { seed: 6101, start: 100, segments: [...m06Setup, { kind: "move", bars: 20, move: 0.07, vol: 0.0025, wick: 0.6 }, { kind: "walk", bars: 20, vol: 0.004 }] },
  "M06-b": {
    seed: 6102,
    start: 88,
    segments: [
      ...m06Setup,
      { kind: "move", bars: 7, move: -0.055, vol: 0.004 },
      { kind: "candle", body: 0.018, upper: 0.003, lower: 0.004, volume: 1.6 },
      { kind: "move", bars: 24, move: 0.06, vol: 0.005 },
    ],
  },
  "M06-c": { seed: 6103, start: 110, segments: [...m06Setup, { kind: "move", bars: 10, move: -0.13, vol: 0.006 }, { kind: "range", bars: 20, halfWidth: 0.02, vol: 0.006 }] },

  // M07 Stop or Stay?: position opened at 39, drifts toward the stop by 49.
  "M07-a": { seed: 7101, start: 100, segments: [...m07Setup, { kind: "move", bars: 5, move: -0.025, vol: 0.004 }, { kind: "move", bars: 20, move: 0.09, vol: 0.005 }] },
  "M07-b": {
    seed: 7102,
    start: 73,
    segments: [...m07Setup, { kind: "move", bars: 3, move: 0.01, vol: 0.002, wick: 0.5 }, { kind: "move", bars: 20, move: 0.075, vol: 0.004 }],
  },
  "M07-c": { seed: 7103, start: 128, segments: [...m07Setup, { kind: "move", bars: 15, move: -0.08, vol: 0.006 }, { kind: "walk", bars: 10, vol: 0.006 }] },

  // M10 No Trade Is a Trade: range, then a candle that may or may not meet the playbook; decision at the last candle before the tail.
  "M10-a": {
    seed: 10101,
    start: 100,
    segments: [...m10Range, { kind: "move", bars: 4, move: -0.01, vol: 0.004 }, { kind: "candle", body: 0.011, upper: 0.004, lower: 0.003, volume: 2.6 }, { kind: "range", bars: 15, halfWidth: 0.02, vol: 0.006 }],
  },
  "M10-b": {
    seed: 10102,
    start: 92,
    segments: [
      ...m10Range,
      { kind: "move", bars: 4, move: 0.022, vol: 0.003 },
      { kind: "candle", body: 0.017, upper: 0.003, lower: 0.002, volume: 2.6 },
      { kind: "move", bars: 15, move: 0.05, vol: 0.005 },
    ],
  },
  "M10-c": {
    seed: 10103,
    start: 109,
    segments: [
      ...m10Range,
      { kind: "move", bars: 4, move: 0.022, vol: 0.003 },
      { kind: "candle", body: 0.017, upper: 0.003, lower: 0.002, volume: 0.45 },
      { kind: "move", bars: 15, move: -0.045, vol: 0.006 },
    ],
  },
};
