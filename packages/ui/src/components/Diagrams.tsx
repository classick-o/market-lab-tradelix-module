import type { DiagramId } from "@market-lab/academy";
import type { ReactNode } from "react";

/**
 * Lesson illustrations. Each is a small, self-contained SVG with a text alternative; colours
 * come from the theme tokens, so they follow the selected theme and accent.
 */

const W = 480;
const H = 220;

function Frame({ children, label, h = H }: { children: ReactNode; label: string; h?: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="ml-diagram" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function Candle({ x, o, h, l, c, w = 26 }: { x: number; o: number; h: number; l: number; c: number; w?: number }) {
  const up = c < o; // SVG y grows downwards: a smaller y is a higher price
  return (
    <g className={up ? "dg-up" : "dg-down"}>
      <line x1={x} x2={x} y1={h} y2={l} className="dg-wick" />
      <rect x={x - w / 2} y={Math.min(o, c)} width={w} height={Math.max(2, Math.abs(c - o))} rx={2} className="dg-body" />
    </g>
  );
}

const T = ({ x, y, children, a = "start", cls = "dg-label" }: { x: number; y: number; children: ReactNode; a?: "start" | "middle" | "end"; cls?: string }) => (
  <text x={x} y={y} textAnchor={a} className={cls}>
    {children}
  </text>
);

const pts = (xs: number[], ys: number[]) => xs.map((x, i) => `${x},${ys[i]}`).join(" ");

function CandleAnatomy() {
  return (
    <Frame label="A bullish candle with open at the bottom of the body and close at the top, and a bearish candle with open at the top and close at the bottom. Wicks reach the high and the low.">
      <Candle x={150} o={150} h={30} l={190} c={70} w={46} />
      <Candle x={350} o={70} h={30} l={190} c={150} w={46} />
      {[
        [30, "High"],
        [70, "Close"],
        [150, "Open"],
        [190, "Low"],
      ].map(([y, t]) => (
        <g key={`l${t}`}>
          <line x1={92} x2={122} y1={y as number} y2={y as number} className="dg-guide" />
          <T x={86} y={(y as number) + 4} a="end">
            {t}
          </T>
        </g>
      ))}
      {[
        [30, "High"],
        [70, "Open"],
        [150, "Close"],
        [190, "Low"],
      ].map(([y, t]) => (
        <g key={`r${t}`}>
          <line x1={378} x2={408} y1={y as number} y2={y as number} className="dg-guide" />
          <T x={414} y={(y as number) + 4}>
            {t}
          </T>
        </g>
      ))}
      <T x={150} y={214} a="middle" cls="dg-caption">
        Bullish: close above open
      </T>
      <T x={350} y={214} a="middle" cls="dg-caption">
        Bearish: close below open
      </T>
      <T x={250} y={54} a="middle" cls="dg-muted">
        upper wick
      </T>
      <T x={250} y={114} a="middle" cls="dg-muted">
        body
      </T>
      <T x={250} y={174} a="middle" cls="dg-muted">
        lower wick
      </T>
    </Frame>
  );
}

function BidAsk() {
  return (
    <Frame label="A price ladder: the ask at 100.05 above, the mid at 100.00 and the bid at 99.95 below. Buyers pay the ask, sellers receive the bid; the gap is the spread of 0.10.">
      <line x1={140} x2={340} y1={60} y2={60} className="dg-line dg-blue" />
      <line x1={140} x2={340} y1={110} y2={110} className="dg-line dg-dashed" />
      <line x1={140} x2={340} y1={160} y2={160} className="dg-line dg-accent" />
      <T x={350} y={64}>
        Ask 100.05
      </T>
      <T x={350} y={114} cls="dg-muted">
        Mid 100.00
      </T>
      <T x={350} y={164}>
        Bid 99.95
      </T>
      <T x={130} y={64} a="end" cls="dg-strong">
        You buy here
      </T>
      <T x={130} y={164} a="end" cls="dg-strong">
        You sell here
      </T>
      <path d="M240 66 V154" className="dg-bracket" />
      <path d="M234 66 H246 M234 154 H246" className="dg-bracket" />
      <T x={252} y={114} cls="dg-caption">
        Spread 0.10
      </T>
    </Frame>
  );
}

function MarketVsLimit() {
  const path1 = pts([40, 80, 120, 160, 200, 240], [80, 70, 90, 76, 84, 80]);
  return (
    <Frame label="A market order fills immediately at the ask. A buy limit order waits at a lower price: it fills only if price trades down to it, and may never fill.">
      <polyline points={path1} className="dg-price" />
      <circle cx={240} cy={80} r={6} className="dg-dot-accent" />
      <T x={250} y={70} cls="dg-strong">
        Market order
      </T>
      <T x={250} y={88} cls="dg-muted">
        fills now, at the ask
      </T>
      <line x1={40} x2={440} y1={150} y2={150} className="dg-line dg-dashed dg-blue" />
      <T x={44} y={170} cls="dg-strong">
        Buy limit 98.50
      </T>
      <T x={44} y={188} cls="dg-muted">
        waits; fills only if price trades down to it
      </T>
      <polyline points={pts([240, 280, 320, 360], [80, 110, 150, 120])} className="dg-price dg-pos-line" />
      <circle cx={320} cy={150} r={5} className="dg-dot-pos" />
      <T x={330} y={145} cls="dg-label">
        filled
      </T>
      <polyline points={pts([240, 300, 360, 420], [80, 120, 100, 60])} className="dg-price dg-faint" />
      <T x={424} y={58} cls="dg-muted">
        never filled
      </T>
    </Frame>
  );
}

function StopPlacement() {
  const xs = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const ys = [70, 110, 140, 118, 142, 120, 100, 126, 112, 96, 90];
  return (
    <Frame label="Price bounces off a support level around 140. A stop just below the current price sits inside normal noise and is likely to be hit. A stop below the support level is where the idea is actually wrong.">
      <rect x={20} y={136} width={420} height={12} className="dg-zone" />
      <T x={444} y={146} cls="dg-muted">
        support
      </T>
      <polyline points={pts(xs, ys)} className="dg-price" />
      <line x1={250} x2={440} y1={118} y2={118} className="dg-line dg-neg" />
      <T x={444} y={122} cls="dg-neg-text">
        too tight
      </T>
      <line x1={250} x2={440} y1={170} y2={170} className="dg-line dg-pos" />
      <T x={444} y={174} cls="dg-pos-text">
        beyond the level
      </T>
      <T x={30} y={204} cls="dg-caption">
        Put the stop where the idea is wrong, not where the loss feels small.
      </T>
    </Frame>
  );
}

function TrendRangeNoise() {
  return (
    <Frame label="Three small charts: an uptrend with higher highs and higher lows, a range between two levels, and noise without structure.">
      <polyline points={pts([20, 50, 70, 100, 120, 150], [170, 110, 135, 75, 100, 45])} className="dg-price" />
      <T x={85} y={204} a="middle" cls="dg-caption">
        Trend: higher highs and lows
      </T>
      <line x1={180} x2={300} y1={70} y2={70} className="dg-line dg-dashed" />
      <line x1={180} x2={300} y1={150} y2={150} className="dg-line dg-dashed" />
      <polyline points={pts([180, 200, 220, 240, 260, 280, 300], [140, 76, 146, 80, 144, 74, 110])} className="dg-price" />
      <T x={240} y={204} a="middle" cls="dg-caption">
        Range: between two levels
      </T>
      <polyline points={pts([340, 352, 364, 376, 388, 400, 412, 424, 436, 448, 460], [110, 96, 122, 104, 116, 92, 120, 108, 126, 100, 114])} className="dg-price" />
      <T x={400} y={204} a="middle" cls="dg-caption">
        Noise: no structure
      </T>
    </Frame>
  );
}

function SupportResistance() {
  const xs = [30, 70, 110, 150, 190, 230, 270, 310, 350, 390, 430];
  const ys = [120, 50, 160, 56, 150, 48, 158, 70, 152, 54, 110];
  return (
    <Frame label="Price moves inside a range, turning down three times near a resistance level above and turning up three times near a support level below.">
      <line x1={20} x2={450} y1={48} y2={48} className="dg-line dg-neg" />
      <line x1={20} x2={450} y1={160} y2={160} className="dg-line dg-pos" />
      <T x={24} y={40} cls="dg-neg-text">
        Resistance: sellers showed up here before
      </T>
      <T x={24} y={182} cls="dg-pos-text">
        Support: buyers showed up here before
      </T>
      <polyline points={pts(xs, ys)} className="dg-price" />
      {[1, 3, 5, 9].map((i) => (
        <circle key={i} cx={xs[i]} cy={ys[i]} r={4} className="dg-dot-neg" />
      ))}
      {[2, 4, 6, 8].map((i) => (
        <circle key={i} cx={xs[i]} cy={ys[i]} r={4} className="dg-dot-pos" />
      ))}
    </Frame>
  );
}

function BreakoutFalse() {
  return (
    <Frame label="Left: price breaks above a range and keeps going, a breakout that holds. Right: price pokes above the range, then falls back inside it, a false breakout.">
      <line x1={20} x2={220} y1={90} y2={90} className="dg-line dg-dashed" />
      <line x1={20} x2={220} y1={150} y2={150} className="dg-line dg-dashed" />
      <polyline points={pts([20, 45, 70, 95, 120, 140, 165, 190, 215], [140, 96, 146, 100, 130, 70, 80, 50, 34])} className="dg-price" />
      <T x={120} y={204} a="middle" cls="dg-caption">
        Breakout that holds
      </T>
      <line x1={260} x2={460} y1={90} y2={90} className="dg-line dg-dashed" />
      <line x1={260} x2={460} y1={150} y2={150} className="dg-line dg-dashed" />
      <polyline points={pts([260, 285, 310, 335, 360, 380, 400, 425, 455], [140, 96, 146, 100, 130, 66, 104, 140, 160])} className="dg-price" />
      <circle cx={380} cy={66} r={5} className="dg-dot-neg" />
      <T x={360} y={204} a="middle" cls="dg-caption">
        False breakout: back inside
      </T>
    </Frame>
  );
}

function MovingAverage() {
  const xs = Array.from({ length: 21 }, (_, i) => 20 + i * 21);
  const price = [150, 140, 146, 128, 120, 112, 100, 92, 84, 70, 64, 72, 84, 96, 108, 120, 132, 142, 150, 158, 166];
  const ma = price.map((_, i) => {
    const s = price.slice(Math.max(0, i - 4), i + 1);
    return s.reduce((a, b) => a + b, 0) / s.length;
  });
  return (
    <Frame label="Price falls and then turns up. The moving average follows more smoothly and turns later than price, lagging at the turning point.">
      <polyline points={pts(xs, price)} className="dg-price" />
      <polyline points={pts(xs, ma)} className="dg-ma" />
      <circle cx={xs[10]} cy={price[10]} r={4} className="dg-dot-accent" />
      <T x={xs[10]} y={price[10] + 26} a="middle" cls="dg-label">
        price turns
      </T>
      <circle cx={xs[13]} cy={ma[13]} r={4} className="dg-dot-blue" />
      <T x={xs[13] + 10} y={ma[13] + 22} cls="dg-blue-text">
        average turns later
      </T>
      <T x={20} y={30} cls="dg-caption">
        A moving average smooths noise and always lags.
      </T>
    </Frame>
  );
}

function RiskReward() {
  return (
    <Frame label="Entry at 100. Stop at 98, one R below. Target at 104, two R above. Reward is twice the risk.">
      <line x1={120} x2={360} y1={50} y2={50} className="dg-line dg-pos" />
      <line x1={120} x2={360} y1={130} y2={130} className="dg-line dg-strong-line" />
      <line x1={120} x2={360} y1={170} y2={170} className="dg-line dg-neg" />
      <T x={370} y={54} cls="dg-pos-text">
        Target 104.00
      </T>
      <T x={370} y={134}>
        Entry 100.00
      </T>
      <T x={370} y={174} cls="dg-neg-text">
        Stop 98.00
      </T>
      <path d="M100 56 V124 M94 56 H106 M94 124 H106" className="dg-bracket" />
      <T x={88} y={94} a="end" cls="dg-pos-text">
        Reward 2R
      </T>
      <path d="M100 136 V164 M94 136 H106 M94 164 H106" className="dg-bracket" />
      <T x={88} y={154} a="end" cls="dg-neg-text">
        Risk 1R
      </T>
      <T x={240} y={206} a="middle" cls="dg-caption">
        Reward-to-risk 2 : 1. Break-even win rate 1 ÷ (1 + 2) ≈ 33%.
      </T>
    </Frame>
  );
}

function SizeFormula() {
  const box = (x: number, top: string, bottom: string, cls: string) => (
    <g>
      <rect x={x} y={70} width={120} height={70} rx={10} className={cls} />
      <T x={x + 60} y={100} a="middle" cls="dg-strong">
        {top}
      </T>
      <T x={x + 60} y={122} a="middle" cls="dg-muted">
        {bottom}
      </T>
    </g>
  );
  return (
    <Frame label="Risk budget 100.00 divided by the distance to the stop, 2.00 per unit, equals 50 units.">
      {box(20, "100.00", "risk budget", "dg-box")}
      <T x={160} y={112} a="middle" cls="dg-op">
        ÷
      </T>
      {box(180, "2.00", "distance to stop", "dg-box")}
      <T x={320} y={112} a="middle" cls="dg-op">
        =
      </T>
      {box(340, "50", "units", "dg-box dg-box--accent")}
      <T x={240} y={180} a="middle" cls="dg-caption">
        10,000 × 1% = 100.00 · entry 100.00, stop 98.00
      </T>
    </Frame>
  );
}

function ExposureLeverage() {
  const bars = [
    { label: "Account", v: 10000, cls: "dg-bar-muted" },
    { label: "1× position", v: 10000, cls: "dg-bar" },
    { label: "2×", v: 20000, cls: "dg-bar" },
    { label: "5×", v: 50000, cls: "dg-bar dg-bar--neg" },
  ];
  const scale = 160 / 50000;
  return (
    <Frame label="Account of 10,000. Positions worth 10,000, 20,000 and 50,000 are 1, 2 and 5 times leverage. A 10% adverse move costs 10%, 20% and 50% of the account.">
      {bars.map((b, i) => (
        <g key={b.label}>
          <T x={90} y={44 + i * 42} a="end">
            {b.label}
          </T>
          <rect x={100} y={30 + i * 42} width={Math.max(4, b.v * scale)} height={20} rx={4} className={b.cls} />
          <T x={108 + b.v * scale} y={44 + i * 42} cls="dg-muted">
            {b.v.toLocaleString("en-US")}
            {i > 0 ? ` · 10% drop = −${((b.v * 0.1) / 100).toFixed(0)}% of account` : ""}
          </T>
        </g>
      ))}
    </Frame>
  );
}

function LossRecovery() {
  const rows = [
    [10, 11.1],
    [20, 25],
    [50, 100],
  ];
  return (
    <Frame label="A 10% loss needs an 11.1% gain to recover, a 20% loss needs 25%, and a 50% loss needs 100%.">
      {rows.map(([loss, gain], i) => (
        <g key={loss}>
          <rect x={60 + i * 140} y={110} width={36} height={loss * 1.6} className="dg-bar dg-bar--neg" />
          <rect x={100 + i * 140} y={110 - gain * 0.9} width={36} height={gain * 0.9} className="dg-bar dg-bar--pos" />
          <T x={78 + i * 140} y={110 + loss * 1.6 + 14} a="middle" cls="dg-neg-text">
            −{loss}%
          </T>
          <T x={118 + i * 140} y={110 - gain * 0.9 - 6} a="middle" cls="dg-pos-text">
            +{gain}%
          </T>
        </g>
      ))}
      <line x1={40} x2={460} y1={110} y2={110} className="dg-guide" />
      <T x={40} y={210} cls="dg-caption">
        The deeper the drawdown, the bigger the gain needed just to get back.
      </T>
    </Frame>
  );
}

function VolatilityRegimes() {
  const calm = [100, 96, 102, 98, 104, 100, 98, 103, 99, 101];
  const wild = [100, 70, 128, 82, 136, 74, 120, 66, 130, 96];
  const xs = (o: number) => calm.map((_, i) => o + i * 20);
  return (
    <Frame label="Two markets with a stop at the same distance below price. In the calm market the stop sits well beyond normal swings. In the volatile market the same stop sits inside normal swings.">
      <polyline points={pts(xs(20), calm)} className="dg-price" />
      <line x1={20} x2={210} y1={140} y2={140} className="dg-line dg-pos" />
      <T x={115} y={204} a="middle" cls="dg-caption">
        Calm: stop beyond the noise
      </T>
      <polyline points={pts(xs(260), wild)} className="dg-price" />
      <line x1={260} x2={450} y1={140} y2={140} className="dg-line dg-neg" />
      <T x={355} y={204} a="middle" cls="dg-caption">
        Volatile: same stop, inside the noise
      </T>
    </Frame>
  );
}

function DecisionTree() {
  const node = (x: number, y: number, text: string, cls = "dg-box") => (
    <g>
      <rect x={x} y={y} width={132} height={40} rx={8} className={cls} />
      <T x={x + 66} y={y + 25} a="middle" cls="dg-small">
        {text}
      </T>
    </g>
  );
  return (
    <Frame label="Decision steps: is the setup present? If not, no trade. Are all playbook conditions met? If not, no trade. Is the risk defined and within the limit? If not, adjust the size or skip. Only then, enter with a stop." h={240}>
      {node(10, 20, "Setup present?")}
      {node(170, 20, "All conditions met?")}
      {node(330, 20, "Risk defined, in limit?")}
      {node(330, 110, "Enter with a stop", "dg-box dg-box--accent")}
      {node(10, 110, "No trade", "dg-box dg-box--muted")}
      {node(170, 180, "Adjust size or skip", "dg-box dg-box--muted")}
      <path d="M142 40 H170 M302 40 H330 M396 60 V110" className="dg-arrow" />
      <path d="M76 60 V110 M236 60 V90 H100 V110 M380 60 V80 H260 V180" className="dg-arrow dg-arrow--no" />
      <T x={156} y={34} a="middle" cls="dg-tiny">
        yes
      </T>
      <T x={316} y={34} a="middle" cls="dg-tiny">
        yes
      </T>
      <T x={404} y={90} cls="dg-tiny">
        yes
      </T>
      <T x={84} y={86} cls="dg-tiny">
        no
      </T>
      <T x={244} y={78} cls="dg-tiny">
        no
      </T>
      <T x={384} y={76} cls="dg-tiny">
        no
      </T>
    </Frame>
  );
}

const DIAGRAMS: Record<DiagramId, () => ReactNode> = {
  "candle-anatomy": CandleAnatomy,
  "bid-ask-spread": BidAsk,
  "market-vs-limit": MarketVsLimit,
  "stop-placement": StopPlacement,
  "trend-range-noise": TrendRangeNoise,
  "support-resistance": SupportResistance,
  "breakout-false-breakout": BreakoutFalse,
  "moving-average": MovingAverage,
  "risk-reward": RiskReward,
  "position-size-formula": SizeFormula,
  "exposure-leverage": ExposureLeverage,
  "loss-recovery": LossRecovery,
  "volatility-regimes": VolatilityRegimes,
  "decision-tree": DecisionTree,
};

export function Diagram({ id }: { id: DiagramId }) {
  const D = DIAGRAMS[id];
  return D ? <D /> : null;
}
