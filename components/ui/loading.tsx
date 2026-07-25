import { SkeletonBlock, SkeletonText } from "@/components/ui/Skeleton";

/**
 * Doesn't fire today (works-api.ts reads JSON synchronously, so
 * nothing here suspends), but becomes real the moment works-api.ts's
 * functions turn into async Supabase queries — kept in place now so
 * that migration doesn't also require remembering to add a loading
 * state at that point.
 */
export default function WorksLoading() {
  return (
    <div className="max-w-275 mx-auto px-6 py-20">
      <SkeletonBlock className="h-3 w-24 mb-3" />
      <SkeletonBlock className="h-9 w-64 mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-32" />
        ))}
      </div>
      <SkeletonText lines={2} className="mb-8 max-w-xs" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="aspect-4/3" />
        ))}
      </div>
    </div>
  );
}
