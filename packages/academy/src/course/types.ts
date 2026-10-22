/** The course map (docs/learn/course): levels → units → lessons. Ids are course positions, e.g. "1.2.3". */
export interface CourseLesson {
  id: string;
  unit: string;
  title: string;
  /** The lesson's id from before the course map (e.g. "L09"), when it existed. */
  legacy?: string;
  stage: "beginner" | "intermediate" | "advanced" | "professional";
  minutes: number;
  /** Core lessons are on every path; track and elective lessons belong to a specialisation. */
  kind: "core" | "track" | "elective";
  /** The specialisations a track or elective lesson belongs to. */
  tracks?: string[];
  objectives: string[];
  concepts: string[];
  /** Lesson or unit ids this lesson builds on. */
  prereqs: string[];
  /** Glossary terms the lesson introduces. */
  terms: string[];
}

export interface CourseUnit {
  id: string;
  level: number;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseLevel {
  id: number;
  name: string;
  tagline: string;
  units: CourseUnit[];
}
