import { LightboxTrigger } from "@/components/ui/LightboxTrigger";
import { Breadcrumbs } from "./Breadcrumbs";
import { CATEGORY_LABELS } from "@/content/works-config";
import type { DesignItem, CanvasItem } from "@/content/works-types";

/**
 * app/(public)/works/components/DesignCanvasDetail.tsx
 * ---------------------------------------------------------------
 * Designs and Canvas sub-item pages share this exact layout — the
 * two categories are "similar" per the brief, differing only in
 * background color (red for Designs, green for Canvas).
 *
 * Hero and otherMedia images now go through LightboxTrigger instead
 * of MediaRenderer directly, so clicking any image here opens the
 * same natural-size zoom/pan lightbox used inside the Dribbble modal.
 */
export function DesignCanvasDetail({
  item,
  bgColor,
  textColor = "#FAF9F5",
  mutedColor = "rgba(250, 249, 245, 0.7)",
}: {
  item: DesignItem | CanvasItem;
  bgColor: string;
  textColor?: string;
  mutedColor?: string;
}) {
  const publishedLabel = new Date(item.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="section-px page-py">
      <div className="">
        <Breadcrumbs
          items={[
            { label: "Works", href: "/works" },
            { label: CATEGORY_LABELS[item.category], href: `/works/${item.category}` },
            { label: item.title },
          ]}
        />

        <div className=" space-y-[0.25em] mb-[2.5em]">
          <h1 className="big-words  ">{item.title}</h1>

          <time
            dateTime={item.publishedDate}
            className="text-xsmall uppercase  block"
          >
            {publishedLabel}
          </time>
        </div>

        <div className="flex flex-col gap-[5em]">
          <div className=" relative aspect-4/3 overflow-hidden ">
            <LightboxTrigger 
              media={item.heroMedia} 
              className="absolute inset-0" 
              sizes="80vw" priority
            />
          </div>

          <p className="">
            {item.shortDescription}
          </p>

          {item.otherMedia && item.otherMedia.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item.otherMedia.map((media, i) => (
                <div key={i} className="relative aspect-4/3 rounded-sm overflow-hidden">
                  <LightboxTrigger media={media} className="absolute inset-0" sizes="(max-width: 640px) 100vw, 50vw" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
