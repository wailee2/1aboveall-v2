import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItemBySlug, getPublishedByCategory } from "@/content/works-api";
import { DesignCanvasDetail } from "../../components/DesignCanvasDetail";
import type { CanvasItem } from "@/content/works-types";

export function generateStaticParams() {
  return getPublishedByCategory("canvas").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const item = getItemBySlug("canvas", params.slug) as CanvasItem | undefined;
  if (!item) return {};
  return {
    title: item.title,
    description: item.shortDescription,
    openGraph: { images: [item.heroImage] },
  };
}

export default function CanvasDetailPage({ params }: { params: { slug: string } }) {
  const item = getItemBySlug("canvas", params.slug) as CanvasItem | undefined;
  if (!item) notFound();
  return <DesignCanvasDetail item={item} bgColor="#2E6B47" />;
}
