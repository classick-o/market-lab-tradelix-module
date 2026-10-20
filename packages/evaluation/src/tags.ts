/** Human-readable names for recurring decision patterns. */
export const ERROR_TAGS: Record<string, { label: string; tip: string }> = {
  no_stop: { label: "Entering without a stop", tip: "Decide where you're wrong before you decide to enter." },
  risk_over_limit: { label: "Risking more than planned", tip: "Size from the stop: risk budget ÷ distance to stop." },
  oversized: { label: "Position too large", tip: "Use the sizing helper and round down." },
  no_hypothesis: { label: "No stated hypothesis", tip: "Write what you expect and the evidence for it." },
  stop_inside_noise: { label: "Stop inside normal noise", tip: "Place stops beyond the level that invalidates the idea." },
  chased_entry: { label: "Chasing extended moves", tip: "Wait for a pullback or a defined confirmation." },
  moved_stop_away: { label: "Moving the stop further away", tip: "A stop is a decision you made with a clear head. Keep it." },
  loss_aversion: { label: "Avoiding a planned loss", tip: "Taking the planned loss is part of the plan working." },
  revenge_size_up: { label: "Sizing up after a loss", tip: "Keep risk constant; losses are part of the process." },
  overtrading: { label: "Trading too often", tip: "Fewer, better-defined trades." },
  misread_candle: { label: "Misreading candles", tip: "Open, high, low, close: body is open→close, wicks are the extremes." },
  sizing_math: { label: "Position sizing math", tip: "Units = risk budget ÷ (entry − stop), then round down." },
  misread_conditions: { label: "Misreading your own conditions", tip: "Check each rule against the chart, one by one." },
  missed_valid_setup: { label: "Skipping valid setups", tip: "A playbook includes taking the trades it allows." },
  broke_playbook: { label: "Breaking your playbook", tip: "If a condition isn't met, the answer is no trade." },
  misread_structure: { label: "Misreading market structure", tip: "Look for higher highs/lows, lower highs/lows, or a range." },
};
