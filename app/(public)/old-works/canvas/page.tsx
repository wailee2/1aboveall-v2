import type { Metadata } from "next";
import { getPublishedByCategory } from "@/content/works-api";
import { CanvasGrid } from "../components/CanvasGrid";
import type { CanvasItem } from "@/content/works-types";

export const metadata: Metadata = {
  title: "Canvas",
  description: "Digital art and illustration.",
};

export default function CanvasPage() {
  const items = getPublishedByCategory("canvas") as CanvasItem[];

  return (
    // Locally-scoped dark surface — same technique used elsewhere on
    // the site for a project that deliberately steps outside the
    // shared brand palette. Never touches the global theme; -mx-6
    // bleeds it edge-to-edge past the <main> padding.
    <div className="bg-[#141414]m -mx-6 px-6 py-20 min-h-[70vh]">
      <div className="max-w-[1100px] mx-auto">
        <div className="font-mono text-xs uppercase tracking-wide text-[#8FA98A] mb-3">Works</div>
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-[#F0F0EC] mb-12">
          Canvas
        </h1>
        <CanvasGrid items={items} />
      </div>
    </div>
  );
}
