import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getLocalStorage, setLocalStorage } from "utils/storage";

type State = {
  isDark: boolean;
  toggle: () => void;
};

const ThemeContext = createContext<State>({
  isDark: false,
  toggle: () => 0,
});

export function ThemeProvider({ children }: PropsWithChildren) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkUser = getLocalStorage<boolean>("dark");
    const isDarkOs = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkUser || (isDarkUser === null && isDarkOs));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggle = () => {
    setLocalStorage("dark", !isDark);
    setIsDark((isDark) => !isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
