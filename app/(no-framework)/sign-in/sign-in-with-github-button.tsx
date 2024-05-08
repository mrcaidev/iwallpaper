"use client";

import { Button } from "components/ui/button";
import { useErrorToast } from "components/ui/use-toast";
import { GithubIcon } from "lucide-react";
import { useActionState } from "react";
import { signInWithGithub } from "./actions";

export function SignInWithGithubButton() {
  const [{ error }, dispatch, isPending] = useActionState(signInWithGithub, {
    error: "",
  });

  useErrorToast(error);

  return (
    <Button
      variant="outline"
      onClick={() => dispatch()}
      disabled={isPending}
      className="w-full"
    >
      <GithubIcon size={16} className="mr-2" />
      Continue with GitHub
    </Button>
  );
}
