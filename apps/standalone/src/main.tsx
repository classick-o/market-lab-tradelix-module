import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import type { Visitor } from "@market-lab/site";

const STORAGE_KEY = "tradelix.marketlab.v1";
const base = import.meta.env.BASE_URL;
const path = window.location.pathname;
const route = path.startsWith(base) ? `/${path.slice(base.length)}` : path;
const root = createRoot(document.getElementById("root")!);
const render = (node: ReactNode) => root.render(<StrictMode>{node}</StrictMode>);

/** Someone who has used the module on this device gets "Continue" instead of "Start". */
function readVisitor(): Visitor {
  try {
    const data = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as { profile?: { onboarded?: boolean; displayName?: string } } | null;
    return { returning: !!data?.profile?.onboarded, name: data?.profile?.displayName || undefined };
  } catch {
    return { returning: false };
  }
}

// The presentation pages (/home…) load on their own, without the trading module, so they stay light.
if (/^\/home(\/|$)/.test(route)) {
  void import("@market-lab/site").then(({ TradelixSite }) =>
    render(<TradelixSite basePath={`${base}home`} appHref={(to) => `${base}${to.replace(/^\//, "")}`} visitor={readVisitor()} />),
  );
} else {
  void Promise.all([import("@market-lab/ui"), import("@market-lab/ui/styles.css")]).then(([{ MarketLab }]) => render(<MarketLab basePath={base} />));
}
