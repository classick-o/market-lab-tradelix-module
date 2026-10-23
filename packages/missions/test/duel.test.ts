import { describe, expect, it } from "vitest";
import { apply, createContext, equityOf, replay, type LogEntry } from "@market-lab/engine";
import {
  ARENA_SCENARIOS,
  BOTS,
  DUEL_END,
  DUEL_ROUNDS,
  DUEL_START,
  PLAYABLE_FLAWS,
  botRound,
  closeDuelLog,
  dailyDuel,
  duelContext,
  duelLadder,
  duelScore,
  duelVerdict,
  eloUpdate,
  evaluateDuelSide,
  getBot,
  mirrorPersona,
  mostFrequentFlaw,
  outcomeScore,
  playBot,
  roundStep,
  type BotPersona,
  type DuelSide,
} from "../src";

const SEEDS = Array.from({ length: 12 }, (_, k) => 1000 + k * 7919);
/** The sampling tests play hundreds of duels. */
const SLOW = 30_000;

/** Every bot on every scenario and seed, played alone, with its scored side. */
function sample(p: BotPersona, seeds = SEEDS) {
  const out: DuelSide[] = [];
  for (const s of ARENA_SCENARIOS)
    for (const seed of seeds) {
      const { ctx } = duelContext(s.id, seed);
      out.push(evaluateDuelSide(ctx, closeDuelLog(playBot(ctx, p, seed).log)));
    }
  return out;
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const tagShare = (sides: DuelSide[], tag: string) => sides.filter((s) => s.dqs.errorTags.includes(tag)).length / sides.length;

describe("duel market and rules", () => {
  it("gives both players the same candles", () => {
    expect(duelContext("breakout", 77).ctx.candles).toEqual(duelContext("breakout", 77).ctx.candles);
    expect(DUEL_END).toBe(DUEL_START + DUEL_ROUNDS * 10);
    expect(roundStep(3)).toBe(DUEL_START + 30);
  });

  it("rejects an order without a stop and an order over the 1% risk limit", () => {
    const { ctx } = duelContext("bullish", 5);
    const { state } = replay(ctx, DUEL_START, []);
    const close = ctx.candles[DUEL_START].c;
    const qty = Math.floor((0.5 * equityOf(ctx, state)) / close);
    expect(apply(ctx, state, { type: "submit_order", side: "buy", orderType: "market", qty: 1 }).rejected?.code).toBe("STOP_REQUIRED");
    // Half the account with a stop 10% away risks about 5%.
    const big = apply(ctx, state, { type: "submit_order", side: "buy", orderType: "market", qty, stopLoss: Math.round(close * 0.9) });
    expect(big.rejected?.code).toBe("RISK_LIMIT_EXCEEDED");
  });
});

describe("bots", () => {
  it("are deterministic", () => {
    for (const b of BOTS) {
      const { ctx } = duelContext("sideways", 4242);
      expect(playBot(ctx, b, 4242)).toEqual(playBot(ctx, b, 4242));
    }
  });

  it("never see the future: changing the candles after a decision doesn't change it", () => {
    for (const b of [...BOTS, mirrorPersona("moved_stop_away")])
      for (const regime of ["bullish", "sideways", "false_breakout"] as const)
        for (const seed of SEEDS.slice(0, 4)) {
          const { ctx } = duelContext(regime, seed);
          const { log } = playBot(ctx, b, seed);
          for (let round = 0; round < DUEL_ROUNDS; round++) {
            const t = roundStep(round);
            const before = log.filter((e) => e.kind === "action" && e.step < t);
            const future = ctx.candles.map((c, i) => (i <= t ? c : { ...c, o: Math.round(c.o * 1.3), h: Math.round(c.h * 1.4), l: Math.round(c.l * 1.2), c: Math.round(c.c * 1.3) }));
            const shifted = createContext(ctx.cfg, future);
            expect(botRound(shifted, b, before, round, seed)).toEqual(botRound(ctx, b, before, round, seed));
          }
        }
  }, SLOW);

  it("only place orders the engine accepts", () => {
    for (const b of [...BOTS, ...PLAYABLE_FLAWS.map((f) => mirrorPersona(f))])
      for (const s of ARENA_SCENARIOS)
        for (const seed of SEEDS.slice(0, 5)) {
          const { ctx } = duelContext(s.id, seed);
          expect(replay(ctx, DUEL_START, playBot(ctx, b, seed).log).rejections).toEqual([]);
        }
  }, SLOW);

  it("get harder level by level, on average", () => {
    const byLevel = new Map<number, number[]>();
    for (const b of BOTS) {
      const scores = sample(b).map((s) => s.score ?? 0);
      byLevel.set(b.level, [...(byLevel.get(b.level) ?? []), ...scores]);
    }
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
    for (const f of PLAYABLE_FLAWS) expect(tagShare(sample(mirrorPersona(f), SEEDS.slice(0, 6)), f), f).toBeGreaterThanOrEqual(0.35);
    expect(getBot("mirror", null).flaws).toEqual([]);
  }, SLOW);

  it("almost always trade at least once", () => {
    for (const b of BOTS) expect(sample(b, SEEDS.slice(0, 6)).filter((s) => s.score === null).length, b.id).toBeLessThanOrEqual(2);
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
    const { ctx } = duelContext("bullish", 9);
    const close = ctx.candles[DUEL_START].c;
    const stop = Math.round(close * 0.98);
    const target = Math.round(close * 1.04);
    const order = (qty: number): LogEntry[] => [{ kind: "action", step: DUEL_START, action: { type: "submit_order", side: "buy", orderType: "market", qty, stopLoss: stop, takeProfit: target } }];
    // 0.3% of the account at risk, then 0.6%: both within the limit.
    const qty = Math.floor((0.003 * ctx.cfg.initialEquity) / (close - stop));
    const small = evaluateDuelSide(ctx, closeDuelLog(order(qty)));
    const double = evaluateDuelSide(ctx, closeDuelLog(order(2 * qty)));
    expect(small.trades).toBe(1);
    expect(double.net).not.toBe(small.net);
    expect(Math.abs(double.r - small.r)).toBeLessThan(0.02);
  });

  it("a player without a trade loses; two without trades draw", () => {
    const { ctx } = duelContext("sideways", 3);
    const none = evaluateDuelSide(ctx, closeDuelLog([]));
    const bot = evaluateDuelSide(ctx, closeDuelLog(playBot(ctx, getBot("rook"), 3).log));
    expect(none.score).toBeNull();
    expect(duelVerdict(none, bot)).toEqual({ winner: bot.score === null ? "draw" : "bot", reason: "no_trade" });
    expect(duelVerdict(none, none)).toEqual({ winner: "draw", reason: "no_trade" });
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
