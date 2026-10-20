import type { Candle } from "@market-lab/engine";
import type { SkillId } from "@market-lab/evaluation";

export interface PlacementItem {
  id: string;
  skill: SkillId;
  difficulty: number;
  prompt: string;
  options: { id: string; label: string }[];
  correct: string;
  explain: string;
  chart?: { candles: Candle[]; highlight?: number };
}

const k = (o: number, h: number, l: number, c: number): Candle => ({ o, h, l, c, v: 1000, path: c >= o ? "OLHC" : "OHLC" });

const CANDLE_CHART: Candle[] = [
  k(10000, 10060, 9970, 10040),
  k(10040, 10110, 10020, 10090),
  k(10090, 10120, 10010, 10030),
  k(10030, 10100, 10000, 10080),
  k(10080, 10160, 10060, 10140),
  k(10140, 10180, 10090, 10110),
  k(10110, 10170, 10070, 10120),
  k(10120, 10150, 9950, 9980),
];

const TREND_CHART: Candle[] = [
  k(10000, 10080, 9960, 10060),
  k(10060, 10150, 10040, 10130),
  k(10130, 10160, 10050, 10070),
  k(10070, 10120, 10040, 10100),
  k(10100, 10240, 10090, 10220),
  k(10220, 10290, 10190, 10260),
  k(10260, 10280, 10150, 10170),
  k(10170, 10230, 10140, 10210),
  k(10210, 10380, 10200, 10350),
  k(10350, 10420, 10320, 10400),
  k(10400, 10410, 10280, 10300),
  k(10300, 10390, 10270, 10370),
];

/** Short, one-click questions that estimate a starting profile. Skippable; each answer is low-weight evidence. */
export const PLACEMENT: PlacementItem[] = [
  {
    id: "p_candle",
    skill: "market_basics",
    difficulty: 1,
    prompt: "The highlighted candle opened at 101.20 and closed at 99.80. What kind of candle is it?",
    options: [
      { id: "bull", label: "Bullish" },
      { id: "bear", label: "Bearish" },
      { id: "unsure", label: "I don't know yet" },
    ],
    correct: "bear",
    explain: "It closed below its open, so sellers ended the period in control: a bearish candle.",
    chart: { candles: CANDLE_CHART, highlight: 7 },
  },
  {
    id: "p_define",
    skill: "risk_management",
    difficulty: 2,
    prompt: "Before opening a position, what's the most important thing to define?",
    options: [
      { id: "wrong", label: "Where I'm wrong and how much I can lose" },
      { id: "gain", label: "How much I could make" },
      { id: "none", label: "Nothing. Momentum is enough" },
      { id: "unsure", label: "I don't know yet" },
    ],
    correct: "wrong",
    explain: "Profit is never guaranteed; your maximum loss is the one thing you can decide in advance.",
  },
  {
    id: "p_size",
    skill: "position_sizing",
    difficulty: 2,
    prompt: "Your account is 10,000. You risk 1%. Entry 50.00, stop 48.00. Ignoring costs, how many units can you buy?",
    options: [
      { id: "25", label: "25" },
      { id: "50", label: "50" },
      { id: "100", label: "100" },
      { id: "200", label: "200" },
      { id: "unsure", label: "I don't know yet" },
    ],
    correct: "50",
    explain: "1% of 10,000 is 100. Each unit loses 2.00 at the stop, so 100 ÷ 2 = 50 units.",
  },
  {
    id: "p_structure",
    skill: "market_structure",
    difficulty: 1,
    prompt: "Which best describes this chart?",
    options: [
      { id: "up", label: "Uptrend" },
      { id: "range", label: "Range" },
      { id: "down", label: "Downtrend" },
      { id: "unsure", label: "I don't know yet" },
    ],
    correct: "up",
    explain: "Each pullback stopped higher than the last, and each rally went further: higher highs and higher lows.",
    chart: { candles: TREND_CHART },
  },
  {
    id: "p_discipline",
    skill: "decision_discipline",
    difficulty: 2,
    prompt: "You just lost 2% on a trade. A new setup appears. What do you do?",
    options: [
      { id: "double", label: "Double the size to win it back" },
      { id: "normal", label: "Take it with normal risk, if it meets my rules" },
      { id: "quit", label: "Stop trading for good" },
      { id: "unsure", label: "I don't know yet" },
    ],
    correct: "normal",
    explain: "Losses are part of the process. Keeping risk constant is what stops a bad day from becoming a bad month.",
  },
];
