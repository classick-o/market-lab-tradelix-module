import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { dailyChallenge, QUESTIONS } from "@market-lab/academy";
import { BOTTOM_NAV, NAV, NAV_GROUPS, resolveNav, type NavItem } from "../nav";
import { useHost, usePlan } from "../host";
import { useProgress } from "../progress";
import { Link, useRouter } from "../router";
import { useLab, useStore } from "../store";
import { Avatar, MiniRing } from "./Page";
import { Button, Dialog, Icon, Meter, SimBadge, cx } from "./ui";

export function LabMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" rx="6" fill="var(--ml-accent)" />
      <path d="M6 15.5l3.5-3.5 3 2.5L18 8.5" stroke="var(--ml-accent-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Wordmark() {
  return (
    <span className="ml-wordmark">
      MARKET<span aria-hidden="true">//</span>
      <span className="ml-sr">, </span>LAB
    </span>
  );
}

/** Small dots shown only for something the user can act on now. */
function useBadges(): Record<string, string> {
  const lab = useLab();
  const store = useStore();
  const { today } = useProgress(lab);
  const badges: Record<string, string> = {};
  if (lab.profile.onboarded && !lab.dailies[today] && dailyChallenge(today, QUESTIONS).items.length) badges.daily = "Today's challenge is waiting";
  if (store.activeArena()) badges.simulator = "Session in progress";
  return badges;
}

function ProgressWidget({ collapsed }: { collapsed: boolean }) {
  const lab = useLab();
  const store = useStore();
  const { level, rank } = useProgress(lab);
  const toNext = level.needed - level.into;
  const detailsId = useId();
  if (collapsed) {
    return (
      <Link to="/progress/xp" className="ml-sb-levelring" aria-label={`Level ${level.level}, ${rank.title}. ${toNext} XP to level ${level.level + 1}.`}>
        <MiniRing value={level.into / level.needed} size={34} stroke={3} />
        <span className="num">{level.level}</span>
        <span className="ml-sb-tip" aria-hidden="true">
          Level {level.level} · {rank.title}
        </span>
      </Link>
    );
  }
  const open = !lab.settings.progressCollapsed;
  return (
    <section className="ml-sb-progress" aria-label="Your level">
      <div className="ml-sb-progress-head">
        <Link to="/progress/xp" className="ml-sb-progress-link">
          <span className="ml-sb-lvl num">Level {level.level}</span>
          <span className="ml-sb-rank">{rank.title}</span>
        </Link>
        <button
          type="button"
          className="ml-sb-mini-toggle"
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={open ? "Hide XP details" : "Show XP details"}
          onClick={() => store.setSettings({ progressCollapsed: open })}
        >
          <Icon name="chevron-down" size={16} />
        </button>
      </div>
      <div id={detailsId} hidden={!open} className="ml-sb-progress-body">
        <Meter value={level.into / level.needed} label={`${level.into} of ${level.needed} XP towards level ${level.level + 1}`} />
        <span className="ml-sb-xp num">
          {toNext} XP to level {level.level + 1}
        </span>
      </div>
    </section>
  );
}

function NavTree({ collapsed, badges, onNavigate }: { collapsed: boolean; badges: Record<string, string>; onNavigate?: () => void }) {
  const { path } = useRouter();
  const { pro } = usePlan();
  const match = resolveNav(path);
  const [open, setOpen] = useState<Record<string, boolean>>(() => (match.item?.children ? { [match.item.id]: true } : {}));

  // The section that contains the current page opens by itself; others keep their state.
  useEffect(() => {
    if (match.item?.children) setOpen((o) => (o[match.item!.id] ? o : { ...o, [match.item!.id]: true }));
  }, [match.item]);

  const itemFor = (item: NavItem): NavItem => (item.id === "pricing" && pro ? { ...item, label: "Manage plan", to: "/settings/billing", icon: "card" } : item);

  return (
    <nav className="ml-sb-nav" aria-label="Market Lab">
      {NAV_GROUPS.map((g) => (
        <div key={g.id} className="ml-sb-group">
          <h2 className="ml-sb-group-label">{g.label}</h2>
          <ul>
            {NAV.filter((n) => n.group === g.id).map((raw) => {
              const item = itemFor(raw);
              const active = match.item?.id === raw.id && !(raw.id === "pricing" && pro);
              const isOpen = Boolean(open[item.id]);
              const childBadge = item.children?.find((c) => badges[c.id]);
              const subId = `ml-sb-sub-${item.id}`;
              return (
                <li key={item.id} className={cx("ml-sb-item", active && "is-active", item.id === "pricing" && !pro && "ml-sb-item--upgrade")}>
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
                        <Icon name="chevron-down" size={16} />
                        {!isOpen && childBadge && <span className="ml-dot" aria-hidden="true" />}
                      </button>
                    )}
                  </div>
                  {item.children && !collapsed && (
                    <ul id={subId} className="ml-sb-sub" hidden={!isOpen}>
                      {item.children.map((c) => (
                        <li key={c.id}>
                          <Link to={c.to} className="ml-sb-sublink" aria-current={match.item?.id === item.id && match.child?.id === c.id ? "page" : undefined} onClick={onNavigate}>
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
                              <Link to={c.to} className="ml-sb-sublink" aria-current={match.child?.id === c.id && active ? "page" : undefined}>
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

function AccountMenu({ collapsed, onSignOut }: { collapsed: boolean; onSignOut: () => void }) {
  const lab = useLab();
  const host = useHost();
  const { pro } = usePlan();
  const { path } = useRouter();
  const [open, setOpen] = useState(false);
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
    <div className="ml-sb-footer" ref={ref}>
      <button type="button" className="ml-sb-account" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)} aria-label={collapsed ? `Account: ${name}, ${pro ? "Pro" : "Free"} plan` : undefined}>
        <Avatar name={name} avatar={lab.profile.avatar} url={host.user?.avatarUrl} size={30} />
        <span className="ml-sb-user">
          <b>{name}</b>
          <small>{pro ? "Pro plan" : "Free plan"}</small>
        </span>
        <Icon name="dots" size={18} className="ml-sb-account-dots" />
      </button>
      <div id={menuId} className="ml-sb-menu" hidden={!open}>
        <Link to="/settings/profile" className="ml-sb-menu-item">
          <Icon name="user" size={16} /> Profile
        </Link>
        <Link to="/settings/preferences" className="ml-sb-menu-item">
          <Icon name="globe" size={16} /> Preferences
        </Link>
        <Link to="/settings/billing" className="ml-sb-menu-item">
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
    </div>
  );
}

export function Sidebar({ collapsed, canCollapse, brand, onSignOut }: { collapsed: boolean; canCollapse: boolean; brand?: ReactNode; onSignOut: () => void }) {
  const lab = useLab();
  const store = useStore();
  const badges = useBadges();
  return (
    <aside className={cx("ml-sidebar", collapsed && "is-collapsed")} aria-label="Sidebar">
      <div className="ml-sb-brand">
        <Link to="/dashboard" className="ml-sb-logo" aria-label="MARKET//LAB dashboard">
          <span className="ml-sb-mark">{brand ?? <LabMark />}</span>
          <span className="ml-sb-name">
            <Wordmark />
            <small>Trading Skill Academy</small>
          </span>
        </Link>
        {canCollapse && (
          <button
            type="button"
            className="ml-sb-collapse"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => store.setSettings({ sidebarCollapsed: !lab.settings.sidebarCollapsed })}
          >
            <Icon name="panel" size={18} />
          </button>
        )}
      </div>
      <ProgressWidget collapsed={collapsed} />
      <NavTree collapsed={collapsed} badges={badges} />
      <AccountMenu collapsed={collapsed} onSignOut={onSignOut} />
    </aside>
  );
}

export function Topbar({ mobile, onMenu }: { mobile: boolean; onMenu: () => void }) {
  const lab = useLab();
  const { path } = useRouter();
  const { streak, xpToday, level } = useProgress(lab);
  const match = resolveNav(path);
  const goal = lab.profile.goals.dailyXp;
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={cx("ml-topbar", scrolled && "is-scrolled")}>
      {mobile ? (
        <>
          <button type="button" className="ml-iconbtn ml-iconbtn--md ml-iconbtn--tertiary" aria-label="Open navigation" onClick={onMenu}>
            <Icon name="menu" />
          </button>
          <Link to="/dashboard" className="ml-topbar-brand" aria-label="MARKET//LAB dashboard">
            <LabMark />
            <Wordmark />
          </Link>
        </>
      ) : (
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
      )}
      <div className="ml-topbar-right">
        <Link to="/progress/streaks" className="ml-topchip" title={streak.atRisk ? "Practise today to keep your streak" : "Learning streak"} aria-label={`Learning streak: ${streak.current} ${streak.current === 1 ? "day" : "days"}`}>
          <Icon name="flame" size={16} className={cx(streak.activeToday && "ml-flame-on")} />
          <span className="num">{streak.current}</span>
        </Link>
        <Link to="/dashboard" className="ml-topchip ml-hide-xs" title="Today's XP goal" aria-label={`Today's goal: ${xpToday} of ${goal} XP`}>
          <MiniRing value={xpToday / goal} />
          <span className="num">
            {Math.min(xpToday, 9999)}
            <small>/{goal} XP</small>
          </span>
        </Link>
        {mobile && (
          <Link to="/progress/xp" className="ml-topchip" aria-label={`Level ${level.level}`}>
            <span className="num">Lv {level.level}</span>
          </Link>
        )}
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
            <Icon name={b.icon} size={20} />
            <span>{b.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Full-screen navigation for phones: every destination, two taps away at most. */
export function NavDrawer({ open, onClose, onSignOut }: { open: boolean; onClose: () => void; onSignOut: () => void }) {
  const badges = useBadges();
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
    <Dialog open={open} onClose={onClose} title="Menu" variant="full">
      <div className="ml-drawer">
        <ProgressWidget collapsed={false} />
        <NavTree collapsed={false} badges={badges} onNavigate={onClose} />
        <Button variant="tertiary" iconLeft="logout" onClick={onSignOut}>
          Sign out
        </Button>
        <p className="ml-fine">Simulation with virtual money. Not investment advice.</p>
      </div>
    </Dialog>
  );
}
