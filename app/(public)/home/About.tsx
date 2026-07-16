import { AppLink } from "@/components/navigation/AppLink";
import Link from "next/dist/client/link";

export function About() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-text">
          About
        </h2>
        <div>
          <p className="font-serif text-lg leading-relaxed text-muted max-w-[60ch] mb-6">
            I'm a freelance web designer and developer working across
            full-stack builds, UI/UX design, and the occasional data-heavy
            project — the full about page has the longer version.
          </p>
          <AppLink
            href="/about"
            className="font-mono text-xs uppercase tracking-wide text-accent hover:text-accent-hover transition-colors"
          >
            Read more →
          </AppLink>
          <Link
            href="/about"
            className="font-mono text-xs uppercase tracking-wide text-accent hover:text-accent-hover transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </section>
  );
}
