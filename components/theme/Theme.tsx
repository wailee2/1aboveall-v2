"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function Theme() {
    const { preference, setPreference } = useTheme();

    return (
        <div className=" ">
            <button
                type="button"
                onClick={() =>
                    setPreference(
                    preference === "light"
                        ? "dark"
                        : preference === "dark"
                        ? "system"
                        : "light"
                    )
                }
                className=" font-mono text-xs border border-border rounded-sm px-3 py-1.5 text-muted hover:text-accent hover:border-accent transition-colors"
                aria-label={`Theme: ${preference}. Click to change.`}
                >
                {preference}
            </button>
        </div>
    );
}
