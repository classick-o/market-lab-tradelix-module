/**
 * Where a lesson sits in the course: the unit it belongs to (with the unit's introduction on its
 * first lesson), how it connects to what came before, and the lessons it builds on.
 */
import { COURSE_LESSONS, UNIT_INTROS, appLessonFor, courseLessonFor, getCourseLesson, getCourseUnit, type LessonScript } from "@market-lab/academy";
import { Rich } from "../components/Page";
import { Icon, cx } from "../components/ui";
import { Link } from "../router";
import { useLab } from "../store";

const ORDER = new Map(COURSE_LESSONS.map((l, i) => [l.id, i]));

export function LessonContextCard({ lessonId, script }: { lessonId: string; script: LessonScript }) {
  const lab = useLab();
  const cl = courseLessonFor(lessonId);
  const unit = cl ? getCourseUnit(cl.unit) : undefined;
  if (!cl || !unit) return null;
  const index = unit.lessons.findIndex((l) => l.id === cl.id);
  const intro = UNIT_INTROS[unit.id];
  const first = index === 0;
  // Earlier lessons this one builds on (unit prerequisites count as their last lesson).
  const prereqs = cl.prereqs
    .map((id) => getCourseLesson(id) ?? getCourseUnit(id)?.lessons.at(-1))
    .filter((p): p is NonNullable<typeof p> => !!p && (ORDER.get(p.id) ?? 0) < (ORDER.get(cl.id) ?? 0))
    .slice(0, 3);
  const done = (id: string) => {
    const app = appLessonFor(getCourseLesson(id)!);
    const p = app ? lab.lessons[app.id] : undefined;
    return !!(p?.completedAt || p?.testedOutAt);
  };

  return (
    <section className={cx("lp-context", first && intro && "is-unit-start")} aria-label="Where this lesson fits">
      <span className="lp-kicker">
        {first && intro ? "Starting unit" : "Unit"} {unit.id} · {unit.title} · lesson {index + 1} of {unit.lessons.length}
      </span>
      {first && intro && (
        <div className="lp-context-unit">
          <p className="lp-text">
            <Rich text={intro.summary} />
          </p>
          <ul className="ml-list ml-list--check">
            {intro.outcomes.map((o) => (
              <li key={o}>
                <Rich text={o} />
              </li>
            ))}
          </ul>
          {intro.buildsOn && (
            <p className="lp-context-builds">
              <Rich text={intro.buildsOn} />
            </p>
          )}
        </div>
      )}
      {script.bridge && (
        <p className="lp-context-bridge">
          <Rich text={script.bridge} />
        </p>
      )}
      {prereqs.length > 0 && (
        <div className="lp-context-prereqs">
          <span>Builds on</span>
          {prereqs.map((p) => {
            const app = appLessonFor(p);
            const ok = done(p.id);
            const label = (
              <>
                {ok && <Icon name="check" size={12} />} {p.id} {p.title}
              </>
            );
            return app ? (
              <Link key={p.id} to={`/learn/lessons/${app.id}`} className={cx("lp-context-chip", ok && "is-done")}>
                {label}
              </Link>
            ) : (
              <span key={p.id} className="lp-context-chip">
                {label}
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}
