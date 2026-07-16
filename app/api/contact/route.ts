import { checkRateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError, getClientKey } from "@/lib/api-response";

/**
 * POST /api/contact
 * Rate limited to 3 submissions per 10 minutes per client — generous
 * enough for a real visitor, tight enough to stop naive spam/abuse.
 * Bypassed entirely in dev mode (see lib/rate-limit.ts).
 */
export async function POST(request: Request) {
  const key = getClientKey(request);
  const { success, retryAfterMs } = checkRateLimit(`contact:${key}`, {
    limit: 3,
    windowMs: 10 * 60 * 1000,
  });

  if (!success) {
    return apiError(
      "Too many submissions. Please try again shortly.",
      429,
      { retryAfterMs }
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid request body.", 400);
  }

  const { name, email, message } = body;
  if (!name || !email || !message) {
    return apiError("Name, email, and message are all required.", 422);
  }

  // TODO: wire up real delivery (e.g. Resend). Intentionally not
  // implemented here since it needs a real API key.
  return apiSuccess({ received: true });
}
