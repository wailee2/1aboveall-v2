import { AppLink } from "@/components/navigation/AppLink";
import Image from "next/image";
import type { WorkItem } from "@/content/works-types";
import HorizontalScroller, { HorizontalContent } from "@/components/ui/HorizontalScroller";
import VerticalScroller, { VerticalContent }  from "@/components/ui/VerticalScroller";

export function RecentsSection({ items }: { items: WorkItem[] }) {
  return (

<section>
  <h3 className="mb-8">Recent</h3>



  <VerticalScroller
       className=""
        panelClassName=""
      >
        <VerticalContent>
          <div className="relative aspect-square bg-green-800 h-full w-full">
            <img
              src="/placeholder-image.png"
              alt="project 1"
              className="h-full w-full object-cover"
            />
            <p className="absolute left-4 bottom-4 text-white text-lg font-bold">
              hey this is project1
            </p>
          </div>
        </VerticalContent>

        <VerticalContent>
          <div className="relative aspect-square bg-amber-400 h-full w-full">
            <img
              src="/placeholder-image.png"
              alt="project 2"
              className="h-full w-full object-cover"
            />
            <p className="absolute left-4 bottom-4 text-white text-lg font-bold">
              hey this is project2
            </p>
          </div>
        </VerticalContent>

        <VerticalContent>
          <div className="relative aspect-square bg-red-700 h-full w-full">
            <img
              src="/placeholder-image.png"
              alt="project 3"
              className="h-full w-full object-cover"
            />
            <p className="absolute left-4 bottom-4 text-white text-lg font-bold">
              hey this is project3
            </p>
          </div>
        </VerticalContent>
      </VerticalScroller>
</section>
  );
}
