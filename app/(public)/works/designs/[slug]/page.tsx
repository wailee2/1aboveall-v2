import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItemBySlug, getPublishedByCategory } from "@/content/works-api";
import { DesignCanvasDetail } from "../../components/DesignCanvasDetail";
import type { DesignItem } from "@/content/works-types";

export function generateStaticParams() {
  return getPublishedByCategory("designs").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const item = getItemBySlug("designs", params.slug) as DesignItem | undefined;
  if (!item) return {};
  return {
    title: item.title,
    description: item.shortDescription,
    openGraph: { images: [item.heroImage] },
  };
}

export default function DesignDetailPage({ params }: { params: { slug: string } }) {
  const item = getItemBySlug("designs", params.slug) as DesignItem | undefined;
  if (!item) notFound();
  return <DesignCanvasDetail item={item} bgColor="#C4392E" />;
}
