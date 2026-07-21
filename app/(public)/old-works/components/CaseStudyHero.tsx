import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { CaseStudyItem } from "@/content/works-types";

export function CaseStudyHero({ item }: { item: CaseStudyItem }) {
  return (
    <header className="max-w-[1000px] mx-auto px-6 pt-16 pb-12">
      <h1 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-text mb-3">
        {item.title}
      </h1>
      <p className="font-serif text-lg text-muted mb-6 max-w-[60ch]">{item.tagline}</p>

      <div className="flex flex-wrap items-center gap-4 mb-8">
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
        <span className="font-mono text-xs text-muted">{item.year}</span>
      </div>

      <div className="w-[90%] mx-auto relative aspect-video rounded-md overflow-hidden mb-8">
        <MediaRenderer media={item.heroMedia} className="absolute inset-0" sizes="90vw" priority />
      </div>

      {item.liveSiteUrl ? (
        <a
          href={item.liveSiteUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block font-sans text-sm font-medium bg-accent text-on-accent hover:bg-accent-hover px-6 py-3 rounded-sm transition-colors"
        >
          Visit live site ↗
        </a>
      ) : (
        <div className="inline-block font-mono text-xs uppercase tracking-wide text-muted border border-border rounded-sm px-6 py-3">
          Case coming soon
        </div>
      )}
    </header>
  );
}
