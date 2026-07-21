import { notFound } from "next/navigation";
import { getItemBySlug, getAdjacentItems } from "@/content/works-api";
import { DribbbleModal } from "../../../components/DribbbleModal";
import type { DesignItem } from "@/content/works-types";

export default async function DesignModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug("designs", slug) as DesignItem | undefined;
  if (!item) notFound();

  const { prev, next } = getAdjacentItems("designs", slug);

  return (
    <DribbbleModal
      item={item}
      prev={prev as DesignItem | undefined}
      next={next as DesignItem | undefined}
      basePath="/works/designs"
    />
  );
}
