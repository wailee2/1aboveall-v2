"use client";

/**
 * app/(public)/works/components/CanvasGrid.tsx
 * ---------------------------------------------------------------
 * Same fix as DesignsGrid — see that file's comments. Kept separate
 * for the same reasons discussed earlier.
 */

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { DribbbleModal } from "../components/DribbbleModal";
import { useWorksModal } from "@/hooks/use-works-modal";
import type { CanvasItem } from "@/content/works-types";

const FRAME_TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

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
      <div className="work-grids ">
        {items.map((item) => (
          <a
            key={item.id}
            href={`/works/canvas/${item.slug}`}
            onClick={(e) => {
              e.preventDefault();
              openModal(item.slug);
            }}
            className="block "
          >
            <div className="works-card">
              <motion.div
                layoutId={`work-media-${item.slug}`}
                className="works-card-img"
                transition={FRAME_TRANSITION}
              >
                <MediaRenderer
                  media={item.heroMedia}
                  className="absolute inset-0"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </motion.div>
            </div>
            <h2 className="works-card-title ">{item.title}</h2>
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
