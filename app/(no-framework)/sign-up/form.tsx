"use client";

import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { AlertCircleIcon } from "lucide-react";
import { useFormState } from "react-dom";
import { signUp } from "./actions";
import { SignUpButton } from "./button";

export function SignUpForm() {
  const [error, action] = useFormState(signUp, "");

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
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          required
          minLength={8}
          maxLength={20}
          id="password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmation">Confirm password</Label>
        <Input
          type="password"
          name="confirmation"
          required
          minLength={8}
          maxLength={20}
          id="confirmation"
        />
      </div>
      <SignUpButton />
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
