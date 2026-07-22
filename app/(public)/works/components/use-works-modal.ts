"use client";

/**
 * app/(public)/works/hooks/use-works-modal.ts
 * ---------------------------------------------------------------
 * The state management behind the Dribbble-style modal was
 * identical between DesignsGrid and CanvasGrid — same popstate sync,
 * same pushState/replaceState/back() calls — differing only in the
 * URL prefix. That's genuine duplication (unlike the grids'
 * rendering, which differs on purpose per the brief), so it's
 * extracted here once. The two grid components stay separate
 * because THEIR job — how a row of items looks — is meant to be
 * different; this hook's job — how the modal's open/closed state is
 * tracked — is meant to be identical, so it only exists in one place.
 */

import { useCallback, useEffect, useState } from "react";

interface HasSlug {
  slug: string;
}

export function useWorksModal<T extends HasSlug>(basePath: string, items: T[]) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Keeps state correct for the browser's own back/forward buttons,
  // not just this hook's own open/close actions.
  useEffect(() => {
    const pattern = new RegExp(`^${basePath}/([^/]+)/?$`);
    function syncFromPath() {
      const match = window.location.pathname.match(pattern);
      setOpenSlug(match ? match[1] : null);
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
      window.history.replaceState(null, "", `${basePath}/${item.slug}`);
      setOpenSlug(item.slug);
    },
    [basePath]
  );

  return { openItem, prev, next, openModal, closeModal, navigateTo };
}
