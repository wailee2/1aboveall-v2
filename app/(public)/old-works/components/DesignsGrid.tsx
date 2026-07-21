import Link from "next/link";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { DesignItem } from "@/content/works-types";

/**
 * Designs page style: light background (site default), a tight
 * symmetric 3-column tile grid, caption revealed on hover rather
 * than always visible — deliberately distinct from Canvas's darker,
 * asymmetric treatment below.
 *
 * Uses plain <Link>, not <AppLink> — clicking here needs to trigger
 * the intercepted (.)[slug] MODAL route, not a full page navigation,
 * and the route-loading overlay firing on every image click would
 * fight the modal's own instant-open feel. See @modal/(.)[slug]/page.tsx.
 */
export function DesignsGrid({ items }: { items: DesignItem[] }) {
  if (items.length === 0) {
    return <p className="font-serif text-base text-muted">New designs coming soon.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/works/designs/${item.slug}`}
          scroll={false}
          className="group relative block aspect-[4/3] rounded-sm overflow-hidden"
        >
          <MediaRenderer media={item.heroMedia} className="absolute inset-0" sizes="(max-width: 1024px) 50vw, 33vw" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
            <span className="font-sans text-sm font-medium text-white">{item.title}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
