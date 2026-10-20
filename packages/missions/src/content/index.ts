import type { MissionDef } from "../schema";
import { M01 } from "./m01";
import { M02 } from "./m02";
import { M04 } from "./m04";
import { M05 } from "./m05";
import { M06 } from "./m06";
import { M07 } from "./m07";
import { M10 } from "./m10";

export const MISSIONS: MissionDef[] = [M01, M02, M04, M05, M06, M07, M10];

/** Default learning path for new users. */
export const LEARNING_PATH = ["M01", "M02", "M04", "M05", "M06", "M07", "M10"];

export function getMission(id: string): MissionDef {
  const m = MISSIONS.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown mission "${id}".`);
  return m;
}

export { M01, M02, M04, M05, M06, M07, M10 };
