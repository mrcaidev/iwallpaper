"use client";

import type { UserIdentity } from "@supabase/supabase-js";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { useErrorToast } from "components/ui/use-toast";
import { GithubIcon, LoaderIcon } from "lucide-react";
import { useActionState } from "react";
import { linkIdentities } from "./actions";

type Props = {
  initialIdentities: UserIdentity[];
};

export function LinkIdentitiesCard({ initialIdentities }: Props) {
  const [{ identities, error }, dispatch, isPending] = useActionState(
    linkIdentities,
    { identities: initialIdentities, error: "" },
  );

  useErrorToast(error);

  const githubIdentity = identities.find(
    (identity) => identity.provider === "github",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Third-party Services</CardTitle>
        <CardDescription>
          Connect your iWallpaper account to a third-party service to use it for
          signing in and sharing personal profiles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch("github")}
            disabled={isPending || !!githubIdentity}
          >
            {isPending ? (
              <>
                <LoaderIcon size={16} className="mr-2 animate-spin" /> :
                Connecting to GitHub...
              </>
            ) : !!githubIdentity ? (
              <>
                <GithubIcon size={16} className="mr-2" />
                Connected to GitHub
              </>
            ) : (
              <>
                <GithubIcon size={16} className="mr-2" />
                Connect to GitHub
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
