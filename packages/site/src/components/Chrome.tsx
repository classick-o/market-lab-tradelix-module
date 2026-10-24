/** The frame around every presentation page: header with the section nav, mobile menu, footer. */
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { useSite } from "../context";
import { APP_ROUTES } from "../data/facts";
import { onScrollFrame } from "../motion/hooks";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

/** Sections of the homepage the nav jumps to. They become sub-pages (/home/learn…) as those get built. */
export const SECTIONS = [
  { id: "learn", label: "Learn" },
  { id: "missions", label: "Missions" },
  { id: "arena", label: "Arena" },
  { id: "duels", label: "Duels" },
  { id: "journal", label: "Journal" },
  { id: "progress", label: "Progress" },
] as const;

function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Header() {
  const { appHref, siteHref, visitor, scrollTo } = useSite();
  const ref = useRef<HTMLElement>(null);
  const [menu, setMenu] = useState(false);
  const active = useActiveSection();

  // Glass once the page moves; slides away while scrolling down, back on the way up.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastY = window.scrollY;
    return onScrollFrame(() => {
      const y = window.scrollY;
      el.dataset.scrolled = String(y > 12);
      if (Math.abs(y - lastY) > 6) {
        el.dataset.hidden = String(y > lastY && y > 520);
        lastY = y;
      }
    });
  }, []);

  const jump = (e: MouseEvent, id: string) => {
    if (!document.getElementById(id)) return;
    e.preventDefault();
    setMenu(false);
    scrollTo(id);
  };
  const start = appHref(visitor.returning ? APP_ROUTES.dashboard : APP_ROUTES.start);

  return (
    <>
      <header ref={ref} className="tx-header" data-scrolled="false" data-hidden="false">
        <div className="tx-header-in">
          <a className="tx-brand" href={siteHref("/")} aria-label="Tradelix home">
            <Logo />
          </a>
          <nav className="tx-nav" aria-label="Sections">
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={(e) => jump(e, s.id)} aria-current={active === s.id ? "true" : undefined}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="tx-header-actions">
            <a className="tx-header-link" href={appHref(APP_ROUTES.dashboard)}>
              Open app
            </a>
            <a className="tx-btn tx-btn--light tx-btn--sm" href={start}>
              {visitor.returning ? "Continue" : "Start free"}
              <Icon name="arrow-right" size={16} />
            </a>
            <button type="button" className="tx-menu-btn" aria-label="Open menu" aria-expanded={menu} aria-controls="tx-menu" onClick={() => setMenu(true)}>
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menu} onClose={() => setMenu(false)} onJump={jump} start={start} />
    </>
  );
}

function MobileMenu({ open, onClose, onJump, start }: { open: boolean; onClose: () => void; onJump: (e: MouseEvent, id: string) => void; start: string }) {
  const { appHref, visitor } = useSite();
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const back = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", key);
      back?.focus();
    };
  }, [open, onClose]);

  return (
    <div id="tx-menu" className="tx-menu" data-open={open} aria-hidden={!open} inert={!open}>
      <div ref={panel} className="tx-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="tx-menu-top">
          <Logo />
          <button type="button" className="tx-menu-btn" aria-label="Close menu" onClick={onClose}>
            <Icon name="x" size={22} />
          </button>
        </div>
        <ul className="tx-menu-list">
          {SECTIONS.map((s, i) => (
            <li key={s.id} style={{ "--i": i } as CSSProperties}>
              <a href={`#${s.id}`} onClick={(e) => onJump(e, s.id)}>
                <span className="tx-mono">0{i + 1}</span>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="tx-menu-actions">
          <a className="tx-btn tx-btn--light tx-btn--lg" href={start}>
            {visitor.returning ? "Continue learning" : "Start your first mission"}
            <Icon name="arrow-right" size={18} />
          </a>
          <a className="tx-btn tx-btn--ghost tx-btn--lg" href={appHref(APP_ROUTES.dashboard)}>
            Open app
          </a>
        </div>
      </div>
    </div>
  );
}

const FOOT_PRODUCT = [
  { label: "Learn", to: APP_ROUTES.learn },
  { label: "Missions", to: APP_ROUTES.missions },
  { label: "Trading Arena", to: APP_ROUTES.arena },
  { label: "Duels", to: APP_ROUTES.duels },
  { label: "Trade Journal", to: APP_ROUTES.journal },
  { label: "Achievements", to: APP_ROUTES.progress },
];

const FOOT_TOOLS = [
  { label: "Risk Calculator", to: APP_ROUTES.calculator },
  { label: "Concept Library", to: APP_ROUTES.library },
  { label: "Plans and pricing", to: APP_ROUTES.pricing },
];

export function Footer() {
  const { appHref, visitor } = useSite();
  return (
    <footer className="tx-footer">
      <div className="tx-wrap tx-footer-grid">
        <div className="tx-footer-brand">
          <Logo />
          <p>The trading lab where your decisions are graded, not your luck.</p>
          <a className="tx-btn tx-btn--light tx-btn--sm" href={appHref(visitor.returning ? APP_ROUTES.dashboard : APP_ROUTES.start)}>
            {visitor.returning ? "Continue" : "Start free"}
            <Icon name="arrow-right" size={16} />
          </a>
        </div>
        <nav aria-label="Product">
          <h2 className="tx-footer-h">Product</h2>
          <ul>
            {FOOT_PRODUCT.map((l) => (
              <li key={l.to}>
                <a href={appHref(l.to)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Tools">
          <h2 className="tx-footer-h">Tools</h2>
          <ul>
            {FOOT_TOOLS.map((l) => (
              <li key={l.to}>
                <a href={appHref(l.to)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="tx-wrap tx-footer-legal">
        <p>Educational simulator. Synthetic markets and virtual money only. Nothing here is investment advice.</p>
        <p>© {new Date().getFullYear()} Tradelix</p>
      </div>
      <div className="tx-footer-word" aria-hidden="true">
        Tradelix
      </div>
    </footer>
  );
}
