import { useState } from "react";
import { getLesson, getQuestion, isCorrect, type Question } from "@market-lab/academy";
import { Link } from "../router";
import { Rich } from "./Page";
import { Button, Icon, InlineError, TextField, cx } from "./ui";

export function QuestionCard({ q, index, value, onChange, graded }: { q: Question; index: number; value: string; onChange: (v: string) => void; graded: boolean }) {
  const right = graded && isCorrect(q, value);
  return (
    <fieldset className={cx("ml-qcard", graded && (right ? "is-right" : "is-wrong"))}>
      <legend className="ml-qcard-head">
        <span className="ml-qcard-n num">{index + 1}</span>
        <span>
          {q.kind === "scenario" && <span className="ml-qcard-kind">Scenario</span>}
          {q.kind === "numeric" && <span className="ml-qcard-kind">Exercise</span>}
          {q.scenario && (
            <span className="ml-qcard-scenario">
              <Rich text={q.scenario} />
            </span>
          )}
          <Rich text={q.prompt} />
        </span>
      </legend>
      {q.options ? (
        <div className="ml-stack-2" role="radiogroup" aria-label={`Answer ${index + 1}`}>
          {q.options.map((o) => (
            <label key={o.id} className={cx("ml-option", value === o.id && "is-on", graded && o.id === q.correct && "is-correct", graded && value === o.id && o.id !== q.correct && "is-wrong")}>
              <input type="radio" name={q.id} value={o.id} checked={value === o.id} disabled={graded} onChange={() => onChange(o.id)} />
              <span>
                <Rich text={o.label} />
              </span>
              {graded && o.id === q.correct && <Icon name="check" size={16} />}
            </label>
          ))}
        </div>
      ) : (
        <TextField label="Your answer" inputMode="decimal" value={value} disabled={graded} onChange={(e) => onChange(e.target.value)} trailing={q.numeric?.unit ? <span className="ml-field-unit">{q.numeric.unit}</span> : undefined} />
      )}
      {graded && (
        <div className="ml-explain" role="status">
          <b>{right ? "Correct." : q.numeric ? `Not quite. The answer is ${q.numeric.answer} ${q.numeric.unit}.` : "Not quite."}</b> <Rich text={q.explanation} />
          {!right && getLesson(q.lesson) && (
            <>
              {" "}
              <Link to={`/learn/lessons/${q.lesson}`} className="ml-text-link">
                Review: {getLesson(q.lesson)!.title}
              </Link>
            </>
          )}
        </div>
      )}
    </fieldset>
  );
}

/** A short inline quiz (inside a lesson). Explanations appear after submitting. */
export function QuizBlock({ questionIds, onSubmit, title = "Check your understanding" }: { questionIds: string[]; onSubmit?: (correct: number, total: number) => void; title?: string }) {
  const qs = questionIds.map(getQuestion).filter((q): q is Question => Boolean(q));
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [graded, setGraded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const correct = qs.filter((q) => isCorrect(q, answers[q.id])).length;
  if (qs.length === 0) return null;
  return (
    <section className="ml-quiz" aria-label={title}>
      <div className="ml-quiz-head">
        <Icon name="quiz" size={18} />
        <h2 className="ml-h3">{title}</h2>
        {graded && (
          <span className="ml-quiz-score num">
            {correct} of {qs.length} correct
          </span>
        )}
      </div>
      {qs.map((q, i) => (
        <QuestionCard key={q.id} q={q} index={i} value={answers[q.id] ?? ""} graded={graded} onChange={(v) => setAnswers({ ...answers, [q.id]: v })} />
      ))}
      {error && <InlineError>{error}</InlineError>}
      <div className="ml-actions">
        {graded ? (
          <Button
            variant="tertiary"
            iconLeft="replay"
            onClick={() => {
              setAnswers({});
              setGraded(false);
            }}
          >
            Try again
          </Button>
        ) : (
          <Button
            variant="secondary"
            iconRight="check"
            onClick={() => {
              if (qs.some((q) => !answers[q.id]?.trim())) return setError("Answer every question first.");
              setError(null);
              setGraded(true);
              onSubmit?.(qs.filter((q) => isCorrect(q, answers[q.id])).length, qs.length);
            }}
          >
            Check answers
          </Button>
        )}
      </div>
    </section>
  );
}
