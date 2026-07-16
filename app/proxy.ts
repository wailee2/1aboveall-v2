import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * app/proxy.ts
 * ---------------------------------------------------------------
 * Next.js 16 renamed middleware.ts -> proxy.ts (this file must live
 * at app/proxy.ts, not the project root, and the exported function
 * must be named `proxy`). Runs on the Node.js runtime by default now
 * — do NOT export a `runtime` value here, Next.js 16 throws if you do.
 *
 * IMPORTANT — what this file is deliberately NOT used for: auth.
 * Vercel's own guidance after Next.js 16 (following a CVE where
 * middleware-based auth could be bypassed) is that Proxy is a
 * routing/network layer, not a security boundary. When the private
 * routes (dashboard/projects/manage-users) are built, their access
 * check belongs in app/(private)/layout.tsx as a Server Component
 * checking the session directly — NOT here.
 *
 * For now, with only public routes live, this just attaches a couple
 * of baseline security headers to every response.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
