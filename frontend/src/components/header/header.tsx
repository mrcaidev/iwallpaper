import { UserMenu } from "components/user-menu";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";

export function Header() {
  return (
    <header className="flex items-center gap-8 fixed left-0 right-0 top-0 px-8 py-5 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur z-10">
      <div className="shrink-0">
        <Logo />
      </div>
      <SearchBar />
      <div className="grow" />
      <div className="shrink-0">
        <UserMenu />
      </div>
    </header>
  );
}
