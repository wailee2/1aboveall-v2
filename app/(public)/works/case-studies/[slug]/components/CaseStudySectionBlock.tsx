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
      <div className="mb-[2.5em] lg:grid-main-case info-case  ">
        <h2 className="case_h2 col-start-1 col-span-2">
          {section.title}
        </h2>
        <p className="col-start-3 col-span-6">
          {section.overview}
        </p>
      </div>
      
      <div className="flex flex-col gap-[3.7em]  ">
        {section.blocks.map((block, index) => {
          const isEvenBlock = index % 2 !== 0;

          return (
            <div 
              key={block.subheading}
              className="grid grid-cols-12 gap-x-[1.25em] gap-y-[1.35em] items-center "
            >
              <div 
                className={`col-span-12 info-case ${
                  isEvenBlock 
                    ? "md:col-start-2 md:col-span-4 md:order-1" 
                    : "md:col-start-8 md:col-span-4 md:order-2"
                }`}
              >
                <div className="flex items-center gap-[0.3em]">
                  <span className=" bg-text rounded-full size-[0.57em] "/>
                  <h3 className="case_h3">{block.subheading}</h3>
                </div>
                <p className="">
                  {block.description}
                </p>
              </div>

              <div 
                className={`relative aspect-square  overflow-hidden col-span-12  ${
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
            </div>
          );
        })}
      </div>

      {section.visualMedia && (
        <div className="relative aspect-video overflow-hidden mt-[5em]">
          <MediaRenderer 
            media={section.visualMedia} 
            className="absolute inset-0 size-full object-cover" 
            sizes="90vw" 
          />
        </div>
      )}

      {section.mobileExperience && (
        <div className="flex flex-col gap-[2.5em] mt-[5em] ">
          <div className="lg:grid-main-case info-case ">
            <h2 className="case_h2 col-start-1 col-span-2">
              mobile experience
            </h2>
            <p className="col-start-3 col-span-6">
              {section.mobileExperience.description}
            </p>
          </div>
          
          <div className="grid-main-case  ">
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
    </section>
  );
}
