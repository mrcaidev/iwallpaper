import { useUser } from "contexts/user";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export function AuthGuard({ children }: PropsWithChildren) {
  const user = useUser();

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  return children;
}

export function UnauthGuard({ children }: PropsWithChildren) {
  const user = useUser();

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
}
