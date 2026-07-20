import { AppLink } from "@/components/navigation/AppLink";
import Image from "next/image";
import type { WorkItem } from "@/content/works-types";

/**
 * Reads whatever getRecentPublished() returns — currently capped by
 * RECENT_PROJECTS_COUNT (content/works-config.ts). Uses `heroImage`
 * specifically (always a plain image) rather than `heroMedia`, since
 * a dense recents grid shouldn't be autoplaying multiple videos at
 * once.
 */
export function RecentsSection({ items }: { items: WorkItem[] }) {
  return (
    <section>
      <h2 className="font-sans text-2xl font-semibold tracking-tight text-text mb-8">
        Recent
      </h2>

      {items.length === 0 ? (
        <p className="font-serif text-base text-muted">Nothing published yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <AppLink key={item.id} href={`/works/${item.category}/${item.slug}`} className="group">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-surface-tint mb-2">
                <Image
                  src={item.heroImage}
                  alt={item.title}
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
          ))}
        </div>
      )}
    </section>
  );
}
