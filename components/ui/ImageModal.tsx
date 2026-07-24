"use client";

/**
 * components/ui/ImageModal.tsx
 * ---------------------------------------------------------------
 * The fix for "forcing every image into an aspect-ratio box loses
 * content" — grid tiles and hero previews stay cropped (that's
 * normal/expected for a compact thumbnail), but clicking through to
 * THIS shows the image at its real, uncropped, natural dimensions.
 *
 * Deliberately uses a plain <img>, not next/image — the entire point
 * here is to bypass next/image's forced-box sizing (`fill`, fixed
 * width/height) and let the browser lay out the image at its actual
 * pixel dimensions, which is exactly what a lightbox needs. This is
 * a intentional, narrow exception to "always use next/image", not
 * a regression — next/image's optimization benefits (responsive
 * `sizes`, lazy loading) matter for a grid of many thumbnails, not a
 * single full-size view a user explicitly opened to inspect.
 *
 * Zoom button icon reflects CURRENT state, not the next action (per
 * spec): "−" while fit-to-screen (zoomed out), "+" once at natural
 * size (zoomed in).
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, ZoomInIcon, ZoomOutIcon, MagnifyIcon } from "@/components/icons/UIIcons";

export function ImageModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-200 bg-black/85 flex items-center justify-center overflow-auto p-6"
      >
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={
            zoomed
              ? "cursor-zoom-out max-w-none"
              : "cursor-zoom-in max-w-full max-h-[85vh] object-contain"
          }
          onClick={(e) => {
            e.stopPropagation();
            setZoomed((z) => !z);
          }}
        />

        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 rounded-full px-4 py-2.5"
        >
          <MagnifyIcon className="w-4 h-4 text-white/70" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            {zoomed ? <ZoomInIcon className="w-4 h-4" /> : <ZoomOutIcon className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="fixed top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
