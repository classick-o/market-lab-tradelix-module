import { useEffect, useMemo, useState } from "react";
import { parseQuantity, previewOrder } from "@market-lab/engine";
import type { Hypothesis } from "@market-lab/evaluation";
import { optionOf, validateAnswer, type CheckpointAnswer, type MissionRun } from "@market-lab/missions";
import { formatFact, formatPct, formatPrice, money } from "../format";
import { HypothesisBuilder, emptyHypothesis } from "./HypothesisBuilder";
import { OrderTicket, initialTicket, parseTicket, type TicketValue } from "./OrderTicket";
import { Button, Checkbox, Chips, Dialog, Icon, InlineError, KeyValues, RadioRow, TextField } from "./ui";

/** The open decision, rendered as the body and sticky footer of the player's dock. */
export function CheckpointPanel({
  run,
  number,
  picked,
  onClearPick,
  onCommit,
  onDraft,
}: {
  run: MissionRun;
  number: number;
  picked: number | null;
  onClearPick: () => void;
  onCommit: (answer: CheckpointAnswer) => void;
  onDraft?: (ticket: TicketValue | null) => void;
}) {
  const cp = run.current!;
  const def = cp.def;
  const ticketCfg = def.ticket;
  const defaults = useMemo(() => ticketCfg?.defaults?.(cp.facts), [ticketCfg, cp.facts]);

  const [optionId, setOptionId] = useState<string | undefined>(def.options?.length === 1 ? def.options[0].id : undefined);
  const [reasons, setReasons] = useState<string[]>([]);
  const [numeric, setNumeric] = useState("");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [checklistTouched, setChecklistTouched] = useState(false);
  const [hypothesis, setHypothesis] = useState<Hypothesis>(emptyHypothesis);
  const [ticket, setTicket] = useState<TicketValue>(() => initialTicket(ticketCfg?.sides[0] ?? "buy", defaults));
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<CheckpointAnswer | null>(null);

  const option = def.options?.find((o) => o.id === optionId);
  const entering = option?.action === "enter";
  const showReasons = !!def.reasons?.length && (def.kind !== "decision" || option?.action === "skip" || option?.requiresReason);
  const reasonRequired = Boolean(def.requireReason || option?.requiresReason);

  useEffect(() => {
    onDraft?.(entering ? ticket : null);
  }, [entering, ticket, onDraft]);
  useEffect(() => () => onDraft?.(null), [onDraft]);

  const buildAnswer = (): CheckpointAnswer | string => {
    const answer: CheckpointAnswer = { optionId, reasons };
    if (def.kind === "pick") {
      if (picked === null) return "Click on the chart to mark a price first.";
      answer.pickPrice = picked;
    }
    if (def.kind === "numeric") {
      const n = parseQuantity(numeric);
      if (n === null) return "Enter a whole number of units.";
      answer.numeric = n;
    }
    if (def.checklist) {
      if (!checklistTouched) return "Go through the checklist: tick every condition that is true right now.";
      answer.checklist = Object.fromEntries(def.checklist.map((c) => [c.id, Boolean(checklist[c.id])]));
    }
    if (entering) {
      const { order, problem } = parseTicket(ticket);
      if (!order) return problem ?? "Complete the order.";
      answer.order = order;
      if (ticketCfg?.requireHypothesis || hypothesis.reasons.length > 0) answer.hypothesis = { ...hypothesis, note: hypothesis.note?.trim() || undefined };
      answer.reasons = [];
    }
    return answer;
  };

  const submit = () => {
    const a = buildAnswer();
    if (typeof a === "string") return setError(a);
    const problem = validateAnswer(run, a);
    if (problem) return setError(problem);
    setError(null);
    if (optionOf(def, a)?.action === "enter") setConfirming(a);
    else onCommit(a);
  };

  const confirmPreview = confirming?.order ? previewOrder(run.ctx, run.state, { type: "submit_order", ...confirming.order }) : null;
  const needsOption = Boolean(def.options && def.options.length > 1 && !optionId);

  return (
    <>
      <div className="ml-dock-body ml-enter-up">
        <header className="ml-dock-head">
          <span className="ml-eyebrow">Decision {number}</span>
          <h2 className="ml-dock-title">{def.title}</h2>
          <p className="ml-dock-prompt">{cp.prompt}</p>
        </header>

        {def.cards && def.cards.length > 0 && (
          <KeyValues items={def.cards.map((c) => ({ label: c.label, value: formatFact(cp.facts[c.fact], c.format) }))} />
        )}

        {def.kind === "pick" && (
          <div className="ml-pick" aria-live="polite">
            <Icon name="target" size={18} />
            {picked === null ? (
              <span>Click the chart at the {def.pick?.label.toLowerCase()}. The price under the crosshair is shown on the right axis.</span>
            ) : (
              <span>
                Marked <b className="num">{formatPrice(picked)}</b>
                <button type="button" className="ml-text-btn" onClick={onClearPick}>
                  Clear
                </button>
              </span>
            )}
          </div>
        )}

        {def.kind === "numeric" && (
          <TextField
            big
            label={def.numeric?.label ?? "Answer"}
            inputMode="numeric"
            autoComplete="off"
            value={numeric}
            onChange={(e) => setNumeric(e.target.value)}
            placeholder="0"
            hint={`Whole ${def.numeric?.unit ?? "units"}, rounded down.`}
            autoFocus
          />
        )}

        {def.checklist && (
          <fieldset className="ml-group">
            <legend className="ml-group-title">Which conditions are true right now?</legend>
            <div className="ml-stack-1">
              {def.checklist.map((c) => (
                <Checkbox
                  key={c.id}
                  checked={Boolean(checklist[c.id])}
                  onChange={(v) => {
                    setChecklistTouched(true);
                    setChecklist({ ...checklist, [c.id]: v });
                  }}
                  label={c.label}
                />
              ))}
            </div>
            {!checklistTouched && (
              <button type="button" className="ml-text-btn" onClick={() => setChecklistTouched(true)}>
                None of these are true
              </button>
            )}
          </fieldset>
        )}

        {def.options && def.options.length > 1 && (
          <div className="ml-stack-2" role="radiogroup" aria-label={def.title}>
            {def.options.map((o) => (
              <RadioRow
                key={o.id}
                name={`cp-${def.id}`}
                selected={optionId === o.id}
                onSelect={() => {
                  setOptionId(o.id);
                  setError(null);
                }}
                title={o.label}
                description={o.description}
              />
            ))}
          </div>
        )}

        {showReasons && (
          <div className="ml-stack-2">
            <span className="ml-row-label">{reasonRequired ? "Why? Pick at least one" : "Why? Optional"}</span>
            <Chips label="Reasons" options={def.reasons!} selected={reasons} onToggle={(id) => setReasons(reasons.includes(id) ? reasons.filter((r) => r !== id) : [...reasons, id])} />
          </div>
        )}

        {entering && ticketCfg && (
          <div className="ml-stack-4 ml-enter-up">
            {(ticketCfg.requireHypothesis || ticketCfg.hypothesisReasons.length > 0) && (
              <HypothesisBuilder value={hypothesis} onChange={setHypothesis} reasons={ticketCfg.hypothesisReasons} required={ticketCfg.requireHypothesis} />
            )}
            <fieldset className="ml-group">
              <legend className="ml-group-title">Order</legend>
              <OrderTicket
                ctx={run.ctx}
                state={run.state}
                value={ticket}
                onChange={setTicket}
                sides={ticketCfg.sides}
                orderTypes={ticketCfg.orderTypes.filter((t) => run.ctx.cfg.rules.orderTypes.includes(t))}
                lockStop={ticketCfg.lockStop}
                riskLimitPct={run.ctx.cfg.rules.maxRiskPct}
              />
            </fieldset>
          </div>
        )}
      </div>

      <div className="ml-dock-foot">
        {error && <InlineError>{error}</InlineError>}
        <Button variant="primary" size="lg" block onClick={submit} disabled={needsOption} iconRight="arrow-right">
          {entering ? "Review order" : "Confirm decision"}
        </Button>
      </div>

      <Dialog
        open={confirming !== null}
        onClose={() => setConfirming(null)}
        title="Place this simulated order?"
        description="Check the size and the risk. You can't change a decision once it's made."
        footer={
          <>
            <Button variant="tertiary" onClick={() => setConfirming(null)}>
              Back to the ticket
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const a = confirming!;
                setConfirming(null);
                onCommit(a);
              }}
            >
              Place order
            </Button>
          </>
        }
      >
        {confirming?.order && confirmPreview && (
          <div className="ml-stack-4">
            <p className="ml-confirm-line">
              {confirming.order.side === "buy" ? "Buy" : "Sell"} <b className="num">{confirming.order.qty}</b> {run.ctx.cfg.symbol}{" "}
              {confirming.order.orderType === "market" ? "at market" : `with a limit at ${formatPrice(confirming.order.limitPrice!)}`}
              <span className="ml-muted num"> ≈ {formatPrice(confirmPreview.entryPrice)}</span>
            </p>
            <KeyValues
              items={[
                { label: "Stop-loss", value: confirming.order.stopLoss !== null ? formatPrice(confirming.order.stopLoss) : "None" },
                { label: "Take-profit", value: confirming.order.takeProfit !== null ? formatPrice(confirming.order.takeProfit) : "None" },
                {
                  label: "Loss if stopped",
                  value: confirmPreview.risk !== null ? `${money(confirmPreview.risk)} · ${formatPct(confirmPreview.riskPct!)}` : "Unlimited, no stop",
                  emphasis: true,
                  alert: confirmPreview.risk === null,
                },
                { label: "Fees, in and out", value: money(confirmPreview.entryFee + confirmPreview.exitFeeAtStop) },
              ]}
            />
            <p className="ml-fine">Virtual money. In real markets a stop-loss can fill worse than its price; here, gaps fill at the open.</p>
          </div>
        )}
      </Dialog>
    </>
  );
}
