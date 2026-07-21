import { notFound } from "next/navigation";
import { getItemBySlug, getAdjacentItems } from "@/content/works-api";
import { DribbbleModal } from "../../../components/DribbbleModal";
import type { CanvasItem } from "@/content/works-types";

export default function CanvasModal({ params }: { params: { slug: string } }) {
  const item = getItemBySlug("canvas", params.slug) as CanvasItem | undefined;
  if (!item) notFound();

  const { prev, next } = getAdjacentItems("canvas", params.slug);

  return (
    <DribbbleModal
      item={item}
      prev={prev as CanvasItem | undefined}
      next={next as CanvasItem | undefined}
      basePath="/works/canvas"
    />
  );
}
