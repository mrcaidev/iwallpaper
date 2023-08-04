"use client";

import { useUser } from "auth/context";
import { Account } from "./account";
import { SignIn } from "./sign-in";

export function User() {
  const user = useUser();

  if (!user) {
    return <SignIn />;
  }

  return <Account user={user} />;
}
