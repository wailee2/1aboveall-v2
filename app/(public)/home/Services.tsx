const SERVICES = [
  { title: "Web Design", description: "Interfaces designed around how people actually use them." },
  { title: "Development", description: "Fast, accessible, maintainable front-end and full-stack builds." },
  { title: "Branding", description: "Visual identity systems that hold up across every surface." },
];

export function Services() {
  return (
    <section className="section-p-xpy-20 border-t border-border">
      <h2 className="font-sans text-2xl font-semibold tracking-tight text-text mb-12">
        Services
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {SERVICES.map((service) => (
          <div key={service.title}>
            <h3 className="font-sans text-lg font-medium text-text mb-2">{service.title}</h3>
            <p className="font-serif text-sm text-muted leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
