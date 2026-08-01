import { AppLink } from "@/components/navigation/AppLink";
import Image from "next/image";
import type { WorkItem } from "@/content/works-types";
import { getMediaThumbnail } from "@/content/media-utils";
import HorizontalScroller, { HorizontalContent } from "@/components/ui/HorizontalScroller";
import VerticalScroller, { VerticalContent }  from "@/components/ui/VerticalScroller";

export function RecentsSection({ items }: { items: WorkItem[] }) {
  return (
    <section>
      <h3 className="mb-8">Recent</h3>

      {items.length === 0 ? (
        <p className="font-serif text-base text-muted">Nothing published yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item) => {
            const thumb = getMediaThumbnail(item.heroMedia);
            return (
              <AppLink key={item.id} href={`/works/${item.category}/${item.slug}`} className="group">
                <div className="relative aspect-4/3 rounded-sm overflow-hidden bg-surface-tint mb-2">
                  <Image
                    src={thumb.src}
                    alt={thumb.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="font-sans text-sm font-medium text-text truncate">{item.title}</div>
                <div className="font-mono text-[10px] uppercase tracking-wide text-muted">
                  {item.category}
                </div>
              </AppLink>
            );
          })}
        </div>
      )}
    </section>
  );
}
