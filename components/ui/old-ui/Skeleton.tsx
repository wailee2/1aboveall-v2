/**
 * components/ui/Skeleton.tsx
 * ---------------------------------------------------------------
 * Generic placeholders for anything that isn't media (which already
 * has its own loading state inside MediaRenderer). Reuses the same
 * `.skeleton-image` / `.skeleton-image-shimmer` shimmer classes from
 * skeleton.css — the names are historical (written for images
 * first) but the shimmer effect itself is generic, so reusing it
 * here keeps loading states visually consistent everywhere rather
 * than introducing a second shimmer animation.
 *
 * Used today mostly by loading.tsx fallbacks (see the works route
 * segments) — genuinely useful once project data is an async
 * Supabase fetch rather than a synchronous JSON import.
 */
import "./skeleton.css";

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-image skeleton-image-shimmer h-4 rounded-sm"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`skeleton-image skeleton-image-shimmer rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}
