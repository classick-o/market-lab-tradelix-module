import type { Topic, TopicId } from "./types";

/** The ten topics. Missions, lessons, concepts and knowledge checks are all filed under them. */
export const TOPICS: Topic[] = [
  { id: "market_fundamentals", name: "Market Fundamentals", description: "Prices, candles, the spread and what a chart can and can't tell you.", skill: "market_basics", icon: "candle" },
  { id: "technical_analysis", name: "Technical Analysis Basics", description: "Trends, ranges, levels, breakouts and moving averages.", skill: "market_structure", icon: "chart" },
  { id: "order_types", name: "Order Types", description: "Market, limit, stop-loss and take-profit orders, and how they fill.", skill: "order_mechanics", icon: "layers" },
  { id: "risk_management", name: "Risk Management", description: "Deciding how much you can lose before deciding what you could make.", skill: "risk_management", icon: "shield" },
  { id: "position_sizing", name: "Position Sizing", description: "Turning a risk budget and a stop into a number of units.", skill: "position_sizing", icon: "scale" },
  { id: "stop_loss", name: "Stop-Loss Management", description: "Where stops belong, and why you never widen one.", skill: "risk_management", icon: "target" },
  { id: "psychology", name: "Trading Psychology", description: "FOMO, revenge trading, loss aversion and how to plan around them.", skill: "decision_discipline", icon: "brain" },
  { id: "decision_making", name: "Decision-Making", description: "Plans, playbooks and judging decisions by process, not outcome.", skill: "decision_discipline", icon: "compass" },
  { id: "portfolio_exposure", name: "Portfolio Exposure", description: "How much of your account is in the market, and what leverage does to it.", skill: "position_sizing", icon: "pie" },
  { id: "scenario_analysis", name: "Scenario Analysis", description: "Forming hypotheses, weighing evidence and comparing what-ifs.", skill: "scenario_analysis", icon: "branch" },
];

export const TOPIC_BY_ID: Record<TopicId, Topic> = Object.fromEntries(TOPICS.map((t) => [t.id, t])) as Record<TopicId, Topic>;

/** Mission categories: a mission can belong to several topics; the first one is its main category. */
export const MISSION_TOPICS: Record<string, TopicId[]> = {
  M01: ["market_fundamentals", "technical_analysis"],
  M02: ["technical_analysis", "scenario_analysis"],
  M04: ["stop_loss", "risk_management", "order_types"],
  M05: ["position_sizing", "risk_management"],
  M06: ["psychology", "decision_making"],
  M07: ["stop_loss", "psychology"],
  M10: ["decision_making", "scenario_analysis"],
};

export function missionTopics(missionId: string): TopicId[] {
  return MISSION_TOPICS[missionId] ?? [];
}
