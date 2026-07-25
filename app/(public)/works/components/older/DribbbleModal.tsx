"use client";

/**
 * app/(public)/works/components/DribbbleModal.tsx
 * ---------------------------------------------------------------
 * Shared-element transition: the hero image uses the SAME `layoutId`
 * as its corresponding grid tile (see DesignsGrid/CanvasGrid — both
 * wrap their tile image in `motion.div layoutId={workImageLayoutId(item)}`).
 * Framer Motion's layout animation automatically FLIPs between the
 * two elements' rects whenever one mounts while the other is present —
 * opening flies the image from its tile position up to modal size;
 * closing (or navigating away) reverses it back down to the tile.
 * This is Framer Motion's own documented "shared layout" pattern
 * (thumbnail grid + expanded detail view, grid remaining mounted
 * behind) — not a custom animation built from scratch.
 *
 * Clicking the hero image opens the separate natural-size ImageModal
 * lightbox — this modal's own image stays cropped/fit for a
 * consistent modal size, same as the grid tiles; the lightbox is
 * where the full, uncropped image lives.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { ImageModal } from "@/components/ui/ImageModal";
import { useToast } from "@/components/toast/ToastProvider";
import { CloseIcon, ShareIcon } from "@/components/icons/UIIcons";
import type { DesignItem, CanvasItem, MediaItem } from "@/content/works-types";

export function workImageLayoutId(item: { category: string; slug: string }) {
  return `work-image-${item.category}-${item.slug}`;
}

interface PreviewItem {
  slug: string;
  title: string;
  heroImage: string;
}

export function DribbbleModal<T extends DesignItem | CanvasItem>({
  item,
  prev,
  next,
  onClose,
  onNavigate,
}: {
  item: T;
  prev?: T;
  next?: T;
  onClose: () => void;
  onNavigate: (item: T) => void;
}) {
  const { showToast } = useToast();
  const [lightboxMedia, setLightboxMedia] = useState<MediaItem | null>(null);

  const publishedLabel = new Date(item.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleShare = async () => {
    const url = `${window.location.origin}/works/${item.category}/${item.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard", "success");
    } catch {
      showToast("Couldn't copy the link — try again", "error");
    }
  };

  return (
    <>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-180 flex items-start justify-center overflow-y-auto p-4 sm:p-10"
        style={{ backgroundColor: "rgba(76, 29, 149, 0.65)" }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="relative w-full max-w-4xl mt-4 sm:mt-10 mb-4 sm:mb-10 rounded-lg overflow-hidden bg-[#1B1C22] shrink-0"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>

          {/* The shared-element flip lives on THIS element specifically. */}
          <motion.div
            layoutId={workImageLayoutId(item)}
            className="relative w-full aspect-4/3 cursor-pointer"
            onClick={() => setLightboxMedia(item.heroMedia)}
          >
            <MediaRenderer media={item.heroMedia} className="absolute inset-0" sizes="90vw" priority />
          </motion.div>

          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="font-sans text-lg font-medium text-[#F0F0EC]">{item.title}</h2>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Copy link to this item"
                className="shrink-0 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-[#9A9CA8] hover:text-white border border-white/15 rounded-sm px-3 py-2 transition-colors"
              >
                <ShareIcon className="w-3.5 h-3.5" />
                Share
              </button>
            </div>

            <time dateTime={item.publishedDate} className="font-mono text-xs text-[#9A9CA8] block mb-3">
              {publishedLabel}
            </time>

            <p className="font-serif text-sm text-[#C8C7C2] leading-relaxed mb-4">
              {item.shortDescription}
            </p>

            {item.otherMedia && item.otherMedia.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {item.otherMedia.map((media, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxMedia(media)}
                    className="relative w-20 h-16 rounded-sm overflow-hidden shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <MediaRenderer media={media} className="absolute inset-0" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#3B1D5C] px-6 py-4 flex items-center justify-center gap-4">
            <PreviewThumb item={prev} label="Previous" onSelect={() => prev && onNavigate(prev)} />

            <div className="flex items-center gap-2">
              <NavButton disabled={!prev} onClick={() => prev && onNavigate(prev)} label="Previous item">
                ←
              </NavButton>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="font-mono text-xs text-white/70 hover:text-white border border-white/20 rounded-sm px-3 py-2 transition-colors"
              >
                Esc
              </button>
              <NavButton disabled={!next} onClick={() => next && onNavigate(next)} label="Next item">
                →
              </NavButton>
            </div>

            <PreviewThumb item={next} label="Next" onSelect={() => next && onNavigate(next)} />
          </div>
        </motion.div>
      </motion.div>

      {lightboxMedia && lightboxMedia.type === "image" && (
        <ImageModal src={lightboxMedia.src} alt={lightboxMedia.alt} onClose={() => setLightboxMedia(null)} />
      )}
    </>
  );
}

function NavButton({
  children,
  disabled,
  onClick,
  label,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="font-sans text-lg text-white disabled:text-white/25 disabled:cursor-not-allowed border border-white/20 rounded-sm w-10 h-10 flex items-center justify-center hover:border-white/60 transition-colors"
    >
      {children}
    </button>
  );
}

function PreviewThumb({
  item,
  label,
  onSelect,
}: {
  item?: PreviewItem;
  label: string;
  onSelect: () => void;
}) {
  if (!item) return <div className="w-16 h-12 hidden sm:block" aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${label}: ${item.title}`}
      className="relative w-16 h-12 rounded-sm overflow-hidden hidden sm:block shrink-0 opacity-70 hover:opacity-100 transition-opacity"
    >
      <Image src={item.heroImage} alt={item.title} fill sizes="64px" className="object-cover" />
    </button>
  );
}
