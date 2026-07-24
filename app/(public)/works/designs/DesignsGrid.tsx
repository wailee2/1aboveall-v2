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
import { DribbbleModal } from "../components/DribbbleModal";
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
    <div>
      <div className="work-grids ">
        {items.map((item) => (
          <a
            key={item.id}
            href={`/works/designs/${item.slug}`}
            onClick={(e) => {
              e.preventDefault();
              openModal(item.slug);
            }}
            className="group block"
          >
            <div className="works-card-img">
              <MediaRenderer
                media={item.heroMedia}
                className="absolute inset-0"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="text-small  ">
              {item.title}
            </div>
          </a>
        ))}
      </div>

      {openItem && (
        <DribbbleModal item={openItem} prev={prev} next={next} onClose={closeModal} onNavigate={navigateTo} />
      )}
    </div>
  );
}
