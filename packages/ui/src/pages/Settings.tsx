import { useMemo, useState, type ReactNode } from "react";
import { TOPICS, type TopicId } from "@market-lab/academy";
import { ENGINE_VERSION } from "@market-lab/engine";
import { EVALUATION_VERSION } from "@market-lab/evaluation";
import { PROFILE_VERSION, type SelfLevel } from "@market-lab/learning";
import { AccentPicker } from "../components/AccentPicker";
import { Avatar, Card, PageHead, SubNav } from "../components/Page";
import { SPEEDS } from "../components/Playback";
import { useToast } from "../components/Toast";
import { Button, Checkbox, Chips, Dialog, Icon, InlineError, Note, Segmented, TextField, cx } from "../components/ui";
import { formatDate } from "../format";
import { AVATARS, PLAN_PRICES, useHost, usePlan } from "../host";
import { Link, useRouter } from "../router";
import { useLab, useStore } from "../store";
import { THEMES, accentById } from "../theme";
import { useUpgrade } from "./Pricing";

function Row({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="ml-setting">
      <div>
        <b>{title}</b>
        {hint && <p className="ml-muted">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={cx("ml-switch", checked && "is-on")} onClick={() => onChange(!checked)}>
      <span />
    </button>
  );
}

// ─── Profile ────────────────────────────────────────────────────────────────

export function ProfileSettingsPage() {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const host = useHost();
  const [name, setName] = useState(lab.profile.displayName);
  const goals = lab.profile.goals;
  const dirty = name.trim() !== lab.profile.displayName;

  return (
    <div className="ml-page ml-page--settings">
      <PageHead title="Profile" sub="How you appear in MARKET//LAB and what you're working towards." />
      <SubNav module="settings" />
      <Card title="Identity">
        <div className="ml-profile-id">
          <Avatar name={host.user?.name || name || "Trader"} avatar={lab.profile.avatar} url={host.user?.avatarUrl} size={56} />
          <div className="ml-stack-4 ml-grow">
            <TextField label="Display name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} hint={host.user?.name ? "Inside Tradelix your account name is shown instead." : "Shown in the sidebar and on your dashboard."} />
            <div className="ml-row">
              <Button
                variant="secondary"
                disabled={!dirty}
                onClick={() => {
                  store.setProfile({ displayName: name.trim() });
                  toast("Profile saved");
                }}
              >
                Save name
              </Button>
            </div>
          </div>
        </div>
        <fieldset className="ml-field">
          <legend className="ml-field-label">Avatar colour</legend>
          <div className="ml-swatches" role="radiogroup" aria-label="Avatar colour">
            {AVATARS.map((a) => (
              <button key={a.id} type="button" role="radio" aria-checked={lab.profile.avatar === a.id} aria-label={a.label} className={cx("ml-swatch-btn", lab.profile.avatar === a.id && "is-on")} style={{ background: a.color }} onClick={() => store.setProfile({ avatar: a.id })} />
            ))}
          </div>
        </fieldset>
      </Card>
      <Card title="Learning level">
        <Row title="How you describe your experience" hint="A starting signal only. Your skill profile is estimated from your decisions and isn't reset by changing this.">
          <Segmented
            label="Learning level"
            value={(lab.profile.selfLevel ?? "unsure") as SelfLevel}
            onChange={(v) => store.setProfile({ selfLevel: v })}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "basics", label: "Know the basics" },
              { value: "unsure", label: "Not sure" },
            ]}
          />
        </Row>
        <Link to="/progress/skills" className="ml-text-link ml-small">
          See your skill profile
        </Link>
      </Card>
      <Card title="Learning goals">
        <Row title="Daily XP goal" hint="Shown on the dashboard and in the top bar.">
          <Segmented label="Daily XP goal" size="sm" value={String(goals.dailyXp)} onChange={(v) => store.setGoals({ dailyXp: Number(v) })} options={[30, 50, 100, 150].map((v) => ({ value: String(v), label: `${v} XP` }))} />
        </Row>
        <Row title="Active days per week" hint="Used for your weekly goal and streak summary.">
          <Segmented label="Active days per week" size="sm" value={String(goals.weeklyDays)} onChange={(v) => store.setGoals({ weeklyDays: Number(v) })} options={[2, 3, 4, 5, 7].map((v) => ({ value: String(v), label: String(v) }))} />
        </Row>
        <div className="ml-field">
          <span className="ml-field-label">Topics you want to focus on</span>
          <Chips
            label="Focus topics"
            options={TOPICS.map((t) => ({ id: t.id, label: t.name }))}
            selected={goals.focus}
            onToggle={(id) => store.setGoals({ focus: goals.focus.includes(id as TopicId) ? goals.focus.filter((x) => x !== id) : [...goals.focus, id as TopicId] })}
          />
        </div>
      </Card>
    </div>
  );
}

// ─── Preferences ────────────────────────────────────────────────────────────

const COMMON_ZONES = ["UTC", "Europe/Bucharest", "Europe/London", "Europe/Berlin", "America/New_York", "America/Chicago", "America/Los_Angeles", "Asia/Dubai", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney"];

export function PreferencesPage() {
  const lab = useLab();
  const store = useStore();
  const s = lab.settings;
  const zones = useMemo(() => {
    const intl = Intl as unknown as { supportedValuesOf?: (k: string) => string[] };
    const all = intl.supportedValuesOf?.("timeZone") ?? COMMON_ZONES;
    return [...new Set([...COMMON_ZONES, ...all])];
  }, []);
  const deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="ml-page ml-page--settings">
      <PageHead title="Preferences" sub="Language, theme, time zone and how charts are displayed." />
      <SubNav module="settings" />
      <Card title="Language and region">
        <Row title="Language" hint="More languages will follow.">
          <label className="ml-select ml-select--inline">
            <span className="ml-sr">Language</span>
            <select value="en" onChange={() => {}}>
              <option value="en">English</option>
              <option value="ro" disabled>
                Română (coming later)
              </option>
            </select>
          </label>
        </Row>
        <Row title="Time zone" hint={`Used for streaks, daily challenges and dates. Device: ${deviceZone}.`}>
          <label className="ml-select ml-select--inline">
            <span className="ml-sr">Time zone</span>
            <select value={s.timeZone} onChange={(e) => store.setSettings({ timeZone: e.target.value })}>
              <option value="auto">Automatic ({deviceZone})</option>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
        </Row>
      </Card>
      <Card title="Theme">
        <div className="ml-themes" role="radiogroup" aria-label="Theme">
          {(Object.keys(THEMES) as (keyof typeof THEMES)[]).map((k) => (
            <button key={k} type="button" role="radio" aria-checked={s.theme === k} className={cx("ml-theme-card", s.theme === k && "is-on")} onClick={() => store.setSettings({ theme: k })}>
              <span className="ml-theme-swatch" style={{ background: THEMES[k].bg }} aria-hidden="true">
                <i />
              </span>
              <b>{THEMES[k].name}</b>
              <span className="ml-muted ml-small">{THEMES[k].note}</span>
            </button>
          ))}
        </div>
        <p className="ml-fine">Both themes are dark: charts and long reading sessions stay easy on the eyes.</p>
      </Card>
      <Card title="Accent colour">
        <p className="ml-body ml-muted">Used for primary actions, selection, progress and the decision markers on charts. Gains and losses keep their own green and red.</p>
        <AccentPicker value={accentById(s.accent).id} onChange={(id) => store.setSettings({ accent: id })} />
      </Card>
      <Card title="Charts">
        <Row title="Default timeframe">
          <Segmented
            label="Default timeframe"
            size="sm"
            value={s.chart.timeframe}
            onChange={(v) => store.setChart({ timeframe: v })}
            options={[
              { value: "1h", label: "1 hour" },
              { value: "4h", label: "4 hours" },
            ]}
          />
        </Row>
        <div className="ml-checks">
          <Checkbox checked={s.chart.volume} onChange={(v) => store.setChart({ volume: v })} label="Show volume" />
          <Checkbox checked={s.chart.grid} onChange={(v) => store.setChart({ grid: v })} label="Show grid lines" />
          <Checkbox checked={s.chart.sma20} onChange={(v) => store.setChart({ sma20: v })} label="Show SMA 20 in the Simulator" />
          <Checkbox checked={s.chart.sma50} onChange={(v) => store.setChart({ sma50: v })} label="Show SMA 50 in the Simulator" />
        </div>
        <Row title="Playback speed" hint="How fast new candles appear while a market plays out.">
          <Segmented label="Playback speed" size="sm" value={String(s.speed)} onChange={(v) => store.setSettings({ speed: Number(v) })} options={SPEEDS} />
        </Row>
        <Row title="Motion" hint="“Follow system” respects your device's reduce-motion setting.">
          <Segmented
            label="Motion"
            size="sm"
            value={s.reducedMotion}
            onChange={(v) => store.setSettings({ reducedMotion: v })}
            options={[
              { value: "system", label: "Follow system" },
              { value: "on", label: "Reduced" },
              { value: "off", label: "Full" },
            ]}
          />
        </Row>
      </Card>
    </div>
  );
}

// ─── Notifications ──────────────────────────────────────────────────────────

export function NotificationsPage() {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const n = lab.settings.notifications;
  return (
    <div className="ml-page ml-page--settings">
      <PageHead title="Notifications" sub="Choose what MARKET//LAB tells you about. Nothing is sent without your choice." />
      <SubNav module="settings" />
      <Note>In the standalone build, notifications appear inside the app. Inside Tradelix they are delivered according to your account's notification settings.</Note>
      <Card title="Learning">
        <Row title="Learning reminders" hint="A gentle nudge on days you haven't practised yet.">
          <Switch checked={n.reminders} onChange={(v) => store.setNotifications({ reminders: v })} label="Learning reminders" />
        </Row>
        {n.reminders && (
          <Row title="Reminder time">
            <input type="time" className="ml-time" value={n.reminderTime} onChange={(e) => store.setNotifications({ reminderTime: e.target.value })} aria-label="Reminder time" />
          </Row>
        )}
        <Row title="Mission updates" hint="New missions, scenarios and weekly challenges.">
          <Switch checked={n.missionUpdates} onChange={(v) => store.setNotifications({ missionUpdates: v })} label="Mission updates" />
        </Row>
        <Row title="Milestones and achievements" hint="When you earn an achievement or reach a milestone.">
          <Switch checked={n.milestones} onChange={(v) => store.setNotifications({ milestones: v })} label="Milestones and achievements" />
        </Row>
      </Card>
      <Card title="Account">
        <Row title="Subscription notifications" hint="Renewals, plan changes and receipts.">
          <Switch checked={n.subscription} onChange={(v) => store.setNotifications({ subscription: v })} label="Subscription notifications" />
        </Row>
      </Card>
      <div className="ml-actions">
        <Button variant="secondary" iconLeft="bell" onClick={() => toast("This is how a notification looks")}>
          Send a test notification
        </Button>
      </div>
    </div>
  );
}

// ─── Privacy & security ─────────────────────────────────────────────────────

export function PrivacyPage() {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const host = useHost();
  const { navigate } = useRouter();
  const [confirmReset, setConfirmReset] = useState(false);
  const p = lab.settings.privacy;

  const exportData = () => {
    const blob = new Blob([store.exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `market-lab-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Your data was exported");
  };

  return (
    <div className="ml-page ml-page--settings">
      <PageHead title="Privacy & Security" sub="Sign-in, your data, and what you consent to." />
      <SubNav module="settings" />
      <Card title="Sign-in">
        <Row title="Authentication" hint={host.user ? "You're signed in with your Tradelix account. Password and two-factor settings live there." : "The standalone build has no account server. Inside Tradelix, sign-in, password and two-factor authentication are managed by your Tradelix account."}>
          <Icon name="shield" size={20} />
        </Row>
        <Row title="Active sessions" hint="Where you're signed in.">
          <span className="ml-muted ml-small">This browser · active now</span>
        </Row>
      </Card>
      <Card title="Privacy preferences">
        <Row title="Personalised recommendations" hint="Use your skill profile and history to pick missions and lessons for you.">
          <Switch checked={p.personalization} onChange={(v) => store.setPrivacy({ personalization: v })} label="Personalised recommendations" />
        </Row>
        <Row title="Anonymous product analytics" hint="Share anonymous usage statistics to improve the product. Off by default; the standalone build sends nothing either way.">
          <Switch checked={p.analytics} onChange={(v) => store.setPrivacy({ analytics: v })} label="Anonymous product analytics" />
        </Row>
      </Card>
      <Card title="Your data">
        <p className="ml-body ml-muted">In the standalone version everything stays in this browser. Nothing is sent anywhere. Inside Tradelix, progress syncs to your account.</p>
        {store.storageError && <InlineError>This browser is blocking storage, so progress won't survive a reload.</InlineError>}
        <Row title="Export" hint="Download your profile, sessions, journal, notes and settings as JSON.">
          <Button variant="secondary" iconLeft="download" onClick={exportData}>
            Export data
          </Button>
        </Row>
        <Row title="Delete account data" hint="Permanently removes your profile, sessions, notes and XP from this browser.">
          <Button variant="destructive" iconLeft="trash" onClick={() => setConfirmReset(true)}>
            Delete data
          </Button>
        </Row>
      </Card>
      <Card title="About">
        <p className="ml-muted num">
          Engine {ENGINE_VERSION} · Scoring {EVALUATION_VERSION} · Profile model {PROFILE_VERSION}
        </p>
        <p className="ml-muted">MARKET//LAB is an educational simulator. Virtual money only. Nothing here is investment advice.</p>
      </Card>
      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Delete all your data?"
        description="Your skill profile, sessions, journal, notes, XP and settings will be permanently removed from this browser. This can't be undone."
        footer={
          <>
            <Button variant="tertiary" onClick={() => setConfirmReset(false)}>
              Keep my data
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                store.reset();
                setConfirmReset(false);
                toast("All data deleted");
                navigate("/");
              }}
            >
              Delete everything
            </Button>
          </>
        }
      />
    </div>
  );
}

// ─── Billing ────────────────────────────────────────────────────────────────

export function BillingPage() {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const host = useHost();
  const { navigate } = useRouter();
  const { pro, source } = usePlan();
  const { start, dialog } = useUpgrade();
  const plan = lab.plan;
  const tz = lab.settings.timeZone;
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (source === "host") {
    return (
      <div className="ml-page ml-page--settings">
        <PageHead title="Billing" sub="Your subscription is managed by your Tradelix account." />
        <SubNav module="settings" />
        <Card title="Current plan">
          <p className="ml-body">{pro ? "Pro" : "Free"}</p>
          <div className="ml-actions">
            {host.onManageBilling && (
              <Button variant="primary" iconLeft="card" onClick={host.onManageBilling}>
                Manage billing in Tradelix
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="ml-page ml-page--settings">
      <PageHead title="Billing" sub="Your plan, renewal, payment history and receipts." />
      <SubNav module="settings" />
      <Note>Demo billing: no payment provider is connected in the standalone build, so no money is ever taken.</Note>
      <Card title="Current subscription">
        <dl className="ml-kv">
          <div>
            <dt>Plan</dt>
            <dd>{pro ? `Pro · ${plan.billing === "annual" ? "annual" : "monthly"}` : "Free"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{!pro ? "Active" : plan.status === "canceled" ? "Canceled, active until the end of the period" : "Active"}</dd>
          </div>
          {pro && plan.renewsAt && (
            <div>
              <dt>{plan.status === "canceled" ? "Access until" : "Renews on"}</dt>
              <dd>{formatDate(plan.renewsAt, tz)}</dd>
            </div>
          )}
          {pro && plan.billing && (
            <div>
              <dt>Price</dt>
              <dd className="num">
                {PLAN_PRICES[plan.billing].label} {PLAN_PRICES[plan.billing].per}
              </dd>
            </div>
          )}
          {pro && plan.since && (
            <div>
              <dt>Pro since</dt>
              <dd>{formatDate(plan.since, tz)}</dd>
            </div>
          )}
        </dl>
        <div className="ml-actions">
          {!pro && (
            <Button variant="primary" iconLeft="sparkle" onClick={() => navigate("/pricing")}>
              Upgrade to Pro
            </Button>
          )}
          {pro && plan.billing === "monthly" && plan.status === "active" && (
            <Button variant="secondary" onClick={() => start("annual")}>
              Switch to annual
            </Button>
          )}
          {pro && plan.billing === "annual" && plan.status === "active" && (
            <Button variant="secondary" onClick={() => start("monthly")}>
              Switch to monthly
            </Button>
          )}
          {pro && plan.status === "active" && (
            <Button variant="tertiary" onClick={() => setConfirmCancel(true)}>
              Cancel subscription
            </Button>
          )}
          {pro && plan.status === "canceled" && (
            <Button
              variant="secondary"
              onClick={() => {
                store.resumePlan();
                toast("Subscription resumed");
              }}
            >
              Resume subscription
            </Button>
          )}
          {pro && (
            <Button
              variant="tertiary"
              onClick={() => {
                store.downgrade();
                toast("You're on the Free plan");
              }}
            >
              Downgrade to Free now
            </Button>
          )}
        </div>
      </Card>
      <Card title="Payment method">
        <p className="ml-muted">Payment methods are handled by the payment provider and never stored by MARKET//LAB. Not available in the standalone demo.</p>
      </Card>
      <Card title="Billing history">
        {plan.history.length === 0 ? (
          <p className="ml-muted">No payments yet. Invoices and receipts will be listed here.</p>
        ) : (
          <div className="ml-table-wrap">
            <table className="ml-table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Description</th>
                  <th scope="col" className="num">
                    Amount
                  </th>
                  <th scope="col">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {plan.history.map((h) => (
                  <tr key={h.id}>
                    <td>{formatDate(h.at, tz)}</td>
                    <th scope="row">{h.description}</th>
                    <td className="num">${(h.amount / 100).toFixed(2)}</td>
                    <td className="ml-muted">Demo, none issued</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Dialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel Pro?"
        description={`Pro stays active until ${plan.renewsAt ? formatDate(plan.renewsAt, tz) : "the end of the period"}. After that you'll be on Free. Your progress, history and journal are kept.`}
        footer={
          <>
            <Button variant="tertiary" onClick={() => setConfirmCancel(false)}>
              Keep Pro
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                store.cancelPlan();
                setConfirmCancel(false);
                toast("Subscription canceled");
              }}
            >
              Cancel subscription
            </Button>
          </>
        }
      />
      {dialog}
    </div>
  );
}
