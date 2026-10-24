import { createContext, useContext } from "react";
import { prefersReducedMotion } from "./motion/hooks";

export interface Visitor {
  /** Has used the trading module on this device or account. */
  returning: boolean;
  name?: string;
}

export interface SiteValue {
  /** Link into the trading module, e.g. "/learn/course" → "/app/learn/course". */
  appHref: (to: string) => string;
  /** Link inside the presentation pages, e.g. "/" → "/home". */
  siteHref: (to: string) => string;
  visitor: Visitor;
  /** Scrolls to a section of the current page, smoothly when smooth scrolling is on. */
  scrollTo: (id: string) => void;
}

export const SiteContext = createContext<SiteValue | null>(null);

export function useSite(): SiteValue {
  const v = useContext(SiteContext);
  if (!v) throw new Error("useSite must be used inside <TradelixSite>.");
  return v;
}

let smooth: typeof import("./motion/smooth") | null = null;
export function setSmooth(m: typeof import("./motion/smooth")) {
  smooth = m;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (smooth?.smoothScrollTo(el)) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
