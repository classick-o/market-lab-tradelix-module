import { describe, expect, it } from "vitest";
import { apply, createContext, equityOf, replay, type LogEntry } from "@market-lab/engine";
import {
  ARENA_SCENARIOS,
  BOTS,
  DUEL_CANDLES,
  DUEL_END,
  DUEL_START,
  FORESIGHT_CHANCE,
  PLAYABLE_FLAWS,
  TICKS_PER_CANDLE,
  botTurn,
  candleAt,
  candleCloseStep,
  closeDuelLog,
  dailyDuel,
  duelChartCandles,
  duelForesight,
  duelLadder,
  duelMarket,
  duelScore,
  duelVerdict,
  eloUpdate,
  evaluateDuelSide,
  getBot,
  mirrorPersona,
  mostFrequentFlaw,
  outcomeScore,
  playBot,
  type BotPersona,
  type DuelMarket,
  type DuelSide,
} from "../src";

const SEEDS = [1000, 8919, 16838];
/** The sampling tests play a few hundred duels. */
const SLOW = 60_000;

const samples = new Map<string, DuelSide[]>();
/** A bot on every scenario and seed, played alone, with its scored side (cached across tests). */
function sample(p: BotPersona, foresight = false, seeds = SEEDS): DuelSide[] {
  const key = `${p.id}:${p.flaws.join(",")}:${foresight}:${seeds.join(",")}`;
  if (!samples.has(key)) {
    const out: DuelSide[] = [];
    for (const s of ARENA_SCENARIOS)
      for (const seed of seeds) {
        const m = duelMarket(s.id, seed);
        out.push(evaluateDuelSide(m, closeDuelLog(playBot(m, p, seed, foresight).log)));
      }
    samples.set(key, out);
  }
  return samples.get(key)!;
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const avgScore = (sides: DuelSide[]) => mean(sides.map((s) => s.score ?? 0));
const tagShare = (sides: DuelSide[], tag: string) => sides.filter((s) => s.dqs.errorTags.includes(tag)).length / sides.length;

/** The same market with every tick after `step` changed (and the candles after it). */
function shiftedFuture(m: DuelMarket, step: number): DuelMarket {
  const bump = (c: { o: number; h: number; l: number; c: number }) => ({ o: Math.round(c.o * 1.3), h: Math.round(c.h * 1.4), l: Math.round(c.l * 1.2), c: Math.round(c.c * 1.3) });
  const ticks = m.ctx.candles.map((c, i) => (i <= step ? c : { ...c, ...bump(c) }));
  const last = candleAt(step);
  return { ...m, ctx: createContext(m.ctx.cfg, ticks), candles: m.candles.map((c, i) => (i <= last ? c : { ...c, ...bump(c) })) };
}

describe("the duel market", () => {
  it("is the same for both players, with a longer history before the start", () => {
    const a = duelMarket("breakout", 77);
    const b = duelMarket("breakout", 77);
    expect(a.ctx.candles).toEqual(b.ctx.candles);
    expect(DUEL_START).toBeGreaterThanOrEqual(100);
    expect(a.candles).toHaveLength(DUEL_START + 1 + DUEL_CANDLES);
    expect(a.ctx.candles).toHaveLength(DUEL_START + 1 + DUEL_CANDLES * TICKS_PER_CANDLE);
    expect(DUEL_END).toBe(DUEL_START + DUEL_CANDLES * TICKS_PER_CANDLE);
  });

  it("builds every duel candle from its ticks: same open, high, low and close", () => {
    for (const regime of ["bullish", "high_volatility", "event_shock"] as const) {
      const m = duelMarket(regime, 4242);
      for (let i = DUEL_START + 1; i < m.candles.length; i++) {
        const ticks = m.ctx.candles.slice(candleCloseStep(i - 1) + 1, candleCloseStep(i) + 1);
        const c = m.candles[i];
        expect(ticks).toHaveLength(TICKS_PER_CANDLE);
        expect(ticks[0].o).toBe(c.o);
        expect(ticks[ticks.length - 1].c).toBe(c.c);
        expect(Math.max(...ticks.map((t) => t.h))).toBe(c.h);
        expect(Math.min(...ticks.map((t) => t.l))).toBe(c.l);
      }
    }
  });

  it("shows the forming candle on the chart, tick by tick", () => {
    const m = duelMarket("sideways", 5);
    const step = DUEL_START + 25;
    const chart = duelChartCandles(m, step);
    const forming = chart[chart.length - 1];
    expect(chart).toHaveLength(DUEL_START + 2);
    expect(forming.o).toBe(m.candles[DUEL_START + 1].o);
    expect(forming.c).toBe(m.ctx.candles[step].c);
    expect(duelChartCandles(m, candleCloseStep(DUEL_START + 3))).toEqual(m.candles.slice(0, DUEL_START + 4));
  });

  it("fills a market order at the live price, inside the candle", () => {
    const m = duelMarket("bullish", 9);
    const step = DUEL_START + 37;
    const close = m.ctx.candles[step].c;
    const log: LogEntry[] = [{ kind: "action", step, action: { type: "submit_order", side: "buy", orderType: "market", qty: 5, stopLoss: Math.round(close * 0.98) } }];
    const fill = replay(m.ctx, DUEL_START, log).events.find((e) => e.type === "order_filled");
    expect(fill && fill.type === "order_filled" && fill.price).toBe(close + m.ctx.cfg.costs.halfSpread);
  });

  it("rejects an order without a stop and an order over the 1% risk limit", () => {
    const m = duelMarket("bullish", 5);
    const { state } = replay(m.ctx, DUEL_START, []);
    const close = m.ctx.candles[DUEL_START].c;
    const qty = Math.floor((0.5 * equityOf(m.ctx, state)) / close);
    expect(apply(m.ctx, state, { type: "submit_order", side: "buy", orderType: "market", qty: 1 }).rejected?.code).toBe("STOP_REQUIRED");
    // Half the account with a stop 10% away risks about 5%.
    expect(apply(m.ctx, state, { type: "submit_order", side: "buy", orderType: "market", qty, stopLoss: Math.round(close * 0.9) }).rejected?.code).toBe("RISK_LIMIT_EXCEEDED");
  });
});

describe("bots", () => {
  it("are deterministic", () => {
    const m = duelMarket("sideways", 4242);
    for (const b of BOTS) expect(playBot(m, b, 4242)).toEqual(playBot(m, b, 4242));
  }, SLOW);

  it("without foresight, never see the future: changing the coming ticks doesn't change a decision", () => {
    for (const b of [...BOTS, mirrorPersona("moved_stop_away")])
      for (const regime of ["bullish", "sideways", "false_breakout"] as const)
        for (const seed of SEEDS.slice(0, 2)) {
          const m = duelMarket(regime, seed);
          const { log } = playBot(m, b, seed);
          for (let candle = 0; candle < DUEL_CANDLES; candle += 9) {
            const step = candleCloseStep(DUEL_START + candle);
            const before = log.filter((e) => e.kind === "action" && e.step < step);
            const a = botTurn(m, b, before, candle, seed);
            const z = botTurn(shiftedFuture(m, step), b, before, candle, seed);
            expect({ entries: z.entries, note: z.note }).toEqual({ entries: a.entries, note: a.note });
          }
        }
  }, SLOW);

  it("with foresight, use the coming ticks, and score much higher", () => {
    let changed = 0;
    for (const seed of SEEDS) {
      const m = duelMarket("bullish", seed);
      const { log } = playBot(m, getBot("rook"), seed, true);
      for (let candle = 0; candle < DUEL_CANDLES; candle += 5) {
        const step = candleCloseStep(DUEL_START + candle);
        const before = log.filter((e) => e.kind === "action" && e.step < step);
        const seen = botTurn(m, getBot("rook"), before, candle, seed, true).entries;
        if (JSON.stringify(botTurn(shiftedFuture(m, step), getBot("rook"), before, candle, seed, true).entries) !== JSON.stringify(seen)) changed++;
      }
    }
    expect(changed).toBeGreaterThan(0);
    for (const id of ["grudge", "hope", "rook", "sage"]) {
      const b = getBot(id);
      expect(avgScore(sample(b, true)), id).toBeGreaterThan(avgScore(sample(b)) + 5);
    }
  }, SLOW);

  it("get foresight in some duels, more often at higher levels, the same way every time", () => {
    for (const b of BOTS) {
      const share = Array.from({ length: 2000 }, (_, k) => duelForesight(k * 7 + 1, b)).filter(Boolean).length / 2000;
      expect(Math.abs(share - FORESIGHT_CHANCE[b.level]), b.id).toBeLessThan(0.04);
      expect(duelForesight(123, b)).toBe(duelForesight(123, b));
    }
  });

  it("only place orders the engine accepts", () => {
    for (const b of [...BOTS, ...PLAYABLE_FLAWS.map((f) => mirrorPersona(f))])
      for (const s of ARENA_SCENARIOS) {
        const m = duelMarket(s.id, SEEDS[0]);
        expect(replay(m.ctx, DUEL_START, playBot(m, b, SEEDS[0], b.level >= 4).log).rejections, `${b.id} ${s.id}`).toEqual([]);
      }
  }, SLOW);

  it("get harder level by level, on average (without foresight)", () => {
    const byLevel = new Map<number, number[]>();
    for (const b of BOTS) byLevel.set(b.level, [...(byLevel.get(b.level) ?? []), ...sample(b).map((s) => s.score ?? 0)]);
    const levels = [...byLevel.keys()].sort();
    const avgs = levels.map((l) => mean(byLevel.get(l)!));
    for (let i = 1; i < avgs.length; i++) expect(avgs[i], `level ${levels[i]} vs ${levels[i - 1]}`).toBeGreaterThan(avgs[i - 1]);
  }, SLOW);

  it("play their habit often, and far more often than the disciplined bots", () => {
    const rook = sample(getBot("rook"));
    const sage = sample(getBot("sage"));
    const habits: [string, string][] = [
      ["pip", "stop_inside_noise"],
      ["dash", "overtrading"],
      ["blaze", "chased_entry"],
      ["grudge", "revenge_size_up"],
      ["hope", "moved_stop_away"],
    ];
    for (const [id, tag] of habits) {
      const share = tagShare(sample(getBot(id)), tag);
      expect(share, `${id} → ${tag}`).toBeGreaterThanOrEqual(0.35);
      expect(share, `${id} vs Rook`).toBeGreaterThan(3 * tagShare(rook, tag));
      expect(share, `${id} vs Sage`).toBeGreaterThan(3 * tagShare(sage, tag));
    }
  }, SLOW);

  it("Mirror plays the habit it is given", () => {
    for (const f of PLAYABLE_FLAWS) expect(tagShare(sample(mirrorPersona(f)), f), f).toBeGreaterThanOrEqual(0.35);
    expect(getBot("mirror", null).flaws).toEqual([]);
  }, SLOW);

  it("almost always trade at least once", () => {
    for (const b of BOTS) for (const foresight of [false, true]) expect(sample(b, foresight).filter((s) => s.score === null).length, `${b.id} ${foresight}`).toBeLessThanOrEqual(1);
  }, SLOW);
});

describe("duel scoring", () => {
  it("maps R to an outcome between 0 and 100 and weighs process at 70%", () => {
    expect(outcomeScore(0)).toBe(50);
    expect(outcomeScore(3)).toBe(100);
    expect(outcomeScore(-5)).toBe(0);
    expect(duelScore(80, 50)).toBe(71);
  });

  it("doesn't reward a bigger position: R stays the same when every order doubles", () => {
    const m = duelMarket("bullish", 9);
    const close = m.ctx.candles[DUEL_START].c;
    const stop = Math.round(close * 0.98);
    const target = Math.round(close * 1.04);
    const order = (qty: number): LogEntry[] => [{ kind: "action", step: DUEL_START, action: { type: "submit_order", side: "buy", orderType: "market", qty, stopLoss: stop, takeProfit: target } }];
    // 0.3% of the account at risk, then 0.6%: both within the limit.
    const qty = Math.floor((0.003 * m.ctx.cfg.initialEquity) / (close - stop));
    const small = evaluateDuelSide(m, closeDuelLog(order(qty)));
    const double = evaluateDuelSide(m, closeDuelLog(order(2 * qty)));
    expect(small.trades).toBe(1);
    expect(small.candles).toBe(DUEL_CANDLES);
    expect(double.net).not.toBe(small.net);
    expect(Math.abs(double.r - small.r)).toBeLessThan(0.02);
  });

  it("a player without a trade loses; two without trades draw", () => {
    const m = duelMarket("sideways", 3);
    const none = evaluateDuelSide(m, closeDuelLog([]));
    const bot = evaluateDuelSide(m, closeDuelLog(playBot(m, getBot("rook"), 3).log));
    expect(none.score).toBeNull();
    expect(duelVerdict(none, bot)).toEqual({ winner: bot.score === null ? "draw" : "bot", reason: "no_trade" });
    expect(duelVerdict(none, none)).toEqual({ winner: "draw", reason: "no_trade" });
  });

  it("scores a resigned duel where it stopped", () => {
    const m = duelMarket("bullish", 11);
    const at = candleCloseStep(DUEL_START + 20) + 7;
    expect(evaluateDuelSide(m, closeDuelLog([], at)).candles).toBe(21);
  });

  it("breaks ties on risk discipline, then on R", () => {
    const side = (score: number, rds: number, r: number) => ({ score, rds, r }) as DuelSide;
    expect(duelVerdict(side(70, 80, 0), side(69, 100, 2))).toEqual({ winner: "you", reason: "score" });
    expect(duelVerdict(side(70, 80, 2), side(70, 100, 0))).toEqual({ winner: "bot", reason: "discipline" });
    expect(duelVerdict(side(70, 100, 1), side(70, 100, -1))).toEqual({ winner: "you", reason: "outcome" });
    expect(duelVerdict(side(70, 100, 1), side(70, 100, 1))).toEqual({ winner: "draw", reason: "draw" });
  });

  it("updates the rating with Elo (K = 32)", () => {
    expect(eloUpdate(1000, 1000, 1)).toBe(1016);
    expect(eloUpdate(1000, 1000, 0)).toBe(984);
    expect(eloUpdate(1000, 1000, 0.5)).toBe(1000);
    expect(eloUpdate(1000, 1400, 1)).toBe(1029);
    expect(eloUpdate(110, 1550, 0)).toBe(110);
    expect(eloUpdate(100, 1550, 0)).toBe(100);
  });
});

describe("daily duel, Mirror and ladder", () => {
  it("daily duel is the same for everyone on a day and changes the next day", () => {
    expect(dailyDuel("2026-10-23")).toEqual(dailyDuel("2026-10-23"));
    expect(dailyDuel("2026-10-24").botId).not.toBe(dailyDuel("2026-10-23").botId);
    const free = ARENA_SCENARIOS.filter((s) => s.tier === "free").map((s) => s.id);
    for (let d = 1; d <= 28; d++) expect(free).toContain(dailyDuel(`2026-11-${String(d).padStart(2, "0")}`).regime);
  });

  it("Mirror copies the player's most frequent playable habit", () => {
    expect(mostFrequentFlaw([["no_stop", "overtrading"], ["overtrading", "overtrading"], ["moved_stop_away"]])).toBe("overtrading");
    expect(mostFrequentFlaw([["no_stop"], ["risk_over_limit"]])).toBeNull();
    expect(mostFrequentFlaw([])).toBeNull();
  });

  it("ladder: record, beaten, rival and recommended", () => {
    const l = duelLadder(
      [
        { botId: "pip", winner: "you", at: 1 },
        { botId: "pip", winner: "you", at: 2 },
        { botId: "dash", winner: "bot", at: 3 },
        { botId: "dash", winner: "bot", at: 4 },
        { botId: "rook", winner: "draw", at: 5 },
      ],
      1000,
    );
    expect(l.record.pip).toEqual({ won: 2, lost: 0, drawn: 0 });
    expect(l.beaten).toEqual(["pip"]);
    expect(l.rival).toBe("dash");
    expect(l.recommended).toBe("dash");
    expect(duelLadder([], 1400).recommended).toBe("rook");
  });
});
