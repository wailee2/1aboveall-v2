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
    <footer className="max-w-[1000px] mx-auto px-6 py-16 border-t border-border">
      <AppLink
        href="/works/case-studies"
        className="font-mono text-xs uppercase tracking-wide text-muted hover:text-accent transition-colors block mb-12"
      >
        ← Back to work
      </AppLink>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {prev && (
          <AppLink href={`/works/case-studies/${prev.slug}`} className="group block">
            <div className="font-mono text-[10px] uppercase tracking-wide text-muted mb-3">
              Previous
            </div>
            <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3">
              <Image
                src={prev.heroImage}
                alt={prev.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover group-hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="font-sans text-base font-medium text-text group-hover:text-accent transition-colors">
              {prev.title}
            </div>
          </AppLink>
        )}

        {next && (
          <AppLink href={`/works/case-studies/${next.slug}`} className="group block sm:text-right">
            <div className="font-mono text-[10px] uppercase tracking-wide text-muted mb-3">
              Next
            </div>
            <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3">
              <Image
                src={next.heroImage}
                alt={next.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover group-hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="font-sans text-base font-medium text-text group-hover:text-accent transition-colors">
              {next.title}
            </div>
          </AppLink>
        )}
      </div>
    </footer>
  );
}
