import { AppLink } from "@/components/navigation/AppLink";
import { MediaRenderer } from "@/components/ui/MediaRenderer";
import { getSelectedPublished } from "@/content/works-api";
import type { WorkItem, CaseStudyItem } from "@/content/works-types";

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
    divClass: "col-start-1 col-span-6 mr-auto w-[95%]",
    mediaClass: "aspect-[5/3]", // Item 1 (Wide landscape)
  },
  {
    divClass: "col-start-9 col-span-2 mx-auto w-[80%]",
    mediaClass: "aspect-[1/1]",  // Item 2 (Portrait)
  },
  {
    divClass: "col-start-4 col-span-3 ml-auto w-[83%]",
    mediaClass: "aspect-[4/3]",  // Item 3 (Standard 4:3)
  },
  {
    divClass: "col-start-1 col-span-4 mx-auto w-[87%]",
    mediaClass: "aspect-square", // Item 4 (Square 1:1)
  },
  {
    divClass: "col-start-8 col-span-4 mr-auto w-[70%]",
    mediaClass: "aspect-[3/4]",  // Item 5 (Portrait)
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
    <section className="section-p-x py-20 border-t border-border">
      <div className="flex items-baseline justify-between mb-12">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-text">
          Selected Works
        </h2>
        <AppLink
          href="/works"
          className="font-mono text-xs uppercase tracking-wide text-accent hover:text-accent-hover transition-colors"
        >
          View all →
        </AppLink>
      </div>

      <div className=" grid-main gap-x-[.5em] gap-y-[3.7em] md:gap-y-[4.5em] ">
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

  const media = (
    <div className={`relative ${mediaClass} overflow-hidden mb-3`}>
      <MediaRenderer
        media={{ 
          type: "image", 
          src: item.heroImage, 
          alt: item.title
        }}
        className="absolute inset-0 size-full"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );

  if (isCaseStudy) {
    const caseStudy = item as CaseStudyItem;
    return (
      <div>
        {media}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="font-sans text-lg font-semibold uppercase tracking-wide text-text">
              {item.title}
            </h3>
            <ul className="flex flex-col gap-0.5 list-none p-0">
              {caseStudy.tags.map((tag) => (
                <li 
                  key={tag} 
                  className="font-mono text-[11px] uppercase tracking-wide text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <AppLink
            href={`/works/case-studies/${item.slug}`}
            className="shrink-0 font-mono text-[11px] uppercase tracking-wide border border-border px-3 py-2 hover:border-accent hover:text-accent transition-colors flex items-center gap-2"
          >
            See case study →
          </AppLink>
        </div>
      </div>
    );
  }

  return (
    <AppLink 
      href={`/works/${item.category}/${item.slug}`} 
      className="block"
    >
      {media}
      <h3 className="font-sans text-base font-semibold uppercase tracking-wide text-text">
        {item.title}
      </h3>
    </AppLink>
  );
}
