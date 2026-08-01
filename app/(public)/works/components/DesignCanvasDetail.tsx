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

        <div className="mb-[2em] ">
          <h1 className=" case_h1">{item.title}</h1>
        </div>

        <div className="flex flex-col-reverse gap-[2em] md:grid grid-cols-12 md:gap-[1.25em] relative uppercase mix-blend-difference">
          <div className="col-start-1 col-span-2 grid grid-cols-2 gap-[1.25em] md:space-y-[3em] md:block h-fit md:absolute bottom-0 lg:bottom-1/2 leading-none z-10  ">
            <div className=" info-case">
              <span className="case_h2 ">date</span>
              <time
                dateTime={item.publishedDate}
                className=""
              >
                {publishedLabel}
              </time>
            </div>
          </div>

          <div className='col-start-3 col-span-full'>
            <div className=" relative aspect-video overflow-hidden">
              <LightboxTrigger 
                media={item.heroMedia}
                className="absolute inset-0" 
                sizes="90vw" priority
              />
            </div>
          </div>
        </div>

        <div className="mt-[5em] space-y-[5em]  ">
          <div className=" gap-[.75em] flex flex-col  lg:grid-main-case">
            <h2 className="case_h2 col-start-1 col-span-2 ">Description</h2>
            <p className="col-start-3 col-span-6">{item.shortDescription}</p>
          </div>

          <div className="lg:grid grid-cols-12 gap-x-[1.25em] space-y-[5em]">
            {item.otherMedia && item.otherMedia.length > 0 && (
              <div className="col-start-2 col-span-10 flex flex-col gap-y-[5em] ">
                {item.otherMedia.map((media, i) => (
                  <LightboxTrigger 
                    key={i}
                    media={media} 
                    mode="intrinsic"
                    className="size-full" 
                    sizes="90vw"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
