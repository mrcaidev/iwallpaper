"use client";

import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { useToast } from "components/ui/use-toast";
import { LoaderIcon } from "lucide-react";
import { useActionState, useEffect } from "react";
import { signUp } from "./actions";

export function SignUpForm() {
  const [{ error }, action, isPending] = useActionState(signUp, { error: "" });
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({ variant: "destructive", description: error });
    }
  }, [error]);

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
        <Label htmlFor="confirm-password">Confirm password</Label>
        <Input
          type="password"
          name="confirm-password"
          required
          minLength={8}
          maxLength={20}
          placeholder="Type your password again"
          id="confirm-password"
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <LoaderIcon size={16} className="mr-2 animate-spin" />}
        {isPending ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  );
}
