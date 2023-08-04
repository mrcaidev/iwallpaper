"use client";

import clsx from "clsx";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  href: Route;
  icon: ReactNode;
}>;

export function NavLink({ href, icon, children }: Props) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-4 p-3 lg:px-4 rounded-md font-600 transition-colors",
        isActive
          ? "bg-slate-800 dark:bg-slate-200 text-slate-200 dark:text-slate-800"
          : "hover:bg-slate-200 dark:hover:bg-slate-800",
      )}
    >
      {icon}
      <span className="sr-only lg:not-sr-only">{children}</span>
    </Link>
  );
}
