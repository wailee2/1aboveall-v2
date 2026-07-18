import { AppLink } from "@/components/navigation/AppLink";
import { getNavLinks } from "@/content/navigation";
import { socialLinks } from "@/content/social-links";

// "footer" context => every link, per content/navigation.ts.
const footerLinks = getNavLinks("footer");

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} wailee. — web design & development
        </span>

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <AppLink
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-muted hover:text-accent transition-colors"
            >
              {link.label}
            </AppLink>
          ))}
        </nav>

        <div className="flex gap-4">
          {socialLinks.map(({ slug, label, href, Icon }) => (
            <a
              key={slug}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-muted hover:text-accent transition-colors"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
