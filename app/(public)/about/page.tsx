import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About wailee — freelance web designer and developer.",
};

export default function AboutPage() {
  return (
    <section className="section-p-x py-20">
      <div className="font-mono text-xs uppercase tracking-wide text-accent mb-3">
        About
      </div>
      <h1 className="font-sans text-3xl font-semibold tracking-tight text-text mb-8">
        Hi, I'm Wailee.
      </h1>
      <p className="font-serif text-lg leading-relaxed text-text/85 mb-6 max-w-[65ch]">
        I'm a freelance web designer and developer working across full-stack
        builds, UI/UX design, and the occasional data-heavy project — I care
        as much about how a product feels to use as how well it's engineered
        underneath.
      </p>
      <p className="font-serif text-lg leading-relaxed text-text/85 max-w-[65ch]">
        This page is intentionally short for now — more will land here as
        the rest of the site grows.
      </p>
    </section>
  );
}
