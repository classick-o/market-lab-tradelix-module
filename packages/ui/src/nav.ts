/** The canonical navigation of the module: three groups, eight top-level destinations. */

export interface NavChild {
  id: string;
  label: string;
  to: string;
  icon: string;
}

export interface NavItem {
  id: "dashboard" | "missions" | "arena" | "journal" | "learn" | "progress" | "pricing" | "settings";
  label: string;
  to: string;
  icon: string;
  group: "workspace" | "learning" | "account";
  children?: NavChild[];
}

export const NAV_GROUPS: { id: NavItem["group"]; label: string }[] = [
  { id: "workspace", label: "Workspace" },
  { id: "learning", label: "Learning" },
  { id: "account", label: "Account" },
];

export const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", to: "/dashboard", icon: "grid", group: "workspace" },
  {
    id: "missions",
    label: "Missions",
    to: "/missions",
    icon: "flag",
    group: "workspace",
    children: [
      { id: "for-you", label: "For You", to: "/missions/for-you", icon: "sparkle" },
      { id: "all", label: "All Missions", to: "/missions/all", icon: "list" },
      { id: "daily", label: "Daily Challenges", to: "/missions/daily", icon: "sun" },
      { id: "weekly", label: "Weekly Challenges", to: "/missions/weekly", icon: "calendar" },
      { id: "assessments", label: "Assessments", to: "/missions/assessments", icon: "clipboard" },
    ],
  },
  {
    id: "arena",
    label: "Trading Arena",
    to: "/arena",
    icon: "candles",
    group: "workspace",
    children: [
      { id: "simulator", label: "Simulator", to: "/arena/simulator", icon: "chart" },
      { id: "scenarios", label: "Scenarios", to: "/arena/scenarios", icon: "layers" },
      { id: "portfolio", label: "Virtual Portfolio", to: "/arena/portfolio", icon: "wallet" },
      { id: "calculator", label: "Risk Calculator", to: "/arena/risk-calculator", icon: "calculator" },
    ],
  },
  {
    id: "journal",
    label: "Trade Journal",
    to: "/journal",
    icon: "notebook",
    group: "workspace",
    children: [
      { id: "sessions", label: "Session History", to: "/journal/sessions", icon: "history" },
      { id: "decisions", label: "Decision Journal", to: "/journal/decisions", icon: "pen" },
      { id: "replay", label: "Trade Replay", to: "/journal/replay", icon: "replay" },
      { id: "alternatives", label: "Alternative Decisions", to: "/journal/alternatives", icon: "split" },
      { id: "analytics", label: "Performance Analytics", to: "/journal/analytics", icon: "bars" },
    ],
  },
  {
    id: "learn",
    label: "Learn",
    to: "/learn",
    icon: "cap",
    group: "learning",
    children: [
      { id: "paths", label: "Learning Paths", to: "/learn/paths", icon: "route" },
      { id: "lessons", label: "Lessons", to: "/learn/lessons", icon: "book" },
      { id: "concepts", label: "Concept Library", to: "/learn/concepts", icon: "library" },
      { id: "glossary", label: "Glossary", to: "/learn/glossary", icon: "list" },
      { id: "checks", label: "Knowledge Checks", to: "/learn/checks", icon: "quiz" },
    ],
  },
  {
    id: "progress",
    label: "Progress & Achievements",
    to: "/progress",
    icon: "trophy",
    group: "learning",
    children: [
      { id: "skills", label: "Skill Profile", to: "/progress/skills", icon: "radar" },
      { id: "xp", label: "Levels & XP", to: "/progress/xp", icon: "trend" },
      { id: "achievements", label: "Achievements", to: "/progress/achievements", icon: "medal" },
      { id: "streaks", label: "Learning Streaks", to: "/progress/streaks", icon: "flame" },
      { id: "milestones", label: "Milestones", to: "/progress/milestones", icon: "flag" },
    ],
  },
  { id: "pricing", label: "Upgrade to Pro", to: "/pricing", icon: "sparkle", group: "account" },
  {
    id: "settings",
    label: "Settings",
    to: "/settings",
    icon: "gear",
    group: "account",
    children: [
      { id: "profile", label: "Profile", to: "/settings/profile", icon: "user" },
      { id: "preferences", label: "Preferences", to: "/settings/preferences", icon: "globe" },
      { id: "notifications", label: "Notifications", to: "/settings/notifications", icon: "bell" },
      { id: "privacy", label: "Privacy & Security", to: "/settings/privacy", icon: "shield" },
      { id: "billing", label: "Billing", to: "/settings/billing", icon: "card" },
    ],
  },
];

/** Parent routes open their first section. */
export const PARENT_REDIRECTS: Record<string, string> = Object.fromEntries(NAV.filter((n) => n.children).map((n) => [n.to, n.children![0].to]));

/** Pages outside the tree that still belong to a section, for highlighting and breadcrumbs. */
const EXTRA: { prefix: string; item: NavItem["id"]; child?: string }[] = [
  { prefix: "/mission/", item: "missions", child: "all" },
  { prefix: "/play/", item: "missions" },
  { prefix: "/debrief/", item: "missions" },
  { prefix: "/arena/session/", item: "arena", child: "simulator" },
];

export interface NavMatch {
  item: NavItem | null;
  child: NavChild | null;
}

export function resolveNav(path: string): NavMatch {
  for (const e of EXTRA) {
    if (path.startsWith(e.prefix)) {
      const item = NAV.find((n) => n.id === e.item)!;
      return { item, child: item.children?.find((c) => c.id === e.child) ?? null };
    }
  }
  for (const item of NAV) {
    if (path === item.to || path.startsWith(`${item.to}/`)) {
      const child = item.children?.find((c) => path === c.to || path.startsWith(`${c.to}/`)) ?? null;
      return { item, child };
    }
  }
  return { item: null, child: null };
}

/** Mobile bottom navigation: five primary destinations. Profile gathers the rest. */
export const BOTTOM_NAV: { id: string; label: string; to: string; icon: string; covers: NavItem["id"][] }[] = [
  { id: "home", label: "Home", to: "/dashboard", icon: "home", covers: ["dashboard"] },
  { id: "missions", label: "Missions", to: "/missions", icon: "flag", covers: ["missions"] },
  { id: "arena", label: "Arena", to: "/arena", icon: "candles", covers: ["arena"] },
  { id: "learn", label: "Learn", to: "/learn", icon: "cap", covers: ["learn"] },
  { id: "profile", label: "Profile", to: "/profile", icon: "user", covers: ["journal", "progress", "settings", "pricing"] },
];
