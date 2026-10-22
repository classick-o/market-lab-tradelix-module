/**
 * Practice (PLAN_LEARN §7.2) and the review session (§6.2).
 * Practice: today's review with a 7-day forecast, weak concepts with a two-minute fix, concept
 * mastery, topic checks and assessments. The session asks one item per screen: questions (options
 * shuffled per day, fresh numbers for numeric questions with `vary`) and glossary flashcards
 * ("term:<id>"). Every answer is saved as it's given, so leaving mid-session loses nothing.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CONCEPTS,
  KNOWLEDGE_CHECKS,
  MASTERY_LABEL,
  QUESTIONS,
  TOPICS,
  TOPIC_BY_ID,
  dayIndex,
  dayKey,
  dueReviews,
  getConcept,
  getLesson,
  getQuestion,
  getTerm,
  keyFromIndex,
  masteryByConcept,
  parseNumericAnswer,
  reviewForecast,
  seededRandom,
  shuffled,
  varyQuestion,
  type Concept,
  type MasteryLevel,
  type Question,
  type ReviewItem,
  type TopicId,
} from "@market-lab/academy";
import { Card, PageHead, Rich, SubNav } from "../components/Page";
import { useToast } from "../components/Toast";
import { Button, Empty, Icon, Kbd, Meter, SectionHead, cx } from "../components/ui";
import { formatDate, formatDayKey, plural } from "../format";
import { Link, useRouter } from "../router";
import { useLab, useStore, type LabData } from "../store";

const SECONDS_PER_ITEM = 20;
const FIX_SIZE = 2;
const WEAK_LIMIT = 5;
const WEAK_AGE_DAYS = 7;
const DAY_MS = 86_400_000;
const LEVELS: MasteryLevel[] = [0, 1, 2, 3, 4];

// ─── Helpers ────────────────────────────────────────────────────────────────

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** The question as shown: with fresh numbers when it has a generator (as in the lesson check). */
function shownQuestion(q: Question, seed: number): Question {
  if (!q.vary || !q.numeric) return q;
  const v = varyQuestion(q, seededRandom(seed));
  if (!v) return q;
  const hints = q.hints ? [...q.hints.slice(0, -1), v.hint ?? q.hints[q.hints.length - 1]] : v.hint ? [v.hint] : undefined;
  return { ...q, prompt: v.prompt, explanation: v.explanation, hints, numeric: { ...q.numeric, answer: v.answer } };
}

/** Grades against the question as shown, so a varied numeric question uses its own answer. */
function gradeShown(q: Question, value: string): boolean {
  if (q.kind === "numeric" && q.numeric) {
    const n = parseNumericAnswer(value);
    return n !== null && Math.abs(n - q.numeric.answer) <= q.numeric.tolerance + 1e-9;
  }
  return value === q.correct;
}

/** Content markup (`**bold**`, `[[term|text]]`) as plain text, for one-line labels. */
function plainText(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_m, id: string, shown?: string) => shown ?? id.replace(/-/g, " "));
}

function minutesFor(n: number): number {
  return Math.max(1, Math.round((n * SECONDS_PER_ITEM) / 60));
}

/** "Tomorrow", "Thursday" within the week, otherwise "Thu 5 Nov". */
function dayLabel(key: string, today: string): string {
  const d = dayIndex(key) - dayIndex(today);
  if (d <= 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d < 7) return formatDayKey(key, { weekday: "long" });
  return formatDayKey(key);
}

function inDays(key: string, today: string): string {
  const d = dayIndex(key) - dayIndex(today);
  return d <= 0 ? "today" : d === 1 ? "tomorrow" : `in ${d} days`;
}

/**
 * The next day with reviews to do, and how many: tomorrow when today's limit left some over
 * (`later`), otherwise the first day after today with anything due.
 */
function nextReview(review: Record<string, ReviewItem>, today: string, later = 0): { day: string; count: number } | null {
  const t = dayIndex(today);
  if (later > 0) {
    const tomorrow = keyFromIndex(t + 1);
    return { day: tomorrow, count: later + Object.values(review).filter((r) => r.due === tomorrow).length };
  }
  let best: number | null = null;
  let count = 0;
  for (const r of Object.values(review)) {
    const d = dayIndex(r.due);
    if (d <= t) continue;
    if (best === null || d < best) {
      best = d;
      count = 1;
    } else if (d === best) count++;
  }
  return best === null ? null : { day: keyFromIndex(best), count };
}

const isKnownItem = (id: string) => (id.startsWith("term:") ? Boolean(getTerm(id.slice(5))) : Boolean(getQuestion(id)));

/** A question in one line: a scenario's setting first, since its prompt is often just "What should you do?". */
const questionLabel = (q: Question) => plainText(q.scenario ? `${q.scenario} ${q.prompt}` : q.prompt);

function itemLabel(id: string): string {
  if (id.startsWith("term:")) return getTerm(id.slice(5))?.term ?? id.slice(5);
  const q = getQuestion(id);
  return q ? questionLabel(q) : id;
}

const reviewedOn = (lab: LabData, day: string) => lab.xp.some((x) => x.reason === "review" && x.ref === day);

function useMastery(lab: LabData): Record<string, MasteryLevel> {
  return useMemo(() => masteryByConcept(lab.evidence, lab.review, QUESTIONS), [lab.evidence, lab.review]);
}

/** Today's queue as the learner sees it: nothing after the daily review is done (the rest waits for tomorrow). */
function todayQueue(lab: LabData, today: string) {
  const forecast = reviewForecast(lab.review, today, 7);
  const done = reviewedOn(lab, today);
  const due = done ? [] : dueReviews(lab.review, today);
  const later = Math.max(0, forecast[0] - due.length);
  return { forecast, done, due, later };
}

/** Concepts at "Learning": the ones first met over a week ago first, then the rest, oldest first. */
function weakConcepts(lab: LabData, mastery: Record<string, MasteryLevel>, now: number): { concept: Concept; firstAt: number; old: boolean }[] {
  const first = new Map<string, number>();
  for (const e of lab.evidence) first.set(e.concept, Math.min(first.get(e.concept) ?? Infinity, e.at));
  const cut = now - WEAK_AGE_DAYS * DAY_MS;
  return CONCEPTS.filter((c) => mastery[c.id] === 1)
    .map((c) => {
      const firstAt = first.get(c.id) ?? now;
      return { concept: c, firstAt, old: firstAt <= cut };
    })
    .sort((a, b) => Number(b.old) - Number(a.old) || a.firstAt - b.firstAt)
    .slice(0, WEAK_LIMIT);
}

const conceptQuestions = (conceptId: string) => QUESTIONS.filter((q) => q.concepts?.includes(conceptId));

/** Two questions on a concept: ones last answered wrong first, then unseen, then the lowest box. */
function fixItQuestions(conceptId: string, review: Record<string, ReviewItem>, seed: number): string[] {
  const rank = (q: Question) => {
    const r = review[q.id];
    if (!r) return 1;
    const last = r.history[r.history.length - 1];
    return last && !last.correct ? 0 : 1 + r.box;
  };
  return shuffled(conceptQuestions(conceptId), seededRandom(seed))
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, FIX_SIZE)
    .map((q) => q.id);
}

function topicLevel(topic: TopicId, mastery: Record<string, MasteryLevel>): MasteryLevel {
  const cs = CONCEPTS.filter((c) => c.category === topic);
  if (!cs.length) return 0;
  return Math.round(cs.reduce((s, c) => s + (mastery[c.id] ?? 0), 0) / cs.length) as MasteryLevel;
}

/** A concept's mastery as five steps, with its name: none lit for New, all five for Mastered. */
function MasteryMeter({ level, compact }: { level: MasteryLevel; compact?: boolean }) {
  const lit = level === 0 ? 0 : level + 1;
  return (
    <span className={cx("ml-practice-mm", compact && "ml-practice-mm--compact")} role="img" aria-label={`Mastery: ${MASTERY_LABEL[level]}`}>
      <span className="ml-practice-mm-steps" aria-hidden="true">
        {LEVELS.map((l) => (
          <i key={l} className={cx(l < lit && "is-on")} />
        ))}
      </span>
      <span className="ml-practice-mm-label" aria-hidden="true">
        {MASTERY_LABEL[level]}
      </span>
    </span>
  );
}

// ─── Practice ───────────────────────────────────────────────────────────────

/** Practice (PLAN_LEARN §7.2): today's review, weak concepts, topic checks. */
export function PracticePage() {
  const lab = useLab();
  const now = Date.now();
  const today = dayKey(now, lab.settings.timeZone);
  const mastery = useMastery(lab);
  const queue = useMemo(() => todayQueue(lab, today), [lab, today]);
  const weak = weakConcepts(lab, mastery, now);

  return (
    <div className="ml-page ml-practice">
      <PageHead title="Practice" sub="Review what's due, fix weak spots and test yourself topic by topic. A few minutes a day keeps what you've learned." />
      <SubNav module="learn" />
      <div className="ml-practice-top">
        <TodayCard queue={queue} lab={lab} today={today} />
        <MasteryCard mastery={mastery} />
      </div>
      <WeakCard weak={weak} now={now} />
      <TopicChecks lab={lab} mastery={mastery} />
    </div>
  );
}

function TodayCard({ queue, lab, today }: { queue: ReturnType<typeof todayQueue>; lab: LabData; today: string }) {
  const { navigate } = useRouter();
  const { forecast, done, due, later } = queue;
  const next = nextReview(lab.review, today, due.length ? 0 : later);
  const hasAny = Object.keys(lab.review).length > 0;
  // What each day will actually offer: today up to the daily limit, the rest tomorrow.
  const days = forecast.map((n, i) => (i === 0 ? due.length : i === 1 ? n + later : n));
  const max = Math.max(1, ...days);

  return (
    <section className="ml-card ml-card--feature ml-practice-today" aria-labelledby="ml-practice-today-h">
      <div className="ml-practice-today-head">
        <span id="ml-practice-today-h" className="ml-eyebrow">
          Today's review
        </span>
        {done && (
          <span className="ml-status ml-status--done">
            <Icon name="check" size={12} /> Done today
          </span>
        )}
      </div>
      {due.length > 0 ? (
        <div className="ml-practice-today-body">
          <div className="ml-practice-today-count">
            <span className="num">{due.length}</span>
            <span>
              {due.length === 1 ? "item" : "items"} due
              <span className="ml-practice-today-time num">
                <Icon name="clock" size={13} /> ~{minutesFor(due.length)} min
              </span>
            </span>
          </div>
          <p className="ml-practice-today-text">Questions and terms you've met before, back just before you'd forget them. Answer from memory; each right answer pushes the next review further out.</p>
          <div className="ml-practice-today-actions">
            <Button variant="primary" size="lg" iconRight="arrow-right" onClick={() => navigate("/learn/practice/review")}>
              Start review
            </Button>
            {later > 0 && <span className="ml-muted ml-small num">{later} more tomorrow</span>}
          </div>
        </div>
      ) : (
        <div className="ml-practice-today-body ml-practice-today-calm">
          <span className="ml-practice-calm-icon">
            <Icon name={done ? "check-circle" : "sun"} size={20} />
          </span>
          <div className="ml-practice-calm-copy">
            <h2 className="ml-practice-calm-title">{done ? "Today's review is done" : "Nothing due today"}</h2>
            <p className="ml-muted num">
              {next
                ? `Next review: ${dayLabel(next.day, today)} · ${plural(next.count, "item")}`
                : hasAny
                  ? "Nothing scheduled yet."
                  : "Questions you answer in lessons and checks come back here, spaced out so they stick."}
            </p>
            {!hasAny && (
              <Link to="/learn/course" className="ml-text-link ml-small ml-practice-calm-link">
                Go to the course
              </Link>
            )}
          </div>
        </div>
      )}
      <ol className="ml-practice-forecast" aria-label="Reviews over the next 7 days">
        {days.map((n, i) => {
          const key = keyFromIndex(dayIndex(today) + i);
          const name = i === 0 ? "Today" : formatDayKey(key, { weekday: "short" });
          return (
            <li key={key} className={cx(i === 0 && "is-today", n === 0 && "is-empty")} aria-label={`${i === 0 ? "Today" : formatDayKey(key, { weekday: "long" })}: ${plural(n, "review")}`}>
              <span className="ml-practice-fc-n num" aria-hidden="true">
                {n}
              </span>
              <span className="ml-practice-fc-track" aria-hidden="true">
                <i style={{ height: n ? `${Math.max(8, (n / max) * 100)}%` : undefined }} />
              </span>
              <span className="ml-practice-fc-day" aria-hidden="true">
                {name}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function MasteryCard({ mastery }: { mastery: Record<string, MasteryLevel> }) {
  const counts = LEVELS.map((l) => CONCEPTS.filter((c) => (mastery[c.id] ?? 0) === l).length);
  const familiar = counts[2] + counts[3] + counts[4];
  return (
    <Card
      title="Concept mastery"
      eyebrow={plural(CONCEPTS.length, "concept")}
      className="ml-practice-mastery"
      action={
        <Link to="/learn/library" className="ml-text-link ml-small">
          Library
        </Link>
      }
    >
      <div className="ml-practice-mbar" role="img" aria-label={LEVELS.map((l) => `${MASTERY_LABEL[l]} ${counts[l]}`).join(", ")}>
        {LEVELS.map((l) => (counts[l] > 0 ? <i key={l} className={`ml-practice-level is-${l}`} style={{ flexGrow: counts[l] }} /> : null))}
      </div>
      <ul className="ml-practice-legend">
        {LEVELS.map((l) => (
          <li key={l} className={cx(counts[l] === 0 && "is-zero")}>
            <i className={`ml-practice-level is-${l}`} aria-hidden="true" />
            <span>{MASTERY_LABEL[l]}</span>
            <b className="num">{counts[l]}</b>
          </li>
        ))}
      </ul>
      <p className="ml-muted ml-small num">
        {familiar} of {CONCEPTS.length} at Familiar or above. Right answers spaced over days move a concept up.
      </p>
    </Card>
  );
}

function WeakCard({ weak, now }: { weak: ReturnType<typeof weakConcepts>; now: number }) {
  return (
    <Card title="Weak concepts" eyebrow="Two-minute fixes" className="ml-practice-weak-card">
      {weak.length === 0 ? (
        <p className="ml-muted ml-practice-weak-empty">
          <Icon name="check-circle" size={16} />
          <span>No weak spots right now. Concepts you're still getting wrong show up here, each with a short fix.</span>
        </p>
      ) : (
        <ul className="ml-practice-weak">
          {weak.map(({ concept, firstAt, old }) => {
            const lesson = concept.lessons.map(getLesson).find(Boolean);
            const canFix = conceptQuestions(concept.id).length > 0;
            const days = Math.max(0, Math.floor((now - firstAt) / DAY_MS));
            return (
              <li key={concept.id} className="ml-practice-weak-row">
                <div className="ml-practice-weak-main">
                  <Link to={`/learn/library/concepts/${concept.id}`} className="ml-practice-weak-name">
                    {concept.name}
                  </Link>
                  <span className="ml-muted ml-small">
                    {TOPIC_BY_ID[concept.category].name} · {old ? `learning for ${days} days` : days === 0 ? "first met today" : `first met ${plural(days, "day")} ago`}
                  </span>
                </div>
                <MasteryMeter level={1} />
                <div className="ml-practice-weak-actions">
                  {lesson && (
                    <Link to={`/learn/lessons/${lesson.id}`} className="ml-practice-weak-lesson" title={`Lesson: ${lesson.title}`}>
                      <Icon name="book" size={14} />
                      <span>{lesson.title}</span>
                    </Link>
                  )}
                  {canFix && (
                    <Link to={`/learn/practice/review?concept=${encodeURIComponent(concept.id)}`} className="ml-btn ml-btn--secondary ml-btn--sm ml-practice-fix">
                      Fix it · 2 min
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function TopicChecks({ lab, mastery }: { lab: LabData; mastery: Record<string, MasteryLevel> }) {
  const tz = lab.settings.timeZone;
  const stats = (id: string) => {
    const attempts = lab.checks[id] ?? [];
    const best = attempts.reduce<number | null>((b, a) => Math.max(b ?? 0, a.total ? Math.round((a.correct / a.total) * 100) : 0), null);
    const last = attempts.reduce<number | null>((t, a) => Math.max(t ?? 0, a.at), null);
    return { attempts: attempts.length, best, last, passed: attempts.some((a) => a.passed) };
  };
  const checks = TOPICS.map((t) => KNOWLEDGE_CHECKS.find((c) => c.kind === "check" && c.topic === t.id)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const assessments = TOPICS.map((t) => KNOWLEDGE_CHECKS.find((c) => c.kind === "assessment" && c.topic === t.id)).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <section className="ml-section" aria-label="Topic checks">
        <SectionHead title="Topic checks">Five questions per topic, with an explanation after each. Your best score counts.</SectionHead>
        <ul className="ml-practice-checks">
          {checks.map((c) => {
            const s = stats(c.id);
            const name = TOPIC_BY_ID[c.topic].name;
            return (
              <li key={c.id}>
                <Link to={`/learn/checks/${c.id}`} className={cx("ml-practice-check", s.passed && "is-passed")}>
                  <span className="ml-practice-check-head">
                    <span className="ml-practice-check-title">{name}</span>
                    <span className={cx("ml-status", s.passed ? "ml-status--done" : s.best !== null && "ml-status--active")}>{s.passed ? "Passed" : s.best === null ? "Not taken" : "Try again"}</span>
                  </span>
                  <span className="ml-practice-check-score num">
                    {s.best === null ? <span className="ml-muted">No score yet</span> : <><b>{s.best}%</b> best</>}
                  </span>
                  <Meter value={(s.best ?? 0) / 100} label={`${name} best score`} muted={!s.passed} />
                  <span className="ml-practice-check-meta num">{s.last === null ? `${c.questionIds.length} questions` : `${plural(s.attempts, "attempt")} · last ${formatDate(s.last, tz, { day: "numeric", month: "short" })}`}</span>
                  <span className="ml-practice-check-mastery">
                    <span>Mastery</span>
                    <MasteryMeter level={topicLevel(c.topic, mastery)} compact />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <Card title="Topic assessments" eyebrow="Every question in the topic · pass with 70%" className="ml-practice-assess-card">
        <ul className="ml-practice-assess">
          {assessments.map((c) => {
            const s = stats(c.id);
            return (
              <li key={c.id}>
                <Link to={`/learn/checks/${c.id}`} className="ml-practice-assess-row">
                  <span className="ml-row-main">
                    <b>{TOPIC_BY_ID[c.topic].name}</b>
                    <span className="ml-muted num">
                      {c.questionIds.length} questions
                      {s.best !== null && ` · best ${s.best}%`}
                      {s.last !== null && ` · ${formatDate(s.last, tz, { day: "numeric", month: "short" })}`}
                    </span>
                  </span>
                  {s.passed ? (
                    <span className="ml-status ml-status--done">Passed</span>
                  ) : (
                    <span className="ml-row-cta">
                      {s.best === null ? "Start" : "Retake"} <Icon name="chevron-right" size={14} />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}

// ─── Review session ─────────────────────────────────────────────────────────

interface Answer {
  correct: boolean;
  hinted: boolean;
  /** One line for the summary, as the item was shown (with its fresh numbers). */
  label: string;
}

/** The daily review session (PLAN_LEARN §6.2); with `?concept=<id>`, a two-question fix for one concept. */
export function ReviewSessionPage() {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const today = dayKey(Date.now(), lab.settings.timeZone);
  // The session is fixed when it opens: answering moves items in the queue, the session doesn't.
  const [session] = useState(() => {
    const conceptId = new URLSearchParams(window.location.search).get("concept");
    const concept = conceptId ? getConcept(conceptId) : undefined;
    const q = todayQueue(lab, today);
    const ids = conceptId ? (concept ? fixItQuestions(concept.id, lab.review, hashSeed(`${today}:fix:${concept.id}`)) : []) : q.due.filter(isKnownItem);
    const before = Object.fromEntries(ids.map((id) => [id, lab.review[id]?.box ?? 0]));
    return { conceptId, concept, ids, before, later: conceptId ? 0 : q.later, doneBefore: q.done };
  });
  const [pos, setPos] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [finished, setFinished] = useState(false);
  const [xp, setXp] = useState(0);
  const completed = useRef(false);
  const { ids, concept } = session;
  const daily = !session.conceptId;

  const record = (id: string, correct: boolean, hinted: boolean, label: string) => {
    setAnswers((a) => ({ ...a, [id]: { correct, hinted, label } }));
    if (id.startsWith("term:")) store.answerFlashcard(id.slice(5), correct);
    else store.answerReview(id, correct, hinted);
  };
  const advance = () => {
    if (pos + 1 < ids.length) {
      setPos(pos + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    setFinished(true);
    window.scrollTo({ top: 0 });
    if (daily && !completed.current) {
      completed.current = true;
      const amount = store.completeReviewSession();
      setXp(amount);
      if (amount > 0) toast(`Today's review done · +${amount} XP`);
    }
  };

  const lesson = concept?.lessons.map(getLesson).find(Boolean);
  const title = concept ? `Fix it: ${concept.name}` : "Today's review";

  if (session.conceptId && !concept) {
    return (
      <div className="ml-page">
        <Empty title="This concept isn't available" action={<Link to="/learn/practice" className="ml-text-link">Back to Practice</Link>}>
          The link may be out of date.
        </Empty>
      </div>
    );
  }

  if (ids.length === 0) {
    const next = nextReview(lab.review, today, session.later);
    return (
      <div className="ml-page">
        <Empty
          icon={concept ? "book" : "check-circle"}
          title={concept ? "No questions for this concept yet" : session.doneBefore ? "Today's review is done" : "Nothing due today"}
          action={
            <div className="ml-actions ml-review-empty-actions">
              <Link to="/learn/practice" className="ml-btn ml-btn--secondary ml-btn--md">
                Back to Practice
              </Link>
              {concept && lesson ? (
                <Link to={`/learn/lessons/${lesson.id}`} className="ml-btn ml-btn--primary ml-btn--md">
                  Read the lesson
                </Link>
              ) : (
                <Link to="/learn/course" className="ml-btn ml-btn--primary ml-btn--md">
                  Continue learning
                </Link>
              )}
            </div>
          }
        >
          {concept
            ? `Read the lesson on ${concept.name.toLowerCase()} to practise it.`
            : next
              ? `Next review: ${dayLabel(next.day, today)} · ${plural(next.count, "item")}. Come back then, or keep learning.`
              : "Questions you answer in lessons and checks come back here, spaced out so they stick."}
        </Empty>
      </div>
    );
  }

  const id = ids[pos];
  const isTerm = id.startsWith("term:");

  return (
    <div className="ml-page ml-review-page">
      <div className="ml-review">
        <div className="ml-review-top">
          <Link to="/learn/practice" className="ml-back">
            <Icon name="arrow-left" size={16} />
            <span>Practice</span>
          </Link>
          <h1 className="ml-review-title">{title}</h1>
          {concept && lesson && !finished && (
            <Link to={`/learn/lessons/${lesson.id}`} className="ml-review-lesson">
              <Icon name="book" size={14} /> Taught in: {lesson.title}
            </Link>
          )}
        </div>
        {finished ? (
          <ReviewSummary ids={ids} before={session.before} answers={answers} lab={lab} today={today} xp={xp} daily={daily} doneBefore={session.doneBefore} later={session.later} concept={concept} lessonId={lesson?.id} lessonTitle={lesson?.title} />
        ) : (
          <div className="lp-check ml-review-session">
            <div className="lp-check-progress">
              <span className="lp-kicker num">
                {isTerm ? "Term" : "Question"} {pos + 1} of {ids.length}
              </span>
              <span className="lp-check-dots" aria-hidden="true">
                {ids.map((x, i) => {
                  const a = answers[x];
                  return <span key={x} className={cx("lp-step-dot", a && (a.correct ? "is-right" : "is-wrong"), i === pos && !a && "is-current")} />;
                })}
              </span>
            </div>
            <div key={id} className="ml-review-step">
              {isTerm ? (
                <FlashcardStep
                  termId={id.slice(5)}
                  onAnswer={(knew) => {
                    record(id, knew, false, itemLabel(id));
                    advance();
                  }}
                />
              ) : (
                <QuestionStep qid={id} seed={hashSeed(`${today}:${id}`)} last={pos + 1 >= ids.length} onAnswer={(ok, hinted, label) => record(id, ok, hinted, label)} onNext={advance} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Enter/Space on a focused button or link (other than an answer choice) is the browser's to handle. */
function keyTarget(e: KeyboardEvent): { typing: boolean; onControl: boolean } {
  const t = e.target instanceof HTMLElement ? e.target : null;
  const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
  const onControl = !!t && !!t.closest("button, a, summary") && !t.closest(".lp-choice");
  return { typing, onControl };
}

function QuestionStep({ qid, seed, last, onAnswer, onNext }: { qid: string; seed: number; last: boolean; onAnswer: (correct: boolean, hinted: boolean, label: string) => void; onNext: () => void }) {
  const base = getQuestion(qid)!;
  const q = useMemo(() => shownQuestion(base, seed), [base, seed]);
  const options = useMemo(() => (q.options ? shuffled(q.options, seededRandom(hashSeed(`${seed}:options`))) : undefined), [q, seed]);
  const [value, setValue] = useState("");
  const [hints, setHints] = useState(0);
  const [graded, setGraded] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);
  const right = graded && gradeShown(q, value);

  const submit = () => {
    if (graded || !value.trim()) return;
    const ok = gradeShown(q, value);
    setGraded(true);
    onAnswer(ok, hints > 0, questionLabel(q));
  };
  const hint = () => {
    if (graded || !q.hints || hints >= q.hints.length) return;
    setHints(hints + 1);
  };

  useEffect(() => {
    if (graded) nextRef.current?.focus();
  }, [graded]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const { typing, onControl } = keyTarget(e);
      if (e.key === "Enter") {
        if (onControl) return;
        e.preventDefault();
        if (graded) onNext();
        else submit();
        return;
      }
      if (typing) return;
      if (e.key === "h" || e.key === "H") {
        hint();
        return;
      }
      if (!graded && options && /^[1-9]$/.test(e.key)) {
        const o = options[Number(e.key) - 1];
        if (o) setValue(o.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const pickedRationale = graded && !right && options ? options.find((o) => o.id === value)?.rationale : undefined;
  const lesson = graded && !right ? getLesson(q.lesson) : undefined;

  return (
    <>
      {q.scenario && (
        <p className="lp-scenario">
          <Rich text={q.scenario} />
        </p>
      )}
      <p className="lp-prompt">
        <Rich text={q.prompt} />
      </p>
      {options ? (
        <div className="lp-choices" role="radiogroup" aria-label="Answer">
          {options.map((o, i) => {
            const on = value === o.id;
            const isRight = graded && o.id === q.correct;
            const isWrong = graded && on && o.id !== q.correct;
            return (
              <button key={o.id} type="button" role="radio" aria-checked={on} disabled={graded && !on && !isRight} className={cx("lp-choice", on && "is-on", isRight && "is-right", isWrong && "is-wrong", graded && "is-locked")} onClick={() => !graded && setValue(o.id)}>
                <span className="lp-choice-key num" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="lp-choice-label">
                  <Rich text={o.label} />
                </span>
                {isRight && <Icon name="check" size={16} className="lp-choice-mark" />}
              </button>
            );
          })}
        </div>
      ) : (
        <label className={cx("lp-numeric", graded && "is-locked")}>
          <span className="ml-sr">Your answer</span>
          <input inputMode="decimal" autoComplete="off" value={value} disabled={graded} placeholder="Your answer" onChange={(e) => setValue(e.target.value)} autoFocus />
          {q.numeric?.unit && <span className="lp-numeric-unit">{q.numeric.unit}</span>}
        </label>
      )}
      {hints > 0 && q.hints && (
        <ol className="lp-hints" aria-label="Hints">
          {q.hints.slice(0, hints).map((h, i) => (
            <li key={i}>
              <Icon name="bulb" size={15} />
              <span>
                <Rich text={h} />
              </span>
            </li>
          ))}
        </ol>
      )}
      {graded && (
        <div className={cx("lp-feedback", right ? "is-right" : "is-wrong")} role="status" aria-live="polite">
          <Icon name={right ? "check-circle" : "info"} size={18} />
          <div>
            <b>{right ? (hints > 0 ? "Correct, with a hint." : "Correct.") : q.numeric ? `Not quite. The answer is ${q.numeric.answer.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${q.numeric.unit}.` : "Not quite."} </b>
            {pickedRationale && (
              <span className="lp-rationale">
                <Rich text={pickedRationale} />{" "}
              </span>
            )}
            <Rich text={q.explanation} />
            {lesson && (
              <>
                {" "}
                <Link to={`/learn/lessons/${lesson.id}`} className="ml-text-link">
                  Review: {lesson.title}
                </Link>
              </>
            )}
            {!right && <span className="lp-retry-note"> This one comes back tomorrow.</span>}
          </div>
        </div>
      )}
      <div className="lp-inline-actions">
        {!graded ? (
          <>
            <button type="button" className="ml-btn ml-btn--primary ml-btn--md" disabled={!value.trim()} onClick={submit}>
              Check
            </button>
            {q.hints && q.hints.length > 0 && (
              <button type="button" className="ml-btn ml-btn--tertiary ml-btn--md" onClick={hint} disabled={hints >= q.hints.length} aria-keyshortcuts="H">
                <Icon name="bulb" size={18} /> {hints === 0 ? "Hint" : `Hint ${Math.min(hints + 1, q.hints.length)}/${q.hints.length}`}
              </button>
            )}
          </>
        ) : (
          <button ref={nextRef} type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={onNext}>
            {last ? "Finish review" : "Next"} <Icon name="arrow-right" size={16} />
          </button>
        )}
        <span className="ml-review-keys" aria-hidden="true">
          {options && (
            <>
              <Kbd>1</Kbd>–<Kbd>{Math.min(options.length, 9)}</Kbd> choose ·{" "}
            </>
          )}
          <Kbd>Enter</Kbd> {graded ? "next" : "check"}
          {!graded && q.hints && q.hints.length > 0 && (
            <>
              {" "}
              · <Kbd>H</Kbd> hint
            </>
          )}
        </span>
      </div>
    </>
  );
}

function FlashcardStep({ termId, onAnswer }: { termId: string; onAnswer: (knew: boolean) => void }) {
  const term = getTerm(termId)!;
  const [flipped, setFlipped] = useState(false);
  const answered = useRef(false);
  const lesson = term.lesson ? getLesson(term.lesson) : undefined;

  const answer = (knew: boolean) => {
    if (answered.current) return;
    answered.current = true;
    onAnswer(knew);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const { typing, onControl } = keyTarget(e);
      if (typing) return;
      if ((e.key === " " || e.key === "Enter") && !onControl && !flipped) {
        e.preventDefault();
        setFlipped(true);
        return;
      }
      if (flipped && e.key === "1") answer(false);
      if (flipped && e.key === "2") answer(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <div className={cx("ml-review-card", flipped && "is-flipped")}>
        <span className="ml-review-card-kicker">Do you know this term?</span>
        <p className="ml-review-card-term">{term.term}</p>
        {term.aka && term.aka.length > 0 && <p className="ml-review-card-aka">Also: {term.aka.join(", ")}</p>}
        {flipped ? (
          <div className="ml-review-card-back">
            <span className="lp-kicker">In plain words</span>
            <p className="ml-review-card-plain">{term.plain}</p>
            <p className="ml-review-card-def">{term.definition}</p>
            {lesson && (
              <Link to={`/learn/lessons/${lesson.id}`} className="ml-review-card-lesson">
                <Icon name="book" size={14} /> {lesson.title}
              </Link>
            )}
          </div>
        ) : (
          <p className="ml-review-card-prompt">Say what it means to yourself, then check.</p>
        )}
      </div>
      <div className="lp-inline-actions ml-review-card-actions">
        {!flipped ? (
          <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={() => setFlipped(true)}>
            Show the answer
          </button>
        ) : (
          <>
            <button type="button" className="ml-btn ml-btn--secondary ml-btn--md" onClick={() => answer(false)} aria-keyshortcuts="1">
              Not yet
            </button>
            <button type="button" className="ml-btn ml-btn--primary ml-btn--md" onClick={() => answer(true)} aria-keyshortcuts="2">
              <Icon name="check" size={16} /> Knew it
            </button>
          </>
        )}
        <span className="ml-review-keys" aria-hidden="true">
          {flipped ? (
            <>
              <Kbd>1</Kbd> not yet · <Kbd>2</Kbd> knew it
            </>
          ) : (
            <>
              <Kbd>Space</Kbd> flip
            </>
          )}
        </span>
      </div>
    </>
  );
}

function ReviewSummary({
  ids,
  before,
  answers,
  lab,
  today,
  xp,
  daily,
  doneBefore,
  later,
  concept,
  lessonId,
  lessonTitle,
}: {
  ids: string[];
  before: Record<string, number>;
  answers: Record<string, Answer>;
  lab: LabData;
  today: string;
  xp: number;
  daily: boolean;
  doneBefore: boolean;
  later: number;
  concept?: Concept;
  lessonId?: string;
  lessonTitle?: string;
}) {
  const { navigate } = useRouter();
  const mastery = useMastery(lab);
  const answered = ids.filter((id) => answers[id]);
  const right = answered.filter((id) => answers[id].correct).length;
  const moves = answered.map((id) => {
    const from = before[id] ?? 0;
    const item = lab.review[id];
    const to = item?.box ?? from;
    const dir = from === 0 ? "new" : to > from ? "up" : to < from ? "down" : "same";
    return { id, from, to, due: item?.due, dir, label: answers[id].label };
  });
  const count = (dir: string) => moves.filter((m) => m.dir === dir).length;
  const tally = ([["up", "up"], ["down", "back"], ["same", "stayed"], ["new", "new to review"]] as const)
    .filter(([dir]) => count(dir) > 0)
    .map(([dir, word]) => `${count(dir)} ${word}`)
    .join(" · ");

  return (
    <div className="ml-review-done" aria-live="polite">
      <span className="ml-review-done-icon">
        <Icon name="check-circle" size={28} />
      </span>
      <div className="ml-stack-2">
        <h2 className="lp-beat-title">Review complete</h2>
        <p className="ml-review-done-score num">
          <span>
            {right} of {answered.length} right
          </span>
          {xp > 0 && <span className="ml-review-xp">+{xp} XP</span>}
        </p>
        <p className="ml-muted">
          {concept
            ? `${concept.name} is at ${MASTERY_LABEL[mastery[concept.id] ?? 0]} now. A few right answers over different days move it up.`
            : later > 0
              ? `${later} more tomorrow. That's the daily limit: short sessions stick better than long ones.`
              : daily && xp === 0 && doneBefore
                ? "Today's XP for review was already counted."
                : "That's everything due today."}
        </p>
      </div>

      <section className="ml-review-moves" aria-labelledby="ml-review-moves-h">
        <div className="ml-review-moves-head">
          <h3 id="ml-review-moves-h">What moved</h3>
          <span className="ml-muted ml-small num">{tally}</span>
        </div>
        <ul className="ml-review-moves-list">
          {moves.map((m) => (
            <li key={m.id} className={`is-${m.dir}`}>
              <span className="ml-review-move-icon" aria-hidden="true">
                <Icon name={m.dir === "same" ? "minus" : m.dir === "new" ? "plus" : "arrow-right"} size={14} />
              </span>
              <span className="ml-review-move-label">
                {m.id.startsWith("term:") && <span className="ml-review-move-kind">Term</span>}
                {m.label}
              </span>
              <span className="ml-review-move-box num">
                {m.from === 0 ? "New" : `Box ${m.from}`} → Box {m.to}
                <span className="ml-review-move-when">{m.due ? inDays(m.due, today) : ""}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="ml-review-moves-note">A right answer moves an item up a box, so it comes back later. A miss brings it back tomorrow, in box 1.</p>
      </section>

      {concept && lessonId && (
        <Link to={`/learn/lessons/${lessonId}`} className="ml-review-lesson">
          <Icon name="book" size={14} /> Re-read the lesson: {lessonTitle}
        </Link>
      )}
      <div className="ml-actions ml-review-done-actions">
        <Button variant="secondary" size="lg" iconLeft="arrow-left" onClick={() => navigate("/learn/practice")}>
          Back to Practice
        </Button>
        <Button variant="primary" size="lg" iconRight="arrow-right" onClick={() => navigate("/learn/course")}>
          Continue learning
        </Button>
      </div>
    </div>
  );
}
