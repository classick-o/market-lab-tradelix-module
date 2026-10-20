import type { Candle } from "@market-lab/engine";
import raw from "../data/scenarios.json";

interface RawScenario {
  hash: string;
  bars: number;
  candles: number[][];
}

const scenarios = (raw as { version: number; scenarios: Record<string, RawScenario> }).scenarios;
const cache = new Map<string, Candle[]>();

export function scenarioKeys(): string[] {
  return Object.keys(scenarios);
}

export function getScenario(key: string): { candles: Candle[]; hash: string } {
  const s = scenarios[key];
  if (!s) throw new Error(`Unknown scenario "${key}". Run npm run content:generate.`);
  let candles = cache.get(key);
  if (!candles) {
    candles = s.candles.map(([o, h, l, c, v, p]) => ({ o, h, l, c, v, path: p === 1 ? "OLHC" : "OHLC" }));
    cache.set(key, candles);
  }
  return { candles, hash: s.hash };
}
