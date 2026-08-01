"use client";

/**
 * components/ui/MediaRenderer.tsx
 * ---------------------------------------------------------------
 * FIXED: previously this component's single wrapper div carried both
 * a hardcoded `position: relative` (from the old `.skeleton-image`
 * CSS class) AND whatever positioning className the caller passed in
 * (almost always "absolute inset-0"). Two `position` values on one
 * element is a real conflict, not a style preference — depending on
 * CSS load order, one silently wins, and when `relative` won, the
 * div never actually stretched to fill its sized parent. That left
 * next/image's `fill` mode with a 0-height ancestor — exactly the
 * "height value of 0" warning this produced.
 *
 * FIX: two nested divs with two different jobs, so nothing ever
 * competes for the same CSS property on the same element:
 *
 *   <div className={className}>          <- caller controls size/position
 *                                            (e.g. "absolute inset-0",
 *                                            sized by an aspect-ratio
 *                                            ancestor the caller owns)
 *     <div className="relative w-full h-full ...">  <- ALWAYS relative,
 *                                            fills 100% of whatever
 *                                            real size the outer div
 *                                            ends up with — this is
 *                                            what next/image's `fill`
 *                                            actually needs
 *       <Image fill .../>
 *     </div>
 *   </div>
 *
 * Caller-facing API is unchanged — every existing call site that
 * passes className="absolute inset-0" keeps working exactly as
 * before. Only this file's internals changed.
 */

import { useState } from "react";
import Image from "next/image";
import type { MediaItem } from "@/content/works-types";
import "./skeleton.css";

export function MediaRenderer({
  media,
  mode = "fill",
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  media: MediaItem;
  mode?: "fill" | "intrinsic";
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const opacityStyle = { opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" };

  if (mode === "intrinsic") {
    const wrapperClass = `relative overflow-hidden bg-surface-tint ${
      !loaded ? "skeleton-shimmer" : ""
    } ${className}`;

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
            width={media.width}
            height={media.height}
            className="w-full h-auto block"
            style={opacityStyle}
          />
        </div>
      );
    }

    return (
      <div className={wrapperClass}>
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes={sizes}
          priority={priority}
          onLoad={() => setLoaded(true)}
          className="w-full h-auto block"
          style={opacityStyle}
        />
      </div>
    );
  }

  const innerClass = `relative w-full h-full overflow-hidden bg-surface-tint ${
    !loaded ? "skeleton-shimmer" : ""
  }`;

  return (
    <div className={className}>
      <div className={innerClass}>
        {media.type === "video" ? (
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
            style={opacityStyle}
          />
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes={sizes}
            priority={priority}
            onLoad={() => setLoaded(true)}
            className="object-cover object-center"
            style={opacityStyle}
          />
        )}
      </div>
    </div>
  );
}
