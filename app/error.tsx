"use client";

/**
 * Segment-level error boundary. Catches errors thrown while
 * rendering, in effects, or in event handlers within this segment —
 * everything else on the site (header, footer, other routes) keeps
 * working since this only replaces the failed segment's content.
 */

import { useEffect } from "react";
import { ErrorFallback } from "@/components/feedback/ErrorFallback";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Centralized place to log to a monitoring service later —
    // console.error for now, one call site to upgrade.
    console.error("[route error]", error);
  }, [error]);

  return <ErrorFallback error={error} reset={reset} />;
}
