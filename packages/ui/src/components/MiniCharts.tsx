import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cx } from "./ui";

function useWidth(): [RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((e) => setW(Math.floor(e[0].contentRect.width)));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export interface LineSeries {
  id: string;
  label: string;
  values: (number | null)[];
  tone: "accent" | "blue" | "muted" | "pos" | "neg";
}

/**
 * A small line chart for trends (scores over sessions, equity over time). Includes a text
 * description for screen readers; the SVG itself is decorative.
 */
export function LineChart({
  series,
  height = 160,
  min,
  max,
  formatY = (v) => String(Math.round(v)),
  xLabels,
  description,
  baseline,
}: {
  series: LineSeries[];
  height?: number;
  min?: number;
  max?: number;
  formatY?: (v: number) => string;
  xLabels?: string[];
  description: string;
  baseline?: number;
}) {
  const [ref, width] = useWidth();
  const all = series.flatMap((s) => s.values.filter((v): v is number => v !== null));
  const n = Math.max(...series.map((s) => s.values.length), 1);
  let lo = min ?? Math.min(...all, baseline ?? Infinity);
  let hi = max ?? Math.max(...all, baseline ?? -Infinity);
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
    lo = 0;
    hi = 1;
  }
  if (hi === lo) {
    hi += 1;
    lo -= 1;
  }
  const pad = { l: 4, r: 44, t: 8, b: xLabels ? 20 : 6 };
  const w = Math.max(10, width - pad.l - pad.r);
  const h = height - pad.t - pad.b;
  const x = (i: number) => pad.l + (n === 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (v: number) => pad.t + ((hi - v) / (hi - lo)) * h;
  const ticks = [hi, (hi + lo) / 2, lo];
  const labelEvery = xLabels ? Math.max(1, Math.ceil((xLabels.length * 56) / Math.max(1, w))) : 1;

  return (
    <div className="ml-linechart" ref={ref} style={{ height }}>
      <p className="ml-sr">{description}</p>
      {width > 0 && (
        <svg width={width} height={height} aria-hidden="true">
          {ticks.map((t, i) => (
            <g key={i}>
              <line x1={pad.l} x2={pad.l + w} y1={y(t)} y2={y(t)} className="ml-lc-grid" />
              <text x={pad.l + w + 6} y={y(t) + 4} className="ml-lc-axis">
                {formatY(t)}
              </text>
            </g>
          ))}
          {baseline !== undefined && <line x1={pad.l} x2={pad.l + w} y1={y(baseline)} y2={y(baseline)} className="ml-lc-base" />}
          {series.map((s) => {
            let d = "";
            s.values.forEach((v, i) => {
              if (v === null) return;
              d += `${d === "" || s.values[i - 1] === null ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
            });
            return (
              <g key={s.id} className={cx("ml-lc-series", `ml-lc--${s.tone}`)}>
                <path d={d} />
                {s.values.map((v, i) => (v === null || n > 40 ? null : <circle key={i} cx={x(i)} cy={y(v)} r={2.5} />))}
              </g>
            );
          })}
          {xLabels?.map((l, i) =>
            i % labelEvery === 0 ? (
              <text key={i} x={x(i)} y={height - 4} textAnchor={n > 1 && i === 0 ? "start" : n > 1 && i === n - 1 ? "end" : "middle"} className="ml-lc-axis">
                {l}
              </text>
            ) : null,
          )}
        </svg>
      )}
    </div>
  );
}

export function Legend({ items }: { items: { label: string; tone: LineSeries["tone"] }[] }) {
  return (
    <ul className="ml-lc-legend">
      {items.map((i) => (
        <li key={i.label}>
          <span className={cx("ml-lc-swatch", `ml-lc--${i.tone}`)} aria-hidden="true" />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

/** Horizontal bars with labels and values, e.g. performance by scenario. */
export function BarList({ items, max = 100, format = (v) => String(Math.round(v)) }: { items: { label: ReactNode; value: number | null; note?: ReactNode }[]; max?: number; format?: (v: number) => string }) {
  return (
    <ul className="ml-barlist">
      {items.map((it, i) => (
        <li key={i}>
          <span className="ml-barlist-label">{it.label}</span>
          <span className="ml-barlist-track" aria-hidden="true">
            <span style={{ transform: `scaleX(${it.value === null ? 0 : Math.max(0, Math.min(1, it.value / max))})` }} />
          </span>
          <span className="ml-barlist-value num">{it.value === null ? "—" : format(it.value)}</span>
          {it.note && <span className="ml-barlist-note">{it.note}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Calendar heatmap of active days: columns are weeks, rows are Monday..Sunday. */
export function Heatmap({ weeks, label }: { weeks: { day: string; level: 0 | 1 | 2 | 3; title: string; future?: boolean }[][]; label: string }) {
  return (
    <div className="ml-heatmap" role="img" aria-label={label}>
      {weeks.map((w, i) => (
        <div key={i} className="ml-heatmap-col">
          {w.map((d) => (
            <span key={d.day} className={cx("ml-heat", `ml-heat--${d.level}`, d.future && "is-future")} title={d.title} />
          ))}
        </div>
      ))}
    </div>
  );
}
