/**
 * auction-book: a live order book of one-unit orders on a price ladder, in three modes.
 * - clear: drag one price for everyone; orders that would trade light up and pair off, and a
 *   histogram remembers how many units each tried price traded, so the hill shows itself.
 * - spread: the matched orders trade and leave; tap the best bid and the best ask that are left.
 * - incoming: send a buy order into the book and watch it fill, then wait as the new best bid.
 * Motion is state-driven (CSS transitions on transforms), so it follows Show me and Reset too.
 */
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { auctionAt, bestAsk, bestBid, bookAfter, fillBuy, ladder, type AuctionSpec, type Book } from "@market-lab/academy";
import { cx } from "../components/ui";
import type { TaskWidgetProps } from "./taskWidgets";

const fmt = (p: number) => p.toFixed(2);
const cents = (p: number) => Math.round(p * 100);
const reduced = () => !!document.querySelector(".ml-reduced-motion") || !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function useNarrow() {
  const ref = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 520));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, narrow] as const;
}

/** Layout constants for a ladder of `prices` (highest first), computed once per render. */
function geometry(narrow: boolean, prices: number[], step: number, hist: boolean, extraTop: number) {
  const W = narrow ? 340 : 640;
  const histW = hist ? (narrow ? 46 : 150) : 0;
  const chipW = narrow ? 100 : 124;
  const chipH = 22;
  const gap = narrow ? 28 : 34;
  const labelW = narrow ? 42 : 48;
  const axisX = histW + (W - histW) / 2;
  const row = 26;
  const top = 50 + extraTop;
  const H = top + prices.length * row + 12;
  const hi = prices[0];
  const y = (p: number) => top + ((hi - p) / step) * row + row / 2;
  const price = (py: number) => {
    const k = Math.round((py - top - row / 2) / row);
    return prices[Math.min(prices.length - 1, Math.max(0, k))];
  };
  return { W, H, histW, chipW, chipH, gap, labelW, axisX, row, top, y, price, font: narrow ? 11.5 : 12.5, small: narrow ? 10.5 : 11, buyX: axisX - gap - chipW, sellX: axisX + gap };
}
type Geo = ReturnType<typeof geometry>;

function Chip({ g, side, p, cls, dx = 0, y, label, onPick }: { g: Geo; side: "buy" | "sell"; p: number; cls?: string; dx?: number; y?: number; label?: string; onPick?: () => void }) {
  const x = (side === "buy" ? g.buyX : g.sellX) + dx;
  const top = (y ?? g.y(p)) - g.chipH / 2;
  return (
    <g
      className={cx("ab-chip", `ab-chip--${side}`, cls, onPick && "is-pickable")}
      style={{ transform: `translate(${x}px, ${top}px)` }}
      onClick={onPick}
      onKeyDown={onPick ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick()) : undefined}
      role={onPick ? "button" : undefined}
      tabIndex={onPick ? 0 : undefined}
      aria-label={onPick ? `${side === "buy" ? "Buyer" : "Seller"} at ${fmt(p)}` : undefined}
    >
      <rect className="ab-halo" x={-4} y={-4} width={g.chipW + 8} height={g.chipH + 8} rx={9} />
      <rect className="ab-box" width={g.chipW} height={g.chipH} rx={6} />
      <text x={g.chipW / 2} y={g.chipH / 2 + g.font * 0.36} textAnchor="middle" fontSize={g.font}>
        <tspan className="ab-lead">{side === "buy" ? "BUY " : "SELL "}</tspan>
        {label ?? `${side === "buy" ? "≤" : "≥"} ${fmt(p)}`}
      </text>
    </g>
  );
}

function Ladder({ g, prices, hot }: { g: Geo; prices: number[]; hot?: Set<number> }) {
  return (
    <g className="ab-ladder">
      <line className="ab-axis" x1={g.axisX} x2={g.axisX} y1={g.top - 6} y2={g.y(prices[prices.length - 1]) + 14} />
      {prices.map((p) => (
        <g key={p} className={cx("ab-plabel", hot?.has(cents(p)) && "is-hot")}>
          <rect x={g.axisX - g.labelW / 2} y={g.y(p) - 9} width={g.labelW} height={18} rx={4} />
          <text x={g.axisX} y={g.y(p) + g.small * 0.36} textAnchor="middle" fontSize={g.small}>
            {fmt(p)}
          </text>
        </g>
      ))}
    </g>
  );
}

function Heads({ g }: { g: Geo }) {
  return (
    <g className="ab-heads">
      <text className="ab-head ab-head--buy" x={g.buyX + g.chipW / 2} y={g.top - 26} textAnchor="middle" fontSize={g.small}>
        BUYERS
      </text>
      <text className="ab-head-sub" x={g.buyX + g.chipW / 2} y={g.top - 12} textAnchor="middle" fontSize={g.small}>
        pay at most
      </text>
      <text className="ab-head ab-head--sell" x={g.sellX + g.chipW / 2} y={g.top - 26} textAnchor="middle" fontSize={g.small}>
        SELLERS
      </text>
      <text className="ab-head-sub" x={g.sellX + g.chipW / 2} y={g.top - 12} textAnchor="middle" fontSize={g.small}>
        accept at least
      </text>
    </g>
  );
}

/** A number that rolls to its new value. */
function Rolling({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (reduced()) return setShown(value);
    const a = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 280);
      setShown(Math.round(a + (value - a) * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span key={value} className="ab-roll num">
      {shown}
    </span>
  );
}

// ─── clear: one price for everyone ─────────────────────────────────────────

function Clear({ p, a, g, prices }: { p: TaskWidgetProps; a: AuctionSpec; g: Geo; prices: number[] }) {
  const price = Number(p.state.price) || prices[prices.length - 1];
  const at = auctionAt(a, price);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tried, setTried] = useState<Record<number, number>>({});
  const onLadder = prices.some((x) => cents(x) === cents(price));
  useEffect(() => {
    if (onLadder) setTried((t) => (t[cents(price)] === at.units ? t : { ...t, [cents(price)]: at.units }));
  }, [price, onLadder, at.units]);

  // Who trades: the keenest buyers and the cheapest sellers, as many as the smaller side.
  const buyersIn = [...a.buyers].sort((x, y) => y - x).filter((b) => cents(b) >= cents(price));
  const sellersIn = [...a.sellers].sort((x, y) => x - y).filter((s) => cents(s) <= cents(price));
  const matchedB = new Set(buyersIn.slice(0, at.units).map(cents));
  const matchedS = new Set(sellersIn.slice(0, at.units).map(cents));
  const stateOf = (side: "buy" | "sell", x: number) => {
    const matched = side === "buy" ? matchedB : matchedS;
    const willing = side === "buy" ? cents(x) >= cents(price) : cents(x) <= cents(price);
    return matched.has(cents(x)) ? "is-matched" : willing ? "is-waiting" : "is-out";
  };

  const setFromPointer = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (p.solved || p.locked.has("price")) return;
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    const next = g.price(pt.y);
    if (cents(next) !== cents(price)) p.set({ price: next });
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (p.solved) return;
    const i = prices.findIndex((x) => cents(x) === cents(price));
    const to = e.key === "ArrowUp" ? i - 1 : e.key === "ArrowDown" ? i + 1 : e.key === "Home" ? 0 : e.key === "End" ? prices.length - 1 : null;
    if (to === null) return;
    e.preventDefault();
    e.stopPropagation();
    p.set({ price: prices[Math.min(prices.length - 1, Math.max(0, to))] });
  };

  const maxUnits = Math.max(1, ...Object.values(tried), at.units);
  const unitW = (g.histW - 34) / Math.max(3, maxUnits);
  return (
    <>
      <svg
        ref={svgRef}
        className="ab-svg"
        viewBox={`0 0 ${g.W} ${g.H}`}
        role="slider"
        tabIndex={0}
        aria-label="Auction price: drag up or down, or use the arrow keys"
        aria-valuemin={prices[prices.length - 1]}
        aria-valuemax={prices[0]}
        aria-valuenow={price}
        aria-valuetext={`${fmt(price)}: ${at.buyers} buyers, ${at.sellers} sellers, ${at.units} units trade`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromPointer(e);
        }}
        onPointerMove={(e) => e.buttons === 1 && setFromPointer(e)}
        onKeyDown={onKey}
      >
        <text className="ab-head" x={g.histW / 2 - 4} y={g.top - 26} textAnchor="middle" fontSize={g.small}>
          {g.histW > 80 ? "UNITS TRADED" : "UNITS"}
        </text>
        {g.histW > 80 && (
          <text className="ab-head-sub" x={g.histW / 2 - 4} y={g.top - 12} textAnchor="middle" fontSize={g.small}>
            at prices you tried
          </text>
        )}
        {prices.map((x) => {
          const u = tried[cents(x)];
          if (u === undefined) return null;
          const now = cents(x) === cents(price);
          return (
            <g key={x} className={cx("ab-hist", now && "is-now")}>
              <rect x={8} y={g.y(x) - 6} height={12} rx={3} width={Math.max(2, u * unitW)} />
              <text x={14 + Math.max(2, u * unitW)} y={g.y(x) + g.small * 0.36} fontSize={g.small}>
                {u}
              </text>
            </g>
          );
        })}
        <Heads g={g} />
        <Ladder g={g} prices={prices} />
        <g className={cx("ab-pline", p.solved && "is-solved")} style={{ transform: `translateY(${g.y(price)}px)` }}>
          <line x1={g.buyX - 10} x2={g.sellX + g.chipW + 10} y1={0} y2={0} />
          <rect x={g.axisX - g.labelW / 2 - 5} y={-12} width={g.labelW + 10} height={24} rx={7} />
          <text x={g.axisX} y={g.small * 0.4} textAnchor="middle" fontSize={g.small + 0.5}>
            {fmt(price)}
          </text>
        </g>
        {a.buyers.map((b) => (
          <Chip key={`b${b}`} g={g} side="buy" p={b} cls={stateOf("buy", b)} dx={stateOf("buy", b) === "is-matched" ? 6 : 0} />
        ))}
        {a.sellers.map((s) => (
          <Chip key={`s${s}`} g={g} side="sell" p={s} cls={stateOf("sell", s)} dx={stateOf("sell", s) === "is-matched" ? -6 : 0} />
        ))}
      </svg>
      <div className="ab-stats">
        <div className="ab-stat ab-stat--buy">
          <span>Buyers willing</span>
          <Rolling value={at.buyers} />
        </div>
        <div className="ab-stat ab-stat--sell">
          <span>Sellers willing</span>
          <Rolling value={at.sellers} />
        </div>
        <div className="ab-stat ab-stat--units">
          <span>Units that trade</span>
          <Rolling value={at.units} />
        </div>
      </div>
    </>
  );
}

// ─── spread: what's left after the auction ─────────────────────────────────

function Spread({ p, a, g, prices }: { p: TaskWidgetProps; a: AuctionSpec; g: Geo; prices: number[] }) {
  const cleared = a.cleared ?? 0;
  const left = bookAfter(a, cleared);
  const traded = auctionAt(a, cleared).units;
  // book → the matched orders trade → only what's left (straight to the end when revisiting).
  const [phase, setPhase] = useState<"book" | "trade" | "left">(p.solved || reduced() ? "left" : "book");
  useEffect(() => {
    // Each phase schedules the next one.
    if (phase === "left") return;
    const t = window.setTimeout(() => setPhase(phase === "book" ? "trade" : "left"), phase === "book" ? 1500 : 1200);
    return () => window.clearTimeout(t);
  }, [phase]);

  const bid = Number(p.state.bidPick) || 0;
  const ask = Number(p.state.askPick) || 0;
  const pick = (side: "buy" | "sell", x: number) => {
    if (p.solved || phase !== "left") return;
    const next = { ...p.state, [side === "buy" ? "bidPick" : "askPick"]: x };
    p.set(next);
    if (Number(next.bidPick) > 0 && Number(next.askPick) > 0) p.check(next);
  };
  const tradedB = new Set([...a.buyers].sort((x, y) => y - x).slice(0, traded).map(cents));
  const tradedS = new Set([...a.sellers].sort((x, y) => x - y).slice(0, traded).map(cents));
  const bb = bestBid(left);
  const ba = bestAsk(left);
  const done = p.solved;
  const hot = done ? new Set([cents(bb), cents(ba), cents((bb + ba) / 2)]) : undefined;

  return (
    <>
      <svg className="ab-svg" viewBox={`0 0 ${g.W} ${g.H}`} role="group" aria-label="The book after the auction: tap the best bid, then the best ask">
        <Heads g={g} />
        <g className={cx("ab-print", phase !== "book" && "is-on")} style={{ transform: `translate(${g.W - 12}px, 14px)` }}>
          <rect x={-150} y={0} width={150} height={24} rx={7} />
          <text x={-75} y={12 + g.small * 0.36} textAnchor="middle" fontSize={g.small}>
            {traded} UNITS TRADED @ {fmt(cleared)}
          </text>
        </g>
        <Ladder g={g} prices={prices} hot={hot} />
        {done && (
          <g className="ab-spread">
            <rect x={g.axisX - g.labelW / 2 - 6} y={g.y(ba) - 13} width={g.labelW + 12} height={g.y(bb) - g.y(ba) + 26} rx={8} />
            <text x={g.sellX + g.chipW + 14} y={(g.y(ba) + g.y(bb)) / 2 + 4} fontSize={g.small} className={g.W - (g.sellX + g.chipW) > 70 ? "" : "is-hidden"}>
              SPREAD {fmt(ba - bb)}
            </text>
          </g>
        )}
        {phase === "book" && <line className="ab-cleared" x1={g.buyX - 10} x2={g.sellX + g.chipW + 10} y1={g.y(cleared)} y2={g.y(cleared)} />}
        {a.buyers.map((b) => {
          const gone = tradedB.has(cents(b));
          if (gone && phase === "left") return null;
          return <Chip key={`b${b}`} g={g} side="buy" p={b} cls={cx(gone && (phase === "trade" ? "is-trading" : "is-matched"), !gone && phase === "book" && "is-out", cents(bid) === cents(b) && "is-picked", done && cents(b) === cents(bb) && "is-best")} dx={gone && phase === "trade" ? g.gap - 4 : 0} onPick={!gone && phase === "left" && !done ? () => pick("buy", b) : undefined} />;
        })}
        {a.sellers.map((s) => {
          const gone = tradedS.has(cents(s));
          if (gone && phase === "left") return null;
          return <Chip key={`s${s}`} g={g} side="sell" p={s} cls={cx(gone && (phase === "trade" ? "is-trading" : "is-matched"), !gone && phase === "book" && "is-out", cents(ask) === cents(s) && "is-picked", done && cents(s) === cents(ba) && "is-best")} dx={gone && phase === "trade" ? -(g.gap - 4) : 0} onPick={!gone && phase === "left" && !done ? () => pick("sell", s) : undefined} />;
        })}
      </svg>
      <div className="ab-stats">
        <div className={cx("ab-stat ab-stat--buy", done && "is-lit")}>
          <span>Best bid</span>
          <b className="num">{done ? fmt(bb) : bid ? fmt(bid) : "tap a buyer"}</b>
        </div>
        <div className={cx("ab-stat ab-stat--sell", done && "is-lit")}>
          <span>Best ask</span>
          <b className="num">{done ? fmt(ba) : ask ? fmt(ask) : "tap a seller"}</b>
        </div>
        <div className={cx("ab-stat ab-stat--units", done && "is-lit")}>
          <span>Spread · mid</span>
          <b className="num">{done ? `${fmt(ba - bb)} · ${fmt((ba + bb) / 2)}` : "—"}</b>
        </div>
      </div>
    </>
  );
}

// ─── incoming: an eager buyer arrives ──────────────────────────────────────

interface Frame {
  /** Where the incoming order is: its waiting spot, a seller's row, or resting at its limit. */
  at: "wait" | number | "rest";
  consumed: number;
  last: number | null;
  /** A seller it can't reach (above its limit). */
  blocked: number | null;
  left: number;
}

function Incoming({ p, a, g, prices, last0 }: { p: TaskWidgetProps; a: AuctionSpec; g: Geo; prices: number[]; last0: number }) {
  const order = a.incoming ?? { units: 1, limit: bestAsk(a) };
  const r = fillBuy(a, order.units, order.limit);
  const sellersUp = [...a.sellers].sort((x, y) => x - y);
  const blocked = r.rest > 0 ? sellersUp[r.fills.length] ?? null : null;
  const frames = useMemo<{ f: Frame; ms: number }[]>(() => {
    const out: { f: Frame; ms: number }[] = [];
    let ms = 0;
    r.fills.forEach((price, i) => {
      out.push({ f: { at: price, consumed: i, last: i ? r.fills[i - 1] : null, blocked: null, left: order.units - i }, ms });
      ms += 650;
      out.push({ f: { at: price, consumed: i + 1, last: price, blocked: null, left: order.units - i - 1 }, ms });
      ms += 600;
    });
    if (r.rest > 0 && blocked !== null) {
      out.push({ f: { at: blocked, consumed: r.fills.length, last: r.fills.at(-1) ?? null, blocked, left: r.rest }, ms });
      ms += 1000;
    }
    out.push({ f: { at: r.rest > 0 ? "rest" : r.fills.at(-1)!, consumed: r.fills.length, last: r.fills.at(-1) ?? null, blocked: null, left: r.rest }, ms });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a]);
  const end = frames[frames.length - 1].f;
  const start: Frame = { at: "wait", consumed: 0, last: null, blocked: null, left: order.units };
  const [frame, setFrame] = useState<Frame>(p.state.sent ? end : start);
  const playing = useRef(false);

  useEffect(() => {
    if (!p.state.sent) {
      playing.current = false;
      setFrame(start);
      return;
    }
    if (playing.current || frame === end) return;
    // The task is checked once the order has played out, so the explanation follows what the learner saw.
    const finish = () => !p.solved && p.check({ ...p.state, sent: true });
    if (reduced()) return setFrame(end), void finish();
    playing.current = true;
    const timers = frames.map(({ f, ms }) => window.setTimeout(() => setFrame(f), ms + 50));
    timers.push(window.setTimeout(finish, frames[frames.length - 1].ms + 700));
    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.state.sent]);

  const send = () => {
    if (p.state.sent || p.solved) return;
    p.set({ ...p.state, sent: true });
  };

  const consumed = new Set(sellersUp.slice(0, frame.consumed).map(cents));
  const last = frame.last ?? last0;
  const restNow = frame.at === "rest";
  const book: Book = restNow ? r.book : { buyers: a.buyers, sellers: sellersUp.filter((s) => !consumed.has(cents(s))) };
  const bb = bestBid(book);
  const ba = bestAsk(book);
  const inY = frame.at === "wait" ? g.top - 62 : frame.at === "rest" ? g.y(order.limit) : g.y(frame.at);
  // While it trades it reaches toward the seller across the axis; resting, it joins the buyers.
  const inDx = typeof frame.at === "number" ? g.gap - g.labelW / 2 + 2 : 0;
  const sent = !!p.state.sent;

  return (
    <>
      <svg className="ab-svg" viewBox={`0 0 ${g.W} ${g.H}`} role="group" aria-label={`An incoming order to buy ${order.units} units at up to ${fmt(order.limit)}`}>
        <Heads g={g} />
        <g className={cx("ab-print", "is-on", frame.last !== null && "is-new")} key={last} style={{ transform: `translate(${g.W - 12}px, 14px)` }}>
          <rect x={-112} y={0} width={112} height={24} rx={7} />
          <text x={-56} y={12 + g.small * 0.36} textAnchor="middle" fontSize={g.small}>
            LAST {fmt(last)}
          </text>
        </g>
        <Ladder g={g} prices={prices} hot={restNow ? new Set([cents(bb), cents(ba)]) : undefined} />
        {restNow && (
          <g className="ab-spread">
            <rect x={g.axisX - g.labelW / 2 - 6} y={g.y(ba) - 13} width={g.labelW + 12} height={g.y(bb) - g.y(ba) + 26} rx={8} />
          </g>
        )}
        {a.buyers.map((b) => (
          <Chip key={`b${b}`} g={g} side="buy" p={b} cls={restNow && cents(b) !== cents(bb) ? "is-quiet" : undefined} />
        ))}
        {sellersUp.map((s) => (
          <Chip key={`s${s}`} g={g} side="sell" p={s} cls={cx(consumed.has(cents(s)) && "is-gone", frame.at === s && !consumed.has(cents(s)) && "is-hit", frame.blocked === s && "is-blocked", restNow && cents(s) === cents(ba) && "is-best")} />
        ))}
        {frame.consumed > 0 && frame.at === sellersUp[frame.consumed - 1] && (
          // The trade: a pulse on the axis and the price it printed at, rising away.
          <g key={`burst${frame.consumed}`} className="ab-burst" style={{ transform: `translate(${g.axisX}px, ${g.y(sellersUp[frame.consumed - 1])}px)` }}>
            <circle r={12} />
            <text y={-18} textAnchor="middle" fontSize={g.small}>
              TRADE {fmt(sellersUp[frame.consumed - 1])}
            </text>
          </g>
        )}
        {frame.blocked !== null && (
          <g className="ab-block" style={{ transform: `translate(${g.sellX - 2}px, ${g.y(frame.blocked)}px)` }}>
            <circle r={10} />
            <path d="M-4 -4 L4 4 M-4 4 L4 -4" />
          </g>
        )}
        <Chip
          g={g}
          side="buy"
          p={order.limit}
          y={inY}
          dx={inDx}
          cls={cx("ab-incoming", !sent && "is-ready", restNow && "is-best")}
          label={restNow ? `≤ ${fmt(order.limit)}` : `${frame.left}× ≤ ${fmt(order.limit)}`}
          onPick={!sent && !p.solved ? send : undefined}
        />
      </svg>
      <div className="ab-stats">
        <div className="ab-stat">
          <span>Last price</span>
          <b className="num" key={last}>
            {fmt(last)}
          </b>
        </div>
        <div className={cx("ab-stat ab-stat--buy", restNow && "is-lit")}>
          <span>Best bid</span>
          <b className="num">{fmt(bb)}</b>
        </div>
        <div className={cx("ab-stat ab-stat--sell", restNow && "is-lit")}>
          <span>Best ask</span>
          <b className="num">{fmt(ba)}</b>
        </div>
      </div>
      {!sent && !p.solved && (
        <div className="ab-send">
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={send}>
            Send the order
          </button>
        </div>
      )}
    </>
  );
}

export function AuctionBook(p: TaskWidgetProps) {
  const a = p.task.data?.auction;
  const [ref, narrow] = useNarrow();
  const prices = useMemo(() => {
    if (!a) return [];
    const extra = a.incoming ? [a.incoming.limit] : [];
    return ladder({ buyers: [...a.buyers, ...extra], sellers: a.sellers }, a.step).reverse();
  }, [a]);
  if (!a || !prices.length) return null;
  const g = geometry(narrow, prices, a.step, a.mode === "clear", a.mode === "incoming" ? 44 : 0);
  return (
    <div ref={ref} className={cx("ab", `ab--${a.mode}`, narrow && "is-narrow")}>
      {a.mode === "clear" ? <Clear p={p} a={a} g={g} prices={prices} /> : a.mode === "spread" ? <Spread p={p} a={a} g={g} prices={prices} /> : <Incoming p={p} a={a} g={g} prices={prices} last0={a.cleared ?? (bestBid(a) + bestAsk(a)) / 2} />}
    </div>
  );
}
