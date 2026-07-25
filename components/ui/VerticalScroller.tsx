"use client";

import React, { PropsWithChildren, ReactElement } from "react";

type VerticalScrollerProps = PropsWithChildren<{
  className?: string;
  panelClassName?: string;
}>;

export function VerticalContent({
  children,
}: PropsWithChildren<{ className?: string }>) {
  return <>{children}</>;
}

export default function VerticalScroller({
  children,
  className = "h-screen",
  panelClassName = "h-screen ",
}: VerticalScrollerProps) {
  const childArray = React.Children.toArray(children);

  return (
    <section className={`relative w-full ${className}`}>
      <div
        className="relative w-full"
        style={{
          height: `${childArray.length * 100}vh`,
        }}
      >
        {childArray.map((child, i) => (
          <article
            key={i}
            className={`sticky top-0 w-full overflow-hidden ${panelClassName}`}
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

/**<VerticalScroller
       className=""
        panelClassName=""
      >
        <VerticalContent>
          <div className="relative h-full w-full">
            <img
              src="/placeholder-image.png"
              alt="project 1"
              className="h-full w-full object-cover"
            />
            <p className="absolute left-4 bottom-4 text-white text-lg font-bold">
              hey this is project1
            </p>
          </div>
        </VerticalContent>

        <VerticalContent>
          <div className="relative h-full w-full">
            <img
              src="/placeholder-image.png"
              alt="project 2"
              className="h-full w-full object-cover"
            />
            <p className="absolute left-4 bottom-4 text-white text-lg font-bold">
              hey this is project2
            </p>
          </div>
        </VerticalContent>

        <VerticalContent>
          <div className="relative h-full w-full">
            <img
              src="/placeholder-image.png"
              alt="project 3"
              className="h-full w-full object-cover"
            />
            <p className="absolute left-4 bottom-4 text-white text-lg font-bold">
              hey this is project3
            </p>
          </div>
        </VerticalContent>
      </VerticalScroller> */