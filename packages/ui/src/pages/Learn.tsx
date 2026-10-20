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
import { LEVEL_LABEL, SKILL_BY_ID, XP_RULES, levelOf } from "@market-lab/learning";
import { MISSIONS, getMission } from "@market-lab/missions";
import { LearningIllustration } from "../components/Art";
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

function stepKind(s: PathStep): string {
  return s.kind === "lesson" ? "Lesson" : s.kind === "mission" ? "Mission" : "Knowledge check";
}

function stepMinutes(s: PathStep): number {
  return s.kind === "lesson" ? (getLesson(s.id)?.minutes ?? 5) : s.kind === "mission" ? getMission(s.id).estMinutes : 4;
}

function stepXp(s: PathStep): number {
  return s.kind === "lesson" ? XP_RULES.lesson : s.kind === "mission" ? XP_RULES.missionByDifficulty[getMission(s.id).difficulty] : XP_RULES.checkPass;
}

function stepCta(s: PathStep): string {
  return s.kind === "lesson" ? "Open lesson" : s.kind === "mission" ? "Start mission" : "Take the check";
}

/** Artwork and icon for each path, after the design's path tiles. */
const PATH_ART: Record<string, { icon: string; variant: number }> = {
  beginner: { icon: "book", variant: 0 },
  risk: { icon: "shield", variant: 1 },
  technical: { icon: "chart", variant: 2 },
  intermediate: { icon: "layers", variant: 2 },
  psychology: { icon: "brain", variant: 3 },
};
const pathArt = (id: string) => PATH_ART[id] ?? { icon: "route", variant: 0 };
const LEVEL_NAME = { all: "All levels", beginner: "Beginner", intermediate: "Intermediate" } as const;
const pad2 = (n: number) => String(n).padStart(2, "0");

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

  const all = LEARNING_PATHS.map((p) => ({ p, pr: pathProgress(p, snapshot), locked: p.tier === "pro" && !pro }));
  const open = all.filter((x) => !x.locked);
  // Featured: the path you're in the middle of, else the first one with steps left.
  const featured = open.find((x) => x.pr.completed > 0 && x.pr.nextIndex !== null) ?? open.find((x) => x.pr.nextIndex !== null) ?? open[0];
  const others = all.filter((x) => x !== featured);
  const next = featured.pr.nextIndex !== null ? featured.p.steps[featured.pr.nextIndex] : null;
  const art = pathArt(featured.p.id);

  return (
    <div className="ml-page">
      <PageHead title="Learning Paths" sub="Ordered sequences of lessons, missions and checks. Each concept is practised right after it's explained." />
      <SubNav module="learn" />

      <div className="ml-learn-feature-row">
        <section className="ml-learn-feature" aria-label={featured.p.title}>
          <div className="ml-learn-feature-copy">
            <span className="ml-learn-feature-tag">
              <Icon name={art.icon} size={13} />
              {featured.pr.completed > 0 ? "Continue your path" : "Start here"}
            </span>
            <h2>{featured.p.title}</h2>
            <p>{featured.p.description}</p>
            <div className="ml-feature-progress">
              <div>
                <span>Your progress</span>
                <strong className="num">
                  {featured.pr.completed} <small>/ {plural(featured.pr.total, "step")}</small>
                </strong>
              </div>
              <div className="ml-bar ml-bar--thin" role="meter" aria-label={`${featured.p.title} progress`} aria-valuemin={0} aria-valuemax={featured.pr.total} aria-valuenow={featured.pr.completed}>
                <i style={{ width: `${featured.pr.pct * 100}%` }} />
              </div>
            </div>
            {next ? (
              <>
                <Button variant="primary" iconRight="arrow-right" onClick={() => go(next)}>
                  {featured.pr.completed > 0 ? "Continue learning" : "Start the path"}
                </Button>
                <small className="ml-next-lesson">
                  Up next: {stepLabel(next)} · {stepMinutes(next)} min
                </small>
              </>
            ) : (
              <Button variant="secondary" iconRight="arrow-right" onClick={() => navigate(`/learn/paths/${featured.p.id}`)}>
                Review the path
              </Button>
            )}
          </div>
          <div className="ml-learn-feature-art" aria-hidden="true">
            <span className="ml-orbit" />
            <span className="ml-orbit is-two" />
            <span className="ml-orbit is-three" />
            <span className="ml-plaque">
              <Icon name={art.icon} size={82} />
            </span>
            <span className="ml-art-coordinate num">
              {pad2(Math.min(featured.pr.total, (featured.pr.nextIndex ?? featured.pr.total - 1) + 1))} / {pad2(featured.pr.total)}
            </span>
          </div>
        </section>

        <aside className="ml-card ml-learning-note" aria-label="Up next">
          <span className="ml-learn-kicker">{next ? "Up next" : "Path complete"}</span>
          <span className="ml-note-bookmark" aria-hidden="true">
            <Icon name={next ? stepIcon(next) : "check-circle"} size={25} />
          </span>
          <h3>{next ? stepLabel(next) : "Every step done"}</h3>
          <p>{next ? `${stepKind(next)} · step ${featured.pr.nextIndex! + 1} of ${featured.pr.total} in ${featured.p.title}` : "Revisit a lesson, or pick another path below."}</p>
          {next && (
            <div className="ml-lesson-summary">
              <span>
                <Icon name="clock" size={14} />
                {stepMinutes(next)} min
              </span>
              <span>
                <Icon name="bolt" size={14} />
                <span className="num">{stepXp(next)} XP</span>
              </span>
            </div>
          )}
          <Button variant="secondary" iconRight="arrow-right" onClick={() => (next ? go(next) : navigate("/learn/lessons"))}>
            {next ? stepCta(next) : "Browse lessons"}
          </Button>
        </aside>
      </div>

      <div className="ml-learn-section-title">
        <h2>{others.length === all.length ? "Learning paths" : "More learning paths"}</h2>
        <span className="num">{plural(all.length, "path")}</span>
      </div>
      <ul className="ml-path-grid">
        {others.map(({ p, pr, locked }, i) => {
          const a = pathArt(p.id);
          const minutes = p.steps.reduce((s, st) => s + stepMinutes(st), 0);
          return (
            <li key={p.id}>
              <Link to={locked ? "/pricing" : `/learn/paths/${p.id}`} className={cx("ml-path-tile", `ml-tone-${i % 4}`, locked && "is-locked")}>
                <span className="ml-path-tile-art">
                  <span className="ml-path-category">{LEVEL_NAME[p.level]}</span>
                  {p.tier === "pro" && <span className="ml-path-pro">PRO</span>}
                  <LearningIllustration variant={a.variant} />
                </span>
                <span className="ml-path-tile-copy">
                  <span className="ml-path-meta">
                    <span>
                      <Icon name={a.icon} size={13} />
                      {plural(p.steps.length, "step")}
                    </span>
                    <span>
                      <Icon name="clock" size={12} />
                      {minutes} min
                    </span>
                  </span>
                  <span className="ml-path-title">{p.title}</span>
                  <span className="ml-path-desc">{p.description}</span>
                  <span className="ml-path-tile-progress">
                    <span className="ml-bar ml-bar--thin" aria-hidden="true">
                      <i style={{ width: `${pr.pct * 100}%` }} />
                    </span>
                    <span>
                      {pr.completed ? `${pr.completed} of ${pr.total} completed` : "A fresh place to start"}
                      <strong className="num">{pr.completed ? `${Math.round(pr.pct * 100)}%` : "—"}</strong>
                    </span>
                  </span>
                  <span className="ml-path-tile-action">
                    <strong>{locked ? "Explore Pro" : pr.completedAt ? "Review path" : pr.completed ? "Continue path" : "Explore path"}</strong>
                    <Icon name={locked ? "lock" : "arrow-right"} size={16} />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

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
  const minutes = path.steps.reduce((s, st) => s + stepMinutes(st), 0);

  return (
    <div className="ml-page">
      <PageHead
        back={{ to: "/learn/paths", label: "Learning Paths" }}
        eyebrow={`${LEVEL_NAME[path.level]} · ${plural(path.steps.length, "step")} · about ${minutes} min`}
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
      <section className="ml-card ml-path-detail">
        <div className="ml-path-detail-heading">
          <div>
            <div className="ml-feature-progress">
              <div>
                <span>Your progress</span>
                <strong className="num">
                  {pr.completed} <small>/ {plural(pr.total, "step")}</small>
                </strong>
              </div>
              <Meter value={pr.pct} label="Path progress" />
            </div>
            {path.outcomes.length > 0 && (
              <>
                <span className="ml-learn-kicker">You'll be able to</span>
                <ul className="ml-list ml-list--check">
                  {path.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <LearningIllustration variant={pathArt(path.id).variant} />
        </div>
        <ol className="ml-path-step-list">
          {path.steps.map((s, i) => {
            const done = pr.done[i] !== null;
            const lessonLocked = s.kind === "lesson" && getLesson(s.id)?.tier === "pro" && !pro;
            const isNext = pr.nextIndex === i;
            return (
              <li key={`${s.kind}${s.id}`}>
                <button type="button" className={cx(done && "is-done", isNext && "is-next")} disabled={locked || lessonLocked} onClick={() => go(s)}>
                  <span className="ml-path-step-number num" aria-hidden="true">
                    {done ? <Icon name="check" size={16} /> : pad2(i + 1)}
                  </span>
                  <span className="ml-path-step-main">
                    <strong>{stepLabel(s)}</strong>
                    <small>
                      {stepKind(s)} · {stepMinutes(s)} min
                    </small>
                  </span>
                  <span className="ml-step-state">{locked || lessonLocked ? "Pro" : done ? "Review" : isNext ? "Up next" : "Open"}</span>
                  <Icon name={locked || lessonLocked ? "lock" : "arrow-right"} size={16} />
                  <span className="ml-sr">{done ? ", completed" : ""}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
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
  const reset = () => {
    setQuery("");
    setTopic("all");
    setStatus("all");
  };

  return (
    <div className="ml-page">
      <PageHead title="Lessons" sub={`Short, practical lessons with illustrations, interactive examples and a quick check. ${done} of ${LESSONS.length} completed.`} />
      <SubNav module="learn" />
      <div className="ml-findbar">
        <label className="ml-findbar-search">
          <Icon name="search" size={17} />
          <span className="ml-sr">Search lessons</span>
          <input type="search" placeholder="Find a lesson…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label className="ml-findbar-select">
          <span className="ml-sr">Topic</span>
          <select value={topic} onChange={(e) => setTopic(e.target.value as TopicId | "all")}>
            <option value="all">All topics</option>
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <span className="ml-findbar-count num" aria-live="polite">
          {plural(shown.length, "lesson")}
        </span>
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
        <Empty icon="search" title="No matches yet" action={<Button variant="secondary" onClick={reset}>Clear filters</Button>}>
          Try a broader term or clear your search.
        </Empty>
      ) : (
        <ul className="ml-lesson-deck">
          {shown.map((l) => {
            const st = statusOf(l.id);
            const ti = TOPICS.findIndex((t) => t.id === l.topic);
            return (
              <li key={l.id}>
                <Link to={`/learn/lessons/${l.id}`} className={cx("ml-lesson-tile", st === "done" && "is-done")}>
                  <span className={cx("ml-lesson-visual", `ml-tone-${ti % 3}`)}>
                    <LearningIllustration variant={ti % 4} />
                    {l.tier === "pro" && !pro ? (
                      <span className="ml-lesson-flag">
                        <ProBadge />
                      </span>
                    ) : st !== "new" ? (
                      <span className="ml-lesson-flag ml-lesson-state">
                        {st === "done" ? (
                          <>
                            <Icon name="check" size={12} /> Completed
                          </>
                        ) : (
                          "In progress"
                        )}
                      </span>
                    ) : null}
                    <span className="ml-lesson-duration">
                      <Icon name="clock" size={12} />
                      {l.minutes} min
                    </span>
                  </span>
                  <span className="ml-lesson-copy">
                    <span className="ml-learn-kicker">{TOPIC_BY_ID[l.topic].name}</span>
                    <span className="ml-lesson-title">{l.title}</span>
                    <span className="ml-lesson-summary-text">{l.summary}</span>
                    <span className="ml-lesson-go">
                      {l.level === "beginner" ? "Beginner" : "Intermediate"} · interactive lesson
                      <Icon name="arrow-right" size={16} />
                    </span>
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
  const filters = (
    <>
      <label className="ml-findbar-search">
        <Icon name="search" size={17} />
        <span className="ml-sr">Search concepts</span>
        <input type="search" placeholder="Find a concept…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <label className="ml-findbar-select">
        <span className="ml-sr">Category</span>
        <select value={cat} onChange={(e) => setCat(e.target.value as TopicId | "all")}>
          <option value="all">All categories ({CONCEPTS.length})</option>
          {TOPICS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({counts[t.id]})
            </option>
          ))}
        </select>
      </label>
    </>
  );

  // Without a selected concept: the design's concept grid.
  if (!conceptId) {
    return (
      <div className="ml-page">
        <PageHead title="Concept Library" sub={`${CONCEPTS.length} core ideas, each with a definition, an example, related concepts and where to practise it.`} />
        <SubNav module="learn" />
        <div className="ml-findbar">
          {filters}
          <span className="ml-findbar-count num" aria-live="polite">
            {plural(shown.length, "concept")}
          </span>
        </div>
        {shown.length === 0 ? (
          <Empty
            icon="search"
            title="No matches yet"
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setCat("all");
                }}
              >
                Clear search
              </Button>
            }
          >
            Try a broader term or clear your search.
          </Empty>
        ) : (
          <ul className="ml-concept-grid">
            {shown.map((c, i) => (
              <li key={c.id} className="ml-concept-tile">
                <span className="ml-concept-number num" aria-hidden="true">
                  {pad2(i + 1)}
                </span>
                <Icon name={TOPIC_BY_ID[c.category].icon} size={26} />
                <span className="ml-learn-kicker">{TOPIC_BY_ID[c.category].name}</span>
                <h3>{c.name}</h3>
                <p>{c.summary}</p>
                <Link to={`/learn/concepts/${c.id}`} className="ml-text-arrow ml-accent-text">
                  Read the concept <Icon name="arrow-right" size={15} />
                  <span className="ml-sr">: {c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="ml-page">
      <PageHead title="Concept Library" sub={`${CONCEPTS.length} core ideas, each with a definition, an example, related concepts and where to practise it.`} />
      <SubNav module="learn" />
      <div className="ml-library">
        <div className={cx("ml-library-list", current && "has-detail")}>
          {filters}
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
              <Link to="/learn/concepts" className="ml-back">
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
          ) : (
            <Empty icon="library" title="Concept not found" action={<Link to="/learn/concepts" className="ml-text-link">All concepts</Link>}>
              The link may be out of date. Pick a concept from the list.
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
