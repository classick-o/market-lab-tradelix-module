import { arenaScene } from "./arena";
import type { RoomSceneBuilder } from "./common";
import { duelsScene } from "./duels";
import { journalScene } from "./journal";
import { learnScene } from "./learn";
import { missionsScene } from "./missions";
import { progressScene } from "./progress";

export type { RoomScene, RoomSceneBuilder } from "./common";

export type RoomId = "learn" | "missions" | "arena" | "duels" | "journal" | "progress";

/** Loaded on demand with GSAP, after the rooms section comes near the screen. */
export const ROOM_SCENES: Record<RoomId, RoomSceneBuilder> = {
  learn: learnScene,
  missions: missionsScene,
  arena: arenaScene,
  duels: duelsScene,
  journal: journalScene,
  progress: progressScene,
};
