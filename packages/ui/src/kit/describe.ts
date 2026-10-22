/** Screen-reader descriptions of Learn Chart Kit figures, generated from the same data that is drawn. */
import type { ChartLayer, ChartSpec } from "@market-lab/academy";
import { p2 } from "./frame";

const ROLE_NAME: Record<string, string> = {
  entry: "Entry",
  stop: "Stop",
  target: "Target",
  support: "Support",
  resistance: "Resistance",
  neutral: "Level",
  concept: "Level",
};

export function describeChart(spec: ChartSpec, layers: readonly ChartLayer[], visible?: number): string {
  if (spec.describe) return spec.describe;
  const shown = spec.candles.slice(0, visible ?? spec.candles.length);
  const parts: string[] = [];
  if (shown.length === 1) {
    const c = shown[0];
    parts.push(`One ${c.c >= c.o ? "bullish" : "bearish"} candle: open ${p2(c.o)}, high ${p2(c.h)}, low ${p2(c.l)}, close ${p2(c.c)}.`);
  } else if (shown.length > 1) {
    let hiI = 0;
    let loI = 0;
    shown.forEach((c, i) => {
      if (c.h > shown[hiI].h) hiI = i;
      if (c.l < shown[loI].l) loI = i;
    });
    parts.push(
      `${shown.length} candles. Price goes from ${p2(shown[0].o)} to ${p2(shown[shown.length - 1].c)}; highest ${p2(shown[hiI].h)} at candle ${hiI + 1}, lowest ${p2(shown[loI].l)} at candle ${loI + 1}.`,
    );
  }
  const hidden = spec.candles.length - shown.length;
  if (hidden > 0) parts.push(`${hidden} more candles are hidden until revealed.`);
  for (const l of layers) {
    if (l.kind === "level") parts.push(`${l.label ?? ROLE_NAME[l.role]} at ${p2(l.price)}.`);
    else if (l.kind === "zone") parts.push(`${l.label ?? ROLE_NAME[l.role] + " zone"} from ${p2(Math.min(l.from, l.to))} to ${p2(Math.max(l.from, l.to))}.`);
    else if (l.kind === "ma") parts.push(`${l.label ?? `${l.period}-period moving average`} drawn over the candles.`);
    else if (l.kind === "marker" && l.label) parts.push(`Marked at candle ${l.index + 1}: ${l.label}.`);
  }
  return parts.join(" ");
}
