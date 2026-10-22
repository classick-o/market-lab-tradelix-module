import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  CONCEPTS,
  GLOSSARY,
  LESSONS,
  MASTERY_LABEL,
  QUESTIONS,
  TOPICS,
  TOPIC_BY_ID,
  getConcept,
  getLesson,
  getTerm,
  isCorrect,
  masteryByConcept,
  seededRandom,
  shuffled,
  type Concept,
  type GlossaryTerm,
  type Lesson,
  type MasteryLevel,
  type Question,
  type TopicId,
} from "@market-lab/academy";
import { MISSIONS } from "@market-lab/missions";
import { Card, PageHead, Rich, SubNav } from "../components/Page";
import { Button, Empty, Icon, IconButton, Kbd, cx } from "../components/ui";
import { Feedback } from "../learn/parts";
import { formatDate, formatDayKey, plural } from "../format";
import { Link, useRouter } from "../router";
import { useLab, useStore, type LabData, type LessonNote } from "../store";

export type LibraryTab = "concepts" | "glossary" | "flashcards" | "saved";

// ─── Shared helpers ─────────────────────────────────────────────────────────

const TABS: { id: LibraryTab; label: string; to: string }[] = [
  { id: "concepts", label: "Concepts", to: "/learn/library" },
  { id: "glossary", label: "Glossary", to: "/learn/library/glossary" },
  { id: "flashcards", label: "Flashcards", to: "/learn/library/flashcards" },
  { id: "saved", label: "Saved", to: "/learn/library/saved" },
];
const PHASE_NAMES = ["Hook", "Learn", "Try", "Check", "Recap"];
const LEVELS: MasteryLevel[] = [0, 1, 2, 3, 4];
const LEVEL_NOTE: Record<MasteryLevel, string> = {
  0: "No answers yet. Test yourself below to get started.",
  1: "You've started. Under 60% right in your recent answers.",
  2: "60% or more right in your last five answers.",
  3: "80% or more right, spread over at least three days.",
  4: "80% or more right, and holding up in spaced review.",
};

const conceptPath = (id: string) => `/learn/library/concepts/${id}`;
const termPath = (id: string) => `/learn/library/terms/${id}`;
const lessonPath = (id: string) => `/learn/lessons/${id}`;

/** Content text without its markup: glossary links keep their shown text, bold loses its stars. */
function plainText(text: string): string {
  return text.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_m, id: string, shown?: string) => shown ?? id.replace(/-/g, " ")).replace(/\*\*/g, "");
}

/** True while the learner types in a field: shortcuts stay out of the way. */
function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

function prefersReducedMotion(): boolean {
  return !!document.querySelector(".ml-reduced-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const TERMS = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));

type TermTopic = TopicId | "general";
/** A term's topic is the topic of the lesson that explains it; terms without a lesson are "General". */
function termTopic(t: GlossaryTerm): TermTopic {
  return (t.lesson && getLesson(t.lesson)?.topic) || "general";
}
const topicName = (t: TermTopic) => (t === "general" ? "General" : TOPIC_BY_ID[t].name);
const topicIcon = (t: TermTopic) => (t === "general" ? "book" : TOPIC_BY_ID[t].icon);

function useMastery(lab: LabData): Record<string, MasteryLevel> {
  return useMemo(() => masteryByConcept(lab.evidence, lab.review, QUESTIONS), [lab.evidence, lab.review]);
}

function lessonStatus(lab: LabData, id: string): string {
  const p = lab.lessons[id];
  if (p?.completedAt) return p.quality === "strong" ? "Complete · Strong" : "Complete";
  if (p?.testedOutAt) return "Tested out";
  return p ? "In progress" : "Not started";
}

/** Five steps, one per mastery level: the steps up to the learner's level are lit. */
function MasteryMeter({ level, size = "sm" }: { level: MasteryLevel; size?: "sm" | "lg" }) {
  return (
    <span className={cx("ml-lib-meter", `ml-lib-meter--${size}`, `is-l${level}`)} role="img" aria-label={`Mastery: ${MASTERY_LABEL[level]}, step ${level + 1} of 5`}>
      {LEVELS.map((i) => (
        <span key={i} className={cx("ml-lib-meter-step", i <= level && "is-on")} />
      ))}
    </span>
  );
}

function SaveButton({ id, name }: { id: string; name: string }) {
  const lab = useLab();
  const store = useStore();
  const on = lab.bookmarks.includes(id);
  return (
    <Button variant="secondary" size="sm" iconLeft="star" className={cx("ml-lib-save", on && "is-on")} title={on ? `Remove ${name} from Saved` : `Save ${name} to your Library`} onClick={() => store.toggleBookmark(id)}>
      {on ? "Saved" : "Save"}
    </Button>
  );
}

// ─── Search ─────────────────────────────────────────────────────────────────

interface Hit {
  key: string;
  to: string;
  title: string;
  meta?: string;
  sub: string;
}

interface Entry<T> {
  item: T;
  primary: string[];
  /** Body text, most telling field first (a summary beats a paragraph). */
  secondary: string[];
}

const INDEX = {
  concepts: CONCEPTS.map((c): Entry<Concept> => ({ item: c, primary: [c.name.toLowerCase()], secondary: [c.summary, c.body.join(" ")].map((x) => plainText(x).toLowerCase()) })),
  terms: GLOSSARY.map((t): Entry<GlossaryTerm> => ({ item: t, primary: [t.term, ...(t.aka ?? [])].map((s) => s.toLowerCase()), secondary: [t.plain, t.definition].map((x) => plainText(x).toLowerCase()) })),
  lessons: LESSONS.map((l): Entry<Lesson> => ({ item: l, primary: [l.title.toLowerCase()], secondary: [plainText(l.summary).toLowerCase()] })),
};

/** Every word of the query must appear; names score far above body text, word starts above inner matches. */
function rank(q: string, e: Entry<unknown>): number {
  const tokens = q.split(" ");
  let total = e.primary.includes(q) ? 200 : 0;
  for (const t of tokens) {
    let best = 0;
    for (const p of e.primary) {
      const i = p.indexOf(t);
      if (i < 0) continue;
      best = Math.max(best, i === 0 ? 60 : /[\s(/-]/.test(p[i - 1]) ? 45 : 25);
    }
    if (!best && q.length > 1) {
      const i = e.secondary.findIndex((x) => x.includes(t));
      if (i >= 0) best = i === 0 ? 10 : 6;
    }
    if (!best) return 0;
    total += best;
  }
  return total;
}

function find<T>(q: string, list: Entry<T>[], name: (t: T) => string): T[] {
  return list
    .map((e) => ({ item: e.item, s: rank(q, e) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || name(a.item).localeCompare(name(b.item)))
    .map((x) => x.item);
}

function searchLibrary(query: string) {
  const q = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (!q) return null;
  const concepts = find(q, INDEX.concepts, (c) => c.name);
  const terms = find(q, INDEX.terms, (t) => t.term);
  const lessons = find(q, INDEX.lessons, (l) => l.title);
  return [
    {
      id: "concepts",
      label: "Concepts",
      icon: "bulb",
      total: concepts.length,
      hits: concepts.slice(0, 5).map((c): Hit => ({ key: `c-${c.id}`, to: conceptPath(c.id), title: c.name, meta: TOPIC_BY_ID[c.category].name, sub: plainText(c.summary) })),
    },
    {
      id: "terms",
      label: "Terms",
      icon: "list",
      total: terms.length,
      hits: terms.slice(0, 6).map((t): Hit => ({ key: `t-${t.id}`, to: termPath(t.id), title: t.term, meta: t.aka?.join(", "), sub: plainText(t.plain) })),
    },
    {
      id: "lessons",
      label: "Lessons",
      icon: "book",
      total: lessons.length,
      hits: lessons.slice(0, 4).map((l): Hit => ({ key: `l-${l.id}`, to: lessonPath(l.id), title: l.title, meta: `${l.minutes} min`, sub: plainText(l.summary) })),
    },
  ].filter((g) => g.hits.length > 0);
}

function Highlight({ text, query }: { text: string; query: string }) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return <>{text}</>;
  const re = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "ig");
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 ? (
          <mark key={i} className="ml-lib-mark">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** One search across concepts, terms and lessons. "/" or Ctrl+K focuses it; ↑ ↓ move, Enter opens, Esc clears. */
function LibrarySearch() {
  const { navigate, path } = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const listId = useId();
  const groups = useMemo(() => searchLibrary(query), [query]);
  const flat = useMemo(() => groups?.flatMap((g) => g.hits) ?? [], [groups]);
  const shown = open && groups !== null;

  useEffect(() => setActive(0), [query]);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (shown) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, shown, listId]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || isTyping(e.target)) return;
      const slash = e.key === "/" && !e.ctrlKey && !e.metaKey;
      const ctrlK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (!slash && !ctrlK) return;
      e.preventDefault();
      input.current?.focus();
      input.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  const go = (hit: Hit) => {
    setQuery("");
    setOpen(false);
    input.current?.blur();
    navigate(hit.to);
  };
  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      if (flat.length) setActive((a) => (a + (e.key === "ArrowDown" ? 1 : -1) + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      const hit = flat[active];
      if (shown && hit) {
        e.preventDefault();
        go(hit);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (query) setQuery("");
      else input.current?.blur();
    }
  };

  return (
    <div className="ml-lib-search">
      <label className="ml-findbar-search ml-lib-search-field">
        <Icon name="search" size={17} />
        <span className="ml-sr">Search the Library</span>
        <input
          ref={input}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search concepts, terms and lessons"
          value={query}
          role="combobox"
          aria-expanded={shown}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={shown && flat[active] ? `${listId}-${active}` : undefined}
          aria-keyshortcuts="/ Control+K"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            window.clearTimeout(closeTimer.current);
            setOpen(true);
          }}
          onBlur={() => {
            closeTimer.current = window.setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={onKeyDown}
        />
        {query ? (
          <button
            type="button"
            className="ml-lib-search-clear"
            aria-label="Clear the search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery("");
              input.current?.focus();
            }}
          >
            <Icon name="x" size={15} />
          </button>
        ) : (
          <span className="ml-lib-search-key" aria-hidden="true">
            <Kbd>/</Kbd>
          </span>
        )}
      </label>
      {shown && (
        <div className="ml-lib-results" onMouseDown={(e) => e.preventDefault()}>
          {flat.length === 0 ? (
            <p className="ml-lib-results-empty" role="status">
              Nothing found for “{query.trim()}”. Try a shorter word, or an abbreviation like SL or R:R.
            </p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Library search results" className="ml-lib-results-list">
              {(groups ?? []).map((g) => (
                <li key={g.id} role="presentation" className="ml-lib-results-group">
                  <div className="ml-lib-results-head" role="presentation">
                    <span>{g.label}</span>
                    <span className="num">{g.total > g.hits.length ? `${g.hits.length} of ${g.total}` : g.total}</span>
                  </div>
                  <ul role="group" aria-label={g.label}>
                    {g.hits.map((hit) => {
                      const i = flat.indexOf(hit);
                      return (
                        <li key={hit.key} id={`${listId}-${i}`} role="option" aria-selected={i === active} className={cx("ml-lib-hit", i === active && "is-active")} onMouseMove={() => i !== active && setActive(i)} onClick={() => go(hit)}>
                          <span className="ml-lib-hit-icon" aria-hidden="true">
                            <Icon name={g.icon} size={15} />
                          </span>
                          <span className="ml-lib-hit-main">
                            <span className="ml-lib-hit-title">
                              <Highlight text={hit.title} query={query} />
                              {hit.meta && <span className="ml-lib-hit-meta"> · {hit.meta}</span>}
                            </span>
                            <span className="ml-lib-hit-sub">{hit.sub}</span>
                          </span>
                          <Icon name="arrow-right" size={15} className="ml-lib-hit-go" />
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
          <div className="ml-lib-results-foot" aria-hidden="true">
            <span>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> move
            </span>
            <span>
              <Kbd>Enter</Kbd> open
            </span>
            <span>
              <Kbd>Esc</Kbd> clear
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

/** Library (PLAN_LEARN §7.3): concepts and glossary together, one search, flashcards, saved items. */
export function LibraryPage({ tab, conceptId, termId }: { tab: LibraryTab; conceptId?: string; termId?: string }) {
  const lab = useLab();
  const detail = Boolean(conceptId || termId);
  const counts: Partial<Record<LibraryTab, number>> = { concepts: CONCEPTS.length, glossary: GLOSSARY.length, saved: lab.bookmarks.length + lab.lessonNotes.length };
  return (
    <div className="ml-page ml-lib">
      <PageHead title="Library" sub="Every concept and term in the course, in plain words. Test yourself, drill the vocabulary and keep what matters to you." actions={<LibrarySearch />} />
      <SubNav module="learn" />
      <nav className="ml-seg ml-lib-tabs" aria-label="Library sections">
        {TABS.map((t) => (
          <Link key={t.id} to={t.to} className={cx("ml-seg-item ml-lib-tab", t.id === tab && "is-on")} aria-current={t.id === tab ? (detail ? "true" : "page") : undefined}>
            {t.label}
            {counts[t.id] !== undefined && <span className="ml-lib-tab-count num">{counts[t.id]}</span>}
          </Link>
        ))}
      </nav>
      {tab === "concepts" && (conceptId ? <ConceptView key={conceptId} id={conceptId} /> : <ConceptsTab />)}
      {tab === "glossary" && (termId ? <TermView key={termId} id={termId} /> : <GlossaryTab />)}
      {tab === "flashcards" && <FlashcardsTab />}
      {tab === "saved" && <SavedTab />}
    </div>
  );
}

// ─── Concepts ───────────────────────────────────────────────────────────────

function ConceptsTab() {
  const lab = useLab();
  const mastery = useMastery(lab);
  const level = (id: string): MasteryLevel => mastery[id] ?? 0;
  const tally = LEVELS.map((l) => CONCEPTS.filter((c) => level(c.id) === l).length);
  const started = CONCEPTS.length - tally[0];

  return (
    <>
      <section className="ml-lib-overview" aria-label="Your mastery">
        <div className="ml-lib-overview-copy">
          <span className="ml-eyebrow">Your mastery</span>
          <p>
            <b className="num">{started}</b> of <span className="num">{CONCEPTS.length}</span> concepts started · <b className="num">{tally[3] + tally[4]}</b> proficient or better
          </p>
        </div>
        <ul className="ml-lib-legend">
          {LEVELS.map((l) => (
            <li key={l}>
              <MasteryMeter level={l} />
              <span>{MASTERY_LABEL[l]}</span>
              <b className="num">{tally[l]}</b>
            </li>
          ))}
        </ul>
      </section>
      {TOPICS.map((t) => {
        const list = CONCEPTS.filter((c) => c.category === t.id);
        if (!list.length) return null;
        const familiar = list.filter((c) => level(c.id) >= 2).length;
        return (
          <section key={t.id} className="ml-lib-topic" aria-labelledby={`lib-topic-${t.id}`}>
            <header className="ml-lib-topic-head">
              <span className="ml-lib-topic-icon" aria-hidden="true">
                <Icon name={t.icon} size={17} />
              </span>
              <div className="ml-lib-topic-copy">
                <h2 id={`lib-topic-${t.id}`}>{t.name}</h2>
                <p>{t.description}</p>
              </div>
              <span className="ml-lib-topic-count num">
                {familiar} of {list.length} familiar
              </span>
            </header>
            <ul className="ml-lib-concepts">
              {list.map((c) => {
                const l = level(c.id);
                return (
                  <li key={c.id}>
                    <Link to={conceptPath(c.id)} className="ml-lib-concept">
                      <span className="ml-lib-concept-name">
                        {c.name}
                        {lab.bookmarks.includes(`concept:${c.id}`) && <Icon name="star" size={13} className="ml-lib-star" />}
                      </span>
                      <span className="ml-lib-concept-sum">{plainText(c.summary)}</span>
                      <span className="ml-lib-concept-foot">
                        <MasteryMeter level={l} />
                        <span className={cx("ml-lib-level", l > 0 && "is-started")}>{MASTERY_LABEL[l]}</span>
                        <Icon name="arrow-right" size={15} className="ml-lib-go" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}

/** The questions tagged with a concept: choice questions first, easier first. */
function conceptQuestions(id: string): Question[] {
  return QUESTIONS.filter((q) => q.concepts?.includes(id)).sort((a, b) => Number(!a.options) - Number(!b.options) || a.difficulty - b.difficulty);
}

function ConceptView({ id }: { id: string }) {
  const lab = useLab();
  const mastery = useMastery(lab);
  const c = getConcept(id);
  if (!c) {
    return (
      <Empty icon="library" title="Concept not found" action={<Link to="/learn/library" className="ml-text-link">All concepts</Link>}>
        The link may be out of date. Pick a concept from the Library.
      </Empty>
    );
  }
  const level = mastery[c.id] ?? 0;
  const answers = lab.evidence.filter((e) => e.concept === c.id).length;
  const topic = TOPIC_BY_ID[c.category];
  const lessons = c.lessons.map((l) => getLesson(l)).filter((l): l is Lesson => Boolean(l));
  const missions = c.missions.map((m) => MISSIONS.find((x) => x.id === m)).filter((m): m is (typeof MISSIONS)[number] => Boolean(m));
  const related = c.related.map((r) => getConcept(r)).filter((r): r is Concept => Boolean(r));

  return (
    <div className="ml-lib-detail">
      <div className="ml-lib-detail-main">
        <article className="ml-card ml-lib-article" aria-labelledby="lib-concept-title">
          <Link to="/learn/library" className="ml-back">
            <Icon name="arrow-left" size={16} /> All concepts
          </Link>
          <header className="ml-lib-article-head">
            <div className="ml-lib-article-titles">
              <span className="lp-kicker">
                <Icon name={topic.icon} size={14} /> {topic.name}
              </span>
              <h2 id="lib-concept-title" className="ml-lib-title">
                {c.name}
              </h2>
            </div>
            <SaveButton id={`concept:${c.id}`} name={c.name} />
          </header>
          <p className="ml-lib-lead">
            <Rich text={c.summary} />
          </p>
          {c.body.map((p, i) => (
            <p key={i} className="ml-lib-text">
              <Rich text={p} />
            </p>
          ))}
          <figure className="ml-example ml-lib-example">
            <figcaption>
              <Icon name="calculator" size={15} /> Worked example
            </figcaption>
            <p>
              <Rich text={c.example} />
            </p>
          </figure>
        </article>
        <TestYourself key={c.id} concept={c} />
      </div>
      <aside className="ml-lib-aside" aria-label="About this concept">
        <Card eyebrow="Your mastery" className="ml-lib-side">
          <div className="ml-lib-mastery">
            <MasteryMeter level={level} size="lg" />
            <b>{MASTERY_LABEL[level]}</b>
          </div>
          <p className="ml-lib-side-note">
            {LEVEL_NOTE[level]}
            {answers > 0 && ` Based on ${plural(answers, "answer")}.`}
          </p>
        </Card>
        {lessons.length > 0 && (
          <Card eyebrow={lessons.length > 1 ? "Lessons that teach it" : "The lesson that teaches it"} className="ml-lib-side">
            <ul className="ml-lib-links">
              {lessons.map((l) => (
                <li key={l.id}>
                  <Link to={lessonPath(l.id)} className="ml-lib-linkrow">
                    <Icon name="book" size={16} />
                    <span className="ml-lib-linkrow-main">
                      <b>{l.title}</b>
                      <span>
                        {l.minutes} min · {lessonStatus(lab, l.id)}
                      </span>
                    </span>
                    <Icon name="arrow-right" size={15} className="ml-lib-go" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {missions.length > 0 && (
          <Card eyebrow="Practise it in a mission" className="ml-lib-side">
            <ul className="ml-lib-links">
              {missions.map((m) => (
                <li key={m.id}>
                  <Link to={`/mission/${m.id}`} className="ml-lib-linkrow">
                    <Icon name="flag" size={16} />
                    <span className="ml-lib-linkrow-main">
                      <b>{m.title}</b>
                      <span>Simulated mission</span>
                    </span>
                    <Icon name="arrow-right" size={15} className="ml-lib-go" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {related.length > 0 && (
          <Card eyebrow="Related concepts" className="ml-lib-side">
            <div className="ml-pills">
              {related.map((r) => (
                <Link key={r.id} to={conceptPath(r.id)} className="ml-pill ml-lib-pill">
                  {r.name}
                </Link>
              ))}
            </div>
          </Card>
        )}
      </aside>
    </div>
  );
}

/** "Test yourself": two questions tagged with the concept, answered inline; every answer is mastery evidence. */
function TestYourself({ concept }: { concept: Concept }) {
  const lab = useLab();
  const store = useStore();
  const mastery = useMastery(lab);
  const pool = useMemo(() => conceptQuestions(concept.id), [concept.id]);
  const [round, setRound] = useState(0);
  const set = useMemo(() => {
    if (pool.length <= 2) return pool;
    const start = (round * 2) % pool.length;
    return [pool[start], pool[(start + 1) % pool.length]];
  }, [pool, round]);
  const [pos, setPos] = useState(0);
  const [value, setValue] = useState("");
  const [graded, setGraded] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const body = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const q = set[pos];

  useEffect(() => {
    if (moved.current) body.current?.focus({ preventScroll: true });
  }, [pos, round]);

  if (pool.length === 0) {
    return (
      <section className="ml-card ml-lib-test" aria-labelledby="lib-test-title">
        <span className="lp-kicker">Test yourself</span>
        <h2 id="lib-test-title" className="ml-lib-test-title">
          No questions for this concept yet
        </h2>
        <p className="ml-muted">The lessons below cover it; their checks count towards your mastery.</p>
      </section>
    );
  }

  const right = q ? isCorrect(q, value) : false;
  const submit = () => {
    if (!q || graded || !value.trim()) return;
    setGraded(true);
    setResults((r) => [...r, right]);
    store.recordEvidence([{ concept: concept.id, score: right ? 1 : 0, source: "check" }]);
  };
  const next = () => {
    moved.current = true;
    setPos((p) => p + 1);
    setValue("");
    setGraded(false);
  };
  const again = () => {
    moved.current = true;
    setRound((r) => r + 1);
    setPos(0);
    setResults([]);
    setValue("");
    setGraded(false);
  };
  const onKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey || !q) return;
    const target = e.target as HTMLElement;
    if (target.closest("a")) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (graded) next();
      else submit();
      return;
    }
    if (!graded && q.options && !isTyping(target) && /^[1-9]$/.test(e.key)) {
      const o = q.options[Number(e.key) - 1];
      if (o) {
        e.preventDefault();
        setValue(o.id);
      }
    }
  };

  const level = mastery[concept.id] ?? 0;
  const score = results.filter(Boolean).length;
  const pickedRationale = graded && !right && q?.options ? q.options.find((o) => o.id === value)?.rationale : undefined;
  const review = q && graded && !right && !concept.lessons.includes(q.lesson) ? getLesson(q.lesson) : undefined;

  return (
    <section className="ml-card ml-lib-test" aria-labelledby="lib-test-title" onKeyDown={onKeyDown}>
      <header className="ml-lib-test-head">
        <div>
          <span className="lp-kicker">Test yourself</span>
          <h2 id="lib-test-title" className="ml-lib-test-title num">
            {q ? `Question ${pos + 1} of ${set.length}` : `${score} of ${set.length} right`}
          </h2>
        </div>
        <span className="lp-check-dots" aria-hidden="true">
          {set.map((s, i) => (
            <span key={`${s.id}-${i}`} className={cx("lp-step-dot", results[i] !== undefined && (results[i] ? "is-right" : "is-wrong"), i === pos && results[i] === undefined && "is-current")} />
          ))}
        </span>
      </header>
      {q ? (
        <div key={`${round}-${pos}`} ref={body} tabIndex={-1} className="ml-lib-test-body">
          {q.scenario && (
            <p className="lp-scenario">
              <Rich text={q.scenario} />
            </p>
          )}
          <p className="lp-prompt">
            <Rich text={q.prompt} />
          </p>
          {q.options ? (
            <div className="lp-choices" role="radiogroup" aria-label="Answer">
              {q.options.map((o, i) => {
                const on = value === o.id;
                const isRight = graded && o.id === q.correct;
                const isWrong = graded && on && o.id !== q.correct;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    disabled={graded && !on && !isRight}
                    className={cx("lp-choice", on && "is-on", isRight && "is-right", isWrong && "is-wrong", graded && "is-locked")}
                    onClick={() => !graded && setValue(o.id)}
                  >
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
              <input inputMode="decimal" autoComplete="off" value={value} disabled={graded} placeholder="Your answer" onChange={(e) => setValue(e.target.value)} />
              {q.numeric?.unit && <span className="lp-numeric-unit">{q.numeric.unit}</span>}
            </label>
          )}
          {graded && (
            <Feedback tone={right ? "right" : "wrong"} title={right ? "Correct." : q.numeric ? `Not quite. The answer is ${q.numeric.answer.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${q.numeric.unit}.` : "Not quite."}>
              {pickedRationale && (
                <span className="lp-rationale">
                  <Rich text={pickedRationale} />{" "}
                </span>
              )}
              <Rich text={q.explanation} />
              {review && (
                <>
                  {" "}
                  <Link to={lessonPath(review.id)} className="ml-text-link">
                    Review: {review.title}
                  </Link>
                </>
              )}
            </Feedback>
          )}
          <div className="lp-inline-actions">
            {!graded ? (
              <Button variant="primary" disabled={!value.trim()} onClick={submit}>
                Check
              </Button>
            ) : (
              <Button variant="primary" iconRight="arrow-right" onClick={next}>
                {pos + 1 < set.length ? "Next question" : "See your result"}
              </Button>
            )}
            <span className="ml-lib-keys" aria-hidden="true">
              {q.options && !graded && (
                <>
                  <Kbd>1</Kbd>–<Kbd>{q.options.length}</Kbd> choose ·{" "}
                </>
              )}
              <Kbd>Enter</Kbd> {graded ? "continue" : "check"}
            </span>
          </div>
        </div>
      ) : (
        <div ref={body} tabIndex={-1} className="ml-lib-test-body ml-lib-test-done">
          <Feedback tone={score === set.length ? "right" : "info"} title={score === set.length ? "Both right." : score === 0 ? "Not this time." : "One of two."}>
            {score === set.length ? "Nicely done. " : "Each try counts as evidence, and the explanations are the point. "}
            Your mastery of {concept.name} is now <b>{MASTERY_LABEL[level]}</b>.
          </Feedback>
          <div className="lp-inline-actions">
            <Button variant="secondary" iconLeft="replay" onClick={again}>
              {pool.length > 2 ? "Try two more" : "Try again"}
            </Button>
            <Link to="/learn/practice" className="ml-text-arrow">
              Go to Practice <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Glossary ───────────────────────────────────────────────────────────────

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const TERM_TOPICS: { id: TermTopic; count: number }[] = [
  ...TOPICS.map((t) => ({ id: t.id as TermTopic, count: GLOSSARY.filter((g) => termTopic(g) === t.id).length })),
  { id: "general" as TermTopic, count: GLOSSARY.filter((g) => termTopic(g) === "general").length },
].filter((t) => t.count > 0);

function GlossaryTab() {
  const lab = useLab();
  const [topic, setTopic] = useState<TermTopic | "all">("all");
  const shown = TERMS.filter((t) => topic === "all" || termTopic(t) === topic);
  const byLetter = new Map<string, GlossaryTerm[]>();
  for (const t of shown) {
    const l = t.term[0].toUpperCase();
    byLetter.set(l, [...(byLetter.get(l) ?? []), t]);
  }
  const jump = (l: string) => {
    const el = document.getElementById(`lib-letter-${l}`);
    el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    el?.focus({ preventScroll: true });
  };

  return (
    <>
      <div className="ml-lib-azbar">
        <nav className="ml-lib-az" aria-label="Jump to letter">
          {LETTERS.map((l) => (
            <button key={l} type="button" disabled={!byLetter.has(l)} aria-label={`Jump to ${l}`} onClick={() => jump(l)}>
              {l}
            </button>
          ))}
        </nav>
        <label className="ml-findbar-select ml-lib-topic-select">
          <span className="ml-sr">Topic</span>
          <select value={topic} onChange={(e) => setTopic(e.target.value as TermTopic | "all")}>
            <option value="all">All topics ({GLOSSARY.length})</option>
            {TERM_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {topicName(t.id)} ({t.count})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="ml-lib-glossary">
        {[...byLetter].map(([letter, terms]) => (
          <section key={letter} id={`lib-letter-${letter}`} tabIndex={-1} className="ml-lib-letter" aria-labelledby={`lib-letter-h-${letter}`}>
            <h2 id={`lib-letter-h-${letter}`} className="ml-lib-letter-head">
              {letter}
            </h2>
            <ul className="ml-lib-terms">
              {terms.map((t) => (
                <li key={t.id}>
                  <Link to={termPath(t.id)} className="ml-lib-termrow">
                    <span className="ml-lib-termrow-name">
                      <b>{t.term}</b>
                      {t.aka?.length ? <span className="ml-lib-aka"> · {t.aka.join(", ")}</span> : null}
                      {lab.bookmarks.includes(`term:${t.id}`) && <Icon name="star" size={13} className="ml-lib-star" />}
                    </span>
                    <span className="ml-lib-termrow-plain">{plainText(t.plain)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

function TermView({ id }: { id: string }) {
  const lab = useLab();
  const t = getTerm(id);
  if (!t) {
    return (
      <Empty icon="library" title="Term not found" action={<Link to="/learn/library/glossary" className="ml-text-link">The glossary</Link>}>
        The link may be out of date. Pick a term from the glossary.
      </Empty>
    );
  }
  const topic = termTopic(t);
  const lesson = t.lesson ? getLesson(t.lesson) : undefined;
  const related = t.related.map((r) => getTerm(r)).filter((r): r is GlossaryTerm => Boolean(r));
  const card = lab.review[`term:${t.id}`];
  const last = card?.history[card.history.length - 1];

  return (
    <div className="ml-lib-detail">
      <div className="ml-lib-detail-main">
        <article className="ml-card ml-lib-article" aria-labelledby="lib-term-title">
          <Link to="/learn/library/glossary" className="ml-back">
            <Icon name="arrow-left" size={16} /> All terms
          </Link>
          <header className="ml-lib-article-head">
            <div className="ml-lib-article-titles">
              <span className="lp-kicker">
                <Icon name={topicIcon(topic)} size={14} /> {topicName(topic)}
              </span>
              <h2 id="lib-term-title" className="ml-lib-title">
                {t.term}
              </h2>
              {t.aka?.length ? <span className="ml-lib-akaline">Also called {t.aka.join(", ")}</span> : null}
            </div>
            <SaveButton id={`term:${t.id}`} name={t.term} />
          </header>
          <div className="ml-lib-plain">
            <span className="lp-kicker">In plain words</span>
            <p>
              <Rich text={t.plain} />
            </p>
          </div>
          <div className="ml-lib-def">
            <span className="ml-eyebrow">Definition</span>
            <p className="ml-lib-text">
              <Rich text={t.definition} />
            </p>
          </div>
        </article>
      </div>
      <aside className="ml-lib-aside" aria-label="About this term">
        {lesson && (
          <Card eyebrow="The lesson that explains it" className="ml-lib-side">
            <ul className="ml-lib-links">
              <li>
                <Link to={lessonPath(lesson.id)} className="ml-lib-linkrow">
                  <Icon name="book" size={16} />
                  <span className="ml-lib-linkrow-main">
                    <b>{lesson.title}</b>
                    <span>
                      {lesson.minutes} min · {lessonStatus(lab, lesson.id)}
                    </span>
                  </span>
                  <Icon name="arrow-right" size={15} className="ml-lib-go" />
                </Link>
              </li>
            </ul>
          </Card>
        )}
        {related.length > 0 && (
          <Card eyebrow="Related terms" className="ml-lib-side">
            <div className="ml-pills">
              {related.map((r) => (
                <Link key={r.id} to={termPath(r.id)} className="ml-pill ml-lib-pill">
                  {r.term}
                </Link>
              ))}
            </div>
          </Card>
        )}
        <Card eyebrow="Flashcard" className="ml-lib-side">
          <p className="ml-lib-side-note">
            {!card ? "Not drilled yet." : last?.correct ? `You knew it last time. It comes back on ${formatDayKey(card.due)}.` : `Marked “Not yet”. It's in your review queue for ${formatDayKey(card.due)}.`}
          </p>
          <Link to={`/learn/library/flashcards?deck=${topic}`} className="ml-text-arrow">
            Practise {topicName(topic)} cards <Icon name="arrow-right" size={15} />
          </Link>
        </Card>
      </aside>
    </div>
  );
}

// ─── Flashcards ─────────────────────────────────────────────────────────────

type DeckId = TermTopic | "all";
interface Deck {
  id: DeckId;
  name: string;
  icon: string;
  terms: GlossaryTerm[];
}
const DECKS: Deck[] = [{ id: "all", name: "All terms", icon: "layers", terms: TERMS }, ...TERM_TOPICS.map((t) => ({ id: t.id, name: topicName(t.id), icon: topicIcon(t.id), terms: TERMS.filter((g) => termTopic(g) === t.id) }))];

interface Session {
  deck: Deck;
  cards: string[];
  pos: number;
  flipped: boolean;
  knew: string[];
  notYet: string[];
  /** Answers in order, for the session panel. */
  log: { id: string; knew: boolean }[];
  ended: boolean;
}

const knownTerm = (lab: LabData, id: string) => {
  const h = lab.review[`term:${id}`]?.history;
  return !!h?.length && h[h.length - 1].correct;
};

function FlashcardsTab() {
  const lab = useLab();
  const store = useStore();
  const [session, setSession] = useState<Session | null>(() => {
    const deck = DECKS.find((d) => d.id === new URLSearchParams(window.location.search).get("deck"));
    return deck ? newSession(deck, lab) : null;
  });
  const front = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);
  const reveal = useRef(session !== null);

  const done = !!session && (session.ended || session.pos >= session.cards.length);
  const term = session && !done ? getTerm(session.cards[session.pos]) : undefined;

  const start = (deck: Deck, only?: string[]) => {
    interacted.current = true;
    reveal.current = true;
    setSession(newSession(deck, lab, only));
  };
  const flip = () => setSession((s) => (s ? { ...s, flipped: !s.flipped } : s));
  const answer = (knew: boolean) => {
    if (!session || !term || !session.flipped) return;
    store.answerFlashcard(term.id, knew);
    setSession({
      ...session,
      pos: session.pos + 1,
      flipped: false,
      knew: knew ? [...session.knew, term.id] : session.knew,
      notYet: knew ? session.notYet : [...session.notYet, term.id],
      log: [...session.log, { id: term.id, knew }],
    });
  };
  const answerRef = useRef(answer);
  answerRef.current = answer;

  useEffect(() => {
    if (!session || done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target)) return;
      interacted.current = true;
      const onControl = (e.target as HTMLElement).closest?.("button, a, select");
      if (e.key === " ") {
        if (onControl) return;
        e.preventDefault();
        flip();
      } else if (e.key === "1" || e.key === "2") {
        e.preventDefault();
        answerRef.current(e.key === "1");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [session, done]);

  // Focus follows the visible face, so Space and screen readers stay with the card.
  useEffect(() => {
    if (!interacted.current || !session || done) return;
    if (session.flipped) back.current?.focus({ preventScroll: true });
    else front.current?.focus({ preventScroll: true });
  }, [session?.flipped, session?.pos, done]);

  // A new session brings the card and its buttons into view (on phones they start below the fold).
  useEffect(() => {
    if (!reveal.current || !session) return;
    reveal.current = false;
    const el = stage.current;
    if (el && el.getBoundingClientRect().bottom > window.innerHeight - 72) el.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [session]);

  if (!session) {
    return (
      <>
        <p className="ml-lib-intro">
          Front: the term. Back: what it means in plain words, and the precise definition. Mark each card <b>Knew it</b> or <b>Not yet</b>; the ones you didn't know come back in your review.
        </p>
        <ul className="ml-lib-decks">
          {DECKS.map((d) => {
            const known = d.terms.filter((t) => knownTerm(lab, t.id)).length;
            return (
              <li key={d.id}>
                <button type="button" className={cx("ml-lib-deck", d.id === "all" && "is-all")} onClick={() => start(d)}>
                  <span className="ml-lib-deck-top">
                    <span className="ml-lib-deck-icon" aria-hidden="true">
                      <Icon name={d.icon} size={17} />
                    </span>
                    <span className="ml-lib-deck-count num">{plural(d.terms.length, "card")}</span>
                  </span>
                  <span className="ml-lib-deck-name">{d.name}</span>
                  <span className="ml-lib-bar" aria-hidden="true">
                    <span style={{ transform: `scaleX(${d.terms.length ? known / d.terms.length : 0})` }} />
                  </span>
                  <span className="ml-lib-deck-meta">
                    <span className="num">{known}</span> known
                    <Icon name="arrow-right" size={15} className="ml-lib-go" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  const answered = session.knew.length + session.notYet.length;
  if (done) {
    const missed = session.notYet.map((id) => getTerm(id)).filter((t): t is GlossaryTerm => Boolean(t));
    return (
      <section className="ml-card ml-lib-fc-done" aria-labelledby="lib-fc-done">
        <span className="ml-lib-fc-done-icon" aria-hidden="true">
          <Icon name="check-circle" size={26} />
        </span>
        <div className="ml-lib-fc-done-copy">
          <span className="lp-kicker">{session.deck.name}</span>
          <h2 id="lib-fc-done" className="ml-lib-test-title">
            {session.ended && session.pos < session.cards.length ? "Session ended" : "Deck done"}
          </h2>
          <p className="ml-muted">
            {answered === 0
              ? "No cards answered this time."
              : missed.length
                ? `You knew ${session.knew.length} of ${answered}. ${missed.length === 1 ? "The card marked “Not yet” comes" : `The ${missed.length} cards marked “Not yet” come`} back in your review.`
                : `You knew all ${answered}. They come back later, spaced out, so they stick.`}
          </p>
        </div>
        <dl className="ml-lib-fc-stats">
          <div>
            <dt>Knew it</dt>
            <dd className="num">{session.knew.length}</dd>
          </div>
          <div>
            <dt>Not yet</dt>
            <dd className="num">{session.notYet.length}</dd>
          </div>
        </dl>
        {missed.length > 0 && (
          <div className="ml-lib-fc-missed">
            <span className="ml-eyebrow">To look at again</span>
            <div className="ml-pills">
              {missed.map((t) => (
                <Link key={t.id} to={termPath(t.id)} className="ml-pill ml-lib-pill">
                  {t.term}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="ml-lib-fc-actions">
          {missed.length > 0 && (
            <Button variant="primary" iconLeft="replay" onClick={() => start(session.deck, session.notYet)}>
              Practise the {missed.length === 1 ? "one" : missed.length} I missed
            </Button>
          )}
          <Button variant={missed.length ? "secondary" : "primary"} onClick={() => start(session.deck)}>
            Go again
          </Button>
          <Button variant="tertiary" onClick={() => setSession(null)}>
            Pick another deck
          </Button>
        </div>
      </section>
    );
  }

  if (!term) return null;
  const topic = termTopic(term);
  const recent = [...session.log].reverse().slice(0, 8);
  return (
    <div ref={stage} className="ml-lib-fc-layout">
      <section className="ml-lib-fc" aria-label={`${session.deck.name} flashcards`}>
        <div className="ml-lib-fc-bar">
          <button type="button" className="ml-back ml-lib-fc-back" onClick={() => setSession(null)}>
            <Icon name="arrow-left" size={16} /> Decks
          </button>
          <span className="ml-lib-fc-progress num" aria-live="polite">
            <span className="ml-lib-fc-deckname">{session.deck.name} · </span>card {session.pos + 1} of {session.cards.length}
          </span>
          <Button variant="tertiary" size="sm" onClick={() => setSession({ ...session, ended: true })}>
            End session
          </Button>
        </div>
        <span className="ml-lib-bar ml-lib-bar--fc" aria-hidden="true">
          <span style={{ transform: `scaleX(${session.pos / session.cards.length})` }} />
        </span>
        <div className={cx("ml-lib-flip", session.flipped && "is-flipped")}>
          <div className="ml-lib-flip-inner" key={session.pos}>
            <button ref={front} type="button" className="ml-lib-face ml-lib-face--front" inert={session.flipped} aria-label={`${term.term}. Show the meaning.`} onClick={flip}>
              <span className="lp-kicker">{topicName(topic)}</span>
              <span className="ml-lib-face-term">{term.term}</span>
              {term.aka?.length ? <span className="ml-lib-face-aka">{term.aka.join(" · ")}</span> : null}
              <span className="ml-lib-face-hint">Tap the card to see what it means</span>
            </button>
            <div
              ref={back}
              tabIndex={-1}
              className="ml-lib-face ml-lib-face--back"
              inert={!session.flipped}
              aria-label={`${term.term}: meaning`}
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest("a, button")) flip();
              }}
            >
              <span className="ml-lib-face-small">{term.term}</span>
              <div className="ml-lib-face-block">
                <span className="lp-kicker">In plain words</span>
                <p className="ml-lib-face-plain">
                  <Rich text={term.plain} />
                </p>
              </div>
              <div className="ml-lib-face-block">
                <span className="ml-eyebrow">Definition</span>
                <p className="ml-lib-face-def">
                  <Rich text={term.definition} />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-lib-fc-actions ml-lib-fc-answer">
          {session.flipped ? (
            <>
              <Button variant="primary" size="lg" iconLeft="check" onClick={() => answer(true)}>
                Knew it <Kbd>1</Kbd>
              </Button>
              <Button variant="secondary" size="lg" iconLeft="replay" onClick={() => answer(false)}>
                Not yet <Kbd>2</Kbd>
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="lg" onClick={flip}>
              Show the meaning <Kbd>Space</Kbd>
            </Button>
          )}
        </div>
      </section>
      <aside className="ml-lib-fc-side" aria-label="This session">
        <Card eyebrow="This session" className="ml-lib-side">
          <dl className="ml-lib-fc-stats ml-lib-fc-stats--sm">
            <div>
              <dt>Knew it</dt>
              <dd className="num">{session.knew.length}</dd>
            </div>
            <div>
              <dt>Not yet</dt>
              <dd className="num">{session.notYet.length}</dd>
            </div>
            <div>
              <dt>Left</dt>
              <dd className="num">{session.cards.length - session.pos}</dd>
            </div>
          </dl>
          {recent.length === 0 ? (
            <p className="ml-lib-side-note">Your answers show up here as you go.</p>
          ) : (
            <ul className="ml-lib-fc-log">
              {recent.map((r, i) => (
                <li key={`${r.id}-${i}`} className={cx(r.knew && "is-knew")}>
                  <Icon name={r.knew ? "check" : "replay"} size={14} />
                  <span>{getTerm(r.id)?.term ?? r.id}</span>
                  <small>{r.knew ? "Knew it" : "Not yet"}</small>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card eyebrow="Keys" className="ml-lib-side ml-lib-fc-keys">
          <ul className="ml-lib-keylist">
            <li>
              <Kbd>Space</Kbd> flip the card
            </li>
            <li>
              <Kbd>1</Kbd> Knew it
            </li>
            <li>
              <Kbd>2</Kbd> Not yet, review it later
            </li>
          </ul>
        </Card>
      </aside>
    </div>
  );
}

/** Cards not yet known come first; each part shuffled, so a deck never runs in the same order. */
function newSession(deck: Deck, lab: LabData, only?: string[]): Session {
  const ids = only ?? deck.terms.map((t) => t.id);
  const rand = seededRandom(Date.now() % 2147483647);
  const unknown = shuffled(
    ids.filter((id) => !knownTerm(lab, id)),
    rand,
  );
  const known = shuffled(
    ids.filter((id) => knownTerm(lab, id)),
    rand,
  );
  return { deck, cards: [...unknown, ...known], pos: 0, flipped: false, knew: [], notYet: [], log: [], ended: false };
}

// ─── Saved ──────────────────────────────────────────────────────────────────

function noteWhere(n: LessonNote): string {
  if (n.phase === 1) {
    const beat = getLesson(n.lesson)?.script?.learn[n.beat] as { title?: unknown } | undefined;
    return typeof beat?.title === "string" && beat.title ? `Learn · ${beat.title}` : `Learn · step ${n.beat + 1}`;
  }
  return PHASE_NAMES[n.phase] ?? "Lesson";
}

function SavedTab() {
  const lab = useLab();
  const store = useStore();
  const saved = [...lab.bookmarks].reverse();
  const rows = (prefix: string) => saved.filter((b) => b.startsWith(prefix)).map((b) => ({ key: b, id: b.slice(prefix.length) }));
  const concepts = rows("concept:").flatMap(({ key, id }) => {
    const c = getConcept(id);
    return c ? [{ key, to: conceptPath(id), icon: "bulb", title: c.name, sub: plainText(c.summary) }] : [];
  });
  const terms = rows("term:").flatMap(({ key, id }) => {
    const t = getTerm(id);
    return t ? [{ key, to: termPath(id), icon: "list", title: t.term, sub: plainText(t.plain) }] : [];
  });
  const lessons = rows("lesson:").flatMap(({ key, id }) => {
    const l = getLesson(id);
    return l ? [{ key, to: lessonPath(id), icon: "book", title: l.title, sub: plainText(l.summary) }] : [];
  });
  const groups = [
    { label: "Concepts", items: concepts },
    { label: "Terms", items: terms },
    { label: "Lessons", items: lessons },
  ].filter((g) => g.items.length);

  const byLesson = new Map<string, LessonNote[]>();
  for (const n of [...lab.lessonNotes].sort((a, b) => b.at - a.at)) byLesson.set(n.lesson, [...(byLesson.get(n.lesson) ?? []), n]);
  const noteGroups = [...byLesson].map(([lesson, notes]) => ({ lesson, title: getLesson(lesson)?.title ?? "A lesson", notes: notes.sort((a, b) => a.phase - b.phase || a.beat - b.beat || a.at - b.at) }));

  if (!groups.length && !noteGroups.length) {
    return (
      <Empty
        icon="star"
        title="Nothing saved yet"
        action={
          <Link to="/learn/library" className="ml-text-link">
            Browse the concepts
          </Link>
        }
      >
        Save concepts and terms with the Save button, and add notes in lessons with N. They all collect here.
      </Empty>
    );
  }

  return (
    <div className="ml-lib-saved">
      <section className="ml-lib-saved-col" aria-labelledby="lib-saved-items">
        <h2 id="lib-saved-items" className="ml-lib-section-title">
          Saved <span className="num">{concepts.length + terms.length + lessons.length}</span>
        </h2>
        {groups.length === 0 ? (
          <p className="ml-lib-side-note">Nothing saved yet. Use Save on any concept or term page.</p>
        ) : (
          groups.map((g) => (
            <Card key={g.label} eyebrow={g.label} className="ml-lib-side">
              <ul className="ml-lib-links">
                {g.items.map((it) => (
                  <li key={it.key} className="ml-lib-savedrow">
                    <Link to={it.to} className="ml-lib-linkrow">
                      <Icon name={it.icon} size={16} />
                      <span className="ml-lib-linkrow-main">
                        <b>{it.title}</b>
                        <span>{it.sub}</span>
                      </span>
                    </Link>
                    <IconButton icon="x" size="sm" label={`Remove ${it.title} from Saved`} className="ml-lib-del" onClick={() => store.toggleBookmark(it.key)} />
                  </li>
                ))}
              </ul>
            </Card>
          ))
        )}
      </section>
      <section className="ml-lib-saved-col" aria-labelledby="lib-saved-notes">
        <h2 id="lib-saved-notes" className="ml-lib-section-title">
          Lesson notes <span className="num">{lab.lessonNotes.length}</span>
        </h2>
        {noteGroups.length === 0 ? (
          <p className="ml-lib-side-note">No notes yet. In a lesson, press N (or Notes → Add note) to keep a thought next to the step it belongs to.</p>
        ) : (
          noteGroups.map((g) => (
            <article key={g.lesson} className="ml-card ml-lib-notes" aria-label={`Notes on ${g.title}`}>
              <header className="ml-lib-notes-head">
                <Link to={lessonPath(g.lesson)} className="ml-lib-notes-lesson">
                  <Icon name="book" size={16} />
                  <b>{g.title}</b>
                </Link>
                <span className="ml-lib-notes-count num">{plural(g.notes.length, "note")}</span>
              </header>
              <ul className="ml-lib-notelist">
                {g.notes.map((n) => (
                  <li key={n.id} className="ml-lib-note">
                    <div className="ml-lib-note-main">
                      <span className="ml-lib-note-where">
                        {noteWhere(n)} · {formatDate(n.at, lab.settings.timeZone, { day: "numeric", month: "short" })}
                      </span>
                      <p>{n.text}</p>
                    </div>
                    <IconButton icon="trash" size="sm" label="Delete note" className="ml-lib-del" onClick={() => store.deleteLessonNote(n.id)} />
                  </li>
                ))}
              </ul>
              <Link to={lessonPath(g.lesson)} className="ml-text-arrow">
                Open the lesson <Icon name="arrow-right" size={15} />
              </Link>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
