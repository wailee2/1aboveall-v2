import type { Metadata } from "next";
import { getPublishedByCategory } from "@/content/works-api";
import { CaseStudiesGrid } from "../components/CaseStudiesGrid";
import type { CaseStudyItem } from "@/content/works-types";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Deep dives into shipped projects — process, execution, and results.",
};

export default function CaseStudiesPage() {
  const items = getPublishedByCategory("case-studies") as CaseStudyItem[];

  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20">
      <div className="font-mono text-xs uppercase tracking-wide text-accent mb-3">Works</div>
      <h1 className="font-sans text-3xl font-semibold tracking-tight text-text mb-12">Case Studies</h1>
      <CaseStudiesGrid items={items} />
    </section>
  );
}
