"use client";

/**
 * Root-level error boundary — catches errors in the root layout
 * itself (theme/toast/navigation providers, fonts, etc). Because it
 * replaces the ENTIRE page including <html>/<body>, it must render
 * its own minimal html/body shell and cannot depend on anything
 * from the app that might itself be broken.
 */

import { ErrorFallback } from "@/components/feedback/ErrorFallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorFallback error={error} reset={reset} />
      </body>
    </html>
  );
}
