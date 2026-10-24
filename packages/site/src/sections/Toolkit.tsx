/** The small tools, as a bento grid. The Risk Calculator and the flashcard are live. */
import { useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { useSite } from "../context";
import { Icon } from "../components/Icon";
import { APP_ROUTES, EXACT, FLOOR, SCENE_TEXT, TERMS } from "../data/facts";
import { seeded } from "@market-lab/ui/scenes/core";
import { useInView, useSpotlight, useTilt } from "../motion/hooks";
import objShield from "../assets/obj-shield.webp";

const ENTRY = 100;
const fmt = (v: number, d = 2) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

function Slider({ label, value, min, max, step, onChange, display }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  const id = useId();
  return (
    <div className="tx-slider">
      <div className="tx-slider-head">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="num">
          {display}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ "--p": `${((value - min) / (max - min)) * 100}%` } as CSSProperties} />
    </div>
  );
}

function RiskCard() {
  const { appHref } = useSite();
  const tilt = useTilt<HTMLElement>(4);
  const [risk, setRisk] = useState(1);
  const [stop, setStop] = useState(1.5);
  const maxLoss = (EXACT.equity * risk) / 100;
  const units = Math.floor(maxLoss / stop);
  const exposure = ((units * ENTRY) / EXACT.equity) * 100;
  const streak = (1 - Math.pow(1 - risk / 100, 5)) * 100;
  const hot = risk > 2;
  return (
    <article ref={tilt} className="tx-bento tx-bento--risk" data-spot data-hot={hot || undefined} aria-labelledby="tx-risk-title">
      <span className="tx-bento-obj" aria-hidden="true">
        <img src={objShield} width={459} height={560} alt="" loading="lazy" decoding="async" />
      </span>
      <span className="tx-mono tx-kicker">Risk Calculator · free on every plan</span>
      <h3 id="tx-risk-title" className="tx-bento-title">
        Size from risk, not from hope.
      </h3>
      <p className="tx-bento-text">Pick how much of a {EXACT.equity.toLocaleString("en-US")} vUSD account you'll risk and how far away your stop is. The size follows.</p>
      <div className="tx-risk">
        <div className="tx-risk-inputs">
          <Slider label="Risk per trade" value={risk} min={0.25} max={3} step={0.25} onChange={setRisk} display={`${fmt(risk)}%`} />
          <Slider label="Distance to stop" value={stop} min={0.25} max={5} step={0.25} onChange={setStop} display={fmt(stop)} />
        </div>
        <dl className="tx-risk-out">
          <div>
            <dt>Position size</dt>
            <dd className="num">
              {units.toLocaleString("en-US")} <small>units</small>
            </dd>
          </div>
          <div>
            <dt>Max loss</dt>
            <dd className="num">
              {fmt(maxLoss)} <small>vUSD</small>
            </dd>
          </div>
          <div>
            <dt>Exposure</dt>
            <dd className="num">{fmt(exposure, 0)}%</dd>
          </div>
        </dl>
      </div>
      <p className="tx-risk-note" data-hot={hot || undefined}>
        <Icon name={hot ? "bolt" : "shield"} size={16} />
        <span>
          Five losses in a row would cost <b className="num">{fmt(streak, 1)}%</b> of the account{hot ? ". That's a hole, not a drawdown." : ", and you'd still be in the game."}
        </span>
      </p>
      <a className="tx-arrow-link" href={appHref(APP_ROUTES.calculator)}>
        Open the full calculator
        <Icon name="arrow-right" size={16} />
      </a>
    </article>
  );
}

function ReviewCard() {
  return (
    <article className="tx-bento tx-bento--review" data-spot aria-labelledby="tx-review-title">
      <span className="tx-mono tx-kicker">Practice</span>
      <h3 id="tx-review-title" className="tx-bento-title">
        Review that remembers for you.
      </h3>
      <ol className="tx-intervals" aria-label="Review intervals in days">
        {EXACT.reviewDays.map((d, i) => (
          <li key={d} style={{ "--i": i } as CSSProperties}>
            <span className="num">{d}d</span>
          </li>
        ))}
      </ol>
      <p className="tx-bento-text">Miss a question and it comes back after one day, then three, seven, fourteen and thirty, until it sticks.</p>
    </article>
  );
}

function LibraryCard() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const term = TERMS[i];
  const next = () => {
    setFlipped(false);
    window.setTimeout(() => setI((n) => (n + 1) % TERMS.length), 180);
  };
  return (
    <article className="tx-bento tx-bento--library" data-spot aria-labelledby="tx-lib-title">
      <span className="tx-mono tx-kicker">Library</span>
      <h3 id="tx-lib-title" className="tx-bento-title">
        No jargon left unexplained.
      </h3>
      <button type="button" className="tx-flash" data-flipped={flipped} onClick={() => setFlipped((f) => !f)} aria-label={flipped ? `${term.term}: ${term.plain}. Show the term.` : `${term.term}. Show the meaning.`}>
        <span className="tx-flash-inner">
          <span className="tx-flash-face">
            <span className="tx-mono">Term</span>
            <b>{term.term}</b>
            <small>Tap to flip</small>
          </span>
          <span className="tx-flash-face tx-flash-back">
            <span className="tx-mono">In plain English</span>
            <span>{term.plain}</span>
          </span>
        </span>
      </button>
      <div className="tx-bento-row">
        <p className="tx-bento-text">
          {FLOOR.concepts}+ concepts and {FLOOR.terms}+ terms, each with a plain-English line.
        </p>
        <button type="button" className="tx-round-btn tx-round-btn--sm" onClick={next} aria-label="Next term">
          <Icon name="chevron-right" size={18} />
        </button>
      </div>
    </article>
  );
}

function DailyCard() {
  return (
    <article className="tx-bento tx-bento--daily" data-spot aria-labelledby="tx-daily-title">
      <span className="tx-mono tx-kicker">Daily challenge</span>
      <h3 id="tx-daily-title" className="tx-bento-title">
        Three questions. One objective. Every day.
      </h3>
      <div className="tx-daily">
        <span className="tx-daily-theme">{SCENE_TEXT.challenge.title}</span>
        <span className="tx-daily-obj">{SCENE_TEXT.challenge.objective}</span>
        <span className="tx-daily-steps" aria-hidden="true">
          <i data-on />
          <i data-on />
          <i />
        </span>
      </div>
      <p className="tx-bento-text">Plus a weekly scenario worth {EXACT.weeklyXp} XP.</p>
    </article>
  );
}

function StreakCard() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true });
  const cells = useMemo(() => {
    const r = seeded(9);
    return Array.from({ length: 16 * 7 }, (_, i) => {
      const w = Math.floor(i / 7);
      return w >= 14 ? 3 : r() < 0.2 + w * 0.04 ? 1 + Math.floor(r() * 3) : 0;
    });
  }, []);
  return (
    <article className="tx-bento tx-bento--streak" data-spot aria-labelledby="tx-streak-title">
      <span className="tx-mono tx-kicker">Learning streaks</span>
      <h3 id="tx-streak-title" className="tx-bento-title">
        Show up. It compounds.
      </h3>
      <div ref={ref} className="tx-heat" data-on={on} aria-hidden="true">
        {cells.map((v, i) => (
          <i key={i} data-v={v} style={{ "--i": Math.floor(i / 7) } as CSSProperties} />
        ))}
      </div>
      <p className="tx-bento-text">{EXACT.streakPausesPerWeek} pause days a week, so one busy day doesn't break the chain.</p>
    </article>
  );
}

function PortfolioCard() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true });
  const d = useMemo(() => {
    const r = seeded(14);
    let v = 50;
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      v += (r() - 0.42) * 6;
      pts.push(`${i ? "L" : "M"}${(i * 7.5).toFixed(1)} ${(80 - v * 0.9).toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);
  return (
    <article className="tx-bento tx-bento--portfolio" data-spot aria-labelledby="tx-port-title">
      <span className="tx-mono tx-kicker">Virtual portfolio</span>
      <h3 id="tx-port-title" className="tx-bento-title">
        Your book, at a glance.
      </h3>
      <div ref={ref} className="tx-equity" data-on={on}>
        <svg viewBox="0 0 300 90" preserveAspectRatio="none" aria-hidden="true">
          <path d={`${d} L300 90 L0 90 Z`} className="tx-equity-area" />
          <path d={d} className="tx-equity-line" pathLength={1} />
        </svg>
      </div>
      <p className="tx-bento-text">Equity, exposure, open risk and an equity curve for every Arena session.</p>
    </article>
  );
}

export function Toolkit() {
  const spot = useSpotlight<HTMLDivElement>();
  return (
    <section className="tx-section tx-toolkit" aria-labelledby="tx-toolkit-title">
      <div className="tx-wrap">
        <header className="tx-head" data-reveal>
          <span className="tx-eyebrow">The toolkit</span>
          <h2 id="tx-toolkit-title" className="tx-h2">
            Small tools. <span className="tx-grad">Serious habits.</span>
          </h2>
          <p className="tx-lead">The unglamorous parts of trading, made quick enough that you'll actually use them. Try the calculator: it's live.</p>
        </header>
        <div ref={spot} className="tx-bento-grid" data-reveal>
          <RiskCard />
          <ReviewCard />
          <LibraryCard />
          <DailyCard />
          <StreakCard />
          <PortfolioCard />
        </div>
      </div>
    </section>
  );
}
