import type { PropsWithChildren } from "react";

export default function NoFrameworkLayout({ children }: PropsWithChildren) {
  return <main className="h-screen">{children}</main>;
}
