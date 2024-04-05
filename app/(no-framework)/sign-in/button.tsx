"use client";

import { Button } from "components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <LoaderIcon size={16} className="mr-2 animate-spin" />}
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}
