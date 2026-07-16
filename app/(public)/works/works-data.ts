/**
 * Colocated with /works — just the category-card metadata for the
 * index page. Actual project content lives in the global
 * content/projects.ts registry, not here.
 */
export interface WorkCategoryCard {
  slug: "redesigns" | "branding" | "projects";
  title: string;
  description: string;
}

export const workCategories: WorkCategoryCard[] = [
  { slug: "redesigns", title: "Redesigns", description: "Ground-up redesigns of existing products and sites." },
  { slug: "branding", title: "Branding", description: "Visual identity and brand systems." },
  { slug: "projects", title: "Projects", description: "Full builds — product and full-stack work." },
];
