/**
 * content/social-links.ts
 * ---------------------------------------------------------------
 * Same single-source-of-truth pattern as content/navigation.ts. Any
 * surface that needs social links (currently just Footer, but
 * MobileNav could reuse it too) imports this one array — the icon
 * component reference travels with the data, so a consumer never
 * needs its own if/else mapping slug -> icon.
 */

import type { ComponentType, SVGProps } from "react";
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
  InstagramIcon,
} from "@/components/icons/SocialIcons";

export interface SocialLink {
  slug: string;
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const socialLinks: SocialLink[] = [
  // TODO: replace with your real profile URLs
  { slug: "github", label: "GitHub", href: "https://github.com/yourusername", Icon: GithubIcon },
  { slug: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/yourusername", Icon: LinkedinIcon },
  { slug: "x", label: "X (Twitter)", href: "https://x.com/yourusername", Icon: XIcon },
  { slug: "instagram", label: "Instagram", href: "https://instagram.com/yourusername", Icon: InstagramIcon },
];


/*usage
*
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
              <Icon className="w-4 h-4" /><div>{label}</div>
            </a>
          ))}
        </div>
*/