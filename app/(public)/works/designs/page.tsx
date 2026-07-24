import type { Metadata } from "next";
import { getPublishedByCategory } from "@/content/works-api";
import { DesignsGrid } from "./DesignsGrid";
import type { DesignItem } from "@/content/works-types";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Designs",
  description: "UI/UX design work — interface explorations and concepts.",
};

export default function DesignsPage() {
  const items = getPublishedByCategory("designs") as DesignItem[];

  return (
    <div className="section-px page-py">
      <Breadcrumbs 
        items={[
          { label: "Works", href: "/works" }, 
          { label: "Designs" }]}
      />

      <h1 className="page_heading ">Designs</h1>

      <DesignsGrid items={items} />
    </div>
  );
}
