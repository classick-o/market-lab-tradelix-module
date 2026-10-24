/** The duel bots as a draggable rail of cards, each with the habit it trades on. */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useSite } from "../context";
import { Icon } from "../components/Icon";
import { APP_ROUTES, BOTS, EXACT, MIRROR, type BotFact } from "../data/facts";
import { useTilt } from "../motion/hooks";

const FACTS = [
  { value: `${EXACT.candleSeconds}s`, label: "per candle, in real time" },
  { value: `${EXACT.duelCandles}`, label: `candles, about ${(EXACT.duelCandles * EXACT.candleSeconds) / 60} minutes` },
  { value: `${EXACT.processWeight * 100} / ${100 - EXACT.processWeight * 100}`, label: "process / result in the score" },
  { value: EXACT.startRating.toLocaleString("en-US"), label: "starting Elo rating" },
];

function Level({ n }: { n: number }) {
  return (
    <span className="tx-rival-level" role="img" aria-label={`Difficulty ${n} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} data-on={i <= n} />
      ))}
    </span>
  );
}

function RivalCard({ bot, mirror }: { bot: BotFact; mirror?: boolean }) {
  const tilt = useTilt<HTMLLIElement>(8);
  const habits = mirror ? ["Your most frequent mistake"] : bot.habits.length ? bot.habits : ["Clean process"];
  return (
    <li ref={tilt} className="tx-rival" data-mirror={mirror || undefined} data-clean={!mirror && bot.habits.length === 0 ? true : undefined}>
      <div className="tx-rival-shine" aria-hidden="true" />
      <div className="tx-rival-top">
        <span className="tx-rival-avatar" aria-hidden="true">
          {bot.name[0]}
        </span>
        <span className="tx-rival-rating num">
          {bot.rating.toLocaleString("en-US")}
          <small>Elo</small>
        </span>
      </div>
      <h3 className="tx-rival-name">{bot.name}</h3>
      <p className="tx-rival-title">{bot.title}</p>
      <Level n={bot.level} />
      <ul className="tx-rival-habits" aria-label="Habits">
        {habits.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <p className="tx-rival-watch">
        <span className="tx-mono">Watch for</span>
        {bot.watch}
      </p>
    </li>
  );
}

export function Rivals() {
  const { appHref } = useSite();
  const rail = useRef<HTMLOListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  // Mouse users can drag the rail; touch scrolls it natively.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let down = false;
    let moved = false;
    let x0 = 0;
    let s0 = 0;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    const pd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      x0 = e.clientX;
      s0 = el.scrollLeft;
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 4 && !moved) {
        moved = true;
        el.setPointerCapture(e.pointerId);
        el.dataset.dragging = "true";
      }
      if (moved) el.scrollLeft = s0 - dx;
    };
    const pu = () => {
      down = false;
      delete el.dataset.dragging;
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", pd);
    el.addEventListener("pointermove", pm);
    el.addEventListener("pointerup", pu);
    el.addEventListener("pointercancel", pu);
    el.addEventListener("click", click, true);
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      el.removeEventListener("pointerdown", pd);
      el.removeEventListener("pointermove", pm);
      el.removeEventListener("pointerup", pu);
      el.removeEventListener("pointercancel", pu);
      el.removeEventListener("click", click, true);
      el.removeEventListener("scroll", update);
    };
  }, []);

  const page = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <section className="tx-section tx-rivals" aria-labelledby="tx-rivals-title">
      <div className="tx-wrap tx-rivals-head">
        <header className="tx-head tx-head--left" data-reveal>
          <span className="tx-eyebrow">Duels</span>
          <h2 id="tx-rivals-title" className="tx-h2">
            Seven rivals. <span className="tx-grad tx-grad--gold">One mirror.</span>
          </h2>
          <p className="tx-lead">Every bot trades on rules, and each one has a habit you'll learn to spot. Beat them on process, not just profit. Then face Mirror: it plays your most frequent mistake against you.</p>
        </header>
        <div className="tx-rail-nav">
          <button type="button" className="tx-round-btn" onClick={() => page(-1)} disabled={edge.start} aria-label="Previous rivals">
            <Icon name="chevron-left" size={20} />
          </button>
          <button type="button" className="tx-round-btn" onClick={() => page(1)} disabled={edge.end} aria-label="Next rivals">
            <Icon name="chevron-right" size={20} />
          </button>
        </div>
      </div>
      <ol ref={rail} className="tx-rail" aria-label="Duel rivals" style={{ "--count": BOTS.length + 1 } as CSSProperties}>
        {BOTS.map((b) => (
          <RivalCard key={b.id} bot={b} />
        ))}
        <RivalCard bot={MIRROR} mirror />
      </ol>
      <div className="tx-wrap">
        <ul className="tx-duel-facts" data-reveal>
          {FACTS.map((f) => (
            <li key={f.label}>
              <span className="num">{f.value}</span>
              {f.label}
            </li>
          ))}
        </ul>
        <a className="tx-arrow-link tx-rivals-cta" href={appHref(APP_ROUTES.duels)}>
          Challenge a rival
          <Icon name="arrow-right" size={16} />
        </a>
      </div>
    </section>
  );
}
