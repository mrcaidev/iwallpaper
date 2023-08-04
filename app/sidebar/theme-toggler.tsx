"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "react-feather";
import { getLocalStorage, setLocalStorage } from "utils/storage";

export function ThemeToggler() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(detectTheme());
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggle = () => {
    setLocalStorage("dark", !isDark);
    setIsDark((isDark) => !isDark);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-4 w-full p-3 lg:px-4 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 font-600 transition-colors"
    >
      {isDark ? (
        <>
          <Sun size={20} />
          <span className="sr-only lg:not-sr-only">Light mode</span>
        </>
      ) : (
        <>
          <Moon size={20} />
          <span className="sr-only lg:not-sr-only">Dark mode</span>
        </>
      )}
    </button>
  );
}

function detectTheme() {
  const isDarkUser = getLocalStorage<boolean>("dark");

  if (isDarkUser !== null) {
    return isDarkUser;
  }

  return matchMedia("(prefers-color-scheme: dark)").matches;
}
