import { AppLink } from "@/components/navigation/AppLink";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { CaseStudyItem } from "@/content/works-types";

/**
 * Case Studies page style: editorial — image paired with tagline,
 * tags, and year rather than an image-only tile. Uses <AppLink>
 * (full navigation + route-loading overlay), unlike Designs/Canvas
 * which use plain <Link scroll={false}> to feed the intercepted
 * modal route instead. That's the concrete difference between
 * "traditional navigation" here and the Dribbble-style modal there.
 */
export function CaseStudiesGrid({ items }: { items: CaseStudyItem[] }) {
  if (items.length === 0) {
    return <p className="font-serif text-base text-muted">New case studies coming soon.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
      {items.map((item) => (
        <AppLink key={item.id} href={`/works/case-studies/${item.slug}`} className="group block">
          <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-4">
            <MediaRenderer
              media={item.heroMedia}
              className="absolute inset-0"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="font-sans text-lg font-medium text-text group-hover:text-accent transition-colors">
              {item.title}
            </h2>
            <span className="font-mono text-xs text-muted shrink-0">{item.year}</span>
          </div>
          <p className="font-serif text-sm text-muted mb-3">{item.tagline}</p>
          <ul className="flex flex-wrap gap-2 list-none p-0">
            {item.tags.map((tag) => (
              <li
                key={tag}
                className="font-mono text-[10px] uppercase tracking-wide bg-accent-tint text-accent px-2 py-1 rounded-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
        </AppLink>
      ))}
    </div>
  );
}
