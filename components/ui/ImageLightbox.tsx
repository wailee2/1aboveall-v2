"use client";

/**
 * components/ui/ImageLightbox.tsx
 * ---------------------------------------------------------------
 * Shows an image at its natural width/height (never cropped to an
 * aspect-ratio box like the thumbnail treatment elsewhere) — bounded
 * by the viewport via max-w/max-h + object-contain, so a huge image
 * scales down to fit and a small one never gets stretched up.
 *
 * Zoom is a single click on the image (zooms in) or the dedicated
 * button (toggles either way) — deliberately NOT click-to-zoom-out
 * on the image itself, since that would be ambiguous with drag
 * (dragging IS enabled once zoomed, and distinguishing "clicked" from
 * "dragged zero pixels" adds fragile complexity for no real benefit
 * when a dedicated button already handles zoom-out unambiguously).
 *
 * NOTE ON ICON DIRECTION: per the spec this was built against, the
 * button shows a MINUS icon while zoomed OUT and a PLUS icon while
 * zoomed IN — the reverse of the usual "+  means you can zoom in"
 * convention. Implemented literally as specified; flip the ternary
 * below if that was actually meant the conventional way around.
 */

import { motion } from "framer-motion";
import { useState } from "react";

export function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-220 flex items-center justify-center bg-black/85 p-6"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth={2} fill="none">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setZoomed((z) => !z);
        }}
        aria-label={zoomed ? "Zoom out" : "Zoom in"}
        className="absolute bottom-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <MagnifyIcon zoomed={zoomed} />
      </button>

      <motion.img
        src={src}
        alt={alt}
        onClick={(e) => {
          e.stopPropagation();
          if (!zoomed) setZoomed(true);
        }}
        drag={zoomed}
        dragElastic={0.15}
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: zoomed ? 2 : 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="max-w-[92vw] max-h-[85vh] w-auto h-auto object-contain select-none"
        style={{ cursor: zoomed ? "grab" : "zoom-in" }}
        whileTap={zoomed ? { cursor: "grabbing" } : undefined}
      />
    </motion.div>
  );
}

function MagnifyIcon({ zoomed }: { zoomed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" strokeLinecap="round" />
      {/* Per spec: minus while zoomed OUT, plus while zoomed IN. */}
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
