"use client";

import { Button } from "components/ui/button";
import { useErrorToast } from "components/ui/use-toast";
import { GithubIcon } from "lucide-react";
import { useActionState } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/browser";

async function signInWithGithub(_: unknown) {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.signInWithOAuth({ provider: "github" });

  if (error) {
    return { error: error.message };
  }

  return { error: "" };
}

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
