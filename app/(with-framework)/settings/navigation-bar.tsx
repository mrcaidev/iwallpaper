"use client";

import { cn } from "components/ui/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { text: "Profile", href: "/settings/profile" },
  { text: "Account", href: "/settings/account" },
  { text: "Third Party Services", href: "/settings/third-party-services" },
] as const;

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <aside className="shrink-0">
      <nav className="flex flex-col gap-3 lg:min-w-64">
        {links.map(({ href, text }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "p-1 text-sm",
              href === pathname
                ? "font-semibold"
                : "text-muted-foreground hover:text-foreground transition-colors",
            )}
          >
            {text}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
