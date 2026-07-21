"use client";

import { useCallback, useEffect, useState } from "react";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { DribbbleModal } from "./DribbbleModal";
import type { CanvasItem } from "@/content/works-types";

/**
 * Same pattern as DesignsGrid — see that file for the full
 * explanation of why this is client state + History API instead of
 * Next.js intercepting routes.
 */
export function CanvasGrid({ items }: { items: CanvasItem[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    function syncFromPath() {
      const match = window.location.pathname.match(/^\/works\/canvas\/([^/]+)\/?$/);
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
    window.history.pushState(null, "", `/works/canvas/${slug}`);
    setOpenSlug(slug);
  }, []);

  const closeModal = useCallback(() => {
    window.history.back();
  }, []);

  const navigateTo = useCallback((item: CanvasItem) => {
    window.history.replaceState(null, "", `/works/canvas/${item.slug}`);
    setOpenSlug(item.slug);
  }, []);

  if (items.length === 0) {
    return <p className="font-serif text-base text-muted/70">New pieces coming soon.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {items.map((item, i) => (
          <a
            key={item.id}
            href={`/works/canvas/${item.slug}`}
            onClick={(e) => {
              e.preventDefault();
              openModal(item.slug);
            }}
            className={`block `}
          >
            <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3">
              <MediaRenderer
                media={item.heroMedia}
                className="absolute inset-0"
                sizes="(max-width: 640px) 100vw, 50vw"
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
