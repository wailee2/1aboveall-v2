import type { MediaItem } from "./works-types";

/**
 * content/media-utils.ts
 * ---------------------------------------------------------------
 * The replacement for the old heroImage field. Anywhere an
 * image-only representation is needed (dense grids, OG tags, preview
 * thumbnails), derive it here instead of storing a redundant path.
 * For a video, the poster IS the image representation — there's
 * nothing else it could correctly mean.
 */
export interface MediaThumbnail {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function getMediaThumbnail(media: MediaItem): MediaThumbnail {
  if (media.type === "image") {
    return { src: media.src, alt: media.alt, width: media.width, height: media.height };
  }
  return { src: media.poster, alt: media.alt, width: media.width, height: media.height };
}
