import { useEffect, useState } from "react";
import { LEVEL_LABEL, SKILLS, confidenceOf, levelOf, recommend, thetaProgress, type SelfLevel } from "@market-lab/learning";
import { LEARNING_PATH, MISSIONS, PLACEMENT, getMission, missionMeta } from "@market-lab/missions";
import { Chart } from "../components/Chart";
import { Button, Icon, Meter, RadioRow, TextField, cx } from "../components/ui";
import { useRouter } from "../router";
import { missionHistory, useLab, useStore } from "../store";

const LEVELS: { id: SelfLevel; title: string; text: string }[] = [
  { id: "beginner", title: "I'm just starting", text: "Charts, orders and risk are mostly new to me." },
  { id: "basics", title: "I know the basics", text: "I can read candles and know order types. I want to practise decisions." },
  { id: "unsure", title: "I'm not sure", text: "Let a few quick questions figure it out." },
];

function Steps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="ml-onb-steps" aria-label={`Step ${current} of 3`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={cx(n < current && "is-done", n === current && "is-on")} />
      ))}
      <span className="ml-onb-step-label num">{current} / 3</span>
    </div>
  );
}

export function OnboardingPage({ retake = false }: { retake?: boolean }) {
  const lab = useLab();
  const store = useStore();
  const { navigate } = useRouter();
  const [stage, setStage] = useState<"level" | "quiz" | "profile">(retake ? "quiz" : lab.profile.onboarded ? "profile" : lab.profile.selfLevel ? "quiz" : "level");
  const [idx, setIdx] = useState(() => (retake ? 0 : Math.min(PLACEMENT.length - 1, Object.keys(lab.profile.placementAnswers).length)));
  const [name, setName] = useState(lab.profile.displayName);
  useEffect(() => {
    if (retake) store.restartPlacement();
  }, [retake, store]);
  const [revealed, setRevealed] = useState<string | null>(null);
  const item = PLACEMENT[idx];

  if (stage === "level") {
    return (
      <div className="ml-page ml-onb">
        <Steps current={1} />
        <header className="ml-page-head">
          <h1>Where are you starting from?</h1>
          <p className="ml-page-sub">A starting signal, not a label. Your profile adjusts with every decision you make.</p>
        </header>
        <TextField label="What should we call you?" hint="Optional. Shown in your profile; you can change it later." value={name} maxLength={40} autoComplete="nickname" onChange={(e) => setName(e.target.value)} />
        <div className="ml-stack-2">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              className="ml-choice"
              onClick={() => {
                if (name.trim()) store.setProfile({ displayName: name.trim() });
                store.setSelfLevel(l.id);
                setIdx(0);
                setStage("quiz");
              }}
            >
              <span className="ml-choice-body">
                <b>{l.title}</b>
                <span>{l.text}</span>
              </span>
              <Icon name="arrow-right" size={20} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "quiz" && item) {
    const answered = revealed ?? lab.profile.placementAnswers[item.id] ?? null;
    const correct = answered === item.correct;
    return (
      <div className="ml-page ml-onb">
        <div className="ml-row ml-row--between">
          <Steps current={2} />
          <Button
            size="sm"
            variant="tertiary"
            onClick={() => {
              store.finishOnboarding(true);
              setStage("profile");
            }}
          >
            Skip the questions
          </Button>
        </div>
        <header className="ml-page-head">
          <span className="ml-eyebrow num">
            Question {idx + 1} of {PLACEMENT.length}
          </span>
          <h1 className="ml-h1-sm">{item.prompt}</h1>
        </header>
        {item.chart && (
          <div className="ml-panel ml-chart-panel">
            <Chart
              candles={item.chart.candles}
              visibleTo={item.chart.candles.length - 1}
              height={200}
              minBarWidth={18}
              highlightCandle={item.chart.highlight}
              showHeader={false}
              label="Question chart"
            />
          </div>
        )}
        <div className="ml-stack-2" role="radiogroup" aria-label={item.prompt}>
          {item.options.map((o) => (
            <RadioRow
              key={o.id}
              name={item.id}
              selected={answered === o.id}
              onSelect={() => {
                if (answered) return;
                store.answerPlacement(item.id, o.id);
                setRevealed(o.id);
              }}
              title={o.label}
              trailing={answered && o.id === item.correct ? <span className="ml-radio-trail"><Icon name="check" size={16} /> Correct</span> : undefined}
            />
          ))}
        </div>
        {answered && (
          <p className="ml-explain ml-enter-up" role="status">
            <b>{correct ? "Right." : answered === "unsure" ? "No problem." : "Not quite."}</b> {item.explain}
          </p>
        )}
        <div className="ml-row ml-row--end">
          <Button
            variant="primary"
            iconRight="arrow-right"
            disabled={!answered}
            onClick={() => {
              setRevealed(null);
              if (idx + 1 < PLACEMENT.length) setIdx(idx + 1);
              else {
                store.finishOnboarding(false);
                setStage("profile");
              }
            }}
          >
            {idx + 1 < PLACEMENT.length ? "Continue" : "See my profile"}
          </Button>
        </div>
      </div>
    );
  }

  const rec = recommend({ missions: MISSIONS.map(missionMeta), skills: lab.skills, history: missionHistory(lab), path: LEARNING_PATH, now: Date.now() });
  const first = getMission(rec.primary?.missionId ?? LEARNING_PATH[0]);
  const skills = SKILLS.filter((s) => s.id !== "reflection_review" || lab.skills[s.id].n > 0);

  return (
    <div className="ml-page ml-onb ml-onb--wide">
      <Steps current={3} />
      <header className="ml-page-head">
        <h1>Your starting point</h1>
        <p className="ml-page-sub">An early estimate with low confidence. It sharpens with every mission, and a single mistake never defines it.</p>
      </header>
      <div className="ml-onb-result">
        <section className="ml-panel ml-next">
          <span className="ml-eyebrow">Your first mission</span>
          <h2>{first.title}</h2>
          <p className="ml-body ml-muted">{first.tagline}</p>
          {rec.primary && <p className="ml-why">{rec.primary.reason}</p>}
          <div className="ml-actions">
            <Button variant="primary" size="lg" iconRight="arrow-right" onClick={() => navigate(`/play/${store.startMission(first.id)}`)}>
              Start mission
            </Button>
            <Button variant="tertiary" size="lg" onClick={() => navigate("/dashboard")}>
              Go to the dashboard
            </Button>
          </div>
        </section>
        <section aria-label="Estimated skills">
          <ul className="ml-skill-rows">
            {skills.map((s) => {
              const st = lab.skills[s.id];
              return (
                <li key={s.id}>
                  <span className="ml-skill-name">{s.name}</span>
                  <Meter value={thetaProgress(st.theta)} label={`${s.name} estimate`} />
                  <span className="ml-skill-level">
                    {LEVEL_LABEL[levelOf(st.theta)]} <span className="ml-muted">· {confidenceOf(st)} confidence</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
