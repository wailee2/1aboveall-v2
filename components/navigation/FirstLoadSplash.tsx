"use client";

/**
 * components/navigation/FirstLoadSplash.tsx
 * ---------------------------------------------------------------
 * Red background + rotating circle, shown once per browser session
 * on the very first load. Deliberately self-contained:
 *
 *  - No dependency on the shared <LoadingSpinner> or loading.css —
 *    uses Tailwind's built-in `animate-spin` directly, so this
 *    component has zero imports that could delay it (it needs to be
 *    the very first thing to paint, before anything else is ready).
 *
 *  - No flash-of-underlying-content: the OLD version decided whether
 *    to show itself inside a useEffect (checking sessionStorage
 *    AFTER mount) — so on repeat visits the real page painted first,
 *    then the splash flashed in on top a tick later, then out again.
 *    The fix follows the same pattern already used for FOUC-free
 *    theming (see contexts/ThemeContext.tsx): a tiny, dependency-free
 *    script runs in <head>, BEFORE the body even parses, and sets a
 *    `data-skip-splash="true"` attribute on <html> if this session
 *    has already seen the splash. The CSS rule below reacts to that
 *    attribute instantly, at paint time — no JS timing gap, no flash.
 *
 * This component's own React state only ever handles the exit
 * animation for a FIRST-time view. It always renders identically on
 * server and client (no conditional based on browser-only checks
 * during initial render), so there's no hydration mismatch — the
 * CSS attribute is what suppresses repeat views, not React state.
 */

import { useEffect, useState } from "react";

const MIN_VISIBLE_MS = 500;
const EXIT_ANIMATION_MS = 250;
const SESSION_KEY = "has-seen-first-load-splash";

export function FirstLoadSplash() {
  const [exiting, setExiting] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // By the time this runs, the head script has already recorded
    // this session as "seen" (see firstLoadSplashInitScript below) —
    // this effect only drives the exit animation timing for whatever
    // is currently visible; the CSS attribute already handled
    // whether it should be visible at all.
    const timer = setTimeout(() => {
      setExiting(true);
      const removeTimer = setTimeout(() => setRemoved(true), EXIT_ANIMATION_MS);
      return () => clearTimeout(removeTimer);
    }, MIN_VISIBLE_MS);

    return () => clearTimeout(timer);
  }, []);

  if (removed) return null;

  return (
    <div
      id="first-load-splash"
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-[#C45749] transition-opacity duration-250 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />

      {/* Self-contained: the one CSS rule this component needs to
          suppress itself instantly on repeat visits, scoped by id so
          it can't collide with anything else in the app. */}
      <style>{`
        html[data-skip-splash="true"] #first-load-splash {
          display: none;
        }
      `}</style>
    </div>
  );
}

/**
 * Blocking, dependency-free script — inject via
 * <script dangerouslySetInnerHTML={{ __html: firstLoadSplashInitScript }} />
 * as early as possible in the root layout's <head>, alongside
 * themeInitScript. Must run before the body paints.
 */
export const firstLoadSplashInitScript = `
(function() {
  try {
    var seen = sessionStorage.getItem('${SESSION_KEY}');
    if (seen) {
      document.documentElement.setAttribute('data-skip-splash', 'true');
    } else {
      sessionStorage.setItem('${SESSION_KEY}', 'true');
    }
  } catch (e) {
    // sessionStorage can throw in some privacy modes — fail silently,
    // worst case the splash just shows every time for that visitor.
  }
})();
`;