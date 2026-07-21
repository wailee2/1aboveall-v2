import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getItemBySlug,
  getPublishedByCategory,
  getAdjacentItems,
} from "@/content/works-api";
import { CaseStudyHero } from "../../components/CaseStudyHero";
import { CaseStudyBrief } from "../../components/CaseStudyBrief";
import { CaseStudySectionBlock } from "../../components/CaseStudySectionBlock";
import { CaseStudyResult } from "../../components/CaseStudyResult";
import { CaseStudyFooter } from "../../components/CaseStudyFooter";
import type { CaseStudyItem } from "@/content/works-types";

export function generateStaticParams() {
  return getPublishedByCategory("case-studies").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getItemBySlug("case-studies", slug) as CaseStudyItem | undefined;
  if (!item) return {};

  return {
    title: item.title,
    description: item.tagline,
    openGraph: {
      title: item.title,
      description: item.tagline,
      images: [item.heroImage],
      type: "article",
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug("case-studies", slug) as CaseStudyItem | undefined;
  if (!item) notFound();

  const { prev, next } = getAdjacentItems("case-studies", slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.tagline,
    image: item.heroImage,
    datePublished: item.publishedDate,
    creator: { "@type": "Person", name: "Wailee" },
  };

  return (
    <article>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CaseStudyHero item={item} />
      <CaseStudyBrief item={item} />
      {item.sections.map((section) => (
        <CaseStudySectionBlock key={section.title} section={section} />
      ))}
      <CaseStudyResult item={item} />
      <CaseStudyFooter prev={prev as CaseStudyItem | undefined} next={next as CaseStudyItem | undefined} />
    </article>
  );
}
