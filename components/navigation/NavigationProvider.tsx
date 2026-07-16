"use client";

/**
 * components/navigation/NavigationProvider.tsx
 * ---------------------------------------------------------------
 * App Router doesn't emit "navigation start/end" events the way the
 * old Pages Router did, and per-segment loading.tsx only fires when
 * a segment actually suspends on data — which won't happen on these
 * fully static public pages. To get a genuine "show something the
 * instant the user clicks a link" effect, we track it ourselves:
 *
 *   1. <AppLink> calls startNavigation() on click, before router.push
 *   2. This provider watches usePathname() — when it changes, the
 *      navigation is done, so we call endNavigation()
 *   3. A safety timeout clears the state regardless, in case a
 *      navigation is cancelled or the pathname doesn't change
 *      (e.g. clicking the link you're already on).
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { RouteLoadingOverlay } from "./RouteLoadingOverlay";

interface NavigationContextValue {
  startNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);
const SAFETY_TIMEOUT_MS = 4000;

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const clearSafetyTimer = () => {
    if (safetyTimer.current) {
      clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
  };

  const startNavigation = () => {
    setIsNavigating(true);
    clearSafetyTimer();
    safetyTimer.current = setTimeout(() => setIsNavigating(false), SAFETY_TIMEOUT_MS);
  };

  // Pathname changed => the new route has landed => stop the overlay.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsNavigating(false);
    clearSafetyTimer();
  }, [pathname]);

  // Cleanup on unmount — always clear timers you own.
  useEffect(() => clearSafetyTimer, []);

  return (
    <NavigationContext.Provider value={{ startNavigation }}>
      {children}
      {isNavigating && <RouteLoadingOverlay />}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within <NavigationProvider>");
  return ctx;
}
