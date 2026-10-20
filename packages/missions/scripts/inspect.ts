/**
 * Content author tool: plays every alternative of every mission variant and prints the facts,
 * scores and outcomes, so you can check that a scenario teaches what it's meant to.
 * Run with: npm run content:inspect [missionId]
 */
import { formatPrice, formatSigned } from "@market-lab/engine";
import { MISSIONS, outcomeOf, runMission, runScript, scoreRun } from "../src";

const only = process.argv[2];

for (const m of MISSIONS) {
  if (only && m.id !== only) continue;
  console.log(`\n━━ ${m.id} ${m.title}`);
  m.variants.forEach((v, vi) => {
    const first = runMission(m, vi, []);
    const facts = Object.entries(first.current?.facts ?? {})
      .map(([k, x]) => `${k}=${typeof x === "number" && Math.abs(x) > 1000 ? formatPrice(x) : x}`)
      .join(" ");
    console.log(`  [${v.key}] ${v.label}`);
    console.log(`      start facts: ${facts}`);
    for (const alt of m.alternatives) {
      const run = runScript(m, vi, alt.answers);
      const o = outcomeOf(run);
      const dqs = run.phase === "concluded" ? scoreRun(run).dqs : null;
      const path = run.visited.map((x) => `${x.def.id}@${x.step}:${x.answer?.optionId ?? "·"}`).join(" → ");
      console.log(
        `      ${alt.id.padEnd(16)} dqs=${String(dqs).padStart(3)}  net=${formatSigned(o.net).padStart(10)}  ${run.error ? `ERROR ${run.error}` : path}`,
      );
    }
  });
}
