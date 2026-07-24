import type { Metadata } from "next";
import { WorksCategoryLinks } from "./components/WorksCategoryLinks";
import { RecentsSection } from "./components/RecentsSection";
import { getRecentPublished } from "@/content/works-api";

export const metadata: Metadata = {
  title: "Works",
  description: "Designs, case studies, and canvas — selected and recent work.",
};

export default function WorksPage() {
  const recents = getRecentPublished();

  return (
    <section className="section-px page-py">
      <h1 className="page_heading">Works</h1>
      
      <div className="text-medium  mb-3">Browse by category</div>

      <WorksCategoryLinks />

      <RecentsSection items={recents} />
    </section>
  );
}
