"use client";

import { OverlayScrollbars } from "overlayscrollbars";
import "overlayscrollbars/overlayscrollbars.css";

import {
    useEffect,
    useRef,
    PropsWithChildren,
} from "react";

export default function ScrollProvider({
    children,
}: PropsWithChildren) {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!rootRef.current) return;

        const os = OverlayScrollbars(rootRef.current, {
            scrollbars: {
                theme: "os-theme-custom",
                autoHide: "never",
                dragScroll: true,
                clickScroll: true,
            },
        });

        return () => os.destroy();
    }, []);

    return (
        <div
            ref={rootRef}
            style={{
                height: "100vh",
                width: "100%",
            }}
        >
            {children}
        </div>
    );
}