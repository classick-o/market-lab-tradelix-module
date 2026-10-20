/**
 * Decorative artwork from the app design: a synthetic candle strip and line illustrations.
 * All of it is aria-hidden or labelled as synthetic; none of it carries data the user needs.
 */
import { cx } from "./ui";

/** A deterministic, synthetic candle strip (the "hero" chart of the design). */
export function CandleStrip({ mini = false, className }: { mini?: boolean; className?: string }) {
  const data = Array.from({ length: mini ? 23 : 49 }, (_, i) => {
    const trend = 175 - i * 2.25 + Math.sin(i * 0.58) * 23 + Math.cos(i * 1.7) * 9;
    const up = Math.sin(i * 2.3) > -0.3;
    return { x: 15 + i * 12, y: trend, up, h: 7 + ((i * 7) % 19) };
  });
  return (
    <svg className={cx("ml-candlestrip", mini && "is-mini", className)} viewBox={mini ? "0 35 300 200" : "0 0 650 260"} preserveAspectRatio="none" aria-hidden="true">
      {!mini && [35, 85, 135, 185, 235].map((y) => <path key={y} d={`M0 ${y}H600`} className="ml-cs-grid" />)}
      {data.map((d, i) => (
        <g key={i} className={d.up ? "ml-cs-up" : "ml-cs-down"}>
          <line x1={d.x + 3} x2={d.x + 3} y1={d.y - 9} y2={d.y + d.h + 9} />
          <rect x={d.x} y={d.y} width="6" height={d.h} rx=".6" />
        </g>
      ))}
    </svg>
  );
}

/** Line illustrations for learning paths and lessons (four variants). */
export function LearningIllustration({ variant = 0, className }: { variant?: number; className?: string }) {
  const v = ((variant % 4) + 4) % 4;
  return (
    <svg viewBox="0 0 320 145" className={cx("ml-illustration", className)} fill="none" aria-hidden="true">
      {[30, 60, 90, 120].map((y) => (
        <path key={y} d={`M20 ${y}H300`} stroke="currentColor" opacity=".08" />
      ))}
      {v === 1 ? (
        <>
          <path d="M45 105 95 83 140 91 190 47 230 60 282 25" stroke="currentColor" strokeWidth="2" />
          <path d="M45 120H282M45 65H282" stroke="currentColor" strokeDasharray="5 5" opacity=".45" />
          <rect x="190" y="47" width="92" height="73" fill="currentColor" opacity=".06" />
          <path d="m185 95 11 10 20-24" stroke="currentColor" strokeWidth="2" />
          <path d="M165 77 199 64 233 77v23c0 17-34 31-34 31s-34-14-34-31Z" stroke="currentColor" opacity=".5" />
        </>
      ) : v === 2 ? (
        <>
          <path d="m25 117 45-24 27 7 34-37 28 13 34-41 27 16 25-25 44 8" stroke="currentColor" strokeWidth="2" />
          <path d="M25 108Q120 103 172 69T290 40" stroke="currentColor" strokeDasharray="4 5" opacity=".35" />
          <path d="M30 70H285M30 33H285" stroke="currentColor" opacity=".18" />
          {[70, 131, 193, 245].map((x, i) => (
            <rect key={x} x={x - 4} y={85 - i * 20} width="8" height="21" rx="1" fill="currentColor" opacity=".6" />
          ))}
        </>
      ) : v === 3 ? (
        <>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${80 + i * 55} 100c-50-60 50-100 55-42s-60 48-55-8`} stroke="currentColor" opacity={0.2 + i * 0.2} />
          ))}
          <path d="M50 120H270" stroke="currentColor" opacity=".2" />
        </>
      ) : (
        <>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              <path d={`M${55 + i * 29} ${105 - i * 9}v-38`} stroke="currentColor" opacity=".5" />
              <rect x={50 + i * 29} y={77 - i * 8} width="10" height={18 + (i % 3) * 5} rx="1" fill="currentColor" opacity={0.3 + i * 0.08} />
            </g>
          ))}
          <path d="M35 121Q155 130 285 31" stroke="currentColor" strokeDasharray="4 5" opacity=".3" />
        </>
      )}
    </svg>
  );
}

/** Five tiny candles that light up to show a difficulty from 1 to 5. */
export function DifficultyCandles({ level }: { level: number }) {
  return (
    <span className="ml-diffcandles" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={cx(n <= level && "is-lit")} width="7" height="20" viewBox="0 0 7 20" fill="none">
          <path d="M3.5 1v18" stroke="currentColor" strokeWidth="1" />
          <rect x="1" y={n % 2 === 0 ? 5 : 7} width="5" height="8" rx="1" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

/** Icon that represents a mission's topic in mission art and tiles. */
export function missionGlyph(topic: string | undefined): string {
  switch (topic) {
    case "risk_management":
    case "stop_loss":
      return "shield";
    case "position_sizing":
    case "portfolio_exposure":
      return "calculator";
    case "psychology":
    case "decision_making":
      return "target";
    case "order_types":
      return "layers";
    default:
      return "chart";
  }
}
