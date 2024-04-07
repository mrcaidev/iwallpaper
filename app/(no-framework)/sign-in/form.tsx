"use client";

import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { useToast } from "components/ui/use-toast";
import Link from "next/link";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { signIn } from "./actions";
import { SignInButton } from "./button";

export function SignInForm() {
  const [error, action] = useFormState(signIn, "");
  const { toast } = useToast();

  useEffect(() => {
    if (!error) {
      return;
    }
    const { dismiss } = toast({ variant: "destructive", description: error });
    return dismiss;
  }, [error, toast]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          id="email"
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground underline"
          >
            Forgot your password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          required
          minLength={8}
          maxLength={20}
          id="password"
        />
      </div>
      <SignInButton />
    </form>
  );
}
