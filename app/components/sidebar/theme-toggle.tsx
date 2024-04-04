"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "theme/context";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-muted font-medium text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      <SunIcon size={16} className="dark:hidden" />
      <MoonIcon size={16} className="hidden dark:block" />
      Toggle theme
    </button>
  );
}
