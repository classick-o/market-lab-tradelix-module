/**
 * The end of a lesson (PLAN_LEARN §5.5): the result and XP, the learner's prediction against the
 * rule, three things to remember, the terms met, one next step, and an optional rating.
 */
import { useEffect, useState } from "react";
import { checkId, getTerm, type Lesson, type LessonScript, type PracticeLink } from "@market-lab/academy";
import { Rich } from "../components/Page";
import { Term } from "../components/Term";
import { Icon, cx } from "../components/ui";
import { useReducedMotion } from "../components/Stage";
import { Link, useRouter } from "../router";
import { useLab, useStore } from "../store";
import { AnswerControlView, answerText, type AnswerValue } from "./AnswerControl";
import { useKeys } from "./context";

function practiceHref(p: PracticeLink): string {
  if (p.kind === "mission") return `/mission/${p.ref}`;
  if (p.kind === "calculator") return "/arena/risk-calculator";
  if (p.kind === "arena") return "/arena/scenarios";
  return `/learn/checks/${checkId(p.ref)}`;
}

function CountUp({ to }: { to: number }) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? to : 0);
  useEffect(() => {
    if (reduced || to === 0) return setV(to);
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 600);
      setV(Math.round(to * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, reduced]);
  return <span className="num">{v}</span>;
}

export function Recap({ lesson, script, terms, xp, next, onReplay, onJump }: { lesson: Lesson; script: LessonScript; terms: string[]; xp: number; next?: Lesson; onReplay: () => void; onJump: (phase: number) => void }) {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const p = lab.lessons[lesson.id];
  const quality = p?.quality;
  const yours = (p?.hookAnswer ?? null) as AnswerValue;
  const compare = script.hook.compare.replace(/\{yours\}/g, answerText(script.hook.control, yours));
  const [rated, setRated] = useState<boolean | null>(p?.rating?.up ?? null);
  const [note, setNote] = useState(p?.rating?.note ?? "");
  const [queued, setQueued] = useState(false);
  const goNext = () => {
    if (next) navigate(`/learn/lessons/${next.id}`);
    else navigate("/learn/lessons");
    return true;
  };
  useKeys({ Enter: goNext });

  return (
    <div className="lp-recap">
      <header className="lp-recap-head">
        <span className="lp-recap-check" aria-hidden="true">
          <svg viewBox="0 0 40 40" width="40" height="40">
            <circle cx="20" cy="20" r="18" />
            <path d="M12 20.5l5.5 5.5L28.5 15" />
          </svg>
        </span>
        <div>
          <h2 className="lp-recap-title">
            Lesson complete{quality === "strong" ? " · Strong" : quality === "good" ? " · Good" : quality === "review" ? " · Review soon" : ""}
          </h2>
          <p className="ml-muted">
            {xp > 0 ? (
              <>
                +<CountUp to={xp} /> XP{xp > 15 ? " · 3 of 3 on the first try" : ""}
              </>
            ) : p?.firstTry ? (
              `${p.firstTry.correct} of ${p.firstTry.total} on the first try`
            ) : (
              "Revisit any part below."
            )}
          </p>
        </div>
      </header>

      <section className="lp-recap-block" aria-labelledby="rc-pred">
        <h3 id="rc-pred" className="lp-kicker">
          Your prediction
        </h3>
        {(script.hook.control.kind === "slider" || script.hook.control.kind === "tap" || script.hook.control.kind === "choice") && yours !== null && (
          <div className="lp-recap-hook">
            <AnswerControlView control={script.hook.control} value={yours} onChange={() => {}} locked reveal label="Your prediction" />
          </div>
        )}
        <p className="lp-text">
          <Rich text={compare} />
        </p>
      </section>

      <section className="lp-recap-block" aria-labelledby="rc-take">
        <h3 id="rc-take" className="lp-kicker">
          Three things to remember
        </h3>
        <ol className="lp-takeaways">
          {script.recap.takeaways.map((t, i) => (
            <li key={i} style={{ animationDelay: `${120 + i * 90}ms` }}>
              <span className="lp-takeaway-n num">{i + 1}</span>
              <span>
                <Rich text={t} />
              </span>
            </li>
          ))}
        </ol>
      </section>

      {terms.length > 0 && (
        <section className="lp-recap-block" aria-labelledby="rc-terms">
          <h3 id="rc-terms" className="lp-kicker">
            Terms you met
          </h3>
          <div className="lp-term-chips">
            {terms.map((id) => {
              const t = getTerm(id);
              return t ? (
                <span key={id} className="lp-term-chip">
                  <Term id={id}>{t.term}</Term>
                </span>
              ) : null;
            })}
          </div>
        </section>
      )}

      <section className="lp-recap-next" aria-label="Your next step">
        <button type="button" className="ml-btn ml-btn--primary ml-btn--lg" onClick={goNext}>
          {next ? `Next: ${next.title}` : "All lessons"} <Icon name="arrow-right" size={18} />
        </button>
        <div className="lp-recap-secondary">
          {lesson.practice[0] && (
            <Link to={practiceHref(lesson.practice[0])} className="ml-btn ml-btn--secondary ml-btn--md">
              <Icon name={lesson.practice[0].kind === "mission" ? "flag" : "target"} size={16} /> Practise it: {lesson.practice[0].label}
            </Link>
          )}
          <button
            type="button"
            className="ml-btn ml-btn--tertiary ml-btn--md"
            disabled={queued}
            onClick={() => {
              store.queueLessonReview(script.check);
              setQueued(true);
            }}
          >
            <Icon name={queued ? "check" : "history"} size={16} /> {queued ? "In your review" : "Review later"}
          </button>
        </div>
      </section>

      <section className="lp-recap-block lp-recap-rate" aria-labelledby="rc-rate">
        <h3 id="rc-rate" className="lp-kicker">
          Was this lesson clear?
        </h3>
        <div className="lp-rate">
          <button type="button" className={cx("lp-rate-btn", rated === true && "is-on")} aria-pressed={rated === true} onClick={() => (setRated(true), store.rateLesson(lesson.id, true, note))}>
            Clear
          </button>
          <button type="button" className={cx("lp-rate-btn", rated === false && "is-on")} aria-pressed={rated === false} onClick={() => (setRated(false), store.rateLesson(lesson.id, false, note))}>
            Something was unclear
          </button>
        </div>
        {rated === false && (
          <label className="lp-rate-note">
            <span className="ml-sr">What was unclear?</span>
            <textarea rows={2} maxLength={500} placeholder="What was unclear? (optional)" value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => store.rateLesson(lesson.id, false, note)} />
          </label>
        )}
      </section>

      <footer className="lp-recap-foot">
        <button type="button" className="ml-text-link" onClick={onReplay}>
          <Icon name="replay" size={14} /> Replay lesson
        </button>
        <span className="lp-recap-jump">
          Jump to:
          {(["Hook", "Learn", "Try", "Check"] as const).map((label, i) =>
            i === 2 && !script.task ? null : (
              <button key={label} type="button" className="ml-text-link" onClick={() => onJump(i)}>
                {label}
              </button>
            ),
          )}
        </span>
      </footer>
    </div>
  );
}
