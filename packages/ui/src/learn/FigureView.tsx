/**
 * A Learn figure built step by step (PLAN_LEARN §4.2, §8.3): each step adds layers or candles and has
 * one sentence under it. Tap, Space or Enter shows the next step; the last step completes the figure.
 */
import { useEffect, useMemo, useState } from "react";
import type { ChartLayer, FigureSpec } from "@market-lab/academy";
import { Rich } from "../components/Page";
import { Icon, cx } from "../components/ui";
import { Bars, Flow, Formula, LearnChart, formulaCorrect } from "../kit";
import { Diagram } from "../components/Diagrams";
import { useKeys } from "./context";

function stepCount(f: FigureSpec): number {
  if (f.kind === "chart") return f.steps.length;
  if (f.kind === "formula" || f.kind === "bars" || f.kind === "flow") return f.steps?.length ?? 0;
  return 0;
}

export function FigureView({
  figure: f,
  onDone,
  all = false,
  base = false,
}: {
  figure: FigureSpec;
  /** Called once when the last step is shown (and a formula's answer box is right). */
  onDone?: () => void;
  /** Show every step at once (Read mode, revisits). */
  all?: boolean;
  /** Show only the chart's base layers, before any step (a prediction not yet answered). */
  base?: boolean;
}) {
  const n = stepCount(f);
  const [step, setStep] = useState(all ? Math.max(0, n - 1) : 0);
  const [typed, setTyped] = useState("");
  const answerBox = f.kind === "formula" ? f.boxes.find((b) => b.answer !== undefined) : undefined;
  const [formulaOk, setFormulaOk] = useState<boolean | null>(all && answerBox ? true : null);
  const last = n === 0 || step >= n - 1;
  const needsInput = !!answerBox && formulaOk !== true;
  const interactiveFlow = f.kind === "flow" && f.interactive;
  const [flowDone, setFlowDone] = useState(all || !interactiveFlow);
  const finished = !base && last && !needsInput && flowDone;

  useEffect(() => {
    if (all) setStep(Math.max(0, n - 1));
  }, [all, n]);
  useEffect(() => {
    if (finished) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const advance = () => {
    if (base || last) return false;
    setStep((s) => Math.min(n - 1, s + 1));
    return true;
  };
  useKeys({ Enter: advance, " ": advance });

  const layers = useMemo<ChartLayer[]>(() => (f.kind === "chart" && !base ? f.steps.slice(0, step + 1).flatMap((s) => s.layers ?? []) : []), [f, step, base]);
  const visible = f.kind === "chart" && !base ? f.steps.slice(0, step + 1).reduce<number | undefined>((v, s) => s.visible ?? v, undefined) : undefined;
  const caption = f.kind === "chart" ? f.steps[step]?.text : f.kind !== "diagram" ? f.steps?.[step] : f.caption;

  let body: React.ReactNode = null;
  if (f.kind === "chart") body = <LearnChart spec={f.chart} layers={layers} visible={visible} />;
  else if (f.kind === "formula") {
    const lit = n ? Math.round(((step + 1) / n) * f.boxes.length) : f.boxes.length;
    body = (
      <div className="lp-formula">
        <Formula boxes={f.boxes} operators={f.operators} lit={lit} value={typed} onValue={all ? undefined : (v) => (setTyped(v), setFormulaOk(null))} state={formulaOk === null ? "idle" : formulaOk ? "correct" : "incorrect"} />
        {answerBox && !all && last && formulaOk !== true && (
          <button type="button" className="ml-btn ml-btn--secondary ml-btn--sm" onClick={() => setFormulaOk(formulaCorrect(answerBox, typed))} disabled={!typed.trim()}>
            Check
          </button>
        )}
        {formulaOk === false && (
          <p className="lp-inline-feedback" role="status">
            Not quite. Work it out from the boxes to the left.
          </p>
        )}
      </div>
    );
  } else if (f.kind === "bars") body = <Bars bars={f.bars} unit={f.unit} lit={n ? Math.round(((step + 1) / n) * f.bars.length) : f.bars.length} />;
  else if (f.kind === "flow") body = <Flow nodes={f.nodes} start={f.start} interactive={!!f.interactive && !all} onDone={() => setFlowDone(true)} />;
  else body = <Diagram id={f.diagram} />;

  return (
    <figure className={cx("lp-figure", `lp-figure--${f.kind}`)}>
      <div
        className={cx("lp-figure-stage", !last && !base && "is-steppable")}
        onClick={(e) => {
          // Taps on the figure advance it, but not taps on its own controls.
          if ((e.target as HTMLElement).closest("button, input, [role=slider], [role=button]")) return;
          advance();
        }}
      >
        {body}
      </div>
      {!base && (caption || n > 1) && (
        <figcaption className="lp-figure-caption">
          {n > 1 && (
            <span className="lp-steps" aria-label={`Step ${step + 1} of ${n}`}>
              {Array.from({ length: n }, (_, i) => (
                <span key={i} className={cx("lp-step-dot", i <= step && "is-on")} />
              ))}
            </span>
          )}
          {caption && (
            <span key={step} className="lp-figure-text" aria-live="polite">
              <Rich text={caption} />
            </span>
          )}
          {!last && (
            <button type="button" className="lp-next-step" onClick={() => advance()}>
              Next step <Icon name="arrow-right" size={14} />
            </button>
          )}
        </figcaption>
      )}
    </figure>
  );
}
