"use client";

/**
 * components/ui/ImageLightbox.tsx
 * ---------------------------------------------------------------
 * Rebuilt around the Dribbble/Behance pattern, not a "zoom in place"
 * pattern: the image expands to full viewport WIDTH (not fit-to-
 * screen), and if that makes it taller than the viewport, the
 * viewport itself becomes a real scrollable window into it — the
 * same way scrolling a normal webpage works, not a faked pan.
 *
 * Two things that make this actually smooth and correct, not just
 * visually similar:
 *
 * 1. The scroll container is a genuine `overflow-auto` div. Mouse
 *    wheel / trackpad scroll works on it with zero extra code —
 *    nothing here reimplements scrolling. Drag-to-pan manually sets
 *    the SAME scrollTop/scrollLeft wheel-scroll would, so the two
 *    input methods can never fight each other or drift out of sync.
 *
 * 2. `overscroll-behavior: contain` (via the `overscroll-contain`
 *    class) plus locking `document.body`'s own scroll while open —
 *    together these are what stop scrolling inside the lightbox from
 *    "chaining" into scrolling the page behind it, which is exactly
 *    the requirement that scrolling the lightbox must not scroll the
 *    page underneath.
 *
 * Click vs. drag: a pointer press that moves less than
 * DRAG_CLICK_THRESHOLD px counts as a click (one-click zoom toggle);
 * anything past that is treated as a genuine drag and does NOT also
 * toggle zoom on release.
 */

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FRAME_TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };
const ZOOMED_WIDTH_VW = 160;
const DRAG_CLICK_THRESHOLD = 6;

export function ImageLightbox({
  src,
  alt,
  width,
  height,
  onClose,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0, moved: false });

  // Lock the PAGE's own scroll while the lightbox is open — this is
  // what guarantees scrolling inside here never touches the page
  // behind it, on top of overscroll-contain below.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
      moved: false,
    };
    setDragging(true);
    el.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dx) > DRAG_CLICK_THRESHOLD || Math.abs(dy) > DRAG_CLICK_THRESHOLD) {
      dragState.current.moved = true;
    }
    el.scrollLeft = dragState.current.scrollLeft - dx;
    el.scrollTop = dragState.current.scrollTop - dy;
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    setDragging(false);
    scrollRef.current?.releasePointerCapture(e.pointerId);
    if (!dragState.current.moved) {
      setZoomed((z) => !z);
    }
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-220 bg-black/90"
    >
      <div className="flex gap-[.6em] absolute top-[3em] right-7 z-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="imagelightbox-button "
        >
          <CloseIcon />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setZoomed((z) => !z);
          }}
          aria-label={zoomed ? "Zoom out" : "Zoom in"}
          className="imagelightbox-button"
        >
          <MagnifyIcon zoomed={zoomed} />
        </button>
      </div>

      {/* The real scroll container — this IS the viewport onto the
          image, bounded to 100vh, exactly like scrolling a page. */}
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full overflow-auto overscroll-contain"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        <div className="min-h-full flex items-start justify-center">
          <motion.div
            layoutId={`lightbox-${src}`}
            transition={FRAME_TRANSITION}
            style={{ width: zoomed ? `${ZOOMED_WIDTH_VW}vw` : "100vw" }}
          >
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              draggable={false}
              className="w-full h-auto block select-none"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth={2} fill="none">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function MagnifyIcon({ zoomed }: { zoomed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" strokeLinecap="round" />
      {/* Per the earlier spec: minus while zoomed OUT, plus while zoomed IN. */}
      {zoomed ? (
        <>
          <path d="M8 10.5h5" strokeLinecap="round" />
          <path d="M10.5 8v5" strokeLinecap="round" />
        </>
      ) : (
        <path d="M8 10.5h5" strokeLinecap="round" />
      )}
    </svg>
  );
}
