"use client";

/**
 * app/(public)/works/components/DribbbleModal.tsx
 * ---------------------------------------------------------------
 * Generic over T (DesignItem or CanvasItem) rather than typed to the
 * union ModalItem directly. This matters for a concrete reason, not
 * just style: a callback typed `(item: DesignItem) => void` cannot
 * satisfy a prop typed `(item: DesignItem | CanvasItem) => void` —
 * TypeScript correctly rejects that, because the union version must
 * accept EITHER type, not just the one the callback actually knows
 * how to handle. Making the component generic lets each call site
 * (DesignsGrid passes T = DesignItem, CanvasGrid passes T =
 * CanvasItem) lock in its own concrete type instead.
 *
 * Otherwise unchanged: pure client state/props, no router
 * dependency, purple "peek" backdrop, scale-up entrance.
 */

import { useEffect } from "react";
import Image from "next/image";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { DesignItem, CanvasItem } from "@/content/works-types";
import "./modal-transitions.css";

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

        <div className="relative w-full aspect-4/3">
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

// Only needs slug/title/heroImage — kept as a minimal structural
// type rather than generic, since it doesn't need to know about
// heroMedia, category, or anything else the full item type carries.
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
