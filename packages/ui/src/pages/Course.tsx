/**
 * Course (PLAN_LEARN §7.1): where the course starts and continues. The next step, today's review,
 * the course map (levels → units → lessons) and concept mastery. A unit opens as a panel over the map.
 */
import { useMemo, useState } from "react";
import {
  CONCEPTS,
  COURSE_LEVELS,
  MASTERY_LABEL,
  QUESTIONS,
  TOPICS,
  appLessonFor,
  courseLessonFor,
  dueReviews,
  getCourseLesson,
  getCourseUnit,
  masteryByConcept,
  nextLearnStep,
  unitCheckpoint,
  unitProgress,
  type CourseLesson,
  type CourseUnit,
  type MasteryLevel,
} from "@market-lab/academy";
import { Dialog, Icon, cx } from "../components/ui";
import { formatDayKey } from "../format";
import { useProgress } from "../progress";
import { Link, useRouter } from "../router";
import { useLab, type LabData } from "../store";

type NodeState = "planned" | "todo" | "started" | "done" | "strong";

function lessonState(cl: CourseLesson, lab: LabData): NodeState {
  const app = appLessonFor(cl);
  if (!app) return "planned";
  const p = lab.lessons[app.id];
  if (p?.completedAt || p?.testedOutAt) return p.quality === "strong" ? "strong" : "done";
  return p?.startedAt ? "started" : "todo";
}

const STATE_LABEL: Record<NodeState, string> = { planned: "In preparation", todo: "Not started", started: "In progress", done: "Complete", strong: "Complete · Strong" };

function Ring({ value, total, size = 64, label }: { value: number; total: number; size?: number; label: string }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const pct = total ? value / total : 0;
  return (
    <div className="ml-course-ring" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${value} of ${total}`}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className="ml-course-ring-track" />
        <circle cx={size / 2} cy={size / 2} r={r} className="ml-course-ring-fill" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <span className="num">{value}</span>
    </div>
  );
}

function LessonDots({ unit, lab }: { unit: CourseUnit; lab: LabData }) {
  return (
    <span className="ml-course-dots" aria-hidden="true">
      {unit.lessons.map((l) => (
        <span key={l.id} className={cx("ml-course-dot", `is-${lessonState(l, lab)}`)} />
      ))}
    </span>
  );
}

function UnitPanel({ unit, lab, onClose }: { unit: CourseUnit; lab: LabData; onClose: () => void }) {
  const pr = unitProgress(unit, lab.lessons);
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Dialog open onClose={onClose} title={`${unit.id} · ${unit.title}`} variant="sheet" description={`${unit.lessons.length} lessons · ${pr.playable} ready · ${pr.done} done`}>
      <ol className="ml-unit-lessons">
        {unit.lessons.map((cl) => {
          const app = appLessonFor(cl);
          const st = lessonState(cl, lab);
          const expanded = open === cl.id;
          return (
            <li key={cl.id} className={cx("ml-unit-lesson", `is-${st}`)}>
              <span className={cx("ml-course-dot", `is-${st}`)} aria-hidden="true" />
              <div className="ml-unit-lesson-main">
                <div className="ml-unit-lesson-head">
                  <span className="ml-unit-lesson-id num">{cl.id}</span>
                  {app ? (
                    <Link to={`/learn/lessons/${app.id}`} className="ml-unit-lesson-title">
                      {cl.title}
                    </Link>
                  ) : (
                    <span className="ml-unit-lesson-title">{cl.title}</span>
                  )}
                </div>
                <div className="ml-unit-lesson-meta">
                  <span>{cl.minutes} min</span>
                  <span>{STATE_LABEL[st]}</span>
                  {cl.kind !== "core" && <span className="ml-unit-tag">{cl.kind === "track" ? "Track" : "Elective"}{cl.tracks?.length ? `: ${cl.tracks.join(", ")}` : ""}</span>}
                  <button type="button" className="ml-unit-more" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : cl.id)}>
                    {expanded ? "Less" : "What you'll learn"}
                  </button>
                </div>
                {expanded && (
                  <div className="ml-unit-lesson-detail">
                    <ul className="ml-list ml-list--check">
                      {cl.objectives.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                    {cl.prereqs.length > 0 && (
                      <p className="ml-small ml-muted">
                        Builds on:{" "}
                        {cl.prereqs.map((p, i) => {
                          const pl = getCourseLesson(p);
                          const pu = pl ? undefined : getCourseUnit(p);
                          return (
                            <span key={p}>
                              {i > 0 && ", "}
                              {p} {pl?.title ?? pu?.title}
                            </span>
                          );
                        })}
                      </p>
                    )}
                    {!app && <p className="ml-small ml-muted">This lesson is being written. Its outline is ready.</p>}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {(() => {
        const cp = unitCheckpoint(unit.id);
        if (!cp) return null;
        const attempts = lab.checks[cp.id] ?? [];
        const passed = attempts.some((a) => a.passed);
        return (
          <Link to={`/learn/checks/${cp.id}`} className={cx("ml-unit-checkpoint", passed && "is-done")}>
            <Icon name={passed ? "check-circle" : "flag"} size={18} />
            <span>
              <b>Unit checkpoint</b>
              <small>{passed ? "Passed: this unit is tested out" : `${cp.questionIds.length} questions · 80% tests out the unit`}</small>
            </span>
            <Icon name="arrow-right" size={16} />
          </Link>
        );
      })()}
    </Dialog>
  );
}

export function CoursePage({ unitId }: { unitId?: string }) {
  const lab = useLab();
  const { navigate } = useRouter();
  const { today, streak, xpToday } = useProgress(lab);
  const due = useMemo(() => dueReviews(lab.review, today), [lab.review, today]);
  const next = nextLearnStep(lab.lessons, due.length);
  const mastery = useMemo(() => masteryByConcept(lab.evidence, lab.review, QUESTIONS), [lab.evidence, lab.review]);
  const familiar = CONCEPTS.filter((c) => (mastery[c.id] ?? 0) >= 2).length;
  const allPlayable = COURSE_LEVELS.flatMap((lv) => lv.units.flatMap((u) => u.lessons)).filter((cl) => appLessonFor(cl));
  const doneCount = allPlayable.filter((cl) => ["done", "strong"].includes(lessonState(cl, lab))).length;
  const nextLevel = next.kind === "lesson" ? Number(courseLessonFor(next.lessonId)?.id.split(".")[0] ?? 0) : 0;
  const [openLevels, setOpenLevels] = useState<Set<number>>(() => new Set([nextLevel]));
  const unit = unitId ? getCourseUnit(unitId) : undefined;
  const goal = lab.profile.goals.dailyXp;

  const continueTo = () => {
    if (next.kind === "lesson") navigate(`/learn/lessons/${next.lessonId}`);
    else if (next.kind === "review") navigate("/learn/practice/review");
    else navigate("/learn/practice");
  };

  return (
    <div className="ml-page ml-course">
      <header className="ml-course-hero ml-art ml-art--course">
        <div className="ml-course-hero-copy">
          <span className="ml-eyebrow">The course</span>
          <h1>
            Trading, step by step<span className="ml-accent-text">.</span>
          </h1>
          <p>Five levels, from what a market is to running a trading process. Each lesson is a few minutes of doing, not reading.</p>
          <button type="button" className="ml-btn ml-btn--primary ml-btn--lg" onClick={continueTo}>
            {next.kind === "lesson" ? `${next.reason === "in-progress" ? "Continue" : "Start"}: ${next.title}` : next.kind === "review" ? `Review ${next.due} due` : "Practise what you know"}
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
        <div className="ml-course-hero-rings">
          <div>
            <Ring value={doneCount} total={allPlayable.length} label="Lessons complete" />
            <span>
              Lessons done
              <small>of {allPlayable.length} ready</small>
            </span>
          </div>
          <div>
            <Ring value={familiar} total={CONCEPTS.length} label="Concepts familiar or better" />
            <span>
              Concepts known
              <small>of {CONCEPTS.length}</small>
            </span>
          </div>
        </div>
      </header>

      <section className="ml-course-today" aria-label="Today">
        <Link to={due.length ? "/learn/practice/review" : "/learn/practice"} className="ml-stat-card ml-course-today-card">
          <div className="ml-sc-label">
            Today's review
            <Icon name="history" size={15} />
          </div>
          <div className="ml-sc-value">
            <span className="num">{due.length}</span>
            <span className="ml-sc-unit">due</span>
          </div>
          <div className="ml-sc-desc">{due.length ? `About ${Math.max(1, Math.round((due.length * 20) / 60))} min. Answers you missed come back here.` : "Nothing due. Missed answers from lessons come back here."}</div>
        </Link>
        <div className="ml-stat-card">
          <div className="ml-sc-label">
            Daily goal
            <Icon name="target" size={15} />
          </div>
          <div className="ml-sc-value">
            <span className="num">{xpToday}</span>
            <span className="ml-sc-muted num">/ {goal}</span>
            <span className="ml-sc-unit">XP</span>
          </div>
          <div className="ml-bar" role="meter" aria-label="Daily XP goal" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(xpToday, goal)}>
            <i style={{ width: `${Math.min(100, (xpToday / goal) * 100)}%` }} />
          </div>
          <div className="ml-sc-bottom">
            <span>
              <b className="num">{streak.current}</b> day streak
            </span>
            <span>{streak.paused.length ? `Paused ${streak.paused.map((d) => formatDayKey(d, { weekday: "short" })).join(", ")}` : `${streak.pausesLeft} pause${streak.pausesLeft === 1 ? "" : "s"} left this week`}</span>
          </div>
        </div>
      </section>

      <section className="ml-course-map" aria-labelledby="ml-course-map-h">
        <h2 id="ml-course-map-h" className="ml-h3">
          The course map
        </h2>
        {COURSE_LEVELS.map((lv) => {
          const lessons = lv.units.flatMap((u) => u.lessons);
          const ready = lessons.filter((cl) => appLessonFor(cl)).length;
          const done = lessons.filter((cl) => ["done", "strong"].includes(lessonState(cl, lab))).length;
          const isOpen = openLevels.has(lv.id);
          return (
            <section key={lv.id} className={cx("ml-course-level ml-art", `ml-art--level-${lv.id}`, isOpen && "is-open", lv.id === nextLevel && "is-current")}>
              <button
                type="button"
                className="ml-course-level-head"
                aria-expanded={isOpen}
                onClick={() => setOpenLevels((s) => {
                  const n = new Set(s);
                  if (n.has(lv.id)) n.delete(lv.id);
                  else n.add(lv.id);
                  return n;
                })}
              >
                <span className="ml-course-level-badge num">{lv.id}</span>
                <span className="ml-course-level-title">
                  <b>{lv.name}</b>
                  <small>{lv.tagline}</small>
                </span>
                <span className="ml-course-level-meta">
                  <span className="num">{lv.units.length} units · {lessons.length} lessons</span>
                  <span className="num">{ready ? `${done} of ${ready} ready done` : "Coming next"}</span>
                </span>
                <Icon name="chevron-down" size={16} className="ml-course-level-chevron" />
              </button>
              {isOpen && (
                <ol className="ml-course-trail">
                  {lv.units.map((u) => {
                    const pr = unitProgress(u, lab.lessons);
                    const complete = pr.playable > 0 && pr.done === pr.playable;
                    return (
                      <li key={u.id} className={cx("ml-course-unit", complete && "is-done", pr.playable === 0 && "is-planned", pr.done > 0 && !complete && "is-started")}>
                        <span className="ml-course-unit-node num" aria-hidden="true">
                          {complete ? <Icon name="check" size={14} /> : u.id.split(".")[1]}
                        </span>
                        <Link to={`/learn/units/${u.id}`} className="ml-course-unit-card">
                          <span className="ml-course-unit-top">
                            <span className="ml-course-unit-id num">{u.id}</span>
                            <b>{u.title}</b>
                          </span>
                          <span className="ml-course-unit-bottom">
                            <LessonDots unit={u} lab={lab} />
                            <span className="ml-course-unit-count num">{pr.playable ? `${pr.done}/${pr.playable}` : `${u.lessons.length} lessons`}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          );
        })}
      </section>

      <section className="ml-course-mastery" aria-labelledby="ml-course-mastery-h">
        <div className="ml-course-section-head">
          <h2 id="ml-course-mastery-h" className="ml-h3">
            Concept mastery
          </h2>
          <span className="ml-course-legend" aria-hidden="true">
            {([0, 1, 2, 3, 4] as MasteryLevel[]).map((m) => (
              <span key={m}>
                <i className={`ml-mastery-cell is-${m}`} /> {MASTERY_LABEL[m]}
              </span>
            ))}
          </span>
        </div>
        <div className="ml-course-mastery-grid">
          {TOPICS.map((t) => {
            const cs = CONCEPTS.filter((c) => c.category === t.id);
            if (!cs.length) return null;
            return (
              <div key={t.id} className="ml-course-mastery-topic">
                <span className="ml-course-mastery-name">{t.name}</span>
                <span className="ml-course-mastery-cells">
                  {cs.map((c) => {
                    const m = (mastery[c.id] ?? 0) as MasteryLevel;
                    return <Link key={c.id} to={`/learn/library/concepts/${c.id}`} className={`ml-mastery-cell is-${m}`} title={`${c.name}: ${MASTERY_LABEL[m]}`} aria-label={`${c.name}: ${MASTERY_LABEL[m]}`} />;
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {unit && <UnitPanel unit={unit} lab={lab} onClose={() => navigate("/learn/course")} />}
    </div>
  );
}
