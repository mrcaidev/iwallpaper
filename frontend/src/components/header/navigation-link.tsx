import clsx from "clsx";
import { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

type Props = PropsWithChildren<{
  to: string;
}>;

export function NavigationLink({ to, children }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "px-3 py-2 font-medium transition-colors",
          isActive ||
            "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200",
        )
      }
    >
      {children}
    </NavLink>
  );
}
