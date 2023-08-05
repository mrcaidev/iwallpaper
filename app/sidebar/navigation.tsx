import { Route } from "next";
import { ReactNode } from "react";
import { FiAperture, FiHeart, FiHome, FiSearch, FiUsers } from "react-icons/fi";
import { NavLink } from "./nav-link";

const navLinks: {
  href: Route;
  icon: ReactNode;
  activeIcon: ReactNode;
  text: string;
}[] = [
  {
    href: "/",
    icon: <FiHome size={20} />,
    activeIcon: <FiHome size={20} className="stroke-3" />,
    text: "Home",
  },
  {
    href: "/search",
    icon: <FiSearch size={20} />,
    activeIcon: <FiSearch size={20} className="stroke-3" />,
    text: "Search",
  },
  {
    href: "/favorites",
    icon: <FiHeart size={20} />,
    activeIcon: <FiHeart size={20} className="fill-slate-200" />,
    text: "Favorites",
  },
  {
    href: "/activities",
    icon: <FiAperture size={20} />,
    activeIcon: <FiAperture size={20} className="stroke-3" />,
    text: "Activities",
  },
  {
    href: "/friends",
    icon: <FiUsers size={20} />,
    activeIcon: <FiUsers size={20} className="fill-slate-200" />,
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
