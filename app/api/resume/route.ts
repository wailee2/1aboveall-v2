import { checkRateLimit } from "@/lib/rate-limit";
import { apiError, getClientKey } from "@/lib/api-response";

/**
 * GET /api/resume
 * Rate limited to 5 downloads per minute per client — resumes are a
 * static asset, so this is mostly about deterring scraping bots
 * rather than protecting expensive compute.
 */
export async function GET(request: Request) {
  const key = getClientKey(request);
  const { success, retryAfterMs } = checkRateLimit(`resume:${key}`, {
    limit: 5,
    windowMs: 60 * 1000,
  });

  if (!success) {
    return apiError("Too many requests. Please try again shortly.", 429, {
      retryAfterMs,
    });
  }

  // Redirect to the actual static file in /public — keeping the
  // rate limit in front of it rather than serving straight from
  // /public means it's actually enforceable.
  return Response.redirect(new URL("/resume.pdf", request.url), 307);
}
