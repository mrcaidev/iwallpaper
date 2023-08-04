import { PropsWithChildren } from "react";
import { Icon } from "react-feather";
import { Link } from "react-router-dom";

type Props = PropsWithChildren<{
  to: string;
  icon: Icon;
}>;

export function UserMenuLink({ to, icon: Icon, children }: Props) {
  return (
    <Link
      to={to}
      role="menuitem"
      className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-300 dark:hover:bg-slate-700 text-sm"
    >
      <Icon size={14} />
      {children}
    </Link>
  );
}
