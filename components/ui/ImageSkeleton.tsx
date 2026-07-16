"use client";

/**
 * components/ui/ImageSkeleton.tsx
 * ---------------------------------------------------------------
 * Wraps next/image with a shimmering placeholder shown until the
 * image finishes loading. Use this instead of next/image directly
 * anywhere a project/work image is rendered, for consistent loading
 * behavior across the whole site.
 */

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import "./skeleton.css";

export function ImageSkeleton(props: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`skeleton-image ${!loaded ? "skeleton-image-shimmer" : ""}`}>
      <Image
        {...props}
        onLoad={(e) => {
          setLoaded(true);
          props.onLoad?.(e);
        }}
        style={{
          ...props.style,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
