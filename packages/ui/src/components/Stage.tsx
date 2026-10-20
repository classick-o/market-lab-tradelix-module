import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "../router";
import { Icon, cx } from "./ui";

/** True when the user (or their OS, if the setting follows the system) asked for reduced motion. */
export const ReducedMotionContext = createContext(false);
export const useReducedMotion = () => useContext(ReducedMotionContext);

export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(() => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/** Height for the main chart: tall on desktop, compact on phones. */
export function useChartHeight(): number {
  const phone = useMediaQuery("(max-width: 720px)");
  const short = useMediaQuery("(max-height: 760px)");
  return phone ? 260 : short ? 360 : 440;
}

export function StageBar({ back, eyebrow, title, children }: { back: { to: string; label: string }; eyebrow: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="ml-stagebar">
      <Link to={back.to} className="ml-back" aria-label={`Back to ${back.label}`}>
        <Icon name="arrow-left" size={18} />
        <span>{back.label}</span>
      </Link>
      <div className="ml-stagebar-title">
        <span className="ml-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      <div className="ml-stagebar-actions">{children}</div>
    </div>
  );
}

export interface HudItem {
  label: string;
  value: ReactNode;
  wide?: boolean;
}

export function Hud({ items, label }: { items: HudItem[]; label: string }) {
  return (
    <dl className="ml-hud" aria-label={label}>
      {items.map((it) => (
        <div key={it.label} className={cx(it.wide && "is-wide")}>
          <dt>{it.label}</dt>
          <dd className="num">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ChartTitle({ symbol, meta }: { symbol: string; meta: string }) {
  return (
    <span className="ml-chart-symbol">
      {symbol}
      <span>{meta}</span>
    </span>
  );
}
