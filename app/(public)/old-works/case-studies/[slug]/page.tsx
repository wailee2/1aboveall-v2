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
  params: { slug: string };
}): Promise<Metadata> {
  const item = getItemBySlug("case-studies", params.slug) as CaseStudyItem | undefined;
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

export default function CaseStudyDetailPage({ params }: { params: { slug: string } }) {
  const item = getItemBySlug("case-studies", params.slug) as CaseStudyItem | undefined;
  if (!item) notFound();

  const { prev, next } = getAdjacentItems("case-studies", params.slug);

  // Structured data so the project is independently discoverable and
  // well-represented in Google search results, per the requirement
  // that each project be searchable on its own.
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
