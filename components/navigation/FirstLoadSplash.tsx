"use client";

/**
 * components/navigation/FirstLoadSplash.tsx
 * ---------------------------------------------------------------
 * Red background + rotating circle, shown exactly once per browser
 * session — the very first time the app mounts in this tab. Uses
 * sessionStorage (not localStorage) deliberately: a fresh tab/session
 * should see it again, but navigating around the site shouldn't
 * retrigger it, and closing the tab clears the flag naturally with
 * no manual cleanup needed.
 */

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import "@/components/ui/loading.css";

const SESSION_KEY = "has-seen-first-load-splash";
const MIN_VISIBLE_MS = 500;

export function FirstLoadSplash() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(SESSION_KEY);
    if (alreadySeen) return;

    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "true");

    const timer = setTimeout(() => {
      setExiting(true);
      const removeTimer = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(removeTimer);
    }, MIN_VISIBLE_MS);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`loading-overlay loading-overlay-first-load ${exiting ? "loading-overlay-exiting" : ""}`}
      aria-hidden="true"
    >
      <LoadingSpinner label="Loading site" />
    </div>
  );
}
