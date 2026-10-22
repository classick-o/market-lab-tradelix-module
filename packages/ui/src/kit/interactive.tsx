/** Interactive overlays for LearnChart: a level the learner drags, and tap zones (hotspots). */
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { TapZone } from "@market-lab/academy";
import { cx } from "../components/ui";
import { p2, type Frame } from "./frame";
import { LevelLine } from "./LearnChart";

const snap = (v: number, step: number) => Math.round(v / step) * step;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * A level the learner moves with the mouse, finger or keyboard (arrows ±step, Shift ±10 steps,
 * PageUp/PageDown ±10 steps). Snaps to `step`; follows the pointer without lag.
 */
export function DraggableLevel({
  frame,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  role,
  label,
  disabled,
  name,
}: {
  frame: Frame;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  role: string;
  label?: string;
  disabled?: boolean;
  /** Accessible name, e.g. "Stop price". */
  name: string;
}) {
  const [dragging, setDragging] = useState(false);
  const gRef = useRef<SVGGElement>(null);
  const set = (v: number) => onChange(Number(clamp(snap(v, step), min, max).toFixed(6)));
  const fromEvent = (e: PointerEvent) => {
    const svg = gRef.current?.ownerSVGElement;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    set(frame.price(e.clientY - r.top));
  };
  const onKey = (e: KeyboardEvent) => {
    if (disabled) return;
    const big = e.shiftKey ? 10 : 1;
    const map: Record<string, number> = { ArrowUp: step * big, ArrowRight: step * big, ArrowDown: -step * big, ArrowLeft: -step * big, PageUp: step * 10, PageDown: -step * 10 };
    if (e.key in map) {
      e.preventDefault();
      set(value + map[e.key]);
    } else if (e.key === "Home") {
      e.preventDefault();
      set(min);
    } else if (e.key === "End") {
      e.preventDefault();
      set(max);
    }
  };
  const y = frame.y(value);
  return (
    <g
      ref={gRef}
      className={cx("k-drag", `role-${role}`, dragging && "is-dragging", disabled && "is-disabled")}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={name}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={p2(value)}
      aria-disabled={disabled || undefined}
      onKeyDown={onKey}
      onPointerDown={(e) => {
        if (disabled) return;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        setDragging(true);
        fromEvent(e);
      }}
      onPointerMove={(e) => dragging && fromEvent(e)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      {/* A wide invisible band makes the line easy to grab on touch screens. */}
      <rect className="k-drag-hit" x={frame.plotLeft} y={y - 14} width={frame.plotRight - frame.plotLeft + 60} height={28} />
      <LevelLine frame={frame} price={value} role={role} label={label} className="is-draggable" />
      <g className="k-drag-handle" transform={`translate(${frame.plotRight - 18},${y})`} aria-hidden="true">
        <rect x={-10} y={-7} width={20} height={14} rx={3} />
        <path d="M-4,-2H4M-4,2H4" />
      </g>
    </g>
  );
}

/** Where a tap zone sits on the chart, as a rectangle. */
function zoneRect(z: TapZone, frame: Frame, spec: { candles: { h: number; l: number }[] }) {
  const band = 10;
  if (z.index !== undefined) {
    const c = spec.candles[z.index];
    const x = frame.x(z.index) - frame.slot / 2;
    if (z.price !== undefined) return { x, y: frame.y(z.price) - band, w: frame.slot, h: band * 2 };
    const top = frame.y(c ? c.h : frame.max);
    const bot = frame.y(c ? c.l : frame.min);
    return { x, y: top - 6, w: frame.slot, h: bot - top + 12 };
  }
  if (z.from !== undefined && z.to !== undefined) {
    const y1 = frame.y(Math.max(z.from, z.to));
    const y2 = frame.y(Math.min(z.from, z.to));
    return { x: frame.plotLeft, y: y1, w: frame.plotRight - frame.plotLeft, h: Math.max(band, y2 - y1) };
  }
  const y = frame.y(z.price ?? frame.min);
  return { x: frame.plotLeft, y: y - band, w: frame.plotRight - frame.plotLeft, h: band * 2 };
}

/**
 * Tap targets over a chart. Each zone is a focusable button (Tab, Enter/Space), at least 44 px tall
 * on touch screens through CSS padding; the chosen and the correct zone are outlined after answering.
 */
export function Hotspots({
  frame,
  zones,
  spec,
  chosen,
  correct,
  onTap,
  disabled,
}: {
  frame: Frame;
  zones: TapZone[];
  spec: { candles: { h: number; l: number }[] };
  chosen?: string | null;
  correct?: string | null;
  onTap: (id: string) => void;
  disabled?: boolean;
}) {
  return (
    <g className="k-hotspots">
      {zones.map((z) => {
        const r = zoneRect(z, frame, spec);
        return (
          <g
            key={z.id}
            className={cx("k-hotspot", chosen === z.id && "is-chosen", correct === z.id && "is-correct")}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={z.label}
            aria-pressed={chosen === z.id}
            aria-disabled={disabled || undefined}
            onClick={() => !disabled && onTap(z.id)}
            onKeyDown={(e) => {
              if (!disabled && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onTap(z.id);
              }
            }}
          >
            <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={4} />
          </g>
        );
      })}
    </g>
  );
}
