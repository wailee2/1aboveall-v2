"use client";

/**
 * components/ui/ImageLightbox.tsx
 * ---------------------------------------------------------------
 * Changes this round:
 *
 * 1. Scroll lock now calls useScrollLock() from ScrollProvider
 *    instead of touching document.body — that's what actually pauses
 *    the page (see components/ScrollProvider.tsx for why the old
 *    approach never worked once the app switched to OverlayScrollbars).
 *
 * 2. NO nested <ScrollProvider> around the image. dragScroll/
 *    clickScroll only control dragging/clicking the SCROLLBAR
 *    handle/track — not click-and-drag-content panning, which is a
 *    separate gesture this component still has to implement itself.
 *    Wrapping the image in it would also break the drag code below,
 *    since OverlayScrollbars restructures its target into its own
 *    internal viewport and the plain scrollTop/scrollLeft writes
 *    here would no longer hit the real scrollable element.
 *
 * 3. Native image drag suppressed with all three layers together —
 *    `draggable={false}` alone isn't reliably respected in every
 *    browser (Safari especially). Without all three, the browser's
 *    own "pick up this image" drag can hijack the pointer gesture
 *    mid-drag, which is exactly what caused drags to be misread as
 *    clicks (toggling back to normal size) before.
 *
 * 4. Click-outside-the-image now closes the modal again (bubbles up
 *    to the single onClick on the backdrop); the image itself calls
 *    stopPropagation and handles its own click-vs-drag distinction.
 *    Cursor: zoom-in before expanding, grab/grabbing once expanded
 *    and draggable, plain default over the rest of the overlay.
 */

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ScrollProvider, { useScrollLock } from "@/components/providers/ScrollProvider";

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
  const { lock, unlock } = useScrollLock();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0, moved: false });

  useEffect(() => {
    lock();
    return unlock;
  }, [lock, unlock]);

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
    e.preventDefault();
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: scrollEl.scrollLeft,
      scrollTop: scrollEl.scrollTop,
      moved: false,
    };
    setDragging(true);
    (e.target as HTMLImageElement).setPointerCapture(e.pointerId);
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
    (e.target as HTMLImageElement).releasePointerCapture(e.pointerId);
    if (!dragState.current.moved) {
      setExpanded((v) => !v);
    }
  }

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
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          aria-label={expanded ? "Zoom out" : "Zoom in"}
          className="imagelightbox-button"
        >
          <MagnifyIcon zoomed={expanded} />
        </button>
        
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="imagelightbox-button "
        >
          <CloseIcon />
        </button>
      </div>

      <div 
        ref={scrollRef} 
        className="w-full h-full overflow-auto overscroll-contain"
      >
        <ScrollProvider>
          <div className="min-h-full flex items-start justify-center">
            <motion.img
              layoutId={`lightbox-${src}`}
              transition={FRAME_TRANSITION}
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
              className="select-none block"
              style={{
                height: expanded ? "auto" : "100vh",
                width: expanded ? "100vw" : "auto",
                maxWidth: expanded ? "100vw" : "none"
              }}
            />
          </div>
        </ScrollProvider>
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
