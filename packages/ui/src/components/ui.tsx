import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

// ─── Icons ─────────────────────────────────────────────────────────────────
// One family: 24px grid, 1.5 stroke, round caps. Filled glyphs only for media controls.

const PATHS: Record<string, string> = {
  play: "M8 5.5v13l10.5-6.5z",
  pause: "M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z",
  next: "M6.5 5.5v13L15 12zM16.5 5.5h2v13h-2z",
  skip: "M4.5 5.5v13L11 12zM12 5.5v13l6.5-6.5zM18.5 5.5h1.5v13h-1.5z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6.5 6.5l11 11M17.5 6.5l-11 11",
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "arrow-left": "M19 12H5M11 6l-6 6 6 6",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-right": "M9 6l6 6-6 6",
  lock: "M7.5 10.5V8a4.5 4.5 0 019 0v2.5M5.5 10.5h13v9.5h-13z",
  replay: "M4.5 12a7.5 7.5 0 107.5-7.5 7.4 7.4 0 00-5.3 2.2L4.5 9M4.5 4.5V9H9",
  info: "M12 11v5.5M12 7.75h.01M12 3a9 9 0 110 18 9 9 0 010-18z",
  alert: "M12 9v4.5M12 16.75h.01M10.3 4.4L2.9 17.5A2 2 0 004.6 20.5h14.8a2 2 0 001.7-3L13.7 4.4a2 2 0 00-3.4 0z",
  gear: "M12 9.25a2.75 2.75 0 110 5.5 2.75 2.75 0 010-5.5zM19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 00-2-1.2L14.3 3h-4l-.3 2.7a7 7 0 00-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 000 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 002 1.2l.3 2.7h4l.3-2.7a7 7 0 002-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z",
  menu: "M4 7h16M4 12h16M4 17h16",
  flask: "M9.5 3.5h5M10.5 3.5v5.5L5.4 18a1.7 1.7 0 001.5 2.5h10.2a1.7 1.7 0 001.5-2.5L13.5 9V3.5M7.5 14.5h9",
  book: "M5 4.5h10a3 3 0 013 3v12H8a3 3 0 01-3-3zM5 16.5a3 3 0 013-3h10",
  target: "M12 3v4M12 17v4M3 12h4M17 12h4M12 9.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z",
  download: "M12 4v11M7 10l5 5 5-5M5 19.5h14",
  trash: "M5 7h14M10 4h4M7 7l.8 12.2a1.5 1.5 0 001.5 1.3h5.4a1.5 1.5 0 001.5-1.3L17 7",
  eye: "M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12zM12 9.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z",
  chart: "M4 19.5h16M7 15.5l3.5-4.5 3 2.5 5-6.5",
  layers: "M12 4l8.5 4.5L12 13 3.5 8.5zM3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5",
  compass: "M12 3a9 9 0 110 18 9 9 0 010-18zM15.5 8.5l-2 5-5 2 2-5z",
  pen: "M4.5 19.5l1-4.5L16 4.5l3.5 3.5L9 18.5zM13.5 7l3.5 3.5",
  sparkle: "M12 4l1.6 4.9L18.5 10.5l-4.9 1.6L12 17l-1.6-4.9L5.5 10.5l4.9-1.6z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  flag: "M5.5 21V4M5.5 4.5h11l-2.2 4 2.2 4h-11",
  candles: "M7 3v3M7 14.5V18M5 6h4v8.5H5zM17 6v3M17 16.5V20M15 9h4v7.5h-4z",
  candle: "M12 3v4M12 17v4M9.5 7h5v10h-5z",
  notebook: "M6.5 3.5h11a1.5 1.5 0 011.5 1.5v14a1.5 1.5 0 01-1.5 1.5h-11zM10 8h5.5M10 11.5h5.5M4 7h3.5M4 12h3.5M4 17h3.5",
  cap: "M2.5 9.5L12 5l9.5 4.5L12 14zM6.5 11.5v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-4.5M21.5 9.5V15",
  trophy: "M8 4h8v5.5a4 4 0 01-8 0zM8 6H5v1.5a3 3 0 003 3M16 6h3v1.5a3 3 0 01-3 3M12 13.5V17M8.5 20.5h7M10 17h4v3.5h-4z",
  shield: "M12 3.5l7 2.5v5.5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z",
  "shield-check": "M12 3.5l7 2.5v5.5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6zM9 12l2 2 4-4",
  scale: "M12 4v16M8 20h8M5 7h14M5 7l-2.5 6a2.5 2.5 0 005 0zM19 7l-2.5 6a2.5 2.5 0 005 0z",
  balance: "M12 4v16M8 20h8M5 7h14M5 7l-2.5 6a2.5 2.5 0 005 0zM19 7l-2.5 6a2.5 2.5 0 005 0z",
  brain: "M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z",
  pie: "M11 4.1A8 8 0 1019.9 13H11zM14 3.2a8 8 0 016.8 6.8H14z",
  branch: "M6 7.5v9M6 12c0-2.5 2.5-3.5 5-3.5h3.5M4 5.5a2 2 0 104 0 2 2 0 00-4 0zM4 18.5a2 2 0 104 0 2 2 0 00-4 0zM14.5 8.5a2 2 0 104 0 2 2 0 00-4 0z",
  flame: "M12 21c3.5 0 6-2.4 6-5.8 0-3.7-2.8-5.6-3.8-8.7-.4 1.9-1.4 3-2.7 3.6.3-2.5-.6-5.3-3-6.6.2 2.9-1.4 4.6-2.7 6.2C4.6 11.2 6 14 6 15.2 6 18.6 8.5 21 12 21z",
  calendar: "M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4",
  sun: "M12 8a4 4 0 100 8 4 4 0 000-8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4",
  star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z",
  medal: "M8 3.5l2.5 6.5M16 3.5l-2.5 6.5M12 21a5 5 0 100-10 5 5 0 000 10z",
  route: "M6 20a2 2 0 100-4 2 2 0 000 4zM18 8a2 2 0 100-4 2 2 0 000 4zM6 16V9.5A2.5 2.5 0 018.5 7H16M18 8v6.5a2.5 2.5 0 01-2.5 2.5H8",
  map: "M3.5 6.5l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2zM9 4.5v13M15 6.5v13",
  bolt: "M13 3L5 13.5h6L10 21l8-10.5h-6z",
  radar: "M12 3l8.5 6.2-3.2 10H6.7L3.5 9.2zM12 8l4 2.9-1.5 4.6h-5L8 10.9z",
  trend: "M3.5 17l6-6 4 4 7-7.5M15 7.5h5.5V13",
  "check-circle": "M12 3a9 9 0 110 18 9 9 0 010-18zM8 12.5l2.7 2.7L16 9.8",
  library: "M5 4.5v15M9 4.5v15M12.5 5.5l4.5 14M3.5 19.5h17",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20.5c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5",
  logout: "M14.5 4.5h4a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5h-4M10 16l-4-4 4-4M6 12h9.5",
  bell: "M6 16.5V11a6 6 0 0112 0v5.5l1.5 2h-15zM10 20.5h4",
  card: "M3.5 6h17v12h-17zM3.5 10h17M7 14.5h4",
  globe: "M12 3a9 9 0 110 18 9 9 0 010-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z",
  search: "M10.5 17a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM15.5 15.5l5 5",
  panel: "M4 4.5h16v15H4zM9.5 4.5v15",
  home: "M4 10.5L12 4l8 6.5V20h-5.5v-6h-5v6H4z",
  clock: "M12 3a9 9 0 110 18 9 9 0 010-18zM12 7.5V12l3 2",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  calculator: "M6 3.5h12v17H6zM8.5 6.5h7v3h-7zM9 13h.01M12 13h.01M15 13h.01M9 16.5h.01M12 16.5h.01M15 16.5h.01",
  wallet: "M4 7.5h15.5v12H4zM4 7.5l11.5-3.5v3.5M15.5 13.5h.01",
  list: "M8.5 6.5h11M8.5 12h11M8.5 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01",
  history: "M4 12a8 8 0 108-8 8 8 0 00-5.7 2.3L4 8.5M4 4v4.5h4.5M12 8v4.5l3 1.5",
  split: "M6 4v6a4 4 0 004 4h8M14 10l4 4-4 4M6 20v-4",
  bars: "M5 20V11M10 20V4M15 20v-7M20 20V9",
  quiz: "M9.1 9a3 3 0 015.8 1c0 2-3 2.5-3 4.5M12 17.75h.01M12 3a9 9 0 110 18 9 9 0 010-18z",
  clipboard: "M8.5 3.5h7v3h-7zM6 5h2.5M15.5 5H18v15.5H6V5M9 12.5l2 2 4-4",
  dots: "M5.5 12h.01M12 12h.01M18.5 12h.01",
  filter: "M4 6h16M7 12h10M10 18h4",
  external: "M14 4.5h5.5V10M19.5 4.5L11 13M17.5 14v5.5h-13v-13H10",
  heart: "M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0112 7.2 4.5 4.5 0 0119.5 10c0 5.4-7.5 10-7.5 10z",
};

export function Icon({ name, size = 18, className }: { name: keyof typeof PATHS | string; size?: number; className?: string }) {
  const filled = name === "play" || name === "pause" || name === "next" || name === "skip";
  const dotted = name === "dots";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cx("ml-icon", className)}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={dotted ? 2.6 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name] ?? ""} />
    </svg>
  );
}

export function Spinner({ size = 16 }: { size?: number }) {
  return <span className="ml-spinner" style={{ width: size, height: size }} aria-hidden="true" />;
}

// ─── Buttons ───────────────────────────────────────────────────────────────

type Variant = "primary" | "secondary" | "tertiary" | "destructive";

export function Button({
  variant = "secondary",
  size = "md",
  block,
  loading,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  ...rest
}: {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  block?: boolean;
  loading?: boolean;
  iconLeft?: string;
  iconRight?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cx("ml-btn", `ml-btn--${variant}`, `ml-btn--${size}`, block && "ml-btn--block", loading && "is-loading", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size={size === "sm" ? 14 : 16} /> : iconLeft && <Icon name={iconLeft} size={size === "sm" ? 16 : 18} />}
      <span className="ml-btn-label">{children}</span>
      {iconRight && !loading && <Icon name={iconRight} size={size === "sm" ? 16 : 18} className="ml-btn-trail" />}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  size = "md",
  variant = "tertiary",
  className,
  ...rest
}: { icon: string; label: string; size?: "sm" | "md"; variant?: "secondary" | "tertiary" } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" aria-label={label} title={label} className={cx("ml-iconbtn", `ml-iconbtn--${size}`, `ml-iconbtn--${variant}`, className)} {...rest}>
      <Icon name={icon} size={size === "sm" ? 16 : 18} />
    </button>
  );
}

// ─── Labels ────────────────────────────────────────────────────────────────

export function Tag({ children, variant = "default", className }: { children: ReactNode; variant?: "default" | "outline" | "inverse" | "danger"; className?: string }) {
  return <span className={cx("ml-tag", `ml-tag--${variant}`, className)}>{children}</span>;
}

export function SimBadge({ compact }: { compact?: boolean }) {
  return (
    <span className={cx("ml-sim", compact && "ml-sim--compact")} title="Everything here is simulated. Virtual money only.">
      <span className="ml-sim-dot" aria-hidden="true" />
      <span className="ml-sim-label">Simulation</span>
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="ml-kbd">{children}</kbd>;
}

// ─── Selection controls ────────────────────────────────────────────────────

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  size = "md",
  block,
}: {
  value: T;
  options: { value: T; label: ReactNode; disabled?: boolean }[];
  onChange: (v: T) => void;
  label: string;
  size?: "sm" | "md";
  block?: boolean;
}) {
  return (
    <div className={cx("ml-seg", size === "sm" && "ml-seg--sm", block && "ml-seg--block")} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          disabled={o.disabled}
          className={cx("ml-seg-item", value === o.value && "is-on")}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Chips({
  options,
  selected,
  onToggle,
  label,
  single,
}: {
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  label: string;
  /** One choice only: rendered as a radio group. */
  single?: boolean;
}) {
  return (
    <div className={cx("ml-chips", single && "ml-chips--single")} role={single ? "radiogroup" : "group"} aria-label={label}>
      {options.map((o) => {
        const on = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            role={single ? "radio" : undefined}
            aria-checked={single ? on : undefined}
            aria-pressed={single ? undefined : on}
            className={cx("ml-chip", on && "is-on")}
            onClick={() => onToggle(o.id)}
          >
            <span className="ml-chip-check" aria-hidden="true">
              {!single && <Icon name="check" size={12} />}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function RadioRow({
  selected,
  onSelect,
  title,
  description,
  name,
  trailing,
}: {
  selected: boolean;
  onSelect: () => void;
  title: ReactNode;
  description?: ReactNode;
  name: string;
  trailing?: ReactNode;
}) {
  return (
    <label className={cx("ml-radio", selected && "is-on")}>
      <input type="radio" name={name} checked={selected} onChange={onSelect} />
      <span className="ml-radio-mark" aria-hidden="true" />
      <span className="ml-radio-body">
        <span className="ml-radio-title">{title}</span>
        {description && <span className="ml-radio-desc">{description}</span>}
      </span>
      {trailing}
    </label>
  );
}

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <label className={cx("ml-check", checked && "is-on")}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="ml-check-box" aria-hidden="true">
        <Icon name="check" size={14} />
      </span>
      <span className="ml-check-label">{label}</span>
    </label>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  items,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { value: T; label: string; count?: number }[];
  label: string;
}) {
  return (
    <div className="ml-tabs" role="tablist" aria-label={label}>
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          role="tab"
          aria-selected={value === it.value}
          className={cx("ml-tab", value === it.value && "is-on")}
          onClick={() => onChange(it.value)}
        >
          {it.label}
          {it.count !== undefined && <span className="ml-tab-count">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}

// ─── Forms ─────────────────────────────────────────────────────────────────

export function TextField({
  label,
  hint,
  error,
  trailing,
  className,
  big,
  ...input
}: { label: ReactNode; hint?: ReactNode; error?: string | null; trailing?: ReactNode; big?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={cx("ml-field", big && "ml-field--big", error && "is-invalid", className)}>
      <label htmlFor={id} className="ml-field-label">
        {label}
      </label>
      <div className="ml-field-control">
        <input id={id} aria-invalid={error ? true : undefined} aria-describedby={hint || error ? `${id}-d` : undefined} {...input} />
        {trailing}
      </div>
      {(error || hint) && (
        <span id={`${id}-d`} className={cx("ml-field-hint", error && "is-error")}>
          {error ?? hint}
        </span>
      )}
    </div>
  );
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  rows = 3,
  maxLength,
  placeholder,
}: {
  label: ReactNode;
  hint?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="ml-field">
      <label htmlFor={id} className="ml-field-label">
        {label}
      </label>
      <textarea id={id} rows={rows} maxLength={maxLength} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {(hint || maxLength) && (
        <span className="ml-field-hint">
          {hint}
          {maxLength && value.length > maxLength * 0.8 ? ` ${value.length}/${maxLength}` : ""}
        </span>
      )}
    </div>
  );
}

export function InlineError({ children }: { children: ReactNode }) {
  return (
    <p className="ml-inline-error" role="alert">
      <Icon name="alert" size={16} />
      <span>{children}</span>
    </p>
  );
}

export function Note({ children, icon = "info" }: { children: ReactNode; icon?: string }) {
  return (
    <p className="ml-note">
      <Icon name={icon} size={16} />
      <span>{children}</span>
    </p>
  );
}

// ─── Overlays ──────────────────────────────────────────────────────────────

/**
 * Modal dialog on the native <dialog> element: focus is trapped while open and returned to the
 * trigger on close; Escape and backdrop clicks dismiss; the exit animation runs before closing.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = "center",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  variant?: "center" | "sheet" | "full";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();
  const [state, setState] = useState<"open" | "closing" | "closed">("closed");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open) {
      if (!d.open) d.showModal();
      document.documentElement.classList.add("ml-scroll-lock");
      setState("open");
      return;
    }
    if (d.open) {
      setState("closing");
      const t = window.setTimeout(() => {
        d.close();
        setState("closed");
        document.documentElement.classList.remove("ml-scroll-lock");
      }, 170);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => () => document.documentElement.classList.remove("ml-scroll-lock"), []);

  return (
    <dialog
      ref={ref}
      className={cx("ml-dialog", `ml-dialog--${variant}`)}
      data-state={state}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ml-dialog-panel">
        <div className="ml-dialog-head">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && (
              <p id={descId} className="ml-dialog-desc">
                {description}
              </p>
            )}
          </div>
          <IconButton icon="x" label="Close" size="sm" onClick={onClose} />
        </div>
        {children && <div className="ml-dialog-body">{children}</div>}
        {footer && <div className="ml-dialog-foot">{footer}</div>}
      </div>
    </dialog>
  );
}

// ─── Data display ──────────────────────────────────────────────────────────

export function ScoreRing({ value, size = 120, label }: { value: number | null; size?: number; label: string }) {
  const stroke = 3;
  const r = size / 2 - stroke * 2;
  const c = 2 * Math.PI * r;
  const v = value ?? 0;
  return (
    <div
      className="ml-ring"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${value === null ? "not scored" : `${value} out of 100`}`}
    >
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className="ml-ring-track" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ml-ring-value"
          strokeWidth={stroke}
          strokeDasharray={`${(c * v) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ml-ring-num" style={{ fontSize: size * 0.3 }}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export function Meter({ value, label, muted }: { value: number; label: string; muted?: boolean }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={cx("ml-meter", muted && "is-muted")} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={label}>
      <div className="ml-meter-fill" style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  );
}

export function Stat({ label, value, unit, sub, size = "md" }: { label: string; value: ReactNode; unit?: string; sub?: ReactNode; size?: "md" | "lg" | "xl" }) {
  return (
    <div className={cx("ml-stat", `ml-stat--${size}`)}>
      <span className="ml-stat-label">{label}</span>
      <span className="ml-stat-value num">
        {value}
        {unit && <span className="ml-stat-unit">{unit}</span>}
      </span>
      {sub && <span className="ml-stat-sub">{sub}</span>}
    </div>
  );
}

export function KeyValues({ items, className }: { items: { label: ReactNode; value: ReactNode; emphasis?: boolean; alert?: boolean }[]; className?: string }) {
  return (
    <dl className={cx("ml-kv", className)}>
      {items.map((it, i) => (
        <div key={i} className={cx(it.emphasis && "is-emphasis", it.alert && "is-alert")}>
          <dt>{it.label}</dt>
          <dd className="num">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Empty({ icon = "compass", title, children, action }: { icon?: string; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="ml-empty">
      <span className="ml-empty-icon">
        <Icon name={icon} size={22} />
      </span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function SectionHead({ eyebrow, title, children, action }: { eyebrow?: string; title: ReactNode; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="ml-section-head">
      <div>
        {eyebrow && <span className="ml-eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {children && <p className="ml-section-sub">{children}</p>}
      </div>
      {action}
    </div>
  );
}
