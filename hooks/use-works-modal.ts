"use client";

/**
 * app/(public)/works/hooks/use-works-modal.ts
 * ---------------------------------------------------------------
 * Same responsibility as before (modal open/close/navigate state,
 * synced with the URL via the History API, not Next's router) — plus
 * `originSlug`, which is new.
 *
 * originSlug is set once, when the modal is FIRST opened from a grid
 * click, and does NOT change when navigating prev/next inside an
 * already-open modal. It's the anchor for the shared-element
 * (layoutId) transition: the modal's image "frame" stays tied to
 * originSlug for its whole session, so the big fly-in/fly-out
 * animation only ever happens on open and close — arrow-key
 * navigation between items crossfades content inside that same
 * stable frame instead of re-triggering a flight animation to a
 * different grid tile every time you press an arrow key.
 */

import { useCallback, useEffect, useState } from "react";

interface HasSlug {
  slug: string;
}

export function useWorksModal<T extends HasSlug>(basePath: string, items: T[]) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [originSlug, setOriginSlug] = useState<string | null>(null);

  useEffect(() => {
    const pattern = new RegExp(`^${basePath}/([^/]+)/?$`);
    function syncFromPath() {
      const match = window.location.pathname.match(pattern);
      const slug = match ? match[1] : null;
      setOpenSlug(slug);
      // A genuine back/forward navigation (this only fires for
      // those — pushState/replaceState never trigger popstate) is
      // treated as a fresh origin too.
      setOriginSlug(slug);
    }
    syncFromPath();
    window.addEventListener("popstate", syncFromPath);
    return () => window.removeEventListener("popstate", syncFromPath);
  }, [basePath]);

  const openItem = items.find((item) => item.slug === openSlug) ?? null;
  const index = openItem ? items.findIndex((item) => item.slug === openItem.slug) : -1;
  const prev = index > 0 ? items[index - 1] : undefined;
  const next = index !== -1 && index < items.length - 1 ? items[index + 1] : undefined;

  const openModal = useCallback(
    (slug: string) => {
      window.history.pushState(null, "", `${basePath}/${slug}`);
      setOpenSlug(slug);
      setOriginSlug(slug);
    },
    [basePath]
  );

  const closeModal = useCallback(() => {
    // Exactly one history entry was pushed to open — back() pops it
    // and lands cleanly on the grid URL that was open before.
    window.history.back();
  }, []);

  const navigateTo = useCallback(
    (item: T) => {
      // replaceState, not pushState — arrow-keying through several
      // items shouldn't pile up one history entry per item.
      // originSlug is deliberately NOT touched here.
      window.history.replaceState(null, "", `${basePath}/${item.slug}`);
      setOpenSlug(item.slug);
    },
    [basePath]
  );

  return { openItem, prev, next, originSlug, openModal, closeModal, navigateTo };
}
