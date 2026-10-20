import type { CriterionDef } from "@market-lab/evaluation";
import type { CheckpointDef, Facts, MissionDef } from "../schema";
import { EQUITY, LONG_ONLY } from "./common";

type Structure = "up" | "down" | "range" | "noise";

const OPTIONS = [
  { id: "up", label: "Uptrend", description: "Higher highs and higher lows" },
  { id: "down", label: "Downtrend", description: "Lower highs and lower lows" },
  { id: "range", label: "Range", description: "Sideways, bouncing between two levels" },
  { id: "noise", label: "No clear structure", description: "Overlapping candles, no direction or boundaries" },
];

const REASONS = [
  { id: "hh_hl", label: "Higher highs and higher lows" },
  { id: "lh_ll", label: "Lower highs and lower lows" },
  { id: "bounded", label: "Price keeps bouncing between two levels" },
  { id: "overlap", label: "Candles overlap with no direction" },
];

const CREDIT: Record<Structure, Record<Structure, number>> = {
  up: { up: 1, noise: 0.3, range: 0, down: 0 },
  down: { down: 1, noise: 0.3, range: 0, up: 0 },
  range: { range: 1, noise: 0.5, up: 0.1, down: 0.1 },
  noise: { noise: 1, range: 0.5, up: 0.2, down: 0.2 },
};

const DESCRIBE: Record<Structure, string> = {
  up: "an uptrend: each swing made a higher high and a higher low",
  down: "a downtrend: each swing made a lower high and a lower low",
  range: "a range: price kept turning at roughly the same upper and lower levels",
  noise: "noise: candles overlapped, swings didn't line up into a trend or clear boundaries",
};

const ZONES = [
  { id: "seg1", step: 44, from: 5, to: 44 },
  { id: "seg2", step: 84, from: 45, to: 84 },
  { id: "seg3", step: 119, from: 85, to: 119 },
];

const checkpoint = (z: (typeof ZONES)[number], n: number): CheckpointDef => ({
  id: z.id,
  kind: "choice",
  trigger: { atStep: z.step },
  title: `Stretch ${n} of 3`,
  prompt: "How would you describe the shaded stretch of candles?",
  options: OPTIONS,
  reasons: REASONS,
  highlight: () => ({ zone: { from: z.from, to: z.to, label: `Stretch ${n}` } }),
});

const criterion = (z: (typeof ZONES)[number], n: number, f: Facts, weight: number): CriterionDef => {
  const truth = f[z.id] as Structure;
  const explain = Object.fromEntries(
    OPTIONS.map((o) => [
      o.id,
      o.id === truth ? `Right: this was ${DESCRIBE[truth]}.` : `This stretch was ${DESCRIBE[truth]}.`,
    ]),
  );
  const tags = Object.fromEntries(OPTIONS.filter((o) => CREDIT[truth][o.id as Structure] < 0.5).map((o) => [o.id, ["misread_structure"]]));
  return {
    id: z.id,
    label: `Read stretch ${n}`,
    evaluator: "choice",
    weight,
    skill: "market_structure",
    params: { checkpoint: z.id, credit: CREDIT[truth], explain, tags },
  };
};

export const M02: MissionDef = {
  id: "M02",
  version: 1,
  title: "Trend or Noise?",
  tagline: "Not every move is a trend. Learn to tell structure from noise.",
  skillPrimary: "market_structure",
  skillsSecondary: ["market_basics"],
  difficulty: 1,
  estMinutes: 4,
  objective: "Classify three stretches of price action as a trend, a range, or noise.",
  briefing:
    "Markets alternate between trending, ranging and doing nothing in particular. Most bad decisions start with seeing a trend that isn't there. You'll classify three stretches of the same market, one at a time.",
  rulesText: ["No trading in this mission.", "Only the shaded stretch matters for each question."],
  dataLabel: "synthetic",
  symbol: "LABX",
  variants: [
    { key: "a", label: "Uptrend, then a range, then noise", facts: { seg1: "up", seg2: "range", seg3: "noise" } },
    { key: "b", label: "Downtrend, then a range, then noise", facts: { seg1: "down", seg2: "range", seg3: "noise" } },
    { key: "c", label: "Range, then an uptrend, then noise", facts: { seg1: "range", seg2: "up", seg3: "noise" } },
  ],
  startStep: 44,
  equity: EQUITY,
  rules: { ...LONG_ONLY, orderTypes: ["market"] },
  checkpoints: ZONES.map((z, i) => checkpoint(z, i + 1)),
  rubric: (f) => [criterion(ZONES[0], 1, f, 35), criterion(ZONES[1], 2, f, 35), criterion(ZONES[2], 3, f, 30)],
  alternatives: [],
  reflection: {
    question: "Which stretch was hardest to classify, and why?",
    options: [
      { id: "trend", label: "The trend: I wasn't sure it would continue" },
      { id: "range", label: "The range: the edges weren't exact" },
      { id: "noise", label: "The noise: I kept seeing patterns" },
      { id: "none", label: "None of them" },
    ],
  },
  targets: ["misread_structure"],
  prerequisites: [],
};
