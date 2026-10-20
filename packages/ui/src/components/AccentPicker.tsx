import { useId } from "react";
import { ACCENTS, accentVars, contrast, type Accent } from "../theme";
import { Button, Icon, Meter, ScoreRing, cx } from "./ui";

// A small, fixed sample of candles (x, open, close, high, low in SVG units) for the previews.
const SAMPLE: [number, number, number, number, number][] = [
  [10, 50, 46, 44, 53],
  [20, 46, 48, 43, 51],
  [30, 48, 42, 40, 50],
  [40, 42, 44, 39, 47],
  [50, 44, 40, 37, 46],
  [60, 40, 41, 36, 44],
  [70, 41, 36, 33, 43],
  [80, 36, 38, 32, 40],
  [90, 38, 33, 30, 40],
  [100, 33, 29, 26, 35],
  [110, 29, 31, 25, 33],
  [120, 31, 26, 22, 33],
  [130, 26, 22, 18, 28],
  [140, 22, 17, 14, 24],
];
const NOW_X = 146;

function Preview({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 220 64" className="ml-accent-preview" aria-hidden="true">
      <defs>
        <pattern id={`${uid}-h`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#1f1f1f" strokeWidth="1" />
        </pattern>
      </defs>
      <line x1="0" x2="220" y1="32" y2="32" stroke="#161616" />
      <rect x={NOW_X} y="0" width={220 - NOW_X} height="64" fill={`url(#${uid}-h)`} />
      {SAMPLE.map(([x, o, c, h, l]) => {
        const up = c < o; // SVG y grows downward
        return (
          <g key={x}>
            <line x1={x} x2={x} y1={h} y2={l} stroke={up ? "#cfcfcf" : "#8a8a8a"} strokeWidth="1" />
            <rect x={x - 3} y={Math.min(o, c)} width="6" height={Math.max(1, Math.abs(o - c))} fill={up ? "#e6e6e6" : "#2b2b2b"} stroke={up ? "none" : "#8a8a8a"} strokeWidth="1" />
          </g>
        );
      })}
      <line x1="0" x2="220" y1="20" y2="20" stroke="#f5f5f5" strokeOpacity="0.9" />
      <line x1="0" x2="220" y1="48" y2="48" stroke="#bdbdbd" strokeDasharray="5 3" />
      <line x1={NOW_X} x2={NOW_X} y1="0" y2="64" style={{ stroke: "var(--ml-accent-fg)" }} strokeOpacity="0.8" />
      <rect x={NOW_X - 10} y="3" width="20" height="12" rx="3" style={{ fill: "var(--ml-accent)" }} />
      <text x={NOW_X} y="11.5" textAnchor="middle" fontSize="8" fontWeight="700" style={{ fill: "var(--ml-accent-ink)" }}>
        D1
      </text>
      <text x={NOW_X + 8} y="60" fontSize="7" fontWeight="600" letterSpacing="1.5" style={{ fill: "var(--ml-accent-fg)" }}>
        NOW
      </text>
    </svg>
  );
}

function AccentCard({ accent, selected, onSelect, recommended }: { accent: Accent; selected: boolean; onSelect: () => void; recommended?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const ratio = contrast(accent.hex, "#0A0E16");
  return (
    <label className={cx("ml-accent-card", selected && "is-on")} style={accentVars(accent.hex)}>
      <input type="radio" name="ml-accent" checked={selected} onChange={onSelect} />
      <span className="ml-accent-head">
        <span className="ml-accent-swatch" aria-hidden="true" />
        <span className="ml-accent-name">
          <b>{accent.name}</b>
          <span className="num" title="Contrast against the black background">
            {accent.hex.toUpperCase()} · {ratio.toFixed(1)}:1
          </span>
        </span>
        <span className="ml-accent-check" aria-hidden="true">
          <Icon name="check" size={13} />
        </span>
      </span>
      <Preview uid={uid} />
      <span className="ml-accent-demo" aria-hidden="true">
        <Button variant="primary" size="sm" tabIndex={-1}>
          Start mission
        </Button>
        <ScoreRing value={82} size={34} label="Example score" />
        <span style={{ flex: 1 }}>
          <Meter value={0.62} label="Example progress" />
        </span>
      </span>
      <span className="ml-accent-note">
        {recommended && <strong className="ml-accent-rec">Recommended. </strong>}
        {accent.note}
        {accent.caution && <em> {accent.caution}</em>}
      </span>
    </label>
  );
}

/** Pick one accent colour; the whole module updates immediately. */
export function AccentPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="ml-accents" role="radiogroup" aria-label="Accent colour">
      {ACCENTS.map((a) => (
        <AccentCard key={a.id} accent={a} selected={value === a.id} onSelect={() => onChange(a.id)} recommended={a.id === "lime"} />
      ))}
    </div>
  );
}
