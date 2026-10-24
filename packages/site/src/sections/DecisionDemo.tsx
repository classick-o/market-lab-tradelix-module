/**
 * The homepage's hook: make one call on a live-looking chart. The future sits under a hatched veil
 * ("The Reveal", the module's signature), the veil retracts after the call, and three scores
 * appear. "Same call, other future" replays the same decision against a different future: the
 * grade stays, the outcome flips. Built with React for structure and GSAP (loaded on demand) for motion.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useSite } from "../context";
import { Icon } from "../components/Icon";
import { APP_ROUTES, EXACT } from "../data/facts";
import { ENTRY, FUTURES, GRADES, HISTORY_BARS, HISTORY_SMA, VERDICTS, outcomeOf, planFor, type Bar, type Call, type FutureId } from "../data/market";
import { onScrollFrame, prefersReducedMotion, useCountUp, useInView, useMedia } from "../motion/hooks";

type Phase = "idle" | "intro" | "ask" | "revealing" | "result";
type Gsap = typeof import("gsap").gsap;

interface Layout {
  w: number;
  h: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  shown: number;
  font: number;
}

const WIDE: Layout = { w: 1000, h: 440, left: 18, right: 908, top: 34, bottom: 414, shown: 48, font: 13 };
const NARROW: Layout = { w: 600, h: 500, left: 10, right: 520, top: 40, bottom: 478, shown: 26, font: 20 };
const FUTURE_LEN = 18;

const CALLS: { id: Call; label: string }[] = [
  { id: "buy", label: "Buy" },
  { id: "wait", label: "Wait" },
  { id: "sell", label: "Sell" },
];

function useGeometry(L: Layout) {
  return useMemo(() => {
    const history = HISTORY_BARS.slice(-L.shown);
    const sma = HISTORY_SMA.slice(-L.shown);
    const all: Bar[] = [...history, ...FUTURES.A, ...FUTURES.B];
    const plans = [planFor("buy")!, planFor("sell")!];
    let lo = Math.min(...all.map((b) => b.l), ...plans.map((p) => Math.min(p.stop, p.target)));
    let hi = Math.max(...all.map((b) => b.h), ...plans.map((p) => Math.max(p.stop, p.target)));
    const pad = (hi - lo) * 0.06;
    lo -= pad;
    hi += pad;
    const n = L.shown + FUTURE_LEN;
    const step = (L.right - L.left) / n;
    const x = (i: number) => L.left + step * (i + 0.5);
    const y = (p: number) => L.bottom - ((p - lo) / (hi - lo)) * (L.bottom - L.top);
    const nowX = L.left + step * L.shown;
    const ticks: number[] = [];
    const span = hi - lo;
    const unit = span > 8 ? 2 : 1;
    for (let p = Math.ceil(lo / unit) * unit; p < hi; p += unit) ticks.push(p);
    const smaD = sma
      .map((v, i) => (v === null ? null : `${x(i).toFixed(1)} ${y(v).toFixed(1)}`))
      .filter(Boolean)
      .map((pt, i) => `${i ? "L" : "M"}${pt}`)
      .join(" ");
    return { history, step, x, y, nowX, ticks, smaD, body: Math.max(2, step * 0.56) };
  }, [L]);
}

function Candle({ b, cx, y, body }: { b: Bar; cx: number; y: (p: number) => number; body: number }) {
  const up = b.c >= b.o;
  const top = y(Math.max(b.o, b.c));
  const h = Math.max(1.2, Math.abs(y(b.o) - y(b.c)));
  return (
    <g className={up ? "dd-up" : "dd-down"}>
      <line x1={cx} x2={cx} y1={y(b.h)} y2={y(b.l)} />
      <rect x={cx - body / 2} y={top} width={body} height={h} rx={Math.min(1.5, body / 4)} />
    </g>
  );
}

function ScoreTile({ label, value, suffix, tone, run, format }: { label: string; value: number | null; suffix?: string; tone?: "pos" | "neg" | null; run: boolean; format?: (v: number) => string }) {
  const v = useCountUp(Math.abs(value ?? 0), run && value !== null, 1100);
  const shown = value === null ? "—" : format ? format(value < 0 ? -v : v) : Math.round(v).toString();
  return (
    <div className={`dd-score ${tone ? `is-${tone}` : ""}`} data-on={run && value !== null}>
      <span className="tx-mono dd-score-label">{label}</span>
      <span className="dd-score-value num">
        {shown}
        {suffix && value !== null && <small>{suffix}</small>}
      </span>
    </div>
  );
}

const fmtR = (r: number) => `${r > 0.004 ? "+" : r < -0.004 ? "−" : ""}${Math.abs(r).toFixed(1)}R`;

export function DecisionDemo() {
  const { appHref, visitor } = useSite();
  const narrow = useMedia("(max-width: 720px)");
  const L = narrow ? NARROW : WIDE;
  const g = useGeometry(L);
  const panel = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gsapRef = useRef<Gsap | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const seen = useInView(panel, { margin: "0px 0px -20% 0px", once: true });
  const [phase, setPhase] = useState<Phase>("idle");
  const [call, setCall] = useState<Call | null>(null);
  const [future, setFuture] = useState<FutureId>("A");
  const [tried, setTried] = useState<Set<FutureId>>(new Set());

  const plan = call ? planFor(call) : null;
  const result = call ? outcomeOf(plan, FUTURES[future]) : null;
  const futureBars = FUTURES[future];
  const fx = (i: number) => g.x(L.shown + i);

  // The panel lies back in perspective and straightens as it scrolls into place.
  useEffect(() => {
    const el = panel.current;
    if (!el || prefersReducedMotion()) return;
    return onScrollFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = Math.min(1, Math.max(0, (r.top - vh * 0.18) / (vh * 0.72)));
      el.style.setProperty("--tilt", t.toFixed(3));
    });
  }, []);

  // Intro: grid, candles, average, then the veil slides over the future.
  useEffect(() => {
    if (!seen || phase !== "idle") return;
    let alive = true;
    setPhase("intro");
    void import("gsap").then(({ gsap }) => {
      if (!alive || !svgRef.current) return;
      gsapRef.current = gsap;
      const q = gsap.utils.selector(svgRef.current);
      const tl = gsap.timeline({ onComplete: () => alive && setPhase("ask") });
      tl.from(q(".dd-grid line, .dd-grid text"), { opacity: 0, duration: 0.5, stagger: 0.04 })
        .from(q(".dd-history > g"), { scaleY: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.45, stagger: 0.018, ease: "power3.out" }, 0.1)
        .fromTo(q(".dd-sma"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 0.5)
        .from(q(".dd-now"), { opacity: 0, duration: 0.4 }, 0.9)
        .from(q(".dd-veil-in"), { scaleX: 0, transformOrigin: "100% 50%", duration: 0.8, ease: "expo.out" }, 1.0)
        .from(q(".dd-veil-label"), { opacity: 0, y: 8, duration: 0.5 }, 1.4);
      if (prefersReducedMotion()) tl.progress(1);
      tlRef.current = tl;
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);

  // Reveal: the plan draws, the veil retracts candle by candle, the result lands.
  useEffect(() => {
    const gsap = gsapRef.current;
    const svg = svgRef.current;
    if (phase !== "revealing" || !gsap || !svg || !call) return;
    const q = gsap.utils.selector(svg);
    tlRef.current?.kill();
    const per = 0.085;
    const tl = gsap.timeline({ onComplete: () => setPhase("result") });
    const bars = q(`.dd-future[data-f="${future}"] > g`);
    gsap.set(q(".dd-future"), { opacity: 0 });
    gsap.set(q(`.dd-future[data-f="${future}"]`), { opacity: 1 });
    gsap.set(bars, { opacity: 0, scaleY: 0.2, transformOrigin: "50% 50%" });
    gsap.set(q(".dd-veil-move"), { x: 0 });
    gsap.set(q(".dd-hit"), { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
    tl.fromTo(q(".dd-plan line"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.45, stagger: 0.06, ease: "power3.out" })
      .fromTo(q(".dd-plan text, .dd-plan rect"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.2)
      .to(q(".dd-veil-label"), { opacity: 0, duration: 0.25 }, 0.2)
      .to(q(".dd-veil-move"), { x: L.right - g.nowX + 4, duration: FUTURE_LEN * per, ease: "none" }, 0.45)
      .to(bars, { opacity: 1, scaleY: 1, duration: 0.32, stagger: per, ease: "back.out(2)" }, 0.45);
    if (result?.at !== null && result?.at !== undefined) tl.to(q(".dd-hit"), { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.4)" }, 0.45 + (result.at + 1) * per);
    if (prefersReducedMotion()) tl.progress(1);
    tlRef.current = tl;
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, call, future]);

  const choose = (c: Call) => {
    if (phase !== "ask") return;
    setCall(c);
    setTried(new Set([future]));
    setPhase("revealing");
  };
  const otherFuture = () => {
    const next: FutureId = future === "A" ? "B" : "A";
    setFuture(next);
    setTried((t) => new Set(t).add(next));
    setPhase("revealing");
  };
  const reset = () => {
    const gsap = gsapRef.current;
    const svg = svgRef.current;
    if (gsap && svg) {
      const q = gsap.utils.selector(svg);
      gsap.to(q(".dd-future"), { opacity: 0, duration: 0.3 });
      gsap.to(q(".dd-veil-move"), { x: 0, duration: 0.6, ease: "expo.out" });
      gsap.to(q(".dd-veil-label"), { opacity: 1, duration: 0.4, delay: 0.3 });
    }
    setCall(null);
    setPhase("ask");
  };

  const grade = call ? GRADES[call] : null;
  const showScores = phase === "result";
  const both = tried.size === 2 && call !== "wait";
  const hitBar = result && result.at !== null ? futureBars[result.at] : null;
  const hitPrice = plan && result && result.at !== null ? (result.r > 0 ? plan.target : plan.stop) : null;

  return (
    <section id="demo" className="tx-demo-wrap" aria-labelledby="tx-demo-title">
      <div className="tx-wrap">
        <div ref={panel} className="tx-demo" data-phase={phase}>
          <div className="tx-demo-glow" aria-hidden="true" />
          <div className="tx-demo-bar">
            <span className="tx-demo-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="tx-mono">LABX · 1H · Synthetic market</span>
            <span className="tx-demo-live tx-mono">
              <i aria-hidden="true" />
              Mission preview
            </span>
          </div>
          <div className="tx-demo-body">
            <div className="tx-demo-chart">
              <svg ref={svgRef} viewBox={`0 0 ${L.w} ${L.h}`} role="img" aria-label="Price chart of LABX in an uptrend, pulling back to its 20-period average. The candles after the decision point are hidden until you make a call." style={{ fontSize: L.font }}>
                <defs>
                  <pattern id="dd-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="10" className="dd-hatch-line" />
                  </pattern>
                  <linearGradient id="dd-veil-edge" x1="0" x2="1">
                    <stop offset="0" stopColor="#55a8ff" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#55a8ff" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="dd-plot">
                    <rect x={g.nowX} y={0} width={L.right - g.nowX + 2} height={L.h} />
                  </clipPath>
                </defs>
                <g className="dd-grid">
                  {g.ticks.map((p) => (
                    <g key={p}>
                      <line x1={L.left} x2={L.right} y1={g.y(p)} y2={g.y(p)} />
                      <text x={L.right + 10} y={g.y(p) + 4}>
                        {p.toFixed(2)}
                      </text>
                    </g>
                  ))}
                </g>
                <g className="dd-history">
                  {g.history.map((b, i) => (
                    <Candle key={i} b={b} cx={g.x(i)} y={g.y} body={g.body} />
                  ))}
                </g>
                <path d={g.smaD} className="dd-sma" pathLength={1} />
                {(["A", "B"] as FutureId[]).map((f) => (
                  <g key={f} className="dd-future" data-f={f} opacity={0}>
                    {FUTURES[f].map((b, i) => (
                      <Candle key={i} b={b} cx={fx(i)} y={g.y} body={g.body} />
                    ))}
                  </g>
                ))}
                {plan && phase !== "ask" && (
                  <g className="dd-plan" key={call}>
                    <line className="dd-entry" x1={g.nowX} x2={L.right} y1={g.y(plan.entry)} y2={g.y(plan.entry)} />
                    <line className="dd-stop" x1={g.nowX} x2={L.right} y1={g.y(plan.stop)} y2={g.y(plan.stop)} />
                    <line className="dd-target" x1={g.nowX} x2={L.right} y1={g.y(plan.target)} y2={g.y(plan.target)} />
                    <text className="dd-tag dd-tag--stop" x={L.right - 4} y={g.y(plan.stop) + (plan.side === 1 ? 16 : -7)} textAnchor="end">
                      STOP {plan.stop.toFixed(2)}
                    </text>
                    <text className="dd-tag dd-tag--target" x={L.right - 4} y={g.y(plan.target) + (plan.side === 1 ? -7 : 16)} textAnchor="end">
                      TARGET {plan.target.toFixed(2)}
                    </text>
                  </g>
                )}
                {hitBar && hitPrice !== null && result && (
                  <g className={`dd-hit ${result.r > 0 ? "is-pos" : "is-neg"}`} key={`${call}-${future}`} opacity={0}>
                    <circle cx={fx(result.at!)} cy={g.y(hitPrice)} r={narrow ? 10 : 6} />
                    <circle cx={fx(result.at!)} cy={g.y(hitPrice)} r={narrow ? 22 : 14} className="dd-hit-ring" />
                  </g>
                )}
                <g className="dd-now">
                  <line x1={g.nowX} x2={g.nowX} y1={L.top - 14} y2={L.bottom} />
                  <circle cx={g.nowX} cy={g.y(ENTRY)} r={narrow ? 7 : 4.5} />
                  <text x={g.nowX - 8} y={L.top - 18} textAnchor="end">
                    NOW
                  </text>
                </g>
                <g clipPath="url(#dd-plot)">
                  <g className="dd-veil-move">
                    <g className="dd-veil-in">
                      <rect x={g.nowX} y={L.top - 24} width={L.right - g.nowX + 2} height={L.bottom - L.top + 34} className="dd-veil-fill" />
                      <rect x={g.nowX} y={L.top - 24} width={L.right - g.nowX + 2} height={L.bottom - L.top + 34} fill="url(#dd-hatch)" />
                      <rect x={g.nowX} y={L.top - 24} width={3} height={L.bottom - L.top + 34} fill="url(#dd-veil-edge)" />
                    </g>
                  </g>
                </g>
                <g className="dd-veil-label">
                  <text x={(g.nowX + L.right) / 2} y={(L.top + L.bottom) / 2 - 4} textAnchor="middle">
                    THE FUTURE
                  </text>
                  <text x={(g.nowX + L.right) / 2} y={(L.top + L.bottom) / 2 + (narrow ? 26 : 16)} textAnchor="middle" className="dd-veil-sub">
                    hidden until you decide
                  </text>
                </g>
              </svg>
              {result && phase === "result" && call !== "wait" && (
                <span className={`dd-badge num ${result.r > 0 ? "is-pos" : "is-neg"}`} aria-hidden="true">
                  {fmtR(result.r)}
                </span>
              )}
            </div>

            <aside className="tx-demo-side">
              {phase === "result" && call ? (
                <div className="dd-result" key={`${call}-${future}`}>
                  <span className="tx-mono tx-kicker">
                    Your call: {call} · Future {future === "A" ? "1" : "2"} of 2
                  </span>
                  <div className="dd-scores">
                    <ScoreTile label="Decision quality" value={grade!.dq} suffix="/100" run={showScores} />
                    <ScoreTile label="Risk discipline" value={grade!.rd} suffix="/100" run={showScores} />
                    <ScoreTile label="Simulated outcome" value={result!.r} tone={result!.r > 0 ? "pos" : result!.r < 0 ? "neg" : null} run={showScores} format={fmtR} />
                  </div>
                  <p className="dd-verdict" aria-live="polite">
                    {VERDICTS[call][future]}
                  </p>
                  {both && <p className="dd-aha">Two futures. One grade. That's the whole idea.</p>}
                  <div className="dd-actions">
                    {call !== "wait" && (
                      <button type="button" className="tx-btn tx-btn--accent tx-btn--md" onClick={otherFuture}>
                        <Icon name="replay" size={17} />
                        Same call, other future
                      </button>
                    )}
                    <button type="button" className="tx-btn tx-btn--ghost tx-btn--md" onClick={reset}>
                      Change my call
                    </button>
                  </div>
                  {both && (
                    <a className="dd-next" href={appHref(visitor.returning ? APP_ROUTES.missions : APP_ROUTES.start)}>
                      Now try it on a real mission
                      <Icon name="arrow-right" size={16} />
                    </a>
                  )}
                </div>
              ) : (
                <div className="dd-ask">
                  <span className="tx-mono tx-kicker">Your call</span>
                  <h2 id="tx-demo-title" className="dd-q">
                    An uptrend pulls back to its 20-period average. Price is {ENTRY.toFixed(2)}. What do you do?
                  </h2>
                  <div className="dd-calls" role="group" aria-label="Your call">
                    {CALLS.map((c) => {
                      const p = planFor(c.id);
                      return (
                        <button key={c.id} type="button" className={`dd-call dd-call--${c.id}`} onClick={() => choose(c.id)} disabled={phase !== "ask"} aria-describedby={`dd-sub-${c.id}`}>
                          <span className="dd-call-label">{c.label}</span>
                          <span id={`dd-sub-${c.id}`} className="dd-call-sub num">
                            {p ? `Stop ${p.stop.toFixed(2)} · Target ${p.target.toFixed(2)}` : "Stay flat, risk nothing"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="dd-fine">
                    {phase === "revealing" ? "Revealing the future…" : `Risk is fixed at 1% of a ${EXACT.equity.toLocaleString("en-US")} vUSD account. No sign-up.`}
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
