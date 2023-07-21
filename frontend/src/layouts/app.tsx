import { Header } from "components/header";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
