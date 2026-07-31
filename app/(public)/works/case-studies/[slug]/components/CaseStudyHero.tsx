import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { CaseStudyItem } from "@/content/works-types";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

export function CaseStudyHero({ item }: { item: CaseStudyItem }) {
  return (
    <section className="section-px pb-[2em]">
      <div className="">
        <Breadcrumbs
          items={[
            { label: "Works", href: "/works" },
            { label: "Case Studies", href: "/works/case-studies" },
            { label: item.title },
          ]}
        />
      </div>

      <div className="mb-[2em] flex-between items-baseline flex-wrap gap-x-[2em] gap-y-[1em] ">
        <h1 className=" text-[45px] sm:text-[64px] md:text-[96px] lg:text-[clamp(73px,6.4vw+11px,183px)] case_heading">
          {item.title}
        </h1>
        
        {item.liveSiteUrl ? (
          <a
            href={item.liveSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="clickable-link inline-block text-xsmall "
          >
            Visit live site
          </a>
        ) : (
          <div className="clickable-link pointer-events-none inline-block text-xsmall text-black! bg-disabled! ">
            Link coming soon
          </div>
        )}
      </div>

      <div className=" flex flex-col-reverse gap-[2em] md:grid-main-case relative uppercase mix-blend-difference ">
        <dl className="col-start-1 col-span-2 grid grid-cols-2 gap-[1.25em] md:space-y-[3em] md:block h-fit md:absolute bottom-0 lg:bottom-1/3 uppercase leading-none z-10  ">
          <div className=" info-case">
            <dt className="case_h2  ">Client</dt>
            <dd className="text-nowrap ">{item.client}</dd>
          </div>

          <div className=" info-case">
            <dt className="case_h2 ">Services</dt>
            <dd>
              <ul className=" space-y-[0.3em] wrap-break-word">
                {item.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </dd>
          </div>

          <div className=" info-case">
            <span className="case_h2 ">year</span>
            <span className="">{item.year}</span>
          </div>
        </dl>

        <div className='col-start-4s lg: col-start-3 col-span-full'>
          <div className=" relative aspect-video overflow-hidden">
            <MediaRenderer 
              media={item.heroMedia}
              className="absolute inset-0"
              sizes="90vw" priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
