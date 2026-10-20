import { useState } from "react";
import type { Hypothesis } from "@market-lab/evaluation";
import { Chips, Icon, Segmented, TextArea } from "./ui";

export function emptyHypothesis(): Hypothesis {
  return { direction: "up", reasons: [], confidence: "medium", note: "" };
}

export function HypothesisBuilder({
  value,
  onChange,
  reasons,
  required,
}: {
  value: Hypothesis;
  onChange: (h: Hypothesis) => void;
  reasons: { id: string; label: string }[];
  required: boolean;
}) {
  const [noteOpen, setNoteOpen] = useState(Boolean(value.note));
  const set = (patch: Partial<Hypothesis>) => onChange({ ...value, ...patch });
  return (
    <fieldset className="ml-group">
      <legend className="ml-group-title">
        Your thesis <span className="ml-group-meta">{required ? "Required" : "Optional"}</span>
      </legend>
      <div className="ml-row-field">
        <span className="ml-row-label">Expect price to go</span>
        <Segmented
          label="Expected direction"
          size="sm"
          value={value.direction}
          onChange={(direction) => set({ direction })}
          options={[
            { value: "up", label: "Up" },
            { value: "down", label: "Down" },
            { value: "unclear", label: "Unclear" },
          ]}
        />
      </div>
      {reasons.length > 0 && (
        <div className="ml-stack-2">
          <span className="ml-row-label">Evidence</span>
          <Chips
            label="Evidence"
            options={reasons}
            selected={value.reasons}
            onToggle={(id) => set({ reasons: value.reasons.includes(id) ? value.reasons.filter((r) => r !== id) : [...value.reasons, id] })}
          />
        </div>
      )}
      <div className="ml-row-field">
        <span className="ml-row-label">Confidence</span>
        <Segmented
          label="Confidence"
          size="sm"
          value={value.confidence}
          onChange={(confidence) => set({ confidence })}
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />
      </div>
      {noteOpen ? (
        <TextArea label="Note to your future self" rows={2} maxLength={280} value={value.note ?? ""} onChange={(note) => set({ note })} placeholder="What would prove you wrong?" />
      ) : (
        <button type="button" className="ml-text-btn" onClick={() => setNoteOpen(true)}>
          <Icon name="pen" size={15} /> Add a note
        </button>
      )}
    </fieldset>
  );
}
