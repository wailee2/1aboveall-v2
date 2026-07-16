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
 *      navigation is done, so we mark the route as ready
 *   3. The overlay only hides when BOTH conditions are met:
 *      - the route has landed
 *      - the minimum display time has elapsed
 *   4. A safety timeout clears the state regardless, in case a
 *      navigation is cancelled or the pathname doesn't change
 *      (e.g. clicking the link you're already on).
 */

import {
  createContext,
  useCallback,
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

const MIN_VISIBLE_MS = 100;// Change to 1000, 1 seconds
const SAFETY_TIMEOUT_MS = 10000;

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  const startTimeRef = useRef<number | null>(null);
  const routeReadyRef = useRef(false);
  const minElapsedRef = useRef(false);

  const minTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const clearTimers = () => {
    if (minTimer.current) {
      clearTimeout(minTimer.current);
      minTimer.current = null;
    }

    if (safetyTimer.current) {
      clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
  };

  const tryStopNavigation = useCallback(() => {
    if (!routeReadyRef.current || !minElapsedRef.current) return;

    setIsNavigating(false);
    clearTimers();
    startTimeRef.current = null;
    routeReadyRef.current = false;
    minElapsedRef.current = false;
  }, []);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);

    clearTimers();
    startTimeRef.current = Date.now();
    routeReadyRef.current = false;
    minElapsedRef.current = false;

    minTimer.current = setTimeout(() => {
      minElapsedRef.current = true;
      tryStopNavigation();
    }, MIN_VISIBLE_MS);

    safetyTimer.current = setTimeout(() => {
      setIsNavigating(false);
      clearTimers();
      startTimeRef.current = null;
      routeReadyRef.current = false;
      minElapsedRef.current = false;
    }, SAFETY_TIMEOUT_MS);
  }, [tryStopNavigation]);

  // Pathname changed => the new route has landed.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    routeReadyRef.current = true;
    tryStopNavigation();
  }, [pathname, tryStopNavigation]);

  // Cleanup on unmount — always clear timers you own.
  useEffect(() => clearTimers, []);

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