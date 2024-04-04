import { SidebarContent } from "./content";

export function PcSidebar() {
  return (
    <aside className="flex flex-col h-full border-r bg-muted/40">
      <SidebarContent />
    </aside>
  );
}
