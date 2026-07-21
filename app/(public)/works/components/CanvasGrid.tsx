import Link from "next/link";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { CanvasItem } from "@/content/works-types";

/**
 * Canvas page style: a locally-scoped dark surface (same technique
 * as the N800 case study override elsewhere in the site — a plain
 * wrapping div with its own CSS variables, never touching the
 * global theme), an asymmetric 2-column layout with taller tiles,
 * and captions always visible below the image rather than hidden
 * until hover — a gallery-wall feel instead of Designs' tighter grid.
 */
export function CanvasGrid({ items }: { items: CanvasItem[] }) {
  if (items.length === 0) {
    return <p className="font-serif text-base text-muted/70">New pieces coming soon.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {items.map((item, i) => (
        <Link
          key={item.id}
          href={`/works/canvas/${item.slug}`}
          scroll={false}
          className={`block`}
        >
          <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3">
            <MediaRenderer media={item.heroMedia} className="absolute inset-0" sizes="(max-width: 640px) 100vw, 50vw" />
          </div>
          <div className="font-sans text-base font-medium text-[#F0F0EC]">{item.title}</div>
          <div className="font-serif text-sm text-[#9A9CA8] mt-1">{item.shortDescription}</div>
        </Link>
      ))}
    </div>
  );
}
