import { useUser } from "contexts/user";
import { Heart, User as UserIcon } from "react-feather";
import { UserMenuLink } from "./link";
import { Separator } from "./separator";
import { SignOut } from "./sign-out";
import { ThemeToggler } from "./theme-toggler";

export function UserMenuBody() {
  const { id, email, nickName } = useUser()!;

  return (
    <div
      role="menu"
      className="w-max min-w-[240px] p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 origin-tr keyframes-menu motion-safe:animate-[menu_0.2s_cubic-bezier(0.24,0.22,0.015,1.56)]"
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
      <SignOut />
    </div>
  );
}
