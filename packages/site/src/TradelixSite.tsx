/**
 * The Tradelix presentation pages, mounted at any path of a host app (e.g. "/home"). Independent
 * of the trading module: it loads React, its own CSS and, after the first paint, GSAP and Lenis.
 * Links into the module go through `appHref`, so the host decides where the module lives.
 */
import { useEffect, useMemo, useRef, type ComponentType } from "react";
import { Footer, Header } from "./components/Chrome";
import { SiteContext, scrollToSection, setSmooth, type SiteValue, type Visitor } from "./context";
import { useReveal } from "./motion/hooks";
import { HomePage } from "./pages/HomePage";
import "./styles/site.css";

export interface TradelixSiteProps {
  /** Path the pages are served from, e.g. "/home". Sub-pages live under it ("/home/duels"). */
  basePath?: string;
  /** Builds a link into the trading module from one of its routes ("/start", "/learn/course"…). */
  appHref?: (to: string) => string;
  /** Returning visitors get "Continue" calls to action and a welcome back. */
  visitor?: Visitor;
}

interface PageDef {
  page: ComponentType;
  title: string;
  description: string;
}

/** Sub-pages are added here as they're built, e.g. "/learn", "/duels", "/pricing". */
const PAGES: Record<string, PageDef> = {
  "/": {
    page: HomePage,
    title: "Tradelix · Learn to trade by making decisions",
    description: "A trading lab with virtual money. Read the chart, set your risk, make the call, and get graded on how you decided, not on whether you got lucky.",
  },
};

const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

export function TradelixSite({ basePath = "/home", appHref = (to) => to, visitor = { returning: false } }: TradelixSiteProps) {
  const base = trim(basePath === "/" ? "" : basePath);
  const rest = trim(window.location.pathname.startsWith(base) ? window.location.pathname.slice(base.length) || "/" : "/");
  const known = PAGES[rest] ? rest : "/";
  const def = PAGES[known];
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  // Unknown sub-paths fall back to the homepage, with the address corrected.
  useEffect(() => {
    if (known !== rest) window.history.replaceState(null, "", `${base}${known === "/" ? "" : known}` || "/");
  }, [known, rest, base]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = def.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = meta?.content;
    if (meta) meta.content = def.description;
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== undefined) meta.content = prevDesc;
    };
  }, [def]);

  // Smooth scrolling arrives after the first paint, in its own chunk.
  useEffect(() => {
    let stop: (() => void) | undefined;
    let alive = true;
    void import("./motion/smooth").then((m) => {
      if (!alive) return;
      setSmooth(m);
      stop = m.startSmoothScroll();
    });
    return () => {
      alive = false;
      stop?.();
    };
  }, []);

  const value = useMemo<SiteValue>(
    () => ({ appHref, siteHref: (to) => `${base}${to === "/" ? "" : to}` || "/", visitor, scrollTo: scrollToSection }),
    [appHref, base, visitor],
  );
  const Page = def.page;

  return (
    <SiteContext.Provider value={value}>
      <div ref={root} className="tx">
        <a href="#tx-main" className="tx-skip">
          Skip to content
        </a>
        <Header />
        <main id="tx-main">
          <Page />
        </main>
        <Footer />
      </div>
    </SiteContext.Provider>
  );
}
