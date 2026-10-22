/**
 * The lesson check (PLAN_LEARN §4.3, §6.3): three questions, one per screen, with hints, an
 * explanation for the option picked and the reasoning. Wrong answers come back at the end until
 * they're right, so anyone can finish; only the first try counts for quality and XP.
 * Numeric questions with `vary` show fresh numbers, so the check tests the rule, not memory.
 */
import { useMemo, useState } from "react";
import { getLesson, getQuestion, parseNumericAnswer, seededRandom, varyQuestion, type Question } from "@market-lab/academy";
import { Rich } from "../components/Page";
import { Icon, cx } from "../components/ui";
import { Link } from "../router";
import { hashSeed, useKeys, useScreen } from "./context";
import { Feedback } from "./parts";

export interface CheckResult {
  questionId: string;
  correct: boolean;
  hinted: boolean;
}

interface Item {
  id: string;
  attempt: number;
}

/** The question as shown: with fresh numbers when it has a generator. */
function shownQuestion(q: Question, seed: number): Question {
  if (!q.vary || !q.numeric) return q;
  const v = varyQuestion(q, seededRandom(seed));
  if (!v) return q;
  const hints = q.hints ? [...q.hints.slice(0, -1), v.hint ?? q.hints[q.hints.length - 1]] : v.hint ? [v.hint] : undefined;
  return { ...q, prompt: v.prompt, explanation: v.explanation, hints, numeric: { ...q.numeric, answer: v.answer } };
}

function gradeShown(q: Question, value: string): boolean {
  if (q.kind === "numeric" && q.numeric) {
    const n = parseNumericAnswer(value);
    return n !== null && Math.abs(n - q.numeric.answer) <= q.numeric.tolerance + 1e-9;
  }
  return value === q.correct;
}

export function CheckPhase({ questionIds, onFirstPass, onFinish }: { questionIds: string[]; onFirstPass: (results: CheckResult[]) => void; onFinish: () => void }) {
  const s = useScreen();
  const [queue, setQueue] = useState<Item[]>(() => questionIds.map((id) => ({ id, attempt: 0 })));
  const [pos, setPos] = useState(0);
  const [value, setValue] = useState("");
  const [hints, setHints] = useState(0);
  const [graded, setGraded] = useState(false);
  const [first, setFirst] = useState<CheckResult[]>([]);
  const [finished, setFinished] = useState(false);

  const item = queue[pos];
  const base = item ? getQuestion(item.id) : undefined;
  const q = useMemo(() => (base && item ? shownQuestion(base, hashSeed(`${s.lessonId}:${item.id}:${item.attempt}:${s.seed}`)) : undefined), [base, item, s.lessonId, s.seed]);
  const right = graded && q ? gradeShown(q, value) : false;
  const retries = queue.length - questionIds.length;

  const submit = () => {
    if (!q || !item || graded || !value.trim()) return false;
    const ok = gradeShown(q, value);
    setGraded(true);
    if (item.attempt === 0) {
      const results = [...first, { questionId: item.id, correct: ok, hinted: hints > 0 }];
      setFirst(results);
      if (results.length === questionIds.length) onFirstPass(results);
    }
    if (!ok) setQueue((qs) => [...qs, { id: item.id, attempt: item.attempt + 1 }]);
    return true;
  };
  const next = () => {
    if (!graded) return false;
    if (pos + 1 >= queue.length) {
      setFinished(true);
      onFinish();
      return true;
    }
    setPos(pos + 1);
    setValue("");
    setHints(0);
    setGraded(false);
    return true;
  };
  const hint = () => {
    if (graded || !q?.hints || hints >= q.hints.length) return false;
    setHints(hints + 1);
    return true;
  };
  useKeys({
    Enter: () => (graded ? next() : submit()),
    h: hint,
    H: hint,
    ...(q?.options && !graded ? Object.fromEntries(q.options.slice(0, 9).map((o, i) => [String(i + 1), () => (setValue(o.id), true)])) : {}),
  });

  if (finished || (s.done && first.length === 0)) {
    const score = first.length ? first.filter((r) => r.correct).length : null;
    return (
      <div className="lp-check-done">
        <Icon name="check-circle" size={28} />
        <h2 className="lp-beat-title">{score === null ? "Check done" : `${score} of ${questionIds.length} on the first try`}</h2>
        <p className="ml-muted">{score === null ? "You've already done this check. Your first try is what counts." : score === questionIds.length ? "All three, first time. That's a strong lesson." : "Every question is right now. The ones you missed come back in your review."}</p>
      </div>
    );
  }
  if (!q || !item) return null;
  const pickedRationale = graded && !right && q.options ? q.options.find((o) => o.id === value)?.rationale : undefined;
  const lesson = !right && q.lesson !== s.lessonId ? getLesson(q.lesson) : undefined;

  return (
    <div className="lp-check">
      <div className="lp-check-progress">
        <span className="lp-kicker num">
          {item.attempt > 0 ? "One more try" : `Question ${Math.min(pos + 1, questionIds.length)} of ${questionIds.length}`}
        </span>
        <span className="lp-check-dots" aria-hidden="true">
          {questionIds.map((id, i) => {
            const r = first[i];
            return <span key={id} className={cx("lp-step-dot", r && (r.correct ? "is-right" : "is-wrong"), i === pos && item.attempt === 0 && "is-current")} />;
          })}
          {retries > 0 && <span className="lp-check-retries num">+{retries}</span>}
        </span>
      </div>
      {q.scenario && (
        <p className="lp-scenario">
          <Rich text={q.scenario} />
        </p>
      )}
      <p className="lp-prompt">
        <Rich text={q.prompt} />
      </p>
      {q.options ? (
        <div className="lp-choices" role="radiogroup" aria-label="Answer">
          {q.options.map((o, i) => {
            const on = value === o.id;
            const isRight = graded && o.id === q.correct;
            const isWrong = graded && on && o.id !== q.correct;
            return (
              <button key={o.id} type="button" role="radio" aria-checked={on} disabled={graded && !on && !isRight} className={cx("lp-choice", on && "is-on", isRight && "is-right", isWrong && "is-wrong", graded && "is-locked")} onClick={() => !graded && setValue(o.id)}>
                <span className="lp-choice-key num" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="lp-choice-label">
                  <Rich text={o.label} />
                </span>
                {isRight && <Icon name="check" size={16} className="lp-choice-mark" />}
              </button>
            );
          })}
        </div>
      ) : (
        <label className={cx("lp-numeric", graded && "is-locked")}>
          <span className="ml-sr">Your answer</span>
          <input inputMode="decimal" autoComplete="off" value={value} disabled={graded} placeholder="Your answer" onChange={(e) => setValue(e.target.value)} autoFocus />
          {q.numeric?.unit && <span className="lp-numeric-unit">{q.numeric.unit}</span>}
        </label>
      )}
      {hints > 0 && q.hints && (
        <ol className="lp-hints" aria-label="Hints">
          {q.hints.slice(0, hints).map((h, i) => (
            <li key={i}>
              <Icon name="bulb" size={15} />
              <span>
                <Rich text={h} />
              </span>
            </li>
          ))}
        </ol>
      )}
      {graded && (
        <Feedback tone={right ? "right" : "wrong"} title={right ? "Correct." : q.numeric ? `Not quite. The answer is ${q.numeric.answer.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${q.numeric.unit}.` : "Not quite."}>
          {pickedRationale && (
            <span className="lp-rationale">
              <Rich text={pickedRationale} />{" "}
            </span>
          )}
          <Rich text={q.explanation} />
          {lesson && (
            <>
              {" "}
              <Link to={`/learn/lessons/${lesson.id}`} className="ml-text-link">
                Review: {lesson.title}
              </Link>
            </>
          )}
          {!right && <span className="lp-retry-note"> This one comes back at the end.</span>}
        </Feedback>
      )}
      <div className="lp-inline-actions">
        {!graded ? (
          <>
            <button type="button" className="ml-btn ml-btn--primary ml-btn--md" disabled={!value.trim()} onClick={submit}>
              Check
            </button>
            {q.hints && q.hints.length > 0 && (
              <button type="button" className="ml-btn ml-btn--tertiary ml-btn--md" onClick={hint} disabled={hints >= q.hints.length} aria-keyshortcuts="H">
                <Icon name="bulb" size={18} /> {hints === 0 ? "Hint" : `Hint ${Math.min(hints + 1, q.hints.length)}/${q.hints.length}`}
              </button>
            )}
          </>
        ) : (
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={next}>
            {pos + 1 >= queue.length ? "Finish the check" : "Next question"} <Icon name="arrow-right" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
