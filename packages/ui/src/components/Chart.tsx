import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode, type RefObject } from "react";
import { formatPrice, type Candle } from "@market-lab/engine";
import { cx } from "./ui";

export type LineKind = "entry" | "stop" | "target" | "limit" | "level" | "level-strong";

export interface ChartLine {
  price: number;
  label: string;
  kind: LineKind;
  draft?: boolean;
  /** The opponent's line in a duel (drawn in the rival colour). */
  rival?: boolean;
}

export interface ChartMarker {
  step: number;
  price: number;
  kind: "buy" | "sell" | "exit-stop" | "exit-target" | "exit";
  /** The opponent's fill in a duel: rival colour, drawn a little further from the candle. */
  rival?: boolean;
}

export interface ChartProps {
  candles: readonly Candle[];
  /** Last visible candle (inclusive). Nothing after it is ever rendered. */
  visibleTo: number;
  label: string;
  title?: ReactNode;
  height?: number;
  /** Fixed end of the time axis. The unrevealed part is drawn as a veil, so candles never shift sideways. */
  fixedEnd?: number;
  windowStart?: number;
  /** Rolling charts (no fixedEnd): empty slots kept to the right of the newest candle. */
  futureSlots?: number;
  minBarWidth?: number;
  highlightCandle?: number;
  zone?: { from: number; to: number; label?: string };
  lines?: ChartLine[];
  markers?: ChartMarker[];
  decisionSteps?: { step: number; label: string }[];
  /** Shade candles after this step as "after your decision". */
  revealedAfter?: number;
  pickMode?: boolean;
  picked?: number | null;
  onPick?: (price: number, step: number) => void;
  /** While playing, the "Now" cursor glides for exactly one tick. */
  tickMs?: number;
  animateNewest?: boolean;
  showHeader?: boolean;
  /** Indicator lines (e.g. moving averages), one value per candle; null where undefined. */
  overlays?: { id: string; label: string; values: readonly (number | null)[]; tone: 1 | 2 }[];
  showVolume?: boolean;
  showGrid?: boolean;
  /** Label for candle i on the time axis (defaults to 1-hour candles). */
  timeLabelOf?: (i: number) => string;
}

const PAD = { top: 12, right: 76, bottom: 26, left: 4 };

function niceStep(range: number, ticks: number): number {
  const raw = range / ticks;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  return (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
}

export function timeLabel(i: number): string {
  const h = i % 24;
  if (h === 0) return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][Math.floor(i / 24) % 7];
  return `${String(h).padStart(2, "0")}:00`;
}

function useWidth<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setW(Math.floor(entries[0].contentRect.width)));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

const LINE_LABEL_TAG: Record<LineKind, string> = {
  entry: "ml-ptag--entry",
  stop: "ml-ptag--stop",
  target: "ml-ptag--target",
  limit: "ml-ptag--limit",
  level: "ml-ptag--level",
  "level-strong": "ml-ptag--level",
};

export function Chart(props: ChartProps) {
  const {
    candles,
    visibleTo,
    label,
    title,
    height = 420,
    fixedEnd,
    futureSlots = 0,
    minBarWidth = 4,
    highlightCandle,
    zone,
    lines = [],
    markers = [],
    decisionSteps = [],
    revealedAfter,
    pickMode,
    picked,
    onPick,
    tickMs,
    animateNewest,
    showHeader = true,
    overlays = [],
    showVolume = true,
    showGrid = true,
    timeLabelOf = timeLabel,
  } = props;
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<{ i: number; y: number } | null>(null);
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const uid = useId().replace(/:/g, "");
  const yMemo = useRef<{ candles: readonly Candle[]; start: number; lo: number; hi: number } | null>(null);

  const plotW = Math.max(10, width - PAD.left - PAD.right);
  const plotH = height - PAD.top - PAD.bottom;
  const volH = Math.round(plotH * 0.14);
  const priceH = plotH - volH - 6;
  const last = Math.min(visibleTo, candles.length - 1);

  const geo = useMemo(() => {
    const capacity = Math.max(12, Math.floor(plotW / minBarWidth));
    let start: number;
    let end: number;
    if (fixedEnd !== undefined) {
      end = Math.min(fixedEnd, candles.length - 1);
      start = props.windowStart ?? Math.max(0, end + 1 - capacity);
    } else {
      end = last + futureSlots;
      start = props.windowStart ?? Math.max(0, end + 1 - capacity);
    }
    start = Math.min(start, last);
    const shown = candles.slice(start, last + 1);
    const slotW = plotW / Math.max(1, end - start + 1);

    // Price domain from visible candles only; it only ever widens during a session, so candles don't jump.
    let lo = Math.min(...shown.map((c) => c.l));
    let hi = Math.max(...shown.map((c) => c.h));
    const m = yMemo.current;
    if (m && m.candles === candles && m.start === start) {
      lo = Math.min(lo, m.lo);
      hi = Math.max(hi, m.hi);
    }
    yMemo.current = { candles, start, lo, hi };
    const span0 = hi - lo || hi * 0.02;
    for (const l of lines) {
      if (l.price > lo - span0 && l.price < hi + span0) {
        lo = Math.min(lo, l.price);
        hi = Math.max(hi, l.price);
      }
    }
    if (picked != null) {
      lo = Math.min(lo, picked);
      hi = Math.max(hi, picked);
    }
    const pad = (hi - lo) * 0.08 || 50;
    lo -= pad;
    hi += pad;
    const y = (price: number) => PAD.top + ((hi - price) / (hi - lo)) * priceH;
    const priceAt = (py: number) => hi - ((py - PAD.top) / priceH) * (hi - lo);
    const x = (i: number) => PAD.left + (i - start + 0.5) * slotW;
    const maxV = Math.max(1, ...shown.map((c) => c.v));
    const step = niceStep(hi - lo, 4);
    const ticks: number[] = [];
    for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) ticks.push(Math.round(t));
    return { start, end, shown, slotW, y, x, priceAt, maxV, ticks };
  }, [candles, last, plotW, priceH, minBarWidth, fixedEnd, futureSlots, lines, picked, props.windowStart]);

  const { start, end, shown, slotW, y, x, priceAt, maxV, ticks } = geo;
  const bodyW = Math.max(1, Math.min(12, slotW * 0.62));
  const timeEvery = Math.max(1, Math.ceil(64 / slotW));
  const plotRight = PAD.left + plotW;
  const nowX = PAD.left + (last - start + 1) * slotW;
  const hasFuture = end > last;

  const indexFromX = (px: number) => Math.max(start, Math.min(last, start + Math.floor((px - PAD.left) / slotW)));
  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    if (py < PAD.top || py > PAD.top + priceH || px < PAD.left || px > Math.min(plotRight, nowX)) {
      setHover(null);
      return;
    }
    setHover({ i: indexFromX(px), y: py });
  };
  const onClick = () => {
    if (pickMode && hover && onPick) onPick(Math.round(priceAt(hover.y)), hover.i);
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    setFocusIdx((cur) => {
      const c = cur ?? last;
      if (e.key === "Home") return start;
      if (e.key === "End") return last;
      return Math.max(start, Math.min(last, c + (e.key === "ArrowLeft" ? -1 : 1)));
    });
  };

  const readIdx = hover?.i ?? focusIdx ?? last;
  const read = candles[readIdx];
  const prev = candles[readIdx - 1];
  const change = read && prev ? ((read.c - prev.c) / prev.c) * 100 : null;
  const lastC = candles[last];

  const summary = useMemo(() => {
    if (shown.length === 0) return "";
    const first = shown[0];
    const endC = shown[shown.length - 1];
    const ups = shown.filter((c) => c.c >= c.o).length;
    const ch = ((endC.c - first.o) / first.o) * 100;
    return `${label}. ${shown.length} candles. Price moved from ${formatPrice(first.o)} to ${formatPrice(endC.c)} (${ch >= 0 ? "+" : ""}${ch.toFixed(2)}%), high ${formatPrice(Math.max(...shown.map((c) => c.h)))}, low ${formatPrice(Math.min(...shown.map((c) => c.l)))}. ${ups} up and ${shown.length - ups} down candles. Use the arrow keys to read candles one by one.`;
  }, [shown, label]);

  const glide = tickMs ? { transitionDuration: `${tickMs}ms`, transitionTimingFunction: "linear" } : undefined;

  return (
    <div className={cx("ml-chart", pickMode && "is-pick")}>
      {showHeader && (
        <div className="ml-chart-head">
          <div className="ml-chart-title">{title}</div>
          {read && (
            <div className="ml-chart-ohlc num" aria-hidden="true">
              <span className="ml-chart-time">{timeLabelOf(readIdx)}</span>
              <span>
                <i>O</i>
                {formatPrice(read.o)}
              </span>
              <span>
                <i>H</i>
                {formatPrice(read.h)}
              </span>
              <span>
                <i>L</i>
                {formatPrice(read.l)}
              </span>
              <span>
                <i>C</i>
                {formatPrice(read.c)}
              </span>
              {change !== null && <span className="ml-chart-change">{`${change >= 0 ? "+" : "−"}${Math.abs(change).toFixed(2)}%`}</span>}
            </div>
          )}
        </div>
      )}
      <div className="ml-chart-canvas" ref={wrapRef} style={{ height }}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={label}
            aria-describedby={`${uid}-sum`}
            tabIndex={0}
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
            onClick={onClick}
            onKeyDown={onKey}
            onBlur={() => setFocusIdx(null)}
          >
            <defs>
              <clipPath id={`${uid}-clip`}>
                <rect x={PAD.left} y={0} width={plotW} height={PAD.top + plotH} />
              </clipPath>
              <pattern id={`${uid}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="7" className="ml-hatch" />
              </pattern>
            </defs>

            {ticks.map((t) => (
              <g key={t}>
                {showGrid && <line x1={PAD.left} x2={plotRight} y1={y(t)} y2={y(t)} className="ml-grid" />}
                <text x={plotRight + 10} y={y(t) + 4} className="ml-axis">
                  {formatPrice(t)}
                </text>
              </g>
            ))}

            {zone && zone.to >= start && (
              <g className="ml-zone">
                <rect x={x(Math.max(zone.from, start)) - slotW / 2} y={PAD.top} width={(Math.min(zone.to, last) - Math.max(zone.from, start) + 1) * slotW} height={priceH} />
                {zone.label && (
                  <text x={x(Math.max(zone.from, start)) - slotW / 2 + 8} y={PAD.top + 16}>
                    {zone.label}
                  </text>
                )}
              </g>
            )}

            {revealedAfter !== undefined && revealedAfter < last && (
              <g className="ml-after">
                <rect x={x(Math.max(revealedAfter, start)) + slotW / 2} y={PAD.top} width={(last - Math.max(revealedAfter, start)) * slotW} height={plotH} />
                <text x={x(Math.max(revealedAfter, start)) + slotW / 2 + 8} y={PAD.top + 36}>
                  After your decision
                </text>
              </g>
            )}

            {highlightCandle !== undefined && highlightCandle >= start && highlightCandle <= last && (
              <rect
                x={x(highlightCandle) - Math.max(slotW, 16) / 2 - 3}
                y={y(candles[highlightCandle].h) - 10}
                width={Math.max(slotW, 16) + 6}
                height={y(candles[highlightCandle].l) - y(candles[highlightCandle].h) + 20}
                rx={7}
                className="ml-highlight"
              />
            )}

            {showVolume && shown.map((c, k) => {
              const i = start + k;
              const h = Math.max(1, (c.v / maxV) * volH);
              return <rect key={`v${i}`} x={x(i) - bodyW / 2} y={PAD.top + plotH - h} width={bodyW} height={h} className={c.c >= c.o ? "ml-vol up" : "ml-vol down"} />;
            })}

            {shown.map((c, k) => {
              const i = start + k;
              const up = c.c >= c.o;
              const top = y(Math.max(c.o, c.c));
              const bot = y(Math.min(c.o, c.c));
              return (
                <g key={i} className={cx("ml-candle", up ? "up" : "down", animateNewest && i === last && "is-new", readIdx === i && (hover || focusIdx !== null) && "is-read")}>
                  <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} />
                  <rect x={x(i) - bodyW / 2} y={top} width={bodyW} height={Math.max(1, bot - top)} />
                </g>
              );
            })}

            {overlays.map((o) => {
              let d = "";
              for (let i = start; i <= last; i++) {
                const v = o.values[i];
                if (v == null) continue;
                d += `${d === "" || o.values[i - 1] == null ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
              }
              return d ? <path key={o.id} d={d} className={cx("ml-overlay", `ml-overlay--${o.tone}`)} clipPath={`url(#${uid}-clip)`} /> : null;
            })}

            {decisionSteps
              .filter((d) => d.step >= start && d.step <= last)
              .map((d) => (
                <g key={`d${d.step}${d.label}`} className="ml-decision">
                  <line x1={x(d.step)} x2={x(d.step)} y1={PAD.top + 22} y2={PAD.top + plotH} />
                  <rect x={x(d.step) - 12} y={PAD.top} width={24} height={16} rx={4} />
                  <text x={x(d.step)} y={PAD.top + 11.5} textAnchor="middle">
                    {d.label}
                  </text>
                </g>
              ))}

            {/* Signature: the unrevealed future, behind a veil that recedes as candles appear. */}
            {hasFuture && (
              <g clipPath={`url(#${uid}-clip)`}>
                <g className="ml-veil" style={{ transform: `translateX(${nowX}px)`, ...glide }}>
                  <rect x={0} y={PAD.top} width={plotW + 40} height={plotH} fill={`url(#${uid}-hatch)`} className="ml-veil-fill" />
                  <line x1={0} x2={0} y1={PAD.top} y2={PAD.top + plotH} className="ml-now-line" />
                  <text x={8} y={decisionSteps.some((d) => d.step === last) ? PAD.top + 34 : PAD.top + 12} className="ml-now-label">
                    Now
                  </text>
                  {plotRight - nowX > 90 && (
                    <text x={16} y={PAD.top + priceH + 6 + volH / 2 + 4} className="ml-veil-label">
                      Unknown
                    </text>
                  )}
                </g>
              </g>
            )}

            {lines.map((l) => (
              <g key={`${l.kind}${l.label}${l.price}`} className={cx("ml-pline", `ml-pline--${l.kind}`, l.draft && "is-draft", l.rival && "is-rival")}>
                <line x1={PAD.left} x2={plotRight} y1={y(l.price)} y2={y(l.price)} />
                <text x={plotRight - 8} y={y(l.price) - 6} textAnchor="end" className="ml-pline-label">
                  {l.label}
                </text>
                <rect x={plotRight + 4} y={y(l.price) - 10} width={PAD.right - 6} height={20} rx={5} className={cx("ml-ptag", LINE_LABEL_TAG[l.kind], l.rival && "is-rival")} />
                <text x={plotRight + 10} y={y(l.price) + 4} className={cx("ml-ptag-text", LINE_LABEL_TAG[l.kind], l.rival && "is-rival")}>
                  {formatPrice(l.price)}
                </text>
              </g>
            ))}

            {markers
              .filter((m) => m.step >= start && m.step <= last)
              .map((m, idx) => {
                const cx0 = x(m.step);
                const cy = y(m.price);
                // The opponent's entry triangles sit one marker further out, so both stay visible on the same candle.
                const off = m.rival ? 11 : 0;
                const rival = m.rival && "is-rival";
                if (m.kind === "buy") return <path key={idx} d={`M${cx0},${cy + 4 + off} l-5.5,9 h11 z`} className={cx("ml-marker ml-marker--buy", rival)} />;
                if (m.kind === "sell") return <path key={idx} d={`M${cx0},${cy - 4 - off} l-5.5,-9 h11 z`} className={cx("ml-marker ml-marker--sell", rival)} />;
                return <circle key={idx} cx={cx0} cy={cy} r={m.rival ? 5.5 : 4.5} className={cx("ml-marker", `ml-marker--${m.kind}`, rival)} />;
              })}

            {lastC && (
              <g className="ml-last">
                <rect x={plotRight + 4} y={y(lastC.c) - 10} width={PAD.right - 6} height={20} rx={5} />
                <text x={plotRight + 10} y={y(lastC.c) + 4}>
                  {formatPrice(lastC.c)}
                </text>
              </g>
            )}

            {Array.from({ length: end - start + 1 }, (_, k) => start + k)
              .filter((i) => i % timeEvery === 0 && x(i) > PAD.left + 16 && x(i) < plotRight - 16)
              .map((i) => (
                <text key={`t${i}`} x={x(i)} y={height - 8} textAnchor="middle" className="ml-axis">
                  {timeLabelOf(i)}
                </text>
              ))}

            {picked != null && (
              <g className="ml-picked">
                <line x1={PAD.left} x2={plotRight} y1={y(picked)} y2={y(picked)} />
                <circle cx={highlightCandle !== undefined ? x(highlightCandle) : PAD.left + plotW / 2} cy={y(picked)} r={4.5} />
              </g>
            )}

            {hover && (
              <g className="ml-cross" pointerEvents="none">
                <line x1={x(hover.i)} x2={x(hover.i)} y1={PAD.top} y2={PAD.top + plotH} />
                <line x1={PAD.left} x2={plotRight} y1={hover.y} y2={hover.y} />
                <rect x={plotRight + 4} y={hover.y - 10} width={PAD.right - 6} height={20} rx={5} />
                <text x={plotRight + 10} y={hover.y + 4}>
                  {formatPrice(Math.round(priceAt(hover.y)))}
                </text>
              </g>
            )}
          </svg>
        )}
      </div>
      <p id={`${uid}-sum`} className="ml-sr">
        {summary}
      </p>
      <p className="ml-sr" aria-live="polite">
        {focusIdx !== null && read ? `${timeLabelOf(readIdx)}: open ${formatPrice(read.o)}, high ${formatPrice(read.h)}, low ${formatPrice(read.l)}, close ${formatPrice(read.c)}` : ""}
      </p>
    </div>
  );
}
