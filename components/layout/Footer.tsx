import { AppLink } from "@/components/navigation/AppLink";
import { getNavLinks } from "@/content/navigation";
import { socialLinks } from "@/content/social-links";

// "footer" context => every link, per content/navigation.ts.
const footerLinks = getNavLinks("footer");

export function Footer() {
  return (
    <footer className="bg-accent text-on-accent section-p-x py-[1.5em] ">
      <div className=''>
        <div className="w-full grid grid-cols-2 gap-[1.25em] md:flex md:gap-x-[3em] text-small ">
          <nav 
            aria-label="Footer" 
            className="flex flex-col md:grid grid-flow-col grid-rows-2 gap-x-[3em] gap-y-2"
          >
            {footerLinks.map((link) => (
              <AppLink
                key={link.href}
                href={link.href}
                className=""
              >
                {link.label}
              </AppLink>
            ))}
          </nav>

          <div className="flex flex-col md:grid grid-flow-col grid-rows-2 gap-x-[3em] gap-y-2">
            {socialLinks.map(({ slug, label, href }) => (
              <a
                key={slug}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className=""
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="w-[3.9em] pt-[11em] pb-[8em] mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 360 721"><path fill="#f3f4f6" d="M246 401h114v320H246zM0 607h187v114H0zM0 493h114v114H0zM0 0h114v320H0zM173 0h187v114H173zM246 114h114v114H246z"/></svg>
        </div>

        <div className="flex  justify-between items-center">
          <span className="font-mono text-xsmall">
          © {new Date().getFullYear()} Wailee. — web design & development
          </span>
        </div>
      </div>
    </footer>
  );
}
