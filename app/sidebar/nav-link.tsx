"use client";

import clsx from "clsx";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  href: Route;
  icon: ReactNode;
  activeIcon: ReactNode;
}>;

export function NavLink({ href, icon, activeIcon, children }: Props) {
  const isActive = useIsActive(href);

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-4 p-3 lg:px-4 rounded-md transition-colors",
        isActive
          ? "bg-slate-200 dark:bg-slate-800 font-800"
          : "hover:bg-slate-200 dark:hover:bg-slate-800 font-600",
      )}
    >
      {isActive ? activeIcon : icon}
      <span className="sr-only lg:not-sr-only">{children}</span>
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
