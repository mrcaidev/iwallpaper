import { Heart, User as UserIcon } from "react-feather";
import { User } from "utils/types";
import { UserMenuLink } from "./link";
import { Separator } from "./separator";
import { SignOutButton } from "./sign-out-button";
import { ThemeToggler } from "./theme-toggler";

type Props = {
  user: User;
};

export function UserMenuBody({ user: { id, email, nickName } }: Props) {
  return (
    <div
      role="menu"
      className="w-max min-w-[240px] p-2 rounded-md ring ring-slate-300 dark:ring-slate-700 bg-slate-200 dark:bg-slate-800 origin-tr keyframes-menu motion-safe:animate-[menu_0.2s_cubic-bezier(0.24,0.22,0.015,1.56)]"
    >
      <div className="space-y-1 px-4 py-2">
        <p className="font-bold text-lg">
          {nickName ? nickName : "User " + id.slice(0, 6)}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">{email}</p>
      </div>
      <Separator />
      <UserMenuLink to="/me" icon={UserIcon}>
        Account
      </UserMenuLink>
      <UserMenuLink to="/like" icon={Heart}>
        Likes
      </UserMenuLink>
      <Separator />
      <ThemeToggler />
      <SignOutButton />
    </div>
  );
}
