"use client";

import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { useUser } from "./context";

export function AuthGuard({ children }: PropsWithChildren) {
  const user = useUser();

  if (!user) {
    redirect("/sign-in");
  }

  return children;
}

export function UnauthGuard({ children }: PropsWithChildren) {
  const user = useUser();

  if (user) {
    redirect("/");
  }

  return children;
}
