"use client";

import { Button } from "components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SignUpButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <LoaderIcon size={16} className="mr-2 animate-spin" />}
      {pending ? "Signing up..." : "Sign up"}
    </Button>
  );
}
