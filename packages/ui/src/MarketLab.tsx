import { Suspense, lazy, useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";
import { RouteBoundary, Skeleton } from "./components/Page";
import { BottomNav, NavDrawer, Sidebar, Topbar } from "./components/Shell";
import { ReducedMotionContext, useMediaQuery } from "./components/Stage";
import { ToastProvider, useToast } from "./components/Toast";
import { Button, Dialog, Empty, cx } from "./components/ui";
import { HostContext, useHost, type HostOptions } from "./host";
import { PARENT_REDIRECTS } from "./nav";
import { OnboardingPage } from "./pages/Onboarding";
import { WelcomePage } from "./pages/Welcome";
import { useProgress } from "./progress";
import { Link, Router, matchPath, useRouter } from "./router";
import { LabStore, StoreContext, useLab, useStore } from "./store";
import { THEMES, accentById, accentVars } from "./theme";

export interface MarketLabProps extends HostOptions {
  /** Route prefix the module is mounted under, e.g. "/learn" inside Tradelix. Defaults to "/". */
  basePath?: string;
  /** localStorage key. Use a per-user key when embedding. */
  storageKey?: string;
  /** Show the module's own navigation (sidebar, top bar, mobile bottom bar). Turn off when the host provides navigation. */
  showNav?: boolean;
  /** @deprecated Use `showNav`. */
  showHeader?: boolean;
  /** Brand mark shown in the sidebar; defaults to the Market Lab mark. */
  brand?: ReactNode;
}

// Pages are split into chunks so the first screen loads fast; each chunk shows a skeleton while loading.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function page<M extends Record<string, any>>(load: () => Promise<M>, name: keyof M) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return lazy(async () => ({ default: (await load())[name] as ComponentType<any> }));
}

const Dashboard = page(() => import("./pages/Dashboard"), "DashboardPage");
const AllMissions = page(() => import("./pages/Missions"), "AllMissionsPage");
const Daily = page(() => import("./pages/Missions"), "DailyPage");
const Weekly = page(() => import("./pages/Missions"), "WeeklyPage");
const Assessments = page(() => import("./pages/Missions"), "AssessmentsPage");
const MissionDetail = page(() => import("./pages/Missions"), "MissionDetailPage");
const Play = page(() => import("./pages/Play"), "PlayPage");
const Debrief = page(() => import("./pages/Debrief"), "DebriefPage");
const Replay = page(() => import("./pages/Replay"), "ReplayPage");
const Simulator = page(() => import("./pages/Arena"), "SimulatorPage");
const Scenarios = page(() => import("./pages/Arena"), "ScenariosPage");
const ArenaSession = page(() => import("./pages/Arena"), "ArenaSessionPage");
const Portfolio = page(() => import("./pages/Portfolio"), "PortfolioPage");
const RiskCalculator = page(() => import("./pages/RiskCalculator"), "RiskCalculatorPage");
const Sessions = page(() => import("./pages/Journal"), "SessionHistoryPage");
const Decisions = page(() => import("./pages/Journal"), "DecisionJournalPage");
const ReplayIndex = page(() => import("./pages/Journal"), "ReplayIndexPage");
const Alternatives = page(() => import("./pages/Journal"), "AlternativesPage");
const ArenaReplay = page(() => import("./pages/ArenaReplay"), "ArenaReplayPage");
const Analytics = page(() => import("./pages/Analytics"), "AnalyticsPage");
const Paths = page(() => import("./pages/Learn"), "PathsPage");
const PathDetail = page(() => import("./pages/Learn"), "PathDetailPage");
const Lessons = page(() => import("./pages/Learn"), "LessonsPage");
const Concepts = page(() => import("./pages/Learn"), "ConceptsPage");
const Glossary = page(() => import("./pages/Learn"), "GlossaryPage");
const KitGallery = page(() => import("./pages/KitGallery"), "KitGalleryPage");
const Checks = page(() => import("./pages/Learn"), "ChecksPage");
const Lesson = page(() => import("./pages/Lesson"), "LessonPage");
const Check = page(() => import("./pages/CheckRunner"), "CheckPage");
const SkillProfile = page(() => import("./pages/Progress"), "SkillProfilePage");
const Levels = page(() => import("./pages/Progress"), "LevelsPage");
const Achievements = page(() => import("./pages/Progress"), "AchievementsPage");
const Streaks = page(() => import("./pages/Progress"), "StreaksPage");
const Milestones = page(() => import("./pages/Progress"), "MilestonesPage");
const Pricing = page(() => import("./pages/Pricing"), "PricingPage");
const ProfileSettings = page(() => import("./pages/Settings"), "ProfileSettingsPage");
const Preferences = page(() => import("./pages/Settings"), "PreferencesPage");
const Notifications = page(() => import("./pages/Settings"), "NotificationsPage");
const Privacy = page(() => import("./pages/Settings"), "PrivacyPage");
const Billing = page(() => import("./pages/Settings"), "BillingPage");
const ProfileHub = page(() => import("./pages/ProfileHub"), "ProfileHubPage");

const ROUTES: [string, (p: Record<string, string>) => ReactNode][] = [
  ["/dashboard", () => <Dashboard />],
  ["/missions/all", () => <AllMissions />],
  ["/missions/daily", () => <Daily />],
  ["/missions/weekly", () => <Weekly />],
  ["/missions/assessments", () => <Assessments />],
  ["/mission/:id", (p) => <MissionDetail missionId={p.id} />],
  ["/play/:id", (p) => <Play sessionId={p.id} />],
  ["/debrief/:id", (p) => <Debrief sessionId={p.id} />],
  ["/arena/simulator", () => <Simulator />],
  ["/arena/scenarios", () => <Scenarios />],
  ["/arena/portfolio", () => <Portfolio />],
  ["/arena/risk-calculator", () => <RiskCalculator />],
  ["/arena/session/:id", (p) => <ArenaSession sessionId={p.id} />],
  ["/journal/sessions", () => <Sessions />],
  ["/journal/decisions", () => <Decisions />],
  ["/journal/replay", () => <ReplayIndex />],
  ["/journal/replay/:id", (p) => <ReplayRoute sessionId={p.id} />],
  ["/journal/alternatives", () => <Alternatives />],
  ["/journal/alternatives/:id", (p) => <Alternatives sessionId={p.id} />],
  ["/journal/analytics", () => <Analytics />],
  ["/learn/paths", () => <Paths />],
  ["/learn/paths/:id", (p) => <PathDetail pathId={p.id} />],
  ["/learn/lessons", () => <Lessons />],
  ["/learn/lessons/:id", (p) => <Lesson lessonId={p.id} />],
  ["/learn/concepts", () => <Concepts />],
  ["/learn/concepts/:id", (p) => <Concepts conceptId={p.id} />],
  ["/learn/glossary", () => <Glossary />],
  ["/learn/kit", () => <KitGallery />],
  ["/learn/checks", () => <Checks />],
  ["/learn/checks/:id", (p) => <Check checkId={p.id} />],
  ["/progress/skills", () => <SkillProfile />],
  ["/progress/xp", () => <Levels />],
  ["/progress/achievements", () => <Achievements />],
  ["/progress/streaks", () => <Streaks />],
  ["/progress/milestones", () => <Milestones />],
  ["/pricing", () => <Pricing />],
  ["/settings/profile", () => <ProfileSettings />],
  ["/settings/preferences", () => <Preferences />],
  ["/settings/notifications", () => <Notifications />],
  ["/settings/privacy", () => <Privacy />],
  ["/settings/billing", () => <Billing />],
  ["/profile", () => <ProfileHub />],
];

/** Old links keep working. */
function legacyRedirect(p: string): string | null {
  if (PARENT_REDIRECTS[p]) return PARENT_REDIRECTS[p];
  if (p === "/home") return "/dashboard";
  if (p === "/skills") return "/progress/skills";
  let m: Record<string, string> | null;
  if ((m = matchPath("/replay/:id", p))) return `/journal/replay/${m.id}`;
  if ((m = matchPath("/arena/:id", p)) && !["simulator", "scenarios", "portfolio", "risk-calculator", "session"].includes(m.id)) return `/arena/session/${m.id}`;
  return null;
}

/** Trade Replay handles both mission and Arena sessions. */
function ReplayRoute({ sessionId }: { sessionId: string }) {
  const lab = useLab();
  return lab.sessions[sessionId]?.kind === "arena" ? <ArenaReplay sessionId={sessionId} /> : <Replay sessionId={sessionId} />;
}

function NotFound() {
  return (
    <Empty title="This page doesn't exist" action={<Link to="/dashboard" className="ml-text-link">Go to the dashboard</Link>}>
      The link may be out of date.
    </Empty>
  );
}

function AppRoutes({ p }: { p: string }) {
  let content: ReactNode = <NotFound />;
  for (const [pattern, render] of ROUTES) {
    const m = matchPath(pattern, p);
    if (m) {
      content = render(m);
      break;
    }
  }
  return (
    <div key={p} className="ml-route">
      <RouteBoundary resetKey={p}>
        <Suspense fallback={<Skeleton />}>{content}</Suspense>
      </RouteBoundary>
    </div>
  );
}

/** Toasts newly earned achievements (when milestone notifications are on) and remembers them. */
function AchievementWatcher() {
  const lab = useLab();
  const store = useStore();
  const toast = useToast();
  const { achievements } = useProgress(lab);
  const unlocked = achievements.filter((a) => a.status.unlocked).map((a) => a.id);
  const key = unlocked.join(",");
  useEffect(() => {
    const seen = new Set(lab.seenAchievements);
    if (seen.has("*init")) {
      // Data saved before achievements existed: adopt what's already earned silently.
      store.markAchievementsSeen(unlocked);
      return;
    }
    const fresh = achievements.filter((a) => a.status.unlocked && !seen.has(a.id));
    if (fresh.length === 0) return;
    if (lab.settings.notifications.milestones) fresh.slice(0, 2).forEach((a) => toast(`Achievement unlocked: ${a.title}`));
    store.markAchievementsSeen(fresh.map((a) => a.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}

function AppShell({ showNav, brand, children }: { showNav: boolean; brand?: ReactNode; children: ReactNode }) {
  const lab = useLab();
  const store = useStore();
  const host = useHost();
  const { navigate } = useRouter();
  // Breakpoints from the app design: rail at ≤960px, phone layout at ≤760px.
  const mobile = useMediaQuery("(max-width: 760px)");
  const tablet = useMediaQuery("(max-width: 960px)");
  const collapsed = tablet || lab.settings.sidebarCollapsed;
  const [drawer, setDrawer] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const signOut = () => {
    setDrawer(false);
    if (host.onSignOut) host.onSignOut();
    else setSigningOut(true);
  };

  if (!showNav) {
    return (
      <div className="ml-app ml-app--bare">
        <main id="ml-main" className="ml-main">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={cx("ml-app", mobile && "is-mobile")} data-sidebar={collapsed ? "collapsed" : "expanded"}>
      {!mobile && <Sidebar collapsed={collapsed} canCollapse={!tablet} brand={brand} onSignOut={signOut} />}
      <div className="ml-app-main">
        <Topbar mobile={mobile} onMenu={() => setDrawer(true)} />
        <main id="ml-main" className="ml-main">
          {children}
        </main>
        <Footer />
      </div>
      {mobile && <BottomNav />}
      {mobile && <NavDrawer open={drawer} onClose={() => setDrawer(false)} onSignOut={signOut} brand={brand} />}
      <AchievementWatcher />
      <Dialog
        open={signingOut}
        onClose={() => setSigningOut(false)}
        title="Sign out?"
        description="This standalone build has no account server, so your progress stays saved in this browser. You'll return to the welcome screen."
        footer={
          <>
            <Button variant="tertiary" onClick={() => setSigningOut(false)}>
              Stay signed in
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setSigningOut(false);
                store.signOut();
                navigate("/");
              }}
            >
              Sign out
            </Button>
          </>
        }
      />
    </div>
  );
}

function Footer() {
  return (
    <footer className="ml-footer">
      <span>
        Educational simulator. Virtual money only. Not investment advice.
        <span className="ml-footer-brand" aria-hidden="true">
          MARKET<span>//</span>LAB
        </span>
      </span>
    </footer>
  );
}

function Root({ showNav, brand }: { showNav: boolean; brand?: ReactNode }) {
  const lab = useLab();
  const { path, navigate } = useRouter();
  const p = path.replace(/\/+$/, "") || "/";
  const [systemReduced, setSystemReduced] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setSystemReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const reduced = lab.settings.reducedMotion === "on" || (lab.settings.reducedMotion === "system" && systemReduced);
  const theme = THEMES[lab.settings.theme] ?? THEMES.black;
  const accentStyle = useMemo(() => accentVars(accentById(lab.settings.accent).hex, theme.bg), [lab.settings.accent, theme.bg]);

  const redirect = legacyRedirect(p) ?? (p === "/" && lab.profile.onboarded && !lab.signedOut ? "/dashboard" : null);
  const lastRedirect = useRef<string | null>(null);
  useEffect(() => {
    if (redirect && lastRedirect.current !== p) {
      lastRedirect.current = p;
      navigate(redirect, { replace: true });
    }
  }, [redirect, p, navigate]);

  const bare = p === "/" || p === "/start" || p === "/start/retake" || lab.signedOut;
  let content: ReactNode;
  if (lab.signedOut || p === "/") content = <WelcomePage />;
  else if (p === "/start") content = <OnboardingPage />;
  else if (p === "/start/retake") content = <OnboardingPage retake />;
  else content = redirect ? <Skeleton /> : <AppRoutes p={p} />;

  return (
    <ReducedMotionContext.Provider value={reduced}>
      <div className={cx("ml-root", reduced && "ml-reduced-motion")} data-theme={lab.settings.theme} style={accentStyle}>
        <ToastProvider>
          <a href="#ml-main" className="ml-skip">
            Skip to content
          </a>
          {bare ? (
            <div className="ml-app ml-app--bare">
              <main id="ml-main" className="ml-main">
                <div key={p} className="ml-route">
                  {content}
                </div>
              </main>
              <Footer />
            </div>
          ) : (
            <AppShell showNav={showNav} brand={brand}>
              {content}
            </AppShell>
          )}
        </ToastProvider>
      </div>
    </ReducedMotionContext.Provider>
  );
}

/** The MARKET//LAB module. Mount it at any route; it brings its own router, state and styles (import "@market-lab/ui/styles.css"). */
export function MarketLab({ basePath = "/", storageKey = "tradelix.marketlab.v1", showNav, showHeader, brand, plan, onUpgrade, onManageBilling, onSignOut, user }: MarketLabProps) {
  const store = useMemo(() => new LabStore(storageKey), [storageKey]);
  const host = useMemo<HostOptions>(() => ({ plan, onUpgrade, onManageBilling, onSignOut, user }), [plan, onUpgrade, onManageBilling, onSignOut, user]);
  return (
    <StoreContext.Provider value={store}>
      <HostContext.Provider value={host}>
        <Router basePath={basePath}>
          <Root showNav={showNav ?? showHeader ?? true} brand={brand} />
        </Router>
      </HostContext.Provider>
    </StoreContext.Provider>
  );
}
