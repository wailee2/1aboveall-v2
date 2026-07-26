"use client";

/**
 * app/(public)/works/components/DribbbleModal.tsx
 * ---------------------------------------------------------------
 * FIXED (smooth scale-up, no jump/shadow):
 *
 * 1. The layoutId frame now has an EXPLICIT tween transition
 *    (duration 0.4s, ease-out curve) instead of relying on Framer
 *    Motion's default spring — springs can overshoot/settle unevenly,
 *    which reads as a "jump" rather than a clean scale.
 *
 * 2. The image content no longer fades in independently on the
 *    FIRST open — AnimatePresence's `initial={false}` means only the
 *    frame's own scale/position animation is visible on open/close;
 *    the crossfade only applies to LATER prev/next navigation. A
 *    fully-opaque image that's still sliding into place is exactly
 *    what read as jumping/shadowing before.
 *
 * 3. border-radius/overflow-hidden moved OFF the animated element
 *    onto a static, non-animating wrapper div — Framer Motion no
 *    longer needs to interpolate corner radius mid-transform, which
 *    was a secondary source of the edge/shadow artifact.
 */

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { LightboxTrigger } from "@/components/ui/LightboxTrigger";
import { useToast } from "@/components/toast/ToastProvider";
import type { DesignItem, CanvasItem } from "@/content/works-types";

const FRAME_TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

interface PreviewItem {
  slug: string;
  title: string;
  heroImage: string;
}

export function DribbbleModal<T extends DesignItem | CanvasItem>({
  item,
  prev,
  next,
  originSlug,
  basePath,
  onClose,
  onNavigate,
}: {
  item: T;
  prev?: T;
  next?: T;
  originSlug: string;
  basePath: string;
  onClose: () => void;
  onNavigate: (item: T) => void;
}) {
  const { showToast } = useToast();

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prev) onNavigate(prev);
      if (e.key === "ArrowRight" && next) onNavigate(next);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose, onNavigate, prev, next]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const publishedLabel = new Date(item.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleShare = async () => {
    const url = `${window.location.origin}${basePath}/${item.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied", "success");
    } catch {
      showToast("Couldn't copy the link", "error");
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 w-full z-120  overflow-y-auto scrollbar-nonex bg-black/80 "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" bg-bg section-px lg:grid grid-cols-12 gap-[1.25em] rounded-t-sm mt-[5em] "
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="fixed top-[2.7em] right-[1.7em] z-10 w-9 h-9 rounded-full bg-text/40 text-bg text-sm leading-none flex items-center justify-center hover:bg-text/60 transition-colors cursor-pointer "
        >
          ✕
        </button>

        <div
          className=" md:col-start-2 md:col-span-10 relative w-full py-[4em] shrink-0 "
        >
          <h2 className="text-large!">{item.title}</h2>

          <motion.div
            layoutId={`work-media-${originSlug}`}
            className="relative w-full aspect-4/3"
            transition={FRAME_TRANSITION}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0"
              >
                <LightboxTrigger media={item.heroMedia} className="absolute inset-0" sizes="90vw" priority />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.25 }}
            className="px-6 py-5"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="font-sans text-lg font-medium text-[#F0F0EC]">{item.title}</h2>
              <button
                type="button"
                onClick={handleShare}
                title="copy"
                aria-label="Copy link to this item"
                className="shrink-0 font-mono text-[11px] uppercase tracking-wide text-white/70 hover:text-white border border-white/20 rounded-sm px-3 py-1.5 transition-colors flex items-center gap-1.5"
              >
                <ShareIcon /> Share
              </button>
            </div>

            <time dateTime={item.publishedDate} className="font-mono text-[11px] uppercase tracking-wide text-white/50 block mb-3">
              {publishedLabel}
            </time>

            <p className="font-serif text-sm text-white/70 leading-relaxed max-w-[60ch] mb-5">
              {item.shortDescription}
            </p>

            {item.otherMedia && item.otherMedia.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {item.otherMedia.map((media, i) => (
                  <div key={i} className="relative aspect-square rounded-sm overflow-hidden">
                    <LightboxTrigger media={media} className="absolute inset-0" sizes="200px" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <div className="flex-center mx-auto mt-[3em] mb-[2em] ">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="clickable-button px-[1.4em] py-[0.7em] text-xsmall font-mono"
            >
              Esc
            </button>
          </div>

          <div className="grid grid-cols-12 gap-[1.25em] lg:gap-[2em]">
            <div className=' col-span-6 lg:col-start-3 lg:col-span-4 flex flex-col gap-1 '>
              <NavButton 
                disabled={!prev} 
                onClick={() => prev && onNavigate(prev)} label="Previous item"
              >
                ← Next Work
              </NavButton>

              <PreviewThumb 
                item={prev} 
                label="Previous" 
                onSelect={() => prev && onNavigate(prev)} 
              />
            </div>

            <div className='col-span-6 lg:col-span-4 flex flex-col gap-1 '>
              <NavButton 
                disabled={!next} 
                onClick={() => next && onNavigate(next)} label="Next item"
              >
                → Previous Work
              </NavButton>

              <PreviewThumb 
                item={next} 
                label="Next" 
                onSelect={() => next && onNavigate(next)}
              />
            </div>
          </div>
        </div>      
      </div>
    </motion.div>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4" strokeLinecap="round" />
    </svg>
  );
}

function NavButton({
  children,
  disabled,
  onClick,
  label,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="clickable-button w-fit px-[1.4em] py-[0.7em] text-xsmall disabled:hidden disabled:cursor-not-allowed flex-center truncate font-mono"
    >
      {children}
    </button>
  );
}

function PreviewThumb({
  item,
  label,
  onSelect,
}: {
  item?: PreviewItem;
  label: string;
  onSelect: () => void;
}) {
  if (!item) return <div className="w-16 h-12 hidden sm:block" aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${label}: ${item.title}`}
      className="relative aspect-square overflow-hidden"
    >
      <Image 
        src={item.heroImage} 
        alt={item.title} 
        fill sizes="(max-width: 640px) 50vw, 20vw"
        className="object-cover size-full "
      />
    </button>
  );
}
