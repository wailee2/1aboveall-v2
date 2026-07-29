import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { CaseStudySection } from "@/content/works-types";

/**
 * Renders one "Deep Dive" section — a title, an overview paragraph,
 * and a row of Feature Blocks (subheading + description + media).
 * Used twice per case study (Concept & Design, Execution &
 * Development) with different data, rather than being two separate
 * near-identical components.
 */
export function CaseStudySectionBlock({ section }: { section: CaseStudySection }) {
  return (
    <section className="section-px py-16 border-t border-border">
      <h2 className="case_h2 font-sans text-2xl font-semibold tracking-tight text-text mb-4">
        {section.title}
      </h2>
      <p className="font-serif text-lg leading-relaxed text-text/85 max-w-[65ch] mb-12">
        {section.overview}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {section.blocks.map((block) => (
          <div key={block.subheading}>
            <h3 className="font-sans text-lg font-medium text-text mb-2">{block.subheading}</h3>
            <p className="font-serif text-base text-muted leading-relaxed mb-4">
              {block.description}
            </p>
            <div className="relative aspect-4/3 rounded-sm overflow-hidden">
              <MediaRenderer media={block.media} className="absolute inset-0" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        ))}
      </div>

      {section.visualMedia && (
        <div className="relative aspect-video rounded-sm overflow-hidden bg-muted/20">
          <MediaRenderer 
            media={section.visualMedia} 
            className="absolute inset-0 w-full h-full object-cover" 
            sizes="100vw" 
          />
        </div>
      )}

      {section.mobileExperience && (
        <div className="mt-16">
          <p className="font-serif text-lg leading-relaxed text-text/85 max-w-[65ch] mb-10">
            {section.mobileExperience.description}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {section.mobileExperience.media.map((mediaItem, index) => (
              <div 
                key={index} 
                className="relative aspect-9/19 rounded-xl overflow-hidden bg-muted/20 border border-border"
              >
                <MediaRenderer 
                  media={mediaItem} 
                  className="absolute inset-0 w-full h-full object-cover" 
                  sizes="(max-width: 640px) 100vw, 33vw" 
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
    </section>
  );
}
