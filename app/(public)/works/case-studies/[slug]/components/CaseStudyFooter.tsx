import { AppLink } from "@/components/navigation/AppLink";
import Image from "next/image";
import type { CaseStudyItem } from "@/content/works-types";

/**
 * Traditional navigation, not the modal used by Designs/Canvas — so
 * this is just links with thumbnails, no keyboard nav or Esc button.
 * Uses `heroImage` (always a plain static image) for both previews,
 * even for a case study whose actual hero is a video.
 */
export function CaseStudyFooter({
  prev,
  next,
}: {
  prev?: CaseStudyItem;
  next?: CaseStudyItem;
}) {
  return (
    <section className=" section-px space-y-[2em] ">
      <div className="space-y-[0.35em] sm:flex-between ">
        <h2 className="text-2xlarge ">EXPLORE MORE</h2>

        <AppLink
          href="/works"
          className="clickable-link inline-block text-xsmall"
        >
          see all works
        </AppLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[1.25em] gap-y-[1.35em]">
        {prev && (
          <AppLink 
            href={`/works/case-studies/${prev.slug}`} 
            className="group block space-y-[0.3em]"
          >
            <div className="relative aspect-16/10 overflow-hidden">
              <Image
                src={prev.heroImage}
                alt={prev.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover group-hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="">
              {prev.title}
            </div>
          </AppLink>
        )}

        {next && (
          <AppLink 
            href={`/works/case-studies/${next.slug}`} 
            className="group block space-y-[0.3em] "
          >
            <div className="relative aspect-16/10  overflow-hidden ">
              <Image
                src={next.heroImage}
                alt={next.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover group-hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="">
              {next.title}
            </div>
          </AppLink>
        )}
      </div>
    </section>
  );
}
