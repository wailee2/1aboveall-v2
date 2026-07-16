"use client";

/**
 * components/feedback/ErrorFallback.tsx
 * ---------------------------------------------------------------
 * The one error UI used everywhere something breaks — app/error.tsx,
 * app/global-error.tsx, and any manual try/catch fallback in a
 * component all render THIS, so an error looks and reads the same
 * regardless of where it happened. Never crashes the app further:
 * no data access that could itself throw, no dependency on the
 * context that just failed.
 */

import { IS_DEV } from "@/lib/env";

export function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <div
      role="alert"
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
    >
      <div className="font-mono text-xs uppercase tracking-wide text-accent mb-3">
        Something went wrong
      </div>
      <h1 className="font-sans text-2xl font-semibold text-text mb-3 max-w-md">
        This page hit a snag on our end.
      </h1>
      <p className="font-serif text-base text-muted mb-8 max-w-md">
        Nothing you did caused this, and the rest of the site is unaffected —
        try again, or head back home.
      </p>

      {IS_DEV && (
        <pre className="text-left text-xs bg-surface-tint border border-border rounded-md p-4 mb-8 max-w-lg overflow-auto text-muted">
          {error.message}
          {error.digest ? `\n\ndigest: ${error.digest}` : ""}
        </pre>
      )}

      <div className="flex gap-3">
        {reset && (
          <button
            type="button"
            onClick={reset}
            className="font-sans text-sm font-medium bg-accent text-on-accent hover:bg-accent-hover px-5 py-2.5 rounded-sm transition-colors"
          >
            Try again
          </button>
        )}
        <a
          href="/"
          className="font-sans text-sm font-medium border border-border text-text hover:border-accent hover:text-accent px-5 py-2.5 rounded-sm transition-colors"
        >
          Back home
        </a>
      </div>
    </div>
  );
}
