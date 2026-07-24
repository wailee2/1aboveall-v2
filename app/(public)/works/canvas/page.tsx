import type { Metadata } from "next";
import { getPublishedByCategory } from "@/content/works-api";
import { CanvasGrid } from "./CanvasGrid";
import type { CanvasItem } from "@/content/works-types";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Canvas",
  description: "Digital art and illustration.",
};

export default function CanvasPage() {
  const items = getPublishedByCategory("canvas") as CanvasItem[];

  return (
    <div className="section-px page-py ">
      <Breadcrumbs
        items={[
          { label: "Works", href: "/works" },
          { label: "Canvas" },
        ]}
      />

      <h1 className="page_heading">Canvas</h1>

      <CanvasGrid items={items} />
    </div>
  );
}
