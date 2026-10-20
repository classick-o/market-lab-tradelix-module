import { createContext, useCallback, useContext, useEffect, useMemo, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

/**
 * A tiny history router scoped to a base path, so the module can live under any route of a host
 * app (e.g. /learn in Tradelix) without depending on the host's router.
 */
interface RouterValue {
  path: string;
  basePath: string;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
  href: (to: string) => string;
}

const RouterContext = createContext<RouterValue | null>(null);

function normalizeBase(base: string): string {
  if (!base || base === "/") return "";
  return `/${base.replace(/^\/+|\/+$/g, "")}`;
}

function currentPath(base: string): string {
  const p = window.location.pathname;
  const rest = base && p.startsWith(base) ? p.slice(base.length) : p;
  return rest.startsWith("/") ? rest : `/${rest}`;
}

export function Router({ basePath = "/", children }: { basePath?: string; children: ReactNode }) {
  const base = normalizeBase(basePath);
  const [path, setPath] = useState(() => currentPath(base));

  useEffect(() => {
    const onPop = () => setPath(currentPath(base));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [base]);

  const href = useCallback((to: string) => `${base}${to.startsWith("/") ? to : `/${to}`}`, [base]);
  const navigate = useCallback(
    (to: string, opts?: { replace?: boolean }) => {
      const url = href(to);
      if (opts?.replace) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
      setPath(to.split("?")[0]);
      window.scrollTo({ top: 0 });
    },
    [href],
  );

  const value = useMemo(() => ({ path, basePath: base, navigate, href }), [path, base, navigate, href]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const v = useContext(RouterContext);
  if (!v) throw new Error("useRouter must be used inside <Router>.");
  return v;
}

/** Matches "/play/:id" against a path. Returns params or null. */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const a = pattern.split("/").filter(Boolean);
  const b = path.split("/").filter(Boolean);
  if (a.length !== b.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

export function Link({ to, children, onClick, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { navigate, href } = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={href(to)} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
