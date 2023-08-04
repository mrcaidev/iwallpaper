import { useTheme } from "contexts/theme";
import { Moon, Sun } from "react-feather";

export function ThemeToggler() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      role="menuitem"
      className="flex items-center gap-3 w-full px-4 py-2 rounded hover:bg-slate-300 dark:hover:bg-slate-700 text-sm"
    >
      {isDark ? (
        <>
          <Sun size={14} />
          Light mode
        </>
      ) : (
        <>
          <Moon size={14} />
          Dark mode
        </>
      )}
    </button>
  );
}
