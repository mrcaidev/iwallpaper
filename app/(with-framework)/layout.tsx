import { Header } from "components/header/header";
import { PcSidebar } from "components/sidebar";
import type { PropsWithChildren } from "react";

export default function WithFrameworkLayout({ children }: PropsWithChildren) {
  return (
    <>
      <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-56 lg:w-72">
        <PcSidebar />
      </aside>
      <header className="fixed left-0 md:left-56 lg:left-72 right-0 top-0">
        <Header />
      </header>
      <main className="grid min-h-screen pl-0 md:pl-56 lg:pl-72 pt-14 lg:pt-16">
        {children}
      </main>
    </>
  );
}
