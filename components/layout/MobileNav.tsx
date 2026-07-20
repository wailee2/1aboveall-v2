"use client";

/**
 * components/layout/MobileNav.tsx
 * ---------------------------------------------------------------
 * Reads getNavLinks("mobile") — a DIFFERENT filter of the exact same
 * content/navigation.ts array Header reads with getNavLinks("header").
 * Nothing about mobile's 5 links is hardcoded here; it's a
 * consequence of which links are tagged "mobile" in that one file.
 */

import { useEffect } from "react";
import { AppLink } from "@/components/navigation/AppLink";
import { getNavLinks } from "@/content/navigation";
import { socialLinks } from "@/content/social-links";
import { Theme } from '@/components/theme/Theme'

const mobileLinks = getNavLinks("mobile");

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Lock body scroll while open, and always restore it on close/unmount
  // — the "clean memory/side-effects after use" rule applied here.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-999 bg-red-500 flex flex-col"
    >
      <div className="flex items-center justify-between px-6 py-5">
        <span className="font-sans text-lg font-semibold text-text">
          wailee<span className="text-accent">.</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="font-mono text-xs border border-border rounded-sm px-3 py-2 text-text"
        >
          Close
        </button>
      </div>

      <nav aria-label="Mobile" className="flex flex-col gap-1 px-6 mt-8">
        {mobileLinks.map((link) => (
          <AppLink
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-sans text-2xl font-medium text-text py-3 border-b border-border"
          >
            {link.label}
          </AppLink>
        ))}
      </nav>

      <Theme />

      <div className="mt-auto px-6 py-8 flex gap-5">
        {socialLinks.map(({ slug, label, href, Icon }) => (
          <a
            key={slug}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="text-muted hover:text-accent transition-colors"
          >
            <Icon className="w-5 h-5" />
          </a>
        ))}
      </div>
    </div>
  );
}
