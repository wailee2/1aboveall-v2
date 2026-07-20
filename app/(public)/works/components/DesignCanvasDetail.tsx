import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { DesignItem, CanvasItem } from "@/content/works-types";

/**
 * app/(public)/works/components/DesignCanvasDetail.tsx
 * ---------------------------------------------------------------
 * Designs and Canvas sub-item pages share this exact layout (hero
 * media at 80% width, bold title, short description, other media,
 * published date) — the two categories are "similar" per the brief,
 * differing only in background color (red for Designs, green for
 * Canvas), passed in as a prop rather than duplicating this whole
 * component twice.
 */
export function DesignCanvasDetail({
  item,
  bgColor,
  textColor = "#FAF9F5",
  mutedColor = "rgba(250, 249, 245, 0.7)",
}: {
  item: DesignItem | CanvasItem;
  bgColor: string;
  textColor?: string;
  mutedColor?: string;
}) {
  const publishedLabel = new Date(item.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="-mx-6 px-6 py-20 min-h-[80vh]" style={{ backgroundColor: bgColor }}>
      <div className="max-w-[1000px] mx-auto">
        <h1
          className="font-sans text-3xl md:text-4xl font-bold tracking-tight mb-3"
          style={{ color: textColor }}
        >
          {item.title}
        </h1>
        <time
          dateTime={item.publishedDate}
          className="font-mono text-xs uppercase tracking-wide block mb-8"
          style={{ color: mutedColor }}
        >
          {publishedLabel}
        </time>

        <div className="w-[80%] mx-auto relative aspect-[4/3] rounded-md overflow-hidden mb-8">
          <MediaRenderer media={item.heroMedia} className="absolute inset-0" sizes="80vw" priority />
        </div>

        <p
          className="font-serif text-lg leading-relaxed max-w-[65ch] mx-auto text-center mb-12"
          style={{ color: textColor }}
        >
          {item.shortDescription}
        </p>

        {item.otherMedia && item.otherMedia.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {item.otherMedia.map((media, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-sm overflow-hidden">
                <MediaRenderer media={media} className="absolute inset-0" sizes="(max-width: 640px) 100vw, 50vw" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
