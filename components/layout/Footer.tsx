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

        <div className="w-[3.9em] pt-[7em] pb-[5em] mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 360 721"><path fill="#f3f4f6" d="M246 401h114v320H246zM0 607h187v114H0zM0 493h114v114H0zM0 0h114v320H0zM173 0h187v114H173zM246 114h114v114H246z"/></svg>
        </div>
      </div>

      <div className=" px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} wailee. — web design & development
        </span>

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <AppLink
              key={link.href}
              href={link.href}
              className="font-mono text-xsm mtext-[clamp(1*16px,((1-((1.25-1)/(128-20)*20))*16px+((1.25-1)/(128-20))*100vw),1.25*16px)] text-[clamp(.95rem,.3283rem+.8765vw,1.7rem)] text-muted hover:text-accent transition-colors"
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
              <Icon className="w-4 h-4" /><div>{label}</div>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
