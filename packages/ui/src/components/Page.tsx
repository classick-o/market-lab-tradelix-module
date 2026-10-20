import { Component, type ErrorInfo, type ReactNode } from "react";
import { formatSigned } from "@market-lab/engine";
import { NAV } from "../nav";
import { AVATARS, initialsOf } from "../host";
import { Link, useRouter } from "../router";
import { Button, Icon, cx } from "./ui";

/** Page title block. `actions` sit on the right on wide screens. */
export function PageHead({ eyebrow, title, sub, actions, back }: { eyebrow?: ReactNode; title: ReactNode; sub?: ReactNode; actions?: ReactNode; back?: { to: string; label: string } }) {
  return (
    <header className={cx("ml-page-head", Boolean(actions) && "ml-page-head--row")}>
      <div className="ml-page-head-main">
        {back && (
          <Link to={back.to} className="ml-back">
            <Icon name="arrow-left" size={16} />
            <span>{back.label}</span>
          </Link>
        )}
        {eyebrow && <span className="ml-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {sub && <p className="ml-page-sub">{sub}</p>}
      </div>
      {actions && <div className="ml-page-actions">{actions}</div>}
    </header>
  );
}

/**
 * Section tabs for a module (e.g. the five parts of Missions). Shown when the sidebar can't show
 * them: on tablets, phones, and when the sidebar is collapsed.
 */
export function SubNav({ module }: { module: string }) {
  const { path } = useRouter();
  const item = NAV.find((n) => n.id === module);
  if (!item?.children) return null;
  return (
    <nav className="ml-subnav" aria-label={`${item.label} sections`}>
      {item.children.map((c) => {
        const on = path === c.to || path.startsWith(`${c.to}/`);
        return (
          <Link key={c.id} to={c.to} className={cx("ml-subnav-link", on && "is-on")} aria-current={on ? "page" : undefined}>
            {c.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Simulated P&L: sign first, colour second (green/red), so colour is never the only cue. */
export function Pnl({ value, unit = true, className }: { value: number; unit?: boolean; className?: string }) {
  return (
    <span className={cx("num", value > 0 ? "ml-pos" : value < 0 ? "ml-neg" : "ml-flat", className)}>
      {formatSigned(value)}
      {unit && <span className="ml-unit"> vUSD</span>}
    </span>
  );
}

export function Avatar({ name, avatar, url, size = 32 }: { name: string; avatar: string; url?: string; size?: number }) {
  const color = AVATARS.find((a) => a.id === avatar)?.color ?? AVATARS[0].color;
  if (url) return <img className="ml-avatar" src={url} alt="" width={size} height={size} />;
  return (
    <span className="ml-avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }} aria-hidden="true">
      {initialsOf(name)}
    </span>
  );
}

/** Small circular progress indicator (daily goal, level). */
export function MiniRing({ value, size = 18, stroke = 2.5 }: { value: number; size?: number; stroke?: number }) {
  const r = size / 2 - stroke;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <svg width={size} height={size} className="ml-miniring" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="ml-miniring-track" />
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="ml-miniring-value" strokeDasharray={`${c * v} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
}

export function Card({ title, eyebrow, action, children, className, as: Tag = "section", ...rest }: { title?: ReactNode; eyebrow?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; as?: "section" | "div" | "article" } & { "aria-label"?: string }) {
  return (
    <Tag className={cx("ml-card", className)} {...rest}>
      {(title || eyebrow || action) && (
        <div className="ml-card-head">
          <div>
            {eyebrow && <span className="ml-eyebrow">{eyebrow}</span>}
            {title && <h2 className="ml-card-title">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Tag>
  );
}

export function StatTile({ label, value, sub, icon }: { label: string; value: ReactNode; sub?: ReactNode; icon?: string }) {
  return (
    <div className="ml-tile">
      <span className="ml-tile-label">
        {icon && <Icon name={icon} size={15} />}
        {label}
      </span>
      <span className="ml-tile-value num">{value}</span>
      {sub && <span className="ml-tile-sub">{sub}</span>}
    </div>
  );
}

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="ml-page" aria-busy="true" aria-live="polite">
      <span className="ml-sr">Loading…</span>
      <div className="ml-skel ml-skel--title" />
      <div className="ml-skel-grid">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="ml-skel ml-skel--card" />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", detail, onRetry }: { title?: string; detail?: string; onRetry?: () => void }) {
  return (
    <div className="ml-empty ml-empty--error" role="alert">
      <span className="ml-empty-icon">
        <Icon name="alert" size={22} />
      </span>
      <h2>{title}</h2>
      <p>{detail ?? "This section couldn't load. Your progress is safe; try again, or go back to the dashboard."}</p>
      <div className="ml-actions">
        {onRetry && (
          <Button variant="secondary" iconLeft="replay" onClick={onRetry}>
            Try again
          </Button>
        )}
        <Link to="/dashboard" className="ml-text-link">
          Go to the dashboard
        </Link>
      </div>
    </div>
  );
}

/** Catches rendering errors in one section, so the rest of the app keeps working. */
export class RouteBoundary extends Component<{ children: ReactNode; resetKey: string }, { error: Error | null; key: string }> {
  state = { error: null as Error | null, key: this.props.resetKey };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  static getDerivedStateFromProps(props: { resetKey: string }, state: { error: Error | null; key: string }) {
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Market Lab section failed to render", error, info.componentStack);
  }

  render() {
    if (this.state.error) return <ErrorState detail={this.state.error.message} onRetry={() => this.setState({ error: null })} />;
    return this.props.children;
  }
}

/** A row of filter chips with counts, rendered as a radio group. */
export function FilterChips<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; count?: number }[]; label: string }) {
  return (
    <div className="ml-filter" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} className={cx("ml-filter-chip", value === o.value && "is-on")} onClick={() => onChange(o.value)}>
          {o.label}
          {o.count !== undefined && <span className="ml-filter-count num">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function ProBadge() {
  return (
    <span className="ml-pro" title="Included with Pro">
      Pro
    </span>
  );
}

/** Inline `**bold**` markup used by the lesson content. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return <>{parts.map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p))}</>;
}
