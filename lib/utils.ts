/**
 * lib/utils.ts — small, genuinely shared helpers only. If a helper
 * is only used by one feature, it lives next to that feature instead
 * (see the co-location convention in the README) — this file is
 * reserved for things used across otherwise-unrelated parts of the app.
 */

/** Merge conditional class names without importing a whole library. */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
