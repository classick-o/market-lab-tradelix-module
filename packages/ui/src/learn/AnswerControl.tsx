/** The controls a learner answers with in a hook or a prediction: choices, a slider, a number, a tap on a chart. */
import { useId } from "react";
import { parseNumericAnswer, type AnswerControl as Control } from "@market-lab/academy";
import { Rich } from "../components/Page";
import { Icon, cx } from "../components/ui";
import { Hotspots, LearnChart } from "../kit";
import { useKeys } from "./context";

export type AnswerValue = string | number | null;

const fmt = (v: number, step?: number) => (step !== undefined && step < 1 ? v.toFixed(Math.min(2, String(step).split(".")[1]?.length ?? 2)) : String(v));

/** How the learner's answer reads in text ("{yours}" in a recap). */
export function answerText(c: Control, v: AnswerValue): string {
  if (v === null || v === "") return "nothing";
  if (c.kind === "choice") return c.choices.find((x) => x.id === v)?.label ?? String(v);
  if (c.kind === "tap") return c.zones.find((z) => z.id === v)?.label ?? String(v);
  const n = typeof v === "number" ? v : parseNumericAnswer(v);
  if (n === null) return String(v);
  const text = c.kind === "slider" ? fmt(n, c.step) : String(n);
  return c.unit ? `${text} ${c.unit}` : text;
}

/** True or false when the control has an answer; null when the question is open (no right answer). */
export function answerCorrect(c: Control, v: AnswerValue): boolean | null {
  if (c.answer === undefined) return null;
  if (v === null || v === "") return false;
  if (c.kind === "choice" || c.kind === "tap") return v === c.answer;
  const n = typeof v === "number" ? v : parseNumericAnswer(v);
  return n !== null && Math.abs(n - c.answer) <= (c.tolerance ?? 0) + 1e-9;
}

/** Feedback written for the learner's specific answer, if any. */
export function answerFeedback(c: Control, v: AnswerValue): string | undefined {
  if (v === null || v === "") return undefined;
  if (c.kind === "choice") return c.choices.find((x) => x.id === v)?.feedback;
  if (c.kind === "tap") return c.zones.find((z) => z.id === v)?.feedback;
  if (c.kind === "slider" && c.feedback) {
    const n = typeof v === "number" ? v : parseNumericAnswer(v);
    if (n === null) return undefined;
    return c.feedback.find((f) => n >= f.from - 1e-9 && n <= f.to + 1e-9)?.text;
  }
  if (c.kind === "numeric" && c.feedback) {
    const n = typeof v === "number" ? v : parseNumericAnswer(v);
    if (n === null) return undefined;
    return c.feedback.find((f) => Math.abs(f.value - n) < 0.005)?.text;
  }
  return undefined;
}

export function hasAnswer(c: Control, v: AnswerValue): boolean {
  if (v === null || v === "") return false;
  if (c.kind === "numeric") return parseNumericAnswer(String(v)) !== null;
  return true;
}

export function AnswerControlView({
  control: c,
  value,
  onChange,
  locked,
  reveal,
  label,
}: {
  control: Control;
  value: AnswerValue;
  onChange: (v: AnswerValue) => void;
  /** The answer is in: no more changes. */
  locked?: boolean;
  /** Show which answer was right (only once locked). */
  reveal?: boolean;
  label: string;
}) {
  const id = useId();
  useKeys(
    c.kind === "choice" && !locked
      ? Object.fromEntries(c.choices.slice(0, 9).map((ch, i) => [String(i + 1), () => (onChange(ch.id), true)]))
      : {},
  );

  if (c.kind === "choice") {
    return (
      <div className="lp-choices" role="radiogroup" aria-label={label}>
        {c.choices.map((ch, i) => {
          const on = value === ch.id;
          const right = reveal && c.answer === ch.id;
          const wrong = reveal && on && c.answer !== undefined && c.answer !== ch.id;
          return (
            <button
              key={ch.id}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={locked && !on && !right}
              className={cx("lp-choice", on && "is-on", right && "is-right", wrong && "is-wrong", locked && "is-locked")}
              onClick={() => !locked && onChange(ch.id)}
            >
              <span className="lp-choice-key num" aria-hidden="true">
                {i + 1}
              </span>
              <span className="lp-choice-label">
                <Rich text={ch.label} />
              </span>
              {right && <Icon name="check" size={16} className="lp-choice-mark" />}
            </button>
          );
        })}
      </div>
    );
  }

  if (c.kind === "slider") {
    const v = typeof value === "number" ? value : c.start ?? c.min;
    const pct = (x: number) => ((x - c.min) / (c.max - c.min)) * 100;
    return (
      <div className={cx("lp-slider", locked && "is-locked")}>
        <label htmlFor={id} className="lp-slider-value num">
          {fmt(v, c.step)}
          {c.unit && <span className="lp-slider-unit"> {c.unit}</span>}
        </label>
        <div className="lp-slider-track">
          <input
            id={id}
            type="range"
            min={c.min}
            max={c.max}
            step={c.step}
            value={v}
            disabled={locked}
            aria-label={label}
            aria-valuetext={answerText(c, v)}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          {reveal && c.answer !== undefined && (
            <span className="lp-slider-answer" style={{ left: `${pct(c.answer)}%` }}>
              <span className="num">{fmt(c.answer, c.step)}</span>
            </span>
          )}
        </div>
        <div className="lp-slider-ends num" aria-hidden="true">
          <span>{fmt(c.min, c.step)}</span>
          <span>{fmt(c.max, c.step)}</span>
        </div>
      </div>
    );
  }

  if (c.kind === "numeric") {
    return (
      <label className={cx("lp-numeric", locked && "is-locked")}>
        <span className="ml-sr">{label}</span>
        <input
          inputMode="decimal"
          autoComplete="off"
          value={value === null ? "" : String(value)}
          disabled={locked}
          placeholder="Your answer"
          onChange={(e) => onChange(e.target.value)}
        />
        {c.unit && <span className="lp-numeric-unit">{c.unit}</span>}
      </label>
    );
  }

  return (
    <div className="lp-tap">
      <LearnChart spec={c.chart} label={label}>
        {(frame) => <Hotspots frame={frame} zones={c.zones} spec={c.chart} chosen={typeof value === "string" ? value : null} correct={reveal ? c.answer ?? null : null} onTap={(z) => !locked && onChange(z)} disabled={locked} />}
      </LearnChart>
      <p className="lp-tap-hint ml-muted">{value ? `Selected: ${answerText(c, value)}` : "Tap the chart, or Tab to a point and press Enter."}</p>
    </div>
  );
}
