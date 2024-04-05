import icon from "app/icon.svg";
import { HeartIcon, HomeIcon, SearchIcon } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { NavigationLink } from "./navigation-link";
import { ThemeToggle } from "./theme-toggle";

const navigationLinks: {
  href: Route;
  icon: ReactNode;
  text: string;
}[] = [
  {
    href: "/",
    icon: <HomeIcon size={16} />,
    text: "Home",
  },
  {
    href: "/search",
    icon: <SearchIcon size={16} />,
    text: "Search",
  },
  {
    href: "/favorites",
    icon: <HeartIcon size={16} />,
    text: "Favorites",
  },
];

export function SidebarContent() {
  return (
    <>
      <div className="p-2 lg:px-4 lg:py-3 md:border-b">
        <Link href="/" className="flex items-center gap-3 p-2">
          <Image src={icon} alt="" width={24} height={24} className="w-6 h-6" />
          <span className="font-semibold">iWallpaper</span>
        </Link>
      </div>
      <nav className="grow p-2 lg:px-4 lg:py-3">
        {navigationLinks.map(({ href, icon, text }) => (
          <NavigationLink key={href} href={href} icon={icon}>
            {text}
          </NavigationLink>
        ))}
      </nav>
      <div className="p-2 lg:px-4 lg:py-3 md:border-t">
        <ThemeToggle />
      </div>
    </>
  );
}
