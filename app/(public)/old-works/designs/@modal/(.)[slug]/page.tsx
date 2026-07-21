import { notFound } from "next/navigation";
import { getItemBySlug, getAdjacentItems } from "@/content/works-api";
import { DribbbleModal } from "../../../components/DribbbleModal";
import type { DesignItem } from "@/content/works-types";

/**
 * Intercepted route: only rendered when a /works/designs/[slug] link
 * is clicked via soft navigation FROM app/(public)/works/designs/page.tsx
 * (same directory level -> the `(.)` convention). A direct URL visit,
 * a hard refresh, or a shared link instead renders the real
 * [slug]/page.tsx below.
 */
export default function DesignModal({ params }: { params: { slug: string } }) {
  const item = getItemBySlug("designs", params.slug) as DesignItem | undefined;
  if (!item) notFound();

  const { prev, next } = getAdjacentItems("designs", params.slug);

  return (
    <DribbbleModal
      item={item}
      prev={prev as DesignItem | undefined}
      next={next as DesignItem | undefined}
      basePath="/works/designs"
    />
  );
}
