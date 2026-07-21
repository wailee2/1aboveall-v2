"use client";

/**
 * app/(public)/works/components/DribbbleModal.tsx
 * ---------------------------------------------------------------
 * Purely presentational + interaction — no router, no navigation
 * dependency at all. The parent grid (DesignsGrid/CanvasGrid) owns
 * all state and passes item/prev/next/onClose/onNavigate as props.
 * That's what makes this reliable: opening/closing/navigating never
 * triggers a fetch, a route change, or anything Next.js's router
 * could get in the way of — it's a state flip, full stop.
 *
 * "Peek" effect: the backdrop is a translucent purple tint, not a
 * solid color, and the card is inset with padding around it rather
 * than edge-to-edge — the grid page stays visible (dimmed) around
 * and behind the card, so it never looks like a full page swap.
 */

import { useEffect } from "react";
import Image from "next/image";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { DesignItem, CanvasItem } from "@/content/works-types";
import "./modal-transitions.css";

type ModalItem = DesignItem | CanvasItem;

export function DribbbleModal({
  item,
  prev,
  next,
  onClose,
  onNavigate,
}: {
  item: ModalItem;
  prev?: ModalItem;
  next?: ModalItem;
  onClose: () => void;
  onNavigate: (item: ModalItem) => void;
}) {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="fixed inset-0 z-[180] flex items-start justify-center overflow-y-auto p-4 sm:p-10 modal-backdrop-in"
      style={{ backgroundColor: "rgba(76, 29, 149, 0.65)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl mt-4 sm:mt-10 mb-4 sm:mb-10 rounded-lg overflow-hidden bg-[#1B1C22] shrink-0 modal-card-in"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 text-white text-lg leading-none flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          ✕
        </button>

        <div className="relative w-full aspect-[4/3]">
          <MediaRenderer media={item.heroMedia} className="absolute inset-0" sizes="90vw" priority />
        </div>

        <div className="px-6 py-4">
          <h2 className="font-sans text-lg font-medium text-[#F0F0EC]">{item.title}</h2>
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
      </div>
    </div>
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
  item?: ModalItem;
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
