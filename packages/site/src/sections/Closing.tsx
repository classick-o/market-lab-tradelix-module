/** Straight answers, then the last call to action. */
import { useId, useState } from "react";
import { useSite } from "../context";
import { Icon } from "../components/Icon";
import { APP_ROUTES, EXACT } from "../data/facts";
import { useTilt } from "../motion/hooks";
import objCta from "../assets/obj-cta.webp";

const FAQ = [
  {
    q: "Is any of this real money?",
    a: "No. Every order runs on synthetic markets with virtual money. Nothing you do here touches a broker, an exchange or your bank account.",
  },
  {
    q: "Will Tradelix make me profitable?",
    a: "No simulator can promise that, and you should be wary of anyone who does. Tradelix builds the habits that keep losses planned and decisions clear. Real results depend on far more than any simulator can control.",
  },
  {
    q: "Why isn't my score just my profit?",
    a: "Because a good decision can lose and a bad one can win. Grading luck teaches the wrong lesson, so we grade the decision and show the outcome right next to it.",
  },
  {
    q: "Where does the market data come from?",
    a: "It's synthetic, generated to recreate specific situations: trends, ranges, breakouts, false breakouts and sudden shocks. It's labeled as synthetic everywhere it appears.",
  },
  {
    q: "I've never traded. Is this for me?",
    a: "Yes. Level 0 starts with what a price actually is, before any chart or order. If you already know the basics, pass a unit check and skip ahead.",
  },
  {
    q: "What's free, and what's Pro?",
    a: `Every mission, the daily and weekly challenges, the Risk Calculator and ${EXACT.freeRegimes} Arena scenarios are free. Pro adds the ${EXACT.regimes - EXACT.freeRegimes} hardest scenarios, unlimited Arena sessions, every learning track and your full analytics history.`,
  },
];

function Question({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <li className="tx-faq-item" data-open={open}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          {q}
          <span className="tx-faq-icon" aria-hidden="true">
            <Icon name="plus" size={18} />
          </span>
        </button>
      </h3>
      <div id={id} className="tx-faq-panel" role="region" aria-label={q} inert={!open}>
        <div>
          <p>{a}</p>
        </div>
      </div>
    </li>
  );
}

export function Faq() {
  return (
    <section className="tx-section tx-faq" aria-labelledby="tx-faq-title">
      <div className="tx-wrap tx-faq-grid">
        <header className="tx-head tx-head--left" data-reveal>
          <span className="tx-eyebrow">Questions</span>
          <h2 id="tx-faq-title" className="tx-h2">
            Straight answers.
          </h2>
          <p className="tx-lead">If a trading product won't tell you what it can't do, it isn't teaching you anything.</p>
        </header>
        <ul className="tx-faq-list" data-reveal>
          {FAQ.map((f) => (
            <Question key={f.q} {...f} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FinalCta() {
  const { appHref, visitor } = useSite();
  const tilt = useTilt<HTMLDivElement>(5);
  const back = visitor.returning;
  return (
    <section className="tx-final" aria-labelledby="tx-final-title">
      <div className="tx-final-rays" aria-hidden="true" />
      <div ref={tilt} className="tx-wrap tx-final-in">
        <span className="tx-final-obj" aria-hidden="true">
          <img src={objCta} width={266} height={560} alt="" loading="lazy" decoding="async" />
        </span>
        <h2 id="tx-final-title" className="tx-display tx-final-title" data-reveal>
          {back ? (
            <>
              Welcome back{visitor.name ? `, ${visitor.name}` : ""}.
              <br />
              <span className="tx-grad">Your next decision is waiting.</span>
            </>
          ) : (
            <>
              The next candle
              <br />
              <span className="tx-grad">is yours.</span>
            </>
          )}
        </h2>
        <p className="tx-lead" data-reveal>
          {back ? "Pick up where you left off: the course remembers your place, and your streak is counting." : `Your first mission takes about ${EXACT.firstMissionMinutes} minutes. Virtual money, real feedback.`}
        </p>
        <div className="tx-cta-row" data-reveal>
          <a className="tx-btn tx-btn--light tx-btn--lg" href={appHref(back ? APP_ROUTES.dashboard : APP_ROUTES.start)}>
            {back ? "Continue learning" : "Start your first mission"}
            <Icon name="arrow-right" size={18} />
          </a>
          <a className="tx-btn tx-btn--ghost tx-btn--lg" href={appHref(APP_ROUTES.learn)}>
            Explore the course
          </a>
        </div>
      </div>
    </section>
  );
}
