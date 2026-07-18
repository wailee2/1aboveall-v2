import type { Metadata } from "next";
import { getProjectsByCategory } from "@/content/projects";
import { CategoryPageContent } from "@/components/works/CategoryPageContent";

export const metadata: Metadata = {
  title: "Redesigns",
  description: "Ground-up redesigns of existing products and sites.",
};

export default function RedesignsPage() {
  return <CategoryPageContent title="Redesigns" projects={getProjectsByCategory("redesigns")} />;
}
