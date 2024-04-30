"use client";

import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { PasswordInput } from "components/ui/password-input";
import { useErrorToast } from "components/ui/use-toast";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "./actions";

export function SignInForm() {
  const [{ error }, dispatch, isPending] = useActionState(signIn, {
    error: "",
  });

  useErrorToast(error);

  return (
    <form action={dispatch} className="space-y-4">
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
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Forgot your password?
          </Link>
        </div>
        <PasswordInput
          name="password"
          required
          minLength={8}
          maxLength={20}
          id="password"
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <LoaderIcon size={16} className="mr-2 animate-spin" />}
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
