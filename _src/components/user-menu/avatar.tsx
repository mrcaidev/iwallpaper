import { useUser } from "contexts/user";
import { User } from "react-feather";

export function Avatar() {
  const { avatarUrl } = useUser()!;

  if (!avatarUrl) {
    return <User size={20} className="stroke-slate-500" />;
  }

  return (
    <img
      src={avatarUrl}
      alt="User avatar."
      width={40}
      height={40}
      loading="lazy"
      decoding="async"
      className="w-10 h-10"
    />
  );
}
