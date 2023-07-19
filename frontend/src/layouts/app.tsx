import { Header } from "components/header";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <>
      <Header />
      <main className="mt-20 px-8 py-4">
        <Outlet />
      </main>
    </>
  );
}
