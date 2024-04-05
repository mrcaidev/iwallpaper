import { Button } from "components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { SidebarContent } from "./content";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <MenuIcon size={20} />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}
