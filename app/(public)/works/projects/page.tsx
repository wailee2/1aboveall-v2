import type { Metadata } from "next";
import { getProjectsByCategory } from "@/content/projects";
import { CategoryPageContent } from "@/components/works/CategoryPageContent";

export const metadata: Metadata = {
  title: "Projects",
  description: "Full builds — product and full-stack work.",
};

export default function ProjectsPage() {
  return <CategoryPageContent title="Projects" projects={getProjectsByCategory("projects")} />;
}
