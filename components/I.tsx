"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

export type CarouselDirection = "forward" | "reverse";

export interface InfiniteCarousel2Props {
  /** The logos / cards / icons to distribute evenly along the path. */
  items: React.ReactNode[];
  /** SVG path data the items travel along. */
  pathD?: string;
  /** Duration in seconds for one full loop. Lower = faster. */
  speed?: number;
  /** Initial direction of travel. */
  direction?: CarouselDirection;
  /** Show the dashed path line for debugging/designing. */
  showPath?: boolean;
}

export const InfiniteCarousel2 = ({
  items,
  pathD = "M506.128 179.5C732.128 0.166672 1401 0.166672 1401 179.5C1401 358.833 732.128 358.833 506.128 179.5ZM506.128 179.5C280.128 0.166672 45 0.166672 45 179.5C45 358.833 280.128 358.833 506.128 179.5Z",
  speed = 15,
  direction = "forward",
  showPath = false,
}: InfiniteCarousel2Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const elements = container?.querySelectorAll(".carousel-item");
    if (!container || !elements || elements.length === 0) return;

    // 1. Setup the master timeline with initial direction
    const baseTimeScale = direction === "reverse" ? -1 : 1;
    const tl = gsap.timeline({ 
      repeat: -1,
      defaults: { ease: "none" }
    });

    tl.timeScale(baseTimeScale);

    // 2. Distribute items evenly along the path
    elements.forEach((el, index) => {
      const startProgress = index / elements.length;

      tl.to(el, {
        duration: speed,
        motionPath: {
          path: pathRef.current!,
          autoRotate: true,
          align: pathRef.current!,
          alignOrigin: [0.5, 0.5], // Correction: Centers item on the path
        },
      }, 0).progress(startProgress); // Even staggering
    });

    // 3. Correction: Smooth Pause on Hover (Velocity Interpolation)
    const hoverOver = () => gsap.to(tl, { timeScale: 0, duration: 0.4, ease: "power2.out" });
    const hoverOut = () => gsap.to(tl, { timeScale: baseTimeScale, duration: 0.4, ease: "power2.out" });

    container.addEventListener("mouseenter", hoverOver);
    container.addEventListener("mouseleave", hoverOut);

    // 4. Feature: Smooth Scroll-Wheel Velocity / Direction Changes
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Determine scroll direction
      const scrollDir = e.deltaY > 0 ? 1 : -1;
      // Surge speed temporarily in that direction
      const targetTimeScale = baseTimeScale * 4 * scrollDir; 
      
      gsap.to(tl, {
        timeScale: targetTimeScale,
        duration: 0.2,
        overwrite: "auto",
        onComplete: () => {
          // Smoothly ease back down to original traveling speed
          gsap.to(tl, { timeScale: baseTimeScale, duration: 0.8, ease: "power1.out" });
        }
      });
    };
    container.addEventListener("wheel", handleWheel, { passive: false });

    // 5. Feature: Viewport Optimization via ScrollTrigger
    ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => tl.play(),
      onLeave: () => tl.pause(),
      onEnterBack: () => tl.play(),
      onLeaveBack: () => tl.pause(),
    });

    // Cleanup to prevent memory leaks and duplicate animations
    return () => {
      tl.kill();
      container.removeEventListener("mouseenter", hoverOver);
      container.removeEventListener("mouseleave", hoverOut);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [items, speed, direction]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: "relative", 
        width: "100%", 
        height: "400px", 
        overflow: "hidden" 
      }}
    >
      {/* Responsive SVG Container for your custom path layout */}
      <svg 
        viewBox="0 0 1450 360" 
        preserveAspectRatio="xMidYMid meet"
        style={{ 
          position: "absolute", 
          width: "100%", 
          height: "100%",
          pointerEvents: "none"
        }}
      >
        <path 
          ref={pathRef}
          d={pathD} 
          fill="none" 
          stroke={showPath ? "#cbd5e1" : "transparent"} 
          strokeDasharray="5,5"
          strokeWidth="2"
        />
      </svg>

      {/* Render standard HTML elements */}
      {items.map((item, idx) => (
        <div
          key={idx}
          className="carousel-item"
          style={{ 
            position: "absolute", 
            top: 0, 
            left: 0,
            willChange: "transform" // Optimizes browser rendering
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
