/** The course as a climb: five levels along a line that fills as the section scrolls past. */
import { useRef } from "react";
import { useSite } from "../context";
import { Icon } from "../components/Icon";
import { APP_ROUTES, EXACT, LEVELS } from "../data/facts";
import { useScrollProgress } from "../motion/hooks";
import courseHero from "../assets/course-hero.webp";

export function Climb() {
  const { appHref } = useSite();
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, (p) => ref.current?.style.setProperty("--climb", p.toFixed(3)), { start: 0.9, end: 0.35 });
  const total = LEVELS.reduce((n, l) => n + l.lessons, 0);

  return (
    <section ref={ref} className="tx-section tx-climb" aria-labelledby="tx-climb-title">
      <div className="tx-climb-art" aria-hidden="true">
        <img src={courseHero} width={1400} height={594} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="tx-wrap">
        <header className="tx-head tx-head--left" data-reveal>
          <span className="tx-eyebrow">The course</span>
          <h2 id="tx-climb-title" className="tx-h2">
            From basecamp <span className="tx-grad">to summit.</span>
          </h2>
          <p className="tx-lead">
            {LEVELS.length} levels, {EXACT.units} units and {total} lessons, from what a price actually is to how professionals execute. Already know the basics? Pass a unit check and skip ahead.
          </p>
        </header>
        <ol className="tx-levels">
          <span className="tx-levels-line" aria-hidden="true">
            <i />
          </span>
          {LEVELS.map((l, i) => (
            <li key={l.id} className="tx-level" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="tx-level-n num" aria-hidden="true">
                {l.id}
              </span>
              <span className="tx-mono tx-level-count">
                Level {l.id} · {l.lessons} lessons
              </span>
              <h3>{l.name}</h3>
              <p>{l.tagline}</p>
            </li>
          ))}
        </ol>
        <a className="tx-arrow-link" href={appHref(APP_ROUTES.learn)} data-reveal>
          See the full course map
          <Icon name="arrow-right" size={16} />
        </a>
      </div>
    </section>
  );
}
