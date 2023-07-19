import { User } from "react-feather";

type Props = {
  url: string;
};

export function Avatar({ url }: Props) {
  if (!url) {
    return (
      <User size={20} className="stroke-slate-600 dark:stroke-slate-400" />
    );
  }

  return (
    <img
      src={url}
      alt="User avatar."
      width={40}
      height={40}
      className="w-10 h-10"
    />
  );
}
