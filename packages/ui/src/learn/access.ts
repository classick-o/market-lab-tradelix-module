import type { Tier } from "@market-lab/academy";

/**
 * For now every Learn lesson and track is open to everyone; grouping by plan comes once the
 * system is complete (PLAN_LEARN §17, decision 1). Flip this to restore the Pro gate.
 */
export const LEARN_ALL_FREE = true;

export const learnLocked = (tier: Tier | undefined, pro: boolean): boolean => !LEARN_ALL_FREE && tier === "pro" && !pro;
export const showProBadge = (tier: Tier | undefined): boolean => !LEARN_ALL_FREE && tier === "pro";
