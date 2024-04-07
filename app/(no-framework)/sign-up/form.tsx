"use client";

import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { useToast } from "components/ui/use-toast";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { signUp } from "./actions";
import { SignUpButton } from "./button";

export function SignUpForm() {
  const [error, action] = useFormState(signUp, "");
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
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          required
          minLength={8}
          maxLength={20}
          placeholder="8-20 characters"
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
          placeholder="Type your password again"
          id="confirmation"
        />
      </div>
      <SignUpButton />
    </form>
  );
}
