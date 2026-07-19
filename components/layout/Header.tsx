"use client";

import { useState } from "react";
import { AppLink } from "@/components/navigation/AppLink";
import { Theme } from '@/components/theme/Theme'
import { useRateLimit } from "@/hooks/use-rate-limit";
import { useToast } from "@/components/toast/ToastProvider";
import { getNavLinks } from "@/content/navigation";
import { MobileNav } from "./MobileNav";

const headerLinks = getNavLinks("header");

export function Header() {
  const { showToast } = useToast();
  const { isLimited, trigger } = useRateLimit(3000);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleResumeDownload = () => {
    trigger(() => {
      window.location.href = "/api/resume";
      showToast("Preparing your download…", "info");
    });
  };

  return (
    <header className="flex-center">
      <div className="section-p-x fixed w-full flex-center  z-998 top-0 ">
        <AppLink href="/" className="font-sans text-lg font-medium text-accent  ">
          wailee
        </AppLink>

        <div className=" z-999 flex items-center gap-3">
          <Theme />

          <button
            type="button"
            onClick={handleResumeDownload}
            disabled={isLimited}
            className="font-sans text-sm font-medium bg-accent text-on-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-sm transition-colors "
          >
            Resume
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden font-mono text-xs border border-border rounded-sm px-3 py-2 text-text"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            Menu
          </button>
        </div>
      </div>

      <div className="section-p-x py-2  fixed top-0 right-50 z-999 bg-transparentf  mix-blend-difference text-bg hiddenn md:flex items-center gap-8 ">
        <nav aria-label="Primary" className="hiddend md:flex items-center gap-8 transition-colors duration-300">
          {headerLinks.map((link) => (
            <AppLink
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-mutedm hover:text-text transition-colors"
            >
              {link.label}
            </AppLink>
          ))}
        </nav>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
