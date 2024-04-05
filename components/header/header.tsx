import { MobileSidebar } from "components/sidebar";
import { SearchBox } from "./search-box";
import { UserMenu } from "./user-menu";

export function Header() {
  return (
    <div className="flex items-center gap-4 w-full px-4 lg:px-6 py-2 lg:py-3 border-b bg-muted/40">
      <MobileSidebar />
      <div className="grow relative">
        <SearchBox />
      </div>
      <UserMenu />
    </div>
  );
}
