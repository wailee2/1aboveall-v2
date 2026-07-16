/*
InfiniteCarousel2.tsx
React + TypeScript — "Infinite Carousel 2.0"

Evolution of the original straight-line InfiniteCarousel: instead of translating
a repeated row of children along the X axis, this version distributes your items
evenly along ANY svg path (straight line, wave, or the film-strip infinity curve)
and animates them along it forever, wrapping seamlessly.

Carries over from the original component:
- Pause on hover
- Direction change on wheel / touch / page-scroll (onScrollUp / onScrollDown)
- Smooth velocity interpolation (no jarring direction snaps)
- Only animates while in viewport (IntersectionObserver)
- Seamless wrap-around (now distance-along-path based instead of pixel-based)

New in 2.0:
- Items travel along a custom SVG <path> (`pathD`), not just a straight track
- `showPath` toggle — reveal the guide path (dashed) for design/debugging, or
  hide it completely for production
- `autoRotate` — optionally tilt each item to match the path's tangent direction
- Fully typed props, works as a drop-in .tsx component (Next.js "use client" safe)
*/

"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

export type CarouselDirection = "forward" | "reverse";

export interface InfiniteCarousel2Props {
  /** The logos / cards / icons to distribute evenly along the path. */
  items: ReactNode[];
  /** SVG path data the items travel along. Defaults to an infinity/film-strip curve. */
  pathD?: string;
  /** viewBox for the underlying <svg>. Must match the coordinate space of pathD. */
  viewBox?: string;
  /** Travel speed in px/sec along the path. */
  speed?: number;
  /** Initial direction of travel. */
  direction?: CarouselDirection;
  /** Direction to switch to when the user scrolls up / wheels up. */
  onScrollUp?: CarouselDirection;
  /** Direction to switch to when the user scrolls down / wheels down. Defaults to `direction`. */
  onScrollDown?: CarouselDirection;
  /** Slow to a stop while the pointer is over the carousel. */
  pauseOnHover?: boolean;
  /** Show the guide path (dashed stroke) instead of hiding it. */
  showPath?: boolean;
  /** Color of the guide path stroke when showPath is true. */
  pathColor?: string;
  /** Rotate each item to match the path's tangent direction as it travels. */
  autoRotate?: boolean;
  /** Bounding box size (px, in viewBox units) used to center each item on its point. */
  itemSize?: number;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_PATH =
  "M50,120 C50,60 150,60 200,110 C250,160 350,160 400,110 C350,60 250,60 200,110 C150,160 50,160 50,120 Z";

export default function InfiniteCarousel2({
  items,
  pathD = DEFAULT_PATH,
  viewBox = "0 0 1450 360",
  speed = 40,
  direction = "forward",
  onScrollUp = "forward",
  onScrollDown,
  pauseOnHover = false,
  showPath = true,
  pathColor = "#1e2233",
  autoRotate = true,
  itemSize = 32,
  className = "",
  style = {},
}: InfiniteCarousel2Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const itemRefs = useRef<(SVGGElement | null)[]>([]);

  const pathLenRef = useRef(0);
  const distanceRef = useRef(0);
  const targetVelRef = useRef(direction === "forward" ? speed : -speed);
  const currentVelRef = useRef(targetVelRef.current);
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number | null>(null);
  const inViewRef = useRef(false);
  const lastScrollYRef = useRef(
    typeof window !== "undefined" ? window.scrollY : 0
  );

  const scrollDownDirection = onScrollDown ?? direction;

  // --- measure path length whenever the path shape changes ---
  const measure = useCallback(() => {
    if (pathRef.current) {
      pathLenRef.current = pathRef.current.getTotalLength();
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, pathD]);

  // --- only animate while the carousel is visible ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inViewRef.current = entry.isIntersecting && entry.intersectionRatio > 0;
        });
      },
      { threshold: [0, 0.01, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // --- main animation loop: distance-along-path replaces translateX ---
  useEffect(() => {
    const n = items.length || 1;

    function step(t: number) {
      if (!lastTRef.current) lastTRef.current = t;
      const dt = (t - lastTRef.current) / 1000;
      lastTRef.current = t;

      // smooth velocity interpolation, same feel as the original carousel
      const cur = currentVelRef.current;
      const targ = targetVelRef.current;
      const factor = 0.12;
      currentVelRef.current = cur + (targ - cur) * factor;

      const len = pathLenRef.current;
      const pathEl = pathRef.current;

      if (inViewRef.current && pathEl && len > 0) {
        distanceRef.current += currentVelRef.current * dt;
        // wrap into [0, len) to avoid float drift over long sessions
        distanceRef.current = ((distanceRef.current % len) + len) % len;

        for (let i = 0; i < n; i++) {
          const g = itemRefs.current[i];
          if (!g) continue;

          const offset = (i / n) * len;
          const pos = ((offset + distanceRef.current) % len + len) % len;
          const pt = pathEl.getPointAtLength(pos);

          let angle = 0;
          if (autoRotate) {
            const eps = 0.5;
            const pos2 = ((pos + eps) % len + len) % len;
            const pt2 = pathEl.getPointAtLength(pos2);
            angle = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
          }

          g.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${angle})`);
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTRef.current = null;
    };
  }, [items.length, autoRotate]);

  // keep target velocity synced with direction/speed prop changes
  useEffect(() => {
    targetVelRef.current = direction === "forward" ? speed : -speed;
  }, [direction, speed]);

  // --- wheel / touch / page-scroll direction changes, same as original ---
  useEffect(() => {
    function setDir(dir: CarouselDirection) {
      targetVelRef.current = dir === "forward" ? speed : -speed;
    }

    function handleWheel(e: WheelEvent) {
      if (!inViewRef.current) return;
      if (e.deltaY < 0) setDir(onScrollUp);
      else if (e.deltaY > 0) setDir(scrollDownDirection);
    }

    let touchStartY: number | null = null;
    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches?.[0]?.clientY ?? null;
    }
    function handleTouchMove(e: TouchEvent) {
      if (!inViewRef.current || touchStartY === null) return;
      const y = e.touches?.[0]?.clientY ?? 0;
      const dy = touchStartY - y;
      if (dy > 2) setDir(scrollDownDirection);
      else if (dy < -2) setDir(onScrollUp);
    }

    function handleScroll() {
      if (!inViewRef.current) return;
      const cur = window.scrollY;
      const dy = cur - lastScrollYRef.current;
      if (dy > 0) setDir(scrollDownDirection);
      else if (dy < 0) setDir(onScrollUp);
      lastScrollYRef.current = cur;
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onScrollUp, scrollDownDirection, speed]);

  // --- pause on hover ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !pauseOnHover) return;
    function enter() {
      targetVelRef.current = 0;
    }
    function leave() {
      targetVelRef.current = direction === "forward" ? speed : -speed;
    }
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [pauseOnHover, direction, speed]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} style={style}>
      <svg viewBox={viewBox} className="w-full h-auto overflow-visible" preserveAspectRatio="xMidYMid meet">
        {/* guide path — toggle visibility with showPath, geometry is always used for motion */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke={pathColor}
          strokeWidth={showPath ? 2 : 0}
          strokeDasharray={showPath ? "6 6" : undefined}
          opacity={showPath ? 1 : 0}
        />

        {items.map((item, i) => (
          <g
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
          >
            {/* center each item on its point along the path */}
            <g transform={`translate(${-itemSize / 2} ${-itemSize / 2})`}>{item}</g>
          </g>
        ))}
      </svg>
    </div>
  );
}

/*
--- Usage ---

import InfiniteCarousel2 from "./InfiniteCarousel2";

function LogoIcon() {
  return (
    <g>
      <rect width={32} height={32} rx={8} fill="#eeeeec" stroke="#1e2233" strokeWidth={2} />
      <circle cx={16} cy={16} r={8} fill="none" stroke="#1e2233" strokeWidth={2.5} />
      <circle cx={22} cy={10} r={1.6} fill="#1e2233" />
    </g>
  );
}

export default function Example() {
  return (
    <InfiniteCarousel2
      items={Array.from({ length: 8 }, (_, i) => <LogoIcon key={i} />)}
      speed={50}
      direction="forward"
      onScrollUp="forward"
      onScrollDown="reverse"
      pauseOnHover
      showPath={false}   // flip to true while designing to see the guide curve
      autoRotate={false}
      itemSize={32}
    />
  );
}

Notes:
- `pathD` accepts any SVG path string — a straight line for a classic marquee,
  or a curve like the default film-strip infinity shape.
- Toggle `showPath` during development to visually align items to the curve,
  then set it to false for production.
- Each item is any ReactNode rendered inside an SVG <g>, so plain shapes,
  <image> tags, or inline logo SVGs all work.
*/