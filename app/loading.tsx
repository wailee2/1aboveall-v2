/**
 * Segment-level Suspense fallback — this is Next's built-in
 * mechanism, distinct from the custom blue RouteLoadingOverlay (see
 * components/navigation/NavigationProvider.tsx). This one only fires
 * when a segment actually suspends on an async data fetch (relevant
 * once the private dashboard/projects routes exist and fetch real
 * data) — the public pages here are fully static, so this rarely (if
 * ever) shows for them. Kept minimal and consistent with the same
 * spinner used everywhere else.
 */
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner label="Loading" />
    </div>
  );
}
