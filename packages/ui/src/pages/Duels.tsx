import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { dayKey } from "@market-lab/academy";
import { apply, formatPrice, parsePrice, previewOrder, replay, type Action, type LogEntry } from "@market-lab/engine";
import { ERROR_TAGS, type CriterionResult } from "@market-lab/evaluation";
import {
  ARENA_SCENARIOS,
  BOTS,
  DUEL_END,
  DUEL_PROCESS_WEIGHT,
  DUEL_ROUNDS,
  DUEL_RUBRIC,
  DUEL_RISK_PCT,
  DUEL_START,
  FLAW_LABEL,
  MISSIONS,
  closeDuelLog,
  dailyDuel,
  duelContext,
  duelLadder,
  evaluateDuelSide,
  getArenaScenario,
  getBot,
  mirrorPersona,
  roundStep,
  type BotId,
  type BotPersona,
  type DuelSide,
} from "@market-lab/missions";
import type { ArenaRegime } from "@market-lab/scenario-gen";
import { Chart } from "../components/Chart";
import { BotAvatar, BotTag, DuelLegend, VsPanel, formatR } from "../components/DuelParts";
import { OrderTicket, initialTicket, parseTicket, type TicketValue } from "../components/OrderTicket";
import { Card, PageHead, Pnl, SubNav } from "../components/Page";
import { ChartTitle, StageBar, useChartHeight, useMediaQuery, useReducedMotion } from "../components/Stage";
import { smaSeries } from "../components/series";
import { useToast } from "../components/Toast";
import { Button, Checkbox, Chips, Dialog, Empty, Icon, InlineError, KeyValues, Segmented, Tabs, Tag, TextField, cx } from "../components/ui";
import { draftLines, linesFromState, markersFrom, rivalLinesFromState } from "../components/visuals";
import { DIFFICULTY_LABEL, plural, relativeTime } from "../format";
import { usePlan } from "../host";
import { Link, useRouter } from "../router";
import { useLab, useStore, type DuelSession } from "../store";

type Timer = 0 | 30 | 60;

const TIMERS: { value: "30" | "60" | "0"; label: string }[] = [
  { value: "30", label: "30 s" },
  { value: "60", label: "60 s" },
  { value: "0", label: "Off" },
];

/** The duel's bot, with Mirror's habit as it was fixed when the duel started. */
function botOf(d: DuelSession): BotPersona {
  return getBot(d.botId, d.mirrorFlaw);
}

/** A finished duel's log: played to the end and closed, or (resigned) closed where it stopped. */
function finalLog(d: DuelSession, log: readonly LogEntry[]): LogEntry[] {
  return d.status === "resigned" ? [...log, { kind: "advance", to: roundStep(d.round) }, { kind: "finish" }] : closeDuelLog(log);
}

function resultLabel(d: DuelSession): string {
  const w = d.result?.winner;
  return w === "you" ? "Won" : w === "bot" ? (d.result?.reason === "resigned" ? "Resigned" : "Lost") : "Draw";
}

// ─── Lobby ──────────────────────────────────────────────────────────────────

export function DuelsPage() {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const { pro } = usePlan();
  const active = store.activeDuel();
  const [regime, setRegime] = useState<ArenaRegime>("bullish");
  const [timer, setTimer] = useState<Timer>(30);
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
    const id = opts.daily
      ? store.startDuel(daily.botId, daily.regime, { timer, daily: today, seed: daily.seed })
      : store.startDuel(botId, regime, { timer });
    navigate(`/arena/duels/${id}`);
  };
  const pickScenario = (id: string) => {
    const s = getArenaScenario(id);
    if (s.tier === "pro" && !pro) return navigate("/pricing");
    setRegime(s.id);
  };

  const bots: BotPersona[] = [...BOTS, mirrorPersona(habit)];

  return (
    <div className="ml-page ml-duels">
      <PageHead
        title="Duels"
        sub="Trade the same simulated market as a bot, round by round. The better process wins, not the bigger profit. Every opponent here is a bot, and labelled as one."
      />
      <SubNav module="arena" />

      {active && (
        <Card className="ml-duel-active" eyebrow="Duel in progress" title={`vs ${botOf(active).name} · ${getArenaScenario(active.regime).title}`}>
          <p className="ml-muted num">
            Round {Math.min(active.round + 1, DUEL_ROUNDS)} of {DUEL_ROUNDS}
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
            <li>8 rounds of 10 candles. Place your orders, press Ready, then both accounts play the round.</li>
            <li>A stop on every order, at most {DUEL_RISK_PCT}% risk. The engine enforces both.</li>
            <li>
              Duel score = {Math.round(DUEL_PROCESS_WEIGHT * 100)}% decision quality + {Math.round((1 - DUEL_PROCESS_WEIGHT) * 100)}% result in R. No trade, no win.
            </li>
          </ul>
        </Card>
      </div>

      <Card title="Duel settings" eyebrow="For the next duel you start">
        <div className="ml-duel-settings">
          <Chips
            single
            label="Market"
            options={ARENA_SCENARIOS.map((s) => ({ id: s.id, label: s.tier === "pro" && !pro ? `${s.title} (Pro)` : s.title }))}
            selected={[regime]}
            onToggle={pickScenario}
          />
          <Segmented label="Time to decide each round" value={String(timer) as "30" | "60" | "0"} onChange={(v) => setTimer(Number(v) as Timer)} options={TIMERS} />
        </div>
        <p className="ml-fine">
          {getArenaScenario(regime).tagline} Bot duels don't use your Arena sessions. The round timer can be turned off.
        </p>
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
                    <dd className="num">{isMirror ? "Adaptive" : `${b.level} · ${DIFFICULTY_LABEL[b.level]}`}</dd>
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
  // A duel that ends while it's on screen keeps the live view until its last round has played out.
  const [live, setLive] = useState(d?.status === "active");
  if (!d) return <Empty title="Duel not found" action={<Link to="/arena/duels" className="ml-text-link">Back to Duels</Link>} />;
  if (live || d.status === "active") return <DuelLive key={d.id} duel={d} onDone={() => setLive(false)} />;
  return <DuelResult duel={d} />;
}

function RoundStrip({ round, phase, left, timer }: { round: number; phase: "decide" | "play" | "over"; left: number; timer: Timer }) {
  const shown = phase === "decide" ? round : round - 1;
  return (
    <div className="ml-roundbar">
      <ol className="ml-rounds" aria-label={`Round ${Math.min(shown + 1, DUEL_ROUNDS)} of ${DUEL_ROUNDS}`}>
        {Array.from({ length: DUEL_ROUNDS }, (_, i) => (
          <li key={i} className={cx("ml-rounds-seg", i < shown && "is-done", i === shown && phase !== "over" && "is-now", phase === "over" && "is-done")} />
        ))}
      </ol>
      <span className="ml-roundbar-label num">
        {phase === "over" ? "Duel over" : phase === "play" ? `Round ${shown + 1} of ${DUEL_ROUNDS} · playing` : `Round ${shown + 1} of ${DUEL_ROUNDS} · your move`}
      </span>
      {phase === "decide" && timer > 0 && (
        <span className={cx("ml-timer num", left <= 10 && "is-low")} role="timer" aria-label={`${left} seconds left to decide`}>
          <Icon name="clock" size={14} />
          0:{String(left).padStart(2, "0")}
        </span>
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
  const { ctx, scenario } = useMemo(() => duelContext(duel.regime, duel.seed), [duel.regime, duel.seed]);
  const bot = botOf(duel);
  const chart = lab.settings.chart;
  const speed = lab.settings.speed;

  const [log, setLog] = useState<LogEntry[]>(duel.log);
  const target = roundStep(duel.round);
  const [cursor, setCursor] = useState(target);
  const over = duel.status !== "active" && cursor >= target;
  const phase: "decide" | "play" | "over" = cursor < target ? "play" : over ? "over" : "decide";
  const [tab, setTab] = useState<"order" | "position" | "bot">("order");
  const [ticket, setTicket] = useState<TicketValue>(() => initialTicket("buy", { riskPct: DUEL_RISK_PCT }));
  const [error, setError] = useState<string | null>(null);
  const [slText, setSlText] = useState("");
  const [tpText, setTpText] = useState("");
  const [resigning, setResigning] = useState(false);
  const [left, setLeft] = useState<number>(duel.timer);
  const committed = useRef(-1);

  // Both accounts at the cursor. The bot's actions for the current round don't exist until the player is ready.
  const you = useMemo(() => replay(ctx, DUEL_START, phase === "over" ? closeDuelLog(log) : [...log, { kind: "advance", to: cursor }]), [ctx, log, cursor, phase]);
  const them = useMemo(() => replay(ctx, DUEL_START, phase === "over" ? closeDuelLog(duel.botLog) : [...duel.botLog, { kind: "advance", to: cursor }]), [ctx, duel.botLog, cursor, phase]);
  const pos = you.state.position;

  useEffect(() => {
    setSlText(pos?.stopLoss != null ? (pos.stopLoss / 100).toFixed(2) : "");
    setTpText(pos?.takeProfit != null ? (pos.takeProfit / 100).toFixed(2) : "");
  }, [pos?.tradeId, pos?.stopLoss, pos?.takeProfit]);

  // Playback: candle by candle up to the next decision (instantly with reduced motion).
  useEffect(() => {
    if (cursor >= target) return;
    if (reduced) {
      setCursor(target);
      return;
    }
    const t = window.setTimeout(() => setCursor((c) => Math.min(target, c + 1)), 1000 / speed);
    return () => window.clearTimeout(t);
  }, [cursor, target, speed, reduced]);

  const commit = () => {
    if (phase !== "decide" || committed.current === duel.round) return;
    committed.current = duel.round;
    // Reset now, so the next decision window doesn't open with the expired timer and end at once.
    setLeft(duel.timer);
    setError(null);
    store.playDuelRound(duel.id, log);
    setTicket(initialTicket(ticket.side, { riskPct: Number(ticket.riskPct) || DUEL_RISK_PCT }));
  };

  const commitRef = useRef(commit);
  commitRef.current = commit;
  useEffect(() => {
    if (phase !== "decide" || !duel.timer || resigning) return;
    if (left <= 0) {
      commitRef.current();
      return;
    }
    const t = window.setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left, phase, resigning, duel.timer]);

  const act = (action: Action, message: string): boolean => {
    if (phase !== "decide") return false;
    const r = apply(ctx, you.state, action);
    if (r.rejected) {
      setError(r.rejected.message);
      return false;
    }
    setError(null);
    const next = [...log, { kind: "action" as const, step: cursor, action }];
    setLog(next);
    store.saveDuelLog(duel.id, next);
    toast(message);
    return true;
  };

  const placeOrder = () => {
    const { order, problem } = parseTicket(ticket);
    if (!order) return setError(problem);
    // The ticket already shows why the engine would refuse the order (no stop, over 1%, buying power).
    if (!previewOrder(ctx, you.state, { type: "submit_order", ...order }).ok) return setError(null);
    if (act({ type: "submit_order", ...order }, "Order placed")) setTicket(initialTicket(ticket.side, { riskPct: Number(ticket.riskPct) || DUEL_RISK_PCT }));
  };

  const updateBrackets = () => {
    const sl = parsePrice(slText);
    const tp = tpText.trim() === "" ? null : parsePrice(tpText);
    if (sl === null) return setError("A duel position always keeps a stop-loss. Enter a valid price.");
    if (tpText.trim() && tp === null) return setError("Enter a valid price for the target.");
    act({ type: "modify_brackets", stopLoss: sl, takeProfit: tp }, "Stop and target updated");
  };

  const roundNotes = [...duel.botNotes].reverse();
  const latest = duel.botNotes[duel.botNotes.length - 1];
  const shownRound = phase === "decide" ? duel.round : duel.round - 1;

  const overlays = [
    ...(chart.sma20 ? [{ id: "sma20", label: "SMA 20", values: smaSeries(ctx.candles, 20, cursor), tone: 1 as const }] : []),
    ...(chart.sma50 ? [{ id: "sma50", label: "SMA 50", values: smaSeries(ctx.candles, 50, cursor), tone: 2 as const }] : []),
  ];
  const rounds = Array.from({ length: DUEL_ROUNDS }, (_, i) => ({ step: roundStep(i), label: String(i + 1) })).filter((r) => r.step <= cursor);

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
        {phase !== "over" && (
          <Button size="sm" variant="secondary" onClick={() => setResigning(true)}>
            Resign
          </Button>
        )}
      </StageBar>

      <RoundStrip round={duel.round} phase={phase} left={left} timer={duel.timer} />
      <p className="ml-sr" aria-live="polite">
        {phase === "decide" && duel.timer > 0 && left === 10 ? "10 seconds left to decide." : ""}
      </p>

      <div className="ml-stage-grid">
        <section className="ml-stage-main" aria-label="Market">
          {phase !== "decide" && latest && (
            <p className="ml-bot-note" aria-live="polite">
              <BotAvatar bot={bot} size={22} />
              <span>
                <b>
                  {bot.name}, round {latest.round + 1}:
                </b>{" "}
                {latest.text}
              </span>
            </p>
          )}
          <div className="ml-panel ml-chart-panel">
            <div className="ml-chart-tools">
              <DuelLegend bot={bot} />
              <div className="ml-row ml-chart-toggles" role="group" aria-label="Indicators">
                <Checkbox checked={chart.sma20} onChange={(v) => store.setChart({ sma20: v })} label={<span className="ml-ind ml-ind--1">SMA 20</span>} />
                <Checkbox checked={chart.sma50} onChange={(v) => store.setChart({ sma50: v })} label={<span className="ml-ind ml-ind--2">SMA 50</span>} />
                <Checkbox checked={chart.volume} onChange={(v) => store.setChart({ volume: v })} label="Volume" />
              </div>
            </div>
            <Chart
              title={<ChartTitle symbol="LABX" meta={`/ vUSD · 1H · candle ${cursor - DUEL_START} of ${DUEL_END - DUEL_START}`} />}
              candles={ctx.candles}
              visibleTo={cursor}
              {...(phone ? { futureSlots: phase === "over" ? 0 : 10, minBarWidth: 5 } : { fixedEnd: DUEL_END, windowStart: DUEL_START - 40 })}
              height={chartHeight}
              label="Duel price chart"
              lines={phase === "over" ? [] : [...linesFromState(you.state), ...rivalLinesFromState(them.state, bot.name), ...draftLines(phase === "decide" && tab === "order" ? ticket : null)]}
              markers={[...markersFrom(you.events, cursor), ...markersFrom(them.events, cursor, true)]}
              decisionSteps={rounds}
              overlays={overlays}
              showVolume={chart.volume}
              showGrid={chart.grid}
              tickMs={phase === "play" && !reduced ? 1000 / speed : undefined}
              animateNewest={phase === "play" && !reduced}
            />
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
                { value: "order", label: "Order" },
                { value: "position", label: "Position", count: pos ? 1 : you.state.orders.length || undefined },
                { value: "bot", label: bot.name, count: duel.botNotes.length || undefined },
              ]}
            />
          </div>

          {tab === "order" && (
            <div className="ml-dock-body">
              {phase === "decide" ? (
                <>
                  <p className="ml-objective-note">
                    <Icon name="target" size={15} />
                    <span>{scenario.objective}</span>
                  </p>
                  <OrderTicket ctx={ctx} state={you.state} value={ticket} onChange={setTicket} sides={scenario.allowShort ? ["buy", "sell"] : ["buy"]} orderTypes={scenario.orderTypes} riskLimitPct={DUEL_RISK_PCT} />
                  {error && <InlineError>{error}</InlineError>}
                  <Button variant="secondary" block iconLeft="plus" onClick={placeOrder}>
                    Place order
                  </Button>
                  <p className="ml-fine">Orders fill from the next candle (market orders at the current close). {bot.name} decides at the same time and you'll see its move when the round starts.</p>
                </>
              ) : (
                <p className="ml-muted">{phase === "play" ? "The round is playing. Stops, targets and limits fill on their own." : "The duel is over."}</p>
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
                  {phase === "decide" && (
                    <>
                      <div className="ml-grid-2">
                        <TextField label="Stop-loss" inputMode="decimal" value={slText} onChange={(e) => setSlText(e.target.value)} />
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
                        {phase === "decide" && (
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
              <h3 className="ml-h3">{bot.name}'s notes</h3>
              {roundNotes.length === 0 ? (
                <p className="ml-muted">{bot.name} decides when you press Ready. Its reasoning for each round appears here.</p>
              ) : (
                <ol className="ml-duel-notes">
                  {roundNotes.map((n) => (
                    <li key={n.round}>
                      <span className="ml-duel-notes-round num">Round {n.round + 1}</span>
                      <span>{n.text}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          <div className="ml-dock-foot">
            {phase === "decide" ? (
              <Button variant="primary" size="lg" block iconRight="arrow-right" onClick={commit}>
                Ready · play round {shownRound + 1}
              </Button>
            ) : phase === "play" ? (
              <Button variant="secondary" size="lg" block iconLeft="skip" onClick={() => setCursor(target)}>
                Skip to the end of the round
              </Button>
            ) : (
              <Button variant="primary" size="lg" block iconRight="arrow-right" onClick={onDone}>
                See the result
              </Button>
            )}
          </div>
        </aside>
      </div>

      {/* Below the chart and the dock: on a phone the order ticket comes right after the chart. */}
      <VsPanel ctx={ctx} bot={bot} you={you.state} rival={them.state} />

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
                store.resignDuel(duel.id, log);
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
  if (r.reason === "resigned") return "Resigning counts as a loss. The rounds you played are below.";
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
  const { ctx, scenario } = useMemo(() => duelContext(duel.regime, duel.seed), [duel.regime, duel.seed]);
  const bot = botOf(duel);
  const youLog = useMemo(() => finalLog(duel, duel.log), [duel]);
  const botLog = useMemo(() => finalLog(duel, duel.botLog), [duel]);
  const you = useMemo(() => evaluateDuelSide(ctx, youLog), [ctx, youLog]);
  const botSide = useMemo(() => evaluateDuelSide(ctx, botLog), [ctx, botLog]);
  const youRun = useMemo(() => replay(ctx, DUEL_START, youLog), [ctx, youLog]);
  const botRun = useMemo(() => replay(ctx, DUEL_START, botLog), [ctx, botLog]);
  const r = duel.result;
  if (!r) return <Empty title="This duel has no result yet" action={<Link to="/arena/duels" className="ml-text-link">Back to Duels</Link>} />;

  const end = youRun.state.step;
  const title = r.reason === "resigned" ? "You resigned" : r.winner === "you" ? "You won the duel" : r.winner === "bot" ? `${bot.name} won the duel` : "Draw";
  const diff = r.ratingAfter - r.ratingBefore;
  const mission = MISSIONS.find((m) => r.you.errorTags.some((t) => m.targets.includes(t)));
  const ladder = duelLadder(
    Object.values(lab.duels)
      .filter((d) => d.result)
      .map((d) => ({ botId: d.botId, winner: d.result!.winner, at: d.completedAt ?? d.updatedAt })),
    lab.duelRating,
  );
  const nextBot = getBot(ladder.recommended !== duel.botId ? ladder.recommended : (BOTS.find((b) => b.rating > bot.rating)?.id ?? "sage"));
  const rematch = (botId: BotId) => navigate(`/arena/duels/${store.startDuel(botId, duel.regime, { timer: duel.timer })}`);
  const rows: { label: string; you: ReactNode; bot: ReactNode; strong?: boolean }[] = [
    { label: "Decision quality", you: you.process ?? "—", bot: botSide.process ?? "—" },
    { label: "Risk discipline", you: you.rds ?? "—", bot: botSide.rds ?? "—" },
    { label: "Outcome (R)", you: formatR(you.r), bot: formatR(botSide.r) },
    { label: "Simulated P&L", you: <Pnl value={you.net} />, bot: <Pnl value={botSide.net} /> },
    { label: "Trades", you: you.trades, bot: botSide.trades },
    { label: "Duel score", you: you.score ?? "—", bot: botSide.score ?? "—", strong: true },
  ];
  const formula = (s: DuelSide) =>
    s.process === null ? "no trade" : `${DUEL_PROCESS_WEIGHT} × ${s.process} + ${(1 - DUEL_PROCESS_WEIGHT).toFixed(1)} × ${Math.round(s.outcome)} (${formatR(s.r)}) = ${s.score}`;
  const misses = (s: DuelSide) => s.dqs.criteria.filter((c) => c.applicable && c.score < 0.6);

  return (
    <article className="ml-page ml-report ml-duel-result">
      <PageHead
        back={{ to: "/arena/duels", label: "Duels" }}
        eyebrow={`Duel result · ${scenario.title}${duel.daily ? " · daily duel" : ""} · synthetic data, simulated orders`}
        title={title}
        sub={`You ${you.score ?? "—"} vs ${bot.name} ${botSide.score ?? "—"}`}
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
          <DuelLegend bot={bot} />
        </div>
        <Chart
          title={<ChartTitle symbol="LABX" meta={`/ vUSD · 1H · ${plural(Math.round((end - DUEL_START) / 10), "round")}`} />}
          candles={ctx.candles}
          visibleTo={end}
          height={300}
          label="Duel chart with both players' trades"
          markers={[...markersFrom(youRun.events, end), ...markersFrom(botRun.events, end, true)]}
          decisionSteps={Array.from({ length: DUEL_ROUNDS }, (_, i) => ({ step: roundStep(i), label: String(i + 1) })).filter((x) => x.step < end)}
          windowStart={Math.max(0, DUEL_START - 20)}
          minBarWidth={2}
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
        <Card title={`What ${bot.name} was thinking`}>
          {duel.botNotes.length === 0 ? (
            <p className="ml-muted">No rounds were played.</p>
          ) : (
            <ol className="ml-duel-notes">
              {duel.botNotes.map((n) => (
                <li key={n.round}>
                  <span className="ml-duel-notes-round num">Round {n.round + 1}</span>
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
          You: {formula(you)}. {bot.name}: {formula(botSide)}. Criteria that don't apply (n/a) don't count. Stops and the {DUEL_RISK_PCT}% limit are enforced by the engine, so they aren't scored.
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
