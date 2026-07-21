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

      <div className=" grid-main gap-x-[.5em] gap-y-[3em] md:gap-y-[4.5em] ">
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
      {/* 1. Media Container */}
      <div 
        className={`relative ${mediaClass} overflow-hidden mb-[0.7em]`}
      >
        <MediaRenderer
          media={{ 
            type: "image", 
            src: item.heroImage, 
            alt: item.title 
          }}
          className="absolute inset-0 size-full object-cover  group-hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:blur-[2px]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* 2. Content Branching */}
      {isCaseStudy && caseStudy ? (
        <div className="flex flex-wrap items-start justify-between gap-[0.85em]">
          <div className="space-y-[0.6em]">
            <h3 className=" ">
              {item.title}
            </h3>
            <ul className="flex flex-col gap-[0.24em] list-none p-0">
              {caseStudy.tags.map((tag) => (
                <li 
                  key={tag} 
                  className="font-mono text-xsmall uppercase tracking-tight leading-[100%] text-muted  "
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {/* Rendered visually as a button, but safe inside the main AppLink */}
          <span className="clickable-link">
            See case study →
          </span>
        </div>
      ) : (
        <h3 className="">
          {item.title}
        </h3>
      )}
    </AppLink>
  );
}