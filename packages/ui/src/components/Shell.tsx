import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { dailyChallenge, QUESTIONS } from "@market-lab/academy";
import { MISSIONS } from "@market-lab/missions";
import { BOTTOM_NAV, NAV, NAV_GROUPS, resolveNav } from "../nav";
import { useHost, usePlan } from "../host";
import { formatDate } from "../format";
import { useProgress } from "../progress";
import { Link, useRouter } from "../router";
import { useLab, useStore } from "../store";
import { Dialog, Icon, SimBadge, cx } from "./ui";

/** Brand: "MARKET//LAB" with the slashes in the accent; "ML" monogram when the sidebar is a rail. */
function Brand({ brand }: { brand?: ReactNode }) {
  return (
    <Link to="/dashboard" className="ml-sb-brand" aria-label="MARKET//LAB dashboard">
      <span className="ml-sb-mark" aria-hidden="true">
        {brand ?? "ML"}
      </span>
      <span className="ml-sb-word">
        MARKET<span aria-hidden="true">//</span>
        <span className="ml-sr">, </span>LAB
        <small>Trading Skill Academy</small>
      </span>
    </Link>
  );
}

/** Small dots, only for something the user can act on now. */
function useBadges(): Record<string, string> {
  const lab = useLab();
  const store = useStore();
  const { today } = useProgress(lab);
  const badges: Record<string, string> = {};
  if (lab.profile.onboarded && !lab.dailies[today] && dailyChallenge(today, QUESTIONS).items.length) badges.daily = "Today's challenge is waiting";
  if (store.activeArena()) badges.simulator = "Session in progress";
  return badges;
}

function LevelBox() {
  const lab = useLab();
  const { level, rank } = useProgress(lab);
  const toNext = level.needed - level.into;
  return (
    <Link to="/progress/xp" className="ml-sb-level" aria-label={`Level ${level.level}, ${rank.title}. ${level.into} of ${level.needed} XP, ${toNext} to level ${level.level + 1}.`}>
      <span className="ml-sb-level-top">
        <span className="ml-sb-level-icon" aria-hidden="true">
          <Icon name="bolt" size={18} />
        </span>
        <span className="ml-sb-level-text">
          <strong>
            Level {level.level} <span className="ml-sb-slash">/</span> {rank.title}
          </strong>
          <small>Keep building your edge.</small>
        </span>
      </span>
      <span className="ml-sb-progress" aria-hidden="true">
        <i style={{ width: `${Math.round((level.into / level.needed) * 100)}%` }} />
      </span>
      <span className="ml-sb-xp" aria-hidden="true">
        <span className="num">
          {level.into.toLocaleString("en-US")} <span>/ {level.needed.toLocaleString("en-US")} XP</span>
        </span>
        <span className="num">
          {toNext} to level {level.level + 1}
        </span>
      </span>
    </Link>
  );
}

function NavTree({ collapsed, badges, onNavigate }: { collapsed: boolean; badges: Record<string, string>; onNavigate?: () => void }) {
  const lab = useLab();
  const { path } = useRouter();
  const match = resolveNav(path);
  const [open, setOpen] = useState<Record<string, boolean>>(() => (match.item?.children ? { [match.item.id]: true } : {}));
  const notStarted = MISSIONS.filter((m) => !Object.values(lab.results).some((r) => r.missionId === m.id)).length;

  // The section that contains the current page opens by itself; others keep their state.
  useEffect(() => {
    if (match.item?.children) setOpen((o) => (o[match.item!.id] ? o : { ...o, [match.item!.id]: true }));
  }, [match.item]);

  return (
    <nav className="ml-sb-nav" aria-label="Market Lab">
      {NAV_GROUPS.filter((g) => g.id !== "account").map((g) => (
        <div key={g.id} className="ml-sb-group">
          <p className="ml-sb-group-label">{g.label}</p>
          <ul>
            {NAV.filter((n) => n.group === g.id).map((item) => {
              const active = match.item?.id === item.id;
              const isOpen = Boolean(open[item.id]);
              const childBadge = item.children?.find((c) => badges[c.id]);
              const subId = `ml-sb-sub-${item.id}`;
              const count = item.id === "missions" && notStarted > 0 ? notStarted : null;
              return (
                <li key={item.id} className={cx("ml-sb-item", active && "is-active", isOpen && "is-open")}>
                  <div className="ml-sb-row">
                    <Link
                      to={item.to}
                      className="ml-sb-link"
                      aria-current={active && !match.child ? "page" : undefined}
                      onClick={() => {
                        if (item.children) setOpen((o) => ({ ...o, [item.id]: true }));
                        onNavigate?.();
                      }}
                    >
                      <Icon name={item.icon} size={18} />
                      <span className="ml-sb-label">{item.label}</span>
                      {count !== null && (
                        <b className="ml-sb-count num" title={`${count} missions not started yet`}>
                          {count}
                          <span className="ml-sr"> missions not started</span>
                        </b>
                      )}
                      {collapsed && childBadge && <span className="ml-dot" aria-hidden="true" />}
                    </Link>
                    {item.children && !collapsed && (
                      <button
                        type="button"
                        className="ml-sb-toggle"
                        aria-expanded={isOpen}
                        aria-controls={subId}
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                        onClick={() => setOpen((o) => ({ ...o, [item.id]: !isOpen }))}
                      >
                        <Icon name="chevron-right" size={14} />
                        {!isOpen && childBadge && <span className="ml-dot" aria-hidden="true" />}
                      </button>
                    )}
                  </div>
                  {item.children && !collapsed && (
                    <ul id={subId} className="ml-sb-sub" hidden={!isOpen}>
                      {item.children.map((c) => (
                        <li key={c.id}>
                          <Link to={c.to} className="ml-sb-sublink" aria-current={active && match.child?.id === c.id ? "page" : undefined} onClick={onNavigate}>
                            <span>{c.label}</span>
                            {badges[c.id] && (
                              <>
                                <span className="ml-dot" aria-hidden="true" />
                                <span className="ml-sr"> ({badges[c.id]})</span>
                              </>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {collapsed && (
                    <div className="ml-sb-flyout">
                      <span className="ml-sb-flyout-title" aria-hidden="true">
                        {item.label}
                      </span>
                      {item.children && (
                        <ul>
                          {item.children.map((c) => (
                            <li key={c.id}>
                              <Link to={c.to} className="ml-sb-sublink" aria-current={active && match.child?.id === c.id ? "page" : undefined}>
                                <span>{c.label}</span>
                                {badges[c.id] && <span className="ml-dot" aria-hidden="true" />}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** "Upgrade to Pro" for Free users; plan management for Pro users. */
function ProCard({ onNavigate }: { onNavigate?: () => void }) {
  const { pro } = usePlan();
  const { path } = useRouter();
  const to = pro ? "/settings/billing" : "/pricing";
  return (
    <Link to={to} className={cx("ml-sb-pro", path === to && "is-current")} onClick={onNavigate} aria-label={pro ? "Manage your Pro plan" : "Upgrade to Pro: advanced scenarios and analytics"}>
      <strong>{pro ? "MARKET//LAB Pro" : "Upgrade to Pro"}</strong>
      <small>{pro ? "Your plan is active. Billing and renewal." : "Advanced scenarios & analytics"}</small>
      <span className="ml-sb-pro-action">
        {pro ? "Manage plan" : "Explore Pro"}
        <Icon name="arrow-right" size={15} />
      </span>
    </Link>
  );
}

function NotificationsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lab = useLab();
  const { today, achievements, streak } = useProgress(lab);
  const recent = achievements
    .filter((a) => a.status.unlocked && a.status.at)
    .sort((a, b) => b.status.at! - a.status.at!)
    .slice(0, 3);
  const dailyDone = Boolean(lab.dailies[today]);
  const items: { icon: string; title: string; text: string; to: string }[] = [];
  if (!dailyDone) items.push({ icon: "target", title: "Your daily challenge is ready", text: "A fresh opportunity to sharpen your process.", to: "/missions/daily" });
  if (streak.atRisk) items.push({ icon: "flame", title: `Keep your ${streak.current}-day streak`, text: "Complete anything today: a lesson, a check or a mission.", to: "/progress/streaks" });
  for (const a of recent) items.push({ icon: "trophy", title: `Achievement unlocked: ${a.title}`, text: `${a.description} · ${formatDate(a.status.at!, lab.settings.timeZone, { day: "numeric", month: "short" })}`, to: "/progress/achievements" });

  return (
    <Dialog open={open} onClose={onClose} title="Notifications" description={items.length ? "You're building momentum." : "Nothing new right now."}>
      {items.length > 0 && (
        <ul className="ml-notes">
          {items.map((n) => (
            <li key={n.title}>
              <Link to={n.to} className="ml-note-item" onClick={onClose}>
                <Icon name={n.icon} size={22} />
                <span>
                  <strong>{n.title}</strong>
                  <span>{n.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link to="/settings/notifications" className="ml-text-link ml-small" onClick={onClose}>
        Notification settings
      </Link>
    </Dialog>
  );
}

function AccountRow({ onSignOut, onNavigate }: { onSignOut: () => void; onNavigate?: () => void }) {
  const lab = useLab();
  const host = useHost();
  const { pro } = usePlan();
  const { path } = useRouter();
  const { rank } = useProgress(lab);
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const name = host.user?.name || lab.profile.displayName || "Trader";

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector<HTMLButtonElement>(".ml-sb-account")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="ml-sb-accountrow" ref={ref}>
      <button type="button" className="ml-sb-account" aria-expanded={open} aria-controls={menuId} title="Your account" onClick={() => setOpen((o) => !o)}>
        <strong>{name}</strong>
        <small>
          {pro ? "Pro" : "Free"} plan · {rank.title}
        </small>
      </button>
      <Link to="/settings/profile" className={cx("ml-sb-iconbtn", path.startsWith("/settings") && "is-on")} aria-label="Settings" title="Settings" onClick={onNavigate}>
        <Icon name="gear" size={19} />
      </Link>
      <button type="button" className="ml-sb-iconbtn" aria-label="Notifications" title="Notifications" onClick={() => setBell(true)}>
        <Icon name="bell" size={19} />
      </button>
      <div id={menuId} className="ml-sb-menu" hidden={!open}>
        <Link to="/settings/profile" className="ml-sb-menu-item" onClick={onNavigate}>
          <Icon name="user" size={16} /> Profile
        </Link>
        <Link to="/settings/preferences" className="ml-sb-menu-item" onClick={onNavigate}>
          <Icon name="globe" size={16} /> Preferences
        </Link>
        <Link to="/settings/billing" className="ml-sb-menu-item" onClick={onNavigate}>
          <Icon name="card" size={16} /> {pro ? "Manage plan" : "Billing"}
        </Link>
        <hr />
        <button
          type="button"
          className="ml-sb-menu-item"
          onClick={() => {
            setOpen(false);
            onSignOut();
          }}
        >
          <Icon name="logout" size={16} /> Sign out
        </button>
      </div>
      <NotificationsDialog open={bell} onClose={() => setBell(false)} />
    </div>
  );
}

export function Sidebar({ collapsed, canCollapse, brand, onSignOut, onNavigate, inDrawer }: { collapsed: boolean; canCollapse: boolean; brand?: ReactNode; onSignOut: () => void; onNavigate?: () => void; inDrawer?: boolean }) {
  const lab = useLab();
  const store = useStore();
  const badges = useBadges();
  return (
    <aside className={cx("ml-sidebar", collapsed && "is-collapsed", inDrawer && "is-drawer")} aria-label="Sidebar">
      <div className="ml-sb-head">
        <Brand brand={brand} />
        {canCollapse && (
          <button
            type="button"
            className="ml-sb-collapse"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => store.setSettings({ sidebarCollapsed: !lab.settings.sidebarCollapsed })}
          >
            <Icon name="menu" size={15} />
          </button>
        )}
      </div>
      {!collapsed && <LevelBox />}
      <NavTree collapsed={collapsed} badges={badges} onNavigate={onNavigate} />
      <div className="ml-sb-bottom">
        <ProCard onNavigate={onNavigate} />
        <AccountRow onSignOut={onSignOut} onNavigate={onNavigate} />
      </div>
    </aside>
  );
}

export function Topbar({ mobile, onMenu }: { mobile: boolean; onMenu: () => void }) {
  const lab = useLab();
  const { path } = useRouter();
  const { streak, xpToday } = useProgress(lab);
  const match = resolveNav(path);
  const goal = lab.profile.goals.dailyXp;

  return (
    <header className="ml-topbar">
      {mobile && (
        <button type="button" className="ml-topbar-menu" aria-label="Open navigation" onClick={onMenu}>
          <Icon name="menu" size={20} />
        </button>
      )}
      <nav className="ml-crumbs" aria-label="Breadcrumb">
        <ol>
          {match.item ? (
            <>
              <li>
                <Link to={match.item.to} aria-current={!match.child ? "page" : undefined}>
                  {match.item.label}
                </Link>
              </li>
              {match.child && (
                <li>
                  <Link to={match.child.to} aria-current="page">
                    {match.child.label}
                  </Link>
                </li>
              )}
            </>
          ) : (
            <li>
              <span aria-current="page">{path === "/profile" ? "Profile" : "MARKET//LAB"}</span>
            </li>
          )}
        </ol>
      </nav>
      <div className="ml-topbar-right">
        <Link to="/progress/streaks" className="ml-streak" title={streak.atRisk ? "Practise today to keep your streak" : "Learning streak"}>
          <Icon name="flame" size={16} />
          <span className="num">{streak.current}</span>
          <span className="ml-streak-label">day streak</span>
        </Link>
        <Link to="/dashboard" className="ml-goalchip" title="Today's XP goal">
          <span className="num">{Math.min(xpToday, 9999)}</span>
          <span className="num">/ {goal} XP</span>
        </Link>
        <SimBadge compact={mobile} />
      </div>
    </header>
  );
}

export function BottomNav() {
  const { path } = useRouter();
  const match = resolveNav(path);
  return (
    <nav className="ml-bottomnav" aria-label="Primary">
      {BOTTOM_NAV.map((b) => {
        const on = path === b.to || path.startsWith(`${b.to}/`) || (match.item ? b.covers.includes(match.item.id) : false);
        return (
          <Link key={b.id} to={b.to} className={cx("ml-bn-link", on && "is-on")} aria-current={on ? "page" : undefined}>
            <Icon name={b.icon} size={19} />
            <span>{b.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Phones: the full sidebar slides in from the left (focus is trapped while it's open). */
export function NavDrawer({ open, onClose, onSignOut, brand }: { open: boolean; onClose: () => void; onSignOut: () => void; brand?: ReactNode }) {
  const { path } = useRouter();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  return (
    <Dialog open={open} onClose={onClose} title="Menu" variant="drawer">
      <Sidebar collapsed={false} canCollapse={false} brand={brand} onSignOut={onSignOut} onNavigate={onClose} inDrawer />
    </Dialog>
  );
}
