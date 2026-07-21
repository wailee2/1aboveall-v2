"use client";

import React, { useState } from "react";

export default function FluidTypographyVisualizer() {
  // Configuration State
  const [minSize, setMinSize] = useState<number>(1); // in rem
  const [maxSize, setMaxSize] = useState<number>(1.25); // in rem
  const [minViewport, setMinViewport] = useState<number>(320); // in px
  const [maxViewport, setMaxViewport] = useState<number>(1280); // in px
  
  // Simulator State
  const [simulatedWidth, setSimulatedWidth] = useState<number>(600); // in px
  const [copied, setCopied] = useState<boolean>(false);

  // Mathematics Engine
  const minViewportRem = minViewport / 16;
  const maxViewportRem = maxViewport / 16;
  
  // Calculate slope: change in size over change in viewport width
  const slope = (maxSize - minSize) / (maxViewportRem - minViewportRem);
  
  // Calculate Y-intercept: size when viewport width is 0
  const intercept = minSize - slope * minViewportRem;
  const slopeVw = slope * 100;

  // Format the compiled Tailwind arbitrary property string (no spaces for Tailwind parsing safety)
  const tailwindClass = `text-[clamp(${minSize}rem,${intercept.toFixed(4)}rem+${slopeVw.toFixed(4)}vw,${maxSize}rem)]`;

  // Calculate the live operational font-size for the simulated canvas container
  const currentWidthRem = simulatedWidth / 16;
  const rawDynamicSize = intercept + slope * currentWidthRem;
  const clampedSizeRem = Math.max(minSize, Math.min(maxSize, rawDynamicSize));
  const currentPx = (clampedSizeRem * 16).toFixed(1);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tailwindClass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-neutral-900 text-neutral-100 rounded-xl border border-neutral-800 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Control Dashboard */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Fluid Typo Lab</h2>
            <p className="text-sm text-neutral-400 mt-1">Configure and generate dynamic fluid scales.</p>
          </div>

          {/* Core Anchors */}
          <div className="space-y-4 p-4 bg-neutral-950 rounded-lg border border-neutral-800">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Typography Boundaries</h3>
            
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span>Min Font Size: <span className="text-neutral-400">{minSize}rem ({minSize * 16}px)</span></span>
              </label>
              <input 
                type="range" min="0.5" max="5" step="0.05" value={minSize} 
                onChange={(e) => setMinSize(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs mb-1">
                <span>Max Font Size: <span className="text-neutral-400">{maxSize}rem ({maxSize * 16}px)</span></span>
              </label>
              <input 
                type="range" min="1" max="8" step="0.05" value={maxSize} 
                onChange={(e) => setMaxSize(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Viewport Anchors */}
          <div className="space-y-4 p-4 bg-neutral-950 rounded-lg border border-neutral-800">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Responsive Viewport Anchors</h3>
            
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span>Min Viewport Width: <span className="text-neutral-400">{minViewport}px</span></span>
              </label>
              <input 
                type="range" min="320" max="768" step="10" value={minViewport} 
                onChange={(e) => setMinViewport(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs mb-1">
                <span>Max Viewport Width: <span className="text-neutral-400">{maxViewport}px</span></span>
              </label>
              <input 
                type="range" min="768" max="2560" step="20" value={maxViewport} 
                onChange={(e) => setMaxViewport(parseInt(e.target.value))}
                className="w-full accent-indigo-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Code Output Panel */}
          <div className="mt-auto p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-lg">
            <span className="text-xs font-medium text-indigo-400 block mb-2">Tailwind Utility Class</span>
            <div className="font-mono text-xs bg-neutral-950 p-3 rounded border border-neutral-800 break-all select-all text-indigo-200">
              {tailwindClass}
            </div>
            <button 
              onClick={handleCopy}
              className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-2 px-4 rounded transition-colors duration-150"
            >
              {copied ? "Copied to Clipboard!" : "Copy Class"}
            </button>
          </div>
        </div>

        {/* Right Sandbox Canvas */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full sm:w-2/3">
              <label className="flex justify-between text-xs mb-1 font-semibold text-neutral-400 uppercase tracking-wider">
                <span>Simulate Viewport Width: <span className="text-neutral-100 font-mono">{simulatedWidth}px</span></span>
              </label>
              <input 
                type="range" min="320" max="1600" step="5" value={simulatedWidth} 
                onChange={(e) => setSimulatedWidth(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-neutral-400 block">Rendered Font Size</span>
              <span className="text-2xl font-black font-mono text-emerald-400">{currentPx}px</span>
            </div>
          </div>

          {/* Live Dynamic Sandbox Container */}
          <div className="flex-1 min-h-[350px] bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden relative flex flex-col items-center justify-center p-4">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-neutral-600 uppercase tracking-widest pointer-events-none">
              Interactive Preview Box
            </div>
            
            <div 
              style={{ width: `${simulatedWidth}px`, maxWidth: "100%" }} 
              className="border-x border-dashed border-neutral-700 h-full flex flex-col items-center justify-center p-6 bg-neutral-900/50 transition-[width] duration-75 ease-out text-center"
            >
              <h1 
                style={{ fontSize: `${clampedSizeRem}rem`, lineHeight: 1.1 }} 
                className="font-black tracking-tight text-neutral-50 font-sans transition-[font-size] duration-75 ease-out"
              >
                Responsive design scales beautifully.
              </h1>
              <p className="text-sm text-neutral-500 mt-4 max-w-md">
                Drag the simulator slider above to watch this header scale fluidly between your custom anchors without shifting layouts.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}