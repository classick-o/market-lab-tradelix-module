/** Hidden page (/learn/kit) showing every Learn Chart Kit component, for design review and QA. */
import { useState } from "react";
import type { CandleData, ChartSpec } from "@market-lab/academy";
import { Card, PageHead } from "../components/Page";
import { Bars, DraggableLevel, Flow, Formula, Hotspots, LearnChart, formulaCorrect } from "../kit";

const SERIES: CandleData[] = [
  { o: 100.0, h: 100.6, l: 99.7, c: 100.4 },
  { o: 100.4, h: 101.1, l: 100.2, c: 100.9 },
  { o: 100.9, h: 101.3, l: 100.5, c: 100.7 },
  { o: 100.7, h: 100.9, l: 100.0, c: 100.2 },
  { o: 100.2, h: 100.8, l: 99.9, c: 100.6 },
  { o: 100.6, h: 101.6, l: 100.5, c: 101.4 },
  { o: 101.4, h: 102.0, l: 101.1, c: 101.8 },
  { o: 101.8, h: 102.1, l: 101.2, c: 101.4 },
  { o: 101.4, h: 101.7, l: 100.9, c: 101.0 },
  { o: 101.0, h: 101.9, l: 100.9, c: 101.7 },
  { o: 101.7, h: 102.6, l: 101.6, c: 102.4 },
  { o: 102.4, h: 102.9, l: 102.0, c: 102.2 },
  { o: 102.2, h: 102.5, l: 101.5, c: 101.7 },
  { o: 101.7, h: 102.0, l: 101.0, c: 101.3 },
  { o: 101.3, h: 102.2, l: 101.2, c: 102.0 },
  { o: 102.0, h: 103.0, l: 101.9, c: 102.8 },
];

const TREND: ChartSpec = {
  candles: SERIES,
  visible: 11,
  layers: [
    { kind: "zone", from: 99.9, to: 100.2, role: "support", label: "Support" },
    { kind: "ma", period: 5, label: "SMA 5" },
    { kind: "marker", index: 6, at: "high", label: "Swing high" },
    { kind: "level", price: 101.0, role: "entry", label: "Entry" },
    { kind: "level", price: 102.4, role: "target", label: "Target" },
  ],
};

const ONE: ChartSpec = { candles: [{ o: 100, h: 101.5, l: 99.2, c: 101 }], height: 220 };

export function KitGalleryPage() {
  const [stop, setStop] = useState(100.3);
  const [visible, setVisible] = useState(11);
  const [tap, setTap] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const answerBox = { text: "?", answer: 50 };
  return (
    <div className="ml-page">
      <PageHead title="Learn Chart Kit" sub="Every chart, figure and exercise in Learn is drawn with these components, in one colour system." />
      <Card title="Candles, levels, zone, moving average, marker and the veil">
        <LearnChart spec={TREND} visible={visible} />
        <div className="ml-actions">
          <button type="button" className="ml-btn ml-btn--primary" onClick={() => setVisible(SERIES.length)} disabled={visible >= SERIES.length}>
            Reveal
          </button>
          <button type="button" className="ml-btn ml-btn--secondary" onClick={() => setVisible(11)}>
            Reset
          </button>
        </div>
      </Card>
      <Card title="Drag the stop (mouse, touch or arrow keys)">
        <LearnChart spec={{ candles: SERIES.slice(0, 11), layers: [{ kind: "level", price: 101.0, role: "entry", label: "Entry" }] }} include={[99.0]}>
          {(f) => <DraggableLevel frame={f} value={stop} onChange={setStop} min={99} max={100.99} role="stop" label="Stop" name="Stop price" />}
        </LearnChart>
        <p className="ml-muted num">
          Stop {stop.toFixed(2)} · distance {(101 - stop).toFixed(2)} per unit
        </p>
      </Card>
      <Card title="Hotspots: tap the close">
        <LearnChart spec={ONE}>
          {(f) => (
            <Hotspots
              frame={f}
              spec={ONE}
              chosen={tap}
              correct={tap ? "close" : null}
              onTap={setTap}
              zones={[
                { id: "high", label: "High, 101.50", price: 101.5 },
                { id: "close", label: "Close, 101.00", price: 101.0 },
                { id: "open", label: "Open, 100.00", price: 100.0 },
                { id: "low", label: "Low, 99.20", price: 99.2 },
              ]}
            />
          )}
        </LearnChart>
        <p className="ml-muted">{tap ? (tap === "close" ? "Right: the top of the body is where the hour ended." : "Not the close. The close is the top of a bullish body.") : "Tap a price."}</p>
      </Card>
      <Card title="Formula with an input box">
        <Formula boxes={[{ text: "100.00 vUSD" }, { text: "2.00 per unit" }, answerBox]} operators={["÷", "="]} value={answer} onValue={setAnswer} state={answer ? (formulaCorrect(answerBox, answer) ? "correct" : "incorrect") : "idle"} />
      </Card>
      <Card title="Bars">
        <Bars
          bars={[
            { label: "Lose 10%", value: -10 },
            { label: "Gain needed", value: 11.1, role: "neutral" },
            { label: "Lose 50%", value: -50 },
            { label: "Gain needed", value: 100, role: "neutral" },
          ]}
          unit="%"
        />
      </Card>
      <Card title="Decision flow (interactive)">
        <Flow
          interactive
          start="n1"
          nodes={[
            { id: "n1", text: "Is your setup present?", yes: "n2", no: "skip", correct: "yes", explain: "This chart shows the setup you wrote down." },
            { id: "n2", text: "Are all conditions met?", yes: "n3", no: "skip", correct: "yes", explain: "Check them again: all three are there." },
            { id: "n3", text: "Is the risk defined and within your limit?", yes: "go", no: "skip", correct: "yes", explain: "The stop and size keep the loss at 1%." },
            { id: "go", text: "Enter with a stop.", kind: "end" },
            { id: "skip", text: "No trade.", kind: "end" },
          ]}
        />
      </Card>
    </div>
  );
}
