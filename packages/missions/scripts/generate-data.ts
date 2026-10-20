/**
 * Generates every mission dataset from its spec and writes data/scenarios.json.
 * Run with: npm run content:generate
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { hashValue } from "@market-lab/engine";
import { generateCandles } from "@market-lab/scenario-gen";
import { SCENARIO_SPECS } from "../src/specs";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../data/scenarios.json");

const scenarios: Record<string, { hash: string; bars: number; candles: number[][] }> = {};
for (const [key, spec] of Object.entries(SCENARIO_SPECS)) {
  const candles = generateCandles(spec);
  scenarios[key] = {
    hash: hashValue(candles),
    bars: candles.length,
    candles: candles.map((c) => [c.o, c.h, c.l, c.c, c.v, c.path === "OLHC" ? 1 : 0]),
  };
}

mkdirSync(dirname(out), { recursive: true });
const body = Object.entries(scenarios)
  .map(([k, s]) => `    ${JSON.stringify(k)}: {"hash":${JSON.stringify(s.hash)},"bars":${s.bars},"candles":${JSON.stringify(s.candles)}}`)
  .join(",\n");
writeFileSync(out, `{\n  "version": 1,\n  "scenarios": {\n${body}\n  }\n}\n`);
console.log(`Wrote ${Object.keys(scenarios).length} scenarios to ${out}`);
