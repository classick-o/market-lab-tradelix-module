import type { SkillId } from "@market-lab/evaluation";
import { levelAtLeast, type SkillLevel } from "@market-lab/learning";
import { LESSONS } from "./catalog";
import { LEARNING_PATHS } from "./paths";
import { activeDays, activityTimes, pathProgress, type ProgressSnapshot } from "./progress";
import { dayIndex, dayKey } from "./calendar";
import { TOPICS } from "./topics";

export type AchievementCategory = "missions" | "risk" | "consistency" | "learning" | "mastery";

export const ACHIEVEMENT_CATEGORY_LABEL: Record<AchievementCategory, string> = {
  missions: "Missions",
  risk: "Risk management",
  consistency: "Consistency",
  learning: "Learning",
  mastery: "Skill mastery",
};

export interface AchievementStatus {
  unlocked: boolean;
  /** When it was earned, if it was. */
  at: number | null;
  progress: [number, number];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  evaluate: (s: ProgressSnapshot) => AchievementStatus;
}

/** Unlocked once `times` (sorted) has at least `target` entries; unlocked at the target-th time. */
function count(times: number[], target: number): AchievementStatus {
  const sorted = [...times].sort((a, b) => a - b);
  return { unlocked: sorted.length >= target, at: sorted.length >= target ? sorted[target - 1] : null, progress: [Math.min(sorted.length, target), target] };
}

function firstSkillAt(s: ProgressSnapshot, level: SkillLevel, skills?: SkillId[]): number | null {
  const hit = s.skillHistory.find((h) => (!skills || skills.includes(h.skill)) && levelAtLeast(h.theta, level));
  return hit?.at ?? null;
}

const SKILL_IDS: SkillId[] = [
  "market_basics",
  "order_mechanics",
  "risk_management",
  "position_sizing",
  "market_structure",
  "scenario_analysis",
  "decision_discipline",
  "reflection_review",
];

/**
 * Achievements reward learning, discipline and consistency. None depends on simulated profit,
 * and none can be earned by exceeding a risk limit.
 */
export const ACHIEVEMENTS: Achievement[] = [
  // Missions
  { id: "first-mission", title: "First steps", description: "Complete your first mission.", category: "missions", icon: "flag", evaluate: (s) => count(s.missions.map((m) => m.at), 1) },
  { id: "missions-5", title: "Getting the hang of it", description: "Complete five missions.", category: "missions", icon: "flag", evaluate: (s) => count(s.missions.map((m) => m.at), 5) },
  {
    id: "all-missions",
    title: "Full circuit",
    description: "Complete every mission at least once.",
    category: "missions",
    icon: "route",
    evaluate: (s) => {
      const firsts = new Map<string, number>();
      for (const m of [...s.missions].sort((a, b) => a.at - b.at)) if (!firsts.has(m.missionId)) firsts.set(m.missionId, m.at);
      return count([...firsts.values()], 7);
    },
  },
  { id: "solid-process", title: "Sound process", description: "Score 75 or more for decision quality in a mission.", category: "missions", icon: "check-circle", evaluate: (s) => count(s.missions.filter((m) => (m.dqs ?? 0) >= 75).map((m) => m.at), 1) },
  { id: "textbook", title: "Textbook decision", description: "Score 90 or more for decision quality in a mission.", category: "missions", icon: "star", evaluate: (s) => count(s.missions.filter((m) => (m.dqs ?? 0) >= 90).map((m) => m.at), 1) },
  {
    id: "good-loss",
    title: "Right call, wrong result",
    description: "Score 75+ for decision quality on a mission whose simulated outcome was a loss. Process over outcome.",
    category: "missions",
    icon: "balance",
    evaluate: (s) => count(s.missions.filter((m) => (m.dqs ?? 0) >= 75 && m.net < 0).map((m) => m.at), 1),
  },
  // Risk management
  { id: "clean-sheet", title: "Clean sheet", description: "Finish an Arena session with a Risk Discipline score of 100.", category: "risk", icon: "shield", evaluate: (s) => count(s.arena.filter((a) => a.trades > 0 && a.rds === 100).map((a) => a.at), 1) },
  {
    id: "discipline-run",
    title: "Steady hands",
    description: "Three Arena sessions in a row with Risk Discipline of 90 or more.",
    category: "risk",
    icon: "shield",
    evaluate: (s) => {
      const scored = s.arena.filter((a) => a.rds !== null).sort((a, b) => a.at - b.at);
      let run = 0;
      let best = 0;
      let at: number | null = null;
      for (const a of scored) {
        run = (a.rds ?? 0) >= 90 ? run + 1 : 0;
        best = Math.max(best, run);
        if (run === 3 && at === null) at = a.at;
      }
      return { unlocked: at !== null, at, progress: [Math.min(3, at !== null ? 3 : run), 3] };
    },
  },
  { id: "scenario-cleared", title: "Scenario cleared", description: "Meet every completion condition of an Arena scenario.", category: "risk", icon: "flag", evaluate: (s) => count(s.arena.filter((a) => a.completed).map((a) => a.at), 1) },
  {
    id: "scenario-tour",
    title: "Market tourist",
    description: "Clear five different Arena scenarios.",
    category: "risk",
    icon: "map",
    evaluate: (s) => {
      const firsts = new Map<string, number>();
      for (const a of [...s.arena].filter((x) => x.completed).sort((x, y) => x.at - y.at)) if (!firsts.has(a.scenario)) firsts.set(a.scenario, a.at);
      return count([...firsts.values()], 5);
    },
  },
  { id: "gap-survivor", title: "Gap survivor", description: "Clear the Unexpected event scenario.", category: "risk", icon: "bolt", evaluate: (s) => count(s.arena.filter((a) => a.completed && a.scenario === "event_shock").map((a) => a.at), 1) },
  // Consistency
  ...[3, 7, 30].map(
    (n): Achievement => ({
      id: `streak-${n}`,
      title: n === 3 ? "On a roll" : n === 7 ? "A week of practice" : "Habit formed",
      description: `Practise on ${n} days in a row.`,
      category: "consistency",
      icon: "flame",
      evaluate: (s) => {
        const days = activeDays(s);
        const firstAt = new Map<string, number>();
        for (const at of activityTimes(s).sort((a, b) => a - b)) {
          const k = dayKey(at, s.tz);
          if (!firstAt.has(k)) firstAt.set(k, at);
        }
        let run = 0;
        let prev = Number.NEGATIVE_INFINITY;
        let best = 0;
        let at: number | null = null;
        for (const d of days) {
          const i = dayIndex(d);
          run = i === prev + 1 ? run + 1 : 1;
          prev = i;
          best = Math.max(best, run);
          if (run >= n && at === null) at = firstAt.get(d) ?? s.now;
        }
        return { unlocked: best >= n, at, progress: [Math.min(best, n), n] };
      },
    }),
  ),
  { id: "daily-5", title: "Daily habit", description: "Complete five daily challenges.", category: "consistency", icon: "calendar", evaluate: (s) => count(s.dailies.map((d) => d.at), 5) },
  { id: "weekly-1", title: "Week well spent", description: "Complete a weekly challenge.", category: "consistency", icon: "calendar", evaluate: (s) => count(s.weeklies.map((w) => w.at), 1) },
  { id: "reflect-5", title: "Honest look", description: "Write five reflections after missions.", category: "consistency", icon: "pen", evaluate: (s) => count(s.reflections.map((r) => r.at), 5) },
  { id: "replay-3", title: "Second look", description: "Review three sessions in Trade Replay.", category: "consistency", icon: "replay", evaluate: (s) => count(s.replays.map((r) => r.at), 3) },
  // Learning
  { id: "first-lesson", title: "First lesson", description: "Complete a lesson.", category: "learning", icon: "book", evaluate: (s) => count(s.lessons.map((l) => l.at), 1) },
  { id: "lessons-10", title: "Well read", description: "Complete ten lessons.", category: "learning", icon: "book", evaluate: (s) => count(s.lessons.map((l) => l.at), 10) },
  {
    id: "all-lessons",
    title: "Library card",
    description: "Complete every lesson.",
    category: "learning",
    icon: "library",
    evaluate: (s) => count(s.lessons.filter((l) => LESSONS.some((x) => x.id === l.id)).map((l) => l.at), LESSONS.length),
  },
  { id: "check-pass", title: "Checked", description: "Pass a knowledge check.", category: "learning", icon: "check-circle", evaluate: (s) => count(s.checks.filter((c) => c.kind === "check" && c.passed).map((c) => c.at), 1) },
  {
    id: "topic-tour",
    title: "Topic tour",
    description: "Pass a knowledge check in every topic.",
    category: "learning",
    icon: "map",
    evaluate: (s) => {
      const firsts = new Map<string, number>();
      for (const c of [...s.checks].filter((x) => x.kind === "check" && x.passed).sort((a, b) => a.at - b.at)) if (!firsts.has(c.topic)) firsts.set(c.topic, c.at);
      return count([...firsts.values()], TOPICS.length);
    },
  },
  { id: "assessed", title: "Assessed", description: "Pass a topic assessment.", category: "learning", icon: "medal", evaluate: (s) => count(s.checks.filter((c) => c.kind === "assessment" && c.passed).map((c) => c.at), 1) },
  {
    id: "path-1",
    title: "Path finder",
    description: "Complete a learning path.",
    category: "learning",
    icon: "route",
    evaluate: (s) => count(LEARNING_PATHS.map((p) => pathProgress(p, s).completedAt).filter((t): t is number => t !== null), 1),
  },
  // Mastery (skill estimates come from decisions, never from profit)
  {
    id: "proficient",
    title: "Proficient",
    description: "Reach Proficient in any skill.",
    category: "mastery",
    icon: "trend",
    evaluate: (s) => {
      const at = firstSkillAt(s, "proficient");
      const now = SKILL_IDS.some((k) => levelAtLeast(s.skills[k]?.theta ?? -2, "proficient"));
      return { unlocked: now || at !== null, at, progress: [now || at !== null ? 1 : 0, 1] };
    },
  },
  {
    id: "advanced",
    title: "Advanced",
    description: "Reach Advanced in any skill.",
    category: "mastery",
    icon: "trend",
    evaluate: (s) => {
      const at = firstSkillAt(s, "advanced");
      const now = SKILL_IDS.some((k) => levelAtLeast(s.skills[k]?.theta ?? -2, "advanced"));
      return { unlocked: now || at !== null, at, progress: [now || at !== null ? 1 : 0, 1] };
    },
  },
  {
    id: "well-rounded",
    title: "Well rounded",
    description: "Every skill at Developing or above.",
    category: "mastery",
    icon: "radar",
    evaluate: (s) => {
      const n = SKILL_IDS.filter((k) => levelAtLeast(s.skills[k]?.theta ?? -2, "developing")).length;
      return { unlocked: n === SKILL_IDS.length, at: n === SKILL_IDS.length ? (s.skillHistory[s.skillHistory.length - 1]?.at ?? null) : null, progress: [n, SKILL_IDS.length] };
    },
  },
  {
    id: "personal-best",
    title: "Personal best",
    description: "Improve your decision quality on a mission by 20 points or more since your first attempt.",
    category: "mastery",
    icon: "trend",
    evaluate: (s) => {
      const firstBy = new Map<string, number>();
      for (const m of [...s.missions].sort((a, b) => a.at - b.at)) {
        if (m.dqs === null) continue;
        const first = firstBy.get(m.missionId);
        if (first === undefined) firstBy.set(m.missionId, m.dqs);
        else if (m.dqs - first >= 20) return { unlocked: true, at: m.at, progress: [1, 1] };
      }
      return { unlocked: false, at: null, progress: [0, 1] };
    },
  },
];

export function evaluateAchievements(s: ProgressSnapshot): (Achievement & { status: AchievementStatus })[] {
  return ACHIEVEMENTS.map((a) => ({ ...a, status: a.evaluate(s) }));
}
