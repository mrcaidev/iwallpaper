import { Route } from "next";
import { ReactNode } from "react";
import { Aperture, Heart, Home, Search, Users } from "react-feather";
import { NavLink } from "./nav-link";

const navLinks: {
  href: Route;
  icon: ReactNode;
  activeIcon: ReactNode;
  text: string;
}[] = [
  {
    href: "/",
    icon: <Home size={20} />,
    activeIcon: <Home size={20} className="stroke-3" />,
    text: "Home",
  },
  {
    href: "/search",
    icon: <Search size={20} />,
    activeIcon: <Search size={20} className="stroke-3" />,
    text: "Search",
  },
  {
    href: "/favorites",
    icon: <Heart size={20} />,
    activeIcon: <Heart size={20} className="fill-slate-200" />,
    text: "Favorites",
  },
  {
    href: "/activities",
    icon: <Aperture size={20} />,
    activeIcon: <Aperture size={20} className="stroke-3" />,
    text: "Activities",
  },
  {
    href: "/friends",
    icon: <Users size={20} />,
    activeIcon: <Users size={20} className="fill-slate-200" />,
    text: "Friends",
  },
];

export function Navigation() {
  return (
    <nav className="grow space-y-2">
      {navLinks.map(({ href, icon, activeIcon, text }) => (
        <NavLink key={href} href={href} icon={icon} activeIcon={activeIcon}>
          {text}
        </NavLink>
      ))}
    </nav>
  );
}
