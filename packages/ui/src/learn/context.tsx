/**
 * What a lesson screen can tell the player: that its interaction is done (Continue unlocks), which
 * keys it handles, and evidence of what the learner knows. In Read mode the same screens render
 * inline, with no keyboard registry and Continue always open.
 */
import { createContext, useContext, useEffect, useRef } from "react";
import type { ConceptEvidence } from "@market-lab/academy";

export type KeyHandler = () => boolean | void;
export type KeyMap = Partial<Record<string, KeyHandler>>;

export interface ScreenApi {
  /** "player": one screen at a time; "read": the whole lesson on one page. */
  mode: "player" | "read";
  /** The screen was already completed (revisited, or the lesson is done). */
  done: boolean;
  /** Unlocks Continue. */
  complete: () => void;
  /** Concept evidence for mastery; the player adds the time. */
  evidence: (concept: string | undefined, score: number, source?: ConceptEvidence["source"]) => void;
  /** Stable seed for shuffles, so a screen looks the same when revisited. */
  seed: number;
  lessonId: string;
}

const noop = () => {};
export const ScreenContext = createContext<ScreenApi>({ mode: "read", done: true, complete: noop, evidence: noop, seed: 1, lessonId: "" });
export const useScreen = () => useContext(ScreenContext);

/** Keys registered by the active screen and its parts; the player asks them before its own. */
export class KeyRegistry {
  private maps = new Set<{ current: KeyMap }>();
  add(ref: { current: KeyMap }) {
    this.maps.add(ref);
    return () => {
      this.maps.delete(ref);
    };
  }
  /** Runs the newest handler for `key` that uses it; true when one did. */
  dispatch(key: string): boolean {
    for (const ref of [...this.maps].reverse()) {
      const h = ref.current[key];
      if (h && h() !== false) return true;
    }
    return false;
  }
}
export const KeysContext = createContext<KeyRegistry | null>(null);

/**
 * Registers keys while the component is mounted. A handler returns false when it has nothing to do
 * (e.g. a figure on its last step), so the key falls through: Enter then means Continue.
 */
export function useKeys(map: KeyMap) {
  const reg = useContext(KeysContext);
  const latest = useRef(map);
  latest.current = map;
  useEffect(() => (reg ? reg.add(latest) : undefined), [reg]);
}

/** A small deterministic shuffle (seeded), so the order doesn't jump between renders. */
export function seededShuffle<T>(xs: readonly T[], seed: number): T[] {
  let a = seed >>> 0 || 1;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
