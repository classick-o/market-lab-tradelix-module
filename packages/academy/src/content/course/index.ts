import type { Concept, GlossaryTerm, Lesson, Question, UnitContent } from "../../types";
import { UNIT_0_1 } from "./u0-1";
import { UNIT_0_2 } from "./u0-2";
import { UNIT_1_1 } from "./u1-1";
import { UNIT_1_2 } from "./u1-2";
import { UNIT_1_3 } from "./u1-3";
import { UNIT_1_4 } from "./u1-4";
import { UNIT_1_5 } from "./u1-5";
import { UNIT_1_6 } from "./u1-6";
import { UNIT_1_7 } from "./u1-7";
import { UNIT_1_8 } from "./u1-8";
import { UNIT_2_1 } from "./u2-1";
import { UNIT_2_2 } from "./u2-2";
import { UNIT_2_3 } from "./u2-3";
import { UNIT_2_4 } from "./u2-4";
import { UNIT_2_5 } from "./u2-5";
import { UNIT_2_6 } from "./u2-6";
import { UNIT_2_7 } from "./u2-7";
import { UNIT_2_8 } from "./u2-8";
import { UNIT_2_9 } from "./u2-9";
import { UNIT_2_10 } from "./u2-10";
import { UNIT_2_11 } from "./u2-11";
import { UNIT_2_12 } from "./u2-12";
import { UNIT_2_13 } from "./u2-13";
import { UNIT_2_14 } from "./u2-14";
import { UNIT_3_1 } from "./u3-1";
import { UNIT_3_2 } from "./u3-2";
import { UNIT_3_3 } from "./u3-3";
import { UNIT_3_4 } from "./u3-4";
import { UNIT_3_5 } from "./u3-5";
import { UNIT_3_6 } from "./u3-6";
import { UNIT_3_7 } from "./u3-7";
import { UNIT_3_8 } from "./u3-8";
import { UNIT_3_9 } from "./u3-9";
import { UNIT_3_10 } from "./u3-10";
import { UNIT_3_11 } from "./u3-11";
import { UNIT_3_12 } from "./u3-12";
import { UNIT_3_13 } from "./u3-13";
import { UNIT_3_14 } from "./u3-14";
import { UNIT_4_1 } from "./u4-1";
import { UNIT_4_2 } from "./u4-2";
import { UNIT_4_3 } from "./u4-3";
import { UNIT_4_4 } from "./u4-4";
import { UNIT_4_5 } from "./u4-5";
import { UNIT_4_6 } from "./u4-6";

/** Course content written directly in code, by unit (docs/learn/AUTHORING.md). */
export const COURSE_UNITS_CONTENT: Record<string, UnitContent> = {
  "0.1": UNIT_0_1,
  "0.2": UNIT_0_2,
  "1.1": UNIT_1_1,
  "1.2": UNIT_1_2,
  "1.3": UNIT_1_3,
  "1.4": UNIT_1_4,
  "1.5": UNIT_1_5,
  "1.6": UNIT_1_6,
  "1.7": UNIT_1_7,
  "1.8": UNIT_1_8,
  "2.1": UNIT_2_1,
  "2.2": UNIT_2_2,
  "2.3": UNIT_2_3,
  "2.4": UNIT_2_4,
  "2.5": UNIT_2_5,
  "2.6": UNIT_2_6,
  "2.7": UNIT_2_7,
  "2.8": UNIT_2_8,
  "2.9": UNIT_2_9,
  "2.10": UNIT_2_10,
  "2.11": UNIT_2_11,
  "2.12": UNIT_2_12,
  "2.13": UNIT_2_13,
  "2.14": UNIT_2_14,
  "3.1": UNIT_3_1,
  "3.2": UNIT_3_2,
  "3.3": UNIT_3_3,
  "3.4": UNIT_3_4,
  "3.5": UNIT_3_5,
  "3.6": UNIT_3_6,
  "3.7": UNIT_3_7,
  "3.8": UNIT_3_8,
  "3.9": UNIT_3_9,
  "3.10": UNIT_3_10,
  "3.11": UNIT_3_11,
  "3.12": UNIT_3_12,
  "3.13": UNIT_3_13,
  "3.14": UNIT_3_14,
  "4.1": UNIT_4_1,
  "4.2": UNIT_4_2,
  "4.3": UNIT_4_3,
  "4.4": UNIT_4_4,
  "4.5": UNIT_4_5,
  "4.6": UNIT_4_6,
};

const all = Object.values(COURSE_UNITS_CONTENT);
export const COURSE_CONTENT_LESSONS: Lesson[] = all.flatMap((u) => u.lessons);
export const COURSE_CONTENT_QUESTIONS: Question[] = all.flatMap((u) => u.questions);
export const COURSE_CONTENT_TERMS: GlossaryTerm[] = all.flatMap((u) => u.terms);
export const COURSE_CONTENT_CONCEPTS: Concept[] = all.flatMap((u) => u.concepts);
