import { useEffect, useState } from "react";
import { LESSONS, TOPIC_BY_ID, checkId, conceptsForLesson, getLesson, hasScript, loadLessonScript, termsForLesson, type Lesson, type LessonBlock, type LessonScript, type PracticeLink } from "@market-lab/academy";
import { getArenaScenario } from "@market-lab/missions";
import { Diagram } from "../components/Diagrams";
import { Card, PageHead, ProBadge, Rich, Skeleton } from "../components/Page";
import { QuizBlock } from "../components/Quiz";
import { useToast } from "../components/Toast";
import { Widget } from "../components/Widgets";
import { Button, Empty, Icon, Tag } from "../components/ui";
import { usePlan } from "../host";
import { learnLocked, showProBadge } from "../learn/access";
import { LessonPlayer, type ScriptedLesson } from "../learn/LessonPlayer";
import { LessonRead } from "../learn/LessonRead";
import { Link, useRouter } from "../router";
import { useLab, useStore } from "../store";

function Block({ b, onCheck }: { b: LessonBlock; onCheck: (correct: number, total: number) => void }) {
  switch (b.kind) {
    case "heading":
      return <h2 className="ml-lesson-h">{b.text}</h2>;
    case "text":
      return (
        <p className="ml-lesson-p">
          <Rich text={b.text} />
        </p>
      );
    case "points":
      return (
        <ul className="ml-lesson-list">
          {b.items.map((it) => (
            <li key={it}>
              <Rich text={it} />
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="ml-lesson-steps">
          {b.items.map((it) => (
            <li key={it}>
              <Rich text={it} />
            </li>
          ))}
        </ol>
      );
    case "example":
      return (
        <figure className="ml-example">
          <figcaption>
            <Icon name="calculator" size={15} /> {b.title}
          </figcaption>
          <ol className="num">
            {b.lines.map((l) => (
              <li key={l}>
                <Rich text={l} />
              </li>
            ))}
          </ol>
          {b.result && (
            <p className="ml-example-result">
              <Rich text={b.result} />
            </p>
          )}
        </figure>
      );
    case "figure":
      return (
        <figure className="ml-figure">
          <Diagram id={b.diagram} />
          <figcaption>
            <Rich text={b.caption} />
          </figcaption>
        </figure>
      );
    case "interactive":
      return (
        <section className="ml-widget" aria-label={b.title}>
          <div className="ml-widget-head">
            <Tag variant="default">Try it</Tag>
            <h3 className="ml-h4">{b.title}</h3>
          </div>
          <p className="ml-muted">{b.prompt}</p>
          <Widget id={b.widget} />
        </section>
      );
    case "callout":
      return (
        <aside className={`ml-callout-box ml-callout-box--${b.tone}`}>
          <Icon name={b.tone === "warning" ? "alert" : b.tone === "key" ? "star" : "info"} size={18} />
          <p>
            <Rich text={b.text} />
          </p>
        </aside>
      );
    case "check":
      return <QuizBlock questionIds={b.questionIds} onSubmit={onCheck} />;
    default:
      return null;
  }
}

function practiceHref(p: PracticeLink): string {
  if (p.kind === "mission") return `/mission/${p.ref}`;
  if (p.kind === "calculator") return "/arena/risk-calculator";
  if (p.kind === "arena") return "/arena/scenarios";
  return `/learn/checks/${checkId(p.ref)}`;
}

/** Loads a course lesson's script (one chunk per unit), then opens the player or Read mode. */
function ScriptedLessonRoute({ lesson, read }: { lesson: Lesson; read: boolean }) {
  const [script, setScript] = useState<LessonScript | undefined>(lesson.script);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (lesson.script) return;
    let live = true;
    loadLessonScript(lesson)
      .then((s) => live && (s ? setScript(s) : setFailed(true)))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [lesson]);
  if (failed) return <Empty title="This lesson couldn't load" action={<Link to="/learn/lessons" className="ml-text-link">All lessons</Link>}>Check your connection and try again.</Empty>;
  if (!script) return <Skeleton />;
  const scripted: ScriptedLesson = { ...lesson, script };
  return read ? <LessonRead lesson={scripted} /> : <LessonPlayer lesson={scripted} />;
}

export function LessonPage({ lessonId }: { lessonId: string }) {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const { navigate } = useRouter();
  const { pro } = usePlan();
  const lesson = getLesson(lessonId);
  const locked = learnLocked(lesson?.tier, pro);
  useEffect(() => {
    if (lesson && !locked) store.startLesson(lesson.id);
  }, [lesson, locked, store]);
  if (!lesson) return <Empty title="Lesson not found" action={<Link to="/learn/lessons" className="ml-text-link">All lessons</Link>} />;
  // Interactive lessons open in the player (or on one page in Read mode); course lessons load their script first.
  if (hasScript(lesson) && !locked) return <ScriptedLessonRoute key={lesson.id} lesson={lesson} read={lab.learnPrefs.mode === "read"} />;

  const done = Boolean(lab.lessons[lesson.id]?.completedAt);
  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const next = LESSONS.slice(idx + 1).find((l) => !learnLocked(l.tier, pro));
  const complete = () => {
    if (done) return;
    store.completeLesson(lesson.id);
    toast("Lesson complete · +25 XP");
  };
  const concepts = conceptsForLesson(lesson.id);
  const terms = termsForLesson(lesson.id);

  return (
    <div className="ml-page ml-lesson">
      <PageHead
        back={{ to: "/learn/lessons", label: "Lessons" }}
        eyebrow={
          <>
            {TOPIC_BY_ID[lesson.topic].name} · {lesson.level === "beginner" ? "Beginner" : "Intermediate"} · {lesson.minutes} min {showProBadge(lesson.tier) && <ProBadge />}
          </>
        }
        title={lesson.title}
        sub={lesson.summary}
        actions={done ? <span className="ml-status ml-status--done"><Icon name="check" size={12} /> Completed</span> : undefined}
      />
      <div className="ml-lesson-grid">
        <article className="ml-lesson-body">
          <section className="ml-objectives" aria-label="Objectives">
            <span className="ml-eyebrow">By the end you can</span>
            <ul className="ml-list ml-list--check">
              {lesson.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </section>
          {locked ? (
            <Card className="ml-card--upgrade" eyebrow="Pro lesson">
              <p className="ml-body">This lesson is part of the Intermediate and Psychology material in Pro. The Risk Management and Beginner paths stay free.</p>
              <div className="ml-actions">
                <Button variant="primary" iconLeft="sparkle" onClick={() => navigate("/pricing")}>
                  See Pro
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {lesson.blocks.map((b, i) => (
                <Block
                  key={i}
                  b={b}
                  onCheck={() => {
                    complete();
                  }}
                />
              ))}
              <div className="ml-lesson-end">
                {done ? (
                  <p className="ml-result-line">
                    <Icon name="check-circle" size={18} /> You've completed this lesson. Revisit it any time.
                  </p>
                ) : (
                  <Button variant="secondary" iconLeft="check" onClick={complete}>
                    Mark as complete
                  </Button>
                )}
                {next && (
                  <Button variant="primary" iconRight="arrow-right" onClick={() => navigate(`/learn/lessons/${next.id}`)}>
                    Next: {next.title}
                  </Button>
                )}
              </div>
            </>
          )}
        </article>
        <aside className="ml-stack-5 ml-lesson-aside">
          <Card title="Practise it">
            <ul className="ml-rows ml-rows--tight">
              {lesson.practice.map((p) => (
                <li key={`${p.kind}${p.ref}`}>
                  <Link to={practiceHref(p)} className="ml-row-link">
                    <Icon name={p.kind === "mission" ? "flag" : p.kind === "calculator" ? "calculator" : p.kind === "arena" ? "candles" : "quiz"} size={16} />
                    <span className="ml-row-main">
                      <b>{p.kind === "arena" ? `Arena: ${getArenaScenario(p.ref).title}` : p.label}</b>
                      <span className="ml-muted">{p.kind === "mission" ? "Mission" : p.kind === "calculator" ? "Tool" : p.kind === "arena" ? "Scenario" : "Knowledge check"}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          {concepts.length > 0 && (
            <Card title="Related concepts">
              <div className="ml-pills">
                {concepts.map((c) => (
                  <Link key={c.id} to={`/learn/library/concepts/${c.id}`} className="ml-pill">
                    {c.name}
                  </Link>
                ))}
              </div>
            </Card>
          )}
          {terms.length > 0 && (
            <Card title="Terms in this lesson">
              <dl className="ml-terms">
                {terms.slice(0, 8).map((t) => (
                  <div key={t.id}>
                    <dt>{t.term}</dt>
                    <dd>{t.plain}</dd>
                  </div>
                ))}
              </dl>
              <Link to="/learn/library/glossary" className="ml-text-link ml-small">
                Full glossary
              </Link>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
