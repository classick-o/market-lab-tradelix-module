import type { Concept, GlossaryTerm, LessonScript } from "../../types";
import { CONCEPTS_U1, SCRIPTS_U1, TERMS_U1 } from "./u1";
import { CONCEPTS_U2, SCRIPTS_U2, TERMS_U2 } from "./u2";
import { CONCEPTS_U3, SCRIPTS_U3, TERMS_U3 } from "./u3";
import { CONCEPTS_U4, SCRIPTS_U4, TERMS_U4 } from "./u4";
import { CONCEPTS_U5, SCRIPTS_U5, TERMS_U5 } from "./u5";

/** Interactive lesson scripts by lesson id. */
export const SCRIPTS: Record<string, LessonScript> = { ...SCRIPTS_U1, ...SCRIPTS_U2, ...SCRIPTS_U3, ...SCRIPTS_U4, ...SCRIPTS_U5 };
export const SCRIPT_TERMS: GlossaryTerm[] = [...TERMS_U1, ...TERMS_U2, ...TERMS_U3, ...TERMS_U4, ...TERMS_U5];
export const SCRIPT_CONCEPTS: Concept[] = [...CONCEPTS_U1, ...CONCEPTS_U2, ...CONCEPTS_U3, ...CONCEPTS_U4, ...CONCEPTS_U5];
