/**
 * The interactive lesson player (PLAN_LEARN §5): Hook → Learn → Try → Check → Recap, one screen at
 * a time. Continue unlocks when the screen's interaction is done; the position is saved so the
 * lesson reopens where the learner left it. The rail holds the outline, the lesson's terms and notes.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LESSONS, TOPIC_BY_ID, getCourseUnit, getTerm, lessonCourseId, termsForLesson, type Beat, type Lesson, type LessonScript } from "@market-lab/academy";
import { Rich, termLinks } from "../components/Page";
import { useMediaQuery } from "../components/Stage";
import { Term } from "../components/Term";
import { Button, Dialog, Icon, Kbd, cx } from "../components/ui";
import { useFocusMode } from "../focus";
import { Link, useRouter } from "../router";
import { useLab, useStore } from "../store";
import { AnswerControlView, hasAnswer, type AnswerValue } from "./AnswerControl";
import { BeatView, TextBeat, isTextBeat, needText } from "./beats";
import { CheckPhase } from "./CheckPhase";
import { KeyRegistry, KeysContext, ScreenContext, hashSeed, useKeys, useScreen, type ScreenApi } from "./context";
import { CurrentLessonContext } from "./currentLesson";
import { FigureView } from "./FigureView";
import { LessonContextCard } from "./LessonContext";
import { BeatTitle, Feedback } from "./parts";
import { Recap } from "./Recap";
import { SPLIT_PREVIEW, SlotsContext, ToLab, type Slots } from "./split";
import { TaskRunner } from "./TaskRunner";

export type ScriptedLesson = Lesson & { script: LessonScript };

// A split screen also shows the text beats around its beat: `lead` before it, `tail` after it is done.
type Screen =
  | { phase: 0; beat: 0; kind: "hook" }
  | { phase: 1; beat: number; kind: "beat"; b: Beat; lead?: Beat[]; tail?: Beat[]; span?: number[] }
  | { phase: 2; beat: 0; kind: "task" }
  | { phase: 3; beat: 0; kind: "check" }
  | { phase: 4; beat: 0; kind: "recap" };

export const PHASES = ["Hook", "Learn", "Try", "Check", "Recap"] as const;

/** Learn beats one per screen; split, the text beats join the beat they lead into (or the last one). */
function learnScreens(learn: Beat[], split: boolean): Screen[] {
  if (!split) return learn.map((b, i) => ({ phase: 1, beat: i, kind: "beat", b }));
  const out: Extract<Screen, { kind: "beat" }>[] = [];
  let lead: number[] = [];
  learn.forEach((b, i) => {
    if (isTextBeat(b)) return void lead.push(i);
    out.push({ phase: 1, beat: i, kind: "beat", b, lead: lead.map((j) => learn[j]), span: [...lead, i] });
    lead = [];
  });
  const last = out[out.length - 1];
  if (lead.length && last) Object.assign(last, { tail: lead.map((j) => learn[j]), span: [...last.span!, ...lead] });
  else if (lead.length) out.push({ phase: 1, beat: lead[0], kind: "beat", b: learn[lead[0]], tail: lead.slice(1).map((j) => learn[j]), span: lead });
  return out;
}

export function lessonScreens(script: LessonScript, split = false): Screen[] {
  return [
    { phase: 0, beat: 0, kind: "hook" },
    ...learnScreens(script.learn, split),
    ...(script.task ? [{ phase: 2, beat: 0, kind: "task" } as Screen] : []),
    { phase: 3, beat: 0, kind: "check" },
    { phase: 4, beat: 0, kind: "recap" },
  ];
}

/** Whether a screen shows the beat at (phase, beat), on its own or with others. */
const covers = (s: Screen, phase: number, beat: number) => s.phase === phase && (s.beat === beat || (s.kind === "beat" && !!s.span?.includes(beat)));

/** Beats that send their prompt to the left pane themselves; the others go whole into the lab. */
const SPLITS_ITSELF = new Set<Beat["kind"]>(["task", "match", "worked"]);
const isSplit = (s: Screen) => s.kind === "task" || (s.kind === "beat" && !isTextBeat(s.b) && (SPLITS_ITSELF.has(s.b.kind) || !!s.lead?.length));

const BEAT_LABEL: Record<Beat["kind"], string> = {
  explain: "Explanation",
  figure: "Figure",
  predict: "Prediction",
  reveal: "Reveal",
  worked: "Worked example",
  task: "Try it",
  match: "Match",
  order: "Order",
  hotspot: "Find it",
  callout: "Key idea",
  fields: "Your rules",
  scene: "Animation",
};

const beatTitle = (b: Beat) => ("title" in b && b.title) || BEAT_LABEL[b.kind];

export function screenLabel(s: Screen): string {
  if (s.kind === "beat") return beatTitle(s.lead?.[0] ?? s.b);
  return PHASES[s.phase];
}

/** Glossary terms of a lesson: the ones its script links to, then the ones it explains. */
export function lessonTerms(lesson: ScriptedLesson): string[] {
  return [...new Set([...termLinks(JSON.stringify(lesson.script)), ...termsForLesson(lesson.id).map((t) => t.id)])].filter((id) => getTerm(id));
}

/** The next lesson in course order (by course position, then id). */
export function nextLesson(lesson: ScriptedLesson): Lesson | undefined {
  const key = (l: Lesson) => {
    const c = lessonCourseId(l);
    return c ? c.split(".").map((x) => x.padStart(3, "0")).join(".") : `999.${l.id}`;
  };
  const sorted = [...LESSONS].sort((a, b) => key(a).localeCompare(key(b)));
  return sorted[sorted.findIndex((l) => l.id === lesson.id) + 1];
}

// ─── Hook ──────────────────────────────────────────────────────────────────

function HookScreen({ lesson }: { lesson: ScriptedLesson }) {
  const s = useScreen();
  const lab = useLab();
  const store = useStore();
  const hook = lesson.script.hook;
  const saved = lab.lessons[lesson.id]?.hookAnswer;
  const start: AnswerValue = saved ?? (hook.control.kind === "slider" ? hook.control.start ?? hook.control.min : null);
  const [value, setValue] = useState<AnswerValue>(start);
  const [locked, setLocked] = useState(saved !== undefined);
  const lock = () => {
    if (locked || !hasAnswer(hook.control, value)) return false;
    store.saveHookAnswer(lesson.id, value as string | number);
    setLocked(true);
    s.complete();
    return true;
  };
  useEffect(() => {
    if (saved !== undefined) s.complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useKeys({ Enter: lock });
  return (
    <>
      <LessonContextCard lessonId={lesson.id} script={lesson.script} />
      <BeatTitle kicker="Before we start">Make a prediction</BeatTitle>
      <p className="lp-prompt lp-prompt--hook">
        <Rich text={hook.prompt} />
      </p>
      {hook.figure && <FigureView figure={hook.figure} all />}
      <AnswerControlView control={hook.control} value={value} onChange={setValue} locked={locked} label={hook.prompt} />
      {!locked ? (
        <div className="lp-inline-actions">
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" disabled={!hasAnswer(hook.control, value)} onClick={lock}>
            Lock in my guess
          </button>
          <span className="ml-muted ml-small">No score here. We'll come back to it at the end.</span>
        </div>
      ) : (
        <Feedback tone="info" title="Locked in.">
          Keep it in mind. At the end of the lesson you'll see how it compares.
        </Feedback>
      )}
    </>
  );
}

// ─── Rail: outline, terms, notes ───────────────────────────────────────────

function Outline({ screens, idx, reachable, onGo }: { screens: Screen[]; idx: number; reachable: (i: number) => boolean; onGo: (i: number) => void }) {
  const phases = PHASES.map((name, p) => ({ name, p, items: screens.map((s, i) => ({ s, i })).filter((x) => x.s.phase === p) })).filter((x) => x.items.length);
  return (
    <nav className="lp-outline" aria-label="Lesson outline">
      <ol>
        {phases.map(({ name, p, items }) => {
          const first = items[0].i;
          const last = items[items.length - 1].i;
          const state = idx > last ? "done" : idx >= first ? "current" : "todo";
          return (
            <li key={name} className={cx("lp-outline-phase", `is-${state}`)}>
              <button type="button" className="lp-outline-head" disabled={!reachable(first)} onClick={() => onGo(first)}>
                <span className="lp-outline-mark" aria-hidden="true">
                  {state === "done" ? <Icon name="check" size={12} /> : null}
                </span>
                <span>{name}</span>
                {p === 1 && <span className="lp-outline-count num">{Math.max(0, Math.min(items.length, idx - first + (state === "done" ? 0 : 1)))}/{items.length}</span>}
              </button>
              {p === 1 && state === "current" && (
                <ol className="lp-outline-beats">
                  {items.map(({ s, i }) => (
                    <li key={i}>
                      <button type="button" className={cx("lp-outline-beat", i === idx && "is-current")} disabled={!reachable(i)} onClick={() => onGo(i)} aria-current={i === idx ? "step" : undefined}>
                        {screenLabel(s)}
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Notes({ lessonId, screen, screens }: { lessonId: string; screen: Screen; screens: Screen[] }) {
  const lab = useLab();
  const store = useStore();
  const [draft, setDraft] = useState<string | null>(null);
  const notes = lab.lessonNotes.filter((n) => n.lesson === lessonId);
  const ref = useRef<HTMLTextAreaElement>(null);
  useKeys({
    n: () => (setDraft(""), true),
    N: () => (setDraft(""), true),
  });
  useEffect(() => {
    if (draft === "") ref.current?.focus();
  }, [draft]);
  const where = (phase: number, beat: number) => {
    const s = screens.find((x) => covers(x, phase, beat));
    return s ? screenLabel(s) : PHASES[phase];
  };
  return (
    <section className="lp-rail-block" aria-labelledby="lp-notes">
      <div className="lp-rail-head">
        <h3 id="lp-notes" className="lp-kicker">
          Notes
        </h3>
        {draft === null && (
          <button type="button" className="lp-rail-add" onClick={() => setDraft("")} aria-keyshortcuts="N">
            <Icon name="plus" size={14} /> Add note
          </button>
        )}
      </div>
      {draft !== null && (
        <div className="lp-note-edit">
          <textarea
            ref={ref}
            rows={3}
            maxLength={1000}
            value={draft}
            placeholder={`A note on "${screenLabel(screen)}"`}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                setDraft(null);
              }
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                store.addLessonNote(lessonId, screen.phase, screen.beat, draft);
                setDraft(null);
              }
            }}
          />
          <div className="lp-note-actions">
            <Button size="sm" variant="tertiary" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={!draft.trim()}
              onClick={() => {
                store.addLessonNote(lessonId, screen.phase, screen.beat, draft);
                setDraft(null);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}
      {notes.length === 0 && draft === null && <p className="ml-muted ml-small">Your notes stay with the lesson. Press N to add one.</p>}
      <ul className="lp-notes">
        {notes.map((n) => (
          <li key={n.id}>
            <span className="lp-note-where">{where(n.phase, n.beat)}</span>
            <p>{n.text}</p>
            <button type="button" className="lp-note-del" aria-label="Delete note" onClick={() => store.deleteLessonNote(n.id)}>
              <Icon name="trash" size={13} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Rail({ lesson, screens, idx, reachable, onGo }: { lesson: ScriptedLesson; screens: Screen[]; idx: number; reachable: (i: number) => boolean; onGo: (i: number) => void }) {
  const terms = useMemo(() => lessonTerms(lesson), [lesson]);
  return (
    <>
      <section className="lp-rail-block" aria-label="Outline">
        <h3 className="lp-kicker">Outline</h3>
        <Outline screens={screens} idx={idx} reachable={reachable} onGo={onGo} />
      </section>
      {terms.length > 0 && (
        <section className="lp-rail-block" aria-labelledby="lp-terms">
          <h3 id="lp-terms" className="lp-kicker">
            Terms in this lesson
          </h3>
          <ul className="lp-rail-terms">
            {terms.map((id) => (
              <li key={id}>
                <Term id={id}>{getTerm(id)!.term}</Term>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Notes lessonId={lesson.id} screen={screens[idx]} screens={screens} />
    </>
  );
}

/** Split layout: where you are in the lesson, and a jump to any screen you've reached. */
function ScreenNav({ screens, idx, completed, reachable, open, setOpen, onGo }: { screens: Screen[]; idx: number; completed: Set<number>; reachable: (i: number) => boolean; open: boolean; setOpen: (o: boolean) => void; onGo: (i: number) => void }) {
  return (
    <div className="lp-nav" onMouseLeave={() => setOpen(false)}>
      <button type="button" className="lp-nav-btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="num">
          {idx + 1}/{screens.length}
        </span>
        <span className="lp-nav-label">{screenLabel(screens[idx])}</span>
        <Icon name="chevron-down" size={14} className={open ? "lp-rot180" : undefined} />
      </button>
      {open && (
        <div className="lp-menu lp-nav-menu" role="menu">
          {screens.map((s, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              className={cx(i === idx && "is-current")}
              disabled={!reachable(i)}
              onClick={() => {
                setOpen(false);
                onGo(i);
              }}
            >
              <span className={cx("lp-nav-mark num", completed.has(i) && "is-done")}>{completed.has(i) ? <Icon name="check" size={11} /> : i + 1}</span>
              <span className="lp-nav-item">{screenLabel(s)}</span>
              <span className="lp-nav-phase">{PHASES[s.phase]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── The player ────────────────────────────────────────────────────────────

const SHORTCUTS: [string, string][] = [
  ["Enter / Space", "Continue, or the next step of a figure"],
  ["← / →", "Previous / next screen you've seen"],
  ["1–4", "Choose an answer"],
  ["H", "Next hint"],
  ["R", "Reveal"],
  ["N", "New note"],
  ["\\", "Show or hide the side panel"],
  ["Esc", "Close; again to leave the lesson"],
  ["?", "These shortcuts"],
];

function isTyping(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
}

export function LessonPlayer({ lesson }: { lesson: ScriptedLesson }) {
  const lab = useLab();
  const split = SPLIT_PREVIEW.has(lesson.id) && lab.learnPrefs.layout !== "classic";
  // Switching layouts starts the player again at the saved position.
  return <Player key={split ? "split" : "classic"} lesson={lesson} split={split} />;
}

function Player({ lesson, split }: { lesson: ScriptedLesson; split: boolean }) {
  useFocusMode();
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const wide = useMediaQuery("(min-width: 1024px)");
  const script = lesson.script;
  const screens = useMemo(() => lessonScreens(script, split), [script, split]);
  const recapIdx = screens.length - 1;
  const checkIdx = screens.findIndex((s) => s.kind === "check");
  const progress = lab.lessons[lesson.id];

  const [idx, setIdx] = useState(() => {
    if (progress?.completedAt) return recapIdx;
    const pos = progress?.position;
    if (!pos) return 0;
    const i = screens.findIndex((s) => covers(s, pos.phase, pos.beat));
    return i < 0 ? 0 : Math.min(i, checkIdx);
  });
  const [completed, setCompleted] = useState<Set<number>>(() => new Set(progress?.completedAt ? screens.map((_, i) => i) : screens.map((_, i) => i).filter((i) => i < idx)));
  const [xp, setXp] = useState(0);
  const [sheet, setSheet] = useState(false);
  const [menu, setMenu] = useState(false);
  const [help, setHelp] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [nav, setNav] = useState(false);
  // The panes of a split screen, once they're on the page.
  const [learnEl, setLearnEl] = useState<HTMLElement | null>(null);
  const [labEl, setLabEl] = useState<HTMLElement | null>(null);
  const slots = useMemo<Slots | null>(() => (learnEl && labEl ? { learn: learnEl, lab: labEl } : null), [learnEl, labEl]);
  // First-try scores of graded Learn interactions, for "Skip to Try?" (PLAN_LEARN §6.4).
  const [learnScores, setLearnScores] = useState<Record<number, number>>({});
  const [skipDismissed, setSkipDismissed] = useState(false);
  const registry = useMemo(() => new KeyRegistry(), []);
  const railOpen = lab.learnPrefs.railOpen;
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => store.startLesson(lesson.id), [lesson.id, store]);

  const screen = screens[idx];
  // Each replay is a new take, so even the screen already on show starts over.
  const [take, setTake] = useState(0);
  const doneOnEnter = useMemo(() => completed.has(idx), [idx, take]); // eslint-disable-line react-hooks/exhaustive-deps
  const ready = completed.has(idx);
  const reachable = useCallback((i: number) => i <= idx || completed.has(i) || completed.has(i - 1), [idx, completed]);

  const go = useCallback(
    (i: number) => {
      if (i < 0 || i >= screens.length) return;
      setIdx(i);
      const s = screens[i];
      if (!lab.lessons[lesson.id]?.completedAt || s.kind === "recap") store.setLessonPosition(lesson.id, s.phase, s.beat);
      mainRef.current?.scrollTo?.({ top: 0 });
      mainRef.current?.querySelectorAll(".lp-pane").forEach((p) => p.scrollTo?.({ top: 0 }));
      window.scrollTo?.({ top: 0 });
    },
    [screens, store, lesson.id, lab.lessons],
  );
  const markDone = useCallback((i: number) => setCompleted((c) => (c.has(i) ? c : new Set(c).add(i))), []);
  const next = useCallback(() => {
    if (!completed.has(idx) || idx >= recapIdx) return false;
    go(idx + 1);
    return true;
  }, [completed, idx, recapIdx, go]);
  const back = useCallback(() => {
    if (idx === 0) return false;
    go(idx - 1);
    return true;
  }, [idx, go]);
  // Replaying plays every screen again from scratch; the store keeps the first check and the XP.
  const replay = useCallback(() => {
    setCompleted(new Set());
    setTake((t) => t + 1);
    go(0);
  }, [go]);

  const api: ScreenApi = useMemo(
    () => ({
      mode: "player",
      done: doneOnEnter,
      lessonId: lesson.id,
      seed: hashSeed(lesson.id),
      complete: () => markDone(idx),
      evidence: (concept, score, source = "lesson") => {
        if (concept) store.recordEvidence([{ concept, score, source }]);
        if (screens[idx].phase === 1) setLearnScores((m) => (idx in m ? m : { ...m, [idx]: score }));
      },
    }),
    [doneOnEnter, lesson.id, idx, markDone, store, screens],
  );

  const exit = useCallback(() => navigate("/learn/lessons"), [navigate]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;
      if (document.querySelector("dialog[open]")) return;
      const typing = isTyping(e.target);
      const key = e.key;
      if (typing && key !== "Enter" && key !== "Escape") return;
      // Enter and Space on a focused control press that control.
      const el = e.target as HTMLElement | null;
      if ((key === "Enter" || key === " ") && el?.closest("button, a, [role=button], [role=slider], [role=radio], summary")) return;
      if (typing && key === "Enter" && el?.tagName === "TEXTAREA") return;
      if (registry.dispatch(key)) return e.preventDefault();
      if (typing) return;
      if (key === "Enter" || key === " ") {
        if (next()) e.preventDefault();
      } else if (key === "ArrowRight") {
        if (reachable(idx + 1)) next() || (completed.has(idx + 1) && go(idx + 1));
      } else if (key === "ArrowLeft") back();
      else if (key === "\\") store.setLearnPrefs({ railOpen: !railOpen });
      else if (key === "?") setHelp(true);
      else if (key === "Escape") {
        if (sheet || menu || nav) return setSheet(false), setMenu(false), setNav(false);
        if (screen.kind === "check" && !completed.has(idx)) setLeaving(true);
        else exit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [registry, next, back, reachable, idx, completed, go, store, railOpen, sheet, menu, nav, screen.kind, exit]);

  // Progress: one segment per screen, grouped by phase.
  const minutesLeft = Math.max(1, Math.ceil(lesson.minutes * (1 - idx / (screens.length - 1))));
  const unitName = getCourseUnit(script.unit)?.title ?? TOPIC_BY_ID[lesson.topic].name;
  const showRail = wide && railOpen && !split;
  // Phones keep one column: the same screens, with the text first.
  const showSplit = split && wide && isSplit(screen);
  const nextUp = useMemo(() => nextLesson(lesson), [lesson]);

  let content: React.ReactNode;
  if (screen.kind === "hook") content = <HookScreen lesson={lesson} />;
  else if (screen.kind === "beat")
    content = (
      <>
        {screen.lead?.map((b, i) => <TextBeat key={i} b={b} />)}
        <BeatView beat={screen.b} />
        {ready && screen.tail?.map((b, i) => <TextBeat key={i} b={b} />)}
      </>
    );
  else if (screen.kind === "task")
    content = (
      <>
        <BeatTitle kicker="Try it">Your turn</BeatTitle>
        <TaskRunner task={script.task!} />
      </>
    );
  else if (screen.kind === "check")
    content = (
      <>
        <BeatTitle kicker="Check">Three questions</BeatTitle>
        <CheckPhase
          questionIds={script.check}
          onFirstPass={(results) => store.finishLessonCheck(lesson.id, results, TOPIC_BY_ID[lesson.topic].skill)}
          onFinish={() => {
            setXp(store.completeScriptedLesson(lesson.id));
            markDone(checkIdx);
            go(recapIdx);
          }}
        />
      </>
    );
  else
    content = (
      <Recap
        lesson={lesson}
        script={script}
        terms={lessonTerms(lesson)}
        xp={xp}
        next={nextUp}
        onReplay={replay}
        onJump={(p) => {
          const i = screens.findIndex((s) => s.phase === p);
          if (i >= 0) go(i);
        }}
      />
    );

  const inCheckOrRecap = screen.kind === "check" || screen.kind === "recap";
  const tryIdx = screens.findIndex((s) => s.kind === "task");
  const scores = Object.values(learnScores);
  const offerSkip =
    !skipDismissed && !progress?.completedAt && screen.phase === 1 && tryIdx > idx + 1 && scores.length >= 2 && scores.every((x) => x === 1) && ready;
  const nextLabel = idx + 1 < screens.length ? (screens[idx + 1].phase !== screen.phase ? `Continue to ${PHASES[screens[idx + 1].phase]}` : "Continue") : "Continue";

  return (
    <CurrentLessonContext.Provider value={lesson.id}>
    <KeysContext.Provider value={registry}>
      <div className={cx("lp", showRail && "has-rail", split && "is-split", showSplit && "has-split")}>
        <header className="lp-bar">
          <div className="lp-bar-row">
            <Link to="/learn/lessons" className="lp-bar-back" aria-label="Back to lessons">
              <Icon name="arrow-left" size={16} /> <span className="lp-bar-back-text">Lessons</span>
            </Link>
            <div className="lp-bar-title">
              <span className="lp-kicker">
                {script.unit} · {unitName}
              </span>
              <h1>{lesson.title}</h1>
            </div>
            <div className="lp-bar-tools">
              {SPLIT_PREVIEW.has(lesson.id) && (
                <button type="button" className={cx("lp-layout", split && "is-on")} aria-pressed={split} title="Text on the left, the lab on the right" onClick={() => store.setLearnPrefs({ layout: split ? "classic" : "split" })}>
                  <Icon name="columns" size={16} /> <span>Split view</span>
                </button>
              )}
              {wide && !split ? (
                <button type="button" className="ml-iconbtn ml-iconbtn--md ml-iconbtn--tertiary" aria-label={railOpen ? "Hide side panel" : "Show side panel"} aria-pressed={railOpen} title="Side panel (\)" onClick={() => store.setLearnPrefs({ railOpen: !railOpen })}>
                  <Icon name="panel" size={18} />
                </button>
              ) : (
                <button type="button" className="ml-iconbtn ml-iconbtn--md ml-iconbtn--tertiary" aria-label="Outline, terms and notes" onClick={() => setSheet(true)}>
                  <Icon name="list" size={18} />
                </button>
              )}
              <div className="lp-menu-wrap">
                <button type="button" className="ml-iconbtn ml-iconbtn--md ml-iconbtn--tertiary" aria-label="More" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
                  <Icon name="dots" size={18} />
                </button>
                {menu && (
                  <div className="lp-menu" role="menu" onMouseLeave={() => setMenu(false)}>
                    <button type="button" role="menuitem" onClick={() => (setMenu(false), store.setLearnPrefs({ mode: "read" }))}>
                      <Icon name="book" size={16} /> Read mode
                    </button>
                    <button type="button" role="menuitem" onClick={() => (setMenu(false), store.toggleBookmark(`lesson:${lesson.id}`))}>
                      <Icon name="star" size={16} /> {lab.bookmarks.includes(`lesson:${lesson.id}`) ? "Remove from saved" : "Save lesson"}
                    </button>
                    <button type="button" role="menuitem" onClick={() => (setMenu(false), replay())}>
                      <Icon name="replay" size={16} /> Start over
                    </button>
                    <button type="button" role="menuitem" onClick={() => (setMenu(false), setHelp(true))}>
                      <Icon name="grid" size={16} /> Keyboard shortcuts
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lp-progress">
            <div className="lp-progress-track" role="progressbar" aria-label="Lesson progress" aria-valuemin={1} aria-valuemax={screens.length} aria-valuenow={idx + 1}>
              {PHASES.map((name, p) => {
                const items = screens.map((s, i) => ({ s, i })).filter((x) => x.s.phase === p);
                if (!items.length) return null;
                return (
                  <span key={name} className="lp-progress-phase" style={{ flexGrow: items.length }} title={name}>
                    {items.map(({ i }) => (
                      <span key={i} className={cx("lp-progress-seg", (i < idx || completed.has(i)) && "is-done", i === idx && "is-current")} />
                    ))}
                  </span>
                );
              })}
            </div>
            <div className="lp-progress-meta">
              <span className="lp-progress-phases">
                {PHASES.map((name, p) =>
                  screens.some((s) => s.phase === p) ? (
                    <span key={name} className={cx(screen.phase === p && "is-on", screen.phase > p && "is-done")}>
                      {name}
                    </span>
                  ) : null,
                )}
              </span>
              <span className="num">
                {idx + 1} of {screens.length} · {screen.kind === "recap" ? "done" : `${minutesLeft} min left`}
              </span>
            </div>
          </div>
        </header>

        {showSplit && (screen.kind === "beat" || screen.kind === "task") ? (
          <main ref={mainRef} className="lp-split" aria-live="off">
            <section className="lp-pane lp-learn" aria-label="Learn">
              <div className="lp-pane-head">
                <Icon name="book" size={14} /> Learn
              </div>
              <div key={`${take}-${idx}`} className="lp-learn-text">
                {screen.kind === "task" ? (
                  <h2 className="lp-beat-title">Your turn</h2>
                ) : screen.lead?.length ? (
                  screen.lead.map((b, i) => <TextBeat key={i} b={b} />)
                ) : (
                  <h2 className="lp-beat-title">{beatTitle(screen.b)}</h2>
                )}
              </div>
              <div ref={setLearnEl} className="lp-slot" />
              {ready && screen.kind === "beat" && !!screen.tail?.length && (
                <div key={`tail-${take}-${idx}`} className="lp-learn-text">
                  {screen.tail.map((b, i) => (
                    <TextBeat key={i} b={b} />
                  ))}
                </div>
              )}
            </section>
            <section className="lp-pane lp-lab" aria-label="Lab">
              <div className="lp-pane-head">
                <Icon name="flask" size={14} /> {screen.kind === "task" ? "Try it" : BEAT_LABEL[screen.b.kind]}
                {screen.kind === "beat" && !!screen.lead?.length && <span className="lp-pane-title">{beatTitle(screen.b)}</span>}
              </div>
              <div ref={setLabEl} className="lp-slot" />
            </section>
            <ScreenContext.Provider value={api}>
              <SlotsContext.Provider value={slots}>
                <div key={`${take}-${idx}`} hidden>
                  {slots && (screen.kind === "task" ? <TaskRunner task={script.task!} /> : SPLITS_ITSELF.has(screen.b.kind) ? <BeatView beat={screen.b} /> : <ToLab><BeatView beat={screen.b} /></ToLab>)}
                </div>
              </SlotsContext.Provider>
            </ScreenContext.Provider>
          </main>
        ) : (
          <div className="lp-body">
            <main ref={mainRef} className="lp-main" aria-live="off">
              <ScreenContext.Provider value={api}>
                <div key={`${take}-${idx}`} className={cx("lp-screen", `lp-screen--${screen.kind}`)}>
                  {content}
                </div>
              </ScreenContext.Provider>
            </main>
            {showRail && (
              <aside className="lp-rail" aria-label="Lesson panel">
                <Rail lesson={lesson} screens={screens} idx={idx} reachable={reachable} onGo={go} />
              </aside>
            )}
          </div>
        )}

        {offerSkip && (
          <div className="lp-skip" role="status">
            <Icon name="bolt" size={16} />
            <span>You seem to know this. Skip to Try?</span>
            <button
              type="button"
              className="ml-btn ml-btn--secondary ml-btn--sm"
              onClick={() => {
                setCompleted((c) => {
                  const n = new Set(c);
                  for (let i = idx; i < tryIdx; i++) n.add(i);
                  return n;
                });
                setSkipDismissed(true);
                go(tryIdx);
              }}
            >
              Skip to Try
            </button>
            <button type="button" className="ml-btn ml-btn--tertiary ml-btn--sm" onClick={() => setSkipDismissed(true)}>
              Keep going
            </button>
          </div>
        )}
        {!inCheckOrRecap && (
          <footer className={cx("lp-action", ready && "is-ready")}>
            <div className="lp-action-row">
              <button type="button" className="ml-btn ml-btn--tertiary ml-btn--md lp-action-back" onClick={back} disabled={idx === 0}>
                <Icon name="arrow-left" size={16} /> <span>Back</span>
              </button>
              {split && <ScreenNav screens={screens} idx={idx} completed={completed} reachable={reachable} open={nav} setOpen={setNav} onGo={go} />}
              <span className="lp-action-need" aria-live="polite">
                {ready ? (
                  <span className="lp-action-hint">
                    <Kbd>Enter</Kbd> to continue
                  </span>
                ) : (
                  needText(screen.kind === "beat" ? screen.b : screen.kind === "hook" ? "hook" : "task")
                )}
              </span>
              <button type="button" className="ml-btn ml-btn--primary ml-btn--md lp-action-next" onClick={next} disabled={!ready}>
                {nextLabel} <Icon name="arrow-right" size={16} />
              </button>
            </div>
          </footer>
        )}
        {screen.kind === "check" && (
          <footer className="lp-action">
            <div className="lp-action-row">
              <button type="button" className="ml-btn ml-btn--tertiary ml-btn--md lp-action-back" onClick={back}>
                <Icon name="arrow-left" size={16} /> <span>Back</span>
              </button>
              <span className="lp-action-need">Wrong answers come back once more at the end.</span>
            </div>
          </footer>
        )}

        <Dialog open={sheet && (!wide || split)} onClose={() => setSheet(false)} title={lesson.title} variant="sheet">
          <div className="lp-sheet">
            <Rail
              lesson={lesson}
              screens={screens}
              idx={idx}
              reachable={reachable}
              onGo={(i) => {
                setSheet(false);
                go(i);
              }}
            />
          </div>
        </Dialog>
        <Dialog open={help} onClose={() => setHelp(false)} title="Keyboard shortcuts" description="They don't work while you type in a field.">
          <dl className="lp-shortcuts">
            {SHORTCUTS.map(([k, d]) => (
              <div key={k}>
                <dt>
                  <Kbd>{k}</Kbd>
                </dt>
                <dd>{d}</dd>
              </div>
            ))}
          </dl>
        </Dialog>
        <Dialog
          open={leaving}
          onClose={() => setLeaving(false)}
          title="Leave the check?"
          description="Your answers so far are kept for review, but the lesson won't be complete until you finish the check."
          footer={
            <>
              <Button variant="tertiary" onClick={() => setLeaving(false)}>
                Stay
              </Button>
              <Button variant="primary" onClick={exit}>
                Leave
              </Button>
            </>
          }
        />
      </div>
    </KeysContext.Provider>
    </CurrentLessonContext.Provider>
  );
}
