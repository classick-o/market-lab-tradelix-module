import { useState, type ReactNode } from "react";
import { commission, formatPrice, maxQtyForRisk, parsePrice, riskAmount, type PositionSide } from "@market-lab/engine";
import { DEFAULT_COSTS } from "@market-lab/missions";
import { Card, PageHead, SubNav } from "../components/Page";
import { Checkbox, Icon, Segmented, TextField, cx } from "../components/ui";
import { formatPct, money } from "../format";
import { Link } from "../router";

const PRESETS = [
  { id: "missions", label: "Missions · 1%", pct: 1 },
  { id: "arena", label: "Arena · 2%", pct: 2 },
  { id: "volatile", label: "Volatile scenarios · 1%", pct: 1 },
  { id: "custom", label: "Custom", pct: null },
] as const;

function Check({ ok, children }: { ok: boolean | null; children: ReactNode }) {
  return (
    <li className={cx("ml-validate", ok === true && "is-ok", ok === false && "is-bad")}>
      <Icon name={ok === null ? "info" : ok ? "check-circle" : "alert"} size={16} />
      <span>{children}</span>
    </li>
  );
}

/**
 * Transparent position-sizing calculator. Uses the same functions as the simulator, so its
 * numbers match what the Arena will charge. Free on every plan: risk maths is never paywalled.
 */
export function RiskCalculatorPage() {
  const [account, setAccount] = useState("10000");
  const [riskPct, setRiskPct] = useState("1");
  const [side, setSide] = useState<PositionSide>("long");
  const [entry, setEntry] = useState("100.00");
  const [stop, setStop] = useState("98.00");
  const [target, setTarget] = useState("104.00");
  const [costs, setCosts] = useState(true);
  const [preset, setPreset] = useState<(typeof PRESETS)[number]["id"]>("missions");
  const [customLimit, setCustomLimit] = useState("1.5");
  const [maxExposure, setMaxExposure] = useState("100");

  const eq = parsePrice(account);
  const e = parsePrice(entry);
  const s = parsePrice(stop);
  const t = target.trim() ? parsePrice(target) : null;
  const rp = Number(riskPct);
  const limitPct = preset === "custom" ? Number(customLimit) : PRESETS.find((p) => p.id === preset)!.pct!;
  const expPct = Number(maxExposure);
  const bps = costs ? DEFAULT_COSTS.commissionBps : 0;

  const errors: Record<string, string | null> = {
    account: eq === null ? "Enter an account size, e.g. 10000." : null,
    risk: !(rp > 0 && rp <= 100) ? "Enter a percentage above 0." : null,
    entry: e === null ? "Enter a price, e.g. 100.00." : null,
    stop: s === null ? "Enter a price." : e !== null && s !== null && (side === "long" ? s >= e : s <= e) ? `For a ${side}, the stop goes ${side === "long" ? "below" : "above"} the entry.` : null,
    target: target.trim() && t === null ? "Enter a price, or leave it empty." : t !== null && e !== null && (side === "long" ? t <= e : t >= e) ? `For a ${side}, the target goes ${side === "long" ? "above" : "below"} the entry.` : null,
  };
  const valid = !errors.account && !errors.risk && !errors.entry && !errors.stop;

  const r = valid
    ? (() => {
        const sizing = maxQtyForRisk({ equity: eq!, riskPct: rp, side, entry: e!, stop: s!, commissionBps: bps, maxNotional: expPct > 0 ? Math.floor((eq! * expPct) / 100) : undefined });
        const qty = sizing.qty;
        const distance = Math.abs(e! - s!);
        const lossAtStop = qty > 0 ? riskAmount(side, qty, e!, s!, bps) : 0;
        const fees = qty > 0 ? commission(qty * e!, bps) + commission(qty * s!, bps) : 0;
        const notional = qty * e!;
        const reward = t !== null && !errors.target && qty > 0 ? qty * Math.abs(t - e!) - commission(qty * e!, bps) - commission(qty * t, bps) : null;
        return { sizing, qty, distance, lossAtStop, fees, notional, reward };
      })()
    : null;
  const lossPct = r && eq ? (r.lossAtStop / eq) * 100 : 0;
  const exposurePct = r && eq ? (r.notional / eq) * 100 : 0;
  const rr = r?.reward != null && r.lossAtStop > 0 ? r.reward / r.lossAtStop : null;

  return (
    <div className="ml-page">
      <PageHead title="Risk Calculator" sub="Size a position from your stop, see exactly what you'd lose if it's hit, and check it against the limits. Every step of the maths is shown. Free on every plan." />
      <SubNav module="arena" />
      <div className="ml-calc">
        <Card title="Inputs" className="ml-calc-inputs">
          <div className="ml-stack-4">
            <div className="ml-grid-2">
              <TextField label="Account size" inputMode="decimal" value={account} onChange={(ev) => setAccount(ev.target.value)} error={errors.account} trailing={<span className="ml-field-unit">vUSD</span>} />
              <TextField label="Risk per trade" inputMode="decimal" value={riskPct} onChange={(ev) => setRiskPct(ev.target.value)} error={errors.risk} trailing={<span className="ml-field-unit">%</span>} />
            </div>
            <div className="ml-field">
              <span className="ml-field-label">Direction</span>
              <Segmented
                label="Direction"
                block
                value={side}
                onChange={setSide}
                options={[
                  { value: "long", label: "Long (buy)" },
                  { value: "short", label: "Short (sell)" },
                ]}
              />
            </div>
            <div className="ml-grid-2">
              <TextField label="Entry price" hint={side === "long" ? "Where you expect to buy (the ask)" : "Where you expect to sell (the bid)"} inputMode="decimal" value={entry} onChange={(ev) => setEntry(ev.target.value)} error={errors.entry} />
              <TextField label="Stop-loss" hint="Where the idea is proven wrong" inputMode="decimal" value={stop} onChange={(ev) => setStop(ev.target.value)} error={errors.stop} />
            </div>
            <TextField label="Target (optional)" hint="For reward-to-risk" inputMode="decimal" value={target} onChange={(ev) => setTarget(ev.target.value)} error={errors.target} />
            <Checkbox checked={costs} onChange={setCosts} label={`Include commission (${DEFAULT_COSTS.commissionBps / 100}% per fill, as in the simulator)`} />
            <fieldset className="ml-field">
              <legend className="ml-field-label">Limits to check against</legend>
              <label className="ml-select">
                <span>Risk limit</span>
                <select value={preset} onChange={(e) => setPreset(e.target.value as (typeof PRESETS)[number]["id"])}>
                  {PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              {preset === "custom" && <TextField label="Maximum risk per trade" inputMode="decimal" value={customLimit} onChange={(ev) => setCustomLimit(ev.target.value)} trailing={<span className="ml-field-unit">%</span>} />}
              <TextField label="Maximum exposure" hint="Position value as a % of the account. 100% means no leverage." inputMode="decimal" value={maxExposure} onChange={(ev) => setMaxExposure(ev.target.value)} trailing={<span className="ml-field-unit">%</span>} />
            </fieldset>
          </div>
        </Card>

        <div className="ml-stack-5">
          <Card eyebrow="Position size" className="ml-card--feature">
            {r ? (
              <div className="ml-stack-4" aria-live="polite">
                <div className="ml-calc-hero">
                  <span className="ml-calc-qty num">{r.qty}</span>
                  <span className="ml-muted">
                    units{" "}
                    {costs && r.sizing.simpleQty !== r.qty && (
                      <>
                        · {r.sizing.simpleQty} without costs
                      </>
                    )}
                    {r.sizing.cappedByBuyingPower && " · capped by the exposure limit"}
                  </span>
                </div>
                <dl className="ml-calc-grid">
                  <div>
                    <dt>Risk budget</dt>
                    <dd className="num">{money(r.sizing.budget)}</dd>
                    <span>
                      {formatPrice(eq!)} × {rp}%
                    </span>
                  </div>
                  <div>
                    <dt>Stop distance</dt>
                    <dd className="num">{formatPrice(r.distance)}</dd>
                    <span>{formatPct((r.distance / e!) * 100)} of the entry price</span>
                  </div>
                  <div>
                    <dt>Estimated loss at stop</dt>
                    <dd className="num">{money(r.lossAtStop)}</dd>
                    <span>
                      {formatPct(lossPct)} of the account{costs ? ` · incl. ${formatPrice(r.fees)} fees` : ""}
                    </span>
                  </div>
                  <div>
                    <dt>Position value</dt>
                    <dd className="num">{money(r.notional)}</dd>
                    <span>{formatPct(exposurePct)} of the account</span>
                  </div>
                  <div>
                    <dt>Reward-to-risk</dt>
                    <dd className="num">{rr !== null ? `${rr.toFixed(2)} : 1` : "—"}</dd>
                    <span>{rr !== null ? `Break-even win rate ${formatPct(100 / (1 + rr))}` : "Add a target to see it"}</span>
                  </div>
                  <div>
                    <dt>Reward if the target fills</dt>
                    <dd className="num">{r.reward !== null ? money(r.reward) : "—"}</dd>
                    <span>{r.reward !== null ? "After both commissions" : " "}</span>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="ml-muted">Fix the highlighted inputs to see the result.</p>
            )}
          </Card>

          <Card title="Validation">
            <ul className="ml-validation">
              <Check ok={r ? r.qty > 0 : null}>{r && r.qty === 0 ? "The stop is too far for this budget: not even one unit fits." : "At least one unit fits the risk budget."}</Check>
              <Check ok={r ? lossPct <= limitPct + 1e-9 : null}>
                Loss at stop {r ? formatPct(lossPct) : "—"} vs the {limitPct}% limit
              </Check>
              <Check ok={r ? exposurePct <= expPct + 1e-9 : null}>
                Exposure {r ? formatPct(exposurePct) : "—"} vs the {expPct}% limit
              </Check>
              <Check ok={rr === null ? null : rr >= 1.5}>{rr === null ? "No target set: the reward isn't defined." : `Reward-to-risk ${rr.toFixed(2)} : 1 ${rr >= 1.5 ? "is at least 1.5" : "is below 1.5"}`}</Check>
              <Check ok={rp <= limitPct}>
                Risk setting {rp}% {rp <= limitPct ? "is within" : "is above"} the {limitPct}% limit
              </Check>
            </ul>
            <p className="ml-fine">A stop that gaps can fill worse than its price, so the real loss can be larger than estimated.</p>
          </Card>

          <Card title="How it's calculated">
            <ol className="ml-steps-list">
              <li>
                Risk budget = account × risk % = {eq ? formatPrice(eq) : "—"} × {rp || "—"}% = <b className="num">{r ? money(r.sizing.budget) : "—"}</b>
              </li>
              <li>
                Distance to stop = |entry − stop| = <b className="num">{r ? formatPrice(r.distance) : "—"}</b> per unit
              </li>
              <li>
                Units = budget ÷ (distance{costs ? " + commission per unit" : ""}), rounded down = <b className="num">{r ? r.qty : "—"}</b>
              </li>
              <li>
                Loss at stop = units × distance{costs ? " + entry and exit commission" : ""} = <b className="num">{r ? money(r.lossAtStop) : "—"}</b>
              </li>
            </ol>
            <p className="ml-fine">
              Learn why in <Link to="/learn/lessons/L09" className="ml-text-link">Sizing a position from the stop</Link> and practise in the <Link to="/mission/M05" className="ml-text-link">Size Matters</Link> mission.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
