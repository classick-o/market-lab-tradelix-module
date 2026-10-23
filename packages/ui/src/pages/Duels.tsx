import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { dayKey } from "@market-lab/academy";
import {
  advance,
  apply,
  formatPrice,
  initState,
  parsePrice,
  previewOrder,
  replay,
  type Action,
  type EngineEvent,
  type LogEntry,
  type SimContext,
  type SimState,
} from "@market-lab/engine";
import { ERROR_TAGS, type CriterionResult } from "@market-lab/evaluation";
import {
  ARENA_SCENARIOS,
  BOTS,
  CANDLE_SECONDS,
  DUEL_CANDLES,
  DUEL_COUNTDOWN,
  DUEL_END,
  DUEL_PROCESS_WEIGHT,
  DUEL_RISK_PCT,
  DUEL_RUBRIC,
  DUEL_START,
  FLAW_LABEL,
  MISSIONS,
  TICKS_PER_CANDLE,
  TICK_MS,
  botTurn,
  candleAt,
  closeDuelLog,
  dailyDuel,
  duelCandlesClosed,
  duelChartCandles,
  duelLadder,
  duelMarket,
  evaluateDuelSide,
  getArenaScenario,
  getBot,
  mirrorPersona,
  type BotId,
  type BotNote,
  type BotPersona,
  type DuelSide,
} from "@market-lab/missions";
import type { ArenaRegime } from "@market-lab/scenario-gen";
import { Chart, type ChartMarker } from "../components/Chart";
import { BotAvatar, BotTag, DuelLegend, VsPanel, formatR } from "../components/DuelParts";
import { OrderTicket, initialTicket, parseTicket, type TicketValue } from "../components/OrderTicket";
import { QUICK_DEFAULTS, QuickTrade } from "../components/QuickTrade";
import { Card, PageHead, Pnl, SubNav } from "../components/Page";
import { usePlaybackKeys } from "../components/Playback";
import { ChartTitle, StageBar, useChartHeight, useMediaQuery, useReducedMotion } from "../components/Stage";
import { smaSeries } from "../components/series";
import { useToast } from "../components/Toast";
import { Button, Checkbox, Chips, Dialog, Empty, Icon, IconButton, InlineError, KeyValues, Tabs, Tag, TextField, cx } from "../components/ui";
import { draftLines, linesFromState, markersFrom, rivalLinesFromState } from "../components/visuals";
import { DIFFICULTY_LABEL, relativeTime } from "../format";
import { usePlan } from "../host";
import { Link, useRouter } from "../router";
import { useLab, useStore, type DuelProgress, type DuelSession } from "../store";

/** The duel's bot, with Mirror's habit as it was fixed when the duel started. */
function botOf(d: DuelSession): BotPersona {
  return getBot(d.botId, d.mirrorFlaw);
}

/** A finished duel's log: played to the end and closed, or (resigned) closed where it stopped. */
function finalLog(d: DuelSession, log: readonly LogEntry[]): LogEntry[] {
  return d.status === "resigned" ? closeDuelLog(log, d.cursor) : closeDuelLog(log);
}

function resultLabel(d: DuelSession): string {
  const w = d.result?.winner;
  return w === "you" ? "Won" : w === "bot" ? (d.result?.reason === "resigned" ? "Resigned" : "Lost") : "Draw";
}

/** Duel candles played at a tick, for "candle 23 of 80". */
function candleNumber(cursor: number): number {
  return Math.min(DUEL_CANDLES, Math.max(1, Math.ceil((cursor - DUEL_START) / TICKS_PER_CANDLE) || 1));
}

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

/** Engine fills are on ticks; the chart draws whole candles. */
const onCandles = (markers: ChartMarker[]) => markers.map((m) => ({ ...m, step: candleAt(m.step) }));

const noteLabel = (n: BotNote) => (n.candle === 0 ? "At the start" : `After candle ${n.candle}`);

// ─── Lobby ──────────────────────────────────────────────────────────────────

export function DuelsPage() {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const { pro } = usePlan();
  const active = store.activeDuel();
  const [regime, setRegime] = useState<ArenaRegime>("bullish");
  const [blocked, setBlocked] = useState(false);

  const finished = Object.values(lab.duels)
    .filter((d) => d.result)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
  const ladder = duelLadder(
    finished.map((d) => ({ botId: d.botId, winner: d.result!.winner, at: d.completedAt ?? d.updatedAt })),
    lab.duelRating,
  );
  const won = finished.filter((d) => d.result!.winner === "you").length;
  const drawn = finished.filter((d) => d.result!.winner === "draw").length;
  const lost = finished.length - won - drawn;
  const today = dayKey(Date.now(), lab.settings.timeZone);
  const daily = dailyDuel(today);
  const dailyBot = getBot(daily.botId);
  const dailyDone = finished.find((d) => d.daily === today);
  const habit = store.duelHabit();
  const rival = ladder.rival ? getBot(ladder.rival) : null;

  const start = (botId: BotId, opts: { daily?: boolean } = {}) => {
    if (active) return setBlocked(true);
    const id = opts.daily ? store.startDuel(daily.botId, daily.regime, { daily: today, seed: daily.seed }) : store.startDuel(botId, regime);
    navigate(`/arena/duels/${id}`);
  };
  const pickScenario = (id: string) => {
    const s = getArenaScenario(id);
    if (s.tier === "pro" && !pro) return navigate("/pricing");
    setRegime(s.id);
  };

  const bots: BotPersona[] = [...BOTS, mirrorPersona(habit)];
  const minutes = Math.round((DUEL_CANDLES * CANDLE_SECONDS) / 60);

  return (
    <div className="ml-page ml-duels">
      <PageHead
        title="Duels"
        sub="Trade the same live market as a bot. The better process wins, not the bigger profit. Every opponent here is a bot, and labelled as one."
      />
      <SubNav module="arena" />

      {active && (
        <Card className="ml-duel-active" eyebrow="Duel in progress" title={`vs ${botOf(active).name} · ${getArenaScenario(active.regime).title}`}>
          <p className="ml-muted num">
            Candle {candleNumber(active.cursor)} of {DUEL_CANDLES}
            {active.daily ? " · daily duel" : ""} · started {relativeTime(active.createdAt)}
          </p>
          <div className="ml-actions">
            <Button variant="primary" iconRight="arrow-right" onClick={() => navigate(`/arena/duels/${active.id}`)}>
              Resume
            </Button>
          </div>
        </Card>
      )}

      <div className="ml-grid ml-grid--3 ml-duel-top">
        <Card eyebrow="Your duel rating" title={<span className="ml-rating-big num">{lab.duelRating}</span>}>
          <p className="ml-muted num">
            {finished.length === 0 ? "Starts at 1000. Each rated duel moves it up or down, more when the bot is rated higher than you." : `${won} won · ${lost} lost · ${drawn} drawn`}
          </p>
          {rival && (
            <p className="ml-duel-rival">
              <BotAvatar bot={rival} size={22} />
              <span>
                Rival: <b>{rival.name}</b> won your last two duels against it.
              </span>
            </p>
          )}
        </Card>
        <Card eyebrow="Daily duel" title={`${dailyBot.name} · ${getArenaScenario(daily.regime).title}`} action={<BotTag />}>
          <p className="ml-muted">The same bot and the same market for everyone today. Unrated, once a day.</p>
          <div className="ml-actions">
            {dailyDone ? (
              <Link to={`/arena/duels/${dailyDone.id}`} className="ml-text-link">
                Played today: {resultLabel(dailyDone).toLowerCase()} · see the result
              </Link>
            ) : active?.daily === today ? (
              <Button variant="secondary" onClick={() => navigate(`/arena/duels/${active.id}`)}>
                Resume today's duel
              </Button>
            ) : (
              <Button variant="secondary" iconRight="arrow-right" onClick={() => start(daily.botId, { daily: true })}>
                Play today's duel
              </Button>
            )}
          </div>
        </Card>
        <Card eyebrow="How duels work" title="Same market, better process">
          <ul className="ml-list ml-list--dash">
            <li>
              A live market: each candle forms in {CANDLE_SECONDS} seconds, {DUEL_CANDLES} candles in all (about {minutes} minutes). A {DUEL_COUNTDOWN}-second countdown first; pause whenever you want to think.
            </li>
            <li>Trade with one tap: pick a size, add a stop and a target if you want. A stop is optional but scored; with one, the risk is capped at {DUEL_RISK_PCT}%.</li>
            <li>Each bot's level and rating stay the same. Only your rating moves.</li>
            <li>
              Duel score = {Math.round(DUEL_PROCESS_WEIGHT * 100)}% decision quality + {Math.round((1 - DUEL_PROCESS_WEIGHT) * 100)}% result in R. No trade, no win.
            </li>
          </ul>
        </Card>
      </div>

      <Card title="Market" eyebrow="For the next duel you start">
        <Chips
          single
          label="Market"
          options={ARENA_SCENARIOS.map((s) => ({ id: s.id, label: s.tier === "pro" && !pro ? `${s.title} (Pro)` : s.title }))}
          selected={[regime]}
          onToggle={pickScenario}
        />
        <p className="ml-fine">{getArenaScenario(regime).tagline} Bot duels don't use your Arena sessions.</p>
      </Card>

      <section className="ml-section" aria-labelledby="ml-bots-title">
        <div className="ml-section-head">
          <h2 id="ml-bots-title">Sparring partners</h2>
        </div>
        <ul className="ml-bots">
          {bots.map((b) => {
            const rec = ladder.record[b.id];
            const isMirror = b.id === "mirror";
            const disabled = isMirror && !habit;
            const recommended = ladder.recommended === b.id;
            return (
              <li key={b.id} className={cx("ml-bot-card", recommended && "is-recommended", disabled && "is-disabled")}>
                <div className="ml-bot-card-head">
                  <BotAvatar bot={b} size={40} />
                  <div className="ml-bot-card-title">
                    <h3>
                      {b.name} <BotTag />
                    </h3>
                    <span className="ml-muted">{b.title}</span>
                  </div>
                </div>
                <div className="ml-duel-chips">
                  {recommended && <span className="ml-status ml-status--active">Recommended</span>}
                  {ladder.rival === b.id && <span className="ml-status ml-duel-chip--rival">Rival</span>}
                  {ladder.beaten.includes(b.id) && (
                    <span className="ml-status ml-status--done">
                      <Icon name="check" size={12} /> Beaten
                    </span>
                  )}
                </div>
                <p>{b.bio}</p>
                <dl className="ml-bot-facts">
                  <div>
                    <dt>Level</dt>
                    <dd className="num">
                      {b.level} · {DIFFICULTY_LABEL[b.level]}
                    </dd>
                  </div>
                  <div>
                    <dt>Rating</dt>
                    <dd className="num">{b.rating}</dd>
                  </div>
                  <div>
                    <dt>Plays</dt>
                    <dd>{isMirror && !habit ? "Your most frequent habit, once you have one" : b.flaws.length ? b.flaws.map((f) => FLAW_LABEL[f]).join(", ") : "A clean process"}</dd>
                  </div>
                  <div>
                    <dt>Watch for</dt>
                    <dd>{b.watch}</dd>
                  </div>
                  <div>
                    <dt>You vs {b.name}</dt>
                    <dd className="num">{rec ? `${rec.won} won · ${rec.lost} lost${rec.drawn ? ` · ${rec.drawn} drawn` : ""}` : "No duels yet"}</dd>
                  </div>
                </dl>
                {disabled ? (
                  <p className="ml-fine">No recurring habit found yet. Mirror needs a few missions, Arena sessions or duels with a mistake that repeats.</p>
                ) : (
                  <Button variant={recommended ? "primary" : "secondary"} iconRight="arrow-right" onClick={() => start(b.id)}>
                    Duel {b.name}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <Card title="Recent duels">
        {finished.length === 0 ? (
          <p className="ml-muted">Finished duels appear here, with both scores and the result.</p>
        ) : (
          <ul className="ml-rows">
            {finished.slice(0, 8).map((d) => {
              const b = botOf(d);
              const r = d.result!;
              return (
                <li key={d.id}>
                  <Link to={`/arena/duels/${d.id}`} className="ml-row-link">
                    <BotAvatar bot={b} size={28} />
                    <span className="ml-row-main">
                      <b>
                        vs {b.name} · {getArenaScenario(d.regime).title}
                        {d.daily ? " · daily" : ""}
                      </b>
                      <span className="ml-muted num">
                        Duel score {r.you.score ?? "—"} vs {r.bot.score ?? "—"} · {relativeTime(d.completedAt ?? d.updatedAt)}
                      </span>
                    </span>
                    <Tag variant={r.winner === "you" ? "inverse" : "outline"}>{resultLabel(d)}</Tag>
                    <Icon name="chevron-right" size={18} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Dialog
        open={blocked}
        onClose={() => setBlocked(false)}
        title="Finish your current duel first"
        description="You have a duel in progress. Resume it, or open it and resign to start a new one."
        footer={
          <>
            <Button variant="tertiary" onClick={() => setBlocked(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => active && navigate(`/arena/duels/${active.id}`)}>
              Resume the duel
            </Button>
          </>
        }
      />
    </div>
  );
}

// ─── One duel ───────────────────────────────────────────────────────────────

export function DuelPage({ duelId }: { duelId: string }) {
  const lab = useLab();
  const d = lab.duels[duelId];
  // A duel that ends while it's on screen keeps the live view until the player opens the result.
  const [live, setLive] = useState(d?.status === "active");
  if (!d) return <Empty title="Duel not found" action={<Link to="/arena/duels" className="ml-text-link">Back to Duels</Link>} />;
  if (live || d.status === "active") return <DuelLive key={d.id} duel={d} onDone={() => setLive(false)} />;
  return <DuelResult duel={d} />;
}

/**
 * One account at a tick. While the market runs it moves forward from where it was; it replays
 * from the start only when the log changes in the past.
 */
function useAccount(ctx: SimContext, log: readonly LogEntry[], to: number): { state: SimState; events: EngineEvent[] } {
  const memo = useRef<{ ctx: SimContext; n: number; state: SimState; events: EngineEvent[] } | null>(null);
  return useMemo(() => {
    let c = memo.current;
    if (!c || c.ctx !== ctx || c.n > log.length || c.state.step > to || log.slice(c.n).some((e) => e.kind === "action" && e.step < c!.state.step)) {
      c = { ctx, n: 0, state: initState(ctx, DUEL_START), events: [] };
    }
    let state = c.state;
    const events = c.events.slice();
    const keep = (evs: EngineEvent[]) => {
      for (const e of evs) if (e.type !== "step_advanced") events.push(e);
    };
    for (const e of log.slice(c.n)) {
      if (e.kind !== "action") continue;
      if (e.step > state.step) {
        const r = advance(ctx, state, e.step);
        state = r.state;
        keep(r.events);
      }
      const r = apply(ctx, state, e.action);
      state = r.state;
      keep(r.events);
    }
    if (to > state.step) {
      const r = advance(ctx, state, to);
      state = r.state;
      keep(r.events);
    }
    memo.current = { ctx, n: log.length, state, events };
    return { state, events };
  }, [ctx, log, to]);
}

/** Zoom and looking back on a chart: the candle width, and the candle the window ends at (null = the newest). */
function useChartView(lastIdx: number, oldest: number, initialZoom = 6) {
  const [zoom, setZoom] = useState(initialZoom);
  const [viewEnd, setViewEnd] = useState<number | null>(null);
  const zoomBy = (dir: 1 | -1) => setZoom((z) => Math.min(24, Math.max(2, dir > 0 ? z * 1.25 : z / 1.25)));
  const pan = (candles: number) =>
    setViewEnd((v) => {
      const next = (v ?? lastIdx) - candles;
      return next >= lastIdx ? null : Math.max(oldest, next);
    });
  return { zoom, viewEnd, zoomBy, pan, live: () => setViewEnd(null) };
}

function ChartViewControls({ view, liveLabel = "Back to now" }: { view: ReturnType<typeof useChartView>; liveLabel?: string }) {
  return (
    <div className="ml-chartview" role="group" aria-label="Chart view">
      <IconButton icon="minus" label="Zoom out" size="sm" onClick={() => view.zoomBy(-1)} />
      <IconButton icon="plus" label="Zoom in" size="sm" onClick={() => view.zoomBy(1)} />
      <IconButton icon="arrow-left" label="Look back" size="sm" onClick={() => view.pan(15)} />
      <IconButton icon="arrow-right" label="Look forward" size="sm" onClick={() => view.pan(-15)} disabled={view.viewEnd === null} />
      {view.viewEnd !== null && (
        <Button size="sm" variant="secondary" onClick={view.live}>
          {liveLabel}
        </Button>
      )}
    </div>
  );
}

function DuelLive({ duel, onDone }: { duel: DuelSession; onDone: () => void }) {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const reduced = useReducedMotion();
  const phone = useMediaQuery("(max-width: 720px)");
  const chartHeight = useChartHeight();
  const m = useMemo(() => duelMarket(duel.regime, duel.seed), [duel.regime, duel.seed]);
  const { ctx, scenario } = m;
  const bot = botOf(duel);
  const chart = lab.settings.chart;
  const showBot = lab.settings.duelShowBot !== false;
  const quick = lab.settings.duelQuick ?? QUICK_DEFAULTS;

  const [cursor, setCursor] = useState(duel.cursor);
  const [log, setLog] = useState<LogEntry[]>(duel.log);
  const [botLog, setBotLog] = useState<LogEntry[]>(duel.botLog);
  const [notes, setNotes] = useState<BotNote[]>(duel.botNotes);
  const [botNext, setBotNext] = useState(duel.botNext);
  const [countdown, setCountdown] = useState(duel.status === "active" ? DUEL_COUNTDOWN : 0);
  const [paused, setPaused] = useState(false);
  const [tab, setTab] = useState<"trade" | "position" | "bot">("trade");
  const [ticket, setTicket] = useState<TicketValue>(() => initialTicket("buy", { riskPct: DUEL_RISK_PCT }));
  const [error, setError] = useState<string | null>(null);
  const [slText, setSlText] = useState("");
  const [tpText, setTpText] = useState("");
  const [resigning, setResigning] = useState(false);
  const [advanced, setAdvanced] = useState(false);

  const over = cursor >= DUEL_END;
  const running = !over && countdown === 0 && !paused && !resigning;
  const progress = useRef<DuelProgress>({ cursor, log, botLog, botNotes: notes, botNext });
  progress.current = { cursor, log, botLog, botNotes: notes, botNext };

  // The countdown, then the market: one tick every TICK_MS.
  useEffect(() => {
    if (countdown <= 0) return;
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [countdown]);
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setCursor((c) => Math.min(DUEL_END, c + 1)), TICK_MS);
    return () => window.clearInterval(t);
  }, [running]);

  // The bot decides at each candle close, from its own account (catching up after a resume).
  useEffect(() => {
    if (countdown > 0) return;
    const closed = Math.min(duelCandlesClosed(cursor), DUEL_CANDLES - 1);
    if (botNext > closed) return;
    let nextLog = botLog;
    const nextNotes = [...notes];
    let next = botNext;
    for (; next <= closed; next++) {
      const turn = botTurn(m, bot, nextLog, next, duel.seed, duel.foresight);
      nextLog = [...nextLog, ...turn.entries];
      if (turn.note) nextNotes.push(turn.note);
    }
    setBotLog(nextLog);
    setNotes(nextNotes);
    setBotNext(next);
    store.saveDuel(duel.id, { cursor, log, botLog: nextLog, botNotes: nextNotes, botNext: next });
  }, [cursor, countdown]); // eslint-disable-line react-hooks/exhaustive-deps

  // The last candle closed: the duel is scored.
  useEffect(() => {
    if (over && duel.status === "active") store.finishDuel(duel.id, progress.current);
  }, [over]); // eslint-disable-line react-hooks/exhaustive-deps

  // Saved on pause and when leaving; a hidden tab pauses the market.
  useEffect(() => {
    if (paused) store.saveDuel(duel.id, progress.current);
  }, [paused]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onVisibility = () => document.hidden && setPaused(true);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      store.saveDuel(duel.id, progress.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  usePlaybackKeys(!over && countdown === 0, { toggle: () => setPaused((p) => !p), step: () => undefined });

  const youLive = useAccount(ctx, log, cursor);
  const themLive = useAccount(ctx, botLog, cursor);
  const final = useMemo(() => (over ? { you: replay(ctx, DUEL_START, closeDuelLog(log)), them: replay(ctx, DUEL_START, closeDuelLog(botLog)) } : null), [over]); // eslint-disable-line react-hooks/exhaustive-deps
  const you = final?.you ?? youLive;
  const them = final?.them ?? themLive;
  const pos = you.state.position;

  useEffect(() => {
    setSlText(pos?.stopLoss != null ? (pos.stopLoss / 100).toFixed(2) : "");
    setTpText(pos?.takeProfit != null ? (pos.takeProfit / 100).toFixed(2) : "");
  }, [pos?.tradeId, pos?.stopLoss, pos?.takeProfit]);

  const act = (action: Action, message: string): boolean => {
    if (over) return false;
    const r = apply(ctx, youLive.state, action);
    if (r.rejected) {
      setError(r.rejected.message);
      return false;
    }
    setError(null);
    const next = [...log, { kind: "action" as const, step: cursor, action }];
    setLog(next);
    store.saveDuel(duel.id, { ...progress.current, log: next });
    toast(message);
    return true;
  };

  const placeOrder = () => {
    const { order, problem } = parseTicket(ticket);
    if (!order) return setError(problem);
    // The ticket already shows why the engine would refuse the order (no stop, over 1%, buying power).
    if (!previewOrder(ctx, youLive.state, { type: "submit_order", ...order }).ok) return setError(null);
    if (act({ type: "submit_order", ...order }, "Order placed")) setTicket(initialTicket(ticket.side, { riskPct: Number(ticket.riskPct) || DUEL_RISK_PCT }));
  };

  const updateBrackets = () => {
    const sl = slText.trim() === "" ? null : parsePrice(slText);
    const tp = tpText.trim() === "" ? null : parsePrice(tpText);
    if ((slText.trim() && sl === null) || (tpText.trim() && tp === null)) return setError("Enter valid prices for the stop and the target, or leave them empty.");
    act({ type: "modify_brackets", stopLoss: sl, takeProfit: tp }, "Stop and target updated");
  };

  const candles = useMemo(() => duelChartCandles(m, cursor), [m, cursor]);
  const lastIdx = candles.length - 1;
  const view = useChartView(lastIdx, 30, phone ? 5 : 6);
  const overlays = [
    ...(chart.sma20 ? [{ id: "sma20", label: "SMA 20", values: smaSeries(candles, 20, lastIdx), tone: 1 as const }] : []),
    ...(chart.sma50 ? [{ id: "sma50", label: "SMA 50", values: smaSeries(candles, 50, lastIdx), tone: 2 as const }] : []),
  ];
  const played = cursor - DUEL_START;
  const intoCandle = played % TICKS_PER_CANDLE;
  const candleLeft = ((TICKS_PER_CANDLE - intoCandle) * TICK_MS) / 1000;
  const totalLeft = ((DUEL_END - cursor) * TICK_MS) / 1000;
  const latest = notes[notes.length - 1];
  const status = over ? "Duel over" : countdown > 0 ? `Starts in ${countdown}` : paused ? "Paused" : "Live";

  return (
    <div className="ml-stage ml-duel">
      <StageBar
        back={{ to: "/arena/duels", label: "Duels" }}
        eyebrow={`Duel · ${scenario.title}${duel.daily ? " · daily" : ""} · max risk ${DUEL_RISK_PCT}% per order`}
        title={
          <span className="ml-duel-title">
            You vs {bot.name} <BotTag />
          </span>
        }
      >
        <Tag variant="outline">Synthetic data</Tag>
        {!over && (
          <Button size="sm" variant="secondary" onClick={() => setResigning(true)}>
            Resign
          </Button>
        )}
      </StageBar>

      <div className="ml-duelbar">
        <span className={cx("ml-duel-status", `is-${over ? "over" : countdown > 0 ? "countdown" : paused ? "paused" : "live"}`)}>{status}</span>
        <div className="ml-duel-progress" role="progressbar" aria-label="Duel progress" aria-valuemin={0} aria-valuemax={DUEL_CANDLES} aria-valuenow={Math.max(0, Math.floor(played / TICKS_PER_CANDLE))}>
          <span style={{ width: `${(played / (DUEL_END - DUEL_START)) * 100}%` }} />
        </div>
        <span className="ml-duelbar-label num">
          Candle {candleNumber(cursor)} of {DUEL_CANDLES}
          {!over && countdown === 0 && ` · next close in 0:${String(Math.ceil(candleLeft)).padStart(2, "0")} · ${clock(totalLeft)} left`}
        </span>
      </div>

      <div className="ml-stage-grid">
        <section className="ml-stage-main" aria-label="Market">
          {showBot && latest && (
            <p className="ml-bot-note" aria-live="polite">
              <BotAvatar bot={bot} size={22} />
              <span>
                <b>
                  {bot.name}, {noteLabel(latest).toLowerCase()}:
                </b>{" "}
                {latest.text}
              </span>
            </p>
          )}
          <div className="ml-panel ml-chart-panel ml-duel-chart">
            <div className="ml-chart-tools">
              <ChartViewControls view={view} />
              <div className="ml-row ml-chart-toggles" role="group" aria-label="Show on the chart">
                <Checkbox checked={showBot} onChange={(v) => store.setSettings({ duelShowBot: v })} label={<span className="ml-ind ml-ind--rival">{bot.name}'s trades</span>} />
                <Checkbox checked={chart.sma20} onChange={(v) => store.setChart({ sma20: v })} label={<span className="ml-ind ml-ind--1">SMA 20</span>} />
                <Checkbox checked={chart.sma50} onChange={(v) => store.setChart({ sma50: v })} label={<span className="ml-ind ml-ind--2">SMA 50</span>} />
                <Checkbox checked={chart.volume} onChange={(v) => store.setChart({ volume: v })} label="Volume" />
              </div>
            </div>
            <Chart
              title={<ChartTitle symbol="LABX" meta={`/ vUSD · 1H · candle ${candleNumber(cursor)} of ${DUEL_CANDLES}`} />}
              candles={candles}
              visibleTo={lastIdx}
              futureSlots={over ? 0 : 6}
              minBarWidth={view.zoom}
              viewEnd={view.viewEnd ?? undefined}
              onZoom={view.zoomBy}
              onPan={view.pan}
              height={chartHeight}
              label="Duel price chart, live. Scroll to zoom, drag to look back."
              lines={over ? [] : [...linesFromState(you.state), ...(showBot ? rivalLinesFromState(them.state, bot.name) : []), ...draftLines(tab === "trade" && advanced ? ticket : null)]}
              markers={onCandles([...markersFrom(you.events, cursor), ...(showBot ? markersFrom(them.events, cursor, true) : [])])}
              zone={{ from: DUEL_START + 1, to: DUEL_START + DUEL_CANDLES }}
              overlays={overlays}
              showVolume={chart.volume}
              showGrid={chart.grid}
              animateNewest={running && !reduced}
            />
            {countdown > 0 && !over && (
              <div className="ml-duel-countdown" role="status" aria-live="polite">
                <span className="ml-duel-countdown-n num">{countdown}</span>
                <span>Read the history. The market starts moving in {countdown} s.</span>
              </div>
            )}
            {!over && countdown === 0 && (paused || view.viewEnd !== null) && (
              <div className="ml-duel-flags" role="status">
                {paused && (
                  <span className="ml-duel-flag is-paused">
                    <Icon name="pause" size={14} /> Paused · the market waits for you
                  </span>
                )}
                {view.viewEnd !== null && <span className="ml-duel-flag is-lookback">{paused ? "Looking back" : "Looking back · the market keeps moving"}</span>}
              </div>
            )}
          </div>
        </section>

        <aside className="ml-dock" aria-label="Duel panel">
          <div className="ml-dock-tabs">
            <Tabs
              label="Duel panel"
              value={tab}
              onChange={(v) => {
                setTab(v);
                setError(null);
              }}
              items={[
                { value: "trade", label: "Trade" },
                { value: "position", label: "Position", count: pos ? 1 : you.state.orders.length || undefined },
                { value: "bot", label: bot.name, count: notes.length || undefined },
              ]}
            />
          </div>

          {tab === "trade" && (
            <div className="ml-dock-body">
              {!over ? (
                <>
                  <QuickTrade ctx={ctx} state={youLive.state} prefs={quick} onPrefs={(q) => store.setSettings({ duelQuick: q })} onAct={act} allowShort={scenario.allowShort} riskLimitPct={DUEL_RISK_PCT} />
                  <p className="ml-fine">Orders fill at the live price, also while the market is paused.</p>
                  <details className="ml-qt-more" open={advanced} onToggle={(e) => setAdvanced((e.target as HTMLDetailsElement).open)}>
                    <summary>Limit order or exact prices</summary>
                    <div className="ml-stack-4">
                      <OrderTicket ctx={ctx} state={youLive.state} value={ticket} onChange={setTicket} sides={scenario.allowShort ? ["buy", "sell"] : ["buy"]} orderTypes={scenario.orderTypes} riskLimitPct={DUEL_RISK_PCT} />
                      {error && <InlineError>{error}</InlineError>}
                      <Button variant="secondary" block iconLeft="plus" onClick={placeOrder}>
                        Place order
                      </Button>
                    </div>
                  </details>
                </>
              ) : (
                <p className="ml-muted">The duel is over.</p>
              )}
            </div>
          )}

          {tab === "position" && (
            <div className="ml-dock-body">
              {pos ? (
                <div className="ml-stack-4">
                  <KeyValues
                    items={[
                      { label: "Side", value: `${pos.side === "long" ? "Long" : "Short"} ${pos.qty}` },
                      { label: "Average entry", value: formatPrice(Math.round(pos.costBasis / pos.qty)) },
                    ]}
                  />
                  {!over && (
                    <>
                      <div className="ml-grid-2">
                        <TextField label="Stop-loss" inputMode="decimal" value={slText} onChange={(e) => setSlText(e.target.value)} placeholder="None" />
                        <TextField label="Take-profit" inputMode="decimal" value={tpText} onChange={(e) => setTpText(e.target.value)} placeholder="None" />
                      </div>
                      {error && <InlineError>{error}</InlineError>}
                      <div className="ml-actions">
                        <Button variant="secondary" onClick={updateBrackets}>
                          Update stop and target
                        </Button>
                        <Button variant="tertiary" disabled={pos.qty < 2} onClick={() => act({ type: "close_position", qty: Math.floor(pos.qty / 2) }, "Half the position closed")}>
                          Close half
                        </Button>
                        <Button variant="destructive" onClick={() => act({ type: "close_position" }, "Position closed")}>
                          Close position
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="ml-muted">No open position.</p>
              )}
              {you.state.orders.length > 0 && (
                <div className="ml-stack-2">
                  <h3 className="ml-h3">Pending orders</h3>
                  <ul className="ml-rows">
                    {you.state.orders.map((o) => (
                      <li key={o.id} className="ml-row-static">
                        <span className="num">
                          {o.side === "buy" ? "Buy" : "Sell"} limit · {o.qty} @ {formatPrice(o.limitPrice)}
                        </span>
                        {!over && (
                          <Button size="sm" variant="tertiary" onClick={() => act({ type: "cancel_order", orderId: o.id }, "Order cancelled")}>
                            Cancel
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {tab === "bot" && (
            <div className="ml-dock-body">
              <div className="ml-bot-brief">
                <BotAvatar bot={bot} size={36} />
                <div>
                  <b>
                    {bot.name} <BotTag />
                  </b>
                  <p className="ml-muted">{bot.title}</p>
                </div>
              </div>
              <KeyValues
                items={[
                  { label: "Plays", value: bot.flaws.length ? bot.flaws.map((f) => FLAW_LABEL[f]).join(", ") : "A clean process" },
                  { label: "Watch for", value: bot.watch },
                ]}
              />
              <h3 className="ml-h3">{bot.name}'s moves</h3>
              {!showBot ? (
                <p className="ml-muted">Hidden. Turn on “{bot.name}'s trades” above the chart to see them.</p>
              ) : notes.length === 0 ? (
                <p className="ml-muted">{bot.name} decides when a candle closes. Its moves appear here.</p>
              ) : (
                <ol className="ml-duel-notes">
                  {[...notes].reverse().map((n) => (
                    <li key={n.step}>
                      <span className="ml-duel-notes-round num">{noteLabel(n)}</span>
                      <span>{n.text}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          <div className="ml-dock-foot">
            {over ? (
              <Button variant="primary" size="lg" block iconRight="arrow-right" onClick={onDone}>
                See the result
              </Button>
            ) : countdown > 0 ? (
              <Button variant="secondary" size="lg" block disabled>
                The market starts in {countdown} s
              </Button>
            ) : paused ? (
              <Button variant="primary" size="lg" block iconLeft="play" onClick={() => setPaused(false)}>
                Resume the market
              </Button>
            ) : (
              <Button variant="secondary" size="lg" block iconLeft="pause" onClick={() => setPaused(true)}>
                Pause
              </Button>
            )}
          </div>
        </aside>
      </div>

      {/* Below the chart and the dock: on a phone the order ticket comes right after the chart. */}
      <VsPanel ctx={ctx} bot={bot} you={you.state} rival={them.state} showRival={showBot} />

      <Dialog
        open={resigning}
        onClose={() => setResigning(false)}
        title="Resign this duel?"
        description={`Resigning counts as a loss${duel.daily ? "" : " and lowers your rating"}. It earns no XP. Your positions close at the current price.`}
        footer={
          <>
            <Button variant="tertiary" onClick={() => setResigning(false)}>
              Keep playing
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setResigning(false);
                store.resignDuel(duel.id, progress.current);
                onDone();
              }}
            >
              Resign
            </Button>
          </>
        }
      />
    </div>
  );
}

// ─── Result ─────────────────────────────────────────────────────────────────

const pctScore = (c: CriterionResult | undefined) => (c && c.applicable ? String(Math.round(c.score * 100)) : "n/a");

function verdictText(d: DuelSession, you: DuelSide, botSide: DuelSide, bot: BotPersona): string {
  const r = d.result!;
  const weakest = (s: DuelSide) => s.dqs.criteria.filter((c) => c.applicable && c.score < 0.6).sort((a, b) => b.weight * (1 - b.score) - a.weight * (1 - a.score))[0];
  if (r.reason === "resigned") return "Resigning counts as a loss. The candles you played are below.";
  if (r.reason === "no_trade") {
    if (r.winner === "draw") return "Neither of you took a trade, so the duel is a draw.";
    return r.winner === "bot" ? `You didn't take a trade, so the duel goes to ${bot.name}. A duel needs at least one trade.` : `${bot.name} didn't take a trade, so the duel is yours.`;
  }
  if (r.reason === "discipline") return `Same duel score. ${r.winner === "you" ? "Your" : `${bot.name}'s`} risk discipline was better, and that decides a tie.`;
  if (r.reason === "outcome") return `Same duel score and the same discipline. ${r.winner === "you" ? "You" : bot.name} ended with the better result in R.`;
  if (r.winner === "draw") return "Same score, same discipline, same result in R: a draw.";
  if (r.winner === "you" && botSide.net > you.net) {
    const w = weakest(botSide);
    return `${bot.name} made more money, but you won on process${w ? `: ${bot.name} lost points on “${w.label.toLowerCase()}”` : ""}.`;
  }
  if (r.winner === "bot" && you.net > botSide.net) {
    const w = weakest(you);
    return `You made more money, but ${bot.name} won on process${w ? `: you lost points on “${w.label.toLowerCase()}”` : ""}.`;
  }
  return r.winner === "you" ? "You won on process and on the outcome." : `${bot.name} won on process and on the outcome.`;
}

function DuelResult({ duel }: { duel: DuelSession }) {
  const { navigate } = useRouter();
  const lab = useLab();
  const store = useStore();
  const m = useMemo(() => duelMarket(duel.regime, duel.seed), [duel.regime, duel.seed]);
  const { ctx, scenario } = m;
  const bot = botOf(duel);
  const youLog = useMemo(() => finalLog(duel, duel.log), [duel]);
  const botLog = useMemo(() => finalLog(duel, duel.botLog), [duel]);
  const you = useMemo(() => evaluateDuelSide(m, youLog), [m, youLog]);
  const botSide = useMemo(() => evaluateDuelSide(m, botLog), [m, botLog]);
  const youRun = useMemo(() => replay(ctx, DUEL_START, youLog), [ctx, youLog]);
  const botRun = useMemo(() => replay(ctx, DUEL_START, botLog), [ctx, botLog]);
  const r = duel.result;
  const end = youRun.state.step;
  const candles = useMemo(() => duelChartCandles(m, end), [m, end]);
  const view = useChartView(candles.length - 1, 30, 4);
  if (!r) return <Empty title="This duel has no result yet" action={<Link to="/arena/duels" className="ml-text-link">Back to Duels</Link>} />;

  const title = r.reason === "resigned" ? "You resigned" : r.winner === "you" ? "You won the duel" : r.winner === "bot" ? `${bot.name} won the duel` : "Draw";
  const diff = r.ratingAfter - r.ratingBefore;
  const mission = MISSIONS.find((x) => r.you.errorTags.some((t) => x.targets.includes(t)));
  const ladder = duelLadder(
    Object.values(lab.duels)
      .filter((d) => d.result)
      .map((d) => ({ botId: d.botId, winner: d.result!.winner, at: d.completedAt ?? d.updatedAt })),
    lab.duelRating,
  );
  const nextBot = getBot(ladder.recommended !== duel.botId ? ladder.recommended : (BOTS.find((b) => b.rating > bot.rating)?.id ?? "sage"));
  const rematch = (botId: BotId) => navigate(`/arena/duels/${store.startDuel(botId, duel.regime)}`);
  const rows: { label: string; you: ReactNode; bot: ReactNode; strong?: boolean }[] = [
    { label: "Decision quality", you: you.process ?? "—", bot: botSide.process ?? "—" },
    { label: "Risk discipline", you: you.rds ?? "—", bot: botSide.rds ?? "—" },
    { label: "Outcome (R)", you: formatR(you.r), bot: formatR(botSide.r) },
    { label: "Simulated P&L", you: <Pnl value={you.net} />, bot: <Pnl value={botSide.net} /> },
    { label: "Trades", you: you.trades, bot: botSide.trades },
    { label: "Duel score", you: you.score ?? "—", bot: botSide.score ?? "—", strong: true },
  ];
  const formula = (s: DuelSide) =>
    s.process === null ? "no trade" : `${DUEL_PROCESS_WEIGHT} × ${s.process} + ${(1 - DUEL_PROCESS_WEIGHT).toFixed(1)} × ${s.outcome} (${formatR(s.r)}) = ${s.score}`;
  const misses = (s: DuelSide) => s.dqs.criteria.filter((c) => c.applicable && c.score < 0.6);

  return (
    <article className="ml-page ml-report ml-duel-result">
      <PageHead
        back={{ to: "/arena/duels", label: "Duels" }}
        eyebrow={`Duel result · ${scenario.title}${duel.daily ? " · daily duel" : ""} · synthetic data, simulated orders`}
        title={title}
        sub={`You ${you.score ?? "—"} vs ${bot.name} ${botSide.score ?? "—"} · ${you.candles} of ${DUEL_CANDLES} candles`}
      />

      <div className="ml-duel-scoreboard">
        <table className="ml-table ml-duel-score">
          <caption className="ml-sr">Scores for you and {bot.name}, kept separate</caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="ml-sr">Score</span>
              </th>
              <th scope="col" className={cx("num", r.winner === "you" && "is-winner")}>
                You
              </th>
              <th scope="col" className={cx("num", r.winner === "bot" && "is-winner")}>
                <span className="ml-vs-name">
                  <BotAvatar bot={bot} size={20} />
                  {bot.name} <BotTag />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className={cx(row.strong && "is-strong")}>
                <th scope="row">{row.label}</th>
                <td className="num">{row.you}</td>
                <td className="num">{row.bot}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ml-stack-2">
          <p className="ml-verdict is-strong">{verdictText(duel, you, botSide, bot)}</p>
          <p className="ml-muted">The duel score is {Math.round(DUEL_PROCESS_WEIGHT * 100)}% decision quality and {Math.round((1 - DUEL_PROCESS_WEIGHT) * 100)}% result in R. R doesn't grow with position size, so a bigger bet never helps.</p>
          <p className="ml-duel-meta num">
            {r.rated ? `Rating ${r.ratingBefore} → ${r.ratingAfter} (${diff >= 0 ? "+" : "−"}${Math.abs(diff)})` : "Daily duel: the rating doesn't change."} ·{" "}
            {r.xp > 0 ? `+${r.xp} XP` : r.reason === "resigned" ? "no XP for a resigned duel" : "no XP (only the first 3 duels each day earn XP)"}
          </p>
        </div>
      </div>

      <div className="ml-panel ml-chart-panel">
        <div className="ml-chart-tools">
          <ChartViewControls view={view} liveLabel="Back to the end" />
          <DuelLegend bot={bot} />
        </div>
        <Chart
          title={<ChartTitle symbol="LABX" meta={`/ vUSD · 1H · ${you.candles} duel candles`} />}
          candles={candles}
          visibleTo={candles.length - 1}
          height={300}
          label="Duel chart with both players' trades. Scroll to zoom, drag to look back."
          markers={onCandles([...markersFrom(youRun.events, end), ...markersFrom(botRun.events, end, true)])}
          zone={{ from: DUEL_START + 1, to: DUEL_START + DUEL_CANDLES, label: "Duel" }}
          minBarWidth={view.zoom}
          viewEnd={view.viewEnd ?? undefined}
          onZoom={view.zoomBy}
          onPan={view.pan}
        />
      </div>

      <VsPanel ctx={ctx} bot={bot} you={youRun.state} rival={botRun.state} />

      <div className="ml-grid ml-grid--2">
        <Card title="Key moments">
          <div className="ml-stack-4">
            <div>
              <h3 className="ml-h4">You</h3>
              {misses(you).length ? (
                <ul className="ml-list ml-list--dash">
                  {misses(you).map((c) => (
                    <li key={c.id}>{c.detail}</li>
                  ))}
                </ul>
              ) : (
                <p className="ml-muted">{you.trades ? "Nothing in your process lost serious points." : "You didn't take a trade."}</p>
              )}
            </div>
            <div>
              <h3 className="ml-h4">{bot.name}</h3>
              {misses(botSide).length ? (
                <ul className="ml-list ml-list--dash">
                  {misses(botSide).map((c) => (
                    <li key={c.id}>{c.detail.replace(/\bYou\b/g, bot.name).replace(/\byou\b/g, bot.name).replace(/\byour\b/gi, "its")}</li>
                  ))}
                </ul>
              ) : (
                <p className="ml-muted">{botSide.trades ? `${bot.name}'s process held up.` : `${bot.name} didn't take a trade.`}</p>
              )}
            </div>
            {r.you.errorTags.length > 0 && (
              <ul className="ml-patterns">
                {r.you.errorTags.map((t) => (
                  <li key={t}>
                    <b>{ERROR_TAGS[t]?.label ?? t}</b>
                    <span className="ml-muted">{ERROR_TAGS[t]?.tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
        <Card title={`${bot.name}'s moves`}>
          {duel.botNotes.length === 0 ? (
            <p className="ml-muted">{bot.name} didn't do anything in this duel.</p>
          ) : (
            <ol className="ml-duel-notes">
              {duel.botNotes.map((n) => (
                <li key={n.step}>
                  <span className="ml-duel-notes-round num">{noteLabel(n)}</span>
                  <span>{n.text}</span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <section className="ml-section">
        <div className="ml-section-head">
          <h2>How the duel score was built</h2>
        </div>
        <div className="ml-table-wrap">
          <table className="ml-table ml-table--compact ml-duel-criteria">
            <thead>
              <tr>
                <th scope="col">Criterion</th>
                <th scope="col" className="num">
                  Weight
                </th>
                <th scope="col" className="num">
                  You
                </th>
                <th scope="col" className="num">
                  {bot.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {DUEL_RUBRIC.map((c) => (
                <tr key={c.id}>
                  <th scope="row">{c.label}</th>
                  <td className="num">{c.weight}</td>
                  <td className="num">{pctScore(you.dqs.criteria.find((x) => x.id === c.id))}</td>
                  <td className="num">{pctScore(botSide.dqs.criteria.find((x) => x.id === c.id))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ml-fine num">
          You: {formula(you)}. {bot.name}: {formula(botSide)}. Criteria that don't apply (n/a) don't count. With a stop, the engine caps the risk at {DUEL_RISK_PCT}%; without one, R uses {DUEL_RISK_PCT}% of the starting account as its unit.
        </p>
      </section>

      <div className="ml-actions">
        <Button variant="primary" iconLeft="replay" onClick={() => rematch(duel.botId)}>
          Rematch {bot.name}
        </Button>
        {nextBot.id !== duel.botId && (
          <Button variant="secondary" iconRight="arrow-right" onClick={() => rematch(nextBot.id)}>
            Next: {nextBot.name}
          </Button>
        )}
        {mission && (
          <Button variant="secondary" onClick={() => navigate(`/mission/${mission.id}`)}>
            Practise it: {mission.title}
          </Button>
        )}
        <Button variant="tertiary" onClick={() => navigate("/arena/duels")}>
          Back to Duels
        </Button>
      </div>
    </article>
  );
}
