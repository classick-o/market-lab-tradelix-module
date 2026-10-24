/**
 * Everything the presentation pages say about the product, in one place. The content packages are
 * far too heavy to load on a marketing page (the course alone is megabytes), so the numbers and
 * names are copied here and test/facts.test.ts checks them against the real content.
 * "Floor" numbers are shown with a "+" and only need to stay at or below the real count.
 */

export const FLOOR = {
  lessons: 300,
  questions: 950,
  concepts: 460,
  terms: 950,
} as const;

export const EXACT = {
  units: 44,
  regimes: 9,
  freeRegimes: 6,
  bots: 7,
  achievements: 29,
  skills: 8,
  firstMissionMinutes: 3,
  duelCandles: 80,
  candleSeconds: 15,
  processWeight: 0.7,
  startRating: 1000,
  reviewDays: [1, 3, 7, 14, 30],
  weeklyXp: 150,
  streakPausesPerWeek: 2,
  equity: 10_000,
} as const;

export interface LevelFact {
  id: number;
  name: string;
  tagline: string;
  lessons: number;
}

export const LEVELS: LevelFact[] = [
  { id: 0, name: "Orientation", tagline: "What a market is, and how to think when outcomes are uncertain.", lessons: 12 },
  { id: 1, name: "Foundations", tagline: "Read a chart, place an order, size a trade and keep a plan.", lessons: 58 },
  { id: 2, name: "Practitioner", tagline: "Tools, setups and routines that hold up across market regimes.", lessons: 119 },
  { id: 3, name: "Advanced", tagline: "Market internals, macro, statistics and system design.", lessons: 108 },
  { id: 4, name: "Professional", tagline: "Derivatives, execution at scale and the business of trading.", lessons: 43 },
];

export interface BotFact {
  id: string;
  name: string;
  title: string;
  level: number;
  rating: number;
  habits: string[];
  watch: string;
}

/** The duel bots, in the order of the lobby, then Mirror. */
export const BOTS: BotFact[] = [
  { id: "pip", name: "Pip", title: "The eager beginner", level: 1, rating: 850, habits: ["Stops inside normal noise", "Moving the stop further away"], watch: "Stops so close that ordinary noise takes Pip out, often right before price goes the way Pip guessed." },
  { id: "dash", name: "Dash", title: "The overtrader", level: 1, rating: 950, habits: ["Trading too often"], watch: "Spread and commission on every round trip. Count how much of Dash's result goes to costs." },
  { id: "blaze", name: "Blaze", title: "The momentum chaser", level: 2, rating: 1050, habits: ["Chasing extended moves"], watch: "Entries after the move has already stretched far from the average, close to the top." },
  { id: "grudge", name: "Grudge", title: "The revenge trader", level: 2, rating: 1150, habits: ["Sizing up after a loss"], watch: "The trade right after a loss: Grudge more than doubles the risk." },
  { id: "hope", name: "Hope", title: "The stop mover", level: 3, rating: 1250, habits: ["Moving the stop further away"], watch: "Hope's stop when price comes near it. Rare losses, but larger than planned." },
  { id: "rook", name: "Rook", title: "The disciplined trend follower", level: 4, rating: 1400, habits: [], watch: "Rook is hard to beat in a trend and has nothing to do in a range." },
  { id: "sage", name: "Sage", title: "The patient range trader", level: 5, rating: 1550, habits: [], watch: "How long Sage waits. Fewer trades, each with a defined edge." },
];

export const MIRROR: BotFact = {
  id: "mirror",
  name: "Mirror",
  title: "Your own habit",
  level: 3,
  rating: 1150,
  habits: [],
  watch: "Your own habit, played against you.",
};

/** Real glossary entries (term and plain-English line) for the Library card. */
export const TERMS: { id: string; term: string; plain: string }[] = [
  { id: "spread-triggered-stop", term: "Spread-triggered stop", plain: "A stop hit because the spread widened, although the mid price never reached it." },
  { id: "after-cost-expectancy", term: "After-cost expectancy", plain: "The average result per trade once spread, commission and slippage are taken off." },
  { id: "asymmetric-slippage", term: "Asymmetric slippage", plain: "Only bad slippage reaches you. A warning sign." },
];

/** Real titles shown inside the animated scenes. */
export const SCENE_TEXT = {
  lesson: { id: "0.1.1", title: "What a market is: an auction", minutes: 5 },
  mission: { id: "M04", title: "Define Your Risk" },
  achievement: "Right call, wrong result",
  rank: { level: 8, title: "Tactician" },
  challenge: { title: "Size it right", objective: "Turn a risk budget and a stop into a number of units." },
} as const;

/** Where each room lives inside the trading module. */
export const APP_ROUTES = {
  start: "/start",
  dashboard: "/dashboard",
  learn: "/learn/course",
  missions: "/missions/all",
  arena: "/arena/simulator",
  duels: "/arena/duels",
  journal: "/journal/sessions",
  progress: "/progress/skills",
  pricing: "/pricing",
  calculator: "/arena/risk-calculator",
  library: "/learn/library",
} as const;
