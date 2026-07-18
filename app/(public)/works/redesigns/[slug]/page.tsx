import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectsByCategory } from "@/content/projects";
import { ProjectDetail } from "@/app/(public)/works/ProjectDetail";

export function generateStaticParams() {
  return getProjectsByCategory("redesigns").map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getProjectsByCategory("redesigns").find((p) => p.slug === params.slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default function RedesignsDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectsByCategory("redesigns").find((p) => p.slug === params.slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
