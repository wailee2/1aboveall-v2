"use client";

/**
 * app/(public)/works/components/DribbbleModal.tsx
 * ---------------------------------------------------------------
 * Shared by both Designs and Canvas's intercepted (.)[slug] routes.
 * This is the "soft nav opens in place, hard nav has a real URL"
 * behavior — implemented with Next.js Parallel + Intercepting
 * Routes, which is the framework's own primitive for this pattern
 * (this is exactly how Instagram/Dribbble-style photo modals are
 * built in Next.js docs):
 *
 *   works/designs/
 *     page.tsx                     <- the grid (clicking here is a soft nav)
 *     [slug]/page.tsx              <- the REAL page (visiting the URL directly)
 *     @modal/default.tsx           <- renders null when no modal is active
 *     @modal/(.)[slug]/page.tsx    <- intercepts [slug] when navigated to
 *                                     FROM the grid, rendering THIS modal
 *                                     instead of the full page
 *
 * Behavior implemented here:
 *  - Escape closes it (router.back(), returning to the grid)
 *  - Clicking the backdrop closes it the same way
 *  - ArrowLeft/ArrowRight navigate to the prev/next item via
 *    router.push — since that's still a soft client-side nav, it
 *    gets intercepted again and stays in the modal
 *  - Prev/next preview thumbnails + the arrow/esc controls all live
 *    in one bottom bar, as requested
 */

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { DesignItem, CanvasItem } from "@/content/works-types";

type ModalItem = DesignItem | CanvasItem;

export function DribbbleModal({
  item,
  prev,
  next,
  basePath,
}: {
  item: ModalItem;
  prev?: ModalItem;
  next?: ModalItem;
  /** "/works/designs" or "/works/canvas" */
  basePath: string;
}) {
  const router = useRouter();

  const close = useCallback(() => router.back(), [router]);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft" && prev) router.push(`${basePath}/${prev.slug}`);
      if (e.key === "ArrowRight" && next) router.push(`${basePath}/${next.slug}`);
    }
    window.addEventListener("keydown", handleKeydown);
    // Always remove the listener on unmount/re-render — the "clean
    // memory after use" rule applied to a global event listener.
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [close, prev, next, basePath, router]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={close}
      className="fixed inset-0 z-[180] bg-black/80 flex flex-col"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex-1 flex items-center justify-center p-6 min-h-0"
      >
        <div className="relative w-full max-w-4xl aspect-[4/3] rounded-md overflow-hidden">
          <MediaRenderer media={item.heroMedia} className="absolute inset-0" sizes="90vw" priority />
        </div>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 bg-[#141414] px-6 py-4 flex items-center justify-center gap-4"
      >
        <PreviewThumb
          item={prev}
          label="Previous"
          align="right"
          onSelect={() => prev && router.push(`${basePath}/${prev.slug}`)}
        />

        <div className="flex items-center gap-2">
          <NavButton
            disabled={!prev}
            onClick={() => prev && router.push(`${basePath}/${prev.slug}`)}
            label="Previous item"
          >
            ←
          </NavButton>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="font-mono text-xs text-[#9A9CA8] hover:text-white border border-[#33343E] rounded-sm px-3 py-2 transition-colors"
          >
            Esc
          </button>
          <NavButton
            disabled={!next}
            onClick={() => next && router.push(`${basePath}/${next.slug}`)}
            label="Next item"
          >
            →
          </NavButton>
        </div>

        <PreviewThumb
          item={next}
          label="Next"
          align="left"
          onSelect={() => next && router.push(`${basePath}/${next.slug}`)}
        />
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
      className="font-sans text-lg text-[#F0F0EC] disabled:text-[#4A4A4A] disabled:cursor-not-allowed border border-[#33343E] rounded-sm w-10 h-10 flex items-center justify-center hover:border-[#6E90D6] transition-colors"
    >
      {children}
    </button>
  );
}

function PreviewThumb({
  item,
  label,
  align,
  onSelect,
}: {
  item?: ModalItem;
  label: string;
  align: "left" | "right";
  onSelect: () => void;
}) {
  if (!item) return <div className="w-16 h-12 hidden sm:block" aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${label}: ${item.title}`}
      className={`relative w-16 h-12 rounded-sm overflow-hidden hidden sm:block shrink-0 opacity-70 hover:opacity-100 transition-opacity ${
        align === "left" ? "ml-2" : "mr-2"
      }`}
    >
      <Image src={item.heroImage} alt={item.title} fill sizes="64px" className="object-cover" />
    </button>
  );
}
