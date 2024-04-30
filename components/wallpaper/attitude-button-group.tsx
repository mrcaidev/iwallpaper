"use client";

import { Button } from "components/ui/button";
import { useErrorToast } from "hooks/use-error-toast";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useActionState } from "react";
import { upsertAttitude } from "./actions";

type Props = {
  wallpaperId: string;
  initialAttitude: "liked" | "disliked" | null;
};

export function AttitudeButtonGroup({ wallpaperId, initialAttitude }: Props) {
  const [{ attitude, error }, dispatch, isPending] = useActionState(
    upsertAttitude.bind(null, wallpaperId),
    { attitude: initialAttitude, error: "" },
  );

  useErrorToast(error);

  return (
    <div className="shrink-0 space-x-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => dispatch("like")}
        disabled={isPending}
      >
        <ThumbsUpIcon
          size={16}
          className={attitude === "liked" ? "fill-current" : ""}
        />
        <span className="sr-only">
          {attitude === "liked" ? "Liked" : "Like"}
        </span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => dispatch("dislike")}
        disabled={isPending}
      >
        <ThumbsDownIcon
          size={16}
          className={attitude === "disliked" ? "fill-current" : ""}
        />
        <span className="sr-only">
          {attitude === "disliked" ? "Disliked" : "Dislike"}
        </span>
      </Button>
    </div>
  );
}
