/**
 * components/ui/Skeleton.tsx
 * ---------------------------------------------------------------
 * Generic placeholders for non-media content. Updated to the new
 * `.skeleton-shimmer` class (see skeleton.css) — these two
 * components own their OWN `position: relative` directly via
 * Tailwind's `relative` utility, so there's still exactly one
 * source of truth for position on each element, same rule as
 * MediaRenderer.
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
          className="relative overflow-hidden bg-surface-tint skeleton-shimmer h-4 rounded-sm"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-surface-tint skeleton-shimmer rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}
