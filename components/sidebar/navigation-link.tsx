"use client";

import { cn } from "components/ui/utils";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  href: Route;
  icon: ReactNode;
}>;

export function NavigationLink({ href, icon, children }: Props) {
  const isActive = useIsActive(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm hover:text-primary transition-colors",
        isActive ? "bg-muted text-primary" : "text-muted-foreground",
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

function useIsActive(href: Route) {
  const pathname = usePathname();

  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}
