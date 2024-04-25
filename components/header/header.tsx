import { Logo } from "./logo";
import { SearchBox } from "./search-box";
import { UserMenu } from "./user-menu";

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-10 py-4 border-b bg-muted/40 backdrop-blur">
      <div className="container flex items-center gap-4">
        <div className="shrink-0">
          <Logo />
        </div>
        <div className="grow">
          <SearchBox />
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
