"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import "@/components/ui/loading.css";

/**
 * Blue background + rotating circle, shown for the (usually brief)
 * gap between clicking a link and the new route rendering. See
 * NavigationProvider for how its visibility is driven.
 */
export function RouteLoadingOverlay() {
  return (
    <div className="loading-overlay loading-overlay-route" aria-hidden="true">
      <LoadingSpinner label="Loading page" />
    </div>
  );
}
