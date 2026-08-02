"use client";

import { OverlayScrollbars } from "overlayscrollbars";
import "overlayscrollbars/overlayscrollbars.css";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    PropsWithChildren,
} from "react";

/**
 * components/ScrollProvider.tsx
 * ---------------------------------------------------------------
 * Same OverlayScrollbars setup as before, plus a lock/unlock pair
 * exposed via context — this is the actual fix for "the scrollbar
 * still shows/scrolls behind a modal." document.body.style.overflow
 * never worked here because this component doesn't use native
 * body scrolling at all; OverlayScrollbars manages its own internal
 * scroll viewport inside `rootRef`. Pausing IT specifically (via its
 * own `.options({ overflow: { x, y } })` API — the documented way to
 * change an instance's scroll behavior at runtime) is what actually
 * stops the page from scrolling while something like the image
 * lightbox is open. See components/ui/ImageLightbox.tsx for the
 * consumer side (useScrollLock()).
 */

interface ScrollLockContextValue {
    lock: () => void;
    unlock: () => void;
}

const ScrollLockContext = createContext<ScrollLockContextValue | null>(null);

export default function ScrollProvider({ children }: PropsWithChildren) {
    const rootRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<OverlayScrollbars | null>(null);

    useEffect(() => {
        if (!rootRef.current) return;

        instanceRef.current = OverlayScrollbars(rootRef.current, {
            scrollbars: {
                theme: "os-theme-custom",
                autoHide: "never",
                dragScroll: true,
                clickScroll: true,
            },
        });

        return () => {
            instanceRef.current?.destroy();
            instanceRef.current = null;
        };
    }, []);

    const lock = useCallback(() => {
        instanceRef.current?.options({ overflow: { x: "hidden", y: "hidden" } });
    }, []);

    const unlock = useCallback(() => {
        instanceRef.current?.options({ overflow: { x: "scroll", y: "scroll" } });
    }, []);

    return (
        <ScrollLockContext.Provider value={{ lock, unlock }}>
            <div
                ref={rootRef}
                style={{
                    height: "100vh",
                    width: "100%",
                }}
            >
                {children}
            </div>
        </ScrollLockContext.Provider>
    );
}

export function useScrollLock() {
    const ctx = useContext(ScrollLockContext);
    if (!ctx) {
        throw new Error("useScrollLock must be used within <ScrollProvider>");
    }
    return ctx;
}
