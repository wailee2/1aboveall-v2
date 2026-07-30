import type { CaseStudyItem } from "@/content/works-types";
import { MediaRenderer } from "@/components/ui/MediaRenderer";

export function CaseStudyBrief({ item }: { item: CaseStudyItem }) {
  return (
    <section className="section-px page-spacer ">
      <div className="space-y-[3em] ">
        {item.heroStatement && (
          <div className="lg:grid-main-case  ">
            <blockquote className="col-start-1 col-span-7 text-4xl lg:text-5xl/[-5%] uppercase font-medium   ">
              “{item.heroStatement}”
            </blockquote>
          </div>
        )}
        
        <div className=" space-y-[1.8em]">
          <div className=" gap-[.75em] flex flex-col  lg:grid-main-case">
            <h2 className="case_h2 col-start-1 col-span-2 ">Context</h2>
            <p className=" col-start-3 col-span-6">{item.context}</p>
          </div>

          <div className="gap-[.75em] flex flex-col  lg:grid-main-case">
            <h2 className="case_h2 col-start-1 col-span-2">Objective</h2>
            <p className=" col-start-3 col-span-6">{item.objective}</p>
          </div>
        </div>
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
