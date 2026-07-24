import type { WorksCategory } from "./works-types";
/**
 * content/works-config.ts
 * ---------------------------------------------------------------
 * Values here are the ones most likely to become admin-configurable
 * database settings once Supabase is connected. Kept as a plain
 * constant for now, but isolated in its own file (rather than
 * inlined in works-api.ts) so swapping it for a DB-backed value
 * later touches one file, not every call site.
 */
export const RECENT_PROJECTS_COUNT = 10;


/**
 * Single source of truth for the human-readable name of each
 * category — used by breadcrumbs (and anywhere else a display label
 * is needed) instead of re-typing "Case Studies" as a literal string
 * in multiple files.
 */
export const CATEGORY_LABELS: Record<WorksCategory, string> = {
  designs: "Designs",
  canvas: "Canvas",
  "case-studies": "Case Studies",
};
