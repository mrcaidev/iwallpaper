import { Route } from "next";
import { ReactNode } from "react";
import { Aperture, Heart, Home, Search, Users } from "react-feather";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { ThemeToggler } from "./theme-toggler";
import { User } from "./user";

const navLinks: { href: Route; icon: ReactNode; text: string }[] = [
  { href: "/", icon: <Home size={20} />, text: "Home" },
  { href: "/search", icon: <Search size={20} />, text: "Search" },
  { href: "/favorites", icon: <Heart size={20} />, text: "Favorites" },
  { href: "/activities", icon: <Aperture size={20} />, text: "Activities" },
  { href: "/friends", icon: <Users size={20} />, text: "Friends" },
];

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-4 fixed left-0 top-0 bottom-0 lg:w-xs px-3 lg:px-6 py-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 z-10">
      <Logo />
      <hr className="border-slate-200 dark:border-slate-800" />
      <nav className="grow space-y-2">
        {navLinks.map(({ href, icon, text }) => (
          <NavLink key={href} href={href} icon={icon}>
            {text}
          </NavLink>
        ))}
      </nav>
      <hr className="border-slate-200 dark:border-slate-800" />
      <div className="space-y-2">
        <ThemeToggler />
        <User />
      </div>
    </aside>
  );
}
