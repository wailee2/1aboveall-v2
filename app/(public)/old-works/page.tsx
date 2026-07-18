import type { Metadata } from "next";
import { AppLink } from "@/components/navigation/AppLink";
import { workCategories } from "./works-data";

export const metadata: Metadata = {
  title: "Works",
  description: "Redesigns, branding, and full project work.",
};

export default function WorksPage() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20">
      <div className="font-mono text-xs uppercase tracking-wide text-accent mb-3">
        Works
      </div>
      <h1 className="font-sans text-3xl font-semibold tracking-tight text-text mb-12">
        Browse by category
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {workCategories.map((cat) => (
          <AppLink
            key={cat.slug}
            href={`/works/${cat.slug}`}
            className="block border border-border rounded-md p-6 hover:border-accent transition-colors"
          >
            <h2 className="font-sans text-xl font-medium text-text mb-2">{cat.title}</h2>
            <p className="font-serif text-sm text-muted leading-relaxed">{cat.description}</p>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
