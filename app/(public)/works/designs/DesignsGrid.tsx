"use client";

/**
 * app/(public)/works/components/DesignsGrid.tsx
 * ---------------------------------------------------------------
 * The layoutId'd motion.div no longer carries rounded-sm/overflow-
 * hidden itself — those live on the static outer <div> now, so
 * border-radius is never part of what Framer Motion has to
 * interpolate mid-transform. Explicit tween transition (no spring)
 * matches the one used in DribbbleModal's frame, so open and close
 * feel identical in speed/easing.
 */

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { DribbbleModal } from "../components/DribbbleModal";
import { useWorksModal } from "@/hooks/use-works-modal";
import type { DesignItem } from "@/content/works-types";

const FRAME_TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

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
      <div className="work-grids ">
        {items.map((item) => (
          <a
            key={item.id}
            href={`/works/designs/${item.slug}`}
            onClick={(e) => {
              e.preventDefault();
              openModal(item.slug);
            }}
            className="block"
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
            <h3 className="text-small! ">{item.title}</h3>
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
