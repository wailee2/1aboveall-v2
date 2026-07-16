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
import { usePathname } from "next/navigation";

export function AppLink({
  children,
  onClick,
  href,
  ...props
}: LinkProps & {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  const { startNavigation } = useNavigation();
  const pathname = usePathname();

  const targetPath =
    typeof href === "string" ? href.split("?")[0].split("#")[0] : href.pathname ?? "";

  const isSameRoute = pathname === targetPath;

  return (
    <NextLink
      href={href}
      {...props}
      onClick={(e) => {
        if (!isSameRoute) {
          startNavigation();
        }
        onClick?.(e);
      }}
    >
      {children}
    </NextLink>
  );
}
