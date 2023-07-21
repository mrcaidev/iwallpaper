import { Link } from "react-router-dom";

export function Page() {
  return (
    <div className="grid place-content-center place-items-center gap-3 min-h-screen p-8">
      <h1 className="font-bold text-3xl">Page not found</h1>
      <Link
        to="/"
        className="text-slate-600 dark:text-slate-400 hover:text-slate-800 hover:text-slate-200 transition-colors underline underline-offset-4"
      >
        Back to homepage
      </Link>
    </div>
  );
}
