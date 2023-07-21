import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="grid place-items-center min-h-screen px-8 py-4">
      <div className="space-y-3">
        <h1 className="font-bold text-3xl">Page not found</h1>
        <Link
          to="/"
          className="block text-center text-slate-600 dark:text-slate-400 hover:text-slate-800 hover:text-slate-200 transition-colors underline underline-offset-4"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
