/**
 * lib/api-response.ts
 * ---------------------------------------------------------------
 * Every Route Handler in app/api/* returns through these two
 * helpers, so every API error/success shape is identical — the
 * client-side code that consumes them (see the contact form) never
 * has to guess the shape of a given endpoint's response.
 */

import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function apiError(
  message: string,
  status: number = 400,
  extra?: Record<string, unknown>
) {
  return NextResponse.json(
    { ok: false, error: { message, ...extra } },
    { status }
  );
}

/** Best-effort client identifier for rate-limit keying. */
export function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}
