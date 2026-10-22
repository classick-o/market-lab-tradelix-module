import { useEffect, useId, useRef, useState } from "react";
import { getTerm } from "@market-lab/academy";
import { Link } from "../router";
import { cx } from "./ui";

/**
 * A glossary term inside text: dotted underline; hover, focus or tap opens a small card with the
 * plain-words explanation and the precise definition (PLAN_LEARN §7.3). Esc closes it.
 */
export function Term({ id, children }: { id: string; children: string }) {
  const term = getTerm(id);
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const cardId = useId();

  useEffect(() => {
    if (!open) return;
    const r = ref.current?.getBoundingClientRect();
    if (r) setAbove(window.innerHeight - r.bottom < 220 && r.top > 220);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (!term) return <>{children}</>;
  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), 120);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 160);
  };
  return (
    <span ref={ref} className="ml-term-wrap" onMouseEnter={show} onMouseLeave={hide}>
      <button type="button" className="ml-term" aria-expanded={open} aria-controls={cardId} onClick={() => setOpen((o) => !o)} onFocus={show} onBlur={hide}>
        {children}
      </button>
      {open && (
        <span id={cardId} role="tooltip" className={cx("ml-term-card", above && "is-above")} onMouseEnter={show} onMouseLeave={hide}>
          <b className="ml-term-card-title">
            {term.term}
            {term.aka?.length ? <span className="ml-term-card-aka"> · {term.aka.join(", ")}</span> : null}
          </b>
          <span className="ml-term-card-plain">{term.plain}</span>
          <span className="ml-term-card-def">{term.definition}</span>
          <Link to="/learn/glossary" className="ml-term-card-link">
            Open in glossary
          </Link>
        </span>
      )}
    </span>
  );
}
