/**
 * benchmark-ghost: a trader's result against the ghost (the same market, bought and held, after
 * costs), in two modes.
 * - trips: a year's result before costs; drag the round trips and watch the costs eat into it, tick
 *   by tick, until it meets the ghost.
 * - race: a seeded year of LABX plays out; the learner buys and sells live while the ghost holds.
 *   Each switch pays half a round trip, so the line steps down at every click.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { parseSwitches, raceCurves, raceSeries, type GhostSpec } from "@market-lab/academy";
import { Icon, cx } from "../components/ui";
import { useNarrow } from "./AuctionBook";
import { useKeys } from "./context";
import { Range, type TaskWidgetProps } from "./taskWidgets";

/** To one decimal the way the lesson rounds (academy's round), so the chart and the verdict agree. */
const r1 = (v: number) => Math.round(v * 10) / 10;
const pct = (v: number, d = 1) => {
  const x = d === 1 ? r1(v) : v;
  return `${x > 0 ? "+" : x < 0 ? "−" : ""}${Math.abs(x).toFixed(d)}%`;
};
const MONTHS = "JFMAMJJASOND";
/** Where the trade ticks sit: under the plot, above the month letters. */
const B_TICK = 26;

/** Chart frame: x over `n` points, y over [lo, hi] percent. */
function frame(narrow: boolean, n: number, lo: number, hi: number, tall: boolean) {
  const W = narrow ? 340 : 640;
  const H = narrow ? (tall ? 270 : 240) : tall ? 300 : 270;
  const L = narrow ? 40 : 44;
  const R = narrow ? 76 : 112;
  const T = 16;
  const B = 30;
  const x = (i: number) => L + (i / (n - 1)) * (W - L - R);
  const y = (v: number) => T + ((hi - v) / (hi - lo)) * (H - T - B);
  return { W, H, L, R, T, B, x, y, lo, hi, n, font: narrow ? 10.5 : 11.5, right: W - R };
}
type Frame = ReturnType<typeof frame>;

const line = (f: Frame, vals: number[], to = vals.length - 1) =>
  vals
    .slice(0, to + 1)
    .map((v, i) => `${i ? "L" : "M"}${f.x(i).toFixed(1)} ${f.y(v).toFixed(1)}`)
    .join("");

/** Horizontal grid every 5 points, with the 0% line stronger, and the months along the bottom. */
function Grid({ f, monthAt }: { f: Frame; monthAt: (m: number) => number }) {
  const steps: number[] = [];
  for (let v = Math.ceil(f.lo / 5) * 5; v <= f.hi; v += 5) steps.push(v);
  return (
    <g className="bg-grid">
      {steps.map((v) => (
        <g key={v} className={cx(v === 0 && "is-zero")}>
          <line x1={f.L} x2={f.right} y1={f.y(v)} y2={f.y(v)} />
          <text x={f.L - 6} y={f.y(v) + f.font * 0.36} textAnchor="end" fontSize={f.font}>
            {v === 0 ? "0%" : pct(v, 0)}
          </text>
        </g>
      ))}
      {[...MONTHS].map((m, i) => (
        <text key={i} className="bg-month" x={(f.x(monthAt(i)) + f.x(monthAt(i + 1))) / 2} y={f.H - 10} textAnchor="middle" fontSize={f.font}>
          {m}
        </text>
      ))}
    </g>
  );
}

/** Tags at the right edge, pushed apart so they never overlap. */
function Tags({ f, x, items }: { f: Frame; x: number; items: { key: string; v: number; name: string; cls: string }[] }) {
  const short = f.W < 400;
  const h = f.font + 9;
  const placed = items.map((t) => ({ ...t, y: f.y(t.v) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < placed.length; i++) placed[i].y = Math.max(placed[i].y, placed[i - 1].y + h + 2);
  return (
    <g className="bg-tags">
      {placed.map((t) => (
        <g key={t.key} className={cx("bg-tag", t.cls)} style={{ transform: `translate(${x + 8}px, ${t.y - h / 2}px)` }}>
          <rect width={f.R - 14} height={h} rx={5} />
          <text x={6} y={h / 2 + f.font * 0.36} fontSize={f.font}>
            {short ? pct(t.v) : `${t.name} ${pct(t.v)}`}
          </text>
        </g>
      ))}
    </g>
  );
}

/** The gap at the end: a bracket from the result to the ghost, coloured by who's ahead. */
function Gap({ f, at, net, ghost }: { f: Frame; at: number; net: number; ghost: number }) {
  const gap = r1(r1(net) - r1(ghost));
  const x = f.x(at) - 6;
  const y1 = f.y(Math.max(net, ghost));
  const y2 = f.y(Math.min(net, ghost));
  return (
    <g className={cx("bg-gap", gap > 0 ? "is-ahead" : gap < 0 ? "is-behind" : "is-level")}>
      {gap !== 0 && <path d={`M${x + 4} ${y1} H${x} V${y2} H${x + 4}`} />}
      <text x={x - 6} y={(y1 + y2) / 2 + f.font * 0.36} textAnchor="end" fontSize={f.font}>
        {gap === 0 ? "LEVEL" : `${gap > 0 ? "+" : "−"}${Math.abs(gap).toFixed(1)}`}
      </text>
    </g>
  );
}

// ─── trips: costs eat the result ──────────────────────────────────────────

function Trips({ p, g, narrow }: { p: TaskWidgetProps; g: GhostSpec; narrow: boolean }) {
  const gross = g.gross ?? [];
  const ghost = g.ghost ?? [];
  const max = g.max ?? 60;
  const trips = Math.round(Number(p.state.trips) || 0);
  const end = gross.length - 1;
  const net = gross.map((v, m) => v - (g.cost * trips * m) / end);
  const lo = Math.min(-2, gross[end] - g.cost * max - 1);
  const hi = Math.max(...gross, ...ghost) + 2;
  const f = frame(narrow, gross.length, lo, hi, false);
  const costs = g.cost * trips;
  // The costs: down the gross line, back along the net line.
  const band = `${line(f, gross)}${[...net]
    .reverse()
    .map((v, k) => `L${f.x(end - k).toFixed(1)} ${f.y(v).toFixed(1)}`)
    .join("")}Z`;
  const v = p.values;
  const level = !!v.level;
  // The costs label sits inside the band, clear of the gap label; on a phone the band is too thin and the stats say it.
  const labelAt = end - 3;

  return (
    <>
      <div className="bg-head">
        <span className="bg-legend">
          <i className="is-gross" /> Before costs <i className="is-you" /> After costs <i className="is-ghost" /> Ghost
        </span>
      </div>
      <svg className="ab-svg bg-svg" viewBox={`0 0 ${f.W} ${f.H}`} role="img" aria-label={`Before costs ${pct(gross[end])}; ${trips} round trips cost ${costs.toFixed(1)} points, leaving ${pct(net[end])}; the ghost made ${pct(ghost[end])}.`}>
        <Grid f={f} monthAt={(m) => m} />
        {trips > 0 && <path className="bg-band" d={band} />}
        <g className="bg-ticks">
          {Array.from({ length: trips }, (_, i) => (
            <line key={i} x1={f.x(((i + 0.5) * end) / trips)} x2={f.x(((i + 0.5) * end) / trips)} y1={f.H - B_TICK} y2={f.H - B_TICK + 6} />
          ))}
        </g>
        <path className="bg-line bg-line--ghost" d={line(f, ghost)} />
        <path className="bg-line bg-line--gross" d={line(f, gross)} />
        <path className={cx("bg-line bg-line--you", level && "is-level")} d={line(f, net)} />
        {!narrow && (costs * labelAt) / end > 1.6 && (
          <text className="bg-band-label" x={f.x(labelAt)} y={(f.y(gross[labelAt]) + f.y(net[labelAt])) / 2 + f.font * 0.36} textAnchor="middle" fontSize={f.font}>
            COSTS −{costs.toFixed(1)}
          </text>
        )}
        <Gap f={f} at={end} net={net[end]} ghost={ghost[end]} />
        <Tags
          f={f}
          x={f.right}
          items={[
            { key: "gross", v: gross[end], name: "BEFORE", cls: "is-gross" },
            { key: "ghost", v: ghost[end], name: "GHOST", cls: "is-ghost" },
            { key: "net", v: net[end], name: "AFTER", cls: "is-you" },
          ]}
        />
      </svg>
      <Range label="Round trips in the year" value={trips} min={0} max={max} step={1} disabled={p.solved} onChange={(t) => p.set({ ...p.state, trips: t })} />
      <div className="ab-stats">
        <div className="ab-stat">
          <span>Round trips</span>
          <b className="num">{trips}</b>
        </div>
        <div className="ab-stat ab-stat--sell">
          <span>Costs</span>
          <b className="num">−{costs.toFixed(1)}</b>
        </div>
        <div className={cx("ab-stat ab-stat--units", level && "is-lit")}>
          <span>After costs vs ghost</span>
          <b className="num">{level ? "level" : `${Number(v.gap) > 0 ? "+" : "−"}${Math.abs(Number(v.gap)).toFixed(1)}`}</b>
        </div>
      </div>
    </>
  );
}

// ─── race: a live year ────────────────────────────────────────────────────

/** Seconds a year takes at normal speed. */
const YEAR_SECONDS = 20;

function Race({ p, g, narrow }: { p: TaskWidgetProps; g: GhostSpec; narrow: boolean }) {
  const days = g.days ?? 252;
  const last = days - 1;
  const prices = useMemo(() => raceSeries(g.seed ?? 1, days, g.end), [g.seed, days, g.end]);
  const log = typeof p.state.log === "string" ? p.state.log : "";
  const switches = useMemo(() => parseSwitches(log, days), [log, days]);
  const { you, ghost } = useMemo(() => raceCurves(prices, switches, g.cost), [prices, switches, g.cost]);
  const over = !!p.state.done;
  const [day, setDay] = useState(over ? last : 0);
  const [playing, setPlaying] = useState(false);
  const [fast, setFast] = useState(false);
  const started = over || day > 0 || playing;
  const d = over ? last : Math.floor(day);
  const inMarket = switches.length % 2 === 1;
  const tradeBtn = useRef<HTMLButtonElement>(null);
  const live = useRef({ log, p });
  live.current = { log, p };
  const dayRef = useRef(day);

  // Show me (or a revisit) ends the year at once.
  useEffect(() => {
    if (over) {
      setPlaying(false);
      dayRef.current = last;
      setDay(last);
    }
  }, [over, last]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let t0 = performance.now();
    const rate = (last / YEAR_SECONDS) * (fast ? 3 : 1);
    const tick = (t: number) => {
      const dt = Math.min(0.1, (t - t0) / 1000);
      t0 = t;
      dayRef.current = Math.min(last, dayRef.current + dt * rate);
      setDay(dayRef.current);
      if (dayRef.current >= last) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, fast]);

  const finished = useRef(false);
  function finish() {
    if (finished.current) return;
    finished.current = true;
    setPlaying(false);
    const next = { ...live.current.p.state, log: live.current.log, done: true };
    live.current.p.set(next);
    // The verdict follows a beat after the last day, once the final gap is on screen.
    window.setTimeout(() => live.current.p.check(next), 500);
  }

  const start = () => {
    if (over || p.solved) return;
    setPlaying(true);
    requestAnimationFrame(() => tradeBtn.current?.focus());
  };
  const trade = () => {
    if (!playing || over) return false;
    const at = Math.floor(day);
    p.set({ ...p.state, log: log ? `${log},${at}` : String(at) });
    return true;
  };
  useKeys({ b: () => (!inMarket ? trade() : false), s: () => (inMarket ? trade() : false) });

  const lo = Math.min(Math.min(...ghost) - 3, Math.min(...you.slice(0, d + 1)) - 1);
  const hi = Math.max(Math.max(...ghost) + 2, Math.max(...you.slice(0, d + 1)) + 1);
  const f = frame(narrow, days, lo, hi, true);
  const monthAt = (m: number) => Math.round((m * last) / 12);
  // Spans in the market so far: from each buy to its sell, or to today.
  const spans: [number, number][] = [];
  for (let i = 0; i < switches.length; i += 2) if (switches[i] <= d) spans.push([switches[i], Math.min(switches[i + 1] ?? d, d)]);
  const trips = Math.ceil(switches.length / 2);

  return (
    <>
      <div className="bg-head">
        <span className={cx("bg-status", inMarket ? "is-in" : "is-out")}>{over ? "Year over" : !started ? "Day 1 · in cash" : `Day ${d + 1} · ${inMarket ? "in the market" : "in cash"}`}</span>
        <span className="bg-legend">
          <i className="is-you" /> You <i className="is-ghost" /> Ghost
        </span>
      </div>
      <svg className="ab-svg bg-svg" viewBox={`0 0 ${f.W} ${f.H}`} role="img" aria-label={`Day ${d + 1} of ${days}. You ${pct(you[d])}, the ghost ${pct(ghost[d])}.`}>
        <Grid f={f} monthAt={monthAt} />
        {spans.map(([a, b]) => (
          <rect key={a} className="bg-span" x={f.x(a)} y={f.T} width={Math.max(1, f.x(b) - f.x(a))} height={f.H - f.T - f.B} />
        ))}
        {started && <path className="bg-line bg-line--ghost" d={line(f, ghost, d)} />}
        {started && <path className="bg-line bg-line--you" d={line(f, you, d)} />}
        {switches.map((s, i) =>
          s > d ? null : (
            <g key={i} className={cx("bg-mark", i % 2 ? "is-sell" : "is-buy")} style={{ transform: `translate(${f.x(s)}px, ${f.y(you[s])}px)` }}>
              <path d={i % 2 ? "M-5 -13 L5 -13 L0 -6 Z" : "M-5 13 L5 13 L0 6 Z"} />
              <text className="bg-fee" y={i % 2 ? -18 : 26} textAnchor="middle" fontSize={f.font - 1}>
                −{(g.cost / 2).toFixed(1)}
              </text>
            </g>
          ),
        )}
        {started && !over && (
          <g className="bg-now">
            <line x1={f.x(d)} x2={f.x(d)} y1={f.T} y2={f.H - f.B} />
            <circle className="is-ghost" cx={f.x(d)} cy={f.y(ghost[d])} r={3.5} />
            <circle className="is-you" cx={f.x(d)} cy={f.y(you[d])} r={4.5} />
          </g>
        )}
        {over && <Gap f={f} at={last} net={you[last]} ghost={ghost[last]} />}
        {started && (
          <Tags
            f={f}
            x={f.right}
            items={[
              { key: "ghost", v: ghost[d], name: "GHOST", cls: "is-ghost" },
              { key: "you", v: you[d], name: "YOU", cls: "is-you" },
            ]}
          />
        )}
        {!started && (
          <text className="bg-ready" x={(f.L + f.right) / 2} y={(f.T + f.H - f.B) / 2} textAnchor="middle" fontSize={f.font + 2}>
            One year, about {YEAR_SECONDS} seconds
          </text>
        )}
      </svg>
      <div className="ab-stats">
        <div className={cx("ab-stat ab-stat--units", over && you[last] >= ghost[last] && "is-lit")}>
          <span>You, after costs</span>
          <b className="num">{pct(you[d])}</b>
        </div>
        <div className="ab-stat">
          <span>Ghost</span>
          <b className="num">{pct(ghost[d])}</b>
        </div>
        <div className="ab-stat ab-stat--sell">
          <span>{trips === 1 ? "1 round trip" : `${trips} round trips`}</span>
          <b className="num">−{((switches.length + (over && inMarket ? 1 : 0)) * (g.cost / 2)).toFixed(1)}</b>
        </div>
      </div>
      {!over && !p.solved && (
        <div className="bg-controls">
          {!started ? (
            <button type="button" className="ml-btn ml-btn--primary ml-btn--lg" onClick={start}>
              <Icon name="play" size={18} /> Start the year
            </button>
          ) : (
            <>
              <button type="button" className="ml-iconbtn ml-iconbtn--md ml-iconbtn--tertiary" onClick={() => setPlaying((x) => !x)} aria-label={playing ? "Pause" : "Resume"}>
                <Icon name={playing ? "pause" : "play"} size={18} />
              </button>
              <button ref={tradeBtn} type="button" className={cx("ml-btn ml-btn--lg bg-trade", inMarket ? "is-sell" : "is-buy")} onClick={trade} disabled={!playing} aria-keyshortcuts={inMarket ? "S" : "B"}>
                {inMarket ? "Sell" : "Buy"}
              </button>
              <button type="button" className={cx("ml-btn ml-btn--tertiary ml-btn--md bg-speed", fast && "is-on")} onClick={() => setFast((x) => !x)} aria-pressed={fast}>
                3×
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export function BenchmarkGhost(p: TaskWidgetProps) {
  const g = p.task.data?.ghost;
  const [ref, narrow] = useNarrow();
  if (!g) return null;
  return (
    <div ref={ref} className={cx("ab bg", `bg--${g.mode}`, narrow && "is-narrow")}>
      {g.mode === "trips" ? <Trips p={p} g={g} narrow={narrow} /> : <Race p={p} g={g} narrow={narrow} />}
    </div>
  );
}
