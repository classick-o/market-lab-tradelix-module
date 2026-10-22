/**
 * Read mode (PLAN_LEARN §5.4): the whole interactive lesson on one page, with the same figures,
 * glossary cards and working interactions. Reading marks the lesson "Read"; the check at the
 * bottom completes it as in the player.
 */
import { useMemo, useState, type ReactNode } from "react";
import { TOPIC_BY_ID, type Beat } from "@market-lab/academy";
import { PageHead, Rich } from "../components/Page";
import { Term } from "../components/Term";
import { Button, Icon } from "../components/ui";
import { useToast } from "../components/Toast";
import { useLab, useStore } from "../store";
import { getTerm } from "@market-lab/academy";
import { AnswerControlView, hasAnswer, type AnswerValue } from "./AnswerControl";
import { BeatView } from "./beats";
import { CheckPhase } from "./CheckPhase";
import { ScreenContext, hashSeed, type ScreenApi } from "./context";
import { FigureView } from "./FigureView";
import { lessonTerms, nextLesson, type ScriptedLesson } from "./LessonPlayer";
import { TaskRunner } from "./TaskRunner";
import { Link, useRouter } from "../router";

function Section({ id, kicker, title, children }: { id?: string; kicker: string; title?: string; children: ReactNode }) {
  return (
    <section id={id} className="lr-section">
      <span className="lp-kicker">{kicker}</span>
      {title && <h2 className="lp-beat-title">{title}</h2>}
      {children}
    </section>
  );
}

function ReadBeat({ beat, api }: { beat: Beat; api: ScreenApi }) {
  return (
    <ScreenContext.Provider value={api}>
      <div className="lr-beat">
        <BeatView beat={beat} />
      </div>
    </ScreenContext.Provider>
  );
}

export function LessonRead({ lesson }: { lesson: ScriptedLesson }) {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const { navigate } = useRouter();
  const script = lesson.script;
  const progress = lab.lessons[lesson.id];
  const done = !!progress?.completedAt;
  const [hook, setHook] = useState<AnswerValue>(progress?.hookAnswer ?? (script.hook.control.kind === "slider" ? script.hook.control.start ?? script.hook.control.min : null));
  const [hookLocked, setHookLocked] = useState(progress?.hookAnswer !== undefined);
  const terms = useMemo(() => lessonTerms(lesson), [lesson]);
  const next = useMemo(() => nextLesson(lesson), [lesson]);
  const api = (key: string): ScreenApi => ({
    mode: "read",
    done: false,
    lessonId: lesson.id,
    seed: hashSeed(`${lesson.id}:${key}`),
    complete: () => {},
    evidence: (concept, score, source = "lesson") => {
      if (concept) store.recordEvidence([{ concept, score, source }]);
    },
  });

  return (
    <div className="ml-page lr">
      <PageHead
        back={{ to: "/learn/lessons", label: "Lessons" }}
        eyebrow={
          <>
            {script.unit} · {TOPIC_BY_ID[lesson.topic].name} · {lesson.minutes} min · Read mode
          </>
        }
        title={lesson.title}
        sub={lesson.summary}
        actions={
          <Button variant="secondary" iconLeft="play" onClick={() => store.setLearnPrefs({ mode: "learn" })}>
            Interactive mode
          </Button>
        }
      />
      <div className="lr-grid">
        <article className="lr-body">
          <section className="ml-objectives" aria-label="Objectives">
            <span className="ml-eyebrow">By the end you can</span>
            <ul className="ml-list ml-list--check">
              {lesson.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </section>

          <Section kicker="Before we start" title="Make a prediction">
            <p className="lp-prompt">
              <Rich text={script.hook.prompt} />
            </p>
            {script.hook.figure && <FigureView figure={script.hook.figure} all />}
            <AnswerControlView control={script.hook.control} value={hook} onChange={setHook} locked={hookLocked} label={script.hook.prompt} />
            {!hookLocked && (
              <div className="lp-inline-actions">
                <Button
                  variant="secondary"
                  disabled={!hasAnswer(script.hook.control, hook)}
                  onClick={() => {
                    store.saveHookAnswer(lesson.id, hook as string | number);
                    setHookLocked(true);
                  }}
                >
                  Lock in my guess
                </Button>
              </div>
            )}
          </Section>

          {script.learn.map((b, i) => (
            <ReadBeat key={i} beat={b} api={api(`b${i}`)} />
          ))}

          {script.task && (
            <Section kicker="Try it" title="Your turn">
              <ScreenContext.Provider value={api("task")}>
                <TaskRunner task={script.task} />
              </ScreenContext.Provider>
            </Section>
          )}

          <Section kicker="Remember">
            <ol className="lp-takeaways is-static">
              {script.recap.takeaways.map((t, i) => (
                <li key={i}>
                  <span className="lp-takeaway-n num">{i + 1}</span>
                  <span>
                    <Rich text={t} />
                  </span>
                </li>
              ))}
            </ol>
          </Section>

          <Section kicker="Check" title={done ? "Practise the check again" : "Three questions to finish the lesson"}>
            <ScreenContext.Provider value={{ ...api("check"), done: false }}>
              <CheckPhase
                questionIds={script.check}
                onFirstPass={(results) => store.finishLessonCheck(lesson.id, results, TOPIC_BY_ID[lesson.topic].skill)}
                onFinish={() => {
                  const xp = store.completeScriptedLesson(lesson.id);
                  if (xp) toast(`Lesson complete · +${xp} XP`);
                }}
              />
            </ScreenContext.Provider>
          </Section>

          <div className="ml-lesson-end">
            {done ? (
              <p className="ml-result-line">
                <Icon name="check-circle" size={18} /> Lesson complete.
              </p>
            ) : progress?.readAt ? (
              <p className="ml-result-line">
                <Icon name="book" size={18} /> Marked as read. Do the check above to complete it.
              </p>
            ) : (
              <Button variant="secondary" iconLeft="book" onClick={() => store.markLessonRead(lesson.id)}>
                Mark as read
              </Button>
            )}
            {next && (
              <Button variant="primary" iconRight="arrow-right" onClick={() => navigate(`/learn/lessons/${next.id}`)}>
                Next: {next.title}
              </Button>
            )}
          </div>
        </article>
        <aside className="ml-stack-5 ml-lesson-aside">
          {terms.length > 0 && (
            <div className="ml-card">
              <h3 className="lp-kicker">Terms in this lesson</h3>
              <ul className="lp-rail-terms">
                {terms.map((id) => (
                  <li key={id}>
                    <Term id={id}>{getTerm(id)!.term}</Term>
                  </li>
                ))}
              </ul>
              <Link to="/learn/glossary" className="ml-text-link ml-small">
                Full glossary
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
