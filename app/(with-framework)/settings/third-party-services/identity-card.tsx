"use client";

import type { Provider, UserIdentity } from "@supabase/supabase-js";
import { Button } from "components/ui/button";
import { useErrorToast } from "components/ui/use-toast";
import { GithubIcon, LinkIcon, LoaderIcon, UnlinkIcon } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { linkIdentity } from "./actions";

type Props = {
  provider: Provider;
  initialIdentity: UserIdentity | undefined;
};

export function IdentityCard({ provider, initialIdentity }: Props) {
  const [{ identity, error }, dispatch, isPending] = useActionState(
    (state) => linkIdentity(state, provider),
    { identity: initialIdentity, error: "" },
  );

  useErrorToast(error);

  return (
    <div className="flex justify-between items-center gap-4 px-6 py-5 border rounded-lg">
      {getConnectionRepresentation(provider, identity)}
      <div className="grow"></div>
      <p className="text-sm text-muted-foreground">
        {getConnectedSince(identity?.created_at)}
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={() => dispatch()}
        disabled={isPending}
      >
        {getButtonContent(isPending, identity)}
      </Button>
    </div>
  );
}

function getConnectionRepresentation(
  provider: Provider,
  identity: UserIdentity | undefined,
) {
  switch (provider) {
    case "github": {
      return <GithubConnectionRepresentation identity={identity} />;
    }
    default: {
      return <p className="font-semibold">Unknown</p>;
    }
  }
}

function getConnectedSince(createdAt: string | undefined) {
  if (!createdAt) {
    return "";
  }

  const date = new Date(createdAt);
  return `Connected since ${date.toLocaleDateString()}`;
}

function getButtonContent(
  isPending: boolean,
  identity: UserIdentity | undefined,
) {
  if (isPending && identity) {
    return (
      <>
        <LoaderIcon size={16} className="mr-2 animate-spin" />
        Disconnecting...
      </>
    );
  }

  if (isPending) {
    return (
      <>
        <LoaderIcon size={16} className="mr-2 animate-spin" />
        Connecting...
      </>
    );
  }

  if (identity) {
    return (
      <>
        <UnlinkIcon size={16} className="mr-2" />
        Disconnect
      </>
    );
  }

  return (
    <>
      <LinkIcon size={16} className="mr-2" />
      Connect
    </>
  );
}

type RepresentationProps = {
  identity: UserIdentity | undefined;
};

function GithubConnectionRepresentation({ identity }: RepresentationProps) {
  return (
    <div className="flex items-center gap-3">
      <GithubIcon size={24} />
      {identity ? (
        <div>
          <p className="font-semibold text-sm">GitHub</p>
          <p className="text-sm text-muted-foreground">
            {identity.identity_data?.full_name ?? ""}&nbsp;(
            <Link
              href={`https://github.com/${identity.identity_data?.user_name ?? ""}`}
              target="_blank"
              className="text-blue-600 dark:text-blue-500 hover:underline underline-offset-4"
            >
              @{identity.identity_data?.user_name ?? ""}
            </Link>
            )
          </p>
        </div>
      ) : (
        <p className="font-semibold">GitHub</p>
      )}
    </div>
  );
}
