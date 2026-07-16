"use client";

import { OverlayScrollbars } from "overlayscrollbars";
import { PropsWithChildren, useEffect, useRef } from "react";

export default function PublicScrollProvider({
  children,
}: PropsWithChildren) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const os = OverlayScrollbars(hostRef.current, {
      overflow: {
        x: "hidden",
        y: "scroll",
      },
      scrollbars: {
        autoHide: "never",
        clickScroll: true,
        dragScroll: true,
        theme: "os-theme-custom",
      },
    });

    return () => {
      os.destroy();
    };
  }, []);

  return (
    <div ref={hostRef} className="public-scroll-host">
      <div className="public-scroll-content">{children}</div>
    </div>
  );
}