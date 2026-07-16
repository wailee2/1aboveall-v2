import type { Service } from "./services-data";

export function ServicesList({ services }: { services: Service[] }) {
  return (
    <div className="flex flex-col">
      {services.map((service) => (
        <div key={service.slug} className="py-8 border-b border-border">
          <h2 className="font-sans text-xl font-medium text-text mb-2">
            {service.title}
          </h2>
          <p className="font-serif text-base text-muted leading-relaxed max-w-[60ch]">
            {service.description}
          </p>
        </div>
      ))}
    </div>
  );
}
