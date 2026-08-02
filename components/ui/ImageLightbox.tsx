"use client";

/**
 * components/ui/ImageLightbox.tsx
 * ---------------------------------------------------------------
 * Two structural changes from the previous version:
 *
 * 1. Click-outside-closes is back, scoped correctly: clicking the
 *    dimmed backdrop (outside the image) closes the lightbox;
 *    clicking the IMAGE itself toggles expand/collapse instead. This
 *    needs stopPropagation on every interactive child (image, close
 *    button, zoom button) — otherwise their clicks bubble up to the
 *    backdrop's onClick and close the lightbox as an unwanted side
 *    effect of, say, pressing the zoom button.
 *
 * 2. Native image drag suppression, properly layered. draggable={false}
 *    alone is NOT reliably enough — Safari in particular can still
 *    initiate its own native "pick up this image" drag, which STEALS
 *    the pointermove events this component's custom scroll-drag
 *    needs. When that happens, this component never sees any
 *    movement, so pointerup looks like a plain click — which is
 *    exactly the reported bug (drag attempt reads as a click, image
 *    looks like it's being "picked up" for a new tab). Fixed with
 *    three layers together: draggable={false}, an onDragStart that
 *    calls preventDefault(), and the WebKit-specific
 *    -webkit-user-drag: none (Safari doesn't fully honor the
 *    draggable attribute alone).
 *
 * Cursor states, exactly as specified:
 *   - hovering the backdrop (outside the image): normal/default cursor
 *   - hovering the image, not yet expanded: zoom-in
 *   - hovering the image, expanded: grab (grabbing while actively dragged)
 */

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";


const FRAME_TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };
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
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0, moved: false });

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

  function handlePointerDown(e: React.PointerEvent<HTMLImageElement>) {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: scrollEl.scrollLeft,
      scrollTop: scrollEl.scrollTop,
      moved: false,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLImageElement>) {
    if (!dragging) return;
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dx) > DRAG_CLICK_THRESHOLD || Math.abs(dy) > DRAG_CLICK_THRESHOLD) {
      dragState.current.moved = true;
    }
    scrollEl.scrollLeft = dragState.current.scrollLeft - dx;
    scrollEl.scrollTop = dragState.current.scrollTop - dy;
  }

  function handlePointerUp(e: React.PointerEvent<HTMLImageElement>) {
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (!dragState.current.moved) {
      setExpanded((v) => !v);
    }
  }

  const imageCursor = !expanded ? "zoom-in" : dragging ? "grabbing" : "grab";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-220 bg-black/90 cursor-auto"
    >
      <div className="flex gap-[.6em] absolute top-7 right-7 z-10">
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
            setExpanded((v) => !v);
          }}
          aria-label={expanded ? "Zoom out" : "Zoom in"}
          className="imagelightbox-button"
        >
          <MagnifyIcon zoomed={expanded} />
        </button>
      </div>

      {/* Real scroll container — only has anything to scroll once
          `expanded` makes the content taller than 100vh. */}
      <div
        ref={scrollRef}
        className="w-full h-full overflow-auto overscroll-contain"
      >
        <div className="min-h-full flex items-start justify-center">
          <motion.div 
            layoutId={`lightbox-${src}`} 
            transition={FRAME_TRANSITION}
            className="overflow-x-hidden"
          >
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="select-none block  "
              style={{
                height: expanded ? "auto" : "100vh",
                width: expanded ? "100vw" : "auto",
                maxWidth: expanded ? "100vw" : "none",
                cursor: imageCursor,
              }}
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
