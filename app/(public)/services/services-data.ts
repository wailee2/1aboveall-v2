/**
 * Colocated with this route on purpose — this data is ONLY used by
 * the /services page and its ServicesList component, so it lives
 * right next to them instead of in the top-level content/ folder
 * (which is reserved for genuinely cross-page data like projects).
 */
export interface Service {
  slug: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    slug: "web-design",
    title: "Web Design",
    description:
      "Interface and visual design grounded in how people actually use a product, not just how it photographs.",
  },
  {
    slug: "development",
    title: "Development",
    description:
      "Fast, accessible, maintainable front-end and full-stack builds — from a static site to a full application.",
  },
  {
    slug: "branding",
    title: "Branding",
    description:
      "Visual identity systems — color, type, and voice — built to hold together across every surface a brand touches.",
  },
];
