import { LogIn } from "react-feather";
import { Link } from "react-router-dom";

export function SignIn() {
  return (
    <Link
      to="/sign-in"
      className="flex items-center gap-2 px-4 py-2 rounded bg-slate-800 dark:bg-slate-200 font-medium text-slate-200 dark:text-slate-800 hover:opacity-85 transition-opacity"
    >
      <LogIn size={16} />
      Sign in
    </Link>
  );
}
