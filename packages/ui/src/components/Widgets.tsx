import { useId, useState, type ComponentType } from "react";
import type { WidgetId } from "@market-lab/academy";
import { commission, maxQtyForRisk, parsePrice } from "@market-lab/engine";
import { formatPct, formatPrice, money } from "../format";
import { cx } from "./ui";

/**
 * Interactive lesson examples. They use the simulator's own maths (costs rounded up to the cent,
 * the same sizing function), so a number seen here matches what the Arena would charge.
 */

function Slider({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string }) {
  const id = useId();
  return (
    <div className="ml-slider">
      <label htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id} className="num">
          {format(value)}
        </output>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function Out({ items }: { items: { label: string; value: string; strong?: boolean; tone?: "pos" | "neg" }[] }) {
  return (
    <dl className="ml-widget-out" aria-live="polite">
      {items.map((i) => (
        <div key={i.label} className={cx(i.strong && "is-strong")}>
          <dt>{i.label}</dt>
          <dd className={cx("num", i.tone === "pos" && "ml-pos", i.tone === "neg" && "ml-neg")}>{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const p2 = (v: number) => v.toFixed(2);

function CandleBuilder() {
  const [o, setO] = useState(100);
  const [c, setC] = useState(101);
  const [hi, setHi] = useState(101.5);
  const [lo, setLo] = useState(99.2);
  const h = Math.max(hi, o, c);
  const l = Math.min(lo, o, c);
  const up = c >= o;
  const body = Math.abs(c - o);
  const upper = h - Math.max(o, c);
  const lower = Math.min(o, c) - l;
  const range = h - l || 0.01;
  const y = (v: number) => 12 + ((103 - v) / 6) * 156;
  const read =
    body < range * 0.15
      ? "A small body: buyers and sellers ended the hour close to where they started."
      : lower > body * 1.5
        ? "A long lower wick: price traded much lower during the hour but recovered before the close."
        : upper > body * 1.5
          ? "A long upper wick: price traded much higher during the hour but fell back before the close."
          : up
            ? "A solid bullish body: the hour closed well above its open."
            : "A solid bearish body: the hour closed well below its open.";
  return (
    <div className="ml-widget-grid">
      <div className="ml-stack-2">
        <Slider label="Open" value={o} min={97} max={103} step={0.1} onChange={setO} format={p2} />
        <Slider label="High" value={hi} min={97} max={103} step={0.1} onChange={setHi} format={p2} />
        <Slider label="Low" value={lo} min={97} max={103} step={0.1} onChange={setLo} format={p2} />
        <Slider label="Close" value={c} min={97} max={103} step={0.1} onChange={setC} format={p2} />
      </div>
      <div className="ml-widget-visual">
        <svg viewBox="0 0 120 180" className="ml-diagram" role="img" aria-label={`${up ? "Bullish" : "Bearish"} candle: open ${p2(o)}, high ${p2(h)}, low ${p2(l)}, close ${p2(c)}`}>
          <g className={up ? "dg-up" : "dg-down"}>
            <line x1={60} x2={60} y1={y(h)} y2={y(l)} className="dg-wick" />
            <rect x={44} y={y(Math.max(o, c))} width={32} height={Math.max(2, y(Math.min(o, c)) - y(Math.max(o, c)))} rx={2} className="dg-body" />
          </g>
        </svg>
        <Out
          items={[
            { label: "Direction", value: up ? "Bullish" : "Bearish", strong: true },
            { label: "Body", value: p2(body) },
            { label: "Upper wick", value: p2(upper) },
            { label: "Lower wick", value: p2(lower) },
            { label: "Range", value: p2(h - l) },
          ]}
        />
        <p className="ml-widget-note">{read}</p>
      </div>
    </div>
  );
}

function SpreadCost() {
  const [units, setUnits] = useState(50);
  const [mid, setMid] = useState(100);
  const [spread, setSpread] = useState(0.1);
  const midC = Math.round(mid * 100);
  const half = Math.round((spread * 100) / 2);
  const ask = midC + half;
  const bid = midC - half;
  const feeIn = commission(units * ask, 5);
  const feeOut = commission(units * bid, 5);
  const spreadCost = units * (ask - bid);
  const total = spreadCost + feeIn + feeOut;
  return (
    <div className="ml-widget-grid">
      <div className="ml-stack-2">
        <Slider label="Units" value={units} min={1} max={200} step={1} onChange={setUnits} format={(v) => String(v)} />
        <Slider label="Mid price" value={mid} min={20} max={200} step={0.5} onChange={setMid} format={p2} />
        <Slider label="Spread" value={spread} min={0.02} max={0.5} step={0.02} onChange={setSpread} format={p2} />
      </div>
      <Out
        items={[
          { label: "You buy at the ask", value: formatPrice(ask) },
          { label: "You sell at the bid", value: formatPrice(bid) },
          { label: "Spread cost", value: money(spreadCost) },
          { label: "Commission (0.05% × 2 fills)", value: `${formatPrice(feeIn)} + ${formatPrice(feeOut)}` },
          { label: "Round-trip cost", value: money(total), strong: true, tone: "neg" },
          { label: "Price must rise, per unit, to break even", value: formatPrice(Math.ceil(total / units)) },
        ]}
      />
    </div>
  );
}

function PositionSize() {
  const [account, setAccount] = useState(10000);
  const [risk, setRisk] = useState(1);
  const [entry, setEntry] = useState("100.00");
  const [stop, setStop] = useState("98.00");
  const e = parsePrice(entry);
  const s = parsePrice(stop);
  const valid = e !== null && s !== null && s < e;
  const r = valid ? maxQtyForRisk({ equity: account * 100, riskPct: risk, side: "long", entry: e!, stop: s!, commissionBps: 5, maxNotional: account * 100 }) : null;
  return (
    <div className="ml-widget-grid">
      <div className="ml-stack-2">
        <Slider label="Account" value={account} min={1000} max={50000} step={500} onChange={setAccount} format={(v) => `${v.toLocaleString("en-US")} vUSD`} />
        <Slider label="Risk per trade" value={risk} min={0.25} max={3} step={0.25} onChange={setRisk} format={(v) => `${v}%`} />
        <div className="ml-grid-2">
          <label className="ml-mini-field">
            <span>Entry (buy)</span>
            <input inputMode="decimal" value={entry} onChange={(ev) => setEntry(ev.target.value)} />
          </label>
          <label className="ml-mini-field">
            <span>Stop</span>
            <input inputMode="decimal" value={stop} onChange={(ev) => setStop(ev.target.value)} />
          </label>
        </div>
      </div>
      {r ? (
        <Out
          items={[
            { label: "Risk budget", value: money(r.budget) },
            { label: "Distance to stop", value: `${formatPrice(r.perUnit)} per unit` },
            { label: "Textbook size (no costs)", value: `${r.simpleQty} units` },
            { label: "Size including costs", value: `${r.qty} units`, strong: true },
            { label: "Loss if stopped", value: money(r.risk) },
            { label: "Position value", value: `${money(r.qty * e!)} · ${formatPct(((r.qty * e!) / (account * 100)) * 100)}` },
          ]}
        />
      ) : (
        <p className="ml-widget-note">Enter a stop below the entry price.</p>
      )}
    </div>
  );
}

function RiskRewardWidget() {
  const [risk, setRisk] = useState(2);
  const [reward, setReward] = useState(4);
  const rr = reward / risk;
  return (
    <div className="ml-widget-grid">
      <div className="ml-stack-2">
        <Slider label="Distance to stop" value={risk} min={0.5} max={5} step={0.25} onChange={setRisk} format={p2} />
        <Slider label="Distance to target" value={reward} min={0.5} max={12} step={0.25} onChange={setReward} format={p2} />
      </div>
      <Out
        items={[
          { label: "Reward-to-risk", value: `${rr.toFixed(2)} : 1`, strong: true },
          { label: "Break-even win rate", value: formatPct(100 / (1 + rr)) },
          { label: "Entry 100.00 → stop / target", value: `${p2(100 - risk)} / ${p2(100 + reward)}` },
        ]}
      />
    </div>
  );
}

function Expectancy() {
  const [win, setWin] = useState(45);
  const [avgWin, setAvgWin] = useState(2);
  const [avgLoss, setAvgLoss] = useState(1);
  const e = (win / 100) * avgWin - (1 - win / 100) * avgLoss;
  return (
    <div className="ml-widget-grid">
      <div className="ml-stack-2">
        <Slider label="Win rate" value={win} min={10} max={90} step={1} onChange={setWin} format={(v) => `${v}%`} />
        <Slider label="Average win" value={avgWin} min={0.5} max={5} step={0.1} onChange={setAvgWin} format={(v) => `${v.toFixed(1)}R`} />
        <Slider label="Average loss" value={avgLoss} min={0.5} max={3} step={0.1} onChange={setAvgLoss} format={(v) => `${v.toFixed(1)}R`} />
      </div>
      <Out
        items={[
          { label: "Expectancy per trade", value: `${e >= 0 ? "+" : "−"}${Math.abs(e).toFixed(2)}R`, strong: true, tone: e >= 0 ? "pos" : "neg" },
          { label: "Over 100 trades", value: `${e >= 0 ? "+" : "−"}${Math.abs(e * 100).toFixed(0)}R` },
          { label: "At 1% risk per trade, roughly", value: `${e >= 0 ? "+" : "−"}${Math.abs(e * 100).toFixed(0)}% of the account, before compounding and costs` },
        ]}
      />
      <p className="ml-widget-note">These are averages over many trades. Any short run can look very different, and real win rates aren't known in advance.</p>
    </div>
  );
}

function Exposure() {
  const [account, setAccount] = useState(10000);
  const [lev, setLev] = useState(1);
  const value = account * lev;
  return (
    <div className="ml-widget-grid">
      <div className="ml-stack-2">
        <Slider label="Account" value={account} min={1000} max={50000} step={500} onChange={setAccount} format={(v) => `${v.toLocaleString("en-US")} vUSD`} />
        <Slider label="Position value ÷ account" value={lev} min={0.25} max={10} step={0.25} onChange={setLev} format={(v) => `${v}×`} />
      </div>
      <Out
        items={[
          { label: "Position value", value: `${value.toLocaleString("en-US", { maximumFractionDigits: 0 })} vUSD`, strong: true },
          { label: "Exposure", value: formatPct(lev * 100, 0) },
          ...[1, 5, 10].map((m) => ({ label: `A ${m}% move against you`, value: `−${((value * m) / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })} vUSD · −${formatPct(lev * m, 1)} of the account`, tone: "neg" as const })),
        ]}
      />
      {lev > 1 && <p className="ml-widget-note">Above 1× you're using leverage. The simulator doesn't allow it: positions are capped at your equity.</p>}
    </div>
  );
}

function LossRecoveryWidget() {
  const [dd, setDd] = useState(20);
  const need = (dd / (100 - dd)) * 100;
  return (
    <div className="ml-widget-grid">
      <div className="ml-stack-2">
        <Slider label="Drawdown" value={dd} min={1} max={90} step={1} onChange={setDd} format={(v) => `−${v}%`} />
      </div>
      <Out
        items={[
          { label: "Left of the account", value: `${100 - dd}%` },
          { label: "Gain needed to recover", value: `+${need.toFixed(1)}%`, strong: true, tone: "neg" },
          { label: "Losing trades of 1% to get there", value: `${Math.ceil(Math.log(1 - dd / 100) / Math.log(0.99))} in a row` },
        ]}
      />
    </div>
  );
}

const WIDGETS: Record<WidgetId, ComponentType> = {
  "candle-builder": CandleBuilder,
  "spread-cost": SpreadCost,
  "position-size": PositionSize,
  "risk-reward": RiskRewardWidget,
  expectancy: Expectancy,
  exposure: Exposure,
  "loss-recovery": LossRecoveryWidget,
};

export function Widget({ id }: { id: WidgetId }) {
  const W = WIDGETS[id];
  return W ? <W /> : null;
}
