import { useState } from "react";
import { LEARNING_PATHS, LESSONS } from "@market-lab/academy";
import { ARENA_SCENARIOS } from "@market-lab/missions";
import { Card, PageHead } from "../components/Page";
import { useToast } from "../components/Toast";
import { Button, Dialog, Icon, Note, Segmented, cx } from "../components/ui";
import { LIMITS, PLAN_PRICES, useHost, usePlan } from "../host";
import { useRouter } from "../router";
import { useLab, useStore } from "../store";

const FEATURES: { label: string; free: string | boolean; pro: string | boolean }[] = [
  { label: "All missions, with a fresh market every attempt", free: true, pro: true },
  { label: "Daily and weekly challenges, assessments", free: true, pro: true },
  { label: "Risk Calculator and every risk-management lesson", free: true, pro: true },
  { label: "Arena scenarios", free: "6 core scenarios", pro: "All 9, incl. high volatility, false breakout and unexpected event" },
  { label: "Arena sessions", free: `${LIMITS.free.arenaPerDay} per day`, pro: "Unlimited" },
  { label: "Learning paths", free: "Beginner, Risk Management, Technical Analysis", pro: "All, incl. Intermediate and Trading Psychology" },
  { label: "Lessons", free: `${LESSONS.filter((l) => l.tier === "free").length} lessons`, pro: `All ${LESSONS.length}` },
  { label: "Performance analytics history", free: `Last ${LIMITS.free.analyticsDays} days`, pro: "Full history" },
  { label: "Skill trends and session comparisons", free: false, pro: true },
  { label: "Exportable learning reports (CSV)", free: false, pro: true },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Icon name="check" size={16} className="ml-accent-text" />;
  if (v === false) return <span className="ml-muted">—</span>;
  return <span>{v}</span>;
}

/** Shared by Pricing and Billing: the demo checkout, or the host's checkout inside Tradelix. */
export function useUpgrade() {
  const host = useHost();
  const store = useStore();
  const toast = useToast();
  const [pending, setPending] = useState<"monthly" | "annual" | null>(null);
  const start = (billing: "monthly" | "annual") => (host.onUpgrade ? host.onUpgrade(billing) : setPending(billing));
  const dialog = (
    <Dialog
      open={pending !== null}
      onClose={() => setPending(null)}
      title="Start Pro"
      description="This standalone build has no payment provider. Starting Pro here is a demo: it unlocks Pro features on this device and no payment is taken."
      footer={
        <>
          <Button variant="tertiary" onClick={() => setPending(null)}>
            Not now
          </Button>
          <Button
            variant="primary"
            iconLeft="sparkle"
            onClick={() => {
              if (pending) store.upgrade(pending);
              setPending(null);
              toast("Pro is active (demo)");
            }}
          >
            Start Pro {pending === "annual" ? "annual" : "monthly"} (demo)
          </Button>
        </>
      }
    >
      {pending && (
        <p className="ml-body num">
          {PLAN_PRICES[pending].label} {PLAN_PRICES[pending].per}. {PLAN_PRICES[pending].note}
        </p>
      )}
    </Dialog>
  );
  return { start, dialog };
}

export function PricingPage() {
  const lab = useLab();
  const { navigate } = useRouter();
  const { pro, source } = usePlan();
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const { start, dialog } = useUpgrade();
  const used = Object.values(lab.sessions).filter((s) => s.kind === "arena" && s.createdAt >= new Date().setHours(0, 0, 0, 0)).length;
  const price = PLAN_PRICES[billing];

  return (
    <div className="ml-page">
      <PageHead
        title={pro ? "Your plan: Pro" : "Upgrade to Pro"}
        sub="Pro adds advanced scenarios, deeper learning paths and full analytics. Essential risk tools and safety information stay free for everyone."
        actions={
          <Segmented
            label="Billing period"
            value={billing}
            onChange={setBilling}
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "annual", label: "Annual · save 33%" },
            ]}
          />
        }
      />
      {source === "demo" && <Note>Demo pricing for the standalone build. No payment is taken here; inside Tradelix, plans and billing come from your account.</Note>}

      <div className="ml-plans">
        <section className={cx("ml-plan", !pro && "is-current")} aria-label="Free plan">
          <span className="ml-eyebrow">Free</span>
          <span className="ml-plan-price num">
            $0<small> forever</small>
          </span>
          <p className="ml-muted">Everything you need to learn the fundamentals and practise risk management.</p>
          <ul className="ml-list ml-list--check">
            <li>All missions and challenges</li>
            <li>6 Arena scenarios, {LIMITS.free.arenaPerDay} sessions a day</li>
            <li>Risk Calculator, glossary and concept library</li>
            <li>{LEARNING_PATHS.filter((p) => p.tier === "free").length} learning paths</li>
          </ul>
          <Button variant="secondary" block disabled>
            {pro ? "Included" : "Your current plan"}
          </Button>
        </section>
        <section className={cx("ml-plan ml-plan--pro", pro && "is-current")} aria-label="Pro plan">
          <span className="ml-eyebrow">Pro · {billing === "annual" ? "annual" : "monthly"}</span>
          <span className="ml-plan-price num">
            {price.label}
            <small> {price.per}</small>
          </span>
          <p className="ml-muted">{price.note}</p>
          <ul className="ml-list ml-list--check">
            <li>All 9 Arena scenarios, unlimited sessions</li>
            <li>Intermediate and Trading Psychology paths</li>
            <li>Full analytics history, skill trends, session comparisons</li>
            <li>Exportable learning reports</li>
          </ul>
          {pro ? (
            <Button variant="secondary" block onClick={() => navigate("/settings/billing")}>
              Manage plan
            </Button>
          ) : (
            <Button variant="primary" block iconLeft="sparkle" onClick={() => start(billing)}>
              Upgrade to Pro
            </Button>
          )}
        </section>
      </div>

      <Card title="Compare plans">
        <div className="ml-table-wrap">
          <table className="ml-table ml-table--compare">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Free</th>
                <th scope="col">Pro</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.label}>
                  <th scope="row">{f.label}</th>
                  <td>
                    <Cell v={f.free} />
                  </td>
                  <td>
                    <Cell v={f.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="ml-grid ml-grid--3">
        <Card title="Premium learning">
          <ul className="ml-list">
            {LEARNING_PATHS.filter((p) => p.tier === "pro").map((p) => (
              <li key={p.id}>{p.title}</li>
            ))}
            {LESSONS.filter((l) => l.tier === "pro").map((l) => (
              <li key={l.id}>Lesson: {l.title}</li>
            ))}
            {ARENA_SCENARIOS.filter((s) => s.tier === "pro").map((s) => (
              <li key={s.id}>Scenario: {s.title}</li>
            ))}
          </ul>
        </Card>
        <Card title="Advanced analytics">
          <ul className="ml-list">
            <li>Full history instead of {LIMITS.free.analyticsDays} days</li>
            <li>Per-skill trend lines</li>
            <li>Side-by-side session comparisons</li>
            <li>CSV learning reports</li>
          </ul>
        </Card>
        <Card title="Usage limits">
          <dl className="ml-kv">
            <div>
              <dt>Arena sessions today</dt>
              <dd className="num">{pro ? `${used} · unlimited` : `${used} of ${LIMITS.free.arenaPerDay}`}</dd>
            </div>
            <div>
              <dt>Analytics history</dt>
              <dd>{pro ? "Full" : `${LIMITS.free.analyticsDays} days`}</dd>
            </div>
            <div>
              <dt>Risk Calculator</dt>
              <dd>Unlimited on every plan</dd>
            </div>
          </dl>
          <p className="ml-fine">Limits reset at midnight in your time zone. AI features are not part of this product.</p>
        </Card>
      </div>

      <section className="ml-faq" aria-label="Questions">
        {[
          ["Is Pro investment advice or a trading signal service?", "No. MARKET//LAB is an educational simulator. Pro adds practice material and analysis of your own decisions; it never tells you what to trade."],
          ["Can I buy XP or levels?", "No. XP is only earned by learning activity, on every plan."],
          ["What happens if I cancel?", "Pro stays active until the end of the paid period. After that you're on Free; your progress, history and journal are kept."],
          ["Are risk tools behind the paywall?", "No. The Risk Calculator, risk-management lessons and safety information are free for everyone."],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      {dialog}
    </div>
  );
}
