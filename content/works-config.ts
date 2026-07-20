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
