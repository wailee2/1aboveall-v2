import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { CaseStudyItem } from "@/content/works-types";

export function CaseStudyResult({ item }: { item: CaseStudyItem }) {
  return (
    <section className="section-px">
      <h2 className=" mb-8">
        The Result
      </h2>
      
      {item.impact && (
        <p className="">
          {item.impact}
        </p>
      )}

      {item.testimonial && (
        <blockquote className="">
          “{item.testimonial.quote}”
          <footer className="font-mono text-xs not-italic text-muted mt-3">
            — {item.testimonial.author}
          </footer>
        </blockquote>
      )}
    </section>
  );
}
