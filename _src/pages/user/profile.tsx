import { User as UserIcon } from "react-feather";
import { User } from "utils/types";

type Props = {
  user: User;
};

export function Profile({ user: { nickName, avatarUrl } }: Props) {
  return (
    <div className="flex items-center gap-8 mb-8">
      <div className="grid place-items-center w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        {avatarUrl === null ? (
          <UserIcon size={40} className="stroke-slate-500" />
        ) : (
          <img
            src={avatarUrl}
            alt="User avatar."
            loading="lazy"
            decoding="async"
            width={80}
            height={80}
            className="w-20 h-20"
          />
        )}
      </div>
      <span className="font-bold text-3xl">{nickName}</span>
    </div>
  );
}
