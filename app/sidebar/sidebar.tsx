import { Logo } from "./logo";
import { Navigation } from "./navigation";
import { ThemeToggler } from "./theme-toggler";
import { User } from "./user";

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-4 fixed left-0 top-0 bottom-0 lg:w-xs px-3 lg:px-6 py-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 z-10">
      <Logo />
      <hr className="border-slate-200 dark:border-slate-800" />
      <Navigation />
      <hr className="border-slate-200 dark:border-slate-800" />
      <div className="space-y-2">
        <ThemeToggler />
        <User />
      </div>
    </aside>
  );
}
