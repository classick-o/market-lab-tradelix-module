/** XP rewards learning activity. It is never awarded for simulated profit. */
export const XP_RULES = {
  missionByDifficulty: [0, 50, 75, 100, 125, 150],
  reflection: 20,
  replay: 15,
  arenaSession: 40,
  placement: 30,
  /** First completion of a lesson. */
  lesson: 15,
  /** Bonus when the lesson's check is 3 of 3 right on the first try. */
  lessonPerfect: 10,
  /** A finished daily review session. */
  review: 15,
  /** First pass of a knowledge check / topic assessment. */
  checkPass: 40,
  assessmentPass: 60,
} as const;

/** Repeating the same mission on the same day earns 100%, 50%, 25%, then nothing. */
export function missionXp(difficulty: number, attemptsToday: number): number {
  const base = XP_RULES.missionByDifficulty[Math.max(1, Math.min(5, difficulty))];
  const mult = [1, 0.5, 0.25][attemptsToday] ?? 0;
  return Math.round(base * mult);
}

/** Level n → n+1 costs 150 + 50·(n − 1) XP. Levels are cosmetic and never unlock content. */
export function levelFromXp(xp: number): { level: number; into: number; needed: number } {
  let level = 1;
  let remaining = xp;
  let needed = 150;
  while (remaining >= needed) {
    remaining -= needed;
    level += 1;
    needed = 150 + 50 * (level - 1);
  }
  return { level, into: remaining, needed };
}
