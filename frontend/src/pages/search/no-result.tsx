import { Frown } from "react-feather";
import { Link } from "react-router-dom";

export function NoResult() {
  return (
    <div className="grid place-content-center place-items-center gap-1 min-h-screen p-8">
      <h1 className="flex items-center gap-2 font-bold text-lg">
        <Frown size={18} className="shrink-0" />
        We did not find any similar wallpaper
      </h1>
      <Link
        to="/"
        className="text-slate-600 dark:text-slate-400 hover:text-slate-800 hover:text-slate-200 transition-colors underline underline-offset-4"
      >
        Back to homepage
      </Link>
    </div>
  );
}
