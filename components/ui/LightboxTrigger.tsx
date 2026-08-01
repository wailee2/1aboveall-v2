"use client";

/**
 * components/ui/LightboxTrigger.tsx
 * ---------------------------------------------------------------
 * Deliberately NOT wired into MediaRenderer itself — MediaRenderer
 * is used everywhere, including grid tiles, where a click must open
 * the Dribbble modal, not this lightbox. This wrapper is added only
 * where "click to see full size" is actually wanted: inside
 * DribbbleModal and DesignCanvasDetail.
 *
 * Only wraps image-type media — a looping video already plays
 * inline; there's no natural-size "lightbox" concept for it here.
 * Video media renders via MediaRenderer with no click behavior added.
 */

import { MediaRenderer } from "./MediaRenderer";
import { useImageLightbox } from "./ImageLightboxProvider";
import type { MediaItem } from "@/content/works-types";

export function LightboxTrigger({
  media,
  mode = "fill",
  className,
  sizes,
  priority,
}: {
  media: MediaItem;
  mode?: "fill" | "intrinsic";
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const { open } = useImageLightbox();

  if (media.type !== "image") {
    return <MediaRenderer media={media} mode={mode} className={className} sizes={sizes} priority={priority} />;
  }

  return (
    <button
      type="button"
      onClick={() => open(media.src, media.alt)}
      aria-label={`View larger: ${media.alt}`}
      className={`cursor-pointer ${className ?? ""}`}
    >
      <MediaRenderer 
        media={media} 
        mode={mode} 
        className={mode === "intrinsic" ? "w-full" : "w-full h-full"}
        sizes={sizes} 
        priority={priority}
      />
    </button>
  );
}
