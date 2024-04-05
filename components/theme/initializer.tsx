export function ThemeInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          function getLocalStorage(key) {
            try {
              return localStorage.getItem(key);
            } catch {
              return null;
            }
          }

          const storedTheme = getLocalStorage("theme");
          const isDarkSystem = matchMedia("(prefers-color-scheme: dark)").matches;

          if (storedTheme === "dark" || (!storedTheme && isDarkSystem)) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        `,
      }}
    />
  );
}
