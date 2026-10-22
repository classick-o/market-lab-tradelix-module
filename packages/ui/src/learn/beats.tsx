/** The Learn beats of an interactive lesson (PLAN_LEARN §4.2): one screen each in the player. */
import { useEffect, useMemo, useState } from "react";
import { evaluateCondition, fillTemplate, parseNumericAnswer, pickFeedback, type Beat, type ChartSpec, type TapZone } from "@market-lab/academy";
import { Rich } from "../components/Page";
import { Icon, cx } from "../components/ui";
import { Hotspots, LearnChart } from "../kit";
import { AnswerControlView, answerCorrect, answerFeedback, hasAnswer, type AnswerValue } from "./AnswerControl";
import { seededShuffle, useKeys, useScreen } from "./context";
import { FigureView } from "./FigureView";
import { useLab, useStore } from "../store";
import { BeatTitle, Feedback, Para } from "./parts";
import { SceneView } from "./SceneView";
import { TaskRunner } from "./TaskRunner";

type BeatOf<K extends Beat["kind"]> = Extract<Beat, { kind: K }>;

function useCompleteNow(when = true) {
  const s = useScreen();
  useEffect(() => {
    if (when) s.complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [when]);
}

// ─── explain, figure, callout ─────────────────────────────────────────────

function ExplainBeat({ b }: { b: BeatOf<"explain"> }) {
  const s = useScreen();
  useCompleteNow(!b.figure);
  return (
    <>
      <BeatTitle>{b.title}</BeatTitle>
      <Para text={b.text} />
      {b.figure && <FigureView figure={b.figure} all={s.done || s.mode === "read"} onDone={s.complete} />}
    </>
  );
}

function FigureBeat({ b }: { b: BeatOf<"figure"> }) {
  const s = useScreen();
  return (
    <>
      <BeatTitle>{b.title}</BeatTitle>
      <FigureView figure={b.figure} all={s.done || s.mode === "read"} onDone={s.complete} />
      <Para text={b.text} />
    </>
  );
}

function SceneBeat({ b }: { b: BeatOf<"scene"> }) {
  const s = useScreen();
  return (
    <>
      <BeatTitle>{b.title}</BeatTitle>
      <SceneView b={b} onDone={s.complete} />
      <Para text={b.text} />
    </>
  );
}

function CalloutBeat({ b }: { b: BeatOf<"callout"> }) {
  useCompleteNow();
  return (
    <aside className={cx("lp-callout", `is-${b.tone}`)}>
      <span className="lp-callout-icon" aria-hidden="true">
        <Icon name={b.tone === "warning" ? "alert" : b.tone === "key" ? "star" : "info"} size={20} />
      </span>
      <div>
        <span className="lp-kicker">{b.tone === "key" ? "Key idea" : b.tone === "warning" ? "Watch out" : "Good to know"}</span>
        <p>
          <Rich text={b.text} />
        </p>
      </div>
    </aside>
  );
}

// ─── predict ──────────────────────────────────────────────────────────────

function PredictBeat({ b }: { b: BeatOf<"predict"> }) {
  const s = useScreen();
  const initial: AnswerValue = b.control.kind === "slider" ? b.control.start ?? b.control.min : null;
  const [value, setValue] = useState<AnswerValue>(initial);
  const [locked, setLocked] = useState(s.done);
  const [figureDone, setFigureDone] = useState(!b.figure || s.done);
  const ready = hasAnswer(b.control, value);
  const correct = answerCorrect(b.control, value);
  const lock = () => {
    if (locked || !ready) return false;
    setLocked(true);
    if (correct !== null) s.evidence(b.concept, correct ? 1 : 0);
    return true;
  };
  useEffect(() => {
    if (locked && figureDone) s.complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, figureDone]);
  useKeys({ Enter: lock });
  const fb = locked && !s.done ? answerFeedback(b.control, value) : undefined;
  return (
    <>
      <BeatTitle kicker="Predict">{b.title}</BeatTitle>
      <p className="lp-prompt">
        <Rich text={b.prompt} />
      </p>
      {b.figure && b.control.kind !== "tap" && <FigureView figure={b.figure} base={!locked} all={s.done || s.mode === "read"} onDone={() => setFigureDone(true)} />}
      <AnswerControlView control={b.control} value={value} onChange={setValue} locked={locked} reveal={locked} label={b.prompt} />
      {!locked && (
        <div className="lp-inline-actions">
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" disabled={!ready} onClick={lock}>
            Lock in my answer
          </button>
        </div>
      )}
      {locked && (
        <div className="lp-reveal-text">
          {!s.done && correct !== null && <Feedback tone={correct ? "right" : "wrong"} title={correct ? "Right." : "Not quite."}>{fb && <Rich text={fb} />}</Feedback>}
          {!s.done && correct === null && fb && (
            <Feedback tone="info">
              <Rich text={fb} />
            </Feedback>
          )}
          <Para text={b.reveal} />
        </div>
      )}
      {b.figure && b.control.kind === "tap" && locked && <FigureView figure={b.figure} all={s.done || s.mode === "read"} onDone={() => setFigureDone(true)} />}
    </>
  );
}

// ─── reveal ───────────────────────────────────────────────────────────────

function RevealBeat({ b }: { b: BeatOf<"reveal"> }) {
  const s = useScreen();
  const [choice, setChoice] = useState<string | null>(null);
  const [shown, setShown] = useState(s.done);
  const canReveal = !shown && (!b.choices?.length || choice !== null);
  const reveal = () => {
    if (!canReveal) return false;
    setShown(true);
    if (b.answer && choice) s.evidence(b.concept, choice === b.answer ? 1 : 0);
    s.complete();
    return true;
  };
  useKeys({ r: reveal, R: reveal, Enter: reveal });
  const picked = b.choices?.find((c) => c.id === choice);
  return (
    <>
      <BeatTitle kicker="The reveal">{b.title}</BeatTitle>
      <p className="lp-prompt">
        <Rich text={b.prompt} />
      </p>
      <div className={cx("lp-reveal-chart", shown && "is-revealed")}>
        <LearnChart spec={b.chart} visible={shown ? b.chart.candles.length : undefined} />
      </div>
      {b.choices && b.choices.length > 0 && (
        <AnswerControlView control={{ kind: "choice", choices: b.choices, answer: b.answer }} value={choice} onChange={(v) => setChoice(v as string)} locked={shown} reveal={shown} label={b.prompt} />
      )}
      {!shown ? (
        <div className="lp-inline-actions">
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" disabled={!canReveal} onClick={reveal} aria-keyshortcuts="R">
            <Icon name="eye" size={18} /> Reveal
          </button>
          {!canReveal && <span className="ml-muted ml-small">Pick what you expect first.</span>}
        </div>
      ) : (
        <div className="lp-reveal-text">
          {!s.done && b.answer && picked && (
            <Feedback tone={picked.id === b.answer ? "right" : "wrong"} title={picked.id === b.answer ? "Right." : "Not this time."}>
              {picked.feedback && <Rich text={picked.feedback} />}
            </Feedback>
          )}
          <Para text={b.after} />
        </div>
      )}
    </>
  );
}

// ─── worked example ───────────────────────────────────────────────────────

function WorkedBeat({ b }: { b: BeatOf<"worked"> }) {
  const s = useScreen();
  const total = b.lines.length;
  const [shown, setShown] = useState(s.done || s.mode === "read" ? total : 1);
  const [typed, setTyped] = useState("");
  const [tries, setTries] = useState(0);
  const [solved, setSolved] = useState<"right" | "given" | null>(s.done ? "right" : null);
  const [miss, setMiss] = useState<string | null>(null);
  const allLines = shown >= total;
  const needsAnswer = !!b.ask && solved === null;
  useEffect(() => {
    if (allLines && !needsAnswer) s.complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLines, needsAnswer]);

  const next = () => {
    if (allLines) return false;
    setShown((n) => n + 1);
    return true;
  };
  const check = () => {
    if (!b.ask || solved || !typed.trim()) return false;
    const n = parseNumericAnswer(typed);
    const ok = n !== null && Math.abs(n - b.ask.answer) <= (b.ask.tolerance ?? 0) + 1e-9;
    if (ok) {
      setSolved("right");
      setMiss(null);
      s.evidence(b.concept, tries === 0 ? 1 : 0.5);
      return true;
    }
    const t = tries + 1;
    setTries(t);
    if (t === 1) s.evidence(b.concept, 0);
    const specific = n !== null ? b.ask.feedback?.find((f) => Math.abs(f.value - n) < 0.005)?.text : undefined;
    setMiss(specific ?? (n === null ? "Type a number, like 2.30." : b.ask.incorrect ?? "Not quite. Go back over the lines above."));
    if (t >= 2) setSolved("given");
    return true;
  };
  useKeys({ Enter: () => (allLines ? check() : next()) });

  const fmtAnswer = b.ask ? `${b.ask.answer.toFixed(Number.isInteger(b.ask.answer) ? 0 : 2)}${b.ask.unit ? ` ${b.ask.unit}` : ""}` : "";
  return (
    <>
      <BeatTitle kicker="Worked example">{b.title}</BeatTitle>
      <ol className="lp-worked">
        {b.lines.slice(0, shown).map((line, i) => {
          const isAsk = !!b.ask && i === total - 1;
          return (
            <li key={i} className={cx("lp-worked-line", isAsk && "is-ask", i === shown - 1 && !s.done && "is-new")}>
              <span className="lp-worked-n num">{i + 1}</span>
              <span className="lp-worked-text">
                <Rich text={isAsk && solved ? line.replace(/\?\s*$/, fmtAnswer) : line} />
              </span>
            </li>
          );
        })}
      </ol>
      {!allLines && (
        <div className="lp-inline-actions">
          <button type="button" className="ml-btn ml-btn--secondary ml-btn--md" onClick={next}>
            Next line <Icon name="arrow-right" size={16} />
          </button>
          <span className="ml-muted ml-small">
            {shown} of {total}
          </span>
        </div>
      )}
      {allLines && b.ask && !solved && (
        <div className="lp-worked-ask">
          <label className="lp-numeric">
            <span className="ml-sr">Your answer for the last line</span>
            <input inputMode="decimal" autoComplete="off" value={typed} placeholder="Your answer" onChange={(e) => setTyped(e.target.value)} autoFocus={s.mode === "player"} />
            {b.ask.unit && <span className="lp-numeric-unit">{b.ask.unit}</span>}
          </label>
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" disabled={!typed.trim()} onClick={check}>
            Check
          </button>
        </div>
      )}
      {miss && !solved && <Feedback tone="wrong" title="Not quite.">{miss !== "Not quite. Go back over the lines above." && <Rich text={miss} />}</Feedback>}
      {solved === "right" && !s.done && b.ask && <Feedback tone="right" title="Right.">{b.ask.correct && <Rich text={b.ask.correct} />}</Feedback>}
      {solved === "given" && (
        <Feedback tone="wrong" title={`The answer is ${fmtAnswer}.`}>
          {miss && miss !== "Not quite. Go back over the lines above." && <Rich text={miss} />}
        </Feedback>
      )}
      {allLines && !needsAnswer && <Para text={b.after} />}
    </>
  );
}

// ─── match ────────────────────────────────────────────────────────────────

function MatchBeat({ b }: { b: BeatOf<"match"> }) {
  const s = useScreen();
  const rights = useMemo(() => seededShuffle(b.pairs.map((p, i) => ({ text: p.right, i })), s.seed), [b.pairs, s.seed]);
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [usedRight, setUsedRight] = useState<Set<number>>(() => new Set());
  const [left, setLeft] = useState<number | null>(null);
  const [miss, setMiss] = useState<{ left: number; right: number; text: string } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const all = matched.size === b.pairs.length || s.done;
  useEffect(() => {
    if (all) s.complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all]);

  const pick = (r: number) => {
    if (left === null) return;
    // Pairs can share a right-hand text; any right with the same text is a match.
    if (b.pairs[r].right === b.pairs[left].right) {
      const next = new Set(matched).add(left);
      setMatched(next);
      setUsedRight((u) => new Set(u).add(r));
      setLeft(null);
      setMiss(null);
      if (next.size === b.pairs.length) s.evidence(b.concept, mistakes === 0 ? 1 : mistakes === 1 ? 0.5 : 0);
    } else {
      setMistakes((m) => m + 1);
      setMiss({ left, right: r, text: b.pairs[left].wrong ?? `"${b.pairs[r].right}" goes with something else. Try another.` });
    }
  };
  const done = (i: number) => s.done || matched.has(i);
  const doneRight = (i: number) => s.done || usedRight.has(i);
  return (
    <>
      <BeatTitle kicker="Match">{b.title}</BeatTitle>
      <p className="lp-prompt">
        <Rich text={b.prompt} />
      </p>
      <div className="lp-match">
        <div className="lp-match-col" role="group" aria-label={b.columns?.[0] ?? "Items"}>
          {b.columns && <span className="lp-kicker">{b.columns[0]}</span>}
          {b.pairs.map((p, i) => (
            <button
              key={i}
              type="button"
              className={cx("lp-match-item", left === i && "is-on", done(i) && "is-done", miss?.left === i && "is-miss")}
              disabled={done(i)}
              aria-pressed={left === i}
              onClick={() => (setLeft(i), setMiss(null))}
            >
              <Rich text={p.left} />
              {done(i) && <span className="lp-match-pair">{p.right}</span>}
            </button>
          ))}
        </div>
        <div className="lp-match-col" role="group" aria-label={b.columns?.[1] ?? "Matches"}>
          {b.columns && <span className="lp-kicker">{b.columns[1]}</span>}
          {rights.map((r) => (
            <button
              key={r.i}
              type="button"
              className={cx("lp-match-item is-right-col", doneRight(r.i) && "is-done", miss?.right === r.i && "is-miss")}
              disabled={doneRight(r.i) || left === null}
              onClick={() => pick(r.i)}
            >
              <Rich text={r.text} />
            </button>
          ))}
        </div>
      </div>
      {!all && <p className="ml-muted ml-small lp-match-help">{left === null ? "Choose an item on the left, then its match on the right." : "Now choose its match on the right."}</p>}
      {miss && (
        <Feedback tone="wrong">
          <Rich text={miss.text} />
        </Feedback>
      )}
      {all && !s.done && (
        <Feedback tone="right" title="All matched.">
          {b.correct && <Rich text={b.correct} />}
        </Feedback>
      )}
    </>
  );
}

/** Match with repeated right-hand sides is a sort: each item goes into one of a few categories. */
function SortBeat({ b }: { b: BeatOf<"match"> }) {
  const s = useScreen();
  const cats = useMemo(() => [...new Set(b.pairs.map((p) => p.right))], [b.pairs]);
  const [placed, setPlaced] = useState<Record<number, string>>(() => (s.done ? Object.fromEntries(b.pairs.map((p, i) => [i, p.right])) : {}));
  const [miss, setMiss] = useState<{ i: number; text: string } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const all = b.pairs.every((p, i) => placed[i] === p.right);
  useEffect(() => {
    if (all) s.complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all]);
  const choose = (i: number, cat: string) => {
    if (placed[i] === b.pairs[i].right) return;
    if (cat === b.pairs[i].right) {
      const next = { ...placed, [i]: cat };
      setPlaced(next);
      setMiss(null);
      if (b.pairs.every((p, k) => next[k] === p.right)) s.evidence(b.concept, mistakes === 0 ? 1 : mistakes === 1 ? 0.5 : 0);
    } else {
      setMistakes((m) => m + 1);
      setMiss({ i, text: b.pairs[i].wrong ?? "Not this one. Read the statement again." });
    }
  };
  return (
    <>
      <BeatTitle kicker="Sort">{b.title}</BeatTitle>
      <p className="lp-prompt">
        <Rich text={b.prompt} />
      </p>
      <ul className="lp-sort">
        {b.pairs.map((p, i) => {
          const ok = placed[i] === p.right;
          return (
            <li key={i} className={cx("lp-sort-item", ok && "is-done", miss?.i === i && "is-miss")}>
              <span className="lp-sort-text">
                <Rich text={p.left} />
              </span>
              <span className="lp-seg-options" role="radiogroup" aria-label={p.left}>
                {cats.map((c) => (
                  <button key={c} type="button" role="radio" aria-checked={placed[i] === c} className={cx("lp-seg-opt", ok && placed[i] === c && "is-on")} disabled={ok && placed[i] !== c} onClick={() => choose(i, c)}>
                    {c}
                  </button>
                ))}
              </span>
              {miss?.i === i && (
                <span className="lp-sort-miss" role="status">
                  <Rich text={miss.text} />
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {all && !s.done && (
        <Feedback tone="right" title="All sorted.">
          {b.correct && <Rich text={b.correct} />}
        </Feedback>
      )}
    </>
  );
}

// ─── order ────────────────────────────────────────────────────────────────

function OrderBeat({ b }: { b: BeatOf<"order"> }) {
  const s = useScreen();
  const start = useMemo(() => {
    const idx = b.items.map((_, i) => i);
    let sh = seededShuffle(idx, s.seed);
    if (sh.every((v, i) => v === i)) sh = [...sh.slice(1), sh[0]];
    return sh;
  }, [b.items, s.seed]);
  const [order, setOrder] = useState<number[]>(s.done || s.mode === "read" ? b.items.map((_, i) => i) : start);
  const [checked, setChecked] = useState(false);
  const [tries, setTries] = useState(0);
  const [solved, setSolved] = useState(s.done);
  useEffect(() => {
    if (solved) s.complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length || solved) return;
    const next = [...order];
    [next[from], next[to]] = [next[to], next[from]];
    setOrder(next);
    setChecked(false);
  };
  const check = () => {
    if (solved) return false;
    const ok = order.every((v, i) => v === i);
    setChecked(true);
    setTries((t) => t + 1);
    if (ok) {
      setSolved(true);
      s.evidence(b.concept, tries === 0 ? 1 : 0.5);
    } else if (tries === 0) s.evidence(b.concept, 0);
    return true;
  };
  useKeys({ Enter: check });
  return (
    <>
      <BeatTitle kicker="Put in order">{b.title}</BeatTitle>
      <p className="lp-prompt">
        <Rich text={b.prompt} />
      </p>
      <ol className="lp-order">
        {order.map((item, pos) => {
          const right = (checked || solved) && item === pos;
          return (
            <li key={item} className={cx("lp-order-item", right && "is-right", checked && !right && "is-wrong")}>
              <span className="lp-order-n num">{pos + 1}</span>
              <span className="lp-order-text">
                <Rich text={b.items[item]} />
              </span>
              {!solved && (
                <span className="lp-order-moves">
                  <button type="button" className="ml-iconbtn ml-iconbtn--sm ml-iconbtn--tertiary" aria-label={`Move up: ${b.items[item]}`} disabled={pos === 0} onClick={() => move(pos, pos - 1)}>
                    <Icon name="chevron-down" size={16} className="lp-rot180" />
                  </button>
                  <button type="button" className="ml-iconbtn ml-iconbtn--sm ml-iconbtn--tertiary" aria-label={`Move down: ${b.items[item]}`} disabled={pos === order.length - 1} onClick={() => move(pos, pos + 1)}>
                    <Icon name="chevron-down" size={16} />
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!solved && (
        <div className="lp-inline-actions">
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={check}>
            Check order
          </button>
          {tries >= 2 && (
            <button type="button" className="ml-btn ml-btn--tertiary ml-btn--md" onClick={() => (setOrder(b.items.map((_, i) => i)), setSolved(true), setChecked(true))}>
              Show the order
            </button>
          )}
        </div>
      )}
      {checked && !solved && (
        <Feedback tone="wrong" title="Not yet.">
          <Rich text={b.wrong ?? "The steps in place are marked. Move the others."} />
        </Feedback>
      )}
      {solved && !s.done && <Feedback tone="right" title="That's the order." />}
      {solved && <Para text={b.explain} />}
      {solved && b.note && <LessonNoteField note={b.note} />}
    </>
  );
}

// ─── hotspot ──────────────────────────────────────────────────────────────

export function TapChart({ chart, zones, answer, onRight, onMiss, done, label }: { chart: ChartSpec; zones: TapZone[]; answer: string; onRight: (firstTry: boolean) => void; onMiss?: () => void; done?: boolean; label: string }) {
  const [chosen, setChosen] = useState<string | null>(done ? answer : null);
  const [misses, setMisses] = useState(0);
  const [solved, setSolved] = useState(!!done);
  const tap = (id: string) => {
    if (solved) return;
    setChosen(id);
    if (id === answer) {
      setSolved(true);
      onRight(misses === 0);
    } else {
      setMisses((m) => m + 1);
      onMiss?.();
    }
  };
  const zone = zones.find((z) => z.id === chosen);
  return (
    <div className="lp-tap">
      <LearnChart spec={chart} label={label}>
        {(frame) => <Hotspots frame={frame} zones={zones} spec={chart} chosen={chosen} correct={solved || misses >= 2 ? answer : null} onTap={tap} disabled={solved} />}
      </LearnChart>
      {!solved && !chosen && <p className="lp-tap-hint ml-muted">Tap the chart, or Tab to a point and press Enter.</p>}
      {!solved && chosen && zone && (
        <Feedback tone="wrong" title="Not quite.">
          {zone.feedback && <Rich text={zone.feedback} />} {misses >= 2 && "The right point is outlined."}
        </Feedback>
      )}
    </div>
  );
}

function HotspotBeat({ b }: { b: BeatOf<"hotspot"> }) {
  const s = useScreen();
  const [right, setRight] = useState(s.done);
  return (
    <>
      <BeatTitle kicker="Find it">{b.title}</BeatTitle>
      <p className="lp-prompt">
        <Rich text={b.prompt} />
      </p>
      <TapChart
        chart={b.chart}
        zones={b.zones}
        answer={b.answer}
        done={s.done}
        label={b.prompt}
        onRight={(first) => {
          setRight(true);
          s.evidence(b.concept, first ? 1 : 0.5);
          s.complete();
        }}
      />
      {right && !s.done && (
        <Feedback tone="right" title="Right.">
          <Rich text={b.correct.replace(/^Right\.\s*/, "")} />
        </Feedback>
      )}
    </>
  );
}

/** A free-text answer kept with the lesson (not graded; never blocks Continue). */
function LessonNoteField({ note }: { note: { key: string; label: string; placeholder?: string } }) {
  const s = useScreen();
  const lab = useLab();
  const store = useStore();
  const saved = lab.lessons[s.lessonId]?.fields?.[note.key];
  const [text, setText] = useState(saved !== undefined ? String(saved) : "");
  return (
    <label className="lp-notefield">
      <span>{note.label}</span>
      <textarea rows={2} maxLength={300} value={text} placeholder={note.placeholder} onChange={(e) => setText(e.target.value)} onBlur={() => text.trim() && store.setLessonField(s.lessonId, note.key, text.trim())} />
    </label>
  );
}

/** The learner's own rules: any values for which the condition holds are accepted and saved with the lesson. */
function FieldsBeat({ b }: { b: BeatOf<"fields"> }) {
  const s = useScreen();
  const lab = useLab();
  const store = useStore();
  const saved = lab.lessons[s.lessonId]?.fields ?? {};
  const key = (id: string) => `${b.title ?? "fields"}:${id}`;
  const [values, setValues] = useState<Record<string, number | string>>(() => Object.fromEntries(b.fields.map((f) => [f.id, saved[key(f.id)] ?? f.default])));
  const [result, setResult] = useState<{ ok: boolean; text?: string } | null>(s.done ? { ok: true } : null);
  const save = () => {
    if (result?.ok) return false;
    const missing = b.fields.find((f) => f.kind === "text" && f.required && !String(values[f.id] ?? "").trim());
    if (missing) {
      setResult({ ok: false, text: `Write your answer to "${missing.label}" first.` });
      return true;
    }
    const ok = !b.valid || evaluateCondition(b.valid, values);
    if (ok) {
      for (const f of b.fields) store.setLessonField(s.lessonId, key(f.id), typeof values[f.id] === "string" ? String(values[f.id]).trim().slice(0, 500) : values[f.id]);
      setResult({ ok: true, text: b.correct });
      s.evidence(b.concept, 1);
      s.complete();
    } else {
      const fb = pickFeedback(b.feedback ?? [], values);
      setResult({ ok: false, text: fb ? fillTemplate(fb.text, values) : undefined });
      s.evidence(b.concept, 0);
    }
    return true;
  };
  useKeys({ Enter: save });
  const set = (id: string, v: number | string) => {
    setValues((x) => ({ ...x, [id]: v }));
    if (result && !result.ok) setResult(null);
  };
  return (
    <>
      <BeatTitle kicker="Your rules">{b.title}</BeatTitle>
      <p className="lp-prompt">
        <Rich text={b.prompt} />
      </p>
      <div className="lp-fields">
        {b.fields.map((f) => {
          if (f.kind === "text")
            return (
              <label key={f.id} className="lp-field lp-field--text">
                <span className="lp-field-label">{f.label}</span>
                <textarea rows={2} maxLength={500} value={String(values[f.id] ?? "")} placeholder={f.placeholder} disabled={result?.ok} onChange={(e) => set(f.id, e.target.value)} />
              </label>
            );
          const v = Number(values[f.id]);
          const label = f.label.includes("__") ? f.label.replace("__", String(v)) : f.label;
          return (
            <div key={f.id} className="lp-field">
              <span className="lp-field-label">{label}</span>
              {f.kind === "choice" ? (
                <div className="lp-seg-options" role="radiogroup" aria-label={f.label}>
                  {(f.options ?? []).map((o) => (
                    <button key={o} type="button" role="radio" aria-checked={v === o} className={cx("lp-seg-opt", v === o && "is-on")} disabled={result?.ok} onClick={() => set(f.id, o)}>
                      {o}
                      {f.unit}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="lp-stepper">
                  <button type="button" className="ml-iconbtn ml-iconbtn--sm ml-iconbtn--secondary" aria-label={`Less: ${f.label}`} disabled={result?.ok || v <= (f.min ?? 0)} onClick={() => set(f.id, Math.max(f.min ?? 0, v - (f.step ?? 1)))}>
                    <Icon name="minus" size={14} />
                  </button>
                  <output className="num" aria-live="polite">
                    {v}
                    {f.unit}
                  </output>
                  <button type="button" className="ml-iconbtn ml-iconbtn--sm ml-iconbtn--secondary" aria-label={`More: ${f.label}`} disabled={result?.ok || v >= (f.max ?? Infinity)} onClick={() => set(f.id, Math.min(f.max ?? Infinity, v + (f.step ?? 1)))}>
                    <Icon name="plus" size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!result?.ok && (
        <div className="lp-inline-actions">
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={save}>
            Save my rules
          </button>
        </div>
      )}
      {result && !s.done && (
        <Feedback tone={result.ok ? "right" : "wrong"} title={result.ok ? "Saved." : "Not this one."}>
          {result.text && <Rich text={result.text} />}
        </Feedback>
      )}
    </>
  );
}

function TaskBeat({ b }: { b: BeatOf<"task"> }) {
  return (
    <>
      <BeatTitle kicker="Try it">{b.title}</BeatTitle>
      <TaskRunner task={b.task} />
    </>
  );
}

export function BeatView({ beat }: { beat: Beat }) {
  switch (beat.kind) {
    case "explain":
      return <ExplainBeat b={beat} />;
    case "figure":
      return <FigureBeat b={beat} />;
    case "callout":
      return <CalloutBeat b={beat} />;
    case "scene":
      return <SceneBeat b={beat} />;
    case "predict":
      return <PredictBeat b={beat} />;
    case "reveal":
      return <RevealBeat b={beat} />;
    case "worked":
      return <WorkedBeat b={beat} />;
    case "match":
      return new Set(beat.pairs.map((p) => p.right)).size < beat.pairs.length ? <SortBeat b={beat} /> : <MatchBeat b={beat} />;
    case "order":
      return <OrderBeat b={beat} />;
    case "hotspot":
      return <HotspotBeat b={beat} />;
    case "task":
      return <TaskBeat b={beat} />;
    case "fields":
      return <FieldsBeat b={beat} />;
  }
}

/** What Continue waits for on each kind of screen (shown next to the disabled button, §5.1). */
export function needText(beat: Beat | "hook" | "task" | "check"): string {
  if (beat === "hook") return "Answer to continue";
  if (beat === "task") return "Solve the task, or use Show me, to continue";
  if (beat === "check") return "Answer the questions to continue";
  switch (beat.kind) {
    case "figure":
    case "explain": {
      const f = beat.figure;
      return f?.kind === "formula" && f.boxes.some((x) => x.answer !== undefined) ? "Fill in the formula to continue" : "Step through the figure to continue";
    }
    case "predict":
      return "Lock in a prediction to continue";
    case "reveal":
      return "Reveal the chart to continue";
    case "worked":
      return "Work through the example to continue";
    case "match":
      return "Match every pair to continue";
    case "order":
      return "Put the steps in order to continue";
    case "hotspot":
      return "Tap the right point to continue";
    case "task":
      return "Solve the task, or use Show me, to continue";
    case "fields":
      return "Save your rules to continue";
    case "scene":
      return "Watch the animation to continue";
    default:
      return "";
  }
}
