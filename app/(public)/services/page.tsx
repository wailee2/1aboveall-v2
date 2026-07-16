import type { Metadata } from "next";
import { services } from "./services-data";
import { ServicesList } from "./ServicesList";

export const metadata: Metadata = {
  title: "Services",
  description: "Web design, development, and branding services.",
};

export default function ServicesPage() {
  return (
    <section className="max-w-[760px] mx-auto px-6 py-20">
      <div className="font-mono text-xs uppercase tracking-wide text-accent mb-3">
        Services
      </div>
      <h1 className="font-sans text-3xl font-semibold tracking-tight text-text mb-12">
        What I do
      </h1>
      <ServicesList services={services} />
    </section>
  );
}
