"use client";

/**
 * app/(public)/works/components/CanvasGrid.tsx
 * ---------------------------------------------------------------
 * Same shared-element pattern as DesignsGrid — see that file's
 * comments for the full explanation. Kept as a separate file for the
 * same reasons discussed earlier (different colors/caption content),
 * even though the modal mechanics are now identical via
 * useWorksModal + DribbbleModal.
 */

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { DribbbleModal } from "../components/DribbbleModal";
import { useWorksModal } from "@/hooks/use-works-modal";
import type { CanvasItem } from "@/content/works-types";

export function CanvasGrid({ items }: { items: CanvasItem[] }) {
  const { openItem, prev, next, originSlug, openModal, closeModal, navigateTo } = useWorksModal(
    "/works/canvas",
    items
  );

  if (items.length === 0) {
    return <p className="font-serif text-base text-muted/70">New pieces coming soon.</p>;
  }

  return (
    <LayoutGroup id="canvas-grid">
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
            <div className="font-sans text-base font-medium text-[#F0F0EC]">{item.title}</div>
            <div className="font-serif text-sm text-[#9A9CA8] mt-1">{item.shortDescription}</div>
          </a>
        ))}
      </div>

      <AnimatePresence>
        {openItem && originSlug && (
          <DribbbleModal
            key="canvas-modal"
            item={openItem}
            prev={prev}
            next={next}
            originSlug={originSlug}
            basePath="/works/canvas"
            onClose={closeModal}
            onNavigate={navigateTo}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
