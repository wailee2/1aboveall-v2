"use client";

/**
 * app/(public)/works/components/DesignsGrid.tsx
 * ---------------------------------------------------------------
 * Each tile's image wrapper carries layoutId={`work-media-${slug}`}
 * — the shared-element anchor DribbbleModal's frame animates to/from.
 * LayoutGroup scopes these ids to this grid specifically (cheap
 * insurance against collisions, since Designs and Canvas never
 * render on the same page anyway).
 */

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { DribbbleModal } from "../components/DribbbleModal";
import { useWorksModal } from "@/hooks/use-works-modal";
import type { DesignItem } from "@/content/works-types";

export function DesignsGrid({ items }: { items: DesignItem[] }) {
  const { openItem, prev, next, originSlug, openModal, closeModal, navigateTo } = useWorksModal(
    "/works/designs",
    items
  );

  if (items.length === 0) {
    return <p className="font-serif text-base text-muted">New designs coming soon.</p>;
  }

  return (
    <LayoutGroup id="designs-grid">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          // Real <a href> so keyboard nav, "open in new tab", and
          // crawlers all still see a genuine link — the click handler
          // just intercepts the default navigation in favor of the modal.
          <a
            key={item.id}
            href={`/works/designs/${item.slug}`}
            onClick={(e) => {
              e.preventDefault();
              openModal(item.slug);
            }}
            className="group block"
          >
            <motion.div
              layoutId={`work-media-${item.slug}`}
              className="relative aspect-4/3 rounded-sm overflow-hidden mb-3"
            >
              <MediaRenderer
                media={item.heroMedia}
                className="absolute inset-0"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
            <span className="font-sans text-sm font-medium text-text group-hover:text-accent transition-colors">
              {item.title}
            </span>
          </a>
        ))}
      </div>

      <AnimatePresence>
        {openItem && originSlug && (
          <DribbbleModal
            key="designs-modal"
            item={openItem}
            prev={prev}
            next={next}
            originSlug={originSlug}
            basePath="/works/designs"
            onClose={closeModal}
            onNavigate={navigateTo}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
