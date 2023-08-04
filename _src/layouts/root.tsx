import { ThemeProvider } from "contexts/theme";
import { UserProvider } from "contexts/user";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <UserProvider>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </UserProvider>
  );
}
