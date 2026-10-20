import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon, cx } from "./ui";

interface ToastItem {
  id: number;
  message: string;
  leaving: boolean;
}

const ToastContext = createContext<(message: string) => void>(() => {});

/** Short confirmations ("Note saved"). Announced politely to assistive technology. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const show = useCallback((message: string) => {
    const id = ++seq.current;
    setItems((cur) => [...cur.slice(-2), { id, message, leaving: false }]);
    window.setTimeout(() => setItems((cur) => cur.map((t) => (t.id === id ? { ...t, leaving: true } : t))), 2800);
    window.setTimeout(() => setItems((cur) => cur.filter((t) => t.id !== id)), 3000);
  }, []);

  const value = useMemo(() => show, [show]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="ml-toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={cx("ml-toast", t.leaving && "is-leaving")}>
            <Icon name="check" size={16} />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): (message: string) => void {
  return useContext(ToastContext);
}
