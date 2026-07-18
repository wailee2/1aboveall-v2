import { AppLink } from "@/components/navigation/AppLink";
import { ImageSkeleton } from "@/components/ui/ImageSkeleton";
import { getSelectedWorks } from "@/content/projects";

/**
 * Reads only projects tagged "selected-work" from the single global
 * registry (content/projects.ts). To change what shows here, tag or
 * untag a project there — nothing in this component ever needs to
 * change.
 */
export function SelectedWorks() {
  const works = getSelectedWorks();

  return (
    <section className="section-p-x py-20 border-t border-border">
      <div className="flex items-baseline justify-between mb-12">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-text">
          Selected Works
        </h2>
        <AppLink
          href="/works"
          className="font-mono text-xs uppercase tracking-wide text-accent hover:text-accent-hover transition-colors"
        >
          View all →
        </AppLink>
      </div>

      {works.length === 0 ? (
        <p className="font-serif text-base text-muted">
          New work is on the way — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((project) => (
            <AppLink key={project.slug} href={`/works/${project.category}/${project.slug}`}>
              <ImageSkeleton
                src={project.image}
                alt={project.title}
                width={400}
                height={300}
                className="w-full h-auto rounded-md mb-3 object-cover"
              />
              <h3 className="font-sans text-base font-medium text-text">{project.title}</h3>
              <p className="font-serif text-sm text-muted">{project.summary}</p>
            </AppLink>
          ))}
        </div>
      )}
    </section>
  );
}
