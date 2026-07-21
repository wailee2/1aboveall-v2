import { SkeletonBlock, SkeletonText } from "@/components/ui/Skeleton";

/**
 * Suspense fallback for SelectedWorks (see components/home/SelectedWorks.tsx).
 * Doesn't fire today — getSelectedPublished() reads JSON synchronously,
 * so nothing suspends — but wired now so the moment works-api.ts
 * becomes an async Supabase call, this shows automatically with no
 * follow-up work needed. Same reasoning as app/(public)/works/loading.tsx.
 */
export function SelectedWorksSkeleton() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20 border-t border-border">
      <SkeletonBlock className="h-8 w-48 mb-12" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-start-1 col-span-4">
          <SkeletonBlock className="aspect-[4/3] mb-3" />
          <SkeletonText lines={1} className="w-2/3" />
        </div>
        <div className="col-start-7 col-span-6">
          <SkeletonBlock className="aspect-video mb-3" />
          <SkeletonText lines={2} className="w-1/2" />
        </div>
      </div>
    </section>
  );
}
