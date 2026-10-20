import { createContext, useContext } from "react";
import { useLab } from "./store";

/**
 * What the host app (Tradelix) can provide. Inside Tradelix, the plan comes from the account and
 * is enforced server-side; the module only reflects it. Standalone, a local demo plan is used.
 */
export interface HostOptions {
  /** The user's plan as known to the host. When set, it overrides the local demo plan. */
  plan?: "free" | "pro";
  /** Called instead of the demo checkout. */
  onUpgrade?: (billing: "monthly" | "annual") => void;
  /** Called instead of the demo subscription controls. */
  onManageBilling?: () => void;
  /** Called instead of the local sign-out. */
  onSignOut?: () => void;
  /** The signed-in user, if the host knows it. */
  user?: { name?: string; avatarUrl?: string };
}

export const HostContext = createContext<HostOptions>({});
export const useHost = () => useContext(HostContext);

export const LIMITS = {
  free: { arenaPerDay: 5, analyticsDays: 30 },
  pro: { arenaPerDay: Number.POSITIVE_INFINITY, analyticsDays: Number.POSITIVE_INFINITY },
} as const;

export const PLAN_PRICES = {
  monthly: { amount: 12, label: "$12", per: "per month", note: "Billed monthly. Cancel any time." },
  annual: { amount: 96, label: "$96", per: "per year", note: "Billed yearly: $8 a month, 33% less than monthly." },
} as const;

export function usePlan(): { pro: boolean; source: "host" | "demo"; limits: (typeof LIMITS)["free"] | (typeof LIMITS)["pro"] } {
  const host = useHost();
  const lab = useLab();
  const pro = host.plan ? host.plan === "pro" : lab.plan.tier === "pro";
  return { pro, source: host.plan ? "host" : "demo", limits: pro ? LIMITS.pro : LIMITS.free };
}

export const AVATARS: { id: string; label: string; color: string }[] = [
  { id: "slate", label: "Slate", color: "#3B4659" },
  { id: "lime", label: "Lime", color: "#C8F25A" },
  { id: "blue", label: "Blue", color: "#5B8DEF" },
  { id: "violet", label: "Violet", color: "#A99BFF" },
  { id: "amber", label: "Amber", color: "#FFB547" },
  { id: "rose", label: "Rose", color: "#F28FA6" },
];

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ML";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}
