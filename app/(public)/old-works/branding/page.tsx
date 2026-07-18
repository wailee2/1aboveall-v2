import type { Metadata } from "next";
import { getProjectsByCategory } from "@/content/projects";
import { CategoryPageContent } from "@/components/works/CategoryPageContent";

export const metadata: Metadata = {
  title: "Branding",
  description: "Visual identity and brand systems.",
};

export default function BrandingPage() {
  return <CategoryPageContent title="Branding" projects={getProjectsByCategory("branding")} />;
}
