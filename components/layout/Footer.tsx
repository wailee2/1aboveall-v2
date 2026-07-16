import { AppLink } from "@/components/navigation/AppLink";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} wailee. — web design & development
        </span>
        <nav aria-label="Footer" className="flex gap-6">
          <AppLink href="/about" className="font-mono text-xs text-muted hover:text-accent transition-colors">
            About
          </AppLink>
          <AppLink href="/services" className="font-mono text-xs text-muted hover:text-accent transition-colors">
            Services
          </AppLink>
          <AppLink href="/works" className="font-mono text-xs text-muted hover:text-accent transition-colors">
            Works
          </AppLink>
        </nav>
      </div>
    </footer>
  );
}
