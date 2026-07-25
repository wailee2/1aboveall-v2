"use client";

/**
 * Kept as its own file rather than merged with DesignsGrid — see the
 * earlier explanation: the two now share identical STATE logic (via
 * useWorksModal) but still render enough real differences (colors,
 * caption content) that one shared component would just mean
 * conditionals sprinkled through a single file instead of two clear
 * ones.
 */

import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { DribbbleModal } from "../components/DribbbleModal";
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
    <div>
      <div className="work-grids">
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
            <div className="works-card-img">
              <MediaRenderer
                media={item.heroMedia}
                className="absolute inset-0"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="text-small">
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
