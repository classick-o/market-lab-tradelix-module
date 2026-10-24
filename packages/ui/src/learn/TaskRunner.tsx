/**
 * A widget with a goal (PLAN_LEARN §9): the learner sets the controls, presses Check, and gets
 * feedback written for the mistake they made. Hints come one at a time (H); Show me animates to a
 * right answer; Reset goes back to the start. Conditions are checked on the widget's own numbers.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { WIDGET_DEFAULTS, evaluateCondition, fillTemplate, pickFeedback, widgetValues, type TaskSpec, type WidgetState } from "@market-lab/academy";
import { Rich } from "../components/Page";
import { Icon, cx } from "../components/ui";
import { useReducedMotion } from "../components/Stage";
import { Feedback } from "./parts";
import { useKeys, useScreen } from "./context";
import { Instructions, ToLab, ToLearn, useSlots } from "./split";
import { TASK_WIDGETS } from "./taskWidgets";

type Status = "idle" | "incorrect" | "correct" | "shown";

export function TaskRunner({ task }: { task: TaskSpec }) {
  const s = useScreen();
  const slots = useSlots();
  const reduced = useReducedMotion();
  const start = useMemo<WidgetState>(() => ({ ...WIDGET_DEFAULTS[task.widget], ...task.start }), [task]);
  const [state, setState] = useState<WidgetState>(() => (s.done ? { ...start, ...task.showMe } : start));
  const [status, setStatus] = useState<Status>(s.done ? "correct" : "idle");
  const [message, setMessage] = useState<string | null>(null);
  const [hints, setHints] = useState(0);
  const [checks, setChecks] = useState(0);
  // Bumped by Reset, so the widget starts over with its own animations too.
  const [run, setRun] = useState(0);
  const anim = useRef<number | undefined>(undefined);
  const values = useMemo(() => widgetValues(task.widget, state, task.data), [task, state]);
  const solved = status === "correct" || status === "shown";
  const View = TASK_WIDGETS[task.widget];

  useEffect(() => () => cancelAnimationFrame(anim.current ?? 0), []);
  useEffect(() => {
    if (solved) s.complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  const set = (patch: WidgetState) => {
    if (solved && status === "correct" && !s.done) return;
    setState((cur) => ({ ...cur, ...patch }));
    if (status === "incorrect") setStatus("idle");
  };

  const check = (next: WidgetState = state) => {
    if (solved) return false;
    const v = widgetValues(task.widget, next, task.data);
    const ok = evaluateCondition(task.success, v);
    const n = checks + 1;
    setChecks(n);
    if (ok) {
      setStatus("correct");
      setMessage(fillTemplate(task.correct, v));
      s.evidence(task.concept, n === 1 && hints === 0 ? 1 : 0.5, "task");
    } else {
      setStatus("incorrect");
      const fb = pickFeedback(task.feedback ?? [], v);
      setMessage(fillTemplate(fb?.text ?? task.incorrect ?? "Not yet. Compare your setting with the goal.", v));
      if (n === 1) s.evidence(task.concept, 0, "task");
    }
    return true;
  };

  const showMe = () => {
    if (solved) return;
    const from = state;
    const to = { ...state, ...task.showMe };
    const finish = () => {
      setState(to);
      setStatus("shown");
      // The success text speaks to the learner ("Right: …"); after Show me it explains the setting instead.
      const text = fillTemplate(task.correct, widgetValues(task.widget, to, task.data)).replace(/^(Right|Correct|Yes|Exactly)[.:,!]?\s*/i, "");
      setMessage(text.charAt(0).toUpperCase() + text.slice(1));
    };
    if (reduced) return finish();
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 400);
      const e = 1 - (1 - k) ** 3;
      const mid: WidgetState = { ...from };
      for (const [key, v] of Object.entries(to)) {
        const a = from[key];
        mid[key] = typeof v === "number" && typeof a === "number" ? Number((a + (v - a) * e).toFixed(2)) : k === 1 ? v : a;
      }
      setState(mid);
      if (k < 1) anim.current = requestAnimationFrame(step);
      else finish();
    };
    anim.current = requestAnimationFrame(step);
  };

  const reset = () => {
    cancelAnimationFrame(anim.current ?? 0);
    setState(start);
    setStatus("idle");
    setMessage(null);
    setRun((r) => r + 1);
  };
  const hint = () => {
    if (solved || hints >= task.hints.length) return false;
    setHints((h) => h + 1);
    return true;
  };
  const commitsItself =
    task.widget === "order-fill" ||
    task.widget === "bias-spotter" ||
    (task.widget === "level-drawer" && !!task.data?.breakout) ||
    // Tapping the best bid and ask, or sending the order, is the answer.
    (task.widget === "auction-book" && task.data?.auction?.mode !== "clear") ||
    // The year playing out is the answer.
    (task.widget === "benchmark-ghost" && task.data?.ghost?.mode === "race");
  useKeys({ h: hint, H: hint, Enter: () => (commitsItself ? false : check()) });

  const widget = (
    <div className="lp-task-widget">
      {View ? (
        <View key={run} task={task} state={state} values={values} set={set} solved={solved} locked={new Set(task.locked ?? [])} hidden={new Set(solved ? [] : task.hidden ?? [])} check={check} hints={hints} />
      ) : (
        <p className="ml-muted">This exercise isn't available yet.</p>
      )}
    </div>
  );
  const hintList = hints > 0 && (
    <ol className="lp-hints" aria-label="Hints">
      {task.hints.slice(0, hints).map((h, i) => (
        <li key={i}>
          <Icon name="bulb" size={15} />
          <span>
            <Rich text={h} />
          </span>
        </li>
      ))}
    </ol>
  );
  const feedback =
    message &&
    (status === "incorrect" ? (
      <Feedback tone="wrong" title="Not yet.">
        <Rich text={message} />
      </Feedback>
    ) : status === "correct" || status === "shown" ? (
      <Feedback tone={status === "correct" ? "right" : "info"} title={status === "correct" ? "Solved." : "Here's one way."}>
        <Rich text={message} />
      </Feedback>
    ) : null);
  const hintLabel = `Hint${task.hints.length > 1 ? ` ${Math.min(hints + 1, task.hints.length)}/${task.hints.length}` : ""}`;
  const revisited = s.done && solved;
  const tryAgain = (
    <button type="button" className="ml-btn ml-btn--secondary ml-btn--md" onClick={reset}>
      <Icon name="replay" size={18} /> Try again
    </button>
  );
  const resetAndShow = (
    <>
      <span className="lp-task-spacer" />
      <button type="button" className="ml-btn ml-btn--tertiary ml-btn--md" onClick={reset}>
        <Icon name="replay" size={18} /> Reset
      </button>
      <button type="button" className="ml-btn ml-btn--tertiary ml-btn--md" onClick={showMe} disabled={solved}>
        <Icon name="eye" size={18} /> Show me
      </button>
    </>
  );
  const checkButton = !commitsItself && (
    <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={() => check()} disabled={solved}>
      <Icon name="check" size={18} /> Check
    </button>
  );

  if (slots)
    return (
      <>
        <ToLearn>
          <Instructions done={solved}>
            <p className="lp-instr-text">
              <Rich text={task.goal} />
            </p>
          </Instructions>
          {!solved && hints < task.hints.length && (
            <button type="button" className="lp-stuck" onClick={hint} aria-keyshortcuts="H">
              <Icon name="bulb" size={15} /> {hints === 0 ? "Stuck? Get a hint" : `Another hint (${hints + 1}/${task.hints.length})`}
            </button>
          )}
          {hintList}
          {feedback}
        </ToLearn>
        <ToLab className={cx("lp-task", `is-${status}`)}>
          {widget}
          <div className="lp-task-actions">
            {revisited ? (
              tryAgain
            ) : (
              <>
                {checkButton}
                {resetAndShow}
              </>
            )}
          </div>
        </ToLab>
      </>
    );

  return (
    <section className={cx("lp-task", `is-${status}`)} aria-label="Task">
      <div className="lp-task-goal">
        <span className="lp-kicker">
          <Icon name="target" size={14} /> Your task
        </span>
        <p>
          <Rich text={task.goal} />
        </p>
      </div>
      {widget}
      {hintList}
      {feedback}
      {revisited ? (
        // Revisited: the answer is on screen, and the widget can be played again.
        <div className="lp-task-actions">{tryAgain}</div>
      ) : (
        <div className="lp-task-actions">
          {checkButton}
          <button type="button" className="ml-btn ml-btn--tertiary ml-btn--md" onClick={hint} disabled={solved || hints >= task.hints.length} aria-keyshortcuts="H">
            <Icon name="bulb" size={18} /> {hintLabel}
          </button>
          {resetAndShow}
        </div>
      )}
    </section>
  );
}
