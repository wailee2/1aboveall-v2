import { AppLink } from "@/components/navigation/AppLink";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { getSelectedPublished } from "@/content/works-api";
import type { WorkItem, CaseStudyItem } from "@/content/works-types";
import ScaleOnScroll from "@/components/ui/ScaleOnScroll";

/**
 * components/home/SelectedWorks.tsx
 * ---------------------------------------------------------------
 * Reads getSelectedPublished() — published AND selected are BOTH
 * required (see content/works-api.ts). To feature something here,
 * flag it `selected: true` in the data; to remove it from the
 * homepage without touching its live category page, flip that flag
 * back to false. Nothing in this component changes either way.
 *
 * THE MOSAIC POSITIONING PROBLEM:
 * Predefined static class strings allow Tailwind's static compiler to
 * pick up every grid & width class at build time without inline style hacks.
 */



const itemClasses = [
  {
    divClass: "col-start-1 col-span-3 w-full",
    mediaClass: "aspect-[3/4]",
  },
  {
    divClass: "col-start-4 col-span-3 ml-auto w-[80%]",
    mediaClass: "aspect-[1/1]",
  },
  {
    divClass: "col-start-6 col-span-4 mx-auto w-[87%]",
    mediaClass: "aspect-[4/3]",
  },
  {
    divClass: "col-start-4 col-span-3 mx-auto w-[83%]",
    mediaClass: "aspect-square", 
  },
  {
    divClass: "col-start-8 col-span-4 mr-auto w-[70%]",
    mediaClass: "aspect-[3/4]",
  },
  {
    divClass: "col-start-1 col-span-3 ml-auto w-[79%]",
    mediaClass: "aspect-[16/10]", // Item 6 (Editorial widescreen)
  },
];

export function SelectedWorks() {
  const items = getSelectedPublished();

  if (items.length === 0) return null;

  return (
    <section className="section-px py-20 border-t border-border">
      <div className="flex items-baseline justify-between mb-12">
        <h2 className="">
          Selected Works
        </h2>
        <AppLink
          href="/works"
          className="font-mono text-xs uppercase tracking-wide text-accent hover:text-accent-hover transition-colors"
        >
          View all →
        </AppLink>
      </div>

      <div className=" md:grid-main gap-x-[.5em] gap-y-[3em] md:gap-y-[4.5em] ">
        {items.map((item, index) => {
          const layout = itemClasses[index % itemClasses.length];

          return (
            <div 
              key={item.id} 
              className={`h-fit md:w-full ${layout.divClass}`}
            >
              <SelectedWorkCard 
                item={item} 
                mediaClass={layout.mediaClass}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

interface SelectedWorkCardProps {
  item: WorkItem;
  mediaClass: string;
}

function SelectedWorkCard({ item, mediaClass }: SelectedWorkCardProps) {
  const isCaseStudy = item.category === "case-studies";
  const caseStudy = isCaseStudy ? (item as CaseStudyItem) : null;

  return (
    <AppLink 
      href={`/works/${item.category}/${item.slug}`} 
      className="group block"
    >

      <div className={`relative ${mediaClass} overflow-hidden mb-[0.7em]`}>
        <MediaRenderer
          media={{
            type: "image",
            src: item.heroImage,
            alt: item.title,
          }}
          className="absolute inset-0 size-full object-cover object-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:blur-[2px]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {isCaseStudy && caseStudy ? (
          <div>
            <div className="bg-text rounded-full size-[2em] absolute inset-x-0 top-0  ml-auto z-10 p-4 m-1.5 "/>

            <div className="absolute inset-x-0 bottom-0 z-10 p-4  ">
              <div className="hidden group-hover:block absolute inset-0 bg-linear-to-t from-black/60 to-transparent " />

              <ul className="md:translate-hide flex flex-wrap gap-x-[0.8em] gap-y-[0.2em]">
                {caseStudy.tags.map((tag) => (
                  <li
                    key={tag}
                    className="leading-none font-mono text-xsmall uppercase tracking-tight text-text/90 flex-center truncate"
                  >
                    <div className="mr-[0.2em] bg-text rounded-full size-[0.5em]"/>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      <h3>{item.title}</h3>
    </AppLink>
  );
}