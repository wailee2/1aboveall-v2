import { AppLink } from "@/components/navigation/AppLink";

const CATEGORIES = [
  { slug: "designs", title: "Designs", description: "UI/UX design work." },
  { slug: "case-studies", title: "Case Studies", description: "Deep dives into shipped projects." },
  { slug: "canvas", title: "Canvas", description: "Digital art and illustration." },
] as const;

export function WorksCategoryLinks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
      {CATEGORIES.map((cat) => (
        <AppLink
          key={cat.slug}
          href={`/works/${cat.slug}`}
          className="block border border-border rounded-md p-6 hover:border-accent transition-colors"
        >
          <h3 className="font-sans text-xl font-medium text-text mb-2">{cat.title}</h3>
          <p className="font-serif text-sm text-muted leading-relaxed">{cat.description}</p>
        </AppLink>
      ))}
    </div>
  );
}
