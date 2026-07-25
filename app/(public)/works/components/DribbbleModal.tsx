"use client";

/**
 * app/(public)/works/components/DribbbleModal.tsx
 * ---------------------------------------------------------------
 * SHARED ELEMENT TRANSITION: the image frame uses layoutId={"work-
 * media-" + originSlug} — the SAME id as the grid tile it was
 * clicked from (see DesignsGrid/CanvasGrid). Framer Motion detects
 * the matching id and automatically animates the FLIP transform
 * between the tile's on-screen rect and this frame's rect, both on
 * mount (fly in) and on exit (fly back), no manual measuring needed.
 *
 * originSlug is intentionally stable for the whole modal session
 * (see use-works-modal.ts) — prev/next navigation crossfades the
 * MEDIA CONTENT inside this same frame instead of re-triggering a
 * flight animation to a different grid tile on every arrow press.
 *
 * The rest of the content (title, description, other media, etc.)
 * fades in on a short delay after the frame lands, so the image is
 * clearly the "hero" of the entrance motion.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { LightboxTrigger } from "@/components/ui/LightboxTrigger";
import { useToast } from "@/components/toast/ToastProvider";
import type { DesignItem, CanvasItem } from "@/content/works-types";

interface PreviewItem {
  slug: string;
  title: string;
  heroImage: string;
}

export function DribbbleModal<T extends DesignItem | CanvasItem>({
  item,
  prev,
  next,
  originSlug,
  basePath,
  onClose,
  onNavigate,
}: {
  item: T;
  prev?: T;
  next?: T;
  originSlug: string;
  /** "/works/designs" or "/works/canvas" — used only to build the share link. */
  basePath: string;
  onClose: () => void;
  onNavigate: (item: T) => void;
}) {
  const { showToast } = useToast();

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prev) onNavigate(prev);
      if (e.key === "ArrowRight" && next) onNavigate(next);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose, onNavigate, prev, next]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const publishedLabel = new Date(item.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleShare = async () => {
    const url = `${window.location.origin}${basePath}/${item.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied", "success");
    } catch {
      showToast("Couldn't copy the link", "error");
    }
  };

  return (
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
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl mt-4 sm:mt-10 mb-4 sm:mb-10 rounded-lg overflow-hidden bg-[#1B1C22] shrink-0"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 text-white text-lg leading-none flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          ✕
        </button>

        {/* Shared-element frame — layoutId anchored to originSlug,
            stable across prev/next. This is the piece that flies in
            from and back out to the grid tile it was opened from. */}
        <motion.div layoutId={`work-media-${originSlug}`} className="relative w-full aspect-4/3">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              <LightboxTrigger media={item.heroMedia} className="absolute inset-0" sizes="90vw" priority />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Rest of the content fades in shortly after the frame lands. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.25 }}
          className="px-6 py-5"
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="font-sans text-lg font-medium text-[#F0F0EC]">{item.title}</h2>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Copy link to this item"
              className="shrink-0 font-mono text-[11px] uppercase tracking-wide text-white/70 hover:text-white border border-white/20 rounded-sm px-3 py-1.5 transition-colors flex items-center gap-1.5"
            >
              <ShareIcon /> Share
            </button>
          </div>

          <time dateTime={item.publishedDate} className="font-mono text-[11px] uppercase tracking-wide text-white/50 block mb-3">
            {publishedLabel}
          </time>

          <p className="font-serif text-sm text-white/70 leading-relaxed max-w-[60ch] mb-5">
            {item.shortDescription}
          </p>

          {item.otherMedia && item.otherMedia.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {item.otherMedia.map((media, i) => (
                <div key={i} className="relative aspect-square rounded-sm overflow-hidden">
                  <LightboxTrigger media={media} className="absolute inset-0" sizes="200px" />
                </div>
              ))}
            </div>
          )}
        </motion.div>

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
      </div>
    </motion.div>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4" strokeLinecap="round" />
    </svg>
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
