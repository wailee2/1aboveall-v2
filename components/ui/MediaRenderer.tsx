"use client";

/**
 * components/ui/MediaRenderer.tsx
 * ---------------------------------------------------------------
 * Renders any MediaItem (content/works-types.ts) correctly whether
 * it's an image or a video — callers never branch on `media.type`
 * themselves. This lives in the SHARED components/ui/ folder, not
 * inside app/(public)/works/components/, because nothing about it is
 * works-specific — any future gallery, blog post, or case study
 * elsewhere in the app can reuse it as-is.
 *
 * The wrapping element must be sized by the caller (aspect-ratio or
 * a fixed-height className) since both <video> and Next's fill-mode
 * <Image> need a positioned parent with real dimensions.
 */

import { useState } from "react";
import Image from "next/image";
import type { MediaItem } from "@/content/works-types";
import "./skeleton.css";

export function MediaRenderer({
  media,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  media: MediaItem;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  const wrapperClass = `skeleton-image ${!loaded ? "skeleton-image-shimmer" : ""} ${className}`;

  if (media.type === "video") {
    return (
      <div className={wrapperClass}>
        <video
          src={media.src}
          poster={media.poster}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setLoaded(true)}
          aria-label={media.alt}
          className="w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
        />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className="object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
      />
    </div>
  );
}
