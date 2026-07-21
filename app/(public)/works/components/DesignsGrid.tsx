"use client";

/**
 * app/(public)/works/components/DesignsGrid.tsx
 * ---------------------------------------------------------------
 * The modal is now owned entirely by this component's state — NOT
 * Next.js intercepting routes. Opening it calls window.history.
 * pushState directly (bypassing Next's router entirely), so the URL
 * bar updates for shareability/back-button support without any
 * fetch, navigation, or route render ever happening. That's what
 * guarantees this can never look or feel like a page reload: nothing
 * is being loaded.
 *
 * The real dedicated page (app/(public)/works/designs/[slug]/page.tsx,
 * red background) is untouched and still handles every direct visit,
 * hard refresh, or shared link — this component only ever renders
 * when someone is already on the grid.
 */

import { useCallback, useEffect, useState } from "react";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { DribbbleModal } from "./DribbbleModal";
import type { DesignItem } from "@/content/works-types";

export function DesignsGrid({ items }: { items: DesignItem[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Keeps state correct for the browser's own back/forward buttons,
  // not just our own open/close actions.
  useEffect(() => {
    function syncFromPath() {
      const match = window.location.pathname.match(/^\/works\/designs\/([^/]+)\/?$/);
      setOpenSlug(match ? match[1] : null);
    }
    syncFromPath();
    window.addEventListener("popstate", syncFromPath);
    return () => window.removeEventListener("popstate", syncFromPath);
  }, []);

  const openItem = items.find((i) => i.slug === openSlug) ?? null;
  const index = openItem ? items.findIndex((i) => i.slug === openItem.slug) : -1;
  const prev = index > 0 ? items[index - 1] : undefined;
  const next = index !== -1 && index < items.length - 1 ? items[index + 1] : undefined;

  const openModal = useCallback((slug: string) => {
    window.history.pushState(null, "", `/works/designs/${slug}`);
    setOpenSlug(slug);
  }, []);

  const closeModal = useCallback(() => {
    // We pushed exactly one history entry to open — back() pops it
    // and lands cleanly on the grid URL we came from.
    window.history.back();
  }, []);

  const navigateTo = useCallback((item: DesignItem) => {
    // replaceState, not pushState — arrow-keying through items
    // shouldn't pile up one history entry per item.
    window.history.replaceState(null, "", `/works/designs/${item.slug}`);
    setOpenSlug(item.slug);
  }, []);

  if (items.length === 0) {
    return <p className="font-serif text-base text-muted">New designs coming soon.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          // Real <a href> (not a plain button) so keyboard nav,
          // "open in new tab", and crawlers all still see a genuine
          // link — the click handler just intercepts the default
          // navigation in favor of the modal.
          <a
            key={item.id}
            href={`/works/designs/${item.slug}`}
            onClick={(e) => {
              e.preventDefault();
              openModal(item.slug);
            }}
            className="group block"
          >
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-3">
              <MediaRenderer
                media={item.heroMedia}
                className="absolute inset-0"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <span className="font-sans text-sm font-medium text-text group-hover:text-accent transition-colors">
              {item.title}
            </span>
          </a>
        ))}
      </div>

      {openItem && (
        <DribbbleModal item={openItem} prev={prev} next={next} onClose={closeModal} onNavigate={navigateTo} />
      )}
    </>
  );
}
