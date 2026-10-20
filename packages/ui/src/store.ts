import { createContext, useContext, useSyncExternalStore } from "react";
import { DAILY_XP, WEEKLY_XP, dayKey, getCheck, type TopicId } from "@market-lab/academy";
import type { LogEntry } from "@market-lab/engine";
import { riskDisciplineScore, type SkillId } from "@market-lab/evaluation";
import {
  applyEvidence,
  initialSkills,
  missionXp,
  XP_RULES,
  type Evidence,
  type HistoryItem,
  type SelfLevel,
  type SkillState,
} from "@market-lab/learning";
import {
  PLACEMENT,
  arenaContext,
  evaluateArena,
  evaluateMission,
  getMission,
  type LoggedAnswer,
} from "@market-lab/missions";
import type { ArenaRegime } from "@market-lab/scenario-gen";

export interface MissionSession {
  id: string;
  kind: "mission";
  missionId: string;
  missionVersion: number;
  variantIdx: number;
  log: LoggedAnswer[];
  status: "active" | "completed" | "abandoned";
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface ArenaSession {
  id: string;
  kind: "arena";
  regime: ArenaRegime;
  seed: number;
  cursor: number;
  log: LogEntry[];
  status: "active" | "completed";
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export type Session = MissionSession | ArenaSession;

export interface SkillDelta {
  skill: SkillId;
  before: number;
  after: number;
}

export interface StoredResult {
  sessionId: string;
  kind: "mission" | "arena";
  missionId: string;
  dqs: number | null;
  /** Risk Discipline Score. Missing on results saved before it existed; computed on demand then. */
  rds?: number | null;
  errorTags: string[];
  net: number;
  returnPct: number;
  xp: number;
  skillDeltas: SkillDelta[];
  completedAt: number;
  /** Arena only. */
  trades?: number;
  completionMet?: boolean;
}

export interface ObservedBehavior {
  at: number;
  skill: SkillId;
  label: string;
  score: number;
  sessionId: string;
  missionId: string;
}

/** Optional notes attached to one decision (an Arena order or a mission checkpoint). */
export interface DecisionNote {
  rationale?: string;
  exitPlan?: string;
  emotion?: string;
  lesson?: string;
  at: number;
}

export interface CheckAttempt {
  at: number;
  correct: number;
  total: number;
  passed: boolean;
  answers: Record<string, string>;
}

export interface PlanState {
  tier: "free" | "pro";
  billing: "monthly" | "annual" | null;
  status: "active" | "canceled";
  since: number | null;
  /** Renewal (or, once canceled, end-of-access) date. */
  renewsAt: number | null;
  history: { id: string; at: number; description: string; amount: number }[];
}

export interface Settings {
  speed: number;
  reducedMotion: "system" | "on" | "off";
  accent?: string;
  theme: "black" | "charcoal" | "navy";
  language: "en";
  /** IANA time zone, or "auto" for the device's. */
  timeZone: string;
  chart: { volume: boolean; grid: boolean; sma20: boolean; sma50: boolean; timeframe: "1h" | "4h" };
  notifications: { reminders: boolean; reminderTime: string; missionUpdates: boolean; milestones: boolean; subscription: boolean };
  privacy: { analytics: boolean; personalization: boolean };
  sidebarCollapsed: boolean;
  progressCollapsed: boolean;
  /** Bumped when the default palette changes, so saved settings can migrate once. */
  paletteVersion?: number;
}

export interface LabData {
  version: 1;
  createdAt: number;
  profile: {
    selfLevel: SelfLevel | null;
    onboarded: boolean;
    placementSkipped: boolean;
    placementAnswers: Record<string, string>;
    displayName: string;
    avatar: string;
    goals: { dailyXp: number; weeklyDays: number; focus: TopicId[] };
  };
  skills: Record<SkillId, SkillState>;
  sessions: Record<string, Session>;
  results: Record<string, StoredResult>;
  reflections: Record<string, { optionId?: string; text: string; at: number }>;
  notes: Record<string, { text: string; at: number }>;
  decisionNotes: Record<string, DecisionNote>;
  xp: { id: string; amount: number; reason: string; ref?: string; at: number }[];
  observed: ObservedBehavior[];
  replaysViewed: Record<string, true>;
  lessons: Record<string, { startedAt: number; completedAt?: number }>;
  checks: Record<string, CheckAttempt[]>;
  dailies: Record<string, { at: number; correct: number; total: number; answers: Record<string, string> }>;
  weeklies: Record<string, { at: number }>;
  plan: PlanState;
  seenAchievements: string[];
  signedOut: boolean;
  settings: Settings;
}

const DATA_VERSION = 1;
const PALETTE_VERSION = 3;

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function defaultSettings(): Settings {
  return {
    speed: 6,
    reducedMotion: "system",
    accent: "electric",
    theme: "black",
    language: "en",
    timeZone: "auto",
    chart: { volume: true, grid: true, sma20: false, sma50: false, timeframe: "1h" },
    notifications: { reminders: true, reminderTime: "19:00", missionUpdates: true, milestones: true, subscription: true },
    privacy: { analytics: false, personalization: true },
    sidebarCollapsed: false,
    progressCollapsed: false,
    paletteVersion: PALETTE_VERSION,
  };
}

function fresh(): LabData {
  return {
    version: DATA_VERSION,
    createdAt: Date.now(),
    profile: {
      selfLevel: null,
      onboarded: false,
      placementSkipped: false,
      placementAnswers: {},
      displayName: "",
      avatar: "slate",
      goals: { dailyXp: 50, weeklyDays: 4, focus: [] },
    },
    skills: initialSkills("unsure"),
    sessions: {},
    results: {},
    reflections: {},
    notes: {},
    decisionNotes: {},
    xp: [],
    observed: [],
    replaysViewed: {},
    lessons: {},
    checks: {},
    dailies: {},
    weeklies: {},
    plan: { tier: "free", billing: null, status: "active", since: null, renewsAt: null, history: [] },
    seenAchievements: [],
    signedOut: false,
    settings: defaultSettings(),
  };
}

/** Fills in fields added after the data was first saved. Nested objects are merged one level deep. */
function migrate(saved: Partial<LabData>): LabData {
  const f = fresh();
  const s = { ...f.settings, ...saved.settings } as Settings;
  const settings: Settings = {
    ...s,
    chart: { ...f.settings.chart, ...saved.settings?.chart },
    notifications: { ...f.settings.notifications, ...saved.settings?.notifications },
    privacy: { ...f.settings.privacy, ...saved.settings?.privacy },
  };
  if ((saved.settings?.paletteVersion ?? 1) < PALETTE_VERSION) {
    // The palette changed (monochrome → navy + lime → the black + Electric app design); move saved settings along once.
    settings.accent = "electric";
    settings.theme = "black";
    settings.paletteVersion = PALETTE_VERSION;
  }
  return {
    ...f,
    ...saved,
    profile: { ...f.profile, ...saved.profile, goals: { ...f.profile.goals, ...saved.profile?.goals } },
    plan: { ...f.plan, ...saved.plan },
    // Data saved before achievements existed adopts what is already earned without a burst of toasts.
    seenAchievements: saved.seenAchievements ?? ["*init"],
    settings,
  } as LabData;
}

function load(key: string): LabData | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<LabData>;
    return data.version === DATA_VERSION ? migrate(data) : null;
  } catch {
    return null;
  }
}

function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const MONTH = 30 * 24 * 60 * 60 * 1000;
const YEAR = 365 * 24 * 60 * 60 * 1000;
export const PRICES = { monthly: 1200, annual: 9600 } as const;

export class LabStore {
  private data: LabData;
  private listeners = new Set<() => void>();
  /** Set when the browser refused to save (private mode, quota, blocked storage). */
  storageError = false;

  constructor(private readonly key: string) {
    this.data = load(key) ?? fresh();
  }

  getSnapshot = (): LabData => this.data;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private commit(next: LabData): void {
    this.data = next;
    try {
      window.localStorage.setItem(this.key, JSON.stringify(next));
      this.storageError = false;
    } catch {
      this.storageError = true;
    }
    this.listeners.forEach((l) => l());
  }

  private update(fn: (d: LabData) => LabData): void {
    const next = fn(this.data);
    if (next !== this.data) this.commit(next);
  }

  private withEvidence(d: LabData, evidence: Evidence[], at: number): { skills: Record<SkillId, SkillState>; deltas: SkillDelta[] } {
    const skills = { ...d.skills };
    const before = new Map<SkillId, number>();
    for (const ev of evidence) {
      if (!before.has(ev.skill)) before.set(ev.skill, skills[ev.skill].theta);
      skills[ev.skill] = applyEvidence(skills[ev.skill], ev, at);
    }
    return { skills, deltas: [...before.entries()].map(([skill, b]) => ({ skill, before: b, after: skills[skill].theta })) };
  }

  private xpEntry(amount: number, reason: string, ref?: string, at = Date.now()) {
    return { id: uid(), amount, reason, ref, at };
  }

  // ─── Onboarding & account ────────────────────────────────────────────────

  setSelfLevel(level: SelfLevel): void {
    this.update((d) => ({ ...d, profile: { ...d.profile, selfLevel: level, placementAnswers: {} }, skills: initialSkills(level) }));
  }

  answerPlacement(itemId: string, optionId: string): void {
    const item = PLACEMENT.find((p) => p.id === itemId);
    if (!item) return;
    this.update((d) => {
      if (d.profile.placementAnswers[itemId]) return d;
      const at = Date.now();
      const { skills } = this.withEvidence(
        d,
        [{ skill: item.skill, performance: optionId === item.correct ? 1 : 0, difficulty: item.difficulty, weight: 0.5 }],
        at,
      );
      return { ...d, skills, profile: { ...d.profile, placementAnswers: { ...d.profile.placementAnswers, [itemId]: optionId } } };
    });
  }

  finishOnboarding(skipped: boolean): void {
    this.update((d) => ({
      ...d,
      signedOut: false,
      profile: { ...d.profile, onboarded: true, placementSkipped: skipped },
      xp: skipped || d.xp.some((x) => x.reason === "placement") ? d.xp : [...d.xp, this.xpEntry(XP_RULES.placement, "placement")],
    }));
  }

  /** Lets the user retake the initial assessment; earlier answers are kept as history in the skill estimates. */
  restartPlacement(): void {
    this.update((d) => ({ ...d, profile: { ...d.profile, placementAnswers: {} } }));
  }

  setProfile(patch: Partial<Pick<LabData["profile"], "displayName" | "avatar" | "selfLevel">>): void {
    this.update((d) => ({ ...d, profile: { ...d.profile, ...patch } }));
  }

  setGoals(patch: Partial<LabData["profile"]["goals"]>): void {
    this.update((d) => ({ ...d, profile: { ...d.profile, goals: { ...d.profile.goals, ...patch } } }));
  }

  signOut(): void {
    this.update((d) => ({ ...d, signedOut: true }));
  }

  signIn(): void {
    this.update((d) => ({ ...d, signedOut: false }));
  }

  // ─── Missions ────────────────────────────────────────────────────────────

  activeSessionFor(missionId: string): MissionSession | null {
    return (
      (Object.values(this.data.sessions).find((s) => s.kind === "mission" && s.missionId === missionId && s.status === "active") as
        | MissionSession
        | undefined) ?? null
    );
  }

  startMission(missionId: string, opts: { fresh?: boolean } = {}): string {
    const existing = this.activeSessionFor(missionId);
    if (existing && !opts.fresh) return existing.id;
    const m = getMission(missionId);
    const attempts = Object.values(this.data.sessions).filter((s) => s.kind === "mission" && s.missionId === missionId).length;
    const now = Date.now();
    const session: MissionSession = {
      id: uid(),
      kind: "mission",
      missionId,
      missionVersion: m.version,
      variantIdx: attempts % m.variants.length,
      log: [],
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    this.update((d) => {
      const sessions = { ...d.sessions };
      if (existing) sessions[existing.id] = { ...existing, status: "abandoned", updatedAt: now };
      sessions[session.id] = session;
      return { ...d, sessions };
    });
    return session.id;
  }

  answer(sessionId: string, entry: LoggedAnswer): void {
    this.update((d) => {
      const s = d.sessions[sessionId];
      if (!s || s.kind !== "mission" || s.status !== "active") return d;
      return { ...d, sessions: { ...d.sessions, [sessionId]: { ...s, log: [...s.log, entry], updatedAt: Date.now() } } };
    });
  }

  completeMission(sessionId: string): void {
    const s = this.data.sessions[sessionId];
    if (!s || s.kind !== "mission" || s.status !== "active") return;
    const m = getMission(s.missionId);
    const result = evaluateMission(m, s.variantIdx, s.log);
    const at = Date.now();
    this.update((d) => {
      const { skills, deltas } = this.withEvidence(d, result.evidence, at);
      const today = startOfDay(at);
      const attemptsToday = Object.values(d.results).filter((r) => r.missionId === m.id && r.completedAt >= today).length;
      const xp = missionXp(m.difficulty, attemptsToday);
      const observed: ObservedBehavior[] = result.dqs.criteria
        .filter((c) => c.applicable)
        .map((c) => ({ at, skill: c.skill, label: c.label, score: c.score, sessionId, missionId: m.id }));
      return {
        ...d,
        skills,
        sessions: { ...d.sessions, [sessionId]: { ...s, status: "completed", completedAt: at, updatedAt: at } },
        results: {
          ...d.results,
          [sessionId]: {
            sessionId,
            kind: "mission",
            missionId: m.id,
            dqs: result.dqs.dqs,
            rds: riskDisciplineScore(result.dqs.criteria),
            errorTags: result.dqs.errorTags,
            net: result.outcome.net,
            returnPct: result.outcome.returnPct,
            xp,
            skillDeltas: deltas,
            completedAt: at,
          },
        },
        xp: xp > 0 ? [...d.xp, this.xpEntry(xp, "mission", sessionId, at)] : d.xp,
        observed: [...d.observed, ...observed].slice(-400),
      };
    });
  }

  abandon(sessionId: string): void {
    this.update((d) => {
      const s = d.sessions[sessionId];
      if (!s || s.status !== "active") return d;
      return { ...d, sessions: { ...d.sessions, [sessionId]: { ...s, status: "abandoned", updatedAt: Date.now() } as Session } };
    });
  }

  saveReflection(sessionId: string, optionId: string | undefined, text: string): void {
    const at = Date.now();
    this.update((d) => {
      const first = !d.reflections[sessionId];
      const next: LabData = { ...d, reflections: { ...d.reflections, [sessionId]: { optionId, text: text.slice(0, 1000), at } } };
      if (!first) return next;
      const { skills } = this.withEvidence(d, [{ skill: "reflection_review", performance: 1, difficulty: 2, weight: 0.5 }], at);
      return { ...next, skills, xp: [...d.xp, this.xpEntry(XP_RULES.reflection, "reflection", sessionId, at)] };
    });
  }

  markReplayViewed(sessionId: string): void {
    if (this.data.replaysViewed[sessionId]) return;
    const at = Date.now();
    this.update((d) => {
      const { skills } = this.withEvidence(d, [{ skill: "reflection_review", performance: 1, difficulty: 2, weight: 0.3 }], at);
      return {
        ...d,
        skills,
        replaysViewed: { ...d.replaysViewed, [sessionId]: true },
        xp: [...d.xp, this.xpEntry(XP_RULES.replay, "replay", sessionId, at)],
      };
    });
  }

  saveNote(sessionId: string, text: string): void {
    this.update((d) => ({ ...d, notes: { ...d.notes, [sessionId]: { text: text.slice(0, 2000), at: Date.now() } } }));
  }

  saveDecisionNote(key: string, patch: Omit<DecisionNote, "at">): void {
    this.update((d) => {
      const merged = { ...d.decisionNotes[key], ...patch, at: Date.now() };
      return { ...d, decisionNotes: { ...d.decisionNotes, [key]: merged } };
    });
  }

  // ─── Arena ───────────────────────────────────────────────────────────────

  /** Arena sessions started today (the Free plan has a daily limit). */
  arenaSessionsToday(now = Date.now()): number {
    const today = startOfDay(now);
    return Object.values(this.data.sessions).filter((s) => s.kind === "arena" && s.createdAt >= today).length;
  }

  activeArena(): ArenaSession | null {
    return (
      (Object.values(this.data.sessions)
        .filter((s) => s.kind === "arena" && s.status === "active")
        .sort((a, b) => b.updatedAt - a.updatedAt)[0] as ArenaSession | undefined) ?? null
    );
  }

  startArena(regime: ArenaRegime): string {
    const now = Date.now();
    const session: ArenaSession = {
      id: uid(),
      kind: "arena",
      regime,
      seed: Math.floor(Math.random() * 2 ** 31),
      cursor: 59,
      log: [],
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    this.update((d) => ({ ...d, sessions: { ...d.sessions, [session.id]: session } }));
    return session.id;
  }

  saveArena(sessionId: string, cursor: number, log: LogEntry[]): void {
    this.update((d) => {
      const s = d.sessions[sessionId];
      if (!s || s.kind !== "arena" || s.status !== "active") return d;
      return { ...d, sessions: { ...d.sessions, [sessionId]: { ...s, cursor, log, updatedAt: Date.now() } } };
    });
  }

  finishArena(sessionId: string, cursor: number, log: LogEntry[]): void {
    const s = this.data.sessions[sessionId];
    if (!s || s.kind !== "arena" || s.status !== "active") return;
    const { ctx, scenario } = arenaContext(s.regime, s.seed);
    const fullLog: LogEntry[] = [...log, { kind: "advance", to: cursor }, { kind: "finish" }];
    const r = evaluateArena(ctx, fullLog, scenario);
    const at = Date.now();
    this.update((d) => {
      const { skills, deltas } = this.withEvidence(d, r.evidence, at);
      const xp = r.barsPlayed >= 30 ? XP_RULES.arenaSession : 0;
      return {
        ...d,
        skills,
        sessions: { ...d.sessions, [sessionId]: { ...s, cursor, log: fullLog, status: "completed", completedAt: at, updatedAt: at } },
        results: {
          ...d.results,
          [sessionId]: {
            sessionId,
            kind: "arena",
            missionId: "ARENA",
            dqs: r.dqs.dqs,
            rds: r.rds,
            errorTags: r.dqs.errorTags,
            net: r.net,
            returnPct: r.returnPct,
            xp,
            skillDeltas: deltas,
            completedAt: at,
            trades: r.trades,
            completionMet: r.completion.met,
          },
        },
        xp: xp > 0 ? [...d.xp, this.xpEntry(xp, "arena", sessionId, at)] : d.xp,
      };
    });
  }

  // ─── Learn ───────────────────────────────────────────────────────────────

  startLesson(id: string): void {
    if (this.data.lessons[id]) return;
    this.update((d) => ({ ...d, lessons: { ...d.lessons, [id]: { startedAt: Date.now() } } }));
  }

  completeLesson(id: string): void {
    if (this.data.lessons[id]?.completedAt) return;
    const at = Date.now();
    this.update((d) => ({
      ...d,
      lessons: { ...d.lessons, [id]: { startedAt: d.lessons[id]?.startedAt ?? at, completedAt: at } },
      xp: [...d.xp, this.xpEntry(XP_RULES.lesson, "lesson", id, at)],
    }));
  }

  /**
   * Records a knowledge check or assessment. XP only for the first pass; skill evidence only for
   * the first attempt of the day, so retrying a quiz can't inflate a skill estimate.
   */
  submitCheck(checkId: string, answers: Record<string, string>, correct: number, total: number, skill: SkillId): { passed: boolean; firstPass: boolean } {
    const check = getCheck(checkId);
    const at = Date.now();
    const pct = total ? (correct / total) * 100 : 0;
    const passed = pct >= (check?.passPct ?? 60);
    const attempts = this.data.checks[checkId] ?? [];
    const firstPass = passed && !attempts.some((a) => a.passed);
    const firstToday = !attempts.some((a) => a.at >= startOfDay(at));
    this.update((d) => {
      const { skills } = firstToday
        ? this.withEvidence(d, [{ skill, performance: total ? correct / total : 0, difficulty: check?.kind === "assessment" ? 3 : 2, weight: check?.kind === "assessment" ? 0.5 : 0.3 }], at)
        : { skills: d.skills };
      const xp = firstPass ? [...d.xp, this.xpEntry(check?.kind === "assessment" ? XP_RULES.assessmentPass : XP_RULES.checkPass, check?.kind === "assessment" ? "assessment" : "check", checkId, at)] : d.xp;
      return { ...d, skills, xp, checks: { ...d.checks, [checkId]: [...attempts, { at, correct, total, passed, answers }] } };
    });
    return { passed, firstPass };
  }

  completeDaily(day: string, answers: Record<string, string>, correct: number, total: number): number {
    if (this.data.dailies[day]) return 0;
    const at = Date.now();
    const amount = correct * DAILY_XP.perCorrect + DAILY_XP.completion;
    this.update((d) => ({
      ...d,
      dailies: { ...d.dailies, [day]: { at, correct, total, answers } },
      xp: [...d.xp, this.xpEntry(amount, "daily", day, at)],
    }));
    return amount;
  }

  claimWeekly(week: string): void {
    if (this.data.weeklies[week]) return;
    const at = Date.now();
    this.update((d) => ({ ...d, weeklies: { ...d.weeklies, [week]: { at } }, xp: [...d.xp, this.xpEntry(WEEKLY_XP, "weekly", week, at)] }));
  }

  markAchievementsSeen(ids: string[]): void {
    const seen = new Set(this.data.seenAchievements);
    if (!seen.has("*init") && ids.every((id) => seen.has(id))) return;
    this.update((d) => ({ ...d, seenAchievements: [...new Set([...d.seenAchievements.filter((x) => x !== "*init"), ...ids])] }));
  }

  // ─── Plan (demo billing; inside Tradelix the host owns subscriptions) ──────

  upgrade(billing: "monthly" | "annual"): void {
    const at = Date.now();
    this.update((d) => ({
      ...d,
      plan: {
        tier: "pro",
        billing,
        status: "active",
        since: d.plan.tier === "pro" ? d.plan.since : at,
        renewsAt: at + (billing === "annual" ? YEAR : MONTH),
        history: [
          { id: uid(), at, description: `Pro ${billing === "annual" ? "annual" : "monthly"} (demo, no payment taken)`, amount: PRICES[billing] },
          ...d.plan.history,
        ],
      },
    }));
  }

  cancelPlan(): void {
    this.update((d) => (d.plan.tier === "pro" ? { ...d, plan: { ...d.plan, status: "canceled" } } : d));
  }

  resumePlan(): void {
    this.update((d) => (d.plan.tier === "pro" ? { ...d, plan: { ...d.plan, status: "active" } } : d));
  }

  downgrade(): void {
    this.update((d) => ({ ...d, plan: { ...d.plan, tier: "free", billing: null, status: "active", renewsAt: null } }));
  }

  // ─── Settings ────────────────────────────────────────────────────────────

  setSettings(patch: Partial<Settings>): void {
    this.update((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  }

  setChart(patch: Partial<Settings["chart"]>): void {
    this.update((d) => ({ ...d, settings: { ...d.settings, chart: { ...d.settings.chart, ...patch } } }));
  }

  setNotifications(patch: Partial<Settings["notifications"]>): void {
    this.update((d) => ({ ...d, settings: { ...d.settings, notifications: { ...d.settings.notifications, ...patch } } }));
  }

  setPrivacy(patch: Partial<Settings["privacy"]>): void {
    this.update((d) => ({ ...d, settings: { ...d.settings, privacy: { ...d.settings.privacy, ...patch } } }));
  }

  reset(): void {
    this.commit(fresh());
  }

  exportJson(): string {
    return JSON.stringify(this.data, null, 2);
  }
}

export function missionHistory(d: LabData): HistoryItem[] {
  return Object.values(d.results)
    .filter((r) => r.kind === "mission")
    .map((r) => ({ missionId: r.missionId, sessionId: r.sessionId, dqs: r.dqs, completedAt: r.completedAt, errorTags: r.errorTags }));
}

export function totalXp(d: LabData): number {
  return d.xp.reduce((s, x) => s + x.amount, 0);
}

export function xpOnDay(d: LabData, day: string, tz?: string): number {
  return d.xp.filter((x) => dayKey(x.at, tz) === day).reduce((s, x) => s + x.amount, 0);
}

export const StoreContext = createContext<LabStore | null>(null);

export function useStore(): LabStore {
  const s = useContext(StoreContext);
  if (!s) throw new Error("useStore must be used inside <MarketLab>.");
  return s;
}

export function useLab(): LabData {
  const store = useStore();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
