import type { MissionDef } from "../schema";
import { EQUITY, LONG_ONLY, num } from "./common";

const HL = 39;

export const M01: MissionDef = {
  id: "M01",
  version: 1,
  title: "Read the Candle",
  tagline: "Open, high, low, close — and what a candle can't tell you.",
  skillPrimary: "market_basics",
  skillsSecondary: [],
  difficulty: 1,
  estMinutes: 3,
  objective: "Read the four prices inside a candle, and separate what it shows from what it predicts.",
  briefing:
    "Every candle summarizes one period of trading: where price opened, the highest and lowest prices traded, and where it closed. The body spans open to close; the thin wicks reach the high and the low. A light body closed above its open, a dark body closed below. We'll read the highlighted candle together.",
  rulesText: ["No trading in this mission, just reading.", "Click directly on the chart to mark a price. The crosshair shows the exact value."],
  dataLabel: "synthetic",
  symbol: "LABX",
  variants: [
    { key: "a", label: "A large bearish candle" },
    { key: "b", label: "A bullish candle" },
    { key: "c", label: "A small bearish body with a long lower wick" },
  ],
  startStep: HL,
  equity: EQUITY,
  rules: { ...LONG_ONLY, orderTypes: ["market"] },
  facts: ({ visible }) => {
    const c = visible[HL];
    const range = c.h - c.l;
    return { o: c.o, h: c.h, l: c.l, c: c.c, bullish: c.c >= c.o, tol: Math.max(6, Math.round(range * 0.12)) };
  },
  checkpoints: [
    {
      id: "high",
      kind: "pick",
      trigger: { atStep: HL },
      title: "Find the high",
      prompt: "Click the HIGH of the highlighted candle: the highest price traded during that period.",
      pick: { label: "High" },
      highlight: () => ({ candle: HL }),
    },
    {
      id: "close",
      kind: "pick",
      trigger: { atStep: HL },
      title: "Find the close",
      prompt: "Now click its CLOSE: the last price traded in that period.",
      pick: { label: "Close" },
      highlight: () => ({ candle: HL }),
    },
    {
      id: "meaning",
      kind: "choice",
      trigger: { atStep: HL },
      title: "What does it tell you?",
      prompt: "Which statement about the highlighted candle is supported by the chart?",
      options: [
        { id: "buyers", label: "It closed above its open: buyers ended the period in control." },
        { id: "sellers", label: "It closed below its open: sellers ended the period in control." },
        { id: "predict", label: "It tells us where price will go next." },
        { id: "nothing", label: "Candles carry no useful information." },
      ],
      highlight: () => ({ candle: HL }),
    },
  ],
  rubric: (f) => {
    const right = f.bullish ? "buyers" : "sellers";
    const wrong = f.bullish ? "sellers" : "buyers";
    return [
      {
        id: "high",
        label: "Located the high",
        evaluator: "pick",
        weight: 30,
        skill: "market_basics",
        params: { checkpoint: "high", target: num(f.h), tolerance: num(f.tol), targetLabel: "high" },
      },
      {
        id: "close",
        label: "Located the close",
        evaluator: "pick",
        weight: 30,
        skill: "market_basics",
        params: { checkpoint: "close", target: num(f.c), tolerance: num(f.tol), targetLabel: "close" },
      },
      {
        id: "meaning",
        label: "Separated observation from prediction",
        evaluator: "choice",
        weight: 40,
        skill: "market_basics",
        params: {
          checkpoint: "meaning",
          credit: { [right]: 1, [wrong]: 0, predict: 0, nothing: 0.2 },
          explain: {
            [right]: "Right. That's an observation the candle supports, without claiming anything about the future.",
            [wrong]: `Look at the body again: this candle closed ${f.bullish ? "above" : "below"} its open${f.bullish ? " (a light body)" : " (a dark body)"}.`,
            predict: "A candle describes the period that just ended. It doesn't predict the next one, and what happened afterwards in this run proves nothing either way.",
            nothing: "Candles don't predict, but they do summarize who was in control during the period. That's useful context.",
          },
          tags: { [wrong]: ["misread_candle"], predict: ["misread_candle"] },
        },
      },
    ];
  },
  alternatives: [],
  reflection: {
    question: "What is one thing a single candle can't tell you?",
    options: [
      { id: "future", label: "Where price goes next" },
      { id: "why", label: "Why people bought or sold" },
      { id: "path", label: "Whether the high or the low came first" },
      { id: "all", label: "All of these" },
    ],
  },
  targets: ["misread_candle"],
  prerequisites: [],
};
