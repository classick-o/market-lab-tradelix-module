import { replay } from "@market-lab/engine";
import { ARENA_SCENARIOS, BOTS, DUEL_START, PLAYABLE_FLAWS, closeDuelLog, duelContext, evaluateDuelSide, mirrorPersona, playBot } from "../src/index";

/** Plays every bot (and Mirror with each habit) on many seeds of every scenario: average scores, trades and error tags. */
const seeds = Number(process.argv[2] ?? 20);
const personas = [...BOTS, ...PLAYABLE_FLAWS.map((f) => ({ ...mirrorPersona(f), name: `Mirror (${f})` }))];
for (const p of personas) {
  let n = 0;
  let score = 0;
  let process = 0;
  let r = 0;
  let trades = 0;
  let noTrade = 0;
  let rejected = 0;
  const tags = new Map<string, number>();
  for (const s of ARENA_SCENARIOS) {
    for (let k = 0; k < seeds; k++) {
      const seed = 1000 + k * 7919;
      const { ctx } = duelContext(s.id, seed);
      const { log } = playBot(ctx, p, seed);
      rejected += replay(ctx, DUEL_START, log).rejections.length;
      const side = evaluateDuelSide(ctx, closeDuelLog(log));
      n++;
      if (side.score === null) noTrade++;
      score += side.score ?? 0;
      process += side.process ?? 0;
      r += side.r;
      trades += side.trades;
      for (const t of side.dqs.errorTags) tags.set(t, (tags.get(t) ?? 0) + 1);
    }
  }
  const pct = (x: number) => `${Math.round((x / n) * 100)}%`;
  console.log(
    `${p.name.padEnd(28)} L${p.level} rating ${p.rating} · score ${(score / n).toFixed(1)} · process ${(process / n).toFixed(1)} · R ${(r / n).toFixed(2)} · trades ${(trades / n).toFixed(1)} · no trade ${pct(noTrade)} · rejected ${rejected} · ${[...tags].map(([t, c]) => `${t} ${pct(c)}`).join(", ")}`,
  );
}
