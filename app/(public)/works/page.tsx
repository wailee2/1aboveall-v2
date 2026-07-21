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
    <section className="max-w-275 mx-auto px-6 py-20">
      <div className="font-mono text-xs uppercase tracking-wide text-accent mb-3">Works</div>
      <h1 className="font-sans text-3xl font-semibold tracking-tight text-text mb-12">
        Browse by category
      </h1>

      <WorksCategoryLinks />
      <RecentsSection items={recents} />
    </section>
  );
}
