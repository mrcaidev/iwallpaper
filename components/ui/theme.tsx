export function ThemeInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          const storedTheme = localStorage.getItem("theme");
          const isDarkSystem = matchMedia("(prefers-color-scheme: dark)").matches;
          if (storedTheme === "dark" || (!storedTheme && isDarkSystem)) {
            document.documentElement.classList.add("dark");
          }
        `,
      }}
    />
  );
}
