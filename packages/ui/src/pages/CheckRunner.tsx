import { useState } from "react";
import { TOPIC_BY_ID, getCheck, getLesson, getQuestion, isCorrect, type Question } from "@market-lab/academy";
import { Card, PageHead } from "../components/Page";
import { QuestionCard } from "../components/Quiz";
import { useToast } from "../components/Toast";
import { Button, Empty, Icon, InlineError, Meter } from "../components/ui";
import { formatDate } from "../format";
import { Link, useRouter } from "../router";
import { useLab, useStore } from "../store";

/** Runs a knowledge check or a topic assessment: answer everything, then see explanations. */
export function CheckPage({ checkId }: { checkId: string }) {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const { navigate } = useRouter();
  const check = getCheck(checkId);
  const attempts = lab.checks[checkId] ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ correct: number; total: number; passed: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!check) return <Empty title="Check not found" action={<Link to="/learn/checks" className="ml-text-link">Knowledge checks</Link>} />;

  const qs = check.questionIds.map(getQuestion).filter((q): q is Question => Boolean(q));
  const topic = TOPIC_BY_ID[check.topic];
  const best = attempts.reduce<number | null>((b, a) => Math.max(b ?? 0, Math.round((a.correct / a.total) * 100)), null);
  const missedLessons = result
    ? [...new Set(qs.filter((q) => !isCorrect(q, answers[q.id])).map((q) => q.lesson))].map(getLesson).filter((l): l is NonNullable<typeof l> => Boolean(l))
    : [];

  const submit = () => {
    if (qs.some((q) => !answers[q.id]?.trim())) return setError(`Answer all ${qs.length} questions before submitting.`);
    setError(null);
    const correct = qs.filter((q) => isCorrect(q, answers[q.id])).length;
    const r = store.submitCheck(checkId, answers, correct, qs.length, topic.skill);
    setResult({ correct, total: qs.length, passed: r.passed });
    if (r.firstPass) toast(`${check.kind === "assessment" ? "Assessment" : "Check"} passed · XP earned`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="ml-page ml-lesson">
      <PageHead
        back={check.kind === "assessment" ? { to: "/missions/assessments", label: "Assessments" } : { to: "/learn/checks", label: "Knowledge Checks" }}
        eyebrow={`${topic.name} · ${qs.length} questions · pass with ${check.passPct}%`}
        title={check.title}
        sub={check.description}
      />
      {result ? (
        <Card eyebrow={result.passed ? "Passed" : "Not passed yet"} className="ml-card--feature">
          <div className="ml-check-result">
            <span className="ml-calc-qty num">{Math.round((result.correct / result.total) * 100)}%</span>
            <div className="ml-stack-2">
              <b className="num">
                {result.correct} of {result.total} correct · your {topic.name} knowledge score
              </b>
              <Meter value={result.correct / result.total} label="Score" />
              <span className="ml-muted">{result.passed ? "Explanations are below. Review any you got wrong." : `You need ${check.passPct}% to pass. Read the explanations, review the lessons, then retake.`}</span>
            </div>
          </div>
          {missedLessons.length > 0 && (
            <div className="ml-stack-2">
              <span className="ml-eyebrow">Suggested review</span>
              <div className="ml-pills">
                {missedLessons.map((l) => (
                  <Link key={l.id} to={`/learn/lessons/${l.id}`} className="ml-pill">
                    <Icon name="book" size={14} /> {l.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="ml-actions">
            <Button
              variant="secondary"
              iconLeft="replay"
              onClick={() => {
                setAnswers({});
                setResult(null);
              }}
            >
              Retake
            </Button>
            <Button variant="tertiary" onClick={() => navigate(check.kind === "assessment" ? "/missions/assessments" : "/learn/checks")}>
              Done
            </Button>
          </div>
        </Card>
      ) : (
        attempts.length > 0 && (
          <p className="ml-note">
            <Icon name="info" size={16} />
            <span className="num">
              {attempts.length} previous {attempts.length === 1 ? "attempt" : "attempts"} · best {best}% · last on {formatDate(attempts[attempts.length - 1].at, lab.settings.timeZone)}
            </span>
          </p>
        )
      )}
      <div className="ml-stack-4 ml-check-list">
        {qs.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} value={answers[q.id] ?? ""} graded={Boolean(result)} onChange={(v) => setAnswers({ ...answers, [q.id]: v })} />
        ))}
      </div>
      {!result && (
        <div className="ml-actions">
          {error && <InlineError>{error}</InlineError>}
          <Button variant="primary" size="lg" iconRight="check" onClick={submit}>
            Submit answers
          </Button>
          <span className="ml-muted ml-small num">
            {Object.values(answers).filter((v) => v.trim()).length} of {qs.length} answered
          </span>
        </div>
      )}
    </div>
  );
}
