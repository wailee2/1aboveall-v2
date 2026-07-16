/**
 * content/projects.ts
 * ---------------------------------------------------------------
 * The single global registry of work. Add a project ONCE here and
 * it automatically appears everywhere it should:
 *
 *  - Home page "Selected Works" section reads projects with
 *    tags including "selected-work" (see components/home/SelectedWorks.tsx)
 *  - /works/[category] pages read projects matching that category
 *
 * There is deliberately no per-page duplication of this data —
 * this file is the only place project metadata is authored.
 */

export type ProjectCategory = "redesigns" | "branding" | "projects";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  category: ProjectCategory;
  tags: string[];
  year: string;
  image: string;
}

export const projects: Project[] = [
  // Replace these with your newer projects — old ones intentionally
  // left out for now per current instructions.
];

export function getSelectedWorks(): Project[] {
  return projects.filter((p) => p.tags.includes("selected-work"));
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === category);
}
