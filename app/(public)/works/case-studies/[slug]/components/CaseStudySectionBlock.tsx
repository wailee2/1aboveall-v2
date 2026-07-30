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
    <section className="section-px ">
      <div className="section-spacer bg-red-700">
        <div className="lg:grid-main-case info-case bg-yellow-600 ">
          <h2 className="case_h2 col-start-1 col-span-2">
            {section.title}
          </h2>
          <p className="col-start-3 col-span-6">
            {section.overview}
          </p>
        </div>

        {section.blocks.map((block, index) => {
          const isEvenBlock = index % 2 !== 0;

          return (
            <div 
              key={block.subheading}
              className=" grid grid-cols-1 md:grid-cols-12 gap-[1.25em]   items-center space-y-[1.25em]"
            >
              <div 
                className={`relative aspect-square overflow-hidden col-span-12 ${
                  isEvenBlock 
                    ? "md:col-start-8 md:col-span-5 md:order-2" 
                    : "md:col-start-1 md:col-span-5 md:order-1"
                }`}
              >
                <MediaRenderer 
                  media={block.media} 
                  className="absolute inset-0 size-full object-cover" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div 
                className={`col-span-12 info-case ${
                  isEvenBlock 
                    ? "md:col-start-2 md:col-span-4 md:order-1" 
                    : "md:col-start-8 md:col-span-4 md:order-2"
                }`}
              >
                <h3 className="case_h2">{block.subheading}</h3>
                <p className="">
                  {block.description}
                </p>
              </div>
            </div>
          );
        })}

        {section.visualMedia && (
          <div className="relative aspect-video rounded-sm overflow-hidden bg-muted/20">
            <MediaRenderer 
              media={section.visualMedia} 
              className="absolute inset-0 w-full h-full object-cover" 
              sizes="90vw" 
            />
          </div>
        )}

        {section.mobileExperience && (
          <div className="section-spacer">
            <div className="lg:grid-main-case ">
              <h2 className="case_h2 col-start-1 col-span-2">
                mobile experience
              </h2>
              <p className="col-start-3 col-span-6">
                {section.mobileExperience.description}
              </p>
            </div>
            
            <div className="grid-main-case">
              {section.mobileExperience.media.map((mediaItem, index) => (
                <div 
                  key={index} 
                  className="relative aspect-9/16 overflow-hidden col-span-4"
                >
                  <MediaRenderer 
                    media={mediaItem} 
                    className="absolute inset-0 size-full object-cover" 
                    sizes="(max-width: 640px) 100vw, 33vw" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
