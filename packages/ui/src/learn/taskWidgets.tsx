/**
 * The interactive widgets in task mode. Each is controlled: it draws `state` (controls) and
 * `values` (controls + outputs from widget-math) and reports changes with `set`. Charts use the
 * Learn Chart Kit, so every widget shares one colour system.
 */
import { useId, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { evaluateCondition, fillTemplate, maStats, parseNumericAnswer, swingPoints, type CandleData, type ChartLayer, type ChartSpec, type TaskSpec, type WidgetState } from "@market-lab/academy";
import { Rich } from "../components/Page";
import { Icon, cx } from "../components/ui";
import { Bars, DraggableLevel, LearnChart } from "../kit";
import { useKeys } from "./context";
import { Feedback } from "./parts";

export interface TaskWidgetProps {
  task: TaskSpec;
  state: WidgetState;
  values: WidgetState;
  set: (patch: WidgetState) => void;
  solved: boolean;
  locked: Set<string>;
  hidden: Set<string>;
  /** Checks the task now (widgets that commit by themselves: placing an order, answering cards). */
  check: (next?: WidgetState) => boolean | void;
  /** Hints shown so far (some widgets add marks from the second hint on). */
  hints: number;
}

const n = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
const p2 = (v: unknown) => n(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const vusd = (v: unknown) => `${p2(v)} vUSD`;
const signed = (v: number, f: (x: number) => string = (x) => p2(x)) => (Math.abs(v) < 0.005 ? f(0) : `${v > 0 ? "+" : "−"}${f(Math.abs(v))}`);

// ─── Controls ──────────────────────────────────────────────────────────────

function Range({ label, value, min, max, step, format, disabled, onChange }: { label: string; value: number; min: number; max: number; step: number; format?: (v: number) => string; disabled?: boolean; onChange: (v: number) => void }) {
  const id = useId();
  const text = format ? format(value) : String(value);
  return (
    <div className={cx("lp-range", disabled && "is-locked")}>
      <label htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id} className="num">
          {text}
        </output>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} disabled={disabled} aria-valuetext={text} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function Seg<T extends string | number>({ label, value, options, disabled, onChange }: { label: string; value: T; options: { id: T; label: string }[]; disabled?: boolean; onChange: (v: T) => void }) {
  return (
    <div className={cx("lp-seg", disabled && "is-locked")} role="radiogroup" aria-label={label}>
      <span className="lp-seg-label">{label}</span>
      <div className="lp-seg-options">
        {options.map((o) => (
          <button key={String(o.id)} type="button" role="radio" aria-checked={value === o.id} className={cx("lp-seg-opt", value === o.id && "is-on")} disabled={disabled} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumField({ label, value, unit, disabled, onChange }: { label: string; value: unknown; unit?: string; disabled?: boolean; onChange: (raw: string) => void }) {
  return (
    <label className={cx("lp-numfield", disabled && "is-locked")}>
      <span>{label}</span>
      <span className="lp-numfield-box">
        <input inputMode="decimal" autoComplete="off" value={value === undefined || value === null ? "" : String(value)} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
        {unit && <span className="lp-numfield-unit">{unit}</span>}
      </span>
    </label>
  );
}

interface Row {
  key: string;
  label: string;
  value: ReactNode;
  strong?: boolean;
  tone?: "pos" | "neg";
}
function Outs({ rows, hidden }: { rows: Row[]; hidden: Set<string> }) {
  return (
    <dl className="lp-outs" aria-live="polite">
      {rows.map((r) => (
        <div key={r.key} className={cx(r.strong && "is-strong", hidden.has(r.key) && "is-hidden")}>
          <dt>{r.label}</dt>
          <dd className={cx("num", !hidden.has(r.key) && r.tone === "pos" && "ml-pos", !hidden.has(r.key) && r.tone === "neg" && "ml-neg")}>{hidden.has(r.key) ? "?" : r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const lock = (p: TaskWidgetProps, k: string) => p.locked.has(k) || (p.solved && !p.hidden.size && false);

// ─── candle-builder ────────────────────────────────────────────────────────

function CandleBuilder(p: TaskWidgetProps) {
  const { state: s, values: v, set } = p;
  const spec: ChartSpec = { candles: [{ o: n(s.open), h: n(v.high), l: n(v.low), c: n(s.close) }], range: [97, 103], height: 220 };
  const layers: ChartLayer[] = [
    { kind: "level", price: n(v.high), role: "neutral", label: "HIGH" },
    { kind: "level", price: n(v.low), role: "neutral", label: "LOW" },
  ];
  const f = (x: number) => x.toFixed(2);
  return (
    <div className="lp-wgrid">
      <div className="lp-controls">
        <Range label="Open" value={n(s.open)} min={97} max={103} step={0.1} format={f} disabled={lock(p, "open")} onChange={(x) => set({ open: x })} />
        <Range label="High" value={n(v.high)} min={97} max={103} step={0.1} format={f} disabled={lock(p, "high")} onChange={(x) => set({ high: x })} />
        <Range label="Low" value={n(v.low)} min={97} max={103} step={0.1} format={f} disabled={lock(p, "low")} onChange={(x) => set({ low: x })} />
        <Range label="Close" value={n(s.close)} min={97} max={103} step={0.1} format={f} disabled={lock(p, "close")} onChange={(x) => set({ close: x })} />
      </div>
      <div className="lp-visual">
        <LearnChart spec={spec} layers={layers} label={`${v.direction} candle: open ${p2(s.open)}, high ${p2(v.high)}, low ${p2(v.low)}, close ${p2(s.close)}`} />
        <Outs
          hidden={p.hidden}
          rows={[
            { key: "direction", label: "Direction", value: v.direction === "bullish" ? "Bullish" : "Bearish", strong: true },
            { key: "body", label: "Body", value: p2(v.body) },
            { key: "upperWick", label: "Upper wick", value: p2(v.upperWick) },
            { key: "lowerWick", label: "Lower wick", value: p2(v.lowerWick) },
            { key: "range", label: "Range", value: p2(v.range) },
          ]}
        />
      </div>
    </div>
  );
}

// ─── spread-cost ───────────────────────────────────────────────────────────

function SpreadCost(p: TaskWidgetProps) {
  const { state: s, values: v, set } = p;
  const asks = "answer" in (p.task.start ?? {}) || JSON.stringify(p.task.success).includes('"answer"');
  return (
    <div className="lp-wgrid">
      <div className="lp-controls">
        <Range label="Units" value={n(s.units)} min={1} max={200} step={1} disabled={lock(p, "units")} onChange={(x) => set({ units: x })} />
        <Range label="Mid price" value={n(s.mid)} min={20} max={200} step={0.5} format={(x) => x.toFixed(2)} disabled={lock(p, "mid")} onChange={(x) => set({ mid: x })} />
        <Range label="Spread" value={n(s.spread)} min={0.02} max={0.5} step={0.02} format={(x) => x.toFixed(2)} disabled={lock(p, "spread")} onChange={(x) => set({ spread: x })} />
        <Range label="Commission per fill" value={n(s.commissionPct)} min={0} max={0.2} step={0.01} format={(x) => `${x.toFixed(2)}%`} disabled={lock(p, "commissionPct")} onChange={(x) => set({ commissionPct: x })} />
        {asks && <NumField label="Your answer: round-trip cost" unit="vUSD" value={s.answer} disabled={p.solved} onChange={(raw) => set({ answer: parseNumericAnswer(raw) ?? raw })} />}
      </div>
      <Outs
        hidden={p.hidden}
        rows={[
          { key: "ask", label: "You buy at the ask", value: p2(v.ask) },
          { key: "bid", label: "You sell at the bid", value: p2(v.bid) },
          { key: "spreadCost", label: "Spread cost", value: vusd(v.spreadCost) },
          { key: "feeIn", label: `Commission (${n(s.commissionPct).toFixed(2)}% × 2 fills)`, value: `${p2(v.feeIn)} + ${p2(v.feeOut)}` },
          { key: "roundTrip", label: "Round-trip cost", value: vusd(v.roundTrip), strong: true, tone: "neg" },
          { key: "breakEven", label: "Rise needed per unit to break even", value: p2(v.breakEven) },
        ]}
      />
    </div>
  );
}

// ─── order-fill ────────────────────────────────────────────────────────────

function OrderFill(p: TaskWidgetProps) {
  const { state: s, values: v, set, task } = p;
  const chart = task.data?.chart;
  const [played, setPlayed] = useState(p.solved && !!s.placed);
  if (!chart) return <p className="ml-muted">This exercise needs its chart.</p>;
  const history = chart.visible ?? chart.candles.length;
  const placed = !!s.placed;
  const limit = n(s.limit);
  const units = task.data?.units ?? 30;
  const last = chart.candles[history - 1];
  const layers: ChartLayer[] = [{ kind: "level", price: Number((last.c + 0.05).toFixed(2)), role: "neutral", label: "ASK" }];
  if (played && v.filled) layers.push({ kind: "marker", index: n(v.fillAt), price: n(v.fillPrice), label: `FILL ${p2(v.fillPrice)}`, role: "accent" });
  if (placed && s.type === "limit") layers.push({ kind: "level", price: limit, role: "entry", label: `${String(s.side).toUpperCase()} LIMIT` });
  return (
    <div className="lp-wgrid lp-wgrid--chart">
      <div className="lp-visual">
        <LearnChart spec={chart} layers={layers} visible={played ? chart.candles.length : history} include={[limit]}>
          {(frame) =>
            !placed && s.type === "limit" ? <DraggableLevel frame={frame} value={limit} min={95} max={105} step={0.01} role="entry" label="LIMIT" name="Limit price" onChange={(x) => set({ limit: x })} /> : null
          }
        </LearnChart>
        {task.data?.plan && (
          <p className="lp-plan">
            <Icon name="clipboard" size={15} /> <Rich text={task.data.plan} />
          </p>
        )}
      </div>
      <div className="lp-controls">
        <Seg label="Side" value={String(s.side)} options={[{ id: "buy", label: "Buy" }, { id: "sell", label: "Sell" }]} disabled={placed || lock(p, "side")} onChange={(x) => set({ side: x })} />
        <Seg label="Type" value={String(s.type)} options={[{ id: "market", label: "Market" }, { id: "limit", label: "Limit" }]} disabled={placed || lock(p, "type")} onChange={(x) => set({ type: x })} />
        <NumField label="Limit price" value={s.type === "limit" ? limit.toFixed(2) : "—"} disabled={placed || s.type !== "limit"} onChange={(raw) => {
          const x = parseNumericAnswer(raw);
          if (x !== null) set({ limit: Math.min(105, Math.max(95, x)) });
        }} />
        <p className="lp-ticket-units ml-muted">
          Units: <b className="num">{units}</b> · ask now <b className="num">{p2(v.ask)}</b>
        </p>
        {!placed ? (
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={() => {
            const next = { ...s, placed: true };
            set({ placed: true });
            p.check(next);
          }}>
            Place order
          </button>
        ) : !played ? (
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={() => setPlayed(true)}>
            <Icon name="play" size={16} /> Play {chart.candles.length - history} hours
          </button>
        ) : (
          <button type="button" className="ml-btn ml-btn--tertiary ml-btn--md" onClick={() => (setPlayed(false), set({ placed: false }))} disabled={p.solved}>
            <Icon name="replay" size={16} /> Try another order
          </button>
        )}
        {played && (
          <Outs
            hidden={new Set()}
            rows={[
              { key: "filled", label: "Result", value: v.filled ? "Filled" : "Not filled", strong: true },
              ...(v.filled
                ? [
                    { key: "fillPrice", label: "Fill price", value: p2(v.fillPrice) },
                    { key: "fillValue", label: "Fill value", value: vusd(units * n(v.fillPrice)) },
                  ]
                : [{ key: "lowestAsk", label: s.side === "sell" ? "Highest bid" : "Lowest ask", value: p2(v.lowestAsk) }]),
            ]}
          />
        )}
      </div>
    </div>
  );
}

// ─── bracket-builder ───────────────────────────────────────────────────────

function BracketBuilder(p: TaskWidgetProps) {
  const { state: s, values: v, set, task } = p;
  const chart = task.data?.chart ?? { candles: [{ o: 100, h: 100.2, l: 99.8, c: 100 }] };
  const entry = n(v.entry);
  const stop = n(s.stop);
  const target = n(s.target);
  const stopR = n(v.stopDistance) > 0 ? 1 : 0;
  const layers: ChartLayer[] = [
    { kind: "level", price: entry, role: "entry", label: "ENTRY" },
    { kind: "bracket", from: entry, to: stop, label: `−${p2(v.lossBefore)} · −${stopR}R`, role: "down", index: chart.candles.length - 1 },
    { kind: "bracket", from: entry, to: target, label: `+${p2(v.gainBefore)} · +${n(v.rr).toFixed(2)}R`, role: "up", index: chart.candles.length - 1 },
  ];
  return (
    <div className="lp-wgrid lp-wgrid--chart">
      <div className="lp-visual">
        <LearnChart spec={chart} layers={layers} include={[stop, target]} height={280}>
          {(frame) => (
            <>
              <DraggableLevel frame={frame} value={stop} min={95} max={Number((entry - 0.01).toFixed(2))} step={0.01} role="stop" label="STOP" name="Stop price" disabled={lock(p, "stop")} onChange={(x) => set({ stop: x })} />
              <DraggableLevel frame={frame} value={target} min={Number((entry + 0.01).toFixed(2))} max={106} step={0.01} role="target" label="TARGET" name="Target price" disabled={lock(p, "target")} onChange={(x) => set({ target: x })} />
            </>
          )}
        </LearnChart>
      </div>
      <div className="lp-controls">
        <NumField label="Stop" value={stop.toFixed(2)} disabled={lock(p, "stop")} onChange={(raw) => {
          const x = parseNumericAnswer(raw);
          if (x !== null && x < entry) set({ stop: x });
        }} />
        <NumField label="Target" value={target.toFixed(2)} disabled={lock(p, "target")} onChange={(raw) => {
          const x = parseNumericAnswer(raw);
          if (x !== null && x > entry) set({ target: x });
        }} />
        <Outs
          hidden={p.hidden}
          rows={[
            { key: "units", label: "Units", value: String(v.units) },
            { key: "stopDistance", label: "Stop distance", value: p2(v.stopDistance) },
            { key: "lossBefore", label: "Loss at stop", value: `−${p2(v.lossBefore)} · −1R`, tone: "neg" },
            { key: "lossAfter", label: "…after commissions", value: `−${p2(v.lossAfter)}`, tone: "neg" },
            { key: "targetDistance", label: "Target distance", value: p2(v.targetDistance) },
            { key: "gainBefore", label: "Gain at target", value: `+${p2(v.gainBefore)} · +${n(v.rr).toFixed(2)}R`, tone: "pos", strong: true },
            { key: "gainAfter", label: "…after commissions", value: `+${p2(v.gainAfter)}`, tone: "pos" },
          ]}
        />
      </div>
    </div>
  );
}

// ─── trend-classifier ──────────────────────────────────────────────────────

const LABELS = [
  { id: "trend", label: "Trend" },
  { id: "range", label: "Range" },
  { id: "noise", label: "Noise" },
];
const EVIDENCE = [
  { id: "hh_hl", label: "Higher highs and higher lows" },
  { id: "lh_ll", label: "Lower highs and lower lows" },
  { id: "bounded", label: "Bounded between two levels" },
  { id: "overlap", label: "Overlapping swings, no direction" },
];

/** Swing highs and lows of a series as markers (from the second hint on, and once solved). */
function swingLayers(candles: CandleData[]): ChartLayer[] {
  return [
    ...swingPoints(candles, "high").map((i): ChartLayer => ({ kind: "marker", index: i, at: "high", role: "down" })),
    ...swingPoints(candles, "low").map((i): ChartLayer => ({ kind: "marker", index: i, at: "low", role: "up" })),
  ];
}

function SegmentPicker({ k, p, evidence }: { k: string; p: TaskWidgetProps; evidence: { id: string; label: string }[] }) {
  const { state: s, set } = p;
  return (
    <>
      <Seg label="Label" value={String(s[`label${k}`] ?? "")} options={LABELS} disabled={lock(p, `label${k}`)} onChange={(x) => set({ [`label${k}`]: x })} />
      <label className="lp-select">
        <span>Evidence</span>
        <select value={String(s[`evidence${k}`] ?? "")} disabled={lock(p, `evidence${k}`)} onChange={(e) => set({ [`evidence${k}`]: e.target.value })}>
          <option value="">Choose…</option>
          {evidence.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

function TrendClassifier(p: TaskWidgetProps) {
  const { task } = p;
  const segs = task.data?.segments ?? [];
  const evidence = task.data?.evidence ?? EVIDENCE;
  const marks = p.hints >= 2 || p.solved;
  // Each segment on its own chart, or ranges of one chart.
  if (segs.some((g) => g.candles)) {
    return (
      <div className="lp-segments-grid">
        {segs.map((g, i) => {
          const k = g.id ?? "ABC"[i];
          const candles = g.candles ?? [];
          const layers = [...(marks ? swingLayers(candles) : []), ...(p.solved ? g.showMe ?? [] : [])];
          return (
            <fieldset key={k} className="lp-classify-row">
              <legend>Stretch {k}</legend>
              <LearnChart spec={{ candles, height: 170 }} layers={layers} label={`Stretch ${k}`} />
              <SegmentPicker k={k} p={p} evidence={evidence} />
            </fieldset>
          );
        })}
      </div>
    );
  }
  const chart = task.data?.chart;
  if (!chart) return <p className="ml-muted">This exercise needs its chart.</p>;
  return (
    <div className="lp-stack">
      <LearnChart spec={chart} layers={marks ? swingLayers(chart.candles) : []}>
        {(frame) => (
          <g className="lp-segments">
            {segs.map((g, i) => {
              const x1 = frame.x(g.from ?? 0) - frame.slot / 2;
              const x2 = frame.x(g.to ?? chart.candles.length - 1) + frame.slot / 2;
              return (
                <g key={i} className="lp-segment">
                  <rect x={x1} y={frame.plotTop} width={x2 - x1} height={frame.plotBottom - frame.plotTop} />
                  <text x={(x1 + x2) / 2} y={frame.plotTop + 14} textAnchor="middle">
                    {g.id ?? "ABC"[i]}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </LearnChart>
      <div className="lp-classify">
        {segs.map((g, i) => {
          const k = g.id ?? "ABC"[i];
          return (
            <fieldset key={k} className="lp-classify-row">
              <legend>Segment {k}</legend>
              <SegmentPicker k={k} p={p} evidence={evidence} />
            </fieldset>
          );
        })}
      </div>
    </div>
  );
}

// ─── level-drawer ──────────────────────────────────────────────────────────

/**
 * Draw a zone; with a breakout plan, two more steps follow: the breakout candle appears with the
 * entry and the learner places the stop under the zone (checked here: the rule is relative to the
 * band), then Play shows how the breakout ended, and "Other ending" the alternative.
 */
function LevelDrawer(p: TaskWidgetProps) {
  const { state: s, values: v, set, task } = p;
  const chart = task.data?.chart;
  const plan = task.data?.breakout;
  const [ending, setEnding] = useState<string | null>(null);
  const [note, setNote] = useState<{ tone: "right" | "wrong" | "info"; text: string } | null>(null);
  if (!chart) return <p className="ml-muted">This exercise needs its chart.</p>;
  const phase = p.solved && plan ? Math.max(3, n(s.phase) || 1) : n(s.phase) || 1;
  const lo = Math.min(n(s.bandLow), n(s.bandHigh));
  const hi = Math.max(n(s.bandLow), n(s.bandHigh));
  const role = s.role === "support" ? "support" : "resistance";
  const stop = n(s.stop);
  const known = chart.visible ?? chart.candles.length;
  const candles = ending && plan ? [...chart.candles, ...(plan.endings[ending] ?? [])] : chart.candles;
  const visible = phase >= 2 && plan ? (ending ? candles.length : plan.breakIndex + 1) : known;
  const risk = plan ? plan.entry - stop : 0;
  const total = plan ? risk + Math.ceil(plan.entry * 5) / 10000 + Math.ceil(stop * 5) / 10000 : 0;
  const msgValues = { ...v, ...s, bandLow: lo, bandHigh: hi, stop, risk, total };

  const layers: ChartLayer[] = [{ kind: "zone", from: lo, to: hi, role, label: role.toUpperCase() }];
  if (plan && phase >= 2) layers.push({ kind: "level", price: plan.entry, role: "entry", label: "ENTRY" });
  if (plan && phase >= 3) layers.push({ kind: "level", price: stop, role: "stop", label: "STOP" });

  const confirmBand = () => {
    if (!plan) return p.check();
    const ok = s.role === "resistance" && n(v.touches) >= 3 && n(v.height) >= 0.1 - 1e-9 && n(v.height) <= 0.5 + 1e-9;
    if (!ok) {
      const fb = (task.feedback ?? []).find((f) => evaluateCondition(f.when, msgValues));
      setNote({ tone: "wrong", text: fillTemplate(fb?.text ?? "Cover the cluster of turns with one band, 0.10 to 0.50 tall.", msgValues) });
      return;
    }
    setNote({ tone: "right", text: fillTemplate(plan.messages.bandCorrect ?? "", msgValues) });
    set({ phase: 2, stop: Number((lo - 0.2).toFixed(2)) });
  };
  const confirmStop = () => {
    if (!plan) return;
    const below = lo - stop;
    if (below < plan.stopRule.minBelowBand - 1e-9) return setNote({ tone: "wrong", text: fillTemplate(plan.messages.stopTooClose ?? "", msgValues) });
    if (below > plan.stopRule.maxBelowBand + 1e-9) return setNote({ tone: "wrong", text: fillTemplate(plan.messages.stopTooFar ?? "", msgValues) });
    setNote({ tone: "right", text: fillTemplate(plan.messages.stopCorrect ?? "", msgValues) });
    const next = { ...s, phase: 3 };
    set({ phase: 3 });
    p.check(next);
  };
  const play = (name: string) => {
    if (!plan) return;
    setEnding(name);
    const all = [...chart.candles, ...(plan.endings[name] ?? [])];
    const k = all.findIndex((c, i) => i > plan.breakIndex && c.c < lo - 1e-9);
    const msg = name === "fail" ? plan.messages.playFail : plan.messages.playHold;
    setNote({ tone: "info", text: fillTemplate(msg ?? "", { ...msgValues, k: k + 1, close: k >= 0 ? all[k].c : 0 }) });
  };
  const otherEnding = plan?.order.find((e) => e !== ending);

  return (
    <div className="lp-wgrid lp-wgrid--chart">
      <div className="lp-visual">
        <LearnChart spec={{ ...chart, candles }} layers={layers} visible={visible} include={[lo, hi, ...(phase >= 2 ? [stop] : [])]} height={290}>
          {(frame) => (
            <>
              {phase === 1 && (
                <>
                  <DraggableLevel frame={frame} value={hi} min={frame.min} max={frame.max} step={0.01} role={role} label="BAND TOP" name="Top of the band" disabled={lock(p, "bandHigh")} onChange={(x) => set({ bandHigh: x })} />
                  <DraggableLevel frame={frame} value={lo} min={frame.min} max={frame.max} step={0.01} role={role} label="BAND BOTTOM" name="Bottom of the band" disabled={lock(p, "bandLow")} onChange={(x) => set({ bandLow: x })} />
                </>
              )}
              {phase === 2 && <DraggableLevel frame={frame} value={stop} min={frame.min} max={Number((lo - 0.01).toFixed(2))} step={0.01} role="stop" label="STOP" name="Stop price" onChange={(x) => set({ stop: x })} />}
            </>
          )}
        </LearnChart>
        {note && (
          <Feedback tone={note.tone}>
            <Rich text={note.text} />
          </Feedback>
        )}
      </div>
      <div className="lp-controls">
        {plan && (
          <ol className="lp-phases" aria-label="Steps">
            {["Draw the zone", "Place the stop", "Play the chart"].map((t, i) => (
              <li key={t} className={cx(phase === i + 1 && "is-on", phase > i + 1 && "is-done")}>
                <span className="num">{i + 1}</span> {t}
              </li>
            ))}
          </ol>
        )}
        {phase === 1 && <Seg label="Level" value={role} options={[{ id: "resistance", label: "Resistance" }, { id: "support", label: "Support" }]} disabled={lock(p, "role")} onChange={(x) => set({ role: x })} />}
        <Outs
          hidden={p.hidden}
          rows={[
            { key: "height", label: "Band", value: `${p2(lo)} – ${p2(hi)} · ${p2(v.height)}` },
            { key: "touches", label: "Swing points in the band", value: String(v.touches), strong: true },
            ...(plan && phase >= 2
              ? [
                  { key: "entry", label: "Entry (breakout close + spread)", value: p2(plan.entry) },
                  { key: "stopAt", label: "Stop", value: `${p2(stop)} · ${p2(lo - stop)} under the band` },
                  { key: "risk", label: "Risk per unit", value: `${p2(risk)} · about ${p2(total)} with commission` },
                ]
              : []),
          ]}
        />
        {phase === 1 && (
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={confirmBand}>
            {plan ? "Confirm the zone" : "Check"}
          </button>
        )}
        {phase === 2 && (
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={confirmStop}>
            Set the stop
          </button>
        )}
        {phase >= 3 && plan && (
          <div className="lp-inline-actions">
            {!ending ? (
              <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={() => play(plan.order[0])}>
                <Icon name="play" size={16} /> Play the chart
              </button>
            ) : (
              otherEnding && (
                <button type="button" className="ml-btn ml-btn--secondary ml-btn--md" onClick={() => play(otherEnding)}>
                  <Icon name="replay" size={16} /> Other ending
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ma-period ─────────────────────────────────────────────────────────────

function MaPeriod(p: TaskWidgetProps) {
  const { state: s, values: v, set, task } = p;
  const market = String(s.market ?? "trend");
  const full = useMemo(() => task.data?.series?.[market] ?? [], [task, market]);
  const warm = task.data?.warmup ?? 0;
  const period = Math.round(n(s.period));
  const stats = useMemo(() => maStats(full, period, warm), [full, period, warm]);
  if (!full.length) return <p className="ml-muted">This exercise needs its price series.</p>;
  const candles = full.slice(warm);
  const layers: ChartLayer[] = [
    { kind: "line", values: stats.ma.slice(warm), role: "concept", label: `SMA ${period}` },
    ...stats.crossings.map((i): ChartLayer => ({ kind: "marker", index: i - warm, at: "close", role: "concept" })),
  ];
  const markets = Object.keys(task.data?.series ?? {});
  return (
    <div className="lp-stack">
      <div className="lp-controls lp-controls--row">
        {markets.length > 1 && <Seg label="Market" value={market} options={markets.map((k) => ({ id: k, label: k[0].toUpperCase() + k.slice(1) }))} disabled={lock(p, "market")} onChange={(x) => set({ market: x })} />}
        <Range label="Period" value={period} min={5} max={50} step={1} format={(x) => `${x} candles`} disabled={lock(p, "period")} onChange={(x) => set({ period: x })} />
      </div>
      <LearnChart spec={{ candles }} layers={layers} height={260} />
      <Outs
        hidden={p.hidden}
        rows={[
          { key: "crossings", label: "Times price crossed the average", value: String(v.crossings), strong: true },
          { key: "falseSignals", label: "Crossings reversed within 5 candles", value: String(v.falseSignals) },
          ...(market === "trend" ? [{ key: "lag", label: "Candles from the price peak to the average's peak", value: String(v.lag) }] : []),
        ]}
      />
    </div>
  );
}

// ─── loss-recovery ─────────────────────────────────────────────────────────

function LossRecovery(p: TaskWidgetProps) {
  const { state: s, values: v, set } = p;
  return (
    <div className="lp-wgrid">
      <div className="lp-controls">
        <Range label="Drawdown" value={n(s.drawdown)} min={1} max={90} step={1} format={(x) => `−${x}%`} disabled={lock(p, "drawdown")} onChange={(x) => set({ drawdown: x })} />
        <Bars
          bars={[
            { label: "Lost", value: -n(s.drawdown), role: "down" },
            { label: "Gain needed", value: n(v.gainNeeded), role: "up" },
          ]}
          unit="%"
        />
      </div>
      <Outs
        hidden={p.hidden}
        rows={[
          { key: "left", label: "Left of the account", value: `${v.left}%` },
          { key: "gainNeeded", label: "Gain needed to recover", value: `+${n(v.gainNeeded).toFixed(1)}%`, strong: true },
          { key: "lossesInRow", label: "1% losses in a row to get there", value: `${v.lossesInRow}` },
        ]}
      />
    </div>
  );
}

// ─── position-size ─────────────────────────────────────────────────────────

/** A price ruler: context levels from the lesson, the entry, and the stop to drag. */
function PriceRuler({ p, ruler }: { p: TaskWidgetProps; ruler: NonNullable<NonNullable<TaskSpec["data"]>["ruler"]> }) {
  const entry = n(p.state.entry);
  const stop = n(p.state.stop);
  const prices = [entry, stop, ...ruler.layers.flatMap((l) => (l.kind === "level" ? [l.price] : l.kind === "zone" ? [l.from, l.to] : []))];
  const lo = Math.min(...prices) - 0.8;
  const hi = Math.max(...prices) + 0.3;
  return (
    <div className="lp-ruler">
      <LearnChart spec={{ candles: [], range: [Math.min(lo, entry - 3), hi], height: 220 }} layers={[...ruler.layers, { kind: "level", price: entry, role: "entry", label: "ENTRY" }]} label={`Entry ${p2(entry)}, stop ${p2(stop)}`}>
        {(frame) => <DraggableLevel frame={frame} value={stop} min={Number((entry - 3).toFixed(2))} max={Number((entry - 0.05).toFixed(2))} step={0.01} role="stop" label="STOP" name="Stop price" disabled={lock(p, "stop")} onChange={(x) => p.set({ stop: x })} />}
      </LearnChart>
      {ruler.card && (
        <span className="lp-ruler-card">
          <Icon name="info" size={13} /> {ruler.card}
        </span>
      )}
    </div>
  );
}

function PositionSize(p: TaskWidgetProps) {
  const { state: s, values: v, set, task } = p;
  const learner = "units" in (task.start ?? {}) || "units" in task.showMe;
  return (
    <div className="lp-wgrid">
      <div className="lp-controls">
        <Range label="Account" value={n(s.account)} min={1000} max={50000} step={500} format={(x) => `${x.toLocaleString("en-US")} vUSD`} disabled={lock(p, "account")} onChange={(x) => set({ account: x })} />
        <Range label="Risk per trade" value={n(s.riskPct)} min={0.25} max={3} step={0.25} format={(x) => `${x}%`} disabled={lock(p, "riskPct")} onChange={(x) => set({ riskPct: x })} />
        <div className="lp-grid-2">
          <NumField label="Entry (buy)" value={s.entry} disabled={lock(p, "entry")} onChange={(raw) => set({ entry: parseNumericAnswer(raw) ?? raw })} />
          <NumField label="Stop" value={s.stop} disabled={lock(p, "stop")} onChange={(raw) => set({ stop: parseNumericAnswer(raw) ?? raw })} />
        </div>
        {learner && <NumField label="Your size" unit="units" value={s.units} disabled={lock(p, "units")} onChange={(raw) => set({ units: parseNumericAnswer(raw) ?? raw })} />}
        {task.data?.ruler && <PriceRuler p={p} ruler={task.data.ruler} />}
      </div>
      <Outs
        hidden={p.hidden}
        rows={[
          ...(task.data?.ruler?.compare ? [{ key: "compare", label: "Before", value: task.data.ruler.compare }] : []),
          { key: "budget", label: "Risk budget", value: vusd(v.budget) },
          { key: "distance", label: "Distance to stop", value: `${p2(v.distance)} per unit` },
          { key: "simpleQty", label: "Textbook size (no costs)", value: `${v.simpleQty} units` },
          { key: "qty", label: "Size including costs", value: `${v.qty} units`, strong: true },
          { key: "lossAtStop", label: learner ? "Your loss if stopped" : "Loss if stopped", value: vusd(v.lossAtStop), tone: v.withinBudget ? undefined : "neg" },
          { key: "positionValue", label: "Position value", value: vusd(v.positionValue) },
        ]}
      />
    </div>
  );
}

// ─── risk-reward ───────────────────────────────────────────────────────────

function RiskReward(p: TaskWidgetProps) {
  const { state: s, values: v, set } = p;
  const entry = n(s.entry);
  return (
    <div className="lp-wgrid">
      <div className="lp-controls">
        <NumField label="Entry" value={s.entry} disabled={lock(p, "entry")} onChange={(raw) => set({ entry: parseNumericAnswer(raw) ?? raw })} />
        <Range label="Stop" value={n(s.stop)} min={Number((entry - 5).toFixed(2))} max={Number((entry - 0.25).toFixed(2))} step={0.05} format={(x) => x.toFixed(2)} disabled={lock(p, "stop")} onChange={(x) => set({ stop: x })} />
        <Range label="Target" value={n(s.target)} min={Number((entry + 0.25).toFixed(2))} max={Number((entry + 12).toFixed(2))} step={0.05} format={(x) => x.toFixed(2)} disabled={lock(p, "target")} onChange={(x) => set({ target: x })} />
        <Bars
          bars={[
            { label: "Risk", value: -n(v.risk), role: "down" },
            { label: "Reward", value: n(v.reward), role: "up" },
          ]}
        />
      </div>
      <Outs
        hidden={p.hidden}
        rows={[
          { key: "rr", label: "Reward-to-risk", value: `${n(v.rr).toFixed(2)} : 1`, strong: true },
          { key: "breakEven", label: "Break-even win rate", value: `${n(v.breakEven).toFixed(1)}%` },
        ]}
      />
    </div>
  );
}

// ─── expectancy ────────────────────────────────────────────────────────────

function Expectancy(p: TaskWidgetProps) {
  const { state: s, values: v, set } = p;
  const e = n(v.expectancy);
  return (
    <div className="lp-wgrid">
      <div className="lp-controls">
        <Range label="Win rate" value={n(s.winRate)} min={10} max={90} step={1} format={(x) => `${x}%`} disabled={lock(p, "winRate")} onChange={(x) => set({ winRate: x })} />
        <Range label="Average win" value={n(s.avgWin)} min={0.5} max={5} step={0.1} format={(x) => `${x.toFixed(1)}R`} disabled={lock(p, "avgWin")} onChange={(x) => set({ avgWin: x })} />
        <Range label="Average loss" value={n(s.avgLoss)} min={0.5} max={3} step={0.1} format={(x) => `${x.toFixed(1)}R`} disabled={lock(p, "avgLoss")} onChange={(x) => set({ avgLoss: x })} />
        <Range label="Losing run to check" value={n(s.runLength)} min={3} max={12} step={1} format={(x) => `${x} in a row`} disabled={lock(p, "runLength")} onChange={(x) => set({ runLength: x })} />
      </div>
      <Outs
        hidden={p.hidden}
        rows={[
          { key: "expectancy", label: "Expectancy per trade", value: `${signed(e)}R`, strong: true, tone: e > 0.004 ? "pos" : e < -0.004 ? "neg" : undefined },
          { key: "over100", label: "Over 100 trades", value: `${signed(e * 100, (x) => x.toFixed(0))}R` },
          { key: "runProb", label: `Chance of ${s.runLength} losses in a row in 100 trades`, value: `${n(v.runProb).toFixed(1)}%` },
        ]}
      />
    </div>
  );
}

// ─── exposure ──────────────────────────────────────────────────────────────

function Exposure(p: TaskWidgetProps) {
  const { state: s, values: v, set } = p;
  const account = n(s.account);
  const lev = n(s.leverage) || 1;
  const maxPos = account * lev;
  return (
    <div className="lp-wgrid">
      <div className="lp-controls">
        <Range label="Account" value={account} min={1000} max={50000} step={500} format={(x) => `${x.toLocaleString("en-US")} vUSD`} disabled={lock(p, "account")} onChange={(x) => set({ account: x, position: Math.min(n(s.position), x * lev) })} />
        <Seg label="Leverage allowed" value={lev} options={[1, 2, 5, 10].map((x) => ({ id: x, label: `${x}×` }))} disabled={lock(p, "leverage")} onChange={(x) => set({ leverage: x, position: Math.min(n(s.position), account * x) })} />
        <Range label="Position value" value={Math.min(n(s.position), maxPos)} min={0} max={maxPos} step={500} format={(x) => `${x.toLocaleString("en-US")} vUSD`} disabled={lock(p, "position")} onChange={(x) => set({ position: x })} />
        <Range label="Move against you" value={n(s.move)} min={1} max={20} step={1} format={(x) => `${x}%`} disabled={lock(p, "move")} onChange={(x) => set({ move: x })} />
      </div>
      <Outs
        hidden={p.hidden}
        rows={[
          { key: "exposurePct", label: "Exposure", value: `${n(v.exposurePct).toFixed(0)}% of the account` },
          { key: "leverageUsed", label: "Leverage used", value: `${n(v.leverageUsed).toFixed(2)}×`, strong: true },
          { key: "loss", label: "Loss on that move", value: `−${vusd(v.loss)}`, tone: "neg" },
          { key: "lossPct", label: "…of the account", value: `−${n(v.lossPct).toFixed(1)}%`, tone: "neg", strong: true },
        ]}
      />
    </div>
  );
}

// ─── bias-spotter ──────────────────────────────────────────────────────────

function BiasSpotter(p: TaskWidgetProps) {
  const cards = p.task.data?.cards ?? [];
  const options = p.task.data?.options ?? [];
  const [i, setI] = useState(p.solved ? cards.length : 0);
  const [picked, setPicked] = useState<string | null>(null);
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(0);
  const card = cards[i];
  const answer = (id: string) => {
    if (!card || picked === card.answer) return;
    setPicked(id);
    if (id === card.answer) setSolved((x) => x + 1);
    else setMissed((m) => new Set(m).add(card.id));
  };
  const next = () => {
    const ni = i + 1;
    setI(ni);
    setPicked(null);
    if (ni >= cards.length) {
      const result = { solved, firstTry: cards.filter((c) => !missed.has(c.id)).length };
      p.set(result);
      p.check({ ...p.state, ...result });
    }
  };
  const right = !!card && picked === card.answer;
  useKeys(right ? { Enter: () => (next(), true) } : Object.fromEntries(options.slice(0, 9).map((o, k) => [String(k + 1), () => (answer(o.id), true)])));
  if (!cards.length) return <p className="ml-muted">This exercise needs its cards.</p>;
  if (!card)
    return (
      <p className="lp-bias-done">
        <Icon name="check-circle" size={18} /> {solved ? `${cards.length - missed.size} of ${cards.length} named on the first try.` : "All cards named."}
      </p>
    );
  return (
    <div className="lp-bias">
      <span className="lp-kicker num">
        Card {i + 1} of {cards.length}
      </span>
      <p className="lp-bias-text">
        <Rich text={card.text} />
      </p>
      <div className="lp-choices">
        {options.map((o, k) => (
          <button key={o.id} type="button" className={cx("lp-choice", picked === o.id && (right ? "is-right" : "is-wrong"), right && "is-locked")} disabled={right && picked !== o.id} onClick={() => answer(o.id)}>
            <span className="lp-choice-key num">{k + 1}</span>
            <span className="lp-choice-label">{o.label}</span>
          </button>
        ))}
      </div>
      {picked && (
        <Feedback tone={right ? "right" : "wrong"} title={right ? undefined : "Not this one."}>
          <Rich text={right ? card.correct : card.rationales?.[picked] ?? "Read the situation again: what is the person telling themselves?"} />
        </Feedback>
      )}
      {right && (
        <button type="button" className="ml-btn ml-btn--secondary ml-btn--md" onClick={next}>
          {i + 1 < cards.length ? "Next card" : "Finish"} <Icon name="arrow-right" size={16} />
        </button>
      )}
    </div>
  );
}

export const TASK_WIDGETS: Record<string, ComponentType<TaskWidgetProps>> = {
  "candle-builder": CandleBuilder,
  "spread-cost": SpreadCost,
  "order-fill": OrderFill,
  "bracket-builder": BracketBuilder,
  "trend-classifier": TrendClassifier,
  "level-drawer": LevelDrawer,
  "ma-period": MaPeriod,
  "loss-recovery": LossRecovery,
  "position-size": PositionSize,
  "risk-reward": RiskReward,
  expectancy: Expectancy,
  exposure: Exposure,
  "bias-spotter": BiasSpotter,
};
