import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { CaseStudyItem } from "@/content/works-types";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

export function CaseStudyHero({ item }: { item: CaseStudyItem }) {
  return (
    <section className=" ">
      <div className="section-px">
        <Breadcrumbs
          items={[
            { label: "Works", href: "/works" },
            { label: "Case Studies", href: "/works/case-studies" },
            { label: item.title },
          ]}
        />
      </div>

      <div className="section-px mb-[0.5em] flex-between items-baseline flex-wrap space-y-[0.2em] ">
        <h1 className=" tracking-[-0.05px]! text-[45px] sm:text-[64px] md:text-[96px] lg:text-[clamp(73px,6.4vw+11px,183px)] case_heading">
          {item.title}
        </h1>
        
        {item.liveSiteUrl ? (
          <a
            href={item.liveSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="clickable-link inline-block text-xsmall "
          >
            Visit live site ↗
          </a>
        ) : (
          <div className="clickable-link pointer-events-none inline-block text-xsmall text-black! bg-disabled! ">
            Case coming soon
          </div>
        )}
      </div>

      <div className=" flex flex-col-reverse gap-[2em] md:grid-main-case  relative uppercase ">
        <dl className="col-start-2 col-span-2 grid grid-cols-2 gap-[1.25em] md:space-y-[3em] md:block h-fit md:absolute bottom-1/3 uppercase leading-none px-4.5 md:px-0  ">
          <div className=" info-case">
            <dt className="case_h2  ">Client</dt>
            <dd className=" ">{item.client}</dd>
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

        <div className='col-start-4 col-span-full'>
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
