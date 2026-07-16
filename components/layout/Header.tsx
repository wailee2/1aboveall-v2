"use client";

import { AppLink } from "@/components/navigation/AppLink";
import { useTheme } from "@/contexts/ThemeContext";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { useToast } from "@/components/toast/ToastProvider";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/works", label: "Works" },
];

export function Header() {
  const { preference, setPreference } = useTheme();
  const { showToast } = useToast();
  const { isLimited, trigger } = useRateLimit(3000);

  const handleResumeDownload = () => {
    trigger(() => {
      window.location.href = "/api/resume";
      showToast("Preparing your download…", "info");
    });
  };

  return (
    <header className="flex items-center justify-between px-6 py-5 max-w-[1100px] mx-auto">
      <Link href="/" className="font-sans text-lg font-semibold text-text">
        wailee<span className="text-accent">.</span>
      </Link>

      <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <AppLink
            key={link.href}
            href={link.href}
            className="font-sans text-sm text-muted hover:text-text transition-colors"
          >
            {link.label}
          </AppLink>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            setPreference(
              preference === "light"
                ? "dark"
                : preference === "dark"
                  ? "system"
                  : "light"
            )
          }
          className="font-mono text-xs border border-border rounded-sm px-3 py-1.5 text-muted hover:text-accent hover:border-accent transition-colors"
          aria-label={`Theme: ${preference}. Click to change.`}
        >
          {preference}
        </button>

        <button
          type="button"
          onClick={handleResumeDownload}
          disabled={isLimited}
          className="font-sans text-sm font-medium bg-accent text-on-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-sm transition-colors"
        >
          Resume
        </button>
      </div>
    </header>
  );
}
