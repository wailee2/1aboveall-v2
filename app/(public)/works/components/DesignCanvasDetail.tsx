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

        <div className="lg:grid grid-cols-12 gap-x-[1.25em]">
          <div className="col-start-2 col-span-full space-y-[0.25em] mb-[2.5em]">
            <h1 className="big-words  ">{item.title}</h1>

            <time
              dateTime={item.publishedDate}
              className="text-xsmall uppercase  block"
            >
              {publishedLabel}
            </time>
          </div>
        </div>

        <div className="lg:grid grid-cols-12 gap-x-[1.25em] space-y-[5em]  ">
          <div className="col-start-2 col-span-10 ">
            <LightboxTrigger 
              media={item.heroMedia} 
              mode="intrinsic"
              className="w-full h-full overflow-hidden" 
              sizes="90vw" priority
            />
          </div>

          <div className="col-start-2 col-span-6">
            <p className="">{item.shortDescription}</p>
          </div>

          {item.otherMedia && item.otherMedia.length > 0 && (
            <div className="col-start-2 col-span-10 flex flex-col gap-y-[5em] ">
              {item.otherMedia.map((media, i) => (
                <div  className="">
                  <LightboxTrigger 
                    key={i}
                    media={media} 
                    mode="intrinsic"
                    className="w-full h-full overflow-hidden" 
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
