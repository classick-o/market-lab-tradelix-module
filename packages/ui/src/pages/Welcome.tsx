import { useEffect, useMemo, useState } from "react";
import { SKILLS } from "@market-lab/learning";
import { getScenario } from "@market-lab/missions";
import { Chart } from "../components/Chart";
import { useReducedMotion } from "../components/Stage";
import { Button } from "../components/ui";
import { useRouter } from "../router";
import { useLab, useStore } from "../store";

const DEMO_START = 26;
const DEMO_DECISION = 71;

const STEPS = [
  { n: "01", title: "Observe", text: "Each mission drops you into a market situation with one clear objective. No lecture first." },
  { n: "02", title: "Decide", text: "State what you expect, where you'd be wrong and how much you can lose. Then the future plays out." },
  { n: "03", title: "Understand", text: "Your decision is scored on process, separately from profit, and compared with the alternatives." },
];

const FAQ = [
  { q: "Is this real money?", a: "No. Everything is simulated with virtual money. Nothing you do here touches a real market or a broker." },
  { q: "Will this make me profitable?", a: "No simulator can promise that. Market Lab builds decision habits; real results depend on much more than any simulator can control." },
  { q: "Where does the market data come from?", a: "Missions use synthetic data generated to recreate specific situations. It's labelled as synthetic wherever it appears." },
  { q: "Why isn't my score my profit?", a: "Because a good decision can lose and a bad one can get lucky. Rewarding luck would teach the wrong lesson." },
];

/** The signature moment in miniature: candles arrive, then stop where your knowledge does. */
function HeroChart() {
  const reduced = useReducedMotion();
  const candles = useMemo(() => getScenario("M06-b").candles, []);
  const [to, setTo] = useState(reduced ? DEMO_DECISION : DEMO_START);

  useEffect(() => {
    if (reduced) {
      setTo(DEMO_DECISION);
      return;
    }
    let v = DEMO_START;
    const id = window.setInterval(() => {
      v += 1;
      setTo(v);
      if (v >= DEMO_DECISION) window.clearInterval(id);
    }, 42);
    return () => window.clearInterval(id);
  }, [reduced]);

  const done = to >= DEMO_DECISION;
  return (
    <figure className="ml-hero-chart">
      <Chart
        candles={candles}
        visibleTo={to}
        fixedEnd={candles.length - 1}
        windowStart={10}
        height={360}
        showHeader={false}
        label="Example: a price chart that stops at the moment of decision"
        decisionSteps={done ? [{ step: DEMO_DECISION, label: "D1" }] : []}
        tickMs={done ? undefined : 42}
        animateNewest={!done}
      />
      <figcaption className={done ? "is-visible" : undefined}>
        <span className="ml-eyebrow">Decision point</span>
        Up 12% in twelve candles. Buy, wait or pass? The chart stops where your knowledge does.
      </figcaption>
    </figure>
  );
}

export function WelcomePage() {
  const { navigate } = useRouter();
  const lab = useLab();
  const store = useStore();
  const returning = lab.profile.onboarded;
  const start = () => {
    if (lab.signedOut) store.signIn();
    navigate(returning ? "/dashboard" : "/start");
  };

  return (
    <div className="ml-welcome">
      <section className="ml-hero">
        <div className="ml-container ml-hero-grid">
          <div className="ml-hero-copy">
            <span className="ml-eyebrow">MARKET//LAB · Trading Skill Academy</span>
            <h1 className="ml-display">
              Learn the market
              <br />
              <span>by making decisions.</span>
            </h1>
            <p className="ml-lead">
              Short missions where you read the chart, define your risk and decide, then see what a good process looks like, whether or not the trade works out.
            </p>
            <div className="ml-actions">
              <Button variant="primary" size="lg" iconRight="arrow-right" onClick={start}>
                {returning ? (lab.signedOut ? `Continue as ${lab.profile.displayName || "Trader"}` : "Continue learning") : "Start your first mission"}
              </Button>
              <Button variant="tertiary" size="lg" onClick={() => document.getElementById("ml-how")?.scrollIntoView({ behavior: "smooth" })}>
                How it works
              </Button>
            </div>
            <p className="ml-fine">Educational simulator. Virtual money only. Not investment advice.</p>
          </div>
          <HeroChart />
        </div>
      </section>

      <section id="ml-how" className="ml-container ml-band">
        <div className="ml-steps">
          {STEPS.map((s) => (
            <div key={s.n} className="ml-step">
              <span className="ml-step-n num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ml-container ml-band ml-principle">
        <p className="ml-statement">
          A good decision can lose money.
          <br />
          <span>A bad one can get lucky.</span>
          <br />
          We score the decision.
        </p>
        <div className="ml-principle-example" aria-label="Example">
          <div>
            <span className="ml-eyebrow">Decision quality</span>
            <span className="ml-principle-num num">94</span>
            <span className="ml-muted">Stop defined, risk 1%, thesis stated</span>
          </div>
          <div>
            <span className="ml-eyebrow">Simulated outcome</span>
            <span className="ml-principle-num num">−0.98%</span>
            <span className="ml-muted">The market went the other way</span>
          </div>
          <p className="ml-fine">Example. Two numbers, scored separately, every time.</p>
        </div>
      </section>

      <section className="ml-container ml-band">
        <div className="ml-section-head">
          <h2>Eight skills, measured by how you decide</h2>
        </div>
        <ul className="ml-skill-index">
          {SKILLS.map((s) => (
            <li key={s.id}>
              <span className="ml-abbr num">{s.short}</span>
              <div>
                <b>{s.name}</b>
                <p>{s.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="ml-container ml-band ml-faq">
        <div className="ml-section-head">
          <h2>Questions</h2>
        </div>
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
