/**
 * The contract between lesson content and the interactive widgets (docs/learn/widgets.md).
 * `controls` can be set by a task's `start`, `locked` and `showMe`; `outputs` are computed by the
 * widget and can be used, together with the controls, in success conditions and feedback cases.
 * Prices and money are numbers with two decimals (vUSD); percentages are numbers like 1 for 1%.
 */
export interface WidgetContract {
  title: string;
  controls: Record<string, string>;
  outputs: Record<string, string>;
}

export const WIDGET_CONTRACTS: Record<string, WidgetContract> = {
  "candle-builder": {
    title: "Build a candle",
    controls: { open: "price 97.00–103.00, step 0.10", high: "price", low: "price", close: "price" },
    outputs: {
      direction: '"bullish" or "bearish"',
      body: "|close − open|",
      upperWick: "high − max(open, close)",
      lowerWick: "min(open, close) − low",
      range: "high − low",
      lowerOverBody: "lowerWick ÷ body (99 when the body is 0)",
      upperOverBody: "upperWick ÷ body (99 when the body is 0)",
      lowerMinusUpper: "lowerWick − upperWick",
    },
  },
  "spread-cost": {
    title: "Round-trip cost",
    controls: { units: "1–200", mid: "20.00–200.00, step 0.50", spread: "0.02–0.50, step 0.02", commissionPct: "0.00–0.20, step 0.01 (0.05 = 0.05%)", answer: "the learner's typed total, vUSD" },
    outputs: { ask: "mid + spread/2", bid: "mid − spread/2", spreadCost: "units × spread", feeIn: "commission at entry, rounded up to the cent", feeOut: "commission at exit, rounded up", roundTrip: "spreadCost + feeIn + feeOut", breakEven: "price rise per unit to break even" },
  },
  "order-fill": {
    title: "Place an order, then play the chart",
    controls: { side: '"buy" or "sell"', type: '"market" or "limit"', limit: "limit price, 95.00–105.00, step 0.01" },
    outputs: { placed: "true once the order is placed", filled: "true when it filled", fillPrice: "fill price (0 if not filled)", ask: "ask when placed", lowestAsk: "lowest ask reached while playing" },
  },
  "bracket-builder": {
    title: "Set the stop and the target",
    controls: { stop: "price below entry", target: "price above entry", units: "whole units" },
    outputs: { entry: "fixed entry price", stopDistance: "entry − stop", targetDistance: "target − entry", lossBefore: "units × stopDistance", gainBefore: "units × targetDistance", lossAfter: "loss at the stop with both commissions", gainAfter: "gain at the target after both commissions", rr: "targetDistance ÷ stopDistance (2 decimals)" },
  },
  "trend-classifier": {
    title: "Label the market",
    controls: { labelA: '"trend" | "range" | "noise"', evidenceA: '"hh_hl" | "lh_ll" | "bounded" | "overlap"', labelB: "", evidenceB: "", labelC: "", evidenceC: "" },
    outputs: { correctCount: "segments with label and evidence both right" },
  },
  "level-drawer": {
    title: "Draw a level, then plan the trade",
    controls: { role: '"resistance" | "support"', bandLow: "price", bandHigh: "price", stop: "price" },
    outputs: { height: "bandHigh − bandLow", touches: "swing points inside the band", tests: "", breaks: "", phase: "1 draw, 2 plan, 3 play" },
  },
  "ma-period": {
    title: "Change the moving average",
    controls: { period: "5–50", market: '"trend" | "range"' },
    outputs: { crossings: "", falseSignals: "crossings reversed within 5 candles", lag: "candles from the price peak to the MA peak (trend only)" },
  },
  "loss-recovery": {
    title: "Drawdown and recovery",
    controls: { drawdown: "1–90 (%)" },
    outputs: { left: "100 − drawdown", gainNeeded: "drawdown ÷ (100 − drawdown) × 100, 1 decimal", lossesInRow: "1% losses in a row to reach the drawdown" },
  },
  "position-size": {
    title: "Size a position from the stop",
    controls: { account: "1,000–50,000", riskPct: "0.25–3", entry: "price", stop: "price below entry", units: 'learner mode only: whole units typed by the learner' },
    outputs: { budget: "account × riskPct", distance: "entry − stop", simpleQty: "budget ÷ distance, rounded down", qty: "size with costs (engine maxQtyForRisk)", lossAtStop: "loss at the stop with costs, for units (learner mode) or qty", withinBudget: "lossAtStop ≤ budget", positionValue: "units × entry" },
  },
  "risk-reward": {
    title: "Reward-to-risk",
    controls: { entry: "price", stop: "price below entry", target: "price above entry" },
    outputs: { risk: "entry − stop", reward: "target − entry", rr: "reward ÷ risk, 2 decimals", breakEven: "risk ÷ (risk + reward) × 100, 1 decimal" },
  },
  expectancy: {
    title: "Expectancy",
    controls: { winRate: "10–90 (%)", avgWin: "0.5–5.0 (R)", avgLoss: "0.5–3.0 (R)", runLength: "3–12 (losing-runs panel)" },
    outputs: { expectancy: "per trade in R, 2 decimals", runProb: "chance of a run of runLength losses in 100 trades, %" },
  },
  exposure: {
    title: "Exposure and leverage",
    controls: { account: "1,000–50,000", leverage: "1, 2, 5 or 10 (maximum allowed)", position: "position value, 0 to account × leverage, step 500", move: "adverse move 1–20 (%)" },
    outputs: { exposurePct: "position ÷ account × 100", leverageUsed: "position ÷ account", loss: "position × move%", lossPct: "loss ÷ account × 100, 1 decimal" },
  },
  "bias-spotter": {
    title: "Sort the cards",
    controls: {},
    outputs: { solved: "cards answered correctly (0 to the number of cards)", firstTry: "cards right on the first try" },
  },
};
