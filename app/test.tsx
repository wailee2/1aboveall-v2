/*
InfiniteCarousel2.example.tsx
Drop-in usage example for InfiniteCarousel2.tsx

Copy InfiniteCarousel2.tsx into your project (e.g. /components/InfiniteCarousel2.tsx),
then render this page/component to see it working with a toggle for showPath.
*/

"use client";

import React, { useState } from "react";
import InfiniteCarousel2 from "@/components/InfiniteCarousel2";

// --- a few stand-in logo icons, each just an SVG <g> ---

function CameraLogo() {
  return (
    <g>
      <rect width={32} height={32} rx={8} fill="#eeeeec" stroke="#1e2233" strokeWidth={2} />
      <circle cx={16} cy={16} r={8} fill="none" stroke="#1e2233" strokeWidth={2.5} />
      <circle cx={22} cy={10} r={1.6} fill="#1e2233" />
    </g>
  );
}

function BoltLogo() {
  return (
    <g>
      <rect width={32} height={32} rx={8} fill="#eeeeec" stroke="#1e2233" strokeWidth={2} />
      <path d="M18 6 L11 18 H16 L14 26 L23 13 H17 Z" fill="#1e2233" />
    </g>
  );
}

function PlayLogo() {
  return (
    <g>
      <rect width={32} height={32} rx={8} fill="#eeeeec" stroke="#1e2233" strokeWidth={2} />
      <path d="M12 9 L23 16 L12 23 Z" fill="#1e2233" />
    </g>
  );
}

function HeartLogo() {
  return (
    <g>
      <rect width={320} height={32} rx={8} fill="#eeeeec" stroke="#1e2233" strokeWidth={2} />
      <path
        d="M16 24 C9 19 6 15.5 6 12 C6 9 8.2 7 11 7 C13 7 14.8 8.2 16 10 C17.2 8.2 19 7 21 7 C23.8 7 26 9 26 12 C26 15.5 23 19 16 24 Z"
        fill="#1e2233"
      />
    </g>
  );
}

const logos = [CameraLogo, BoltLogo, PlayLogo, HeartLogo, CameraLogo, BoltLogo, PlayLogo, HeartLogo];

export default function InfiniteCarousel2Example() {
  const [showPath, setShowPath] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [direction, setDirection] = useState<"forward" | "reverse">("forward");

  return (
    <div className="min-h-screen bg-[#eeeeec] flex flex-col items-center justify-center gap-6 p-8">
      <div className="w-full max-w-2xl">
        <InfiniteCarousel2
          items={logos.map((Logo, i) => (
            <Logo key={i} />
          ))}
          speed={150}
          direction={direction}
          onScrollUp="forward"
          onScrollDown="reverse"
          autoRotate={autoRotate}
          itemSize={32}
          pathD="M506.128 179.5C732.128 0.166672 1401 0.166672 1401 179.5C1401 358.833 732.128 358.833 506.128 179.5ZM506.128 179.5C280.128 0.166672 45 0.166672 45 179.5C45 358.833 280.128 358.833 506.128 179.5Z"
        />
      </div>

      {/* controls, purely for this demo page */}
      <div className="flex flex-wrap gap-3 text-sm">
        <button
          onClick={() => setShowPath((v) => !v)}
          className="px-4 py-2 rounded-full border border-[#1e2233] text-[#1e2233] hover:bg-[#1e2233] hover:text-[#eeeeec] transition"
        >
          {showPath ? "Hide path" : "Show path"}
        </button>
        <button
          onClick={() => setAutoRotate((v) => !v)}
          className="px-4 py-2 rounded-full border border-[#1e2233] text-[#1e2233] hover:bg-[#1e2233] hover:text-[#eeeeec] transition"
        >
          {autoRotate ? "Disable autoRotate" : "Enable autoRotate"}
        </button>
        <button
          onClick={() => setDirection((d) => (d === "forward" ? "reverse" : "forward"))}
          className="px-4 py-2 rounded-full border border-[#1e2233] text-[#1e2233] hover:bg-[#1e2233] hover:text-[#eeeeec] transition"
        >
          Reverse direction
        </button>
      </div>
    </div>
  );
}