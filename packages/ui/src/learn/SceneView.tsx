/**
 * Plays an animated scene (packages/ui/src/scenes): the stage, one caption per chapter, play/pause,
 * a scrubber made of chapter segments, and the questions the scene stops on. Continue unlocks once
 * the scene has played to the end. The scene module, and GSAP with it, loads only when needed.
 */
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Beat } from "@market-lab/academy";
import { Rich } from "../components/Page";
import { Icon, cx } from "../components/ui";
import type { SceneHandle } from "../scenes";
import { AnswerControlView, answerCorrect, answerFeedback } from "./AnswerControl";
import { useKeys, useScreen } from "./context";
import { Feedback } from "./parts";

type SceneBeat = Extract<Beat, { kind: "scene" }>;

const reducedMotion = () => !!document.querySelector(".ml-reduced-motion") || !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function SceneView({ b, onDone }: { b: SceneBeat; onDone: () => void }) {
  const s = useScreen();
  const stage = useRef<HTMLDivElement>(null);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const handle = useRef<SceneHandle | null>(null);
  const chapterRef = useRef(0);
  const [narrow, setNarrow] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [stop, setStop] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  // Phone width gets the tall layout; the scene is rebuilt when the width crosses it.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 520));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (narrow === null || !stage.current) return;
    const host = stage.current;
    let alive = true;
    const prev = handle.current;
    const resumeAt = prev ? prev.timeline.time() : null;
    const wasPlaying = prev ? !prev.timeline.paused() : false;
    prev?.destroy();
    handle.current = null;
    void import("../scenes").then(({ SCENES }) => {
      if (!alive) return;
      const h = SCENES[b.scene](host, { narrow });
      handle.current = h;
      const tl = h.timeline;
      const total = tl.duration();
      const paint = () => {
        const t = tl.time();
        h.chapters.forEach((start, i) => {
          const end = h.chapters[i + 1] ?? total;
          const f = Math.min(1, Math.max(0, (t - start) / (end - start)));
          const el = fills.current[i];
          if (el) el.style.transform = `scaleX(${f})`;
        });
        let c = 0;
        while (c < h.chapters.length - 1 && t >= h.chapters[c + 1] - 0.001) c++;
        if (c !== chapterRef.current) {
          chapterRef.current = c;
          setChapter(c);
        }
      };
      h.stops.forEach((t, i) =>
        tl.addPause(t, () => {
          if (answersRef.current[i]) tl.play();
          else {
            setStop(i);
            setPlaying(false);
          }
        }),
      );
      tl.eventCallback("onUpdate", paint);
      tl.eventCallback("onComplete", () => {
        setPlaying(false);
        setEnded(true);
        doneRef.current();
      });
      setLoaded(true);
      if (resumeAt !== null) {
        tl.seek(resumeAt, true);
        if (wasPlaying) tl.play();
      } else if (s.done || s.mode === "read") {
        // Revisited, or the whole lesson on one page: show the last frame, ready to replay.
        tl.progress(1, true);
        setEnded(true);
      } else if (reducedMotion()) {
        // No autoplay with reduced motion; the scene plays when asked and doesn't hold up Continue.
        doneRef.current();
      } else {
        window.setTimeout(() => alive && handle.current === h && (tl.play(), setPlaying(true)), 450);
      }
      paint();
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [narrow, b.scene]);

  useEffect(() => () => handle.current?.destroy(), []);

  const toggle = (): boolean | void => {
    const tl = handle.current?.timeline;
    if (!tl || stop !== null) return false;
    if (ended || tl.progress() >= 1) {
      setEnded(false);
      tl.restart();
      setPlaying(true);
    } else if (tl.paused()) {
      tl.play();
      setPlaying(true);
    } else {
      tl.pause();
      setPlaying(false);
    }
  };
  // Space plays and pauses; once the scene has ended it falls through to Continue.
  useKeys({ " ": () => (ended ? false : toggle()), k: toggle });

  const seekTo = (e: ReactPointerEvent<HTMLDivElement>) => {
    const h = handle.current;
    if (!h || stop !== null) return;
    const r = e.currentTarget.getBoundingClientRect();
    const raw = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    // The last sliver of the track is the end, so the end is easy to hit.
    const f = raw > 0.98 ? 1 : raw;
    h.timeline.pause();
    setPlaying(false);
    h.timeline.seek(f * h.timeline.duration(), true);
    setEnded(f >= 1);
    // Scrubbing to the end counts as watching it: seeking doesn't fire onComplete.
    if (f >= 1) doneRef.current();
  };

  const answer = (i: number, v: string) => {
    const q = b.stops?.[i];
    if (!q || answers[i]) return;
    setAnswers((a) => ({ ...a, [i]: v }));
    s.evidence(b.concept, v === q.answer ? 1 : 0);
    // Let the feedback land, then the scene shows why.
    window.setTimeout(() => {
      setStop(null);
      setPlaying(true);
      handle.current?.timeline.play();
    }, 900);
  };

  const total = handle.current?.timeline.duration() ?? 1;
  const starts = handle.current?.chapters ?? b.chapters.map((_, i) => i);
  const widths = starts.map((t, i) => (starts[i + 1] ?? total) - t);
  const cap = b.chapters[chapter] ?? b.chapters[0];
  const q = stop !== null ? b.stops?.[stop] : undefined;
  // An answered question stays on screen for the rest of its chapter, with its feedback.
  const answeredHere = Object.keys(answers)
    .map(Number)
    .find((i) => handle.current && chapterOf(handle.current, i) === chapter);
  const shownAnswer = stop ?? answeredHere;
  const shownQ = shownAnswer !== undefined ? b.stops?.[shownAnswer] : undefined;
  const control = shownQ ? ({ kind: "choice", choices: shownQ.choices, answer: shownQ.answer } as const) : null;
  const picked = shownAnswer !== undefined ? (answers[shownAnswer] ?? null) : null;

  return (
    <div className={cx("lp-scene", narrow && "is-narrow", q && "is-asking")}>
      <div className="lp-scene-stage" ref={stage}>
        {!loaded && <div className="lp-scene-loading" aria-hidden="true" />}
        {loaded && !playing && !q && (
          <button type="button" className="lp-scene-big" onClick={() => toggle()} aria-label={ended ? "Replay the animation" : "Play the animation"}>
            <Icon name={ended ? "replay" : "play"} size={22} />
          </button>
        )}
      </div>

      <div className="lp-scene-bar">
        <button type="button" className="ml-iconbtn ml-iconbtn--sm ml-iconbtn--tertiary" onClick={() => toggle()} disabled={!loaded || stop !== null} aria-label={playing ? "Pause" : ended ? "Replay" : "Play"}>
          <Icon name={playing ? "pause" : ended ? "replay" : "play"} size={16} />
        </button>
        <div
          className="lp-scene-track"
          role="slider"
          tabIndex={0}
          aria-label="Animation chapters"
          aria-valuemin={1}
          aria-valuemax={b.chapters.length}
          aria-valuenow={chapter + 1}
          aria-valuetext={`Chapter ${chapter + 1} of ${b.chapters.length}: ${cap.title}`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            seekTo(e);
          }}
          onPointerMove={(e) => e.buttons === 1 && seekTo(e)}
          onKeyDown={(e) => {
            const h = handle.current;
            if (!h || stop !== null || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
            e.preventDefault();
            e.stopPropagation();
            const to = Math.min(h.chapters.length - 1, Math.max(0, chapter + (e.key === "ArrowRight" ? 1 : -1)));
            h.timeline.pause();
            setPlaying(false);
            h.timeline.seek(h.chapters[to] + 0.001, true);
          }}
        >
          {widths.map((w, i) => (
            <span key={i} className={cx("lp-scene-seg", i === chapter && "is-on")} style={{ flexGrow: w }} title={b.chapters[i]?.title}>
              <span
                className="lp-scene-fill"
                ref={(el) => {
                  fills.current[i] = el;
                }}
              />
            </span>
          ))}
        </div>
        <span className="lp-scene-count num" aria-hidden="true">
          {chapter + 1}/{b.chapters.length}
        </span>
      </div>

      {shownQ && control ? (
        <div className="lp-scene-stop">
          <p className="lp-prompt">
            <Rich text={shownQ.prompt} />
          </p>
          <AnswerControlView control={control} value={picked} onChange={(v) => stop !== null && typeof v === "string" && answer(stop, v)} locked={picked !== null} reveal={picked !== null} label={shownQ.prompt} />
          {picked !== null && (
            <Feedback tone={answerCorrect(control, picked) ? "right" : "wrong"} title={answerCorrect(control, picked) ? "Right." : "Not quite."}>
              <Rich text={answerFeedback(control, picked) ?? ""} />
            </Feedback>
          )}
        </div>
      ) : (
        <div className="lp-scene-caption" aria-live="polite" key={chapter}>
          <span className="lp-kicker">{cap.title}</span>
          <p>
            <Rich text={cap.caption} />
          </p>
        </div>
      )}
    </div>
  );
}

/** The chapter a stop falls in. */
function chapterOf(h: SceneHandle, stop: number): number {
  const t = h.stops[stop];
  let c = 0;
  while (c < h.chapters.length - 1 && t >= h.chapters[c + 1]) c++;
  return c;
}
