import { AppLink } from "@/components/navigation/AppLink";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import type { CaseStudyItem } from "@/content/works-types";

/**
 * Case Studies page style: editorial — image paired with tagline,
 * tags, and year rather than an image-only tile. Uses <AppLink>
 * (full navigation + route-loading overlay), unlike Designs/Canvas
 * which use plain <Link scroll={false}> to feed the intercepted
 * modal route instead. That's the concrete difference between
 * "traditional navigation" here and the Dribbble-style modal there.
 */
export function CaseStudiesGrid({ items }: { items: CaseStudyItem[] }) {
  if (items.length === 0) {
    return <p className="font-serif text-base text-muted">New case studies coming soon.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[1.25em] gap-y-[1.35em] md:gap-y-[2em] ">
      {items.map((item) => (
        <AppLink 
          key={item.id} 
          href={`/works/case-studies/${item.slug}`} 
          className="group block space-y-[1em] work-link  "
        >
          <div className="relative aspect-16/10 overflow-hidden ">
            <MediaRenderer
              media={item.heroMedia}
              className="absolute inset-0"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-x-0 bottom-0 mix-blend-difference ">
              <ul className="flex flex-wrap gap-x-[0.8em] gap-y-[0.2em] list-none  p-[1em] md:p-[1.2em] text-white!">
                {item.services.slice(0, 3).map((service) => (
                  <li
                    key={service}
                    className=" leading-none text-xsmall uppercase tracking-tight flex-between truncate"
                  >
                    <span className="mr-[0.3em] bg-white rounded-full size-[0.6em]"/>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h2 className="">
              {item.title}
            </h2>
            <span className="hidden font-mono text-xsmall text-muted shrink-0">{item.year}</span>
          </div>
        </AppLink>
      ))}
    </div>
  );
}
