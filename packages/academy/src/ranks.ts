/**
 * Ranks are cosmetic names for level bands. They describe practice, not qualification:
 * none of them is a certification.
 */
export const RANKS: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: "Observer" },
  { minLevel: 3, title: "Apprentice" },
  { minLevel: 5, title: "Practitioner" },
  { minLevel: 8, title: "Tactician" },
  { minLevel: 12, title: "Strategist" },
  { minLevel: 16, title: "Veteran" },
  { minLevel: 20, title: "Mentor" },
];

export function rankOf(level: number): { title: string; next: { title: string; level: number } | null } {
  let i = 0;
  while (i + 1 < RANKS.length && level >= RANKS[i + 1].minLevel) i++;
  const next = RANKS[i + 1];
  return { title: RANKS[i].title, next: next ? { title: next.title, level: next.minLevel } : null };
}
