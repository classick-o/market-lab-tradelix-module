import { useRef, type CSSProperties } from "react";
import { useSite } from "../context";
import { Icon } from "../components/Icon";
import { APP_ROUTES } from "../data/facts";
import { useScrollProgress } from "../motion/hooks";
import portal1280 from "../assets/hero-portal-1280.webp";
import portal2400 from "../assets/hero-portal-2400.webp";

/** Sparks drifting up through the portal; positions are fixed so the layout never shifts. */
const SPARKS = [
  [8, 62, 0.0, 9],
  [14, 48, 2.4, 11],
  [21, 70, 1.1, 8],
  [27, 55, 3.6, 12],
  [34, 76, 0.6, 10],
  [66, 74, 2.0, 9],
  [72, 52, 0.3, 12],
  [78, 66, 3.1, 8],
  [85, 46, 1.6, 11],
  [91, 60, 4.2, 10],
  [44, 82, 2.8, 13],
  [57, 84, 1.3, 12],
] as const;

export function Hero() {
  const { appHref, visitor, scrollTo } = useSite();
  const ref = useRef<HTMLElement>(null);
  // The portal sinks and dims as the page scrolls away from it.
  useScrollProgress(ref, (p) => ref.current?.style.setProperty("--out", p.toFixed(3)), { start: 0, end: 0 });

  return (
    <section ref={ref} className="tx-hero" aria-labelledby="tx-hero-title">
      <div className="tx-hero-bg" aria-hidden="true">
        <img className="tx-hero-portal" src={portal1280} srcSet={`${portal1280} 1280w, ${portal2400} 2400w`} sizes="100vw" width={2400} height={1018} alt="" fetchPriority="high" decoding="async" />
        <div className="tx-hero-grid" />
        <div className="tx-hero-sparks">
          {SPARKS.map(([x, y, d, s], i) => (
            <i key={i} style={{ "--x": `${x}%`, "--y": `${y}%`, "--d": `${d}s`, "--s": `${s}s` } as CSSProperties} />
          ))}
        </div>
      </div>

      <div className="tx-wrap tx-hero-copy">
        <button type="button" className="tx-announce" onClick={() => scrollTo("duels")}>
          <span className="tx-announce-tag">New</span>
          <span>Real-time duels against trading bots</span>
          <Icon name="arrow-right" size={15} />
        </button>
        <h1 id="tx-hero-title" className="tx-display">
          <span className="tx-line">
            <span>Every trader pays tuition.</span>
          </span>
          <span className="tx-line">
            <span className="tx-grad">Here, it's virtual.</span>
          </span>
        </h1>
        <p className="tx-lead tx-hero-lead">
          Tradelix is a trading lab. Read the chart, set your risk, make the call. Then the future plays out, and you're graded on how you decided, not on whether you got lucky.
        </p>
        <div className="tx-cta-row tx-hero-cta">
          <a className="tx-btn tx-btn--light tx-btn--lg" href={appHref(visitor.returning ? APP_ROUTES.dashboard : APP_ROUTES.start)}>
            {visitor.returning ? "Continue learning" : "Start your first mission"}
            <Icon name="arrow-right" size={18} />
          </a>
          <button type="button" className="tx-btn tx-btn--ghost tx-btn--lg" onClick={() => scrollTo("demo")}>
            Make a call right here
          </button>
        </div>
        <p className="tx-fine tx-hero-fine">Free to start · Virtual money only · Not investment advice</p>
      </div>

      <button type="button" className="tx-scrollcue" onClick={() => scrollTo("demo")} aria-label="Scroll to the demo">
        <span className="tx-scrollcue-mouse" aria-hidden="true">
          <i />
        </span>
        <span className="tx-mono">Your first call is below</span>
      </button>
    </section>
  );
}
