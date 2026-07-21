/**
 * content/works-api.ts
 * ---------------------------------------------------------------
 * THE MIGRATION SEAM.
 *
 * Every function here is written the way it will need to look once
 * it's querying Supabase instead of importing JSON — pages and
 * components already call these functions without knowing where the
 * data physically lives. When Supabase is wired up:
 *
 *   - these functions become `async` (add `await`)
 *   - the JSON imports become `supabase.from('works').select()...`
 *   - RECENT_PROJECTS_COUNT moves into a query `.limit()` sourced
 *     from a settings table instead of a constant
 *
 * No page, no component, no JSON file's *shape* needs to change —
 * only this file's internals. That's the whole point of routing
 * every read through here instead of importing the JSON directly
 * from a page.
 */

import designsData from "./data/designs.json";
import canvasData from "./data/canvas.json";
import caseStudiesData from "./data/case-studies.json";
import { RECENT_PROJECTS_COUNT } from "./works-config";
import type {
  WorkItem,
  WorksCategory,
  DesignItem,
  CanvasItem,
  CaseStudyItem,
} from "./works-types";

const designs = designsData as DesignItem[];
const canvas = canvasData as CanvasItem[];
const caseStudies = caseStudiesData as CaseStudyItem[];

const byCategory: Record<WorksCategory, WorkItem[]> = {
  designs,
  canvas,
  "case-studies": caseStudies,
};

function onlyPublished(items: WorkItem[]): WorkItem[] {
  return items.filter((item) => item.status === "published");
}

/** All items in a category, regardless of status — for future admin/dashboard use. */
export function getCategoryItems(category: WorksCategory): WorkItem[] {
  return byCategory[category];
}

/** Published-only items in a category — what every public page should render. */
export function getPublishedByCategory(category: WorksCategory): WorkItem[] {
  return onlyPublished(byCategory[category]);
}

export function getItemBySlug(
  category: WorksCategory,
  slug: string
): WorkItem | undefined {
  return byCategory[category].find((item) => item.slug === slug);
}

/**
 * Ordered prev/next lookup within a category, published items only —
 * used by the Dribbble-style modal (arrow-key nav) and the case
 * study preview strip alike.
 */
export function getAdjacentItems(category: WorksCategory, slug: string) {
  const items = getPublishedByCategory(category);
  const index = items.findIndex((item) => item.slug === slug);
  return {
    items,
    index,
    prev: index > 0 ? items[index - 1] : undefined,
    next: index !== -1 && index < items.length - 1 ? items[index + 1] : undefined,
  };
}

/** Most recent published items across ALL categories, for the works index page. */
export function getRecentPublished(limit: number = RECENT_PROJECTS_COUNT): WorkItem[] {
  const all = [...designs, ...canvas, ...caseStudies].filter(
    (item) => item.status === "published"
  );
  return all
    .sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )
    .slice(0, limit);
}

/**
 * Published AND selected — the two are independent flags. A project
 * can be live on its category grid (published) without being
 * featured on the homepage (selected). No count limit here, unlike
 * Recents — this is a deliberate, hand-curated set, not a "latest N."
 */
export function getSelectedPublished(): WorkItem[] {
  const all = [...designs, ...canvas, ...caseStudies];
  return all
    .filter((item) => item.status === "published" && item.selected)
    .sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
}
