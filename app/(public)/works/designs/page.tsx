import type { Metadata } from "next";
import { getPublishedByCategory } from "@/content/works-api";
import { DesignsGrid } from "../components/DesignsGrid";
import type { DesignItem } from "@/content/works-types";

export const metadata: Metadata = {
  title: "Designs",
  description: "UI/UX design work — interface explorations and concepts.",
};

export default function DesignsPage() {
  const items = getPublishedByCategory("designs") as DesignItem[];

  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20">
      <div className="font-mono text-xs uppercase tracking-wide text-accent mb-3">Works</div>
      <h1 className="font-sans text-3xl font-semibold tracking-tight text-text mb-12">Designs</h1>
      <DesignsGrid items={items} />
    </section>
  );
}
