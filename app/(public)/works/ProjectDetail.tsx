import { AppLink } from "@/components/navigation/AppLink";
import { ImageSkeleton } from "@/components/ui/ImageSkeleton";
import type { Project } from "@/content/projects";

/**
 * components/works/ProjectDetail.tsx
 * ---------------------------------------------------------------
 * Default detail view for a project, rendered by each category's
 * [slug]/page.tsx. This is a fallback, not the final word: a project
 * that deserves a fully bespoke page (per the earlier "unique visual
 * interface" decision) gets its own literal folder instead, e.g.
 *   app/(public)/works/redesigns/my-project/page.tsx
 * Next.js always prefers that literal, more specific route over this
 * [slug] one for the same path — no conflict, no extra config.
 */
export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="max-w-[760px] mx-auto px-6 py-16">
      <AppLink
        href={`/works/${project.category}`}
        className="font-mono text-xs tracking-wide text-muted hover:text-accent transition-colors"
      >
        ← BACK TO {project.category.toUpperCase()}
      </AppLink>

      <div className="mt-8 mb-10">
        <div className="font-mono text-xs tracking-wide text-accent mb-3">{project.year}</div>
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-text mb-4">
          {project.title}
        </h1>
        <ul className="flex flex-wrap gap-2 list-none p-0">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="font-mono text-[10px] uppercase tracking-wide bg-accent-tint text-accent px-2 py-1 rounded-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <ImageSkeleton
        src={project.image}
        alt={project.title}
        width={760}
        height={480}
        className="w-full h-auto rounded-md mb-8 object-cover"
      />

      <p className="font-serif text-lg leading-relaxed text-text/85 max-w-[65ch]">
        {project.summary}
      </p>
    </article>
  );
}
