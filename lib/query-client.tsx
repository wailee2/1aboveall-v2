"use client";

/**
 * lib/query-client.tsx
 * ---------------------------------------------------------------
 * TanStack Query is used ONLY for the handful of interactions that
 * actually hit an API route as a mutation — contact form submit and
 * resume download. It is deliberately NOT used for the static
 * content pages (home/about/services/works): that content is
 * server-rendered at build time from content/projects.ts, so there
 * is no client-side fetch/cache/refetch problem for it to solve.
 * Reaching for Query there would just be indirection with no payoff.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function AppQueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}
