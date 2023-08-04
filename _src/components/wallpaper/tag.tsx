import { Link } from "react-router-dom";

type Props = {
  name: string;
};

export function Tag({ name }: Props) {
  return (
    <Link
      to={"/search?query=" + encodeURIComponent(name)}
      className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
    >
      #{name}
    </Link>
  );
}
