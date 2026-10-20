import type { SkillId } from "@market-lab/evaluation";

export interface SkillDef {
  id: SkillId;
  name: string;
  short: string;
  description: string;
  prerequisites: SkillId[];
}

export const SKILLS: SkillDef[] = [
  {
    id: "market_basics",
    name: "Market Basics",
    short: "MB",
    description: "Reading candles and prices: what a chart actually shows, and what it doesn't.",
    prerequisites: [],
  },
  {
    id: "order_mechanics",
    name: "Order Mechanics",
    short: "OM",
    description: "Market and limit orders, the spread, fills and trading costs.",
    prerequisites: ["market_basics"],
  },
  {
    id: "risk_management",
    name: "Risk Management",
    short: "RM",
    description: "Deciding where you're wrong and how much you can lose before you enter.",
    prerequisites: ["order_mechanics"],
  },
  {
    id: "position_sizing",
    name: "Position Sizing",
    short: "PS",
    description: "Turning a risk budget and a stop into the right number of units.",
    prerequisites: ["risk_management"],
  },
  {
    id: "market_structure",
    name: "Market Structure",
    short: "MS",
    description: "Telling trends, ranges, breakouts and plain noise apart.",
    prerequisites: ["market_basics"],
  },
  {
    id: "scenario_analysis",
    name: "Scenario Analysis",
    short: "SA",
    description: "Forming a hypothesis, weighing evidence and comparing alternatives.",
    prerequisites: ["market_structure"],
  },
  {
    id: "decision_discipline",
    name: "Decision Discipline",
    short: "DD",
    description: "Following your plan, including the decision not to trade.",
    prerequisites: ["risk_management", "market_structure"],
  },
  {
    id: "reflection_review",
    name: "Reflection & Review",
    short: "RR",
    description: "Looking back at decisions honestly and turning them into lessons.",
    prerequisites: [],
  },
];

export const SKILL_BY_ID: Record<SkillId, SkillDef> = Object.fromEntries(SKILLS.map((s) => [s.id, s])) as Record<SkillId, SkillDef>;
