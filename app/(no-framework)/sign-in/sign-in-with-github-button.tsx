"use client";

import { Button } from "components/ui/button";
import { useErrorToast } from "components/ui/use-toast";
import { GithubIcon } from "lucide-react";
import { useActionState } from "react";
import { createSupabaseBrowserClient } from "utils/supabase/browser";

async function signInWithGithub(_: unknown) {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: window.location.origin + "/api/auth/oauth",
    },
  });

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
