"use client";

/**
 * hooks/use-rate-limit.ts
 * ---------------------------------------------------------------
 * Client-side companion to lib/rate-limit.ts. This does NOT enforce
 * anything securely (client code can always be bypassed) — its job
 * is UX: disable a button/input for a cooldown window so the UI
 * never lets a user hammer an action faster than the server would
 * accept it anyway. The server-side check in the Route Handler is
 * still the real enforcement; this just avoids a bad experience of
 * "click, get rejected, click again, get rejected again."
 *
 * Used on: contact submit, resume download, and the works search
 * input (debounce-style, even though that one never hits the network —
 * see the README note on why it's still wired through this hook for
 * consistency).
 */

import { useCallback, useRef, useState } from "react";
import { IS_PROD } from "@/lib/env";

export function useRateLimit(cooldownMs: number = 2000) {
  const [isLimited, setIsLimited] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(
    (action: () => void) => {
      if (isLimited) return;
      action();

      // Dev mode: no artificial cooldown, so local development never
      // feels throttled while iterating.
      if (!IS_PROD) return;

      setIsLimited(true);
      timerRef.current = setTimeout(() => {
        setIsLimited(false);
        timerRef.current = null;
      }, cooldownMs);
    },
    [isLimited, cooldownMs]
  );

  // Consumers should call this in a useEffect cleanup if the
  // component can unmount mid-cooldown, to avoid a timer trying to
  // set state on an unmounted component.
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { isLimited, trigger, cancel };
}
