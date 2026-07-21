import Link from "next/link";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { DesignItem } from "@/content/works-types";

/**
 * FIXED: the title used to be hidden entirely until hover
 * (opacity-0 group-hover:opacity-100), with no other affordance —
 * genuinely bad UX, not just a stylistic choice, since there was no
 * indication text was even there. Title is now always visible below
 * the image, same as Canvas, while still keeping Designs visually
 * distinct via the tighter 3-col grid and lighter card treatment.
 *
 * Uses plain <Link>, not <AppLink> — clicking here needs to trigger
 * the intercepted (.)[slug] MODAL route, not a full page navigation.
 */
export function DesignsGrid({ items }: { items: DesignItem[] }) {
  if (items.length === 0) {
    return <p className="font-serif text-base text-muted">New designs coming soon.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link key={item.id} href={`/works/designs/${item.slug}`} scroll={false} className="group block">
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-3">
            <MediaRenderer
              media={item.heroMedia}
              className="absolute inset-0"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <span className="font-sans text-sm font-medium text-text group-hover:text-accent transition-colors">
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
