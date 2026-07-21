"use client";

import React, { useEffect, useRef, useImperativeHandle } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type TagProp = React.ElementType;

interface ScaleOnScrollProps extends React.HTMLAttributes<HTMLElement> {
  tag?: TagProp;
  className?: string;
  startScale?: number;
  endScale?: number;
  scrub?: number | boolean;
  overflowHidden?: boolean;
  debug?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const REFRESH_DELAY_MS = 30;

const ScaleOnScroll = React.forwardRef<HTMLElement, ScaleOnScrollProps>(
  (
    {
      tag: Tag = "div",
      className = "",
      startScale = 10,
      endScale = 100,
      scrub = 0.6,
      overflowHidden = false,
      debug = false,
      children,
      style = {},
      ...rest
    },
    forwardedRef
  ) => {
    const elRef = useRef<HTMLElement | null>(null);

    useImperativeHandle(forwardedRef, () => elRef.current as HTMLElement, []);

    useEffect(() => {
      const el = elRef.current;
      if (!el || typeof window === "undefined") return;

      const log = (...args: unknown[]) => {
        if (debug) console.log("[ScaleOnScroll]", ...args);
      };

      const prefersReduced =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const fromScale = Math.max(0.01, startScale / 100);
      const toScale = Math.max(0.01, endScale / 100);

      // Respect reduced-motion preference: skip animation entirely.
      if (prefersReduced) {
        gsap.set(el, {
          scale: toScale,
          transformOrigin: "center center",
          willChange: "transform",
        });
        return;
      }

      const pendingTimeouts = new Set<ReturnType<typeof setTimeout>>();
      const scheduleRefreshApply = () => {
        const id = setTimeout(() => {
          pendingTimeouts.delete(id);
          applyInitialScale();
        }, REFRESH_DELAY_MS);
        pendingTimeouts.add(id);
      };

      const computeInitialProgress = () => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const raw = (vh - rect.top) / (rect.height || 1);
        return gsap.utils.clamp(0, 1, raw);
      };

      const applyInitialScale = () => {
        const progress = computeInitialProgress();
        const value = fromScale + progress * (toScale - fromScale);
        gsap.set(el, {
          scale: value,
          transformOrigin: "center center",
          willChange: "transform",
        });
        log("initial progress", progress, "scale", value);
      };

      // Set the starting scale immediately, before the scroll-driven tween takes over.
      gsap.set(el, {
        scale: fromScale,
        transformOrigin: "center center",
        willChange: "transform",
      });

      const tween = gsap.to(el, {
        scale: toScale,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom bottom",
          scrub,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            log("onRefresh", { start: self.start, end: self.end });
            applyInitialScale();
          },
        },
      });

      // Re-measure once media inside the element finishes loading, since that
      // can change layout/heights and therefore the scroll-trigger bounds.
      const refreshOnLoad = () => {
        log("media loaded -> refresh ScrollTrigger");
        ScrollTrigger.refresh();
        scheduleRefreshApply();
      };

      const imgCleanups: Array<() => void> = [];
      el.querySelectorAll("img").forEach((img) => {
        if (img.complete) {
          refreshOnLoad();
          return;
        }
        const onLoad = () => refreshOnLoad();
        img.addEventListener("load", onLoad, { once: true });
        imgCleanups.push(() => img.removeEventListener("load", onLoad));
      });

      const videoCleanups: Array<() => void> = [];
      el.querySelectorAll("video").forEach((video) => {
        if (video.readyState >= 1) {
          refreshOnLoad();
          return;
        }
        const onLoadedMetadata = () => refreshOnLoad();
        video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
        videoCleanups.push(() => video.removeEventListener("loadedmetadata", onLoadedMetadata));
      });

      let resizeObserver: ResizeObserver | undefined;
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          log("ResizeObserver -> refresh");
          ScrollTrigger.refresh();
          scheduleRefreshApply();
        });
        resizeObserver.observe(el);
      }

      const rafId = requestAnimationFrame(applyInitialScale);

      const handleWindowResize = () => {
        ScrollTrigger.refresh();
        scheduleRefreshApply();
      };
      window.addEventListener("resize", handleWindowResize);

      return () => {
        cancelAnimationFrame(rafId);
        pendingTimeouts.forEach((id) => clearTimeout(id));
        pendingTimeouts.clear();

        tween.kill();
        tween.scrollTrigger?.kill();

        imgCleanups.forEach((cleanup) => cleanup());
        videoCleanups.forEach((cleanup) => cleanup());
        resizeObserver?.disconnect();
        window.removeEventListener("resize", handleWindowResize);
      };
    }, [startScale, endScale, scrub, debug]);

    const mergedStyle: React.CSSProperties = { display: "block", ...style };
    const wrapperClass = `${className} ${overflowHidden ? "overflow-hidden" : ""}`.trim();

    const TagAny = Tag as React.ElementType;

    return (
      <TagAny ref={elRef as any} className={wrapperClass} style={mergedStyle} {...(rest as any)}>
        {children}
      </TagAny>
    );
  }
);

ScaleOnScroll.displayName = "ScaleOnScroll";

export default ScaleOnScroll;