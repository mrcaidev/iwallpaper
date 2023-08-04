import Link from "next/link";
import { LogIn } from "react-feather";

export function SignIn() {
  return (
    <Link
      href="/sign-in"
      className="flex items-center gap-4 p-3 lg:px-4 rounded-md bg-slate-800 dark:bg-slate-200 hover:bg-slate-700 dark:hover:bg-slate-300 font-600 text-slate-200 dark:text-slate-800 transition-colors"
    >
      <LogIn size={20} />
      <span className="sr-only lg:not-sr-only">Sign in</span>
    </Link>
  );
}
