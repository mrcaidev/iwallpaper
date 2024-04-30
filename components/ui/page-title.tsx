import type { PropsWithChildren } from "react";

export function PageTitle({ children }: PropsWithChildren) {
  return <h1 className="my-8 font-bold text-3xl">{children}</h1>;
}
