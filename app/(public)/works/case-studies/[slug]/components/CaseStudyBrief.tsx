import type { CaseStudyItem } from "@/content/works-types";
import { MediaRenderer } from "@/components/ui/MediaRenderer";

export function CaseStudyBrief({ item }: { item: CaseStudyItem }) {
  return (
    <section className="section-px py-16 border-t border-border">
      {item.hero_statement && (
        <blockquote className="font-serif text-2xl leading-snug text-text italic mb-14 max-w-[50ch]">
          “{item.hero_statement}”
        </blockquote>
      )}

      <div className="mb-8">
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted mb-2">Context</h2>
        <p className="font-serif text-lg leading-relaxed text-text/85">{item.context}</p>
      </div>

      <div className="mb-8">
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted mb-2">Objective</h2>
        <p className="font-serif text-lg leading-relaxed text-text/85">{item.objective}</p>
      </div>

      <div className=" relative aspect-video overflow-hidden">
        <MediaRenderer 
          media={item.showcaseMedia}
          className="absolute inset-0"
          sizes="90vw" priority
        />
      </div>
    </section>
  );
}
