/** Non-chart figures of the Learn Chart Kit: formulas that light up box by box, bars and decision flows. */
import { useState } from "react";
import { parseNumericAnswer, type FlowNode, type FormulaBox, type MarkRole } from "@market-lab/academy";
import { Icon, cx } from "../components/ui";

/** A formula in boxes (`100.00 ÷ 2.00 = 50`). Boxes up to `lit` are lit; the answer box can be an input. */
export function Formula({
  boxes,
  operators,
  lit = boxes.length,
  value,
  onValue,
  state,
}: {
  boxes: FormulaBox[];
  operators: string[];
  lit?: number;
  value?: string;
  onValue?: (v: string) => void;
  state?: "idle" | "correct" | "incorrect";
}) {
  return (
    <div className="k-formula" role="group" aria-label="Formula">
      {boxes.map((b, i) => (
        <span key={i} className="k-formula-part">
          {i > 0 && (
            <span className="k-formula-op" aria-hidden="true">
              {operators[i - 1] ?? "="}
            </span>
          )}
          {b.answer !== undefined && onValue ? (
            <label className={cx("k-formula-box", "is-input", i < lit && "is-lit", state && `is-${state}`)}>
              <span className="ml-sr">Your answer{b.unit ? ` in ${b.unit}` : ""}</span>
              <input inputMode="decimal" value={value ?? ""} onChange={(e) => onValue(e.target.value)} placeholder="?" aria-invalid={state === "incorrect" || undefined} />
              {b.unit && <span className="k-formula-unit">{b.unit}</span>}
            </label>
          ) : (
            <span className={cx("k-formula-box", i < lit && "is-lit")}>{b.text}</span>
          )}
        </span>
      ))}
    </div>
  );
}

/** True when a typed answer matches a formula box. */
export function formulaCorrect(box: FormulaBox, raw: string): boolean {
  const n = parseNumericAnswer(raw);
  return n !== null && box.answer !== undefined && Math.abs(n - box.answer) <= (box.tolerance ?? 0) + 1e-9;
}

/** Horizontal bars with labels; values may be negative (losses) or positive. */
export function Bars({ bars, unit, lit = bars.length }: { bars: { label: string; value: number; role?: MarkRole }[]; unit?: string; lit?: number }) {
  const max = Math.max(...bars.map((b) => Math.abs(b.value)), 1);
  return (
    <div className="k-bars" role="img" aria-label={bars.map((b) => `${b.label}: ${b.value}${unit ?? ""}`).join("; ")}>
      {bars.map((b, i) => (
        <div key={i} className={cx("k-bar-row", i < lit && "is-lit")}>
          <span className="k-bar-label">{b.label}</span>
          <span className="k-bar-track">
            <span className={cx("k-bar-fill", `role-${b.role ?? (b.value < 0 ? "down" : "accent")}`)} style={{ width: `${(Math.abs(b.value) / max) * 100}%` }} />
          </span>
          <span className="k-bar-value num">
            {b.value > 0 && b.role === "up" ? "+" : ""}
            {b.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * A decision flow. Read-only, it shows the path; interactive, the learner answers Yes or No at each
 * question node and the chosen branch lights up. A wrong branch stays neutral and explains itself.
 */
export function Flow({ nodes, start, interactive = false, onDone }: { nodes: FlowNode[]; start: string; interactive?: boolean; onDone?: (firstTry: boolean) => void }) {
  // A node with one way on is a pause, one with no way on is an end, whatever its declared kind.
  const kindOf = (n: FlowNode): "question" | "pause" | "end" => (n.kind === "end" || (!n.yes && !n.no && !n.next) ? "end" : n.kind === "pause" || (!n.yes && !n.no) ? "pause" : "question");
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const [path, setPath] = useState<string[]>([start]);
  const [miss, setMiss] = useState<{ node: string; text: string } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const current = byId.get(path[path.length - 1]);
  const finished = !current || kindOf(current) === "end";

  const go = (choice: "yes" | "no" | "next") => {
    if (!current) return;
    if (interactive && current.correct && choice !== "next" && choice !== current.correct) {
      setMiss({ node: current.id, text: current.explain ?? "Look at the question again." });
      setMistakes((m) => m + 1);
      return;
    }
    setMiss(null);
    const nextId = choice === "next" ? current.next : choice === "yes" ? current.yes : current.no;
    if (!nextId) return;
    const next = [...path, nextId];
    setPath(next);
    const n = byId.get(nextId);
    if (!n || kindOf(n) === "end") onDone?.(mistakes === 0);
  };

  const shown = interactive ? path : nodes.map((n) => n.id);
  return (
    <div className="k-flow">
      <ol className="k-flow-list">
        {shown.map((id, i) => {
          const n = byId.get(id);
          if (!n) return null;
          const isCurrent = interactive && i === path.length - 1 && !finished;
          return (
            <li key={`${id}-${i}`} className={cx("k-flow-node", `is-${kindOf(n)}`, isCurrent && "is-current")}>
              <span className="k-flow-icon" aria-hidden="true">
                <Icon name={kindOf(n) === "end" ? "flag" : kindOf(n) === "pause" ? "pause" : "quiz"} size={14} />
              </span>
              <span className="k-flow-text">{n.text}</span>
              {interactive && i < path.length - 1 && kindOf(n) === "question" && (
                <span className="k-flow-chosen">{path[i + 1] === n.yes ? "Yes" : "No"}</span>
              )}
            </li>
          );
        })}
      </ol>
      {interactive && current && !finished && (
        <div className="k-flow-actions">
          {kindOf(current) === "pause" ? (
            <button type="button" className="ml-btn ml-btn--secondary ml-btn--sm" onClick={() => go("next")}>
              Continue
            </button>
          ) : (
            <>
              <button type="button" className="ml-btn ml-btn--secondary ml-btn--sm" onClick={() => go("yes")} aria-keyshortcuts="Y">
                Yes
              </button>
              <button type="button" className="ml-btn ml-btn--secondary ml-btn--sm" onClick={() => go("no")} aria-keyshortcuts="N">
                No
              </button>
            </>
          )}
        </div>
      )}
      {miss && (
        <p className="k-flow-miss" role="status">
          {miss.text}
        </p>
      )}
    </div>
  );
}
