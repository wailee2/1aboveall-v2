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
    <section className="section-p-x py-[7em]">
      <h2 className="font-mono text-xs uppercase tracking-wide text-accent mb-3">Works</h2>
      <h1 className="font-sans text-3xl font-semibold tracking-tight text-text mb-12">Designs</h1>

      <h1></h1>

      <h2>Works &gt; Designs</h2>
      <DesignsGrid items={items} />
    </section>
  );
}
