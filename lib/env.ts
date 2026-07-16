/**
 * lib/env.ts
 * ---------------------------------------------------------------
 * Single source of truth for "what mode is this running in."
 *
 * This is intentionally NOT the same thing as NODE_ENV. NODE_ENV is
 * controlled by the build tool (Next sets it to "production" for
 * `next build`, "development" for `next dev`) and you don't always
 * want your app's dev-mode *behavior* (bypass rate limiting, verbose
 * error output, skip auth checks) to be tied to that automatically —
 * e.g. you may want to run a production build locally against a
 * staging bypass. So we read our own explicit flag instead.
 *
 * Set in .env.local:
 *   NEXT_PUBLIC_APP_ENV=development
 * Leave unset (or "production") for production behavior.
 */

export const APP_ENV = (process.env.NEXT_PUBLIC_APP_ENV ?? "production") as
  | "development"
  | "production";

export const IS_DEV = APP_ENV === "development";
export const IS_PROD = !IS_DEV;

/**
 * Guard used anywhere a system needs to say "skip this in dev":
 * rate limiting, auth checks, analytics, etc. Centralizing it here
 * means every call site reads the same way and there's exactly one
 * place to change the rule later.
 */
export function shouldEnforce(): boolean {
  return IS_PROD;
}
