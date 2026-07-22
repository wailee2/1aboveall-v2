"use client";

/**
 * app/(public)/works/components/DesignsGrid.tsx
 * ---------------------------------------------------------------
 * Modal state now comes from the shared useWorksModal hook (see
 * ../hooks/use-works-modal.ts) instead of being duplicated inline.
 *
 * The real dedicated page (app/(public)/works/designs/[slug]/page.tsx,
 * red background) is untouched and still handles every direct visit,
 * hard refresh, or shared link — this component only ever renders
 * when someone is already on the grid.
 */

import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { DribbbleModal } from "./DribbbleModal";
import { useWorksModal } from "@/hooks/use-works-modal";
import type { DesignItem } from "@/content/works-types";

export function DesignsGrid({ items }: { items: DesignItem[] }) {
  const { openItem, prev, next, openModal, closeModal, navigateTo } = useWorksModal(
    "/works/designs",
    items
  );

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
            <div className="relative aspect-4/3 rounded-sm overflow-hidden mb-3">
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
