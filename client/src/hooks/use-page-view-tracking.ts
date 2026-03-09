import { useEffect, useRef } from "react";

/**
 * Tracks page views by sending the current path to /api/v1/track on route change.
 */
export function usePageViewTracking(path: string) {
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!path || path === lastPath.current) return;
    lastPath.current = path;

    fetch("/api/v1/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
      credentials: "include",
    }).catch(() => {});
  }, [path]);
}
