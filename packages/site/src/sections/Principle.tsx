import { useMemo, useRef } from "react";
import { EXACT, FLOOR } from "../data/facts";
import { prefersReducedMotion, useCountUp, useInView, useScrollProgress } from "../motion/hooks";

const STATS = [
  { value: FLOOR.lessons, plus: true, label: "bite-size lessons" },
  { value: FLOOR.questions, plus: true, label: "practice questions" },
  { value: EXACT.regimes, plus: false, label: "market regimes" },
  { value: EXACT.bots + 1, plus: false, label: "rival bots" },
  { value: 0, plus: false, label: "real money at risk" },
];

function Stat({ value, plus, label, run }: { value: number; plus: boolean; label: string; run: boolean }) {
  const v = useCountUp(value, run, 1600);
  return (
    <li className="tx-stat">
      <span className="tx-stat-value num">
        {Math.round(v).toLocaleString("en-US")}
        {plus && <span className="tx-stat-plus">+</span>}
      </span>
      <span className="tx-stat-label">{label}</span>
    </li>
  );
}

export function Stats() {
  const ref = useRef<HTMLUListElement>(null);
  const run = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <section className="tx-stats-wrap" aria-label="Tradelix in numbers">
      <ul ref={ref} className="tx-wrap tx-stats" data-reveal>
        {STATS.map((s) => (
          <Stat key={s.label} {...s} run={run} />
        ))}
      </ul>
    </section>
  );
}

const MANIFESTO = "A good decision can lose money. A bad one can get lucky. Most platforms grade the outcome. Tradelix grades the decision.";

const PILLARS = [
  {
    key: "dq",
    label: "Decision quality",
    value: "86",
    unit: "/100",
    text: "Was the call sound with what you could see at the time? Thesis, timing, invalidation.",
  },
  {
    key: "rd",
    label: "Risk discipline",
    value: "100",
    unit: "/100",
    text: "Did you respect your own limits? A stop before entry, size within budget, no moving the goalposts.",
  },
  {
    key: "out",
    label: "Simulated outcome",
    value: "±R",
    unit: "",
    text: "What the market paid. Always shown, never blended into your grade.",
  },
];

export function Principle() {
  const text = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => MANIFESTO.split(" "), []);
  // Words light up one by one as the paragraph crosses the middle of the screen.
  useScrollProgress(
    text,
    (p) => {
      const el = text.current;
      if (!el) return;
      const lit = Math.round(p * (words.length + 2));
      el.querySelectorAll("span").forEach((s, i) => s.classList.toggle("is-lit", i < lit));
    },
    { start: 0.85, end: 0.45, enabled: !prefersReducedMotion() },
  );

  return (
    <section className="tx-section tx-principle" aria-labelledby="tx-principle-title">
      <div className="tx-wrap">
        <span className="tx-eyebrow" data-reveal>
          The principle
        </span>
        <h2 id="tx-principle-title" className="tx-sr">
          We grade the decision, not the outcome
        </h2>
        <p ref={text} className="tx-manifesto">
          {words.map((w, i) => (
            <span key={i} className={prefersReducedMotion() ? "is-lit" : undefined}>
              {w}{" "}
            </span>
          ))}
        </p>
        <div className="tx-pillars">
          {PILLARS.map((p, i) => (
            <article key={p.key} className={`tx-pillar tx-pillar--${p.key}`} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <PillarArt kind={p.key} />
              <span className="tx-mono tx-kicker">{p.label}</span>
              <span className="tx-pillar-value num">
                {p.value}
                <small>{p.unit}</small>
              </span>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
        <p className="tx-principle-foot" data-reveal>
          Three numbers, scored separately, every session. Never blended into one.
        </p>
      </div>
    </section>
  );
}

/** Small, quiet visuals for the three numbers: a ring, a filled bar, an outcome that flips. */
function PillarArt({ kind }: { kind: string }) {
  if (kind === "dq")
    return (
      <svg className="tx-pillar-art" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="46" className="pa-track" />
        <circle cx="60" cy="60" r="46" className="pa-ring" pathLength={100} />
      </svg>
    );
  if (kind === "rd")
    return (
      <svg className="tx-pillar-art" viewBox="0 0 120 120" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={14 + i * 20} y={26} width={12} height={68} rx={3} className="pa-cell" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </svg>
    );
  return (
    <svg className="tx-pillar-art" viewBox="0 0 120 120" aria-hidden="true">
      <path d="M10 70 L35 58 L52 64 L72 40 L92 48 L110 30" className="pa-up" />
      <path d="M10 50 L35 60 L52 54 L72 76 L92 70 L110 90" className="pa-down" />
    </svg>
  );
}
