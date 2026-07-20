import type { CaseStudyItem } from "@/content/works-types";

export function CaseStudyBrief({ item }: { item: CaseStudyItem }) {
  return (
    <section className="max-w-[760px] mx-auto px-6 py-16 border-t border-border">
      {item.pullQuote && (
        <blockquote className="font-serif text-2xl leading-snug text-text italic mb-14 max-w-[50ch]">
          “{item.pullQuote}”
        </blockquote>
      )}

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-muted mb-2">Client</dt>
          <dd className="font-sans text-base text-text">{item.client}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-muted mb-2">Services</dt>
          <dd>
            <ul className="list-disc list-inside font-sans text-base text-text">
              {item.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <div className="mb-8">
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted mb-2">Context</h2>
        <p className="font-serif text-lg leading-relaxed text-text/85">{item.context}</p>
      </div>

      <div className="mb-8">
        <h2 className="font-mono text-xs uppercase tracking-wide text-muted mb-2">Objective</h2>
        <p className="font-serif text-lg leading-relaxed text-text/85">{item.objective}</p>
      </div>

      {item.credits && (
        <p className="font-mono text-xs text-muted">{item.credits}</p>
      )}
    </section>
  );
}
