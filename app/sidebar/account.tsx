import Image from "next/image";
import Link from "next/link";
import { User as UserIcon } from "react-feather";
import { User } from "utils/types";

type Props = {
  user: User;
};

export function Account({ user: { id, email, nickName, avatarUrl } }: Props) {
  return (
    <div className="flex items-center gap-4 relative lg:px-4 lg:py-3 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
      <div className="grid place-items-center w-10 h-10 rounded-full bg-slate-500 overflow-hidden">
        {avatarUrl ? (
          <Image src={avatarUrl} alt="User avatar." width={40} height={40} />
        ) : (
          <UserIcon size={20} className="stroke-slate-200" />
        )}
      </div>
      <div className="self-stretch flex flex-col justify-evenly sr-only lg:not-sr-only">
        <span className="font-600">{nickName ?? `User ${id.slice(0, 6)}`}</span>
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {email}
        </span>
      </div>
      <Link href="/account" className="absolute left-0 right-0 top-0 bottom-0">
        <span className="sr-only">Go to account settings</span>
      </Link>
    </div>
  );
}
