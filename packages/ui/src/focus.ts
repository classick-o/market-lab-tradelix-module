import { createContext, useContext, useEffect } from "react";

/**
 * Focus mode: a page (the lesson player) asks the app shell to step back — the sidebar folds to its
 * rail and the phone's bottom bar hides — for as long as it is mounted.
 */
export const FocusContext = createContext<(on: boolean) => void>(() => {});

export function useFocusMode(on = true) {
  const set = useContext(FocusContext);
  useEffect(() => {
    set(on);
    return () => set(false);
  }, [on, set]);
}
