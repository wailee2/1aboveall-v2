import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { CaseStudyItem } from "@/content/works-types";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

export function CaseStudyHero({ item }: { item: CaseStudyItem }) {
  return (
    <header className=" pb-12 pt-[7em] ">
      <div className="section-px">
        <Breadcrumbs
          items={[
            { label: "Works", href: "/works" },
            { label: "Case Studies", href: "/works/case-studies" },
            { label: item.title },
          ]}
        />
      </div>

      <div className="md:grid-main-cs section-px">
        <div className='col-start-3 xl:col-start-2 col-span-full'>
          <h1 className=" mb-[0.5em] text-[45px] sm:text-[64px] md:text-[96px] lg:text-[clamp(73px,6.4vw+11px,183px)] case_heading">
            {item.title}
          </h1>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-[2em] md:grid-main-cs mb-[2em] relative ">
        <dl className="col-start-2 col-span-2 grid grid-cols-2 gap-[1.25em] md:space-y-[3em] md:block h-fit md:absolute bottom-1/3 text-xsmall uppercase leading-none px-4.5 md:px-0  ">
          <div>
            <dt className="case_h2">Client</dt>
            <dd className="uppercase ">{item.client}</dd>
          </div>

          <div>
            <dt className="case_h2">Services</dt>
            <dd>
              <ul className="uppercase space-y-[0.5em] wrap-break-word">
                {item.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </dd>
          </div>

          <div className="">
            <span className="">{item.year}</span>
          </div>
        </dl>

        <div className='col-start-4 col-span-full bg-yellow-700'>
          <div className=" relative aspect-video overflow-hidden">
            <MediaRenderer 
              media={item.heroMedia}
              className="absolute inset-0"
              sizes="90vw" priority
            />
          </div>
        </div>
      </div>
      





      <div className="grid grid-cols-12 gap-[1.25em]">
        <h1 className="col-start-3 xl:col-start-2 col-span-full mb-3 sm:text-[64px] md:text-[96px] lg:text-[clamp(73px,6.4vw+11px,183px)] case_heading">
          {item.title}
        </h1>
      </div>
      <p className="font-serif text-lg text-muted mb-6 max-w-[60ch]">{item.tagline}</p>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <span className="font-mono text-xs text-muted">{item.year}</span>
      </div>

      <div className="w-[90%] mx-auto relative aspect-video rounded-md overflow-hidden mb-8">
        <MediaRenderer media={item.heroMedia} className="absolute inset-0" sizes="90vw" priority />
      </div>

      {item.liveSiteUrl ? (
        <a
          href={item.liveSiteUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block font-sans text-sm font-medium bg-accent text-on-accent hover:bg-accent-hover px-6 py-3 rounded-sm transition-colors"
        >
          Visit live site ↗
        </a>
      ) : (
        <div className="inline-block font-mono text-xs uppercase tracking-wide text-muted border border-border rounded-sm px-6 py-3">
          Case coming soon
        </div>
      )}
    </header>
  );
}
