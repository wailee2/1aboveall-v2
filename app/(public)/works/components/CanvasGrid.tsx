"use client";

/**
 * app/(public)/works/components/CanvasGrid.tsx
 * ---------------------------------------------------------------
 * Asymmetric layout removed — now the same 3-col symmetric grid as
 * DesignsGrid. Canvas still stays visually distinct through its
 * local dark palette (see the wrapping override in canvas/page.tsx)
 * and its richer title+description caption, not through a different
 * grid structure.
 *
 * Kept as its own file rather than merged with DesignsGrid — see the
 * earlier explanation: the two now share identical STATE logic (via
 * useWorksModal) but still render enough real differences (colors,
 * caption content) that one shared component would just mean
 * conditionals sprinkled through a single file instead of two clear
 * ones.
 */

import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { DribbbleModal } from "./DribbbleModal";
import { useWorksModal } from "@/hooks/use-works-modal";
import type { CanvasItem } from "@/content/works-types";

export function CanvasGrid({ items }: { items: CanvasItem[] }) {
  const { openItem, prev, next, openModal, closeModal, navigateTo } = useWorksModal(
    "/works/canvas",
    items
  );

  if (items.length === 0) {
    return <p className="font-serif text-base text-muted/70">New pieces coming soon.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <a
            key={item.id}
            href={`/works/canvas/${item.slug}`}
            onClick={(e) => {
              e.preventDefault();
              openModal(item.slug);
            }}
            className="block"
          >
            <div className="relative aspect-4/3 rounded-sm overflow-hidden mb-3">
              <MediaRenderer
                media={item.heroMedia}
                className="absolute inset-0"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="font-sans text-base font-medium text-[#F0F0EC]">{item.title}</div>
            <div className="font-serif text-sm text-[#9A9CA8] mt-1">{item.shortDescription}</div>
          </a>
        ))}
      </div>

      {openItem && (
        <DribbbleModal item={openItem} prev={prev} next={next} onClose={closeModal} onNavigate={navigateTo} />
      )}
    </>
  );
}
