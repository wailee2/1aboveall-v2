"use client";

/**
 * contexts/ThemeContext.tsx
 * ---------------------------------------------------------------
 * Three-way theme system: "light" | "dark" | "system".
 *
 * - Explicit choice is persisted to localStorage and applied via a
 *   data-theme attribute on <html> (read by app/globals.css).
 * - "system" means: no data-theme attribute at all, so the
 *   `@media (prefers-color-scheme: dark)` fallback in globals.css
 *   takes over, AND we listen for OS-level changes live.
 * - FOUC prevention is handled by an inline blocking script in the
 *   root layout's <head> (see app/layout.tsx) — it runs before React
 *   hydrates, reading localStorage and setting data-theme immediately
 *   so there's never a flash of the wrong theme on first paint.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type ThemePreference = "light" | "dark" | "system";

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: "light" | "dark";
  setPreference: (pref: ThemePreference) => void;
}

const STORAGE_KEY = "theme-preference";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(pref: ThemePreference) {
  const root = document.documentElement;
  if (pref === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", pref);
  }
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Read the persisted preference once on mount (the inline script
  // already applied it visually before hydration — this just syncs
  // React state to match what's already on the page).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as
      | ThemePreference
      | null;
    const initial = stored ?? "system";
    setPreferenceState(initial);
    setResolvedTheme(initial === "system" ? getSystemTheme() : initial);
  }, []);

  // Live-update when the OS preference changes, but only while the
  // user is on "system" — an explicit choice always overrides this.
  useEffect(() => {
    if (preference !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setResolvedTheme(getSystemTheme());
    mql.addEventListener("change", handler);
    // Cleanup: always remove listeners you attach — this is the
    // "clean memory after use" rule applied to the theme system.
    return () => mql.removeEventListener("change", handler);
  }, [preference]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    window.localStorage.setItem(STORAGE_KEY, pref);
    applyTheme(pref);
    setResolvedTheme(pref === "system" ? getSystemTheme() : pref);
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, resolvedTheme, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

/**
 * The FOUC-prevention script — inject this as a raw string via
 * <script dangerouslySetInnerHTML> in the root layout's <head>,
 * BEFORE any CSS or React hydration. It must be synchronous and
 * dependency-free (no imports work here, it runs standalone).
 */
export const themeInitScript = `
(function() {
  try {
    var pref = localStorage.getItem('${STORAGE_KEY}');
    if (pref === 'light' || pref === 'dark') {
      document.documentElement.setAttribute('data-theme', pref);
    }
    // if pref is 'system' or missing, leave data-theme unset —
    // the CSS media query in globals.css handles it with no JS.
  } catch (e) {
    // localStorage can throw in some privacy modes — fail silently,
    // the CSS prefers-color-scheme fallback still works either way.
  }
})();
`;
