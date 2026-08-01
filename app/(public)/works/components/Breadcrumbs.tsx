import { AppLink } from "@/components/navigation/AppLink";

/**
 * app/(public)/works/components/Breadcrumbs.tsx
 * ---------------------------------------------------------------
 * Used across every Works surface — category grids and individual
 * project pages alike. The last item in `items` is treated as the
 * current page: rendered as plain text with aria-current="page",
 * not a link, even if it happens to have an href.
 *
 * textColor/mutedColor are optional overrides for the Designs/Canvas
 * detail pages, which sit on custom red/green backgrounds — the
 * default theme tokens (text-text/text-muted) would have poor
 * contrast there, so those pages pass their own colors through
 * rather than relying on the class defaults.
 *
 * Emits BreadcrumbList JSON-LD alongside the visible trail — this is
 * what lets Google show the breadcrumb path directly in search
 * results instead of just a bare URL.
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  textColor,
  mutedColor,
}: {
  items: BreadcrumbItem[];
  textColor?: string;
  mutedColor?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-[1.5em]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-2 text-xsmall list-none p-0 m-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const linkColorClass = mutedColor ? "" : "text-muted hover:text-text";
          const currentColorClass = textColor ? "" : "text-text";
          const otherColorClass = mutedColor ? "" : "text-muted";

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <AppLink
                  href={item.href}
                  className={`transition-colors ${linkColorClass}`}
                >
                  {item.label}
                </AppLink>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? currentColorClass : otherColorClass}
                  style={{ color: isLast ? textColor : mutedColor }}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className={otherColorClass} style={mutedColor ? { color: mutedColor } : undefined}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
