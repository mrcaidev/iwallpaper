import { Header } from "components/header/header";
import type { PropsWithChildren } from "react";

export default function WithFrameworkLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="container min-h-screen pt-24">{children}</main>
    </>
  );
}
