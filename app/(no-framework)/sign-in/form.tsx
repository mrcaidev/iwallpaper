"use client";

import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { signIn } from "./actions";
import { SignInButton } from "./button";

export function SignInForm() {
  const [error, action] = useFormState(signIn, "");

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
          <Link href="/forgot-password" className="text-sm underline">
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
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon size={16} />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
