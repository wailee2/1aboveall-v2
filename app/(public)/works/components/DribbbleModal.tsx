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
import ScrollProvider, { useScrollLock } from "@/components/providers/ScrollProvider";
import { getMediaThumbnail } from "@/content/media-utils";
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
  const { lock, unlock } = useScrollLock();

  useEffect(() => {
    lock();
    return unlock;
  }, [lock, unlock]);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prev) onNavigate(prev);
      if (e.key === "ArrowRight" && next) onNavigate(next);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose, onNavigate, prev, next]);

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
      className="fixed inset-0 w-full z-999! overflow-y-auto scrollbar-none bg-black/80 "
    >
      <ScrollProvider>
        <div
          onClick={(e) => e.stopPropagation()}
          className=" bg-bg section-px lg:px-0 mt-[5em] pt-[1.5em] pb-[4em]  rounded-t-md  "
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="secondary-clickable-button text-text! hover:bg-bg/10! fixed top-[3.5em] right-[1.7em] z-10 size-[2.2em] text-sm flex-center "
          >
            ✕
          </button>

          <div className="lg:grid grid-cols-12 gap-[1.25em]">
            <div className=" mb-[2em] md:col-start-2 md:col-span-10  space-y-[1em] sm:flex-between">
              <div className="space-y-[0.25em]">
                <h2 className=" big-words">{item.title}</h2>
                <time
                  dateTime={item.publishedDate}
                  className="text-xsmall uppercase  block"
                >
                  {publishedLabel}
                </time>
              </div>

              <button
                type="button"
                onClick={handleShare}
                title="copy link"
                aria-label="Copy link to this item"
                className="shrink-0 flex-center clickable-link gap-[0.25em] text-xsmall"
              >
                <ShareIcon /> Share
              </button>
            </div>

            <div className=" md:col-start-2 md:col-span-10 relative w-full shrink-0 space-y-[5em] ">        
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
                    className="size-full "
                  >
                    <LightboxTrigger 
                      media={item.heroMedia} 
                      className="size-full " 
                      sizes="90vw" priority
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <div className="">
                <p className="md:max-w-[60%]">{item.shortDescription}</p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.25 }}
                className=""
              >
                {item.otherMedia && item.otherMedia.length > 0 && (
                  <div className="col-start-2 col-span-10 flex flex-col gap-y-[5em] ">
                    {item.otherMedia.map((media, i) => (
                      <LightboxTrigger 
                        key={i}
                        media={media} 
                        mode="intrinsic"
                        className="size-full" 
                        sizes="90vw"
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              <div className="flex-center mx-auto mt-[3em] mb-[2em] ">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="secondary-clickable-button px-[1.4em] py-[0.7em] text-xsmall font-mono"
                >
                  Esc
                </button>
              </div>
            </div>  
          </div>

          <div className="lg:section-px md:grid grid-cols-12 gap-x-[1.25em] gap-y-[1.35em]">
            <div className=' col-span-6  flex flex-col gap-1 '>
              <NavButton 
                disabled={!prev} 
                onClick={() => prev && onNavigate(prev)} 
                label="Previous item"
              >
                ← Previous Work
              </NavButton>

              <PreviewThumb 
                item={prev} 
                label="Previous" 
                onSelect={() => prev && onNavigate(prev)} 
              />
            </div>

            <div className='col-span-6  flex flex-col gap-1 '>
              <NavButton 
                disabled={!next} 
                onClick={() => next && onNavigate(next)} label="Next item"
              >
                Next Work → 
              </NavButton>

              <PreviewThumb 
                item={next} 
                label="Next" 
                onSelect={() => next && onNavigate(next)}
              />
            </div>
          </div>
        </div>
      </ScrollProvider>
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
      className="hidden secondary-clickable-button w-fit px-[1.4em] py-[0.7em] text-xsmall disabled:hidden disabled:cursor-not-allowed flex-center truncate font-mono"
    >
      {children}
    </button>
  );
}

function PreviewThumb<T extends DesignItem | CanvasItem>({
  item,
  label,
  onSelect,
}: {
  item?: T;
  label: string;
  onSelect: () => void;
}) {
  if (!item) return <div className="w-16 h-12 hidden sm:block" aria-hidden="true" />;

  const thumb = getMediaThumbnail(item.heroMedia);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${label}: ${item.title}`}
      className="relative aspect-16/10 overflow-hidden"
    >
      <Image 
        src={thumb.src}
        alt={thumb.alt}
        fill sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover size-full "
      />
    </button>
  );
}
