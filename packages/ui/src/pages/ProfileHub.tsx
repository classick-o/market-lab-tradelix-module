import { NAV } from "../nav";
import { Avatar, Card, PageHead } from "../components/Page";
import { Button, Icon, Meter } from "../components/ui";
import { useHost, usePlan } from "../host";
import { useProgress } from "../progress";
import { Link, useRouter } from "../router";
import { useLab, useStore } from "../store";

/** Mobile "Profile" destination: everything that isn't in the bottom bar, one tap away. */
export function ProfileHubPage() {
  const lab = useLab();
  const store = useStore();
  const host = useHost();
  const { navigate } = useRouter();
  const { pro } = usePlan();
  const { level, rank, streak } = useProgress(lab);
  const name = host.user?.name || lab.profile.displayName || "Trader";
  const groups = NAV.filter((n) => n.id === "journal" || n.id === "progress" || n.id === "settings");

  return (
    <div className="ml-page">
      <PageHead title="Profile" sub="Your journal, progress, settings and plan." />
      <Card className="ml-hub-user">
        <div className="ml-row">
          <Avatar name={name} avatar={lab.profile.avatar} url={host.user?.avatarUrl} size={48} />
          <div className="ml-stack-1 ml-grow">
            <b>{name}</b>
            <span className="ml-muted ml-small">
              Level {level.level} · {rank.title} · {pro ? "Pro" : "Free"} plan · {streak.current}-day streak
            </span>
            <Meter value={level.into / level.needed} label={`${level.needed - level.into} XP to level ${level.level + 1}`} />
          </div>
        </div>
      </Card>
      {groups.map((g) => (
        <section key={g.id} className="ml-hub-group" aria-labelledby={`hub-${g.id}`}>
          <h2 id={`hub-${g.id}`} className="ml-hub-title">
            <Icon name={g.icon} size={18} /> {g.label}
          </h2>
          <ul className="ml-rows">
            {g.children!.map((c) => (
              <li key={c.id}>
                <Link to={c.to} className="ml-row-link">
                  <Icon name={c.icon} size={18} />
                  <span className="ml-row-main">
                    <b>{c.label}</b>
                  </span>
                  <Icon name="chevron-right" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section className="ml-hub-group" aria-label="Plan">
        <ul className="ml-rows">
          <li>
            <Link to={pro ? "/settings/billing" : "/pricing"} className="ml-row-link">
              <Icon name="sparkle" size={18} />
              <span className="ml-row-main">
                <b>{pro ? "Manage plan" : "Upgrade to Pro"}</b>
                <span className="ml-muted">{pro ? "Billing, renewal and receipts" : "Advanced scenarios, paths and analytics"}</span>
              </span>
              <Icon name="chevron-right" size={18} />
            </Link>
          </li>
        </ul>
      </section>
      <Button
        variant="tertiary"
        iconLeft="logout"
        onClick={() => {
          if (host.onSignOut) host.onSignOut();
          else {
            store.signOut();
            navigate("/");
          }
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
