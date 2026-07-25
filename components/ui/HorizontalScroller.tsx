"use client";

import React, { PropsWithChildren, ReactElement } from "react";

type HorizontalScrollerProps = PropsWithChildren<{
  className?: string;
  panelClassName?: string;
}>;

export function HorizontalContent({
  children,
}: PropsWithChildren<{ className?: string }>) {
  return <>{children}</>;
}

export default function HorizontalScroller({
  children,
  className = "h-screen",
  panelClassName = "h-screen w-screen",
}: HorizontalScrollerProps) {
  const childArray = React.Children.toArray(children);

  return (
    <section className={`relative w-full ${className}`}>
      <div
        className="relative h-full flex"
        style={{
          width: `${childArray.length * 100}vw`,
        }}
      >
        {childArray.map((child, i) => (
          <article
            key={i}
            className={`sticky top-0 left-0 overflow-hidden ${panelClassName}`}
            style={{
              zIndex: i + 1,
            }}
          >
            {child as ReactElement}
          </article>
        ))}
      </div>
    </section>
  );
}