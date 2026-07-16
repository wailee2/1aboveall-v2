"use client";

/**
 * components/navigation/AppLink.tsx
 * ---------------------------------------------------------------
 * Drop-in replacement for next/link used anywhere internal
 * navigation happens. It fires the route-loading overlay before
 * handing off to the router. External links / anchors should keep
 * using a plain <a>, not this.
 */

import NextLink, { type LinkProps } from "next/link";
import { useNavigation } from "./NavigationProvider";

export function AppLink({
  children,
  onClick,
  ...props
}: LinkProps & {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  const { startNavigation } = useNavigation();

  return (
    <NextLink
      {...props}
      onClick={(e) => {
        startNavigation();
        onClick?.(e);
      }}
    >
      {children}
    </NextLink>
  );
}
