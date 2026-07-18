/**
 * content/navigation.ts
 * ---------------------------------------------------------------
 * One list, edited in exactly one place. Every nav surface (Header,
 * MobileNav, Footer) reads from this same array and filters by
 * `contexts` instead of hardcoding its own set of links — add,
 * remove, or reorder a link here and it's correct everywhere at once.
 *
 * Why `contexts` instead of three separate arrays (headerLinks,
 * mobileLinks, footerLinks)? Because "About" being in all three isn't
 * three facts that happen to agree — it's one fact ("About exists,
 * shows in header/mobile/footer") that would otherwise need to be
 * kept in sync by hand across three places every time it changes.
 */

export type NavContext = "header" | "mobile" | "footer";

export interface NavLink {
  href: string;
  label: string;
  contexts: NavContext[];
}

export const navLinks: NavLink[] = [
  { href: "/", label: "Home", contexts: ["mobile", "footer"] },
  { href: "/about", label: "About", contexts: ["header", "mobile", "footer"] },
  { href: "/services", label: "Services", contexts: ["mobile", "footer"] },
  { href: "/works", label: "Works", contexts: ["header", "mobile", "footer"] },
  { href: "/contact", label: "Contact", contexts: ["header", "mobile", "footer"] },
];

/**
 * Header    -> "header"  => About, Works, Contact            (3)
 * MobileNav -> "mobile"  => Home, About, Services, Works, Contact (5)
 * Footer    -> "footer"  => all five
 */
export function getNavLinks(context: NavContext): NavLink[] {
  return navLinks.filter((link) => link.contexts.includes(context));
}
