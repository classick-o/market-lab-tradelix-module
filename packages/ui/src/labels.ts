import { getCheck, getLesson } from "@market-lab/academy";
import { MISSIONS, getArenaScenario, getBot } from "@market-lab/missions";

/** Display names for ids stored in sessions, results and progress. */
export const LOOKUP = {
  mission: (id: string) => MISSIONS.find((m) => m.id === id)?.title ?? id,
  lesson: (id: string) => getLesson(id)?.title ?? id,
  check: (id: string) => getCheck(id)?.title ?? id,
  scenario: (id: string) => getArenaScenario(id).title,
  bot: (id: string) => getBot(id).name,
};
