import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Scroll({
  tag: Tag = "div",
  className = "p-3 bg-purple-800",
  innerClassName = "bg-blue-600",
  children,
  startHeightVh = 5,
  endHeightVh = 100,
  startWidthPercent = 50,
  endWidthPercent = 100,
  pinDurationVh = 200,
  ease = "power3.out",
  durationMs = 120,
  onComplete = undefined,
  ...tagProps
}) {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(null);
  const progressRef = useRef(0);
  const completedRef = useRef(false);
  const tweenRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    // apply initial size immediately
    gsap.set(inner, {
      height: `${startHeightVh}vh`,
      width: `${startWidthPercent}%`,
      clearProps: "transform",
    });

    const vh = () => window.innerHeight;

    const compute = () => {
      const rect = container.getBoundingClientRect();
      const top = rect.top;

      // map vertical movement of one viewport to progress [0..1] (kept behavior from original)
      const progress = Math.min(Math.max(-top / vh(), 0), 1);

      // small smoothing to reduce micro jumps
      const smoothed = progressRef.current + (progress - progressRef.current) * 0.12;
      progressRef.current = smoothed;

      // interpolate
      const newHeightVh = startHeightVh + smoothed * (endHeightVh - startHeightVh);
      const newWidthPct = startWidthPercent + smoothed * (endWidthPercent - startWidthPercent);

      // kill previous tween if active (overwrite auto also helps)
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }

      // gsap animate size with easing
      tweenRef.current = gsap.to(inner, {
        height: `${newHeightVh.toFixed(2)}vh`,
        width: `${newWidthPct.toFixed(2)}%`,
        ease,
        duration: Math.max(0.001, durationMs / 1000), // seconds
        overwrite: "auto",
        onComplete: () => {
          // nothing here — we'll trigger overall onComplete below when smoothed >= 1
        },
      });

      if (smoothed < 1) {
        // keep ticking until we reach 1
        rafRef.current = requestAnimationFrame(compute);
      } else {
        // once smoothed reaches 1, call onComplete once
        if (!completedRef.current) {
          completedRef.current = true;
          if (typeof onComplete === "function") {
            try {
              onComplete();
            } catch (e) {
              // ignore callback errors
            }
          }
        }
      }
    };

    const start = () => {
      // restart compute loop
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", start);

    // kick things off
    start();

    return () => {
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", start);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [
    startHeightVh,
    endHeightVh,
    startWidthPercent,
    endWidthPercent,
    pinDurationVh,
    ease,
    durationMs,
    onComplete,
  ]);

  return (
    <Tag
      ref={containerRef}
      style={{ height: `${pinDurationVh}vh`, position: "relative" }}
      {...tagProps}
    >
      <div
        className={`${className} sticky top-0 h-svh w-full flex flex-col items-center justify-center`}
      >
        <div
          ref={innerRef}
          style={{
            height: `${startHeightVh}vh`,
            width: `${startWidthPercent}%`,
            willChange: "height, width",
          }}
          className={`${innerClassName} flex items-center justify-center overflow-hidden`}
        >
          {children}
        </div>
      </div>
    </Tag>
  );
}

/**
 * <Scroll
        tag="div"                     // 👈 render as <div>
        className="p-3 bg-transparent" 
        innerClassName="bg-blue-500 rounded-2xl shadow-xl"
        startHeightVh={10}            // start small
        endHeightVh={90}              // end large
        startWidthPercent={40}
        endWidthPercent={100}
        pinDurationVh={250}           // scroll distance before unpinning
        ease="power3.out"             // 👈 GSAP easing
        durationMs={200}              // duration of each tween frame
        onComplete={() => console.log("Scroll animation completed")}
      >
        <div className="text-center text-3xl font-semibold p-8">
          🚀 Scroll to Reveal Me!
        </div>
      </Scroll>
 */