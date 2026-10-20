import { useEffect, useMemo, useState } from "react";
import {
  CONCEPTS,
  GLOSSARY,
  KNOWLEDGE_CHECKS,
  LEARNING_PATHS,
  LESSONS,
  TOPICS,
  TOPIC_BY_ID,
  checkId,
  getConcept,
  getLesson,
  pathProgress,
  stepDone,
  type LearningPath,
  type PathStep,
  type TopicId,
} from "@market-lab/academy";
import { LEVEL_LABEL, SKILL_BY_ID, levelOf } from "@market-lab/learning";
import { MISSIONS, getMission } from "@market-lab/missions";
import { Card, FilterChips, PageHead, ProBadge, SubNav } from "../components/Page";
import { Button, Empty, Icon, Meter, cx } from "../components/ui";
import { plural } from "../format";
import { usePlan } from "../host";
import { LOOKUP } from "../labels";
import { useProgress } from "../progress";
import { Link, useRouter } from "../router";
import { useLab, useStore } from "../store";

function stepLabel(s: PathStep): string {
  return s.kind === "lesson" ? (getLesson(s.id)?.title ?? s.id) : s.kind === "mission" ? getMission(s.id).title : LOOKUP.check(s.id);
}

function stepIcon(s: PathStep): string {
  return s.kind === "lesson" ? "book" : s.kind === "mission" ? "flag" : "quiz";
}

function useStepNav() {
  const store = useStore();
  const { navigate } = useRouter();
  return (s: PathStep) =>
    s.kind === "lesson" ? navigate(`/learn/lessons/${s.id}`) : s.kind === "mission" ? navigate(`/play/${store.startMission(s.id)}`) : navigate(`/learn/checks/${s.id}`);
}

/** A sequence built from the user's three weakest skills: a lesson, a mission and a check for each. */
function personalPath(lab: ReturnType<typeof useLab>, done: (s: PathStep) => boolean): LearningPath {
  const skills = (Object.keys(lab.skills) as (keyof typeof lab.skills)[]).filter((k) => k !== "reflection_review").sort((a, b) => lab.skills[a].theta - lab.skills[b].theta);
  const steps: PathStep[] = [];
  for (const skill of skills) {
    const topics = TOPICS.filter((t) => t.skill === skill);
    const lesson = LESSONS.filter((l) => topics.some((t) => t.id === l.topic) && l.tier === "free").find((l) => !done({ kind: "lesson", id: l.id }));
    const mission = MISSIONS.find((m) => m.skillPrimary === skill && !done({ kind: "mission", id: m.id })) ?? MISSIONS.find((m) => m.skillPrimary === skill);
    if (lesson) steps.push({ kind: "lesson", id: lesson.id });
    if (mission && !steps.some((s) => s.id === mission.id)) steps.push({ kind: "mission", id: mission.id });
    if (topics[0]) steps.push({ kind: "check", id: checkId(topics[0].id) });
    if (steps.length >= 9) break;
  }
  return {
    id: "personal",
    title: "Your personal sequence",
    level: "all",
    tier: "free",
    description: `Built from your lowest skill estimates: ${skills
      .slice(0, 3)
      .map((s) => `${SKILL_BY_ID[s].name} (${LEVEL_LABEL[levelOf(lab.skills[s].theta)]})`)
      .join(", ")}. It updates as you learn.`,
    outcomes: [],
    steps: steps.slice(0, 9),
  };
}

// ─── Learning paths ─────────────────────────────────────────────────────────

export function PathsPage() {
  const lab = useLab();
  const { pro } = usePlan();
  const { navigate } = useRouter();
  const go = useStepNav();
  const { snapshot } = useProgress(lab);
  const personal = personalPath(lab, (s) => stepDone(s, snapshot) !== null);
  const pp = pathProgress(personal, snapshot);

  return (
    <div className="ml-page">
      <PageHead title="Learning Paths" sub="Ordered sequences of lessons, missions and checks. Each concept is practised right after it's explained." />
      <SubNav module="learn" />
      <Card eyebrow="Personalised" title={personal.title} className="ml-card--feature">
        <p className="ml-muted">{personal.description}</p>
        <ol className="ml-path-strip">
          {personal.steps.map((s, i) => (
            <li key={`${s.kind}${s.id}`} className={cx(pp.done[i] !== null && "is-done", pp.nextIndex === i && "is-next")}>
              <button type="button" onClick={() => go(s)}>
                <Icon name={pp.done[i] ? "check" : stepIcon(s)} size={14} />
                <span>{stepLabel(s)}</span>
              </button>
            </li>
          ))}
        </ol>
      </Card>
      <ul className="ml-paths">
        {LEARNING_PATHS.map((p) => {
          const pr = pathProgress(p, snapshot);
          const locked = p.tier === "pro" && !pro;
          return (
            <li key={p.id} className={cx("ml-pathcard", locked && "is-locked")}>
              <div className="ml-pathcard-head">
                <span className="ml-eyebrow">
                  {p.level === "all" ? "All levels" : p.level === "beginner" ? "Beginner" : "Intermediate"} · {plural(p.steps.length, "step")}
                </span>
                {p.tier === "pro" && <ProBadge />}
              </div>
              <h2>
                <Link to={`/learn/paths/${p.id}`}>{p.title}</Link>
              </h2>
              <p className="ml-muted">{p.description}</p>
              <Meter value={pr.pct} label={`${p.title} progress`} />
              <div className="ml-row ml-row--between">
                <span className="ml-small ml-muted num">
                  {pr.completed} of {pr.total} done{pr.completedAt ? " · completed" : ""}
                </span>
                <Button size="sm" variant={pr.completed > 0 && !pr.completedAt ? "primary" : "secondary"} iconRight={locked ? undefined : "arrow-right"} iconLeft={locked ? "lock" : undefined} onClick={() => navigate(locked ? "/pricing" : `/learn/paths/${p.id}`)}>
                  {locked ? "Pro" : pr.completedAt ? "Review" : pr.completed > 0 ? "Continue" : "Start"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function PathDetailPage({ pathId }: { pathId: string }) {
  const lab = useLab();
  const { pro } = usePlan();
  const { navigate } = useRouter();
  const go = useStepNav();
  const { snapshot } = useProgress(lab);
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  if (!path) return <Empty title="Path not found" action={<Link to="/learn/paths" className="ml-text-link">All paths</Link>} />;
  const pr = pathProgress(path, snapshot);
  const locked = path.tier === "pro" && !pro;

  return (
    <div className="ml-page">
      <PageHead
        back={{ to: "/learn/paths", label: "Learning Paths" }}
        eyebrow={`${plural(path.steps.length, "step")} · ${pr.completed} done`}
        title={path.title}
        sub={path.description}
        actions={
          locked ? (
            <Button variant="primary" iconLeft="sparkle" onClick={() => navigate("/pricing")}>
              Unlock with Pro
            </Button>
          ) : pr.nextIndex !== null ? (
            <Button variant="primary" iconRight="arrow-right" onClick={() => go(path.steps[pr.nextIndex!])}>
              {pr.completed ? "Continue" : "Start the path"}
            </Button>
          ) : undefined
        }
      />
      <Meter value={pr.pct} label="Path progress" />
      <div className="ml-split">
        <Card title="Steps">
          <ol className="ml-steps-path">
            {path.steps.map((s, i) => {
              const done = pr.done[i] !== null;
              const lessonLocked = s.kind === "lesson" && getLesson(s.id)?.tier === "pro" && !pro;
              return (
                <li key={`${s.kind}${s.id}`} className={cx(done && "is-done", pr.nextIndex === i && "is-next")}>
                  <span className="ml-step-dot num" aria-hidden="true">
                    {done ? <Icon name="check" size={14} /> : i + 1}
                  </span>
                  <div className="ml-steps-path-main">
                    <span className="ml-eyebrow">{s.kind === "lesson" ? "Lesson" : s.kind === "mission" ? "Mission" : "Knowledge check"}</span>
                    <b>{stepLabel(s)}</b>
                    {done && <span className="ml-sr">completed</span>}
                  </div>
                  <Button size="sm" variant={pr.nextIndex === i ? "primary" : "tertiary"} disabled={locked || lessonLocked} onClick={() => go(s)}>
                    {done ? "Revisit" : pr.nextIndex === i ? "Start" : "Open"}
                  </Button>
                </li>
              );
            })}
          </ol>
        </Card>
        <Card title="You'll be able to">
          <ul className="ml-list ml-list--check">
            {path.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

// ─── Lessons ────────────────────────────────────────────────────────────────

export function LessonsPage() {
  const lab = useLab();
  const { pro } = usePlan();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicId | "all">("all");
  const [status, setStatus] = useState<"all" | "new" | "started" | "done">("all");
  const statusOf = (id: string) => (lab.lessons[id]?.completedAt ? "done" : lab.lessons[id] ? "started" : "new");
  const q = query.trim().toLowerCase();
  const shown = LESSONS.filter(
    (l) => (topic === "all" || l.topic === topic) && (status === "all" || statusOf(l.id) === status) && (!q || `${l.title} ${l.summary}`.toLowerCase().includes(q)),
  );
  const done = LESSONS.filter((l) => statusOf(l.id) === "done").length;

  return (
    <div className="ml-page">
      <PageHead title="Lessons" sub={`Short, practical lessons with illustrations, interactive examples and a quick check. ${done} of ${LESSONS.length} completed.`} />
      <SubNav module="learn" />
      <div className="ml-toolbar">
        <label className="ml-search">
          <Icon name="search" size={16} />
          <span className="ml-sr">Search lessons</span>
          <input type="search" placeholder="Search lessons" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label className="ml-select">
          <span>Topic</span>
          <select value={topic} onChange={(e) => setTopic(e.target.value as TopicId | "all")}>
            <option value="all">All topics</option>
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <FilterChips
        label="Lesson status"
        value={status}
        onChange={setStatus}
        options={[
          { value: "all", label: "All", count: LESSONS.length },
          { value: "new", label: "Not started" },
          { value: "started", label: "In progress" },
          { value: "done", label: "Completed", count: done },
        ]}
      />
      {shown.length === 0 ? (
        <Empty icon="book" title="No lessons match" action={<Button variant="secondary" onClick={() => { setQuery(""); setTopic("all"); setStatus("all"); }}>Clear filters</Button>}>
          Try a broader search.
        </Empty>
      ) : (
        <ul className="ml-lesson-grid-list">
          {shown.map((l) => {
            const st = statusOf(l.id);
            return (
              <li key={l.id}>
                <Link to={`/learn/lessons/${l.id}`} className={cx("ml-lesson-card", st === "done" && "is-done")}>
                  <span className="ml-lesson-card-top">
                    <span className="ml-eyebrow">{TOPIC_BY_ID[l.topic].name}</span>
                    {l.tier === "pro" && !pro ? <ProBadge /> : st === "done" ? <Icon name="check-circle" size={16} className="ml-accent-text" /> : null}
                  </span>
                  <b>{l.title}</b>
                  <span className="ml-muted ml-small">{l.summary}</span>
                  <span className="ml-meta">
                    {l.level === "beginner" ? "Beginner" : "Intermediate"} · {l.minutes} min{st === "started" ? " · in progress" : ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Concept library ────────────────────────────────────────────────────────

export function ConceptsPage({ conceptId }: { conceptId?: string }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<TopicId | "all">("all");
  const current = conceptId ? getConcept(conceptId) : undefined;
  const q = query.trim().toLowerCase();
  const shown = CONCEPTS.filter((c) => (cat === "all" || c.category === cat) && (!q || `${c.name} ${c.summary}`.toLowerCase().includes(q)));
  const counts = useMemo(() => Object.fromEntries(TOPICS.map((t) => [t.id, CONCEPTS.filter((c) => c.category === t.id).length])), []);

  return (
    <div className="ml-page">
      <PageHead title="Concept Library" sub={`${CONCEPTS.length} core ideas, each with a definition, an example, related concepts and where to practise it.`} />
      <SubNav module="learn" />
      <div className="ml-library">
        <div className={cx("ml-library-list", current && "has-detail")}>
          <label className="ml-search">
            <Icon name="search" size={16} />
            <span className="ml-sr">Search concepts</span>
            <input type="search" placeholder="Search concepts" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <label className="ml-select">
            <span>Category</span>
            <select value={cat} onChange={(e) => setCat(e.target.value as TopicId | "all")}>
              <option value="all">All categories ({CONCEPTS.length})</option>
              {TOPICS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({counts[t.id]})
                </option>
              ))}
            </select>
          </label>
          {shown.length === 0 ? (
            <p className="ml-muted">No concepts match.</p>
          ) : (
            <ul className="ml-concept-list">
              {shown.map((c) => (
                <li key={c.id}>
                  <Link to={`/learn/concepts/${c.id}`} className={cx("ml-concept-link", current?.id === c.id && "is-on")} aria-current={current?.id === c.id ? "page" : undefined}>
                    <b>{c.name}</b>
                    <span className="ml-muted ml-small">{c.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="ml-library-detail">
          {current ? (
            <article className="ml-card ml-concept">
              <Link to="/learn/concepts" className="ml-back ml-show-sm">
                <Icon name="arrow-left" size={16} /> All concepts
              </Link>
              <span className="ml-eyebrow">{TOPIC_BY_ID[current.category].name}</span>
              <h2 className="ml-concept-title">{current.name}</h2>
              <p className="ml-lead">{current.summary}</p>
              {current.body.map((p) => (
                <p key={p} className="ml-body">
                  {p}
                </p>
              ))}
              <figure className="ml-example">
                <figcaption>
                  <Icon name="calculator" size={15} /> Example
                </figcaption>
                <p>{current.example}</p>
              </figure>
              {current.related.length > 0 && (
                <div className="ml-stack-2">
                  <span className="ml-eyebrow">Related concepts</span>
                  <div className="ml-pills">
                    {current.related.map((r) => (
                      <Link key={r} to={`/learn/concepts/${r}`} className="ml-pill">
                        {getConcept(r)?.name ?? r}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {(current.lessons.length > 0 || current.missions.length > 0) && (
                <div className="ml-stack-2">
                  <span className="ml-eyebrow">Learn and practise</span>
                  <div className="ml-pills">
                    {current.lessons.map((l) => (
                      <Link key={l} to={`/learn/lessons/${l}`} className="ml-pill">
                        <Icon name="book" size={14} /> {getLesson(l)?.title ?? l}
                      </Link>
                    ))}
                    {current.missions.map((m) => (
                      <Link key={m} to={`/mission/${m}`} className="ml-pill">
                        <Icon name="flag" size={14} /> {getMission(m).title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ) : conceptId ? (
            <Empty icon="library" title="Concept not found" action={<Link to="/learn/concepts" className="ml-text-link">All concepts</Link>}>
              The link may be out of date. Pick a concept from the list.
            </Empty>
          ) : (
            <Empty icon="library" title="Pick a concept">
              Choose a concept from the list to read its definition, an example and where to practise it.
            </Empty>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Glossary ───────────────────────────────────────────────────────────────

export function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState<string | null>(null);
  const q = query.trim().toLowerCase();
  const terms = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
  const shown = terms.filter((t) => !q || `${t.term} ${t.aka?.join(" ") ?? ""} ${t.definition}`.toLowerCase().includes(q));
  const letters = [...new Set(terms.map((t) => t.term[0].toUpperCase()))];
  const byId = new Map(GLOSSARY.map((t) => [t.id, t]));

  useEffect(() => {
    if (!focus) return;
    document.getElementById(`term-${focus}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById(`term-${focus}`)?.focus({ preventScroll: true });
  }, [focus]);

  const jump = (id: string) => {
    setQuery("");
    setFocus(null);
    window.setTimeout(() => setFocus(id), 0);
  };

  return (
    <div className="ml-page">
      <PageHead title="Glossary" sub={`${GLOSSARY.length} trading terms in plain language, each with a precise definition and related terms.`} />
      <SubNav module="learn" />
      <div className="ml-toolbar">
        <label className="ml-search">
          <Icon name="search" size={16} />
          <span className="ml-sr">Search the glossary</span>
          <input type="search" placeholder="Search terms, e.g. spread or SL" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>
      {!q && (
        <nav className="ml-az" aria-label="Jump to letter">
          {letters.map((l) => (
            <button key={l} type="button" onClick={() => jump(terms.find((t) => t.term[0].toUpperCase() === l)!.id)}>
              {l}
            </button>
          ))}
        </nav>
      )}
      {shown.length === 0 ? (
        <Empty icon="search" title={`Nothing found for “${query}”`} action={<Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>}>
          Try a shorter word, or an abbreviation like P&L or ATR.
        </Empty>
      ) : (
        <dl className="ml-glossary">
          {shown.map((t) => (
            <div key={t.id} id={`term-${t.id}`} tabIndex={-1} className={cx("ml-term", focus === t.id && "is-focus")}>
              <dt>
                {t.term}
                {t.aka?.length ? <span className="ml-muted"> · {t.aka.join(", ")}</span> : null}
              </dt>
              <dd>
                <p className="ml-body">{t.definition}</p>
                <p className="ml-plain">
                  <span className="ml-eyebrow">In plain words</span>
                  {t.plain}
                </p>
                <div className="ml-term-links">
                  {t.related.map((r) => (
                    <button key={r} type="button" className="ml-pill" onClick={() => jump(r)}>
                      {byId.get(r)?.term ?? r}
                    </button>
                  ))}
                  {t.lesson && (
                    <Link to={`/learn/lessons/${t.lesson}`} className="ml-text-link ml-small">
                      Lesson: {getLesson(t.lesson)?.title}
                    </Link>
                  )}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

// ─── Knowledge checks ───────────────────────────────────────────────────────

export function ChecksPage() {
  const lab = useLab();
  const checks = KNOWLEDGE_CHECKS.filter((c) => c.kind === "check");
  const bestOf = (id: string) => (lab.checks[id] ?? []).reduce<number | null>((b, a) => Math.max(b ?? 0, Math.round((a.correct / a.total) * 100)), null);
  const review = checks
    .map((c) => ({ c, best: bestOf(c.id) }))
    .filter((x) => x.best !== null && x.best < 80)
    .sort((a, b) => a.best! - b.best!)
    .slice(0, 3);

  return (
    <div className="ml-page">
      <PageHead title="Knowledge Checks" sub="Five-question checks per topic: multiple choice, scenarios and short exercises, with an explanation for every answer. Longer topic tests are in Missions › Assessments." />
      <SubNav module="learn" />
      {review.length > 0 && (
        <Card title="Suggested review" eyebrow="Your lowest topic scores">
          <ul className="ml-rows ml-rows--tight">
            {review.map(({ c, best }) => {
              const lesson = LESSONS.find((l) => l.topic === c.topic);
              return (
                <li key={c.id} className="ml-row-static">
                  <span className="ml-row-main">
                    <b>{TOPIC_BY_ID[c.topic].name}</b>
                    <span className="ml-muted num">Best {best}%</span>
                  </span>
                  {lesson && (
                    <Link to={`/learn/lessons/${lesson.id}`} className="ml-text-link ml-small">
                      Review {lesson.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
      <ul className="ml-assess-grid">
        {checks.map((c) => {
          const best = bestOf(c.id);
          const passed = (lab.checks[c.id] ?? []).some((a) => a.passed);
          return (
            <li key={c.id}>
              <Link to={`/learn/checks/${c.id}`} className={cx("ml-assess", passed && "is-passed")}>
                <span className="ml-assess-title">{TOPIC_BY_ID[c.topic].name}</span>
                <span className="ml-muted ml-small num">
                  {c.questionIds.length} questions · {best === null ? "not taken" : `best ${best}%`}
                </span>
                <Meter value={(best ?? 0) / 100} label={`${TOPIC_BY_ID[c.topic].name} best score`} />
                <span className={cx("ml-status", passed ? "ml-status--done" : best === null ? "ml-status--new" : "ml-status--active")}>{passed ? "Passed" : best === null ? "Not taken" : "Try again"}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
