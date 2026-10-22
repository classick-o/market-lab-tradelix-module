import type { SceneId } from "@market-lab/academy";
import { auctionIntro } from "./auction-intro";
import type { SceneBuilder } from "./core";

export type { SceneHandle, SceneOptions } from "./core";

/** Every scene the content can name. Loaded on demand, so GSAP stays out of the main bundle. */
export const SCENES: Record<SceneId, SceneBuilder> = {
  "auction-intro": auctionIntro,
};
