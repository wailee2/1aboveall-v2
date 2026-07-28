import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { CaseStudyItem } from "@/content/works-types";

export function CaseStudyResult({ item }: { item: CaseStudyItem }) {
  return (
    <section className="section-px py-16 border-t border-border">
      <h2 className="font-sans text-2xl font-semibold tracking-tight text-text mb-8">
        The Result
      </h2>

      {item.mobileExperience && (
        <section className="space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-medium">
              mobile experience
            </h2>

            <p className="mt-4 text-muted-foreground">
              {item.mobileExperience.description}
            </p>
          </div>

          <div className="grid grid-cols-12 gap-[1.25em]  ">
            <div className="col-start-2 col-span-10 grid grid-cols-12 gap-[2em]  ">
              {item.mobileExperience.media.map((media, index) => (
                <div
                  key={index}
                  className="col-span-4 relative aspect-9/16 overflow-hidden "
                >
                  <MediaRenderer 
                    media={media} 
                    className="absolute inset-0"
                    sizes="90vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className=" relative aspect-video overflow-hidden">
        <MediaRenderer 
          media={item.visualMedia}
          className="absolute inset-0"
          sizes="90vw"
        />
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
