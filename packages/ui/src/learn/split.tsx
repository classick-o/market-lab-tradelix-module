/**
 * Split screens (a Codecademy-style layout, in preview on a few lessons): the text and the
 * instructions on the left, the lab on the right. A beat inside a split screen sends each part to
 * its pane with ToLearn and ToLab; outside one, both render in place.
 */
import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon, cx } from "../components/ui";

/** Lessons that open in the split layout unless the learner switches back to the classic one. */
export const SPLIT_PREVIEW = new Set(["0.1.4"]);

export type Slots = { learn: HTMLElement; lab: HTMLElement };
export const SlotsContext = createContext<Slots | null>(null);
export const useSlots = () => useContext(SlotsContext);

function To({ pane, className, children }: { pane: keyof Slots; className?: string; children: ReactNode }) {
  const slots = useSlots();
  // One wrapper per part, always rendered, so the parts keep their order in the pane.
  return slots ? createPortal(<div className={cx("lp-part", className)}>{children}</div>, slots[pane]) : <>{children}</>;
}
export const ToLearn = (p: { className?: string; children: ReactNode }) => <To pane="learn" {...p} />;
export const ToLab = (p: { className?: string; children: ReactNode }) => <To pane="lab" {...p} />;

/** A beat's prompt: as it is on a classic screen, the instructions on a split one. */
export function Prompt({ done, children }: { done: boolean; children: ReactNode }) {
  const slots = useSlots();
  if (!slots) return <p className="lp-prompt">{children}</p>;
  return (
    <ToLearn>
      <Instructions done={done}>
        <p className="lp-instr-text">{children}</p>
      </Instructions>
    </ToLearn>
  );
}

/** The step the lab asks for, ticked once it's done. */
export function Instructions({ done, children }: { done: boolean; children: ReactNode }) {
  return (
    <section className={cx("lp-instr", done && "is-done")} aria-label="Instructions">
      <h3 className="lp-kicker">
        <Icon name="target" size={14} /> Instructions
      </h3>
      <div className="lp-instr-step">
        <span className="lp-instr-mark num" aria-label={done ? "Done" : "Step 1"}>
          {done ? <Icon name="check" size={13} /> : 1}
        </span>
        <div>{children}</div>
      </div>
    </section>
  );
}
