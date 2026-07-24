import type { Metadata } from "next";
import { getPublishedByCategory } from "@/content/works-api";
import { CaseStudiesGrid } from "./CaseStudiesGrid";
import { Breadcrumbs } from "../components/Breadcrumbs";
import type { CaseStudyItem } from "@/content/works-types";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Deep dives into shipped projects — process, execution, and results.",
};

export default function CaseStudiesPage() {
  const items = getPublishedByCategory("case-studies") as CaseStudyItem[];

  return (
    <div className="section-px section-py">
      <Breadcrumbs 
        items={[
          { label: "Works", href: "/works" }, 
          { label: "Case Studies" }]} 
      />

      <h1 className="page_heading">Case Studies</h1>

      <CaseStudiesGrid items={items} />
    </div>
  );
}
