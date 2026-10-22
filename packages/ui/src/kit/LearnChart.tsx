/**
 * Learn Chart Kit: the one chart every Learn figure, exercise and widget is drawn with.
 * Content describes candles and layers as data (`ChartSpec`); roles map to the colour tokens in
 * styles/screens/kit.css, so nothing here picks a colour.
 */
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ChartLayer, ChartSpec } from "@market-lab/academy";
import { cx } from "../components/ui";
import { describeChart } from "./describe";
import { fitRange, makeFrame, p2, sma, type Frame } from "./frame";

export function useWidth<T extends HTMLElement>(fallback = 640): [React.RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth || fallback);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const width = Math.round(entries[0].contentRect.width);
      if (width > 0) setW(width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fallback]);
  return [ref, w];
}

export interface LearnChartProps {
  spec: ChartSpec;
  /** Layers added on top of `spec.layers` (figure steps, live widget levels). */
  layers?: readonly ChartLayer[];
  /** Candles shown; the rest sit under the veil. Defaults to `spec.visible`, then all. */
  visible?: number;
  height?: number;
  /** Extra prices the range must include (e.g. where a draggable level may go). */
  include?: readonly number[];
  className?: string;
  /** Interactive overlays (draggable levels, hotspots) drawn with the same frame. */
  children?: (frame: Frame) => ReactNode;
  /** Overrides the generated description. */
  label?: string;
  /** Highlight one candle (e.g. the answer of a hotspot). */
  highlight?: number | null;
  /** Overrides of the spec's style and scale (figure steps switch them). */
  style?: ChartSpec["style"];
  scale?: ChartSpec["scale"];
}

export function LearnChart({ spec, layers = [], visible, height, include = [], className, children, label, highlight = null, style, scale }: LearnChartProps) {
  const [wrap, width] = useWidth<HTMLDivElement>();
  const h = height ?? spec.height ?? 240;
  const all = useMemo(() => [...(spec.layers ?? []), ...layers], [spec.layers, layers]);
  const [lo, hi] = useMemo(() => {
    const [a, b] = fitRange(spec, all);
    return [Math.min(a, ...include), Math.max(b, ...include)];
  }, [spec, all, include]);
  const drawStyle = style ?? spec.style ?? "candle";
  const log = (scale ?? spec.scale) === "log";
  // A volume pane takes the bottom quarter; prices use the rest.
  const volH = spec.volume ? Math.round(h * 0.24) : 0;
  const frame = useMemo(() => makeFrame(width, h - volH, spec.candles.length, lo, hi, log), [width, h, volH, spec.candles.length, lo, hi, log]);
  const maxVol = spec.volume ? Math.max(1, ...spec.candles.map((c) => c.v ?? 0)) : 1;
  const shown = Math.min(spec.candles.length, visible ?? spec.visible ?? spec.candles.length);
  const titleId = useId();
  const desc = label ?? describeChart(spec, all, shown);

  // Newly revealed candles fade in one after another (CSS handles reduced motion).
  const prevShown = useRef(shown);
  const [revealFrom, setRevealFrom] = useState<number | null>(null);
  useEffect(() => {
    if (shown > prevShown.current) setRevealFrom(prevShown.current);
    prevShown.current = shown;
  }, [shown]);

  return (
    <div ref={wrap} className={cx("k-chart", className)}>
      <svg width={frame.width} height={h} viewBox={`0 0 ${frame.width} ${h}`} role="img" aria-labelledby={titleId}>
        <title id={titleId}>{desc}</title>
        <Grid frame={frame} />
        {/* The axis goes under the layers, so price chips cover the tick labels they sit on. */}
        <Axis frame={frame} />
        {all.filter((l) => l.kind === "zone").map((l, i) => (
          <Layer key={`z${i}`} layer={l} frame={frame} spec={spec} />
        ))}
        {!spec.hideCandles && drawStyle === "line" && shown > 1 && (
          <g className="k-line k-price-line role-accent">
            <path d={linePath(spec.candles.slice(0, shown).map((c, i) => ({ x: frame.x(i), y: frame.y(c.c) })))} />
          </g>
        )}
        {!spec.hideCandles && drawStyle === "bar" && (
          <g className="k-bars-ohlc">
            {spec.candles.slice(0, shown).map((c, i) => {
              const x = frame.x(i);
              const t = Math.max(2, Math.min(6, frame.slot * 0.3));
              return (
                <g key={i} className={cx("k-ohlc", c.c >= c.o ? "is-up" : "is-down", highlight === i && "is-highlight")}>
                  <line x1={x} x2={x} y1={frame.y(c.h)} y2={frame.y(c.l)} />
                  <line x1={x - t} x2={x} y1={frame.y(c.o)} y2={frame.y(c.o)} />
                  <line x1={x} x2={x + t} y1={frame.y(c.c)} y2={frame.y(c.c)} />
                </g>
              );
            })}
          </g>
        )}
        {spec.volume && (
          <g className="k-volume" aria-hidden="true">
            {spec.candles.slice(0, shown).map((c, i) => {
              const bh = ((c.v ?? 0) / maxVol) * (volH - 8);
              const bw = Math.max(2, Math.min(14, frame.slot * 0.62));
              return <rect key={i} className={c.c >= c.o ? "is-up" : "is-down"} x={frame.x(i) - bw / 2} y={h - 4 - bh} width={bw} height={Math.max(0.5, bh)} />;
            })}
          </g>
        )}
        <g className="k-candles">
          {!spec.hideCandles && drawStyle === "candle" && spec.candles.slice(0, shown).map((c, i) => {
            const up = c.c >= c.o;
            const x = frame.x(i);
            const bw = Math.max(2, Math.min(14, frame.slot * 0.62));
            const top = frame.y(Math.max(c.o, c.c));
            const bot = frame.y(Math.min(c.o, c.c));
            const delay = revealFrom !== null && i >= revealFrom ? (i - revealFrom) * 35 : undefined;
            return (
              <g key={i} className={cx("k-candle", up ? "is-up" : "is-down", highlight === i && "is-highlight", delay !== undefined && "is-new")} style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}>
                <line x1={x} x2={x} y1={frame.y(c.h)} y2={frame.y(c.l)} />
                <rect x={x - bw / 2} y={top} width={bw} height={Math.max(1.5, bot - top)} rx={1} />
              </g>
            );
          })}
        </g>
        {all.filter((l) => l.kind !== "zone").map((l, i) => (
          <Layer key={`l${i}`} layer={l} frame={frame} spec={spec} />
        ))}
        {shown < spec.candles.length && <Veil frame={frame} from={shown} />}
        {children?.(frame)}
      </svg>
    </div>
  );
}

function Grid({ frame }: { frame: Frame }) {
  return (
    <g className="k-grid" aria-hidden="true">
      {frame.ticks.map((t) => (
        <line key={t} x1={frame.plotLeft} x2={frame.plotRight} y1={frame.y(t)} y2={frame.y(t)} />
      ))}
    </g>
  );
}

function Axis({ frame }: { frame: Frame }) {
  const decimals = frame.max - frame.min < 2 ? 2 : frame.max - frame.min < 20 ? 1 : 0;
  return (
    <g className="k-axis" aria-hidden="true">
      {frame.ticks.map((t) => (
        <text key={t} x={frame.plotRight + 8} y={frame.y(t)} dy="0.35em">
          {t.toFixed(decimals)}
        </text>
      ))}
    </g>
  );
}

function Veil({ frame, from }: { frame: Frame; from: number }) {
  const id = useId();
  const x = frame.plotLeft + frame.slot * from;
  return (
    <g className="k-veil" aria-hidden="true">
      <defs>
        <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" />
        </pattern>
      </defs>
      <rect x={x} y={frame.plotTop} width={frame.plotRight - x} height={frame.plotBottom - frame.plotTop} fill={`url(#${id})`} />
      <line className="k-veil-edge" x1={x} x2={x} y1={frame.plotTop} y2={frame.plotBottom} />
      {frame.plotRight - x > 60 && (
        <text x={(x + frame.plotRight) / 2} y={(frame.plotTop + frame.plotBottom) / 2} textAnchor="middle">
          Unknown
        </text>
      )}
    </g>
  );
}

function linePath(points: { x: number; y: number }[]): string {
  return points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("");
}

function Layer({ layer: l, frame, spec }: { layer: ChartLayer; frame: Frame; spec: ChartSpec }) {
  switch (l.kind) {
    case "zone": {
      const y1 = frame.y(Math.max(l.from, l.to));
      const y2 = frame.y(Math.min(l.from, l.to));
      return (
        <g className={cx("k-zone", `role-${l.role}`)}>
          <rect x={frame.plotLeft} y={y1} width={frame.plotRight - frame.plotLeft} height={Math.max(1, y2 - y1)} />
          {l.label && (
            <text x={frame.plotLeft + 6} y={y1 + 12}>
              {l.label}
            </text>
          )}
        </g>
      );
    }
    case "level":
      return <LevelLine frame={frame} price={l.price} role={l.role} label={l.label} chip={l.chip !== false} />;
    case "line":
    case "ma": {
      const values = l.kind === "ma" ? sma(spec.candles, l.period) : l.values;
      const segments: { x: number; y: number }[][] = [[]];
      values.forEach((v, i) => {
        if (v === null || v === undefined) {
          if (segments[segments.length - 1].length) segments.push([]);
        } else segments[segments.length - 1].push({ x: frame.x(i), y: frame.y(v) });
      });
      const role = l.role ?? (l.kind === "ma" ? "concept" : "accent");
      const last = [...values].reverse().findIndex((v) => v !== null);
      const lastIdx = last < 0 ? -1 : values.length - 1 - last;
      return (
        <g className={cx("k-line", `role-${role}`, l.kind === "line" && l.dashed && "is-dashed")}>
          {segments.filter((s) => s.length > 1).map((s, i) => (
            <path key={i} d={linePath(s)} />
          ))}
          {l.label && lastIdx >= 0 && (
            <text x={frame.x(lastIdx) + 6} y={frame.y(values[lastIdx] as number) - 6}>
              {l.label}
            </text>
          )}
        </g>
      );
    }
    case "path":
      return (
        <g className={cx("k-line", `role-${l.role ?? "accent"}`, l.dashed && "is-dashed")}>
          <path d={linePath(l.points.map((p) => ({ x: frame.x(p.index), y: frame.y(p.price) })))} />
          {l.label && l.points.length > 0 && (
            <text x={frame.x(l.points[l.points.length - 1].index) + 6} y={frame.y(l.points[l.points.length - 1].price) - 6}>
              {l.label}
            </text>
          )}
        </g>
      );
    case "marker": {
      const c = spec.candles[l.index];
      const price = l.price ?? (c ? (l.at === "low" ? c.l : l.at === "open" ? c.o : l.at === "close" ? c.c : c.h) : 0);
      const x = frame.x(l.index);
      const y = frame.y(price);
      // Labels sit beside the candle (not on it): to the right, or to the left near the right edge.
      const off = Math.max(2, Math.min(14, frame.slot * 0.62)) / 2 + 7;
      const left = x + off + 90 > frame.plotRight;
      return (
        <g className={cx("k-marker", `role-${l.role ?? "accent"}`)}>
          <circle cx={x} cy={y} r={3.5} />
          {l.label && (
            <text x={left ? x - off : x + off} y={y} dy="0.35em" textAnchor={left ? "end" : "start"}>
              {l.label}
            </text>
          )}
        </g>
      );
    }
    case "bracket": {
      const x = l.index !== undefined ? frame.x(l.index) + frame.slot * 0.6 : frame.plotRight - 10;
      const y1 = frame.y(Math.max(l.from, l.to));
      const y2 = frame.y(Math.min(l.from, l.to));
      return (
        <g className={cx("k-bracket", `role-${l.role ?? "neutral"}`)}>
          <path d={`M${x - 4},${y1}H${x}V${y2}H${x - 4}`} />
          <text x={x + 5} y={(y1 + y2) / 2} dy="0.35em">
            {l.label}
          </text>
        </g>
      );
    }
  }
}

/** A horizontal level with its label on the left and a price chip on the right axis. */
export function LevelLine({ frame, price, role, label, chip = true, className }: { frame: Frame; price: number; role: string; label?: string; chip?: boolean; className?: string }) {
  const y = frame.y(price);
  return (
    <g className={cx("k-level", `role-${role}`, className)}>
      <line x1={frame.plotLeft} x2={frame.plotRight} y1={y} y2={y} />
      {label && (
        <text className="k-level-label" x={frame.plotLeft + 6} y={y - 5}>
          {label}
        </text>
      )}
      {chip && (
        <g className="k-chip" transform={`translate(${frame.plotRight + 2},${y - 9})`}>
          <rect width={PAD_CHIP} height={18} rx={3} />
          <text x={PAD_CHIP / 2} y={9} dy="0.35em" textAnchor="middle">
            {p2(price)}
          </text>
        </g>
      )}
    </g>
  );
}
const PAD_CHIP = 58;
