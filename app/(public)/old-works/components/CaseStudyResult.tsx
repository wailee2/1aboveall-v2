import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { CaseStudyItem } from "@/content/works-types";

export function CaseStudyResult({ item }: { item: CaseStudyItem }) {
  return (
    <section className="max-w-[1000px] mx-auto px-6 py-16 border-t border-border">
      <h2 className="font-sans text-2xl font-semibold tracking-tight text-text mb-8">
        The Result
      </h2>

      <div className="relative aspect-video rounded-md overflow-hidden mb-10">
        <MediaRenderer media={item.resultMedia} className="absolute inset-0" sizes="90vw" />
      </div>

      {item.impact && (
        <p className="font-serif text-lg leading-relaxed text-text/85 max-w-[65ch] mb-8">
          {item.impact}
        </p>
      )}

      {item.testimonial && (
        <blockquote className="font-serif text-xl italic text-text max-w-[55ch]">
          “{item.testimonial.quote}”
          <footer className="font-mono text-xs not-italic text-muted mt-3">
            — {item.testimonial.author}
          </footer>
        </blockquote>
      )}
    </section>
  );
}
