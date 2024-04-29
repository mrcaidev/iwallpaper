"use client";

import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  return (
    <button type="button" onClick={toggleTheme} className="flex items-center">
      <SunIcon size={16} className="dark:hidden mr-2" />
      <MoonIcon size={16} className="hidden dark:block mr-2" />
      Toggle theme
    </button>
  );
}

function toggleTheme() {
  const isCurrentDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isCurrentDark ? "dark" : "light");
}
