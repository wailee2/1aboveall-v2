import { notFound } from "next/navigation";
import { getItemBySlug, getAdjacentItems } from "@/content/works-api";
import { DribbbleModal } from "../../../components/DribbbleModal";
import type { CanvasItem } from "@/content/works-types";

export default async function CanvasModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug("canvas", slug) as CanvasItem | undefined;
  if (!item) notFound();

  const { prev, next } = getAdjacentItems("canvas", slug);

  return (
    <DribbbleModal
      item={item}
      prev={prev as CanvasItem | undefined}
      next={next as CanvasItem | undefined}
      basePath="/works/canvas"
    />
  );
}
