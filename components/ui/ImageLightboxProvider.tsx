"use client";

/**
 * components/ui/ImageLightboxProvider.tsx
 * ---------------------------------------------------------------
 * Same shape as ToastProvider — one provider mounted once in the
 * root layout, any component anywhere calls useImageLightbox() to
 * open a full-size view of an image, no prop-drilling needed through
 * MediaRenderer/DribbbleModal/DesignCanvasDetail/etc.
 *
 * Deliberately generic (src + alt only) — it doesn't know or care
 * whether the image came from a grid tile, a modal, or a detail
 * page. Any image anywhere in the app can use this.
 */

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ImageLightbox } from "./ImageLightbox";

interface LightboxState {
  src: string;
  alt: string;
}

interface LightboxContextValue {
  open: (src: string, alt: string) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function ImageLightboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LightboxState | null>(null);

  const open = useCallback((src: string, alt: string) => setState({ src, alt }), []);
  const close = useCallback(() => setState(null), []);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {state && <ImageLightbox src={state.src} alt={state.alt} onClose={close} />}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}

export function useImageLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useImageLightbox must be used within <ImageLightboxProvider>");
  return ctx;
}
