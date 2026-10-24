/** Small pieces shared by lesson screens: beat headings and feedback lines. */
import type { ReactNode } from "react";
import { Rich } from "../components/Page";
import { Icon, cx } from "../components/ui";
import { useSlots } from "./split";

export function BeatTitle({ children, kicker }: { children?: ReactNode; kicker?: string }) {
  // On a split screen the panes carry the headings.
  const split = !!useSlots();
  if (split || (!children && !kicker)) return null;
  return (
    <header className="lp-beat-head">
      {kicker && <span className="lp-kicker">{kicker}</span>}
      {children && <h2 className="lp-beat-title">{children}</h2>}
    </header>
  );
}

/** Feedback under an interaction: sage when right, neutral when not (never a red bar, PLAN_LEARN §5.1). */
export function Feedback({ tone, title, children }: { tone: "right" | "wrong" | "info"; title?: string; children?: ReactNode }) {
  return (
    <div className={cx("lp-feedback", `is-${tone}`)} role="status" aria-live="polite">
      <Icon name={tone === "right" ? "check-circle" : tone === "wrong" ? "info" : "bulb"} size={18} />
      <div>
        {title && <b>{title} </b>}
        {children}
      </div>
    </div>
  );
}

export function Para({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="lp-text">
      <Rich text={text} />
    </p>
  );
}
